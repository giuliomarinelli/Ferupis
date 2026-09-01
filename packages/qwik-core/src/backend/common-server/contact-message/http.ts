import { isSameOriginRequest } from "../security/index.ts";

export const CONTACT_MESSAGE_MAX_BODY_BYTES = 8_192 as const;

export type ContactMessageJsonBodyResult =
  | Readonly<{ ok: true; body: unknown }>
  | Readonly<{
      ok: false;
      status: 400 | 413 | 415;
      code: "REQUEST_INVALID" | "BODY_TOO_LARGE" | "CONTENT_TYPE_UNSUPPORTED";
    }>;

export const parseContactMessageJsonBody = async (
  request: Request,
): Promise<ContactMessageJsonBodyResult> => {
  const contentType = request.headers.get("content-type");
  if (!contentType || !/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return { ok: false, status: 415, code: "CONTENT_TYPE_UNSUPPORTED" };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    request.headers.has("content-length") &&
    (!Number.isSafeInteger(declaredLength) ||
      declaredLength < 0 ||
      declaredLength > CONTACT_MESSAGE_MAX_BODY_BYTES)
  ) {
    return { ok: false, status: 413, code: "BODY_TOO_LARGE" };
  }

  const reader = request.body?.getReader();
  if (!reader) return { ok: false, status: 400, code: "REQUEST_INVALID" };

  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > CONTACT_MESSAGE_MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false, status: 413, code: "BODY_TOO_LARGE" };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return {
      ok: true,
      body: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
    };
  } catch {
    return { ok: false, status: 400, code: "REQUEST_INVALID" };
  }
};

export const isContactMessageSameOriginRequest = (
  request: Request,
  expectedOrigin: string,
): boolean => isSameOriginRequest(request, expectedOrigin);

export const applyContactMessageApiHeaders = (headers: Headers): void => {
  headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
};

export const applyContactMessageDocumentHeaders = (headers: Headers): void => {
  headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
};
