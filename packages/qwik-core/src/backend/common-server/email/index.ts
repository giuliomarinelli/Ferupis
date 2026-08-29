export {
  EMAIL_DELIVERY_TEST_TEMPLATE,
  EMAIL_DELIVERY_TEST_TEMPLATE_VERSION,
  EMAIL_JOB_SCHEMA_VERSION,
  assertEmailJob,
  createEmailDeliveryTestJob,
  isEmailAddress,
  isEmailJob,
  isEmailNotificationId,
} from "./models.ts";
export type {
  CreateEmailDeliveryTestJobInput,
  EmailDeliveryTestJob,
  EmailJob,
  EmailJobMetadata,
  EmailLocale,
  EmailRecipient,
} from "./models.ts";

export { enqueueEmailJob, enqueueEmailJobs } from "./producer.ts";
export type { EmailQueueProducer } from "./producer.ts";
