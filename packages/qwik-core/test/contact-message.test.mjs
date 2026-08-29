import assert from "node:assert/strict";
import test from "node:test";

import {
  CONTACT_MESSAGE_MAX_BODY_BYTES,
  enqueueContactMessage,
  isContactMessageSameOriginRequest,
  parseContactMessageJsonBody,
  validateContactMessageSubmission,
} from "@gm/qwik-core/contact-message";

const REQUEST_ID = "d41895d2-1c9e-4d0c-911d-8eec09f6c6b4";

const validInput = () => ({
  requestId: REQUEST_ID,
  name: "  Mario   Rossi  ",
  email: "MARIO.ROSSI@example.com",
  subject: "  Informazioni sul miele  ",
  message: "Buongiorno,\r\nvorrei alcune informazioni.\n\nGrazie.",
  privacyAccepted: true,
});

test("contact submissions are normalized and validated strictly", () => {
  const result = validateContactMessageSubmission(validInput());

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.deepEqual(result.value, {
    requestId: REQUEST_ID,
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    subject: "Informazioni sul miele",
    message: "Buongiorno,\nvorrei alcune informazioni.\n\nGrazie.",
    privacyAccepted: true,
  });
});

test("contact submissions reject unexpected fields, invalid email and control characters", () => {
  assert.equal(
    validateContactMessageSubmission({ ...validInput(), role: "admin" }).ok,
    false,
  );
  assert.equal(
    validateContactMessageSubmission({ ...validInput(), email: "not-an-email" })
      .ok,
    false,
  );
  assert.equal(
    validateContactMessageSubmission({
      ...validInput(),
      subject: "Hello\nBcc: attacker@example.com",
    }).ok,
    false,
  );
  assert.equal(
    validateContactMessageSubmission({
      ...validInput(),
      message: "Hello\u0000world",
    }).ok,
    false,
  );
  assert.equal(
    validateContactMessageSubmission({
      ...validInput(),
      privacyAccepted: false,
    }).ok,
    false,
  );
});

test("contact JSON parsing enforces content type and the real streamed body limit", async () => {
  const validRequest = new Request("https://ferupis.example/api/contact/messages/", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(validInput()),
  });
  const parsed = await parseContactMessageJsonBody(validRequest);
  assert.equal(parsed.ok, true);

  const wrongType = await parseContactMessageJsonBody(
    new Request("https://ferupis.example/api/contact/messages/", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "{}",
    }),
  );
  assert.deepEqual(wrongType, {
    ok: false,
    status: 415,
    code: "CONTENT_TYPE_UNSUPPORTED",
  });

  const oversized = await parseContactMessageJsonBody(
    new Request("https://ferupis.example/api/contact/messages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "x".repeat(CONTACT_MESSAGE_MAX_BODY_BYTES) }),
    }),
  );
  assert.equal(oversized.ok, false);
  if (!oversized.ok) assert.equal(oversized.status, 413);
});

test("same-origin protection rejects cross-site browser requests", () => {
  assert.equal(
    isContactMessageSameOriginRequest(
      new Request("https://ferupis.example/api/contact/messages/", {
        headers: {
          Origin: "https://ferupis.example",
          "Sec-Fetch-Site": "same-origin",
        },
      }),
      "https://ferupis.example",
    ),
    true,
  );

  assert.equal(
    isContactMessageSameOriginRequest(
      new Request("https://ferupis.example/api/contact/messages/", {
        headers: {
          Origin: "https://evil.example",
          "Sec-Fetch-Site": "cross-site",
        },
      }),
      "https://ferupis.example",
    ),
    false,
  );
});

test("validated contact messages enqueue one typed internal notification", async () => {
  const validation = validateContactMessageSubmission(validInput());
  assert.equal(validation.ok, true);
  if (!validation.ok) return;

  const calls = [];
  const result = await enqueueContactMessage(validation.value, {
    internalNotificationEmail: "ferupiss@gmail.com",
    now: new Date("2026-08-29T11:00:00.000Z"),
    emailQueue: {
      async send(message, options) {
        calls.push({ message, options });
      },
      async sendBatch() {},
    },
  });

  assert.deepEqual(result, { ok: true, requestId: REQUEST_ID });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].message.template, "contact-message-internal");
  assert.equal(calls[0].message.notificationId, REQUEST_ID);
  assert.equal(calls[0].message.metadata.correlationId, REQUEST_ID);
  assert.equal(calls[0].message.recipient.email, "ferupiss@gmail.com");
  assert.deepEqual(calls[0].message.payload, {
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    subject: "Informazioni sul miele",
    message: "Buongiorno,\nvorrei alcune informazioni.\n\nGrazie.",
  });
  assert.deepEqual(calls[0].options, { contentType: "json" });
});
