"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";

let browserClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Falta configurar Supabase para el cliente.");
  }

  browserClient = createBrowserClient(
    config.url,
    config.publishableKey,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  );

  return browserClient;
}
