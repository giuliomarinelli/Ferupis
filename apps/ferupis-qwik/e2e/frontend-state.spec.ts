import { expect, test } from "@playwright/test";

test("il tema utente persiste e la modalità automatica segue il sistema", async ({
  context,
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);

  await page
    .getByRole("button", { name: /Apri il menu di selezione del tema/ })
    .click();
  // The closed-state timer must not unmount a menu opened within its 250 ms exit window.
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Tema scuro" }).click();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("_f_theme_pref") ?? "null"),
      ),
    )
    .toMatchObject({ choice: "dark", owner: "User", theme: "dark" });
  await expect
    .poll(
      async () =>
        (await context.cookies()).find((cookie) => cookie.name === "_f_theme")
          ?.value,
    )
    .toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);

  await page
    .getByRole("button", { name: /Apri il menu di selezione del tema/ })
    .click();
  await page.getByRole("button", { name: "Tema automatico" }).click();
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  await expect
    .poll(async () =>
      (await context.cookies()).some((cookie) => cookie.name === "_f_theme"),
    )
    .toBe(false);

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
});

test("l'overlay foto intrappola il focus, blocca lo scroll e si chiude da tastiera e backdrop", async ({
  page,
}) => {
  await page.goto("/foto/uova-api/");
  await expect(page).toHaveTitle("Uova di ape | Foto | Ferupis");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Fotografia Ferupis di uova di ape.",
  );

  const dialog = page.getByRole("dialog", { name: "Uova di ape" });
  const closeButton = page.getByRole("button", {
    name: "Chiudi fotografia",
  });
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("link", { name: /Fotografia successiva:/ }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/foto\/$/);
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");

  const opener = page.getByRole("link", { name: "Apri Uova di ape" });
  await opener.click();
  await expect(page).toHaveURL(/\/foto\/uova-api\/$/);
  await expect(dialog).toBeVisible();
  await page.locator(".overlay-backdrop").click({ position: { x: 4, y: 4 } });
  await expect(page).toHaveURL(/\/foto\/$/);
  await expect(opener).toBeFocused();
});
