# Media tooling

## Legacy image upscaling

The upscaling pipeline reads `apps/ferupis-qwik/src/media/pics/index.ts` and treats `upscalingFlag` as an executable policy.

### Policy

| Flag | Behaviour |
| --- | --- |
| `GREEN` | Automatic. Final master targets a 1024 px long edge. If reaching 1024 would require more than 3x effective enlargement, the asset fails because the flag is inconsistent with the policy. |
| `YELLOW` | Manual gate. Dry-run can inspect the group; actual processing requires explicit `--ids` plus `--approve-yellow`. Final master is capped at `min(1024, source long edge * 3)`. |
| `RED` | Hard block. The pipeline never invokes photographic AI upscaling for the asset. |

The source asset is never modified. Existing restored masters are preserved unless `--overwrite` is explicitly supplied.

### Processing stages

1. Read the mapped source from `picsMap`.
2. Decode and normalize the legacy source to PNG with Sharp.
3. When enlargement is needed, run `realesrgan-ncnn-vulkan` with `realesrgan-x4plus` at x4.
4. Downsample the model output with Sharp to the policy target while preserving aspect ratio.
5. Write the restored master as PNG to `apps/ferupis-qwik/src/media/pics/restored/<id>.png`.
6. Write an execution report under `.tmp/upscale/reports/`.

`.tmp/` is ignored by Git. Restored masters are not ignored and can be reviewed before they are committed.

### Runtime requirements

`sharp` is already a root development dependency.

On Windows the default executable path is:

```text
C:\tools\realesrgan\realesrgan-ncnn-vulkan.exe
```

The default NCNN model directory is inferred as:

```text
C:\tools\realesrgan\models
```

The pipeline preflights both `<model>.param` and `<model>.bin` before launching Real-ESRGAN.

Alternative locations can be configured with:

```text
REALESRGAN_BIN
REALESRGAN_MODELS
REALESRGAN_GPU
```

or with the corresponding CLI arguments.

### Commands

Plan all `GREEN` assets without invoking Real-ESRGAN:

```bash
npm run script:pics:upscale -- --dry-run
```

Process all `GREEN` assets:

```bash
npm run script:pics:upscale
```

Process selected `GREEN` assets:

```bash
npm run script:pics:upscale -- --ids D4A26D9D0D034AE7B77B0F776710E8A3,7B978A4F7D3E4D589CF600FADD1FFFC3
```

Inspect every `YELLOW` asset without processing it:

```bash
npm run script:pics:upscale -- --flag YELLOW --dry-run
```

Process explicitly reviewed `YELLOW` assets:

```bash
npm run script:pics:upscale -- --ids ID1,ID2,ID3 --approve-yellow
```

Keeping the approval separate from the id selection prevents accidental batch promotion of all `YELLOW` assets.

Keep normalization and raw x4 intermediates for QA:

```bash
npm run script:pics:upscale -- --ids <ID> --keep-temp
```

Replace an already restored master only when this is intentional:

```bash
npm run script:pics:upscale -- --ids <ID> --overwrite
```

Use a different model or GPU for a controlled comparison:

```bash
npm run script:pics:upscale -- --ids <ID> --model realesrnet-x4plus --gpu 0 --keep-temp
```

A `RED` id always fails, even when selected explicitly.

## Upscaling review sheet

The review tool generates a local HTML contact sheet so `YELLOW` assets can be assessed in batches instead of opening files one by one.

The default selection is every `YELLOW` asset:

```bash
npm run script:pics:review
```

Review another flag group:

```bash
npm run script:pics:review -- --flag GREEN
```

Review only explicit ids:

```bash
npm run script:pics:review -- --ids ID1,ID2,ID3
```

The generated sheet is written to:

```text
.tmp/upscale/review/index.html
```

Generated thumbnails and full-resolution normalized previews are written under:

```text
.tmp/upscale/review/thumbs/
.tmp/upscale/review/previews/
```

All review output remains under ignored `.tmp/` and is not committed.

### Review workflow

Each card shows the source dimensions, the scale required to reach 1024 px, the policy target, and the effective policy scale. Clicking the image opens the normalized source preview in a separate tab.

`Unclassified` is only the initial review state; IDs are always independently accessible. The sheet supports:

- `Copy ID` on every card (the displayed ID is clickable too);
- `Copy all IDs` regardless of review state;
- checkbox selection of arbitrary cards;
- `Select visible` after filtering;
- `Copy selected IDs`;
- bulk `Approve selected`, `Test selected`, and `Reject selected` actions;
- `Copy approved IDs`, `Copy test IDs`, and `Copy rejected IDs`;
- a ready-to-run upscale command for all approved assets.

Clipboard writes use the browser Clipboard API when available and fall back to a legacy copy path when necessary.

Decisions are persisted in the browser with `localStorage` and are intentionally not written back to `picsMap` automatically. If any approved asset is `YELLOW`, the copied upscale command automatically includes `--approve-yellow`.
