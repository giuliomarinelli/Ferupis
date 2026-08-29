import { isEmailAddress, isEmailNotificationId } from "../email/index.ts";
import type {
  ContactMessageValidationIssue,
  ContactMessageValidationResult,
} from "./models.ts";

const EXPECTED_PROPERTIES = [
  "email",
  "message",
  "name",
  "privacyAccepted",
  "requestId",
  "subject",
] as const;

const UNSAFE_SINGLE_LINE_CHARACTERS = /[\u0000-\u001f\u007f]/;
const UNSAFE_MULTILINE_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeSingleLine = (value: string): string =>
  value.trim().replace(/[\t ]+/g, " ");

const normalizeMessage = (value: string): string =>
  value.replace(/\r\n?/g, "\n").trim();

export const validateContactMessageSubmission = (
  input: unknown,
): ContactMessageValidationResult => {
  if (!isRecord(input)) {
    return { ok: false, issues: [{ field: "request", code: "invalid" }] };
  }

  const unexpected = Object.keys(input).filter(
    (key) => !EXPECTED_PROPERTIES.includes(key as never),
  );
  if (unexpected.length > 0) {
    return { ok: false, issues: [{ field: "request", code: "unexpected" }] };
  }

  const issues: ContactMessageValidationIssue[] = [];
  const name =
    typeof input.name === "string" ? normalizeSingleLine(input.name) : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const subject =
    typeof input.subject === "string"
      ? normalizeSingleLine(input.subject)
      : "";
  const message =
    typeof input.message === "string" ? normalizeMessage(input.message) : "";

  if (!isEmailNotificationId(input.requestId)) {
    issues.push({ field: "requestId", code: "invalid" });
  }

  if (!name) {
    issues.push({ field: "name", code: "required" });
  } else if (name.length > 100 || UNSAFE_SINGLE_LINE_CHARACTERS.test(name)) {
    issues.push({ field: "name", code: "invalid" });
  }

  if (!email) {
    issues.push({ field: "email", code: "required" });
  } else if (email.length > 254 || !isEmailAddress(email)) {
    issues.push({ field: "email", code: "invalid" });
  }

  if (
    subject.length > 160 ||
    (subject.length > 0 && UNSAFE_SINGLE_LINE_CHARACTERS.test(subject))
  ) {
    issues.push({ field: "subject", code: "invalid" });
  }

  if (!message) {
    issues.push({ field: "message", code: "required" });
  } else if (
    message.length > 4_000 ||
    UNSAFE_MULTILINE_CHARACTERS.test(message)
  ) {
    issues.push({ field: "message", code: "invalid" });
  }

  if (input.privacyAccepted !== true) {
    issues.push({ field: "privacyAccepted", code: "required" });
  }

  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    value: {
      requestId: input.requestId as string,
      name,
      email,
      subject: subject || null,
      message,
      privacyAccepted: true,
    },
  };
};
