import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

export type SupabaseServerClientOptions = {
  response?: NextResponse;
  strictCookieWrites?: boolean;
};

export async function createSupabaseServerClient(
  options: SupabaseServerClientOptions = {},
): Promise<SupabaseClient> {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Falta configurar Supabase para el servidor.");
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const {
            name,
            value,
            options: cookieOptions,
          } of cookiesToSet) {
            cookieStore.set(name, value, cookieOptions);
            options.response?.cookies.set(name, value, cookieOptions);
          }
        } catch (error) {
          if (
            !options.strictCookieWrites &&
            error instanceof Error &&
            error.message.includes("Cookies can only be modified")
          ) {
            return;
          }
          throw error;
        }
      },
    },
  });
}

export async function getAuthCookieSummary() {
  const cookieStore = await cookies();
  const authCookies = cookieStore
    .getAll()
    .filter(({ name }) => name.startsWith("sb-") || name.includes("auth"));

  return {
    count: authCookies.length,
    names: authCookies.map(({ name }) => name),
  };
}
