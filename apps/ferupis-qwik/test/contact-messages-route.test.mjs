import assert from "node:assert/strict";
import { register } from "node:module";
import test from "node:test";

register("./app-module-loader.mjs", import.meta.url);

const { onPost, onRequest } = await import(
  "../src/routes/api/contact/messages/index.ts"
);

const REQUEST_ID = "d41895d2-1c9e-4d0c-911d-8eec09f6c6b4";
const TEST_CONTACT_EMAIL = "giulio.marinelli@icloud.com";
const CONTACT_EMAIL = "ferupiss@gmail.com";

const validInput = () => ({
  requestId: REQUEST_ID,
  name: "Mario Rossi",
  email: "mario.rossi@example.com",
  subject: "Informazioni sul miele",
  message: "Buongiorno, vorrei alcune informazioni.",
  privacyAccepted: true,
});

const createQueue = ({ fail = false } = {}) => {
  const calls = [];

  return {
    calls,
    binding: {
      async send(message, options) {
        calls.push({ message, options });
        if (fail) throw new Error("queue unavailable");
      },
      async sendBatch() {},
    },
  };
};

const createRequestEvent = ({
  body = validInput(),
  env = {},
  headers = {},
  method = "POST",
  origin = "https://ferupis.pages.dev",
} = {}) => {
  const requestHeaders = new Headers(headers);
  const requestInit = { method, headers: requestHeaders };

  if (body !== undefined && method !== "GET" && method !== "HEAD") {
    if (!requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const url = new URL("/api/contact/messages/", origin);
  const responses = [];
  const event = {
    headers: new Headers(),
    json(status, payload) {
      responses.push({ status, payload });
    },
    platform: { env },
    request: new Request(url, requestInit),
    url,
  };

  return { event, responses };
};

const invokeRoute = async (input) => {
  const invocation = createRequestEvent(input);
  await onRequest(invocation.event);

  if (
    invocation.event.request.method === "POST" &&
    invocation.responses.length === 0
  ) {
    await onPost(invocation.event);
  }

  return invocation;
};

const withFetch = async (implementation, callback) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = implementation;

  try {
    return await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
};

const unexpectedFetch = async () => {
  throw new Error("Turnstile must not be called");
};

const turnstileFetch = ({ hostname, success = true } = {}) => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({
      url: String(url),
      init,
      body: JSON.parse(String(init?.body)),
    });

    return Response.json(
      success
        ? {
            success: true,
            action: "contact_submit",
            hostname,
          }
        : {
            success: false,
            "error-codes": ["invalid-input-response"],
          },
    );
  };

  return { calls, fetch };
};

const assertResponse = (responses, status, payload) => {
  assert.deepEqual(responses, [{ status, payload }]);
};

