import { createEmailDeliveryTestJob } from "@gm/qwik-core/email";
import { describe, expect, it } from "vitest";
import { renderEmailJob } from "../src/email";

const createJob = (locale: "it" | "en") =>
  createEmailDeliveryTestJob({
    locale,
    recipient: { email: "recipient@example.com" },
    source: "test.template",
    notificationId: "4bf92f37-0987-4f2b-8b0b-b5791d9e15cf",
    correlationId: "d41895d2-1c9e-4d0c-911d-8eec09f6c6b4",
    enqueuedAt: "2026-08-29T07:00:00.000Z",
  });

describe("React Email template rendering", () => {
  it("renders accessible Italian HTML and plain text", async () => {
    const rendered = await renderEmailJob(createJob("it"), {
      appEnvironment: "preview",
      siteOrigin: "https://preview.ferupis.pages.dev",
    });

    expect(rendered.subject).toBe("Test di consegna email — Ferupis");
    expect(rendered.html).toContain('lang="it"');
    expect(rendered.html).toContain("Consegna email verificata");
    expect(rendered.html).toContain("https://preview.ferupis.pages.dev");
    expect(rendered.text).toContain("CONSEGNA EMAIL VERIFICATA");
    expect(rendered.text).toContain("Ambiente: preview");
  });

  it("renders the English localization", async () => {
    const rendered = await renderEmailJob(createJob("en"), {
      appEnvironment: "production",
      siteOrigin: "https://ferupis.pages.dev",
    });

    expect(rendered.subject).toBe("Email delivery test — Ferupis");
    expect(rendered.html).toContain("Email delivery verified");
    expect(rendered.text).toContain("Environment: production");
  });
});
