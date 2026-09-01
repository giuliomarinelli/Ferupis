export const EMAIL_JOB_SCHEMA_VERSION = 1 as const;
export const EMAIL_DELIVERY_TEST_TEMPLATE = "delivery-test" as const;
export const EMAIL_DELIVERY_TEST_TEMPLATE_VERSION = 1 as const;
export const EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE =
  "contact-message-internal" as const;
export const EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE_VERSION = 1 as const;

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

export type EmailContactMessageInternalJob = Readonly<{
  schemaVersion: typeof EMAIL_JOB_SCHEMA_VERSION;
  notificationId: string;
  template: typeof EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE;
  templateVersion: typeof EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE_VERSION;
  locale: EmailLocale;
  recipient: EmailRecipient;
  payload: Readonly<{
    name: string;
    email: string;
    subject: string | null;
    message: string;
  }>;
  metadata: EmailJobMetadata;
}>;

export type EmailJob = EmailDeliveryTestJob | EmailContactMessageInternalJob;

export type CreateEmailDeliveryTestJobInput = Readonly<{
  locale: EmailLocale;
  recipient: EmailRecipient;
  source: string;
  correlationId?: string;
  enqueuedAt?: string;
  notificationId?: string;
}>;

export type CreateEmailContactMessageInternalJobInput = Readonly<{
  locale: EmailLocale;
  recipient: EmailRecipient;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
  correlationId: string;
  enqueuedAt?: string;
  notificationId: string;
}>;

const EMAIL_ADDRESS_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SOURCE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,127}$/;
const UNSAFE_SINGLE_LINE_CHARACTERS = /[\u0000-\u001f\u007f]/;
const UNSAFE_MULTILINE_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

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
  !UNSAFE_SINGLE_LINE_CHARACTERS.test(value);

const isSafeMultilineText = (
  value: unknown,
  maximumLength: number,
): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.length <= maximumLength &&
  !UNSAFE_MULTILINE_CHARACTERS.test(value);

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

const isEmailJobEnvelope = (
  value: Record<string, unknown>,
): boolean =>
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
  isEmailNotificationId(value.notificationId) &&
  (value.locale === "it" || value.locale === "en") &&
  isEmailRecipient(value.recipient) &&
  isEmailJobMetadata(value.metadata);

const isContactMessagePayload = (value: unknown): boolean =>
  isRecord(value) &&
  hasExactProperties(value, ["email", "message", "name", "subject"]) &&
  isSafeText(value.name, 100) &&
  isEmailAddress(value.email) &&
  (value.subject === null || isSafeText(value.subject, 160)) &&
  isSafeMultilineText(value.message, 4_000);

export const isEmailJob = (value: unknown): value is EmailJob => {
  if (!isRecord(value) || !isEmailJobEnvelope(value)) return false;

  if (
    value.template === EMAIL_DELIVERY_TEST_TEMPLATE &&
    value.templateVersion === EMAIL_DELIVERY_TEST_TEMPLATE_VERSION
  ) {
    return isRecord(value.payload) && hasExactProperties(value.payload, []);
  }

  if (
    value.template === EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE &&
    value.templateVersion === EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE_VERSION
  ) {
    return isContactMessagePayload(value.payload);
  }

  return false;
};

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

export const createEmailContactMessageInternalJob = (
  input: CreateEmailContactMessageInternalJobInput,
): EmailContactMessageInternalJob => {
  const job = {
    schemaVersion: EMAIL_JOB_SCHEMA_VERSION,
    notificationId: input.notificationId,
    template: EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE,
    templateVersion: EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE_VERSION,
    locale: input.locale,
    recipient: input.recipient,
    payload: {
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    },
    metadata: {
      source: input.source,
      correlationId: input.correlationId,
      enqueuedAt: input.enqueuedAt ?? new Date().toISOString(),
    },
  } satisfies EmailContactMessageInternalJob;

  assertEmailJob(job);
  return job;
};
