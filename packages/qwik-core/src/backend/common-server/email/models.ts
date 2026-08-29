export const EMAIL_JOB_SCHEMA_VERSION = 1 as const;
export const EMAIL_DELIVERY_TEST_TEMPLATE = "delivery-test" as const;
export const EMAIL_DELIVERY_TEST_TEMPLATE_VERSION = 1 as const;

export type EmailLocale = "it" | "en";

export type EmailRecipient = Readonly<{
  email: string;
  name?: string;
}>;

export type EmailJobMetadata = Readonly<{
  source: string;
  correlationId: string;
  enqueuedAt: string;
}>;

export type EmailDeliveryTestJob = Readonly<{
  schemaVersion: typeof EMAIL_JOB_SCHEMA_VERSION;
  notificationId: string;
  template: typeof EMAIL_DELIVERY_TEST_TEMPLATE;
  templateVersion: typeof EMAIL_DELIVERY_TEST_TEMPLATE_VERSION;
  locale: EmailLocale;
  recipient: EmailRecipient;
  payload: Readonly<Record<never, never>>;
  metadata: EmailJobMetadata;
}>;

export type EmailJob = EmailDeliveryTestJob;

export type CreateEmailDeliveryTestJobInput = Readonly<{
  locale: EmailLocale;
  recipient: EmailRecipient;
  source: string;
  correlationId?: string;
  enqueuedAt?: string;
  notificationId?: string;
}>;

const EMAIL_ADDRESS_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SOURCE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,127}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactProperties = (
  value: Record<string, unknown>,
  properties: readonly string[],
): boolean => {
  const keys = Object.keys(value).sort();
  const expected = [...properties].sort();
  return (
    keys.length === expected.length &&
    keys.every((key, index) => key === expected[index])
  );
};

const isSafeText = (value: unknown, maximumLength: number): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= maximumLength &&
  !/[\r\n]/.test(value);

export const isEmailAddress = (value: unknown): value is string =>
  isSafeText(value, 320) && EMAIL_ADDRESS_PATTERN.test(value);

export const isEmailNotificationId = (value: unknown): value is string =>
  typeof value === "string" && UUID_V4_PATTERN.test(value);

const isIsoDateTime = (value: unknown): value is string => {
  if (typeof value !== "string" || value.length > 40) return false;
  const epochMs = Date.parse(value);
  return Number.isFinite(epochMs) && new Date(epochMs).toISOString() === value;
};

const isEmailRecipient = (value: unknown): value is EmailRecipient => {
  if (!isRecord(value)) return false;
  const properties = value.name === undefined ? ["email"] : ["email", "name"];
  return (
    hasExactProperties(value, properties) &&
    isEmailAddress(value.email) &&
    (value.name === undefined || isSafeText(value.name, 120))
  );
};

const isEmailJobMetadata = (value: unknown): value is EmailJobMetadata =>
  isRecord(value) &&
  hasExactProperties(value, ["correlationId", "enqueuedAt", "source"]) &&
  typeof value.source === "string" &&
  SOURCE_PATTERN.test(value.source) &&
  isEmailNotificationId(value.correlationId) &&
  isIsoDateTime(value.enqueuedAt);

export const isEmailJob = (value: unknown): value is EmailJob =>
  isRecord(value) &&
  hasExactProperties(value, [
    "locale",
    "metadata",
    "notificationId",
    "payload",
    "recipient",
    "schemaVersion",
    "template",
    "templateVersion",
  ]) &&
  value.schemaVersion === EMAIL_JOB_SCHEMA_VERSION &&
  value.template === EMAIL_DELIVERY_TEST_TEMPLATE &&
  value.templateVersion === EMAIL_DELIVERY_TEST_TEMPLATE_VERSION &&
  isEmailNotificationId(value.notificationId) &&
  (value.locale === "it" || value.locale === "en") &&
  isEmailRecipient(value.recipient) &&
  isRecord(value.payload) &&
  hasExactProperties(value.payload, []) &&
  isEmailJobMetadata(value.metadata);

export const assertEmailJob: (value: unknown) => asserts value is EmailJob = (
  value,
) => {
  if (!isEmailJob(value)) throw new TypeError("Invalid email queue job");
};

export const createEmailDeliveryTestJob = (
  input: CreateEmailDeliveryTestJobInput,
): EmailDeliveryTestJob => {
  const job = {
    schemaVersion: EMAIL_JOB_SCHEMA_VERSION,
    notificationId: input.notificationId ?? crypto.randomUUID(),
    template: EMAIL_DELIVERY_TEST_TEMPLATE,
    templateVersion: EMAIL_DELIVERY_TEST_TEMPLATE_VERSION,
    locale: input.locale,
    recipient: input.recipient,
    payload: {},
    metadata: {
      source: input.source,
      correlationId: input.correlationId ?? crypto.randomUUID(),
      enqueuedAt: input.enqueuedAt ?? new Date().toISOString(),
    },
  } satisfies EmailDeliveryTestJob;

  assertEmailJob(job);
  return job;
};