test("contact message route composes HTTP, Turnstile and Queue behavior", async (t) => {
  await t.test(
    "applies API headers and rejects methods other than POST",
    async () => {
      const { event, responses } = await invokeRoute({
        body: undefined,
        method: "GET",
      });

      assertResponse(responses, 405, {
        ok: false,
        code: "METHOD_NOT_ALLOWED",
      });
      assert.equal(event.headers.get("Allow"), "POST");
      assert.equal(
        event.headers.get("Cache-Control"),
        "private, no-store, max-age=0, must-revalidate",
      );
      assert.equal(
        event.headers.get("Cross-Origin-Resource-Policy"),
        "same-origin",
      );
      assert.equal(event.headers.get("Referrer-Policy"), "no-referrer");
      assert.equal(event.headers.get("X-Content-Type-Options"), "nosniff");
      assert.equal(event.headers.get("X-Frame-Options"), "DENY");
    },
  );

  await t.test(
    "rejects a cross-origin request before parsing or services",
    async () => {
      await withFetch(unexpectedFetch, async () => {
        const { responses } = await invokeRoute({
          headers: {
            Origin: "https://attacker.example",
            "Sec-Fetch-Site": "cross-site",
          },
        });

        assertResponse(responses, 403, {
          ok: false,
          code: "REQUEST_INVALID",
        });
      });
    },
  );

  await t.test(
    "returns parser and validation failures without using services",
    async () => {
      await withFetch(unexpectedFetch, async () => {
        const unsupported = await invokeRoute({
          body: "not json",
          headers: { "Content-Type": "text/plain" },
        });
        assertResponse(unsupported.responses, 415, {
          ok: false,
          code: "CONTENT_TYPE_UNSUPPORTED",
        });

        const invalid = await invokeRoute({
          body: { ...validInput(), email: "invalid", privacyAccepted: false },
        });
        assertResponse(invalid.responses, 400, {
          ok: false,
          code: "INVALID_INPUT",
          issues: [
            { field: "email", code: "invalid" },
            { field: "privacyAccepted", code: "required" },
          ],
        });
      });
    },
  );

  await t.test("returns 503 when runtime bindings are incomplete", async () => {
    await withFetch(unexpectedFetch, async () => {
      const missingQueue = await invokeRoute({
        env: {
          APP_ENV: "production",
          CF_TURNSTILE_SECRET_KEY: "secret",
          TURNSTILE_EXPECTED_HOSTNAME: "ferupis.pages.dev",
        },
      });
      assertResponse(missingQueue.responses, 503, {
        ok: false,
        code: "TEMPORARY_FAILURE",
      });

      const queue = createQueue();
      const missingSecret = await invokeRoute({
        env: {
          APP_ENV: "production",
          EMAIL_QUEUE: queue.binding,
          TURNSTILE_EXPECTED_HOSTNAME: "ferupis.pages.dev",
        },
      });
      assertResponse(missingSecret.responses, 503, {
        ok: false,
        code: "TEMPORARY_FAILURE",
      });
      assert.equal(queue.calls.length, 0);
    });
  });

  await t.test(
    "returns 503 when the production Turnstile hostname is missing",
    async () => {
      const queue = createQueue();

      await withFetch(unexpectedFetch, async () => {
        const { responses } = await invokeRoute({
          env: {
            APP_ENV: "production",
            CF_TURNSTILE_SECRET_KEY: "secret",
            EMAIL_QUEUE: queue.binding,
          },
        });

        assertResponse(responses, 503, {
          ok: false,
          code: "TEMPORARY_FAILURE",
        });
        assert.equal(queue.calls.length, 0);
      });
    },
  );

  await t.test("returns 400 when Turnstile rejects the challenge", async () => {
    const queue = createQueue();
    const turnstile = turnstileFetch({
      hostname: "ferupis.pages.dev",
      success: false,
    });

    await withFetch(turnstile.fetch, async () => {
      const { responses } = await invokeRoute({
        env: {
          APP_ENV: "production",
          CF_TURNSTILE_SECRET_KEY: "secret",
          EMAIL_QUEUE: queue.binding,
          TURNSTILE_EXPECTED_HOSTNAME: "ferupis.pages.dev",
        },
        headers: {
          "X-Turnstile-Challenge-Token": "invalid-token",
        },
      });

      assertResponse(responses, 400, {
        ok: false,
        code: "TURNSTILE_VERIFICATION_FAILED",
      });
      assert.equal(turnstile.calls.length, 1);
      assert.equal(queue.calls.length, 0);
    });
  });

  await t.test(
    "returns 503 when the Queue producer rejects the message",
    async () => {
      const queue = createQueue({ fail: true });
      const turnstile = turnstileFetch({ hostname: "ferupis.pages.dev" });

      await withFetch(turnstile.fetch, async () => {
        const { responses } = await invokeRoute({
          env: {
            APP_ENV: "production",
            CF_TURNSTILE_SECRET_KEY: "secret",
            EMAIL_QUEUE: queue.binding,
            TURNSTILE_EXPECTED_HOSTNAME: "ferupis.pages.dev",
          },
          headers: {
            "X-Turnstile-Challenge-Token": "valid-token",
          },
        });

        assertResponse(responses, 503, {
          ok: false,
          code: "NOTIFICATION_QUEUE_UNAVAILABLE",
        });
        assert.equal(turnstile.calls.length, 1);
        assert.equal(queue.calls.length, 1);
      });
    },
  );

  for (const scenario of [
    {
      appEnvironment: "dev",
      expectedRecipient: TEST_CONTACT_EMAIL,
      hostname: "localhost",
      origin: "http://localhost:5173",
      secret: undefined,
    },
    {
      appEnvironment: "preview",
      expectedRecipient: TEST_CONTACT_EMAIL,
      hostname: "preview.ferupis.pages.dev",
      origin: "https://preview.ferupis.pages.dev",
      secret: "preview-secret",
    },
    {
      appEnvironment: "production",
      expectedRecipient: CONTACT_EMAIL,
      hostname: "ferupis.pages.dev",
      origin: "https://ferupis.pages.dev",
      secret: "production-secret",
    },
  ]) {
    await t.test(
      `queues a 202 response for ${scenario.appEnvironment} with the intended recipient`,
      async () => {
        const queue = createQueue();
        const turnstile = turnstileFetch({ hostname: scenario.hostname });

        await withFetch(turnstile.fetch, async () => {
          const { responses } = await invokeRoute({
            env: {
              APP_ENV: scenario.appEnvironment,
              CF_TURNSTILE_SECRET_KEY: scenario.secret,
              EMAIL_QUEUE: queue.binding,
              TURNSTILE_EXPECTED_HOSTNAME:
                scenario.appEnvironment === "dev"
                  ? undefined
                  : scenario.hostname,
            },
            headers: {
              Origin: scenario.origin,
              "Sec-Fetch-Site": "same-origin",
              "X-Turnstile-Challenge-Token": "valid-token",
            },
            origin: scenario.origin,
          });

          assertResponse(responses, 202, {
            ok: true,
            requestId: REQUEST_ID,
          });
          assert.equal(turnstile.calls.length, 1);
          assert.equal(
            turnstile.calls[0].url,
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          );
          assert.equal(
            turnstile.calls[0].body.secret,
            scenario.appEnvironment === "dev"
              ? "1x0000000000000000000000000000000AA"
              : scenario.secret,
          );
          assert.equal(turnstile.calls[0].body.response, "valid-token");

          assert.equal(queue.calls.length, 1);
          assert.equal(
            queue.calls[0].message.recipient.email,
            scenario.expectedRecipient,
          );
          assert.equal(queue.calls[0].message.notificationId, REQUEST_ID);
          assert.equal(
            queue.calls[0].message.metadata.correlationId,
            REQUEST_ID,
          );
          assert.deepEqual(queue.calls[0].options, { contentType: "json" });
        });
      },
    );
  }
});
