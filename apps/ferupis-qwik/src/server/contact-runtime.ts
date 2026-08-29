import type { EmailQueueProducer } from "@gm/qwik-core/email";

export type ContactRuntimeEnv = Readonly<{
  APP_ENV?: string;
  CF_TURNSTILE_SECRET_KEY?: string;
  CF_TURNSTILE_SITE_KEY?: string;
  EMAIL_QUEUE?: EmailQueueProducer;
  TURNSTILE_EXPECTED_HOSTNAME?: string;
}>;

export const resolveContactRuntimeEnv = (platform: unknown): ContactRuntimeEnv =>
  (platform as { env?: ContactRuntimeEnv } | undefined)?.env ?? {};
