export type VerifyTurnstileInput = Readonly<{
  token: string | null;
  secret: string | undefined;
  remoteIp?: string | null;
  expectedHostname?: string;
  expectedAction?: string;
  idempotencyKey?: string;
}>;

export type TurnstileSiteverifyResponse = Readonly<{
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  "error-codes"?: string[];
}>;

export type RequireTurnstileInput = Readonly<{
  request: Request;
  secret: string | undefined;
  expectedHostname?: string;
  expectedAction?: string;
}>;

export type ResolveTurnstileExpectedHostnameInput = Readonly<{
  appEnvironment: string | undefined;
  configuredHostname: string | undefined;
}>;

export type ResolveTurnstileExpectedHostnameResult =
  | Readonly<{ ok: true; expectedHostname: string | undefined }>
  | Readonly<{ ok: false; reason: "expected_hostname_unavailable" }>;
