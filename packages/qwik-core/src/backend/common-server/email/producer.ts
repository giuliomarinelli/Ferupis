import { assertEmailJob, type EmailJob } from "./models.ts";

export type EmailQueueProducer = Readonly<{
  send(
    message: EmailJob,
    options: Readonly<{ contentType: "json" }>,
  ): Promise<unknown>;
  sendBatch(
    messages: Iterable<
      Readonly<{
        body: EmailJob;
        contentType: "json";
      }>
    >,
  ): Promise<unknown>;
}>;

export const enqueueEmailJob = async (
  queue: EmailQueueProducer,
  job: EmailJob,
): Promise<void> => {
  assertEmailJob(job);
  await queue.send(job, { contentType: "json" });
};

export const enqueueEmailJobs = async (
  queue: EmailQueueProducer,
  jobs: readonly EmailJob[],
): Promise<void> => {
  if (jobs.length === 0 || jobs.length > 100) {
    throw new RangeError(
      "Email queue batch must contain between 1 and 100 jobs",
    );
  }
  for (const job of jobs) assertEmailJob(job);
  await queue.sendBatch(
    jobs.map((body) => ({ body, contentType: "json" as const })),
  );
};
