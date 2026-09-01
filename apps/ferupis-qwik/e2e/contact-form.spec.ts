import { expect, test, type Locator, type Page } from "@playwright/test";

type ContactSubmission = Readonly<{
  headers: Record<string, string>;
  payload: Record<string, unknown>;
}>;

type TurnstileE2EOptions = Readonly<{
  sitekey: string;
  action: string;
  appearance: string;
  execution: string;
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
}>;

type TurnstileE2EState = {
  executeCount: number;
  options?: TurnstileE2EOptions;
  removeCount: number;
  renderCount: number;
  resetCount: number;
};

const installTurnstileMock = async (page: Page) => {
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js**",
    (route) =>
      route.fulfill({
        body: "/* Turnstile is provided by the Playwright init script. */",
        contentType: "application/javascript",
        status: 200,
      }),
  );

  await page.addInitScript(() => {
    type E2EWindow = typeof window & {
      __turnstileE2E: TurnstileE2EState;
      turnstile: {
        execute(widgetId: string): void;
        remove(widgetId: string): void;
        render(container: HTMLElement, options: TurnstileE2EOptions): string;
        reset(widgetId: string): void;
      };
    };

    const browserWindow = window as E2EWindow;
    const state: TurnstileE2EState = {
      executeCount: 0,
      removeCount: 0,
      renderCount: 0,
      resetCount: 0,
    };
    browserWindow.__turnstileE2E = state;
    browserWindow.turnstile = {
      render(_container, options) {
        state.renderCount += 1;
        state.options = options;
        return `turnstile-e2e-${state.renderCount}`;
      },
      execute() {
        state.executeCount += 1;
        window.setTimeout(
          () => state.options?.callback("turnstile-e2e-token"),
          0,
        );
      },
      reset() {
        state.resetCount += 1;
      },
      remove() {
        state.removeCount += 1;
      },
    };
  });
};

const typeValue = async (field: Locator, value: string) => {
  await field.focus();
  await expect
    .poll(() =>
      field.evaluate((element) =>
        (
          element as HTMLInputElement | HTMLTextAreaElement
        ).labels?.[0]?.classList.contains("m-floating-label--active"),
      ),
    )
    .toBe(true);
  await field.pressSequentially(value, { delay: 10 });
  await expect(field).toHaveValue(value);
};

const fillValidContactForm = async (page: Page, suffix = "") => {
  await typeValue(page.getByLabel("Nome"), `Mario Rossi${suffix}`);
  await typeValue(page.getByLabel("Email"), "mario@example.com");
  await typeValue(
    page.getByLabel("Oggetto (facoltativo)"),
    "Informazioni sul miele",
  );
  await typeValue(
    page.getByLabel("Messaggio"),
    `Vorrei alcune informazioni${suffix}.`,
  );
  const privacy = page.getByLabel(/Ho preso visione/);
  await privacy.check();
  await expect(privacy).toBeChecked();
};

test.beforeEach(async ({ page }) => {
  await installTurnstileMock(page);
});

