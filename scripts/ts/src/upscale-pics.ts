import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import sharp from 'sharp'
import { picsMap } from '@apps/ferupis-qwik/pics'

type UpscalingFlag = 'GREEN' | 'YELLOW' | 'RED'
type PipelineStatus = 'PLANNED' | 'PROCESSED' | 'SKIPPED' | 'FAILED'

interface CliOptions {
  flag: UpscalingFlag
  ids: string[]
  approveYellow: boolean
  dryRun: boolean
  keepTemp: boolean
  overwrite: boolean
  binary?: string
  modelsDir?: string
  model: string
  gpu: string
}

interface PipelineResult {
  id: string
  flag: UpscalingFlag
  sourcePath: string
  outputPath: string
  sourceWidth?: number
  sourceHeight?: number
  sourceLongEdge?: number
  targetLongEdge?: number
  effectiveScale?: number
  status: PipelineStatus
  error?: string
}

const TARGET_LONG_EDGE = 1024
const MAX_EFFECTIVE_UPSCALE = 3
const MODEL_SCALE = 4
const DEFAULT_MODEL = 'realesrgan-x4plus'
const DEFAULT_GPU = '0'
const APP_ROOT = resolve('apps/ferupis-qwik')
const OUTPUT_ROOT = resolve(APP_ROOT, 'src/media/pics/restored')
const TMP_ROOT = resolve('.tmp/upscale')

function printHelp(): void {
  console.log(`
Ferupis media upscaling pipeline

Usage:
  npm run script:pics:upscale -- [options]

Selection:
  --flag <GREEN|YELLOW>      Select all assets with the given flag (default: GREEN)
  --ids <id1,id2,...>        Process only the listed ids; overrides --flag selection

Policy gates:
  --approve-yellow           Required to process explicitly selected YELLOW ids
  RED assets are always blocked and cannot be forced

Execution:
  --dry-run                  Resolve assets and dimensions without invoking Real-ESRGAN
  --keep-temp                Keep normalized and raw x4 intermediates under .tmp/upscale
  --overwrite                Replace an existing restored master
  --binary <path>            Real-ESRGAN executable path
  --models-dir <path>        Directory containing NCNN .param/.bin models
  --model <name>             Model name (default: ${DEFAULT_MODEL})
  --gpu <id>                 GPU id (default: ${DEFAULT_GPU})
  --help                     Show this help

Environment variables:
  REALESRGAN_BIN
  REALESRGAN_MODELS
  REALESRGAN_GPU

Policy:
  GREEN  automatic, target 1024px long edge, hard limit <= ${MAX_EFFECTIVE_UPSCALE}x effective upscale
  YELLOW dry-run may inspect the group; processing requires explicit --ids plus --approve-yellow
         target capped at source x ${MAX_EFFECTIVE_UPSCALE} and never above 1024px
  RED    hard block
`)
}

function readArgValue(args: string[], index: number, name: string): { value: string; nextIndex: number } {
  const arg = args[index]
  const prefix = `${name}=`

  if (arg.startsWith(prefix)) {
    return { value: arg.slice(prefix.length), nextIndex: index }
  }

  const value = args[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${name}`)
  }

  return { value, nextIndex: index + 1 }
}

function parseFlag(value: string): UpscalingFlag {
  const normalized = value.toUpperCase()
  if (normalized !== 'GREEN' && normalized !== 'YELLOW' && normalized !== 'RED') {
    throw new Error(`Unsupported flag: ${value}`)
  }
  return normalized
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const options: CliOptions = {
    flag: 'GREEN',
    ids: [],
    approveYellow: false,
    dryRun: false,
    keepTemp: false,
    overwrite: false,
    model: DEFAULT_MODEL,
    gpu: process.env.REALESRGAN_GPU ?? DEFAULT_GPU,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }

    if (arg === '--approve-yellow') {
      options.approveYellow = true
      continue
    }

    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }

    if (arg === '--keep-temp') {
      options.keepTemp = true
      continue
    }

    if (arg === '--overwrite') {
      options.overwrite = true
      continue
    }

    if (arg === '--flag' || arg.startsWith('--flag=')) {
      const { value, nextIndex } = readArgValue(args, i, '--flag')
      options.flag = parseFlag(value)
      i = nextIndex
      continue
    }

    if (arg === '--ids' || arg.startsWith('--ids=')) {
      const { value, nextIndex } = readArgValue(args, i, '--ids')
      options.ids = value.split(',').map((id) => id.trim()).filter(Boolean)
      i = nextIndex
      continue
    }

    if (arg === '--binary' || arg.startsWith('--binary=')) {
      const { value, nextIndex } = readArgValue(args, i, '--binary')
      options.binary = value
      i = nextIndex
      continue
    }

    if (arg === '--models-dir' || arg.startsWith('--models-dir=')) {
      const { value, nextIndex } = readArgValue(args, i, '--models-dir')
      options.modelsDir = value
      i = nextIndex
      continue
    }

    if (arg === '--model' || arg.startsWith('--model=')) {
      const { value, nextIndex } = readArgValue(args, i, '--model')
      options.model = value
      i = nextIndex
      continue
    }

    if (arg === '--gpu' || arg.startsWith('--gpu=')) {
      const { value, nextIndex } = readArgValue(args, i, '--gpu')
      options.gpu = value
      i = nextIndex
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function resolveBinary(options: CliOptions): string {
  if (options.binary) return options.binary
  if (process.env.REALESRGAN_BIN) return process.env.REALESRGAN_BIN

  if (process.platform === 'win32') {
    return String.raw`C:\tools\realesrgan\realesrgan-ncnn-vulkan.exe`
  }

  return 'realesrgan-ncnn-vulkan'
}

function resolveModelsDir(options: CliOptions, binary: string): string | undefined {
  if (options.modelsDir) return resolve(options.modelsDir)
  if (process.env.REALESRGAN_MODELS) return resolve(process.env.REALESRGAN_MODELS)

  if (process.platform === 'win32' || isAbsolute(binary)) {
    return join(dirname(binary), 'models')
  }

  return undefined
}

function isPathLike(command: string): boolean {
  return isAbsolute(command) || command.includes('/') || command.includes('\\')
}

function preflightRuntime(binary: string, modelsDir: string | undefined, model: string): void {
  if (isPathLike(binary) && !existsSync(binary)) {
    throw new Error(`Real-ESRGAN executable not found: ${binary}`)
  }

  if (!modelsDir) return

  if (!existsSync(modelsDir)) {
    throw new Error(`Real-ESRGAN models directory not found: ${modelsDir}`)
  }

  const paramPath = join(modelsDir, `${model}.param`)
  const binPath = join(modelsDir, `${model}.bin`)

  if (!existsSync(paramPath) || !existsSync(binPath)) {
    throw new Error(
      `NCNN model incomplete for ${model}. Expected both:\n- ${paramPath}\n- ${binPath}`,
    )
  }
}

function sourcePathFromMappedPath(mappedPath: string): string {
  if (!mappedPath.startsWith('~/')) {
    throw new Error(`Unsupported mapped media path: ${mappedPath}`)
  }

  return resolve(APP_ROOT, mappedPath.slice(2))
}

function selectAssets(options: CliOptions) {
  if (options.flag === 'RED' && options.ids.length === 0) {
    throw new Error('RED is a hard-block policy and cannot be selected for upscaling')
  }

  if (options.ids.length > 0) {
    const requestedIds = new Set(options.ids)
    const selected = picsMap.filter((entry) => requestedIds.has(entry.originals.id))
    const foundIds = new Set(selected.map((entry) => entry.originals.id))
    const missingIds = options.ids.filter((id) => !foundIds.has(id))

    if (missingIds.length > 0) {
      throw new Error(`Unknown image ids: ${missingIds.join(', ')}`)
    }

    return selected
  }

  return picsMap.filter((entry) => entry.originals.upscalingFlag === options.flag)
}

function assertSelectionPolicy(selected: ReturnType<typeof selectAssets>, options: CliOptions): void {
  const redIds = selected
    .filter((entry) => entry.originals.upscalingFlag === 'RED')
    .map((entry) => entry.originals.id)

  if (redIds.length > 0) {
    throw new Error(`RED assets are hard-blocked: ${redIds.join(', ')}`)
  }

  const yellowIds = selected
    .filter((entry) => entry.originals.upscalingFlag === 'YELLOW')
    .map((entry) => entry.originals.id)

  if (yellowIds.length === 0 || options.dryRun) return

  if (options.ids.length === 0) {
    throw new Error('YELLOW processing requires explicit --ids; batch approval by flag is not allowed')
  }

  if (!options.approveYellow) {
    throw new Error(
      `YELLOW assets require explicit --approve-yellow: ${yellowIds.join(', ')}`,
    )
  }
}

function computeTargetLongEdge(flag: UpscalingFlag, sourceLongEdge: number): number {
  if (flag === 'GREEN') {
    const requiredScale = TARGET_LONG_EDGE / sourceLongEdge
    if (requiredScale > MAX_EFFECTIVE_UPSCALE) {
      throw new Error(
        `GREEN invariant violated: ${sourceLongEdge}px -> ${TARGET_LONG_EDGE}px requires ${requiredScale.toFixed(2)}x (> ${MAX_EFFECTIVE_UPSCALE}x)`,
      )
    }
    return TARGET_LONG_EDGE
  }

  return Math.min(TARGET_LONG_EDGE, Math.floor(sourceLongEdge * MAX_EFFECTIVE_UPSCALE))
}

function runRealEsrgan(
  binary: string,
  modelsDir: string | undefined,
  model: string,
  gpu: string,
  inputPath: string,
  outputPath: string,
): void {
  const args = [
    '-i', inputPath,
    '-o', outputPath,
    '-n', model,
    '-s', String(MODEL_SCALE),
    '-g', gpu,
    '-f', 'png',
  ]

  if (modelsDir) {
    args.push('-m', modelsDir)
  }

  const result = spawnSync(binary, args, { stdio: 'inherit' })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(`Real-ESRGAN exited with code ${result.status ?? 'unknown'}`)
  }
}

async function processAsset(
  entry: (typeof picsMap)[number],
  options: CliOptions,
  binary: string,
  modelsDir: string | undefined,
): Promise<PipelineResult> {
  const { id, path: mappedPath, upscalingFlag } = entry.originals
  const flag = upscalingFlag as UpscalingFlag
  const sourcePath = sourcePathFromMappedPath(mappedPath)
  const outputPath = resolve(OUTPUT_ROOT, `${id}.png`)

  if (!existsSync(sourcePath)) {
    throw new Error(`Source image not found: ${sourcePath}`)
  }

  const metadata = await sharp(sourcePath).metadata()
  const sourceWidth = metadata.width
  const sourceHeight = metadata.height

  if (!sourceWidth || !sourceHeight) {
    throw new Error(`Unable to read dimensions for ${sourcePath}`)
  }

  const sourceLongEdge = Math.max(sourceWidth, sourceHeight)
  const targetLongEdge = computeTargetLongEdge(flag, sourceLongEdge)
  const effectiveScale = targetLongEdge / sourceLongEdge

  const result: PipelineResult = {
    id,
    flag,
    sourcePath,
    outputPath,
    sourceWidth,
    sourceHeight,
    sourceLongEdge,
    targetLongEdge,
    effectiveScale,
    status: options.dryRun ? 'PLANNED' : 'PROCESSED',
  }

  console.log(
    `[${flag}] ${id}: ${sourceWidth}x${sourceHeight} -> long edge ${targetLongEdge}px (${effectiveScale.toFixed(2)}x effective)`,
  )

  if (options.dryRun) return result

  if (existsSync(outputPath) && !options.overwrite) {
    console.log(`[${flag}] ${id}: SKIPPED - restored master already exists (use --overwrite to replace)`)
    return { ...result, status: 'SKIPPED' }
  }

  mkdirSync(OUTPUT_ROOT, { recursive: true })

  const assetTmpDir = resolve(TMP_ROOT, 'work', id)
  mkdirSync(assetTmpDir, { recursive: true })

  const normalizedPath = resolve(assetTmpDir, 'normalized.png')
  const rawUpscaledPath = resolve(assetTmpDir, 'realesrgan-x4.png')

  await sharp(sourcePath)
    .rotate()
    .png({ compressionLevel: 6 })
    .toFile(normalizedPath)

  let finalInputPath = normalizedPath

  if (sourceLongEdge < targetLongEdge) {
    runRealEsrgan(
      binary,
      modelsDir,
      options.model,
      options.gpu,
      normalizedPath,
      rawUpscaledPath,
    )
    finalInputPath = rawUpscaledPath
  }

  await sharp(finalInputPath)
    .resize({
      width: targetLongEdge,
      height: targetLongEdge,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  if (!options.keepTemp) {
    rmSync(assetTmpDir, { recursive: true, force: true })
  }

  return result
}

function writeReport(options: CliOptions, results: PipelineResult[]): string {
  const reportsDir = resolve(TMP_ROOT, 'reports')
  mkdirSync(reportsDir, { recursive: true })

  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
  const reportPath = resolve(reportsDir, `${timestamp}.json`)

  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        policy: {
          targetLongEdge: TARGET_LONG_EDGE,
          maxEffectiveUpscale: MAX_EFFECTIVE_UPSCALE,
          red: 'BLOCKED',
          yellow: 'EXPLICIT_IDS_AND_APPROVAL_REQUIRED',
          green: 'AUTOMATIC',
        },
        execution: {
          dryRun: options.dryRun,
          model: options.model,
          gpu: options.gpu,
          overwrite: options.overwrite,
        },
        results,
      },
      null,
      2,
    ),
  )

  return reportPath
}

function printSummary(results: PipelineResult[]): void {
  const counts = results.reduce<Record<PipelineStatus, number>>(
    (acc, result) => {
      acc[result.status] += 1
      return acc
    },
    { PLANNED: 0, PROCESSED: 0, SKIPPED: 0, FAILED: 0 },
  )

  console.log(`Planned: ${counts.PLANNED}`)
  console.log(`Processed: ${counts.PROCESSED}`)
  console.log(`Skipped: ${counts.SKIPPED}`)
  console.log(`Failed: ${counts.FAILED}`)
}

async function main(): Promise<void> {
  const options = parseArgs()
  const selected = selectAssets(options)

  if (selected.length === 0) {
    throw new Error('No assets matched the requested selection')
  }

  assertSelectionPolicy(selected, options)

  const binary = resolveBinary(options)
  const modelsDir = resolveModelsDir(options, binary)

  if (!options.dryRun) {
    preflightRuntime(binary, modelsDir, options.model)
  }

  console.log(`Selected assets: ${selected.length}`)
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'PROCESS'}`)
  if (!options.dryRun) {
    console.log(`Real-ESRGAN: ${binary}`)
    console.log(`Model: ${options.model}`)
    console.log(`Models dir: ${modelsDir ?? '(Real-ESRGAN default)'}`)
  }
  console.log('')

  const results: PipelineResult[] = []

  for (const entry of selected) {
    try {
      results.push(await processAsset(entry, options, binary, modelsDir))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const { id, upscalingFlag } = entry.originals
      const sourcePath = sourcePathFromMappedPath(entry.originals.path)
      const outputPath = resolve(OUTPUT_ROOT, `${id}.png`)

      console.error(`[${upscalingFlag}] ${id}: FAILED - ${message}`)
      results.push({
        id,
        flag: upscalingFlag as UpscalingFlag,
        sourcePath,
        outputPath,
        status: 'FAILED',
        error: message,
      })
    }
  }

  const reportPath = writeReport(options, results)

  console.log(`\nReport: ${reportPath}`)
  printSummary(results)

  if (results.some((result) => result.status === 'FAILED')) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
