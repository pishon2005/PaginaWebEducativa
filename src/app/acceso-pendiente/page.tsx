import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";

export default function PendingAccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fafaf9] px-5">
      <section className="w-full max-w-lg border border-[#e7e5e4] bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#171717]">
          Acceso pendiente de configuración
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#44403c]">
          La autenticación de Supabase está activa, pero todavía no existe un
          perfil institucional verificado para asignar permisos. El acceso a los
          paneles permanece bloqueado hasta aprobar e implementar ese modelo.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-lg border border-[#e7e5e4] px-4 py-2 text-sm font-semibold text-[#44403c]">
            Ir al sitio público
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ea580c]">
              Cerrar sesión
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
