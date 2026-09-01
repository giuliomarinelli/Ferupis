import type {
  CommonWorkerEnv,
  CommonWorkerExecutionContext,
  CommonWorkerHandler,
  QueueMessageBatch,
} from "./cloudflare-types";
import { consumeEmailBatch } from "./email";

export default {
  fetch(): Response {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  },
  async queue(
    batch: QueueMessageBatch<unknown>,
    env: CommonWorkerEnv,
    _ctx: CommonWorkerExecutionContext,
  ): Promise<void> {
    await consumeEmailBatch(batch, env);
  },
} satisfies CommonWorkerHandler;
