import { NextResponse, type NextRequest } from "next/server";
import {
  getSafeRedirectPath,
  getSiteUrl,
  getSupabasePublicConfig,
} from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl();
  if (!getSupabasePublicConfig() || !siteUrl) {
    return NextResponse.redirect(new URL("/login?error=auth-config", request.url));
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=callback", siteUrl));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=callback", siteUrl));
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=callback", siteUrl));
  }

  return NextResponse.redirect(new URL(nextPath, siteUrl));
}
