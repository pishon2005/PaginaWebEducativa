"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function submitRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="w-full max-w-md border border-[#e7e5e4] bg-white p-6 shadow-[0_25px_80px_-55px_rgba(28,25,23,0.5)] sm:p-8">
      {submitted ? (
        <div className="text-center">
          <MailCheck className="mx-auto size-9 text-[#ea580c]" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-[#171717]">Solicitud preparada</h1>
          <p role="status" className="mt-2 text-sm leading-6 text-[#44403c]">En producción recibirías un enlace temporal. En esta demo no se envían correos.</p>
          <Link href="/reset-password?returnTo=/login" className="mt-5 flex h-10 items-center justify-center bg-[#f97316] text-xs font-semibold text-white hover:bg-[#ea580c]">Abrir restablecimiento demo</Link>
        </div>
      ) : (
        <>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#f97316]"><ArrowLeft className="size-3.5" aria-hidden="true" /> Iniciar sesión</Link>
          <h1 className="mt-5 text-2xl font-semibold text-[#171717]">Recuperar contraseña</h1>
          <p className="mt-2 text-sm leading-6 text-[#44403c]">Ingresa el correo asociado a tu cuenta para simular el proceso de recuperación.</p>
          <form onSubmit={submitRecovery} className="mt-5 space-y-4">
            <label htmlFor="email" className="block text-xs font-semibold text-[#ea580c]">Correo electrónico<input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className="mt-1.5 h-11 w-full border border-[#e7e5e4] px-3 text-sm font-normal outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#fff7ed]" /></label>
            <button type="submit" className="h-11 w-full bg-[#f97316] text-sm font-semibold text-white hover:bg-[#ea580c]">Preparar enlace</button>
          </form>
        </>
      )}
    </section>
  );
}