import { $, component$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { Overlay } from "@gm/qwik-core/ui";
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
    <Overlay
      variant="dialog"
      modal
      open
      onOpenChange$={handleOpenChange$}
      ariaLabel={photo.title}
      panelClass="[--overlay-dialog-max-width:96rem] [--overlay-viewport-gutter:1rem] sm:[--overlay-viewport-gutter:1.5rem]"
    >
      <div class="relative flex min-h-[min(44rem,calc(100dvh-2rem))] flex-col p-4 sm:p-6">
        <button
          type="button"
          class="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full text-2xl leading-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-white/10"
          aria-label="Chiudi fotografia"
          onClick$={() => closeRoute$()}
        >
          ×
        </button>

        <div class="flex min-h-0 flex-1 items-center gap-2 pt-10 sm:gap-4 sm:pt-8">
          <Link
            href={toPhotoPath(navigation.previous.slug)}
            replaceState
            scroll={false}
            rel="prev"
            aria-label={`Fotografia precedente: ${navigation.previous.title}`}
            class="grid size-11 shrink-0 place-items-center rounded-full text-3xl leading-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-white/10"
          >
            ←
          </Link>

          <figure class="flex min-w-0 flex-1 flex-col items-center justify-center">
            <PhotoImage
              slug={photo.slug}
              alt={photo.alt}
              class="mx-auto h-auto max-h-[72dvh] w-auto max-w-full object-contain"
            />
            <figcaption class="mt-4 flex w-full max-w-4xl items-baseline justify-between gap-4 text-sm sm:text-base">
              <span class="font-medium">{photo.title}</span>
              <span class="shrink-0 opacity-60">
                {navigation.index + 1} / {PHOTO_GALLERY.length}
              </span>
            </figcaption>
          </figure>

          <Link
            href={toPhotoPath(navigation.next.slug)}
            replaceState
            scroll={false}
            rel="next"
            aria-label={`Fotografia successiva: ${navigation.next.title}`}
            class="grid size-11 shrink-0 place-items-center rounded-full text-3xl leading-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-white/10"
          >
            →
          </Link>
        </div>
      </div>
    </Overlay>
  );
});
