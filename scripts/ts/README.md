# Media tooling

## Legacy image upscaling

The upscaling pipeline reads `apps/ferupis-qwik/src/media/pics/index.ts` and treats `upscalingFlag` as an executable policy.

### Policy

| Flag | Behaviour |
| --- | --- |
| `GREEN` | Automatic. Final master targets a 1024 px long edge. If reaching 1024 would require more than 3x effective enlargement, the asset fails because the flag is inconsistent with the policy. |
| `YELLOW` | Manual gate. Requires `--approve-yellow`. Final master is capped at `min(1024, source long edge * 3)`. |
| `RED` | Hard block. The pipeline never invokes photographic AI upscaling for the asset. |

The source asset is never modified.

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

Plan all `YELLOW` assets after explicitly opening the manual gate:

```bash
npm run script:pics:upscale -- --flag YELLOW --approve-yellow --dry-run
```

Process an explicitly reviewed `YELLOW` asset:

```bash
npm run script:pics:upscale -- --ids <ID> --approve-yellow
```

Keep normalization and raw x4 intermediates for QA:

```bash
npm run script:pics:upscale -- --ids <ID> --keep-temp
```

Use a different model or GPU for a controlled comparison:

```bash
npm run script:pics:upscale -- --ids <ID> --model realesrnet-x4plus --gpu 0 --keep-temp
```

A `RED` id always fails, even when selected explicitly.
