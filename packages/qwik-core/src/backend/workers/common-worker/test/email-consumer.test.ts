import {
  createExecutionContext,
  createMessageBatch,
  getQueueResult,
} from "cloudflare:test";
import {
  createEmailContactMessageInternalJob,
  createEmailDeliveryTestJob,
} from "@gm/qwik-core/email";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  consumeEmailBatch,
  type EmailConsumerEnv,
  type FetchLike,
} from "../src/email";

const JOB = createEmailDeliveryTestJob({
  locale: "it",
  recipient: { email: "recipient@example.com" },
  source: "test.consumer",
  notificationId: "4bf92f37-0987-4f2b-8b0b-b5791d9e15cf",
  correlationId: "d41895d2-1c9e-4d0c-911d-8eec09f6c6b4",
  enqueuedAt: "2026-08-29T07:00:00.000Z",
});

const CONTACT_JOB = createEmailContactMessageInternalJob({
  locale: "it",
  recipient: { email: "ferupiss@gmail.com" },
  name: "Mario Rossi",
  email: "mario@example.com",
  subject: null,
  message: "Vorrei alcune informazioni.",
  source: "ferupis.contact",
  notificationId: "efba9128-60d6-48a4-a558-a8cd52155146",
  correlationId: "efba9128-60d6-48a4-a558-a8cd52155146",
  enqueuedAt: "2026-08-29T07:00:00.000Z",
});

const RESEND_ENV = {
  APP_ENV: "production",
  EMAIL_DELIVERY_MODE: "resend",
  EMAIL_FROM: "Ferupis <noreply@ferupis.com>",
  EMAIL_REPLY_TO: "ferupiss@gmail.com",
  RESEND_API_KEY: "re_test_key",
  SITE_ORIGIN: "https://ferupis.pages.dev",
} satisfies EmailConsumerEnv;

const consume = async (
  body: unknown,
  env: EmailConsumerEnv,
  fetcher: FetchLike,
) => {
  const batch = createMessageBatch("ferupis-email-test", [
    {
      id: "message-1",
      timestamp: new Date("2026-08-29T07:00:01.000Z"),
      attempts: 1,
      body,
    },
  ]);
  const ctx = createExecutionContext();
  await consumeEmailBatch(batch, env, fetcher);
  return getQueueResult(batch, ctx);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("email queue consumer", () => {
  it("acknowledges messages accepted by Resend", async () => {
    const fetcher = vi.fn<FetchLike>(async () =>
      Response.json({ id: "resend-email-id" }),
    );

    const result = await consume(JOB, RESEND_ENV, fetcher);

    expect(fetcher).toHaveBeenCalledOnce();
    expect(result.explicitAcks).toEqual(["message-1"]);
    expect(result.retryMessages).toEqual([]);
  });

  it("uses the validated visitor email as Reply-To only for contact jobs", async () => {
    let resendBody: Record<string, unknown> | undefined;
    const fetcher = vi.fn<FetchLike>(async (_input, init) => {
      resendBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return Response.json({ id: "resend-contact-email-id" });
    });

    const result = await consume(CONTACT_JOB, RESEND_ENV, fetcher);

    expect(result.explicitAcks).toEqual(["message-1"]);
    expect(resendBody?.reply_to).toBe("mario@example.com");
    expect(resendBody?.to).toEqual(["ferupiss@gmail.com"]);
  });

  it("sends preview messages through Resend", async () => {
    const fetcher = vi.fn<FetchLike>(async () =>
      Response.json({ id: "resend-preview-email-id" }),
    );
    const result = await consume(
      JOB,
      {
        ...RESEND_ENV,
        APP_ENV: "preview",
        SITE_ORIGIN: "https://preview.ferupis.pages.dev",
      },
      fetcher,
    );

    expect(fetcher).toHaveBeenCalledOnce();
    expect(result.explicitAcks).toEqual(["message-1"]);
    expect(result.retryMessages).toEqual([]);
  });

  it("retries rate-limited messages using Retry-After", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetcher: FetchLike = async () =>
      Response.json(
        { type: "rate_limit_exceeded", message: "Slow down" },
        { status: 429, headers: { "Retry-After": "42" } },
      );

    const result = await consume(JOB, RESEND_ENV, fetcher);

    expect(result.explicitAcks).toEqual([]);
    expect(result.retryMessages).toHaveLength(1);
    expect(result.retryMessages[0]).toEqual({ msgId: "message-1" });
    expect(JSON.parse(String(errorLog.mock.calls[0]?.[0]))).toMatchObject({
      messageId: "message-1",
      delaySeconds: 42,
    });
  });

  it("retries invalid jobs so the configured DLQ can retain them", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetcher = vi.fn<FetchLike>();
    const result = await consume({ invalid: true }, RESEND_ENV, fetcher);

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.explicitAcks).toEqual([]);
    expect(result.retryMessages).toHaveLength(1);
    expect(result.retryMessages[0]).toEqual({ msgId: "message-1" });
    expect(JSON.parse(String(errorLog.mock.calls[0]?.[0]))).toMatchObject({
      messageId: "message-1",
      delaySeconds: 300,
    });
  });
});
