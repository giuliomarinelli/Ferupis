const ALLOWED_FETCH_SITES = new Set(["same-origin", "none"]);

const parseSerializedHttpOrigin = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;
    if (value !== url.origin) return null;

    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
    } as const;
  } catch {
    return null;
  }
};

export const isSameOriginRequest = (
  request: Request,
  expectedOrigin: string,
): boolean => {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (
    fetchSite !== null &&
    !ALLOWED_FETCH_SITES.has(fetchSite.toLowerCase())
  ) {
    return false;
  }

  const requestOriginValue = request.headers.get("origin");
  if (requestOriginValue === null) return true;
  if (requestOriginValue === "null") return false;

  const requestOrigin = parseSerializedHttpOrigin(requestOriginValue);
  const trustedOrigin = parseSerializedHttpOrigin(expectedOrigin);
  if (!requestOrigin || !trustedOrigin) return false;

  return (
    requestOrigin.protocol === trustedOrigin.protocol &&
    requestOrigin.hostname === trustedOrigin.hostname &&
    requestOrigin.port === trustedOrigin.port
  );
};
