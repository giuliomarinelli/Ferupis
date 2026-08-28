import { $, component$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import {
  AngleLeftJellyIcon,
  AngleRightJellyIcon,
  Overlay,
  ThinCloseIcon,
} from "@gm/qwik-core/ui";
import {
  PHOTO_GALLERY,
  getPhotoNavigation,
  toPhotoPath,
  type PhotoDefinition,
} from "./photo-data";
import { PhotoImage } from "./photo-image";

export type PhotoOverlayProps = {
  photo: PhotoDefinition;
};

const floatingControlClass = [
  "grid place-items-center rounded-full border border-indigo-200/80 bg-white/85",
  "text-light-primary shadow-sm backdrop-blur-md",
  "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out",
  "hover:border-indigo-300 hover:bg-indigo-100/90 hover:text-indigo-700 hover:shadow-md",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
  "active:bg-indigo-200/80",
  "dark:border-slate-700/90 dark:bg-neutral-900/85 dark:text-bright-primary",
  "dark:hover:border-indigo-500/60 dark:hover:bg-indigo-950/70 dark:hover:text-indigo-200",
  "dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-neutral-950",
  "dark:active:bg-indigo-900/60",
].join(" ");

export const PhotoOverlay = component$<PhotoOverlayProps>(({ photo }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = getPhotoNavigation(photo.slug);

  if (!navigation) {
    return null;
  }

  const closeRoute$ = $(() => {
    if (location.prevUrl) {
      window.history.back();
      return;
    }

    void navigate("/foto/", {
      replaceState: true,
      scroll: false,
    });
  });

  const handleOpenChange$ = $((open: boolean) => {
    if (!open) {
      void closeRoute$();
    }
  });

  return (
    <div
      class="[--overlay-backdrop-color:rgb(15_23_42/0.48)] [--overlay-backdrop-filter:blur(6px)] [--overlay-transition-duration:180ms] dark:[--overlay-backdrop-color:rgb(0_0_0/0.72)]"
    >
      <Overlay
        variant="dialog"
        modal
        open
        onOpenChange$={handleOpenChange$}
        ariaLabel={photo.title}
        panelClass={[
          "w-[calc(100vw-1rem)]! max-w-[calc(100vw-1rem)]! max-h-[calc(100dvh-1rem)]! overflow-hidden!",
          "sm:w-fit! sm:max-w-[calc(100vw-3rem)]!",
          "[--overlay-border-radius:1.25rem] [--overlay-surface:rgb(248_250_252/0.96)]",
          "[--overlay-border-color:rgb(199_210_254/0.78)] [--overlay-shadow:0_24px_72px_rgb(15_23_42/0.32)]",
          "backdrop-blur-xl",
          "dark:[--overlay-surface:rgb(10_10_10/0.96)] dark:[--overlay-border-color:rgb(71_85_105/0.82)]",
          "dark:[--overlay-shadow:0_24px_72px_rgb(0_0_0/0.56)]",
        ]}
      >
        <div class="relative flex w-full min-w-0 flex-col p-3 pt-12 text-neutral-950 sm:w-fit sm:max-w-full sm:p-5 sm:pt-14 dark:text-slate-50">
          <button
            type="button"
            class={[floatingControlClass, "absolute right-2 top-2 z-30 size-9 sm:right-3 sm:top-3 sm:size-10"]}
            aria-label="Chiudi fotografia"
            title="Chiudi"
            onClick$={() => closeRoute$()}
          >
            <ThinCloseIcon class="size-5 sm:size-[1.375rem]" />
          </button>

          <figure class="flex w-full min-w-0 flex-col items-center justify-center sm:w-fit sm:max-w-full">
            <div class="relative flex w-full min-w-0 items-center justify-center sm:w-fit sm:max-w-full sm:px-14 md:px-16">
              <Link
                href={toPhotoPath(navigation.previous.slug)}
                replaceState
                scroll={false}
                rel="prev"
                aria-label={`Fotografia precedente: ${navigation.previous.title}`}
                title="Fotografia precedente"
                class={[
                  floatingControlClass,
                  "absolute left-2 top-1/2 z-20 size-10 -translate-y-1/2 sm:left-1 sm:size-12",
                ]}
              >
                <AngleLeftJellyIcon class="size-6 sm:size-7" />
              </Link>

              <PhotoImage
                slug={photo.slug}
                alt={photo.alt}
                class="block h-auto max-h-[calc(100dvh-10rem)] w-full min-w-0 max-w-full rounded-xl border border-slate-200/80 bg-white object-contain shadow-lg shadow-slate-900/10 sm:max-h-[72dvh] sm:w-auto sm:max-w-[min(80vw,72rem)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40"
              />

              <Link
                href={toPhotoPath(navigation.next.slug)}
                replaceState
                scroll={false}
                rel="next"
                aria-label={`Fotografia successiva: ${navigation.next.title}`}
                title="Fotografia successiva"
                class={[
                  floatingControlClass,
                  "absolute right-2 top-1/2 z-20 size-10 -translate-y-1/2 sm:right-1 sm:size-12",
                ]}
              >
                <AngleRightJellyIcon class="size-6 sm:size-7" />
              </Link>
            </div>

            <figcaption class="mt-3 flex w-full items-center justify-between gap-4 border-t border-slate-200/80 px-1 pt-3 text-sm text-neutral-700 sm:mt-4 sm:px-0 sm:pt-4 sm:text-base dark:border-neutral-800 dark:text-slate-300">
              <span class="min-w-0 font-medium tracking-wide text-neutral-900 dark:text-slate-100">
                {photo.title}
              </span>
              <span class="shrink-0 rounded-full bg-indigo-100/75 px-2.5 py-1 font-sans text-xs font-medium tabular-nums text-light-primary dark:bg-indigo-950/55 dark:text-bright-primary">
                {navigation.index + 1} / {PHOTO_GALLERY.length}
              </span>
            </figcaption>
          </figure>
        </div>
      </Overlay>
    </div>
  );
});
