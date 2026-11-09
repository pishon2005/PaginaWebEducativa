"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInInputSchema, type SignInInput } from "@/lib/domain";
import { signInAction } from "../actions";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");
  const queryErrorMessage =
    queryError === "auth-config"
      ? "El servicio de autenticación no está configurado."
      : queryError === "auth-unavailable"
        ? "El servicio de autenticación no está disponible."
        : queryError === "callback"
          ? "El enlace de autenticación no es válido o expiró."
          : queryError === "logout"
            ? "No se pudo cerrar la sesión correctamente."
            : null;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(SignInInputSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleSignIn(input: SignInInput) {
    setActionError(null);
    const formData = new FormData();
    formData.set("email", input.email);
    formData.set("password", input.password);
    formData.set("next", searchParams.get("next") ?? "");

    startTransition(async () => {
      const result = await signInAction(formData);
      if (result.ok) {
        window.location.assign(result.data.redirectTo);
        return;
      }
      setActionError(result.error.message);
    });
  }

  return (
        <section>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ea580c]">Bienvenido de nuevo</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Iniciar sesión</h2>
            <p className="mt-2 text-sm leading-6 text-[#44403c]">Entra a tu espacio para continuar donde lo dejaste.</p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-[#171717]">Correo electrónico</label>
              <input id="email" type="email" autoComplete="username" {...register("email")} placeholder="nombre@edukatech.pe" className="mt-1.5 h-12 w-full rounded-xl border border-[#e7e5e4] bg-white px-4 text-sm outline-none transition placeholder:text-[#78716c] focus:border-[#ea580c] focus:ring-4 focus:ring-[#fff7ed]/70" />
              {errors.email && <p className="text-xs text-[#a24135]">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-[#171717]">Contraseña</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} placeholder="Ingresa tu contraseña" className="mt-1.5 h-12 w-full rounded-xl border border-[#e7e5e4] bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-[#78716c] focus:border-[#ea580c] focus:ring-4 focus:ring-[#fff7ed]/70" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-[#44403c] hover:text-[#c2410c]">
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#a24135]">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">¿Olvidaste tu contraseña?</Link>
            </div>
            {(actionError || queryErrorMessage || errors.root) && <p role="alert" className="rounded-lg border border-[#efceca] bg-[#fff4f2] px-3 py-2.5 text-xs text-[#a24135]">{actionError ?? queryErrorMessage ?? errors.root?.message}</p>}
            <button type="submit" disabled={isPending} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] disabled:cursor-wait disabled:opacity-70">{isPending ? "Validando..." : "Ingresar"} <ArrowRight className="size-4" aria-hidden="true" /></button>
          </form>

          <p className="mt-6 text-center text-xs text-[#78716c]">Las cuentas se habilitan mediante invitación institucional.</p>
          <Link href="/" className="mt-3 block text-center text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Volver al sitio público</Link>
        </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
      <LoginForm />
    </Suspense>
  );
}