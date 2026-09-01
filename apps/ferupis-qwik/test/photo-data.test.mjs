import assert from "node:assert/strict";
import test from "node:test";
import {
  PHOTO_GALLERY,
  getPhotoBySlug,
  getPhotoNavigation,
  toPhotoPath,
} from "../src/components/content/foto/photo-data.ts";

test("keeps every gallery slug unique", () => {
  const slugs = PHOTO_GALLERY.map((photo) => photo.slug);
  const repeatedSlugs = slugs.filter(
    (slug, index) => slugs.indexOf(slug) !== index,
  );

  assert.deepEqual(repeatedSlugs, []);
});

test("finds every photo by its exact slug", () => {
  for (const photo of PHOTO_GALLERY) {
    assert.equal(getPhotoBySlug(photo.slug), photo);
  }

  assert.equal(getPhotoBySlug("slug-sconosciuto"), undefined);
});

test("builds navigation for a photo inside the gallery", () => {
  const current = PHOTO_GALLERY[1];

  assert.ok(current);
  assert.deepEqual(getPhotoNavigation(current.slug), {
    index: 1,
    previous: PHOTO_GALLERY[0],
    next: PHOTO_GALLERY[2],
  });
});

test("wraps navigation at both ends of the gallery", () => {
  const first = PHOTO_GALLERY[0];
  const lastIndex = PHOTO_GALLERY.length - 1;
  const last = PHOTO_GALLERY[lastIndex];

  assert.ok(first);
  assert.ok(last);
  assert.deepEqual(getPhotoNavigation(first.slug), {
    index: 0,
    previous: last,
    next: PHOTO_GALLERY[1],
  });
  assert.deepEqual(getPhotoNavigation(last.slug), {
    index: lastIndex,
    previous: PHOTO_GALLERY[lastIndex - 1],
    next: first,
  });
});

test("returns no navigation for an unknown slug", () => {
  assert.equal(getPhotoNavigation("slug-sconosciuto"), null);
});

test("builds the canonical photo path", () => {
  assert.equal(toPhotoPath("nascita-ape-regina"), "/foto/nascita-ape-regina/");
});
