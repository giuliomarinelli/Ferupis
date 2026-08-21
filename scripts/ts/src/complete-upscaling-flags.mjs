import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const target = 'apps/ferupis-qwik/src/media/pics/index.ts';

const galleryGreen = new Set([
  'acacim30.jpg',
  'alveam27.jpg',
  'crm13.jpg',
  'crm14.jpg',
  'crm15.jpg',
  'crm16.jpg',
  'favom24.jpg',
  'favopm25.jpg',
  'favopm26.jpg',
  'filvam12.jpg',
  'girasm32.jpg',
  'larvem02.jpg',
  'larvem03.jpg',
  'larvem04.jpg',
  'noccim28.jpg',
  'pupem05.jpg',
  'regcm20.jpg',
  'regdem21.jpg',
  'regnam17.jpg',
  'regvem19.jpg',
  'regvme18.jpg',
  'regxlm22.jpg',
  'sciaem23.jpg',
  't3m06.jpg',
  't3m07.jpg',
  't3m08.jpg',
  't3m09.jpg',
  'tarasm29.jpg',
  'tiglim31.jpg',
  'uova01.jpg',
  'vafam10.jpg',
  'varopm11.jpg',
]);

const galleryRed = new Set([
  'acacia30.jpg',
  'alvear27.jpg',
  'cr13.jpg',
  'cr14.jpg',
  'cr15.jpg',
  'cr16.jpg',
  'favo24.jpg',
  'favoop26.jpg',
  'favop25.jpg',
  'filva12.jpg',
  'giras32.jpg',
  'larve02.jpg',
  'larve03.jpg',
  'larve04.jpg',
  'noccio28.jpg',
  'pupe05.jpg',
  'regc20.jpg',
  'regde21.jpg',
  'regna17.jpg',
  'regve18.jpg',
  'regve19.jpg',
  'regxl22.jpg',
  'sciae23.jpg',
  't306.jpg',
  't307.jpg',
  't308.jpg',
  't309.jpg',
  'tarass29.jpg',
  'tiglio31.jpg',
  'uova.jpg',
  'vafa10.jpg',
  'varop11.jpg',
]);

function classify(oldPath, mimeType) {
  const name = basename(oldPath).toLowerCase();

  if (mimeType !== 'image/jpeg') return 'RED';

  if (oldPath.startsWith('/foto/')) {
    if (galleryGreen.has(name)) return 'GREEN';
    if (galleryRed.has(name)) return 'RED';
    if (name === 'favoxlbi.jpg') return 'RED';
    return 'YELLOW';
  }

  if (
    name.includes('favobg') ||
    name === 'favoxlbi.jpg' ||
    name.startsWith('logomf')
  ) {
    return 'RED';
  }

  return 'YELLOW';
}

const source = readFileSync(target, 'utf8');
let objectCount = 0;
let insertedCount = 0;

const output = source.replace(
  /(oldPath:\s*"([^"]+)",[\s\S]*?mimeType:\s*"([^"]+)",)(?![\s\S]*?upscalingFlag:)/g,
  (match, prefix, oldPath, mimeType) => {
    objectCount += 1;
    const flag = classify(oldPath, mimeType);
    insertedCount += 1;
    return `${prefix}\n      upscalingFlag: "${flag}",`;
  },
);

const remainingMissing = [...output.matchAll(/mimeType:\s*"[^"]+",(?!\s*\n\s*upscalingFlag:)/g)].length;
const flags = [...output.matchAll(/upscalingFlag:\s*"(GREEN|YELLOW|RED)"/g)].map((m) => m[1]);

if (remainingMissing !== 0) {
  throw new Error(`Missing upscalingFlag after migration: ${remainingMissing}`);
}

if (flags.length === 0 || flags.length !== insertedCount) {
  throw new Error(`Unexpected flag count: flags=${flags.length}, inserted=${insertedCount}`);
}

const counts = flags.reduce((acc, flag) => {
  acc[flag] = (acc[flag] ?? 0) + 1;
  return acc;
}, {});

writeFileSync(target, output);
console.log(JSON.stringify({ objectCount, insertedCount, counts }, null, 2));
