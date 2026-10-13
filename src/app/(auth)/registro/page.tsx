"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    const confirm = String(data.get("confirm"));
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setCreated(true);
  }

  if (created) {
    return (
      <section className="text-center">
        <CheckCircle2 className="mx-auto size-10 text-[#ea580c]" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold text-neutral-950">Cuenta creada en la demo</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">Tu registro se simuló correctamente. En producción recibirías un correo de confirmación.</p>
        <button type="button" onClick={() => router.push("/login")} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600">
          Ir a iniciar sesión <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-600">Únete a EDUKATECH</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">Crear cuenta</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">Regístrate para inscribirte en cursos y seguir tu progreso.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-800">Nombre</label>
            <input id="name" name="name" required autoComplete="given-name" placeholder="Valeria" className="mt-1.5 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="surname" className="text-sm font-semibold text-neutral-800">Apellido</label>
            <input id="surname" name="surname" required autoComplete="family-name" placeholder="Rojas" className="mt-1.5 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-neutral-800">Correo electrónico</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className="mt-1.5 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-neutral-800">Contraseña</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className="mt-1.5 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirm" className="text-sm font-semibold text-neutral-800">Confirmar contraseña</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="Repite tu contraseña" className="mt-1.5 h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15" />
        </div>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}
        <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
          Crear cuenta demo <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">Inicia sesión</Link>
      </p>
    </section>
  );
}
