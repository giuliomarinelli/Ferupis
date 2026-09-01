import assert from "node:assert/strict";
import test from "node:test";

import {
  isSameOriginRequest,
  requireTurnstile,
  resolveTurnstileExpectedHostname,
  verifyTurnstileChallenge,
} from "@gm/qwik-core/security";

test("Turnstile hostname configuration is mandatory outside development", () => {
  assert.deepEqual(
    resolveTurnstileExpectedHostname({
      appEnvironment: "production",
      configuredHostname: "ferupis.pages.dev",
    }),
    { ok: true, expectedHostname: "ferupis.pages.dev" },
  );

  assert.deepEqual(
    resolveTurnstileExpectedHostname({
      appEnvironment: "production",
      configuredHostname: undefined,
    }),
    { ok: false, reason: "expected_hostname_unavailable" },
  );

  assert.deepEqual(
    resolveTurnstileExpectedHostname({
      appEnvironment: "dev",
      configuredHostname: undefined,
    }),
    { ok: true, expectedHostname: undefined },
  );
});

test("Turnstile uses the always-passing test secret in development", async (t) => {
  const originalFetch = globalThis.fetch;

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));

    assert.equal(body.secret, "1x0000000000000000000000000000000AA");
    assert.equal(body.response, "XXXX.DUMMY.TOKEN.XXXX");

    return Response.json({
      success: true,
      hostname: "localhost",
      action: "test",
    });
  };

  assert.deepEqual(
    await requireTurnstile({
      request: new Request("http://localhost/api/contact/messages/", {
        headers: {
          "X-Turnstile-Challenge-Token": "XXXX.DUMMY.TOKEN.XXXX",
        },
      }),
      appEnvironment: "dev",
      secret: undefined,
      expectedAction: "contact_submit",
    }),
    {
      ok: true,
      hostname: "localhost",
      action: "test",
      challengeTs: undefined,
    },
  );
});

test("Turnstile still requires a configured secret outside development", async () => {
  assert.deepEqual(
    await requireTurnstile({
      request: new Request("https://ferupis.pages.dev/api/contact/messages/", {
        headers: {
          "X-Turnstile-Challenge-Token": "token",
        },
      }),
      appEnvironment: "production",
      secret: undefined,
      expectedHostname: "ferupis.pages.dev",
      expectedAction: "contact_submit",
    }),
    { ok: false, reason: "missing_secret" },
  );
});

test("Turnstile rejects missing and overlong tokens before Siteverify", async (t) => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () => {
    fetchCalls += 1;
    return Response.json({ success: true });
  };

  assert.deepEqual(
    await requireTurnstile({
      request: new Request("https://ferupis.pages.dev/api/contact/messages/"),
      appEnvironment: "production",
      secret: "secret",
      expectedAction: "contact_submit",
      expectedHostname: "ferupis.pages.dev",
    }),
    { ok: false, reason: "missing_token" },
  );
  assert.deepEqual(
    await requireTurnstile({
      request: new Request("https://ferupis.pages.dev/api/contact/messages/", {
        headers: {
          "X-Turnstile-Challenge-Token": "x".repeat(2049),
        },
      }),
      appEnvironment: "production",
      secret: "secret",
      expectedAction: "contact_submit",
      expectedHostname: "ferupis.pages.dev",
    }),
    {
      ok: false,
      reason: "invalid_token",
      errorCodes: ["token-too-long"],
    },
  );
  assert.equal(fetchCalls, 0);
});

test("Turnstile rejects successful challenges with the wrong action or hostname", async (t) => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () => {
    fetchCalls += 1;
    return Response.json(
      fetchCalls === 1
        ? {
            success: true,
            action: "unexpected_action",
            hostname: "ferupis.pages.dev",
          }
        : {
            success: true,
            action: "contact_submit",
            hostname: "attacker.example",
          },
    );
  };

  assert.deepEqual(
    await verifyTurnstileChallenge({
      token: "token",
      secret: "secret",
      expectedAction: "contact_submit",
      expectedHostname: "ferupis.pages.dev",
    }),
    {
      ok: false,
      reason: "siteverify_failed",
      errorCodes: ["action-mismatch"],
    },
  );
  assert.deepEqual(
    await verifyTurnstileChallenge({
      token: "token",
      secret: "secret",
      expectedAction: "contact_submit",
      expectedHostname: "ferupis.pages.dev",
    }),
    {
      ok: false,
      reason: "siteverify_failed",
      errorCodes: ["hostname-mismatch"],
    },
  );
});

test("Turnstile maps network and aborted Siteverify requests deterministically", async (t) => {
  const originalFetch = globalThis.fetch;

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () => {
    throw new TypeError("offline");
  };
  assert.deepEqual(
    await verifyTurnstileChallenge({ token: "token", secret: "secret" }),
    {
      ok: false,
      reason: "network_error",
      errorCodes: ["internal-error"],
    },
  );

  globalThis.fetch = async () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    throw error;
  };
  assert.deepEqual(
    await verifyTurnstileChallenge({ token: "token", secret: "secret" }),
    {
      ok: false,
      reason: "timeout",
      errorCodes: ["siteverify-timeout"],
    },
  );
});

test("same-origin validation compares canonical HTTP origins", () => {
  const sameOrigin = new Request(
    "https://ferupis.pages.dev/api/contact/messages/",
    {
      headers: {
        Origin: "https://ferupis.pages.dev",
        "Sec-Fetch-Site": "same-origin",
      },
    },
  );
  const crossOrigin = new Request(
    "https://ferupis.pages.dev/api/contact/messages/",
    {
      headers: {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
      },
    },
  );

  assert.equal(
    isSameOriginRequest(sameOrigin, "https://ferupis.pages.dev"),
    true,
  );
  assert.equal(
    isSameOriginRequest(crossOrigin, "https://ferupis.pages.dev"),
    false,
  );
});
