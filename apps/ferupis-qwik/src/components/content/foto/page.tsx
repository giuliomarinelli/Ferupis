import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ContentHeader } from "~/components/content-typography";
import { Container } from "~/components/layout/container";
import { FotoSubtitle } from "./subtitle";
import { PHOTO_GALLERY, toPhotoPath } from "./photo-data";
import { PhotoImage } from "./photo-image";

const figureClass = "min-w-0";
const imageClass =
  "aspect-[3/2] h-auto w-full rounded-xl object-cover transition-transform duration-200 group-hover:scale-[1.015]";
const captionClass = "mt-2 text-sm leading-5 opacity-70";

export const FotoPage = component$(() => (
  <Container
    context="content"
    tag="section"
    classOverride="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12"
  >
    <ContentHeader.Root class="mb-10 w-full sm:mb-12">
      <ContentHeader.Eyebrow text="Ferupis" />
      <ContentHeader.Heading text="Foto" tag="h1" class="foto-color" />
      <ContentHeader.Subtitle component={FotoSubtitle} />
    </ContentHeader.Root>

    <div
      class="grid grid-cols-1 gap-x-4 gap-y-8 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-10"
      aria-label="Galleria fotografica"
    >
      {PHOTO_GALLERY.map((photo) => (
        <figure key={photo.slug} class={figureClass}>
          <Link
            href={toPhotoPath(photo.slug)}
            scroll={false}
            class="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4"
            aria-label={`Apri ${photo.title}`}
          >
            <PhotoImage slug={photo.slug} alt={photo.alt} class={imageClass} />
          </Link>
          <figcaption class={captionClass}>{photo.caption}</figcaption>
        </figure>
      ))}
    </div>
  </Container>
));
