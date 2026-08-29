import assert from "node:assert/strict";
import test from "node:test";

import {
  isSameOriginRequest,
  resolveTurnstileExpectedHostname,
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

test("same-origin validation compares canonical HTTP origins", () => {
  const sameOrigin = new Request("https://ferupis.pages.dev/api/contact/messages/", {
    headers: {
      Origin: "https://ferupis.pages.dev",
      "Sec-Fetch-Site": "same-origin",
    },
  });
  const crossOrigin = new Request("https://ferupis.pages.dev/api/contact/messages/", {
    headers: {
      Origin: "https://attacker.example",
      "Sec-Fetch-Site": "cross-site",
    },
  });

  assert.equal(isSameOriginRequest(sameOrigin, "https://ferupis.pages.dev"), true);
  assert.equal(isSameOriginRequest(crossOrigin, "https://ferupis.pages.dev"), false);
});
