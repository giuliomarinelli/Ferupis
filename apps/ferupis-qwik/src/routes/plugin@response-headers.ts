import type { RequestHandler } from "@builder.io/qwik-city";

const RESPONSE_SECURITY_HEADERS = {
  "Permissions-Policy":
    "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

export const onRequest: RequestHandler = async ({ headers, next }) => {
  for (const [name, value] of Object.entries(RESPONSE_SECURITY_HEADERS)) {
    headers.set(name, value);
  }

  await next();
};