test("blocca il submit invalido, espone gli errori accessibili e porta il focus al primo campo", async ({
  page,
}) => {
  let apiRequests = 0;
  await page.route("**/api/contact/messages/", async (route) => {
    apiRequests += 1;
    await route.abort();
  });

  await page.goto("/contattaci/");
  await page.getByRole("button", { name: "Invia messaggio" }).click();

  await expect(
    page.getByText("Controlla i campi evidenziati e riprova."),
  ).toBeVisible();
  await expect(page.locator("#contact-name")).toBeFocused();
  await expect(page.locator("#contact-name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#contact-name-error")).toHaveText(
    "Inserisci il tuo nome.",
  );
  await expect(page.locator("#contact-privacy")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(apiRequests).toBe(0);
});

test("invia token e payload, mostra il successo e genera un requestId nuovo dopo il reset", async ({
  page,
}) => {
  const submissions: ContactSubmission[] = [];
  await page.route("**/api/contact/messages/", async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    submissions.push({
      headers: route.request().headers(),
      payload,
    });
    await route.fulfill({
      body: JSON.stringify({ ok: true, requestId: payload.requestId }),
      contentType: "application/json",
      status: 202,
    });
  });

  await page.goto("/contattaci/");
  await expect
    .poll(() => page.evaluate(() => window.__turnstileE2E.renderCount))
    .toBe(1);
  expect(
    await page.evaluate(() => {
      const options = window.__turnstileE2E.options;
      if (!options) return null;
      return {
        action: options.action,
        appearance: options.appearance,
        execution: options.execution,
        hasCallback: typeof options.callback === "function",
        hasErrorCallback: typeof options["error-callback"] === "function",
        hasExpiredCallback: typeof options["expired-callback"] === "function",
        sitekey: options.sitekey,
      };
    }),
  ).toEqual({
    action: "contact_submit",
    appearance: "interaction-only",
    execution: "execute",
    hasCallback: true,
    hasErrorCallback: true,
    hasExpiredCallback: true,
    sitekey: "1x00000000000000000000BB",
  });

  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Invia messaggio" }).click();
  await expect(
    page.getByRole("heading", { name: "Messaggio ricevuto" }),
  ).toBeVisible();

  expect(submissions).toHaveLength(1);
  expect(submissions[0].headers["x-turnstile-challenge-token"]).toBe(
    "turnstile-e2e-token",
  );
  expect(submissions[0].payload).toMatchObject({
    email: "mario@example.com",
    message: "Vorrei alcune informazioni.",
    name: "Mario Rossi",
    privacyAccepted: true,
    subject: "Informazioni sul miele",
  });
  expect(submissions[0].payload.requestId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );

  await page.getByRole("button", { name: "Invia un altro messaggio" }).click();
  await expect(page.locator("#contact-name")).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => window.__turnstileE2E.renderCount))
    .toBe(2);

  await fillValidContactForm(page, " II");
  await page.getByRole("button", { name: "Invia messaggio" }).click();
  await expect(
    page.getByRole("heading", { name: "Messaggio ricevuto" }),
  ).toBeVisible();

  expect(submissions).toHaveLength(2);
  expect(submissions[1].payload.requestId).not.toBe(
    submissions[0].payload.requestId,
  );
});

test("mantiene un solo invio mentre la richiesta è in corso", async ({
  page,
}) => {
  let apiRequests = 0;
  let releaseResponse = () => {};
  const responseGate = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });

  await page.route("**/api/contact/messages/", async (route) => {
    apiRequests += 1;
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    await responseGate;
    await route.fulfill({
      body: JSON.stringify({ ok: true, requestId: payload.requestId }),
      contentType: "application/json",
      status: 202,
    });
  });

  await page.goto("/contattaci/");
  await expect
    .poll(() => page.evaluate(() => window.__turnstileE2E.renderCount))
    .toBe(1);
  await fillValidContactForm(page);

  const form = page.locator("form");
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  try {
    await expect.poll(() => apiRequests).toBe(1);
    await expect(form).toHaveAttribute("aria-busy", "true");
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveAccessibleName(/Invio in corso/);

    await page.waitForTimeout(250);
    expect(apiRequests).toBe(1);
  } finally {
    releaseResponse();
  }

  await expect(
    page.getByRole("heading", { name: "Messaggio ricevuto" }),
  ).toBeVisible();
});

test("espone gli errori client del widget Turnstile", async ({ page }) => {
  await page.goto("/contattaci/");
  await expect
    .poll(() => page.evaluate(() => window.__turnstileE2E.renderCount))
    .toBe(1);

  await page.evaluate(() => {
    window.__turnstileE2E.options?.["error-callback"]();
  });

  await expect(
    page.getByText(
      "Non siamo riusciti a verificare la richiesta. Riprova tra qualche secondo.",
    ),
  ).toBeVisible();
});

test("mappa il rifiuto Turnstile e ripristina lo stato interattivo", async ({
  page,
}) => {
  await page.route("**/api/contact/messages/", (route) =>
    route.fulfill({
      body: JSON.stringify({
        ok: false,
        code: "TURNSTILE_VERIFICATION_FAILED",
      }),
      contentType: "application/json",
      status: 400,
    }),
  );

  await page.goto("/contattaci/");
  await expect
    .poll(() => page.evaluate(() => window.__turnstileE2E.renderCount))
    .toBe(1);
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Invia messaggio" }).click();

  await expect(
    page.getByText(
      "Non siamo riusciti a verificare la richiesta. Riprova tra qualche secondo.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Invia messaggio" }),
  ).toBeEnabled();
  await expect
    .poll(() => page.evaluate(() => window.__turnstileE2E.resetCount))
    .toBeGreaterThanOrEqual(2);
});

declare global {
  interface Window {
    __turnstileE2E: TurnstileE2EState;
  }
}
