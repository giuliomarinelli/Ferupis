import type { RequestHandler } from "@builder.io/qwik-city";
import {
  applyContactMessageApiHeaders,
  enqueueContactMessage,
  isContactMessageHoneypotTriggered,
  isContactMessageSameOriginRequest,
  parseContactMessageJsonBody,
  validateContactMessageSubmission,
} from "@gm/qwik-core/contact-message";
import {
  requireTurnstile,
  resolveTurnstileExpectedHostname,
} from "@gm/qwik-core/security";
import { resolveContactRuntimeEnv } from "~/server/contact-runtime";
import { CONTACT_EMAIL } from "~/site-config";

const TURNSTILE_ACTION_CONTACT_SUBMIT = "contact_submit";
const TURNSTILE_TEST_SECRET_ALWAYS_PASSES =
  "1x0000000000000000000000000000000AA";

export const onRequest: RequestHandler = (event) => {
  applyContactMessageApiHeaders(event.headers);
  if (event.request.method === "POST") return;
  event.headers.set("Allow", "POST");
  event.json(405, { ok: false, code: "METHOD_NOT_ALLOWED" });
};

export const onPost: RequestHandler = async (event) => {
  if (!isContactMessageSameOriginRequest(event.request, event.url.origin)) {
    event.json(403, { ok: false, code: "REQUEST_INVALID" });
    return;
  }

  const parsed = await parseContactMessageJsonBody(event.request);
  if (!parsed.ok) {
    event.json(parsed.status, { ok: false, code: parsed.code });
    return;
  }

  if (isContactMessageHoneypotTriggered(parsed.body)) {
    console.info(
      JSON.stringify({ event: "contact_message_create", outcome: "SPAM_TRAP" }),
    );
    event.json(202, { ok: true, requestId: crypto.randomUUID() });
    return;
  }

  const validation = validateContactMessageSubmission(parsed.body);
  if (!validation.ok) {
    event.json(400, {
      ok: false,
      code: "INVALID_INPUT",
      issues: validation.issues,
    });
    return;
  }

  const env = resolveContactRuntimeEnv(event.platform);
  if (!env.EMAIL_QUEUE || !env.CF_TURNSTILE_SECRET_KEY) {
    event.json(503, { ok: false, code: "TEMPORARY_FAILURE" });
    return;
  }

  const turnstileHostname = resolveTurnstileExpectedHostname({
    appEnvironment: env.APP_ENV,
    configuredHostname: env.TURNSTILE_EXPECTED_HOSTNAME,
  });
  if (!turnstileHostname.ok) {
    event.json(503, { ok: false, code: "TEMPORARY_FAILURE" });
    return;
  }

  const turnstile = await requireTurnstile({
    request: event.request,
    secret: env.CF_TURNSTILE_SECRET_KEY,
    expectedHostname: turnstileHostname.expectedHostname,
    expectedAction:
      env.CF_TURNSTILE_SECRET_KEY === TURNSTILE_TEST_SECRET_ALWAYS_PASSES
        ? undefined
        : TURNSTILE_ACTION_CONTACT_SUBMIT,
  });
  if (!turnstile.ok) {
    event.json(400, {
      ok: false,
      code: "TURNSTILE_VERIFICATION_FAILED",
    });
    return;
  }

  const result = await enqueueContactMessage(validation.value, {
    emailQueue: env.EMAIL_QUEUE,
    internalNotificationEmail: CONTACT_EMAIL,
  });

  if (!result.ok) {
    console.warn(
      JSON.stringify({
        event: "contact_message_create",
        outcome: result.code,
        requestId: validation.value.requestId,
      }),
    );
    event.json(503, { ok: false, code: result.code });
    return;
  }

  console.log(
    JSON.stringify({
      event: "contact_message_create",
      outcome: "QUEUED",
      requestId: result.requestId,
    }),
  );
  event.json(202, result);
};
