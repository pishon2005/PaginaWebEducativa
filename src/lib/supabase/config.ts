export interface SupabasePublicConfig {
  url: string;
  publishableKey: string;
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  try {
    const parsedUrl = new URL(url);
    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      (process.env.NODE_ENV === "production" &&
        parsedUrl.protocol !== "https:")
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return { url: url.replace(/\/+$/, ""), publishableKey };
}

export function getSiteUrl(): string | null {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    try {
      const parsedUrl = new URL(configuredUrl);
      if (
        process.env.NODE_ENV === "production" &&
        parsedUrl.protocol !== "https:"
      ) {
        return null;
      }
      return parsedUrl.origin;
    } catch {
      return null;
    }
  }

  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : null;
}

export function getSafeRedirectPath(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/acceso-pendiente";
  }

  const parsed = new URL(value, "https://local.invalid");
  return parsed.origin === "https://local.invalid"
    ? `${parsed.pathname}${parsed.search}${parsed.hash}`
    : "/acceso-pendiente";
}
