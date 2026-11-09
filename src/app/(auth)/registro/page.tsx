import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";

export default function RegistroPage() {
  return (
    <section>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-600">Únete a EDUKATECH</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">Crear cuenta</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">Las cuentas se habilitan mediante invitación institucional después de las verificaciones correspondientes.</p>
      </div>
      <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-4">
        <KeyRound className="size-5 text-orange-600" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold text-neutral-900">Registro público deshabilitado</p>
        <p className="mt-1 text-xs leading-5 text-neutral-600">El alta de cuentas requiere invitación desde un proceso autorizado. Todavía no está habilitada la gestión real de reservas, pagos y matrículas.</p>
      </div>
      <Link href="/login" className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600">
        Volver al inicio de sesión <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
      <p className="mt-6 text-center text-xs text-neutral-500">
        ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">Inicia sesión</Link>
      </p>
    </section>
  );
}
