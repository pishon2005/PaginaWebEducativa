import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl, getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const invalidInvitationPath = "/login?error=invite";

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl();
  const config = getSupabasePublicConfig();
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (!siteUrl || !config || !tokenHash || type !== "invite") {
    return NextResponse.redirect(
      new URL(invalidInvitationPath, siteUrl ?? request.url),
    );
  }

  const response = NextResponse.redirect(
    new URL("/reset-password?flow=invite", siteUrl),
  );

  try {
    const supabase = await createSupabaseServerClient({ response });
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "invite",
    });

    if (error) {
      return NextResponse.redirect(new URL(invalidInvitationPath, siteUrl));
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL(invalidInvitationPath, siteUrl));
  }
}
