import type { EmailQueueProducer } from "../email/index.ts";

export type ContactMessageSubmission = Readonly<{
  requestId: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  privacyAccepted: true;
}>;

export type ContactMessageField =
  | "request"
  | "requestId"
  | "name"
  | "email"
  | "subject"
  | "message"
  | "privacyAccepted"
  | "website";

export type ContactMessageValidationIssue = Readonly<{
  field: ContactMessageField;
  code: "required" | "invalid" | "unexpected";
}>;

export type ContactMessageValidationResult =
  | Readonly<{ ok: true; value: ContactMessageSubmission }>
  | Readonly<{ ok: false; issues: readonly ContactMessageValidationIssue[] }>;

export type EnqueueContactMessageDependencies = Readonly<{
  emailQueue: EmailQueueProducer;
  internalNotificationEmail: string;
  now?: Date;
}>;

export type EnqueueContactMessageResult =
  | Readonly<{ ok: true; requestId: string }>
  | Readonly<{
      ok: false;
      code: "NOTIFICATION_QUEUE_UNAVAILABLE" | "TEMPORARY_FAILURE";
    }>;
