"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePasswordAction } from "@/app/(auth)/actions";

export function ResetPasswordForm({
  flow,
}: {
  flow: "invite" | "recovery";
}) {
  const [result, formAction, pending] = useActionState(
    updatePasswordAction,
    null,
  );

  if (result?.ok) {
    return (
      <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 text-center shadow-[0_25px_80px_-55px_rgba(28,25,23,0.5)] sm:p-8">
        <h1 className="text-xl font-semibold text-[#171717]">Contraseña actualizada</h1>
        <p role="status" className="mt-2 text-sm leading-6 text-[#44403c]">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <Link href="/login" className="mt-5 flex h-10 items-center justify-center bg-[#f97316] text-xs font-semibold text-white hover:bg-[#ea580c]">
          Ir al inicio de sesión
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 shadow-[0_25px_80px_-55px_rgba(28,25,23,0.5)] sm:p-8">
      <h1 className="text-2xl font-semibold text-[#171717]">
        {flow === "invite" ? "Completa tu cuenta" : "Nueva contraseña"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#44403c]">
        {flow === "invite"
          ? "Establece una contraseña para aceptar tu invitación a EDUKATECH."
          : "Elige una contraseña de al menos 8 caracteres."}
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <label htmlFor="password" className="block text-xs font-semibold text-[#ea580c]">
          Nueva contraseña
          <input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" className="mt-1.5 h-11 w-full border border-[#e7e5e4] px-3 text-sm font-normal outline-none focus:border-[#ea580c]" />
        </label>
        <label htmlFor="confirmation" className="block text-xs font-semibold text-[#ea580c]">
          Confirmar contraseña
          <input id="confirmation" name="confirmation" type="password" minLength={8} required autoComplete="new-password" className="mt-1.5 h-11 w-full border border-[#e7e5e4] px-3 text-sm font-normal outline-none focus:border-[#ea580c]" />
        </label>
        {result && !result.ok && (
          <p role="alert" className="text-xs font-medium text-[#a24135]">
            {result.error.message}
          </p>
        )}
        <button type="submit" disabled={pending} className="h-11 w-full bg-[#f97316] text-sm font-semibold text-white hover:bg-[#ea580c] disabled:opacity-70">
          {pending ? "Actualizando..." : "Guardar nueva contraseña"}
        </button>
      </form>
      <Link href="/login" className="mt-4 block text-center text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">
        Volver al inicio de sesión
      </Link>
    </section>
  );
}
