import { mkdirSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import sharp from 'sharp'
import { picsMap } from '@apps/ferupis-qwik/pics'

type UpscalingFlag = 'GREEN' | 'YELLOW' | 'RED'

interface CliOptions {
  flag: UpscalingFlag
  ids: string[]
  cardWidth: number
}

interface ReviewAsset {
  id: string
  flag: UpscalingFlag
  keyname: string
  oldPath: string
  width: number
  height: number
  longEdge: number
  targetLongEdge: number
  scaleTo1024: number
  policyScale: number
  thumbPath: string
  previewPath: string
  note: string
}

const TARGET_LONG_EDGE = 1024
const MAX_EFFECTIVE_UPSCALE = 3
const DEFAULT_CARD_WIDTH = 320
const APP_ROOT = resolve('apps/ferupis-qwik')
const REVIEW_ROOT = resolve('.tmp/upscale/review')
const THUMBS_ROOT = resolve(REVIEW_ROOT, 'thumbs')
const PREVIEWS_ROOT = resolve(REVIEW_ROOT, 'previews')

function printHelp(): void {
  console.log(`
Ferupis media review sheet

Usage:
  npm run script:pics:review -- [options]

Options:
  --flag <GREEN|YELLOW|RED>  Select a flag group (default: YELLOW)
  --ids <id1,id2,...>        Review only explicit ids; overrides --flag
  --card-width <px>          Thumbnail width, 160-800 (default: ${DEFAULT_CARD_WIDTH})
  --help                     Show this help

Examples:
  npm run script:pics:review
  npm run script:pics:review -- --flag GREEN
  npm run script:pics:review -- --ids ID1,ID2
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
    flag: 'YELLOW',
    ids: [],
    cardWidth: DEFAULT_CARD_WIDTH,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
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

    if (arg === '--card-width' || arg.startsWith('--card-width=')) {
      const { value, nextIndex } = readArgValue(args, i, '--card-width')
      const parsed = Number.parseInt(value, 10)
      if (!Number.isFinite(parsed) || parsed < 160 || parsed > 800) {
        throw new Error(`Invalid --card-width: ${value}. Expected an integer between 160 and 800.`)
      }
      options.cardWidth = parsed
      i = nextIndex
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function sourcePathFromMappedPath(mappedPath: string): string {
  if (!mappedPath.startsWith('~/')) {
    throw new Error(`Unsupported mapped media path: ${mappedPath}`)
  }
  return resolve(APP_ROOT, 'src', mappedPath.slice(2))
}

function selectAssets(options: CliOptions) {
  if (options.ids.length > 0) {
    const requested = new Set(options.ids)
    const selected = picsMap.filter((entry) => requested.has(entry.id))
    const found = new Set(selected.map((entry) => entry.id))
    const missing = options.ids.filter((id) => !found.has(id))

    if (missing.length > 0) {
      throw new Error(`Unknown image ids: ${missing.join(', ')}`)
    }

    return selected
  }

  return picsMap.filter((entry) => entry.upscalingFlag === options.flag)
}

function computePolicyTarget(flag: UpscalingFlag, sourceLongEdge: number): number {
  if (flag === 'GREEN') return TARGET_LONG_EDGE
  if (flag === 'YELLOW') return Math.min(TARGET_LONG_EDGE, Math.floor(sourceLongEdge * MAX_EFFECTIVE_UPSCALE))
  return sourceLongEdge
}

function buildNote(flag: UpscalingFlag, sourceLongEdge: number): string {
  const requiredScale = TARGET_LONG_EDGE / sourceLongEdge

  if (flag === 'RED') {
    return 'RED: photographic AI upscaling is hard-blocked.'
  }

  if (flag === 'GREEN' && requiredScale > MAX_EFFECTIVE_UPSCALE) {
    return `GREEN anomaly: reaching 1024 px would require ${requiredScale.toFixed(2)}x, above the ${MAX_EFFECTIVE_UPSCALE}x policy cap.`
  }

  if (flag === 'GREEN') {
    return `GREEN: automatic 1024 px target is within the ${MAX_EFFECTIVE_UPSCALE}x policy cap.`
  }

  if (requiredScale > MAX_EFFECTIVE_UPSCALE) {
    return `YELLOW: 1024 px is above the ${MAX_EFFECTIVE_UPSCALE}x cap; the pipeline will use a reduced policy target.`
  }

  return 'YELLOW: 1024 px is mathematically within policy, but visual approval is still required.'
}

async function createReviewAssets(options: CliOptions): Promise<ReviewAsset[]> {
  mkdirSync(THUMBS_ROOT, { recursive: true })
  mkdirSync(PREVIEWS_ROOT, { recursive: true })

  const selected = selectAssets(options)
  if (selected.length === 0) {
    throw new Error('No assets matched the requested review selection')
  }

  const assets: ReviewAsset[] = []

  for (const entry of selected) {
    const { id, originalsPath: mappedPath, keyname, oldPath, upscalingFlag } = entry
    const flag = upscalingFlag as UpscalingFlag
    const sourcePath = sourcePathFromMappedPath(mappedPath)
    const metadata = await sharp(sourcePath).metadata()

    if (!metadata.width || !metadata.height) {
      throw new Error(`Unable to read dimensions for ${id}: ${sourcePath}`)
    }

    const width = metadata.width
    const height = metadata.height
    const longEdge = Math.max(width, height)
    const targetLongEdge = computePolicyTarget(flag, longEdge)
    const thumbName = `${id}.jpg`
    const previewName = `${id}.png`

    await sharp(sourcePath)
      .rotate()
      .resize({ width: options.cardWidth, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, progressive: true })
      .toFile(resolve(THUMBS_ROOT, thumbName))

    await sharp(sourcePath)
      .rotate()
      .png({ compressionLevel: 6 })
      .toFile(resolve(PREVIEWS_ROOT, previewName))

    assets.push({
      id,
      flag,
      keyname: keyname || basename(sourcePath),
      oldPath,
      width,
      height,
      longEdge,
      targetLongEdge,
      scaleTo1024: TARGET_LONG_EDGE / longEdge,
      policyScale: targetLongEdge / longEdge,
      thumbPath: `thumbs/${thumbName}`,
      previewPath: `previews/${previewName}`,
      note: buildNote(flag, longEdge),
    })
  }

  return assets.sort((a, b) => a.oldPath.localeCompare(b.oldPath))
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderCard(asset: ReviewAsset): string {
  return `
    <article class="card" data-id="${escapeHtml(asset.id)}" data-state="">
      <a class="preview" href="${escapeHtml(asset.previewPath)}" target="_blank" rel="noreferrer">
        <img src="${escapeHtml(asset.thumbPath)}" alt="${escapeHtml(asset.keyname)}" loading="lazy" />
      </a>
      <div class="body">
        <div class="heading">
          <button class="id-button" type="button" data-copy-id="${escapeHtml(asset.id)}" title="Copy ID">
            <code>${escapeHtml(asset.id)}</code>
          </button>
          <span class="flag ${asset.flag.toLowerCase()}">${asset.flag}</span>
        </div>
        <div class="meta">
          <div><strong>Legacy:</strong> ${escapeHtml(asset.oldPath)}</div>
          <div><strong>Source:</strong> ${asset.width} x ${asset.height}</div>
          <div><strong>1024:</strong> ${asset.scaleTo1024.toFixed(2)}x</div>
          <div><strong>Policy target:</strong> ${asset.targetLongEdge}px (${asset.policyScale.toFixed(2)}x)</div>
        </div>
        <p>${escapeHtml(asset.note)}</p>
        <label class="select-row">
          <input type="checkbox" data-select-id="${escapeHtml(asset.id)}" />
          <span>Select for batch actions</span>
        </label>
        <div class="actions">
          <button type="button" data-copy-id="${escapeHtml(asset.id)}">Copy ID</button>
          <button type="button" data-action="approve">Approve</button>
          <button type="button" data-action="test">Test</button>
          <button type="button" data-action="reject">Reject</button>
          <button type="button" data-action="clear">Clear</button>
        </div>
        <div class="decision">Unclassified</div>
      </div>
    </article>`
}

function renderHtml(assets: ReviewAsset[], options: CliOptions): string {
  const payload = JSON.stringify(assets.map(({ id, flag }) => ({ id, flag })))
  const storageKey = options.ids.length > 0
    ? `ferupis-upscale-review-ids-${options.ids.join('-')}`
    : `ferupis-upscale-review-${options.flag.toLowerCase()}`

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ferupis upscaling review</title>
  <style>
    :root { color-scheme: dark; font-family: system-ui, sans-serif; background: #0f1115; color: #f3f5f7; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #0f1115; }
    .toolbar { position: sticky; top: 0; z-index: 10; padding: 18px 24px; background: rgba(15,17,21,.94); backdrop-filter: blur(10px); border-bottom: 1px solid #303643; }
    .toolbar h1 { margin: 0 0 8px; font-size: 22px; }
    .toolbar p { margin: 0; color: #aeb7c5; }
    .tools { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .tools.batch { margin-top: 8px; }
    button, select { border: 1px solid #394252; background: #1c222c; color: #f3f5f7; border-radius: 9px; padding: 9px 11px; cursor: pointer; }
    button:hover, select:hover { border-color: #667289; }
    .status { min-height: 20px; margin-top: 10px; color: #7ec8ff; font-size: 13px; }
    .stats { margin-top: 8px; color: #aeb7c5; }
    main { padding: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .card { background: #171b22; border: 1px solid #303643; border-radius: 14px; overflow: hidden; }
    .card.selected { outline: 2px solid #6fb5ff; outline-offset: 2px; }
    .preview { display: block; aspect-ratio: 4/3; background: #090b0e; }
    .preview img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .body { padding: 14px; }
    .heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .id-button { min-width: 0; padding: 0; border: 0; background: transparent; text-align: left; }
    .id-button:hover { border: 0; }
    code { font-size: 11px; word-break: break-all; background: #222832; padding: 4px 6px; border-radius: 6px; }
    .flag { padding: 4px 7px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .flag.green { color: #52d784; background: rgba(82,215,132,.13); }
    .flag.yellow { color: #ffd04d; background: rgba(255,208,77,.13); }
    .flag.red { color: #ff7272; background: rgba(255,114,114,.13); }
    .meta { display: grid; gap: 4px; margin-top: 12px; color: #b6bfcc; font-size: 13px; }
    .body p { min-height: 42px; color: #d7dce4; font-size: 13px; }
    .select-row { display: flex; align-items: center; gap: 8px; margin: 8px 0 10px; color: #b6bfcc; font-size: 13px; cursor: pointer; }
    .select-row input { width: 16px; height: 16px; }
    .actions { display: flex; flex-wrap: wrap; gap: 7px; }
    .decision { margin-top: 10px; border: 1px solid #303643; border-radius: 8px; padding: 7px 9px; color: #9fa9b8; }
    .card[data-state="approve"] .decision { color: #52d784; border-color: rgba(82,215,132,.45); }
    .card[data-state="test"] .decision { color: #6fb5ff; border-color: rgba(111,181,255,.45); }
    .card[data-state="reject"] .decision { color: #ff7272; border-color: rgba(255,114,114,.45); }
    .hidden { display: none; }
  </style>
</head>
<body>
  <header class="toolbar">
    <h1>Ferupis upscaling review</h1>
    <p>${assets.length} assets. Decisions stay in this browser via localStorage.</p>
    <div class="tools">
      <select id="filter">
        <option value="all">All</option>
        <option value="approve">Approved</option>
        <option value="test">Test</option>
        <option value="reject">Rejected</option>
        <option value="unclassified">Unclassified</option>
      </select>
      <button id="copy-all" type="button">Copy all IDs</button>
      <button id="copy-approved" type="button">Copy approved IDs</button>
      <button id="copy-test" type="button">Copy test IDs</button>
      <button id="copy-rejected" type="button">Copy rejected IDs</button>
      <button id="copy-command" type="button">Copy upscale command</button>
      <button id="clear-all" type="button">Clear decisions</button>
    </div>
    <div class="tools batch">
      <button id="select-visible" type="button">Select visible</button>
      <button id="clear-selection" type="button">Clear selection</button>
      <button id="copy-selected" type="button">Copy selected IDs</button>
      <button id="approve-selected" type="button">Approve selected</button>
      <button id="test-selected" type="button">Test selected</button>
      <button id="reject-selected" type="button">Reject selected</button>
    </div>
    <div id="status" class="status" aria-live="polite"></div>
    <div id="stats" class="stats"></div>
  </header>
  <main>
    <section class="grid">
      ${assets.map(renderCard).join('\n')}
    </section>
  </main>
  <script>
    const assets = ${payload};
    const storageKey = ${JSON.stringify(storageKey)};
    const cards = [...document.querySelectorAll('.card')];
    const filter = document.getElementById('filter');
    const stats = document.getElementById('stats');
    const status = document.getElementById('status');
    const selectedIds = new Set();

    function readState() {
      try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
      catch { return {}; }
    }

    function writeState(state) { localStorage.setItem(storageKey, JSON.stringify(state)); }

    function labelFor(state) {
      if (state === 'approve') return 'Approved';
      if (state === 'test') return 'Test';
      if (state === 'reject') return 'Rejected';
      return 'Unclassified';
    }

    function showStatus(message) {
      status.textContent = message;
      window.clearTimeout(showStatus.timer);
      showStatus.timer = window.setTimeout(() => { status.textContent = ''; }, 2500);
    }

    async function copyText(text, label) {
      if (!text) {
        showStatus('Nothing to copy.');
        return;
      }

      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(text);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) {
          showStatus('Copy failed: select the ID text manually.');
          return;
        }
      }

      showStatus(label);
    }

    function refresh() {
      const state = readState();
      let approved = 0, test = 0, rejected = 0;

      for (const card of cards) {
        const id = card.dataset.id;
        const value = state[id] || '';
        card.dataset.state = value;
        card.querySelector('.decision').textContent = labelFor(value);

        const selected = filter.value;
        const visible = selected === 'all' || (selected === 'unclassified' ? value === '' : value === selected);
        card.classList.toggle('hidden', !visible);

        const isSelected = selectedIds.has(id);
        card.classList.toggle('selected', isSelected);
        const checkbox = card.querySelector('input[data-select-id]');
        if (checkbox) checkbox.checked = isSelected;

        if (value === 'approve') approved += 1;
        else if (value === 'test') test += 1;
        else if (value === 'reject') rejected += 1;
      }

      stats.textContent = 'Approved: ' + approved + ' | Test: ' + test + ' | Rejected: ' + rejected + ' | Unclassified: ' + (assets.length - approved - test - rejected) + ' | Selected: ' + selectedIds.size;
    }

    function idsFor(decision) {
      const state = readState();
      return assets.filter((asset) => (state[asset.id] || '') === decision).map((asset) => asset.id);
    }

    function visibleIds() {
      return cards.filter((card) => !card.classList.contains('hidden')).map((card) => card.dataset.id);
    }

    function applyDecisionToSelected(decision) {
      if (selectedIds.size === 0) {
        showStatus('No selected assets.');
        return;
      }

      const state = readState();
      for (const id of selectedIds) {
        if (decision === '') delete state[id];
        else state[id] = decision;
      }
      writeState(state);
      refresh();
      showStatus(labelFor(decision) + ': ' + selectedIds.size + ' selected assets.');
    }

    document.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.matches('input[data-select-id]')) return;
      const id = target.dataset.selectId;
      if (!id) return;
      if (target.checked) selectedIds.add(id);
      else selectedIds.delete(id);
      refresh();
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const copyButton = target.closest('button[data-copy-id]');
      if (copyButton) {
        const id = copyButton.dataset.copyId;
        if (id) void copyText(id, 'Copied ID: ' + id);
        return;
      }

      const button = target.closest('button[data-action]');
      if (!button) return;
      const card = button.closest('.card');
      if (!card) return;

      const state = readState();
      if (button.dataset.action === 'clear') delete state[card.dataset.id];
      else state[card.dataset.id] = button.dataset.action;
      writeState(state);
      refresh();
    });

    filter.addEventListener('change', refresh);

    document.getElementById('copy-all').addEventListener('click', () => {
      void copyText(assets.map((asset) => asset.id).join(','), 'Copied all ' + assets.length + ' IDs.');
    });

    document.getElementById('copy-approved').addEventListener('click', () => {
      const ids = idsFor('approve');
      void copyText(ids.join(','), 'Copied ' + ids.length + ' approved IDs.');
    });

    document.getElementById('copy-test').addEventListener('click', () => {
      const ids = idsFor('test');
      void copyText(ids.join(','), 'Copied ' + ids.length + ' test IDs.');
    });

    document.getElementById('copy-rejected').addEventListener('click', () => {
      const ids = idsFor('reject');
      void copyText(ids.join(','), 'Copied ' + ids.length + ' rejected IDs.');
    });

    document.getElementById('select-visible').addEventListener('click', () => {
      for (const id of visibleIds()) selectedIds.add(id);
      refresh();
      showStatus('Selected ' + selectedIds.size + ' assets.');
    });

    document.getElementById('clear-selection').addEventListener('click', () => {
      selectedIds.clear();
      refresh();
      showStatus('Selection cleared.');
    });

    document.getElementById('copy-selected').addEventListener('click', () => {
      const ids = [...selectedIds];
      void copyText(ids.join(','), 'Copied ' + ids.length + ' selected IDs.');
    });

    document.getElementById('approve-selected').addEventListener('click', () => applyDecisionToSelected('approve'));
    document.getElementById('test-selected').addEventListener('click', () => applyDecisionToSelected('test'));
    document.getElementById('reject-selected').addEventListener('click', () => applyDecisionToSelected('reject'));

    document.getElementById('clear-all').addEventListener('click', () => {
      localStorage.removeItem(storageKey);
      refresh();
      showStatus('All decisions cleared.');
    });

    document.getElementById('copy-command').addEventListener('click', () => {
      const ids = idsFor('approve');
      if (ids.length === 0) {
        showStatus('No approved assets: no upscale command to copy.');
        return;
      }
      const containsYellow = assets.some((asset) => asset.flag === 'YELLOW' && ids.includes(asset.id));
      const command = 'npm run script:pics:upscale -- --ids ' + ids.join(',') + (containsYellow ? ' --approve-yellow' : '');
      void copyText(command, 'Upscale command copied for ' + ids.length + ' approved assets.');
    });

    refresh();
  </script>
</body>
</html>`
}

async function main(): Promise<void> {
  const options = parseArgs()
  const assets = await createReviewAssets(options)
  mkdirSync(REVIEW_ROOT, { recursive: true })

  const outputPath = resolve(REVIEW_ROOT, 'index.html')
  writeFileSync(outputPath, renderHtml(assets, options), 'utf8')

  console.log(`Review sheet generated: ${outputPath}`)
  console.log(`Assets included: ${assets.length}`)
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
