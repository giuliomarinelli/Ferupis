import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import { join } from "node:path";
import test from "node:test";

import {
  assertPagesDevPortAvailable,
  assertWorkerDevVarsAvailable,
  createFerupisPagesDevArguments,
} from "./run-ferupis-pages-dev.mjs";

test("the Pages launcher rejects a port already used on loopback", async (context) => {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port: 0, exclusive: true }, resolve);
  });
  context.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  assert.ok(address && typeof address !== "string");
  await assert.rejects(
    assertPagesDevPortAvailable({ port: address.port }),
    /already in use on 127\.0\.0\.1/u,
  );
});

test("the Pages launcher requires the common-worker local secret file", async () => {
  const directory = await mkdtemp(join(tmpdir(), "ferupis-dev-vars-"));
  const path = join(directory, ".dev.vars");

  await assert.rejects(
    assertWorkerDevVarsAvailable({ path }),
    /Missing .*common-worker\/\.dev\.vars/u,
  );

  await writeFile(path, "RESEND_API_KEY=test\n", { mode: 0o600 });
  await assert.doesNotReject(assertWorkerDevVarsAvailable({ path }));
});

test("the Pages launcher starts Pages and the common worker together", () => {
  const args = createFerupisPagesDevArguments();
  assert.deepEqual(args.slice(1, 3), ["pages", "dev"]);
  assert.deepEqual(
    args.slice(args.indexOf("--cwd"), args.indexOf("--cwd") + 2),
    ["--cwd", "apps/ferupis-qwik"],
  );
  assert.deepEqual(
    args.filter((argument) => argument.endsWith("wrangler.jsonc")),
    [
      "wrangler.jsonc",
      "../../packages/qwik-core/src/backend/workers/common-worker/wrangler.jsonc",
    ],
  );
  assert.equal(args.includes("../../.wrangler/shared"), true);
});
