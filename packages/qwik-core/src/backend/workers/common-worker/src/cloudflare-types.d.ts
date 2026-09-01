/// <reference path="../worker-configuration.d.ts" />

export type CommonWorkerEnv = Env;
export type CommonWorkerExecutionContext = ExecutionContext;
export type CommonWorkerHandler = ExportedHandler<CommonWorkerEnv>;
export type QueueMessage<Body = unknown> = Message<Body>;
export type QueueMessageBatch<Body = unknown> = MessageBatch<Body>;
