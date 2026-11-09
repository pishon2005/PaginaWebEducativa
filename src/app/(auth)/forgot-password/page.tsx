"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { requestPasswordResetAction } from "../actions";

export default function ForgotPasswordPage() {
  const [result, formAction, pending] = useActionState(
    requestPasswordResetAction,
    null,
  );

  return (
    <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 shadow-[0_25px_80px_-55px_rgba(28,25,23,0.5)] sm:p-8">
      {result?.ok ? (
        <div className="text-center">
          <MailCheck className="mx-auto size-9 text-[#ea580c]" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-[#171717]">Revisa tu correo</h1>
          <p role="status" className="mt-2 text-sm leading-6 text-[#44403c]">Si existe una cuenta asociada, recibirás instrucciones para restablecer la contraseña.</p>
          <Link href="/login" className="mt-5 flex h-10 items-center justify-center bg-[#f97316] text-xs font-semibold text-white hover:bg-[#ea580c]">Volver al inicio de sesión</Link>
        </div>
      ) : (
        <>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#f97316]"><ArrowLeft className="size-3.5" aria-hidden="true" /> Iniciar sesión</Link>
          <h1 className="mt-5 text-2xl font-semibold text-[#171717]">Recuperar contraseña</h1>
          <p className="mt-2 text-sm leading-6 text-[#44403c]">Ingresa el correo asociado a tu cuenta para recibir un enlace seguro de recuperación.</p>
          <form action={formAction} className="mt-5 space-y-4">
            <label htmlFor="email" className="block text-xs font-semibold text-[#ea580c]">Correo electrónico<input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className="mt-1.5 h-11 w-full border border-[#e7e5e4] px-3 text-sm font-normal outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#fff7ed]" /></label>
            {result && !result.ok && <p role="alert" className="text-xs text-[#a24135]">{result.error.message}</p>}
            <button type="submit" disabled={pending} className="h-11 w-full bg-[#f97316] text-sm font-semibold text-white hover:bg-[#ea580c] disabled:opacity-70">{pending ? "Enviando..." : "Enviar enlace"}</button>
          </form>
        </>
      )}
    </section>
  );
}