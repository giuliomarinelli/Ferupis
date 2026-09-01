import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'

const APP_ROOT = resolve('apps/ferupis-qwik')
const LEGACY_ROOT = resolve('apps/ferupis-old')
const INDEX_PATH = resolve(APP_ROOT, 'src/media/pics/index.ts')
const RESTORED_ROOT = resolve(APP_ROOT, 'src/media/pics/restored')
const DRY_RUN = process.argv.includes('--dry-run')

const ENTRY_PATTERN = /(^  \{\r?\n[\s\S]*?^  \},)/gm

function fail(message) {
  throw new Error(message)
}

function getQuoted(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*"([^"]*)"`))
  if (!match) fail(`Unable to parse ${field} from originals block`)
  return match[1]
}

function getRawTemplate(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*String\\.raw\`([^\`]*)\``))
  if (!match) fail(`Unable to parse ${field} from originals block`)
  return match[1]
}

function parseEntry(block) {
  return {
    id: getQuoted(block, 'id'),
    originalsPath: getQuoted(block, 'originalsPath'),
    oldPath: getQuoted(block, 'oldPath'),
    oldWinPath: getRawTemplate(block, 'oldWinPath'),
    keyname: getQuoted(block, 'keyname'),
    originalsMimeType: getQuoted(block, 'originalsMimeType'),
    restoredMimeType: getQuoted(block, 'restoredMimeType'),
    upscalingFlag: getQuoted(block, 'upscalingFlag'),
  }
}

function sourcePathFromMappedPath(mappedPath) {
  if (!mappedPath.startsWith('~/')) {
    fail(`Unsupported mapped media path: ${mappedPath}`)
  }
  return resolve(APP_ROOT, 'src', mappedPath.slice(2))
}

function legacyPathFromOldPath(oldPath) {
  const relativeLegacyPath = oldPath.replace(/^[/\\]+/, '')
  return resolve(LEGACY_ROOT, relativeLegacyPath)
}

function resolveOriginalSource(original) {
  const mappedSourcePath = sourcePathFromMappedPath(original.originalsPath)
  if (existsSync(mappedSourcePath)) {
    return mappedSourcePath
  }

  const legacySourcePath = legacyPathFromOldPath(original.oldPath)
  if (existsSync(legacySourcePath)) {
    return legacySourcePath
  }

  fail(
    `Original source not found for ${original.id}. Checked:\n- ${mappedSourcePath}\n- ${legacySourcePath}`,
  )
}

function buildRestoredFilesIndex() {
  mkdirSync(RESTORED_ROOT, { recursive: true })
  const byId = new Map()

  for (const entry of readdirSync(RESTORED_ROOT, { withFileTypes: true })) {
    if (!entry.isFile()) continue
    if (entry.name === '.gitkeep') continue
    const extension = extname(entry.name)
    if (!extension) continue
    const id = basename(entry.name, extension)

    if (byId.has(id)) {
      fail(`Multiple restored files found for ${id}: ${byId.get(id)} and ${entry.name}`)
    }

    byId.set(id, entry.name)
  }

  return byId
}

function mimeTypeFor(filename, fallback) {
  switch (extname(filename).toLowerCase()) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.gif': return 'image/gif'
    case '.webp': return 'image/webp'
    case '.avif': return 'image/avif'
    case '.svg': return 'image/svg+xml'
    default: return fallback
  }
}

function replaceQuoted(block, field, value) {
  const pattern = new RegExp(`(^    ${field}:\\s*)"[^"]*"`, 'm')
  if (!pattern.test(block)) fail(`Unable to update ${field} in picsMap entry`)
  return block.replace(pattern, `$1${JSON.stringify(value)}`)
}

function renderRestored(original, restoredFilename) {
  const restoredPath = `~/media/pics/restored/${restoredFilename}`
  const restoredMimeType = mimeTypeFor(restoredFilename, original.originalsMimeType)
  return { restoredPath, restoredMimeType }
}

function main() {
  if (!existsSync(INDEX_PATH)) fail(`picsMap not found: ${INDEX_PATH}`)

  const source = readFileSync(INDEX_PATH, 'utf8')
  const expectedEntries = [...source.matchAll(/^    id:\s*"/gm)].length
  if (expectedEntries === 0) fail('No picsMap originals entries found')

  const restoredById = buildRestoredFilesIndex()
  const knownIds = new Set()
  let copied = 0
  let alreadyRestored = 0
  let mapped = 0

  const nextSource = source.replace(ENTRY_PATTERN, (full) => {
    const original = parseEntry(full)
    knownIds.add(original.id)

    let restoredFilename = restoredById.get(original.id)

    if (restoredFilename) {
      alreadyRestored += 1
    } else {
      const sourcePath = resolveOriginalSource(original)
      const extension = extname(sourcePath)
      if (!extension) fail(`Original source has no extension for ${original.id}: ${sourcePath}`)

      restoredFilename = `${original.id}${extension.toLowerCase()}`
      const destinationPath = resolve(RESTORED_ROOT, restoredFilename)

      if (!DRY_RUN) copyFileSync(sourcePath, destinationPath)
      restoredById.set(original.id, restoredFilename)
      copied += 1
    }

    mapped += 1
    const restored = renderRestored(original, restoredFilename)
    return replaceQuoted(
      replaceQuoted(full, 'restoredPath', restored.restoredPath),
      'restoredMimeType',
      restored.restoredMimeType,
    )
  })

  if (mapped !== expectedEntries) {
    fail(`picsMap transformation incomplete: mapped ${mapped}/${expectedEntries} entries`)
  }

  const orphanFiles = [...restoredById.entries()]
    .filter(([id]) => !knownIds.has(id))
    .map(([, filename]) => filename)

  if (orphanFiles.length > 0) {
    console.warn(`Warning: ${orphanFiles.length} restored files do not map to picsMap ids:`)
    orphanFiles.forEach((filename) => console.warn(`- ${filename}`))
  }

  if (!DRY_RUN) {
    writeFileSync(INDEX_PATH, nextSource, 'utf8')
  }

  console.log(`picsMap entries: ${mapped}`)
  console.log(`Already restored: ${alreadyRestored}`)
  console.log(`${DRY_RUN ? 'Would copy' : 'Copied'} from originals: ${copied}`)
  console.log(`Restored files mapped: ${mapped}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'}`)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
