export function getBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null);

  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export function apiUrl(path: string): string {
  const base = getBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
