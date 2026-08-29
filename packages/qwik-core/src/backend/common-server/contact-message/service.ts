import {
  createEmailContactMessageInternalJob,
  enqueueEmailJob,
  isEmailAddress,
} from "../email/index.ts";
import type {
  ContactMessageSubmission,
  EnqueueContactMessageDependencies,
  EnqueueContactMessageResult,
} from "./models.ts";

export const enqueueContactMessage = async (
  submission: ContactMessageSubmission,
  dependencies: EnqueueContactMessageDependencies,
): Promise<EnqueueContactMessageResult> => {
  if (!isEmailAddress(dependencies.internalNotificationEmail)) {
    return { ok: false, code: "TEMPORARY_FAILURE" };
  }

  const enqueuedAt = (dependencies.now ?? new Date()).toISOString();
  const job = createEmailContactMessageInternalJob({
    locale: "it",
    recipient: { email: dependencies.internalNotificationEmail },
    name: submission.name,
    email: submission.email,
    subject: submission.subject,
    message: submission.message,
    source: "ferupis.contact",
    correlationId: submission.requestId,
    notificationId: submission.requestId,
    enqueuedAt,
  });

  try {
    await enqueueEmailJob(dependencies.emailQueue, job);
  } catch {
    return { ok: false, code: "NOTIFICATION_QUEUE_UNAVAILABLE" };
  }

  return { ok: true, requestId: submission.requestId };
};
