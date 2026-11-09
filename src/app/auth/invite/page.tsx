"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type InviteState = "processing" | "error";

export default function InvitePage() {
  const [state, setState] = useState<InviteState>("processing");

  useEffect(() => {
    let active = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const type = fragment.get("type");

    window.history.replaceState(
      window.history.state,
      document.title,
      `${window.location.pathname}${window.location.search}`,
    );

    if (!accessToken || !refreshToken || type !== "invite") {
      queueMicrotask(() => {
        if (active) setState("error");
      });
      return () => {
        active = false;
      };
    }

    getSupabaseBrowserClient()
      .auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ error }) => {
        if (!active) return;
        if (error) {
          setState("error");
          return;
        }
        window.location.replace("/reset-password?flow=invite");
      })
      .catch(() => {
        if (active) setState("error");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 text-center sm:p-8">
      {state === "processing" ? (
        <>
          <h1 className="text-xl font-semibold text-[#171717]">
            Verificando invitación
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#44403c]">
            Estamos preparando tu acceso seguro.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-[#171717]">
            Invitación no válida
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#44403c]">
            El enlace expiró, ya fue utilizado o no corresponde a una
            invitación válida.
          </p>
        </>
      )}
    </section>
  );
}
