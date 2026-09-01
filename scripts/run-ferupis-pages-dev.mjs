import { once } from "node:events";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPOSITORY_ROOT = fileURLToPath(new URL("../", import.meta.url));
const WORKER_DEV_VARS = fileURLToPath(
  new URL(
    "../packages/qwik-core/src/backend/workers/common-worker/.dev.vars",
    import.meta.url,
  ),
);
const WRANGLER_LAUNCHER = fileURLToPath(
  new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url),
);
const PAGES_DEV_HOST = "0.0.0.0";
const PAGES_DEV_PORT = 8788;

const assertHostPortAvailable = ({ host, port }) =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", reject);
    server.listen({ host, port, exclusive: true }, () => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

export const assertPagesDevPortAvailable = async ({
  port = PAGES_DEV_PORT,
} = {}) => {
  for (const host of ["127.0.0.1", PAGES_DEV_HOST]) {
    try {
      await assertHostPortAvailable({ host, port });
    } catch (error) {
      if (error?.code === "EADDRINUSE") {
        throw new Error(
          `Port ${port} is already in use on ${host}. Stop the existing local Pages server and any standalone common-worker before running npm run cf:dev:f.`,
        );
      }
      throw error;
    }
  }
};

export const assertWorkerDevVarsAvailable = async ({
  path = WORKER_DEV_VARS,
} = {}) => {
  try {
    await access(path);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(
        "Missing packages/qwik-core/src/backend/workers/common-worker/.dev.vars; copy .dev.vars.example and add RESEND_API_KEY.",
      );
    }
    throw error;
  }
};

export const createFerupisPagesDevArguments = () => [
  WRANGLER_LAUNCHER,
  "pages",
  "dev",
  "--cwd",
  "apps/ferupis-qwik",
  "-c",
  "wrangler.jsonc",
  "-c",
  "../../packages/qwik-core/src/backend/workers/common-worker/wrangler.jsonc",
  "--ip",
  PAGES_DEV_HOST,
  "--port",
  String(PAGES_DEV_PORT),
  "--persist-to",
  "../../.wrangler/shared",
];

export const runFerupisPagesDev = async () => {
  await assertPagesDevPortAvailable();
  await assertWorkerDevVarsAvailable();

  const child = spawn(process.execPath, createFerupisPagesDevArguments(), {
    cwd: REPOSITORY_ROOT,
    env: process.env,
    stdio: "inherit",
  });

  const forwardSignal = (signal) => child.kill(signal);
  const onSigint = () => forwardSignal("SIGINT");
  const onSigterm = () => forwardSignal("SIGTERM");
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);

  try {
    const [code, signal] = await once(child, "exit");
    if (typeof code === "number") return code;
    return signal === "SIGINT" ? 130 : 143;
  } finally {
    process.removeListener("SIGINT", onSigint);
    process.removeListener("SIGTERM", onSigterm);
  }
};

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  try {
    process.exitCode = await runFerupisPagesDev();
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Local Pages startup failed",
    );
    process.exitCode = 1;
  }
}
