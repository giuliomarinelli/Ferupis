# Common worker email service

This module consumes versioned email jobs from Cloudflare Queues, renders the
selected template with React Email, and sends the resulting HTML and plain-text
message through Resend's REST API.

## Runtime flow

1. Server-side application code creates a job with an explicit factory such as
   `createEmailDeliveryTestJob()`.
2. `enqueueEmailJob()` or `enqueueEmailJobs()` awaits durable queue publication.
3. The common worker validates every queue message at runtime.
4. React Email renders HTML and plain text inside the queue consumer.
5. The consumer calls `POST https://api.resend.com/emails` with the job's
   `notificationId` as `Idempotency-Key`.
6. Successful messages are acknowledged. Failures are retried per message and
   eventually reach the configured dead-letter queue.

The producer result means **queued**, not delivered. Resend acceptance is logged
as `ACCEPTED_BY_RESEND`; inbox delivery requires a future verified webhook.

## Security boundary

- `RESEND_API_KEY` exists only on the common worker, never on the Pages project.
- Producers select a compiled template. They do not enqueue arbitrary HTML,
  subjects, headers, or reply-to values.
- A public form must never pass a user-controlled recipient directly into a
  generic action. The recipient must be derived by trusted server-side logic.
- Logs contain correlation and provider IDs, but not recipients or message
  content.

## Environment configuration

The Wrangler configuration declares `APP_ENV`, `EMAIL_DELIVERY_MODE`,
`EMAIL_FROM`, `EMAIL_REPLY_TO`, and `SITE_ORIGIN`. `RESEND_API_KEY` is a secret.
Local development reads it from `.dev.vars`; the committed
`.dev.vars.example` contains only a placeholder.

Set deployed secrets interactively, without placing the value on the command
line:

```powershell
npx wrangler secret put RESEND_API_KEY --config packages/qwik-core/src/backend/workers/common-worker/wrangler.jsonc --env preview
npx wrangler secret put RESEND_API_KEY --config packages/qwik-core/src/backend/workers/common-worker/wrangler.jsonc --env production
```

The configured sender is `Ferupis <noreply@giuliomarinelli.com>` and the reply-to
address is `ferupiss@gmail.com`. Verify the sender domain in Resend before remote
deployment.

## Cloudflare resources

The code expects these independent resources:

- `ferupis-email-dev` and `ferupis-email-dev-dlq`
- `ferupis-email-preview` and `ferupis-email-preview-dlq`
- `ferupis-email-production` and `ferupis-email-production-dlq`

Provision them before the first remote deployment. Resource creation is
deliberately not part of builds or tests.

## Adding a template

1. Add a new discriminated job member and runtime validator in
   `@gm/qwik-core/email`.
2. Add an explicit template version. Never mutate the meaning of an existing
   version while messages may still be queued.
3. Add the React Email component and localized subject to the worker registry.
4. Add HTML, plain-text, REST payload, and queue retry tests.
5. Expose a template-specific producer factory; do not expose a generic public
   email action.

## Local testing limitation

Cloudflare Pages can publish to a local Queue, but Wrangler cannot run a Pages
producer and a separate Worker consumer against the same local Queue. Consumer
tests therefore use `createMessageBatch()` in Workerd. Validate the complete
producer-to-consumer path in preview.
