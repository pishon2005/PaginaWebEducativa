import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const protectedPrefixes = [
  "/superadmin",
  "/admin",
  "/profesor",
  "/alumno",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function copyCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  for (const headerName of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(headerName);
    if (value) target.headers.set(headerName, value);
  }
}

function preventProtectedResponseCaching(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
}

function redirectToLogin(
  request: NextRequest,
  response: NextResponse,
  error?: string,
) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  if (error) loginUrl.searchParams.set("error", error);
  const redirectResponse = NextResponse.redirect(loginUrl);
  copyCookies(response, redirectResponse);
  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const protectedPath = isProtectedPath(request.nextUrl.pathname);

  if (!config) {
    if (protectedPath) {
      return redirectToLogin(request, NextResponse.next({ request }), "auth-config");
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    config.url,
    config.publishableKey,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [name, value] of Object.entries(headers)) {
            response.headers.set(name, value);
          }
          if (protectedPath) preventProtectedResponseCaching(response);
        },
      },
    },
  );

  try {
    const { data, error } = await supabase.auth.getClaims();
    if (error && protectedPath) {
      if ([400, 401, 403].includes(error.status ?? 0)) {
        return redirectToLogin(request, response);
      }
      return new NextResponse("Authentication service unavailable.", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }

    if (!data?.claims && protectedPath) {
      return redirectToLogin(request, response);
    }

    if (protectedPath) preventProtectedResponseCaching(response);
    return response;
  } catch {
    if (protectedPath) {
      return new NextResponse("Authentication service unavailable.", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/superadmin/:path*",
    "/profesor/:path*",
    "/alumno/:path*",
    "/login",
    "/forgot-password",
    "/reset-password",
  ],
};
