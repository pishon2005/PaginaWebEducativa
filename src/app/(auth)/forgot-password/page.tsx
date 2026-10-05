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
    <section className="w-full max-w-md border border-[#dce5dc] bg-white p-6 shadow-[0_25px_80px_-55px_rgba(20,55,37,0.5)] sm:p-8">
      {submitted ? (
        <div className="text-center">
          <MailCheck className="mx-auto size-9 text-[#5e8563]" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-[#193b2b]">Solicitud preparada</h1>
          <p role="status" className="mt-2 text-sm leading-6 text-[#738178]">En producción recibirías un enlace temporal. En esta demo no se envían correos.</p>
          <Link href="/reset-password?returnTo=/login" className="mt-5 flex h-10 items-center justify-center bg-[#173c2d] text-xs font-semibold text-white hover:bg-[#24543e]">Abrir restablecimiento demo</Link>
        </div>
      ) : (
        <>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647a68] hover:text-[#173c2d]"><ArrowLeft className="size-3.5" aria-hidden="true" /> Iniciar sesión</Link>
          <h1 className="mt-5 text-2xl font-semibold text-[#193b2b]">Recuperar contraseña</h1>
          <p className="mt-2 text-sm leading-6 text-[#738178]">Ingresa el correo asociado a tu cuenta para simular el proceso de recuperación.</p>
          <form onSubmit={submitRecovery} className="mt-5 space-y-4">
            <label htmlFor="email" className="block text-xs font-semibold text-[#4c5f51]">Correo electrónico<input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className="mt-1.5 h-11 w-full border border-[#d8e1d9] px-3 text-sm font-normal outline-none focus:border-[#63856a] focus:ring-2 focus:ring-[#dce9dd]" /></label>
            <button type="submit" className="h-11 w-full bg-[#173c2d] text-sm font-semibold text-white hover:bg-[#24543e]">Preparar enlace</button>
          </form>
        </>
      )}
    </section>
  );
}