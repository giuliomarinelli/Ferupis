import { isEmailJob, type EmailJob } from "@gm/qwik-core/email";
import type {
  CommonWorkerEnv,
  QueueMessage,
  QueueMessageBatch,
} from "../cloudflare-types";
import { ResendRequestError, sendResendEmail, type FetchLike } from "./resend";
import { renderEmailJob, type EmailTemplateConfig } from "./template";

export type EmailConsumerEnv = Pick<
  CommonWorkerEnv,
  | "APP_ENV"
  | "EMAIL_DELIVERY_MODE"
  | "EMAIL_FROM"
  | "EMAIL_REPLY_TO"
  | "RESEND_API_KEY"
  | "SITE_ORIGIN"
>;

type EmailRuntimeConfig = EmailTemplateConfig &
  Readonly<{
    from: string;
    replyTo?: string;
    resendApiKey: string;
  }>;

class EmailConfigurationError extends Error {
  constructor(code: string) {
    super(code);
    this.name = "EmailConfigurationError";
  }
}

const isHeaderSafeText = (value: string): boolean =>
  value.length > 0 && value.length <= 320 && !/[\r\n]/.test(value);

const readRuntimeConfig = (env: EmailConsumerEnv): EmailRuntimeConfig => {
  const deliveryMode = String(env.EMAIL_DELIVERY_MODE);
  if (deliveryMode !== "resend") {
    throw new EmailConfigurationError("EMAIL_DELIVERY_MODE_INVALID");
  }
  if (!isHeaderSafeText(env.EMAIL_FROM)) {
    throw new EmailConfigurationError("EMAIL_FROM_INVALID");
  }
  if (env.EMAIL_REPLY_TO && !isHeaderSafeText(env.EMAIL_REPLY_TO)) {
    throw new EmailConfigurationError("EMAIL_REPLY_TO_INVALID");
  }
  if (env.APP_ENV.length === 0 || env.APP_ENV.length > 64) {
    throw new EmailConfigurationError("APP_ENV_INVALID");
  }

  let siteOrigin: string;
  try {
    const url = new URL(env.SITE_ORIGIN);
    if (url.username || url.password || url.pathname !== "/") {
      throw new TypeError("SITE_ORIGIN must be an origin");
    }
    siteOrigin = url.origin;
  } catch {
    throw new EmailConfigurationError("SITE_ORIGIN_INVALID");
  }

  if (env.RESEND_API_KEY.length < 8) {
    throw new EmailConfigurationError("RESEND_API_KEY_MISSING");
  }

  return {
    appEnvironment: env.APP_ENV,
    siteOrigin,
    from: env.EMAIL_FROM,
    replyTo: env.EMAIL_REPLY_TO || undefined,
    resendApiKey: env.RESEND_API_KEY,
  };
};

const retryDelaySeconds = (attempts: number, error: unknown): number => {
  if (
    error instanceof ResendRequestError &&
    error.retryable &&
    error.retryAfterSeconds !== undefined
  ) {
    return error.retryAfterSeconds;
  }
  if (
    error instanceof EmailConfigurationError ||
    (error instanceof ResendRequestError && !error.retryable) ||
    error instanceof TypeError
  ) {
    return 300;
  }
  return Math.min(15 * 2 ** Math.max(attempts - 1, 0), 3_600);
};

const errorCode = (error: unknown): string => {
  if (error instanceof ResendRequestError) return error.message;
  if (error instanceof EmailConfigurationError) return error.message;
  if (error instanceof TypeError) return "EMAIL_JOB_INVALID";
  return "EMAIL_PROCESSING_FAILURE";
};

const logAccepted = (
  queue: string,
  job: EmailJob,
  attempts: number,
  providerEmailId: string | undefined,
): void => {
  console.log(
    JSON.stringify({
      event: "email_notification_processed",
      status: "ACCEPTED_BY_RESEND",
      queue,
      notificationId: job.notificationId,
      correlationId: job.metadata.correlationId,
      template: job.template,
      templateVersion: job.templateVersion,
      attempts,
      ...(providerEmailId ? { providerEmailId } : {}),
    }),
  );
};

const logFailure = (
  queue: string,
  message: QueueMessage<unknown>,
  error: unknown,
  delaySeconds: number,
): void => {
  console.error(
    JSON.stringify({
      event: "email_notification_failed",
      status: "RETRY_SCHEDULED",
      queue,
      messageId: message.id,
      attempts: message.attempts,
      errorCode: errorCode(error),
      ...(error instanceof ResendRequestError
        ? {
            providerStatus: error.status,
            providerType: error.providerType,
            retryable: error.retryable,
          }
        : {}),
      delaySeconds,
    }),
  );
};

export const consumeEmailBatch = async (
  batch: QueueMessageBatch<unknown>,
  env: EmailConsumerEnv,
  fetcher: FetchLike = fetch,
): Promise<void> => {
  for (const message of batch.messages) {
    try {
      if (!isEmailJob(message.body)) {
        throw new TypeError("Invalid email queue job");
      }

      const job = message.body;
      const config = readRuntimeConfig(env);
      const rendered = await renderEmailJob(job, config);

      const result = await sendResendEmail(
        {
          apiKey: config.resendApiKey,
          from: config.from,
          replyTo: config.replyTo,
          to: job.recipient,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
          idempotencyKey: job.notificationId,
          tags: [
            { name: "template", value: job.template },
            { name: "environment", value: config.appEnvironment },
          ],
        },
        fetcher,
      );

      logAccepted(batch.queue, job, message.attempts, result.id);
      message.ack();
    } catch (error) {
      const delaySeconds = retryDelaySeconds(message.attempts, error);
      logFailure(batch.queue, message, error, delaySeconds);
      message.retry({ delaySeconds });
    }
  }
};
