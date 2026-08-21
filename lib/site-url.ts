const localSiteUrl = "http://localhost:3000";

function parseSiteUrl(value: string | undefined) {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    return url;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    parseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    parseSiteUrl(process.env.VERCEL_URL) ??
    new URL(localSiteUrl)
  );
}
