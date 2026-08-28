import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getPhotoBySlug } from "~/components/content/foto/photo-data";
import { PhotoOverlay } from "~/components/content/foto/photo-overlay";

export const usePhotoRoute = routeLoader$(({ params, status }) => {
  const photo = getPhotoBySlug(params.slug);

  if (!photo) {
    status(404);
    return null;
  }

  return photo;
});

export default component$(() => {
  const photo = usePhotoRoute();

  return photo.value ? <PhotoOverlay photo={photo.value} /> : null;
});

export const head: DocumentHead = ({ params }) => {
  const photo = getPhotoBySlug(params.slug);

  if (!photo) {
    return {
      title: "Foto | Ferupis",
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
    };
  }

  return {
    title: `${photo.title} | Foto | Ferupis`,
    meta: [
      {
        name: "description",
        content: photo.description,
      },
    ],
  };
};
