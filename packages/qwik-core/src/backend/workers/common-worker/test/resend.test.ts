import { describe, expect, it } from "vitest";
import {
  ResendRequestError,
  sendResendEmail,
  type FetchLike,
} from "../src/email";

const INPUT = {
  apiKey: "re_test_key",
  from: "Ferupis <noreply@giuliomarinelli.com>",
  replyTo: "ferupiss@gmail.com",
  to: { email: "recipient@example.com", name: "Recipient" },
  subject: "Subject",
  html: "<p>Message</p>",
  text: "Message",
  idempotencyKey: "4bf92f37-0987-4f2b-8b0b-b5791d9e15cf",
  tags: [{ name: "environment", value: "preview" }],
} as const;

describe("Resend REST client", () => {
  it("sends the required headers and maps a successful response", async () => {
    let request: Request | undefined;
    const fetcher: FetchLike = async (input, init) => {
      request = new Request(input, init);
      return Response.json({ id: "resend-email-id" });
    };

    await expect(sendResendEmail(INPUT, fetcher)).resolves.toEqual({
      id: "resend-email-id",
    });

    expect(request?.url).toBe("https://api.resend.com/emails");
    expect(request?.method).toBe("POST");
    expect(request?.headers.get("authorization")).toBe("Bearer re_test_key");
    expect(request?.headers.get("idempotency-key")).toBe(INPUT.idempotencyKey);
    expect(request?.headers.get("user-agent")).toBe("ferupis-common-worker/1");
    await expect(request?.json()).resolves.toMatchObject({
      from: INPUT.from,
      to: ["Recipient <recipient@example.com>"],
      reply_to: INPUT.replyTo,
      subject: INPUT.subject,
      html: INPUT.html,
      text: INPUT.text,
    });
  });

  it("classifies provider rate limits as retryable", async () => {
    const fetcher: FetchLike = async () =>
      Response.json(
        { type: "rate_limit_exceeded", message: "Slow down" },
        { status: 429, headers: { "Retry-After": "42" } },
      );

    const error = await sendResendEmail(INPUT, fetcher).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(ResendRequestError);
    expect(error).toMatchObject({
      status: 429,
      providerType: "rate_limit_exceeded",
      retryAfterSeconds: 42,
      retryable: true,
    });
  });

  it("classifies validation errors as permanent", async () => {
    const fetcher: FetchLike = async () =>
      Response.json(
        { type: "validation_error", message: "Invalid from" },
        { status: 400 },
      );

    const error = await sendResendEmail(INPUT, fetcher).catch(
      (caught: unknown) => caught,
    );

    expect(error).toMatchObject({
      status: 400,
      providerType: "validation_error",
      retryable: false,
    });
  });

  it("classifies network failures as retryable", async () => {
    const fetcher: FetchLike = async () => {
      throw new Error("offline");
    };

    const error = await sendResendEmail(INPUT, fetcher).catch(
      (caught: unknown) => caught,
    );

    expect(error).toMatchObject({
      message: "RESEND_NETWORK_FAILURE",
      retryable: true,
    });
  });
});
