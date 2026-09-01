import type {
  RequireTurnstileInput,
  ResolveTurnstileExpectedHostnameInput,
  ResolveTurnstileExpectedHostnameResult,
  TurnstileSiteverifyResponse,
  VerifyTurnstileInput,
} from "../models/turnstile.models.ts";

export const TURNSTILE_CHALLENGE_TOKEN_HEADER = "X-Turnstile-Challenge-Token";
const TURNSTILE_TEST_SECRET_ALWAYS_PASSES =
  "1x0000000000000000000000000000000AA";

export const resolveTurnstileExpectedHostname = (
  input: ResolveTurnstileExpectedHostnameInput,
): ResolveTurnstileExpectedHostnameResult => {
  const expectedHostname = input.configuredHostname?.trim();

  if (expectedHostname) {
    try {
      const url = new URL(`https://${expectedHostname}`);
      if (
        url.hostname !== expectedHostname ||
        url.port ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
      ) {
        return { ok: false, reason: "expected_hostname_unavailable" };
      }
    } catch {
      return { ok: false, reason: "expected_hostname_unavailable" };
    }

    return { ok: true, expectedHostname };
  }

  if (input.appEnvironment === "dev") {
    return { ok: true, expectedHostname: undefined };
  }

  return { ok: false, reason: "expected_hostname_unavailable" };
};

export const verifyTurnstileChallenge = async (input: VerifyTurnstileInput) => {
  if (!input.token) {
    return { ok: false, reason: "missing_token" } as const;
  }

  if (input.token.length > 2048) {
    return {
      ok: false,
      reason: "invalid_token",
      errorCodes: ["token-too-long"],
    } as const;
  }

  if (!input.secret) {
    return { ok: false, reason: "missing_secret" } as const;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: input.secret,
          response: input.token,
          remoteip: input.remoteIp ?? undefined,
          idempotency_key: input.idempotencyKey ?? crypto.randomUUID(),
        }),
        signal: controller.signal,
      },
    );

    const result = (await response.json()) as TurnstileSiteverifyResponse;

    if (!response.ok || !result.success) {
      return {
        ok: false,
        reason: "siteverify_failed",
        errorCodes: result["error-codes"] ?? [],
      } as const;
    }

    if (input.expectedAction && result.action !== input.expectedAction) {
      return {
        ok: false,
        reason: "siteverify_failed",
        errorCodes: ["action-mismatch"],
      } as const;
    }

    if (input.expectedHostname && result.hostname !== input.expectedHostname) {
      return {
        ok: false,
        reason: "siteverify_failed",
        errorCodes: ["hostname-mismatch"],
      } as const;
    }

    return {
      ok: true,
      hostname: result.hostname,
      action: result.action,
      challengeTs: result.challenge_ts,
    } as const;
  } catch (error) {
    const isAbortError = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      reason: isAbortError ? "timeout" : "network_error",
      errorCodes: [isAbortError ? "siteverify-timeout" : "internal-error"],
    } as const;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const requireTurnstile = async (input: RequireTurnstileInput) => {
  const secret =
    input.appEnvironment === "dev"
      ? TURNSTILE_TEST_SECRET_ALWAYS_PASSES
      : input.secret;
  const token = input.request.headers.get(TURNSTILE_CHALLENGE_TOKEN_HEADER);
  const forwardedFor = input.request.headers.get("X-Forwarded-For");
  const remoteIp =
    input.request.headers.get("CF-Connecting-IP") ??
    forwardedFor?.split(",")[0]?.trim() ??
    null;

  return verifyTurnstileChallenge({
    token,
    secret,
    remoteIp,
    expectedHostname: input.expectedHostname,
    // Cloudflare's dummy token reports the fixed test action rather than the
    // action passed to render(). Real credentials must always match ours.
    expectedAction:
      secret === TURNSTILE_TEST_SECRET_ALWAYS_PASSES
        ? undefined
        : input.expectedAction,
  });
};
