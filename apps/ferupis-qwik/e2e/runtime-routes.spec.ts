import { expect, test } from "@playwright/test";

test("l'artefatto Pages espone la route HTTP reale dei contatti", async ({
  request,
}) => {
  const response = await request.get("/api/contact/messages/");

  expect(response.status()).toBe(405);
  expect(response.headers()).toMatchObject({
    allow: "POST",
    "cache-control": "private, no-store, max-age=0, must-revalidate",
    "cross-origin-resource-policy": "same-origin",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  expect(await response.json()).toEqual({
    ok: false,
    code: "METHOD_NOT_ALLOWED",
  });

  const invalidPost = await request.post("/api/contact/messages/", {
    data: "not-json",
    headers: {
      "Content-Type": "text/plain",
      Origin: "http://127.0.0.1:8790",
      "Sec-Fetch-Site": "same-origin",
    },
  });
  expect(invalidPost.status()).toBe(415);
  expect(await invalidPost.json()).toEqual({
    ok: false,
    code: "CONTENT_TYPE_UNSUPPORTED",
  });
});

test("una route foto sconosciuta risponde 404 e impedisce l'indicizzazione", async ({
  page,
}) => {
  const response = await page.goto("/foto/slug-sconosciuto/");

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Foto | Ferupis");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
