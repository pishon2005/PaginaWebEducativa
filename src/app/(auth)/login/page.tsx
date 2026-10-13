"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, UserRound, UsersRound } from "lucide-react";

const demoAccounts = [
  { role: "Superadmin", email: "superadmin@edukatech.pe", password: "Demo2026!", href: "/superadmin", icon: ShieldCheck },
  { role: "Admin", email: "admin@edukatech.pe", password: "Demo2026!", href: "/admin", icon: UsersRound },
  { role: "Profesor", email: "profesor@edukatech.pe", password: "Demo2026!", href: "/profesor", icon: GraduationCap },
  { role: "Alumno", email: "alumno@edukatech.pe", password: "Demo2026!", href: "/alumno", icon: UserRound, firstLogin: true },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = demoAccounts.find(
      (demoAccount) =>
        demoAccount.email === email.trim().toLowerCase() &&
        demoAccount.password === password,
    );

    if (!account) {
      setError("Correo o contraseña incorrectos. Usa una cuenta de demostración.");
      return;
    }

    sessionStorage.setItem("aula-norte-demo-role", account.role.toLowerCase());
    window.location.href = account.firstLogin ? `/reset-password?returnTo=${account.href}` : account.href;
  }

  return (
        <section>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ea580c]">Bienvenido de nuevo</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Iniciar sesión</h2>
            <p className="mt-2 text-sm leading-6 text-[#44403c]">Entra a tu espacio para continuar donde lo dejaste.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-[#171717]">Correo electrónico</label>
              <input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@edukatech.pe" className="mt-1.5 h-12 w-full rounded-xl border border-[#e7e5e4] bg-white px-4 text-sm outline-none transition placeholder:text-[#78716c] focus:border-[#ea580c] focus:ring-4 focus:ring-[#fff7ed]/70" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-[#171717]">Contraseña</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ingresa tu contraseña" className="mt-1.5 h-12 w-full rounded-xl border border-[#e7e5e4] bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-[#78716c] focus:border-[#ea580c] focus:ring-4 focus:ring-[#fff7ed]/70" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-[#44403c] hover:text-[#c2410c]">
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-[#44403c]"><input type="checkbox" className="size-4 rounded accent-[#f97316]" /> Mantener sesión</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">¿Olvidaste tu contraseña?</Link>
            </div>
            {error && <p role="alert" className="rounded-lg border border-[#efceca] bg-[#fff4f2] px-3 py-2.5 text-xs text-[#a24135]">{error}</p>}
            <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]">Ingresar <ArrowRight className="size-4" aria-hidden="true" /></button>
          </form>

          <details className="mt-7 border-t border-[#e7e5e4] pt-5">
            <summary className="cursor-pointer text-xs font-semibold text-[#ea580c] marker:text-[#78716c]">Explorar con una cuenta de demostración</summary>
            <div className="mt-3 rounded-xl bg-[#fff7ed] p-4">
              <p className="text-[11px] leading-5 text-[#44403c]">Contraseña común: <span className="font-semibold text-[#ea580c]">Demo2026!</span></p>
              <div className="mt-3 grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button key={account.role} type="button" onClick={() => { setEmail(account.email); setPassword(account.password); setError(""); }} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#e7e5e4] bg-white px-3 text-left text-xs font-semibold text-[#44403c] transition hover:border-[#a8a29e] hover:bg-[#fff7ed]">
                    <Icon className="size-4 text-[#ea580c]" aria-hidden="true" />
                    {account.role}
                  </button>
                );
              })}
            </div>
            </div>
          </details>
          <p className="mt-6 text-center text-xs text-[#78716c]">¿No tienes cuenta? <Link href="/registro" className="font-semibold text-[#ea580c] hover:text-[#c2410c]">Crear cuenta</Link></p>
          <Link href="/" className="mt-3 block text-center text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Volver al sitio público</Link>
        </section>
  );
}