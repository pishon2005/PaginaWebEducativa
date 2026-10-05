"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export function DemoResetPasswordForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);

  function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirmation = String(formData.get("confirmation"));
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setUpdated(true);
  }

  if (updated) {
    return (
      <section className="w-full max-w-md border border-[#dce5dc] bg-white p-6 text-center shadow-[0_25px_80px_-55px_rgba(20,55,37,0.5)] sm:p-8">
        <CheckCircle2 className="mx-auto size-9 text-[#5e8563]" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-[#193b2b]">Contraseña actualizada</h1>
        <p className="mt-2 text-sm leading-6 text-[#738178]">El cambio se simuló correctamente. No se guardó una contraseña real.</p>
        <button type="button" onClick={() => router.push(returnTo)} className="mt-5 h-10 w-full bg-[#173c2d] text-xs font-semibold text-white hover:bg-[#24543e]">Continuar</button>
      </section>
    );
  }

  return (
    <section className="w-full max-w-md border border-[#dce5dc] bg-white p-6 shadow-[0_25px_80px_-55px_rgba(20,55,37,0.5)] sm:p-8">
      <h1 className="text-2xl font-semibold text-[#193b2b]">Nueva contraseña</h1>
      <p className="mt-2 text-sm leading-6 text-[#738178]">Crea una contraseña de al menos 8 caracteres para continuar.</p>
      <form onSubmit={updatePassword} className="mt-5 space-y-4">
        <label htmlFor="password" className="block text-xs font-semibold text-[#4c5f51]">Nueva contraseña<input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" className="mt-1.5 h-11 w-full border border-[#d8e1d9] px-3 text-sm font-normal outline-none focus:border-[#63856a]" /></label>
        <label htmlFor="confirmation" className="block text-xs font-semibold text-[#4c5f51]">Confirmar contraseña<input id="confirmation" name="confirmation" type="password" minLength={8} required autoComplete="new-password" className="mt-1.5 h-11 w-full border border-[#d8e1d9] px-3 text-sm font-normal outline-none focus:border-[#63856a]" /></label>
        {error && <p role="alert" className="text-xs font-medium text-[#a24135]">{error}</p>}
        <button type="submit" className="h-11 w-full bg-[#173c2d] text-sm font-semibold text-white hover:bg-[#24543e]">Guardar nueva contraseña</button>
      </form>
      <Link href="/login" className="mt-4 block text-center text-xs font-semibold text-[#66806b] hover:text-[#173c2d]">Volver al inicio de sesión</Link>
    </section>
  );
}