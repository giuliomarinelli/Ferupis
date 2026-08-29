export {
  EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE,
  EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE_VERSION,
  EMAIL_DELIVERY_TEST_TEMPLATE,
  EMAIL_DELIVERY_TEST_TEMPLATE_VERSION,
  EMAIL_JOB_SCHEMA_VERSION,
  assertEmailJob,
  createEmailContactMessageInternalJob,
  createEmailDeliveryTestJob,
  isEmailAddress,
  isEmailJob,
  isEmailNotificationId,
} from "./models.ts";
export type {
  CreateEmailContactMessageInternalJobInput,
  CreateEmailDeliveryTestJobInput,
  EmailContactMessageInternalJob,
  EmailDeliveryTestJob,
  EmailJob,
  EmailJobMetadata,
  EmailLocale,
  EmailRecipient,
} from "./models.ts";

export { enqueueEmailJob, enqueueEmailJobs } from "./producer.ts";
export type { EmailQueueProducer } from "./producer.ts";
