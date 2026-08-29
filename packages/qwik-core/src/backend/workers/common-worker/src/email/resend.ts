const RESEND_SEND_EMAIL_URL = "https://api.resend.com/emails";
const RESEND_USER_AGENT = "ferupis-common-worker/1";
const RESEND_REQUEST_TIMEOUT_MS = 10_000;

export type ResendEmailAddress = Readonly<{
  email: string;
  name?: string;
}>;

export type SendResendEmailInput = Readonly<{
  apiKey: string;
  from: string;
  replyTo?: string;
  to: ResendEmailAddress;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  tags: readonly Readonly<{ name: string; value: string }>[];
}>;

export type ResendSendResult = Readonly<{ id: string }>;

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type ResendErrorBody = Readonly<{
  name?: string;
  type?: string;
  message?: string;
}>;

export class ResendRequestError extends Error {
  readonly status: number | undefined;
  readonly providerType: string | undefined;
  readonly retryAfterSeconds: number | undefined;
  readonly retryable: boolean;

  constructor(
    code: string,
    options: Readonly<{
      status?: number;
      providerType?: string;
      retryAfterSeconds?: number;
      retryable: boolean;
      cause?: unknown;
    }>,
  ) {
    super(code, { cause: options.cause });
    this.name = "ResendRequestError";
    this.status = options.status;
    this.providerType = options.providerType;
    this.retryAfterSeconds = options.retryAfterSeconds;
    this.retryable = options.retryable;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseErrorBody = (value: unknown): ResendErrorBody => {
  if (!isRecord(value)) return {};
  return {
    name: typeof value.name === "string" ? value.name : undefined,
    type: typeof value.type === "string" ? value.type : undefined,
    message: typeof value.message === "string" ? value.message : undefined,
  };
};

const parseRetryAfterSeconds = (response: Response): number | undefined => {
  const value = response.headers.get("retry-after");
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(Math.ceil(seconds), 3_600);
  }

  const retryAt = Date.parse(value);
  if (!Number.isFinite(retryAt)) return undefined;
  return Math.min(
    Math.max(Math.ceil((retryAt - Date.now()) / 1_000), 0),
    3_600,
  );
};

const isRetryableProviderFailure = (
  status: number,
  providerType: string | undefined,
): boolean =>
  status >= 500 ||
  providerType === "concurrent_idempotent_requests" ||
  providerType === "rate_limit_exceeded" ||
  (status === 429 &&
    providerType !== "daily_quota_exceeded" &&
    providerType !== "monthly_quota_exceeded");

const formatAddress = (address: ResendEmailAddress): string =>
  address.name ? `${address.name} <${address.email}>` : address.email;

export const sendResendEmail = async (
  input: SendResendEmailInput,
  fetcher: FetchLike = fetch,
): Promise<ResendSendResult> => {
  let response: Response;
  try {
    response = await fetcher(RESEND_SEND_EMAIL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
        "User-Agent": RESEND_USER_AGENT,
      },
      body: JSON.stringify({
        from: input.from,
        to: [formatAddress(input.to)],
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        subject: input.subject,
        html: input.html,
        text: input.text,
        tags: input.tags,
      }),
      signal: AbortSignal.timeout(RESEND_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new ResendRequestError("RESEND_NETWORK_FAILURE", {
      retryable: true,
      cause: error,
    });
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new ResendRequestError("RESEND_INVALID_RESPONSE", {
      status: response.status,
      retryAfterSeconds: parseRetryAfterSeconds(response),
      retryable: response.status >= 500,
      cause: error,
    });
  }

  if (!response.ok) {
    const errorBody = parseErrorBody(body);
    const providerType = errorBody.type ?? errorBody.name;
    throw new ResendRequestError("RESEND_REJECTED", {
      status: response.status,
      providerType,
      retryAfterSeconds: parseRetryAfterSeconds(response),
      retryable: isRetryableProviderFailure(response.status, providerType),
    });
  }

  if (!isRecord(body) || typeof body.id !== "string" || body.id.length === 0) {
    throw new ResendRequestError("RESEND_INVALID_RESPONSE", {
      status: response.status,
      retryable: true,
    });
  }

  return { id: body.id };
};
