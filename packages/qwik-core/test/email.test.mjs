import assert from "node:assert/strict";
import test from "node:test";

import {
  createEmailContactMessageInternalJob,
  createEmailDeliveryTestJob,
  enqueueEmailJob,
  enqueueEmailJobs,
  isEmailJob,
} from "@gm/qwik-core/email";

const FIXED_NOTIFICATION_ID = "4bf92f37-0987-4f2b-8b0b-b5791d9e15cf";
const FIXED_CORRELATION_ID = "d41895d2-1c9e-4d0c-911d-8eec09f6c6b4";
const FIXED_ENQUEUED_AT = "2026-08-29T07:00:00.000Z";

const createJob = () =>
  createEmailDeliveryTestJob({
    locale: "it",
    recipient: { email: "recipient@example.com", name: "Recipient" },
    source: "test.email",
    notificationId: FIXED_NOTIFICATION_ID,
    correlationId: FIXED_CORRELATION_ID,
    enqueuedAt: FIXED_ENQUEUED_AT,
  });

const createContactJob = () =>
  createEmailContactMessageInternalJob({
    locale: "it",
    recipient: { email: "ferupiss@gmail.com" },
    name: "Mario Rossi",
    email: "mario@example.com",
    subject: "Informazioni",
    message: "Prima riga\nSeconda riga",
    source: "ferupis.contact",
    notificationId: FIXED_NOTIFICATION_ID,
    correlationId: FIXED_CORRELATION_ID,
    enqueuedAt: FIXED_ENQUEUED_AT,
  });

test("email jobs are versioned, deterministic and runtime-validatable", () => {
  const job = createJob();

  assert.equal(isEmailJob(job), true);
  assert.deepEqual(job, {
    schemaVersion: 1,
    notificationId: FIXED_NOTIFICATION_ID,
    template: "delivery-test",
    templateVersion: 1,
    locale: "it",
    recipient: {
      email: "recipient@example.com",
      name: "Recipient",
    },
    payload: {},
    metadata: {
      source: "test.email",
      correlationId: FIXED_CORRELATION_ID,
      enqueuedAt: FIXED_ENQUEUED_AT,
    },
  });
});

test("contact email jobs preserve multiline messages without exposing mail headers", () => {
  const job = createContactJob();

  assert.equal(isEmailJob(job), true);
  assert.equal(job.template, "contact-message-internal");
  assert.equal(job.payload.message, "Prima riga\nSeconda riga");
  assert.equal("replyTo" in job, false);
  assert.equal("subject" in job, false);
});

test("email jobs reject unknown fields and header injection", () => {
  const job = createJob();
  const contactJob = createContactJob();

  assert.equal(isEmailJob({ ...job, subject: "Injected subject" }), false);
  assert.equal(
    isEmailJob({
      ...job,
      recipient: {
        email: "recipient@example.com\r\nBcc: attacker@example.com",
      },
    }),
    false,
  );
  assert.equal(
    isEmailJob({ ...job, metadata: { ...job.metadata, source: "bad source" } }),
    false,
  );
  assert.equal(
    isEmailJob({
      ...contactJob,
      payload: {
        ...contactJob.payload,
        subject: "Hello\r\nBcc: attacker@example.com",
      },
    }),
    false,
  );
});

test("the producer awaits durable queue publication with JSON content", async () => {
  const job = createJob();
  const calls = [];
  const queue = {
    async send(message, options) {
      calls.push({ message, options });
    },
    async sendBatch() {},
  };

  await enqueueEmailJob(queue, job);

  assert.deepEqual(calls, [
    {
      message: job,
      options: { contentType: "json" },
    },
  ]);
});

test("the producer publishes validated jobs as one queue batch", async () => {
  const job = createJob();
  const calls = [];

  await enqueueEmailJobs(
    {
      async send() {},
      async sendBatch(messages) {
        calls.push([...messages]);
      },
    },
    [job],
  );

  assert.deepEqual(calls, [[{ body: job, contentType: "json" }]]);
});
