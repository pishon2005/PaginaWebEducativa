import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Plus,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718176]">Lunes, 5 de octubre</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b]">Buenos días, administrador</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#718078]">Este es el estado de tu institución. Desde aquí puedes gestionar cursos, usuarios y pagos.</p>
        </div>
        <Link href="/admin/cursos/nuevo" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24543e]">
          <Plus className="size-4" aria-hidden="true" /> Crear curso
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores de la institución">
        {[
          { label: "Ventas del mes", value: "S/ 2,450", note: "+12% frente al mes pasado", icon: CreditCard },
          { label: "Alumnos activos", value: "128", note: "14 nuevos este mes", icon: Users },
          { label: "Cursos publicados", value: "6", note: "2 en preparación", icon: BookOpen },
          { label: "Pagos por revisar", value: "4", note: "La revisión está pendiente", icon: CreditCard },
        ].map(({ label, value, note, icon: Icon }) => (
          <article key={label} className="rounded-lg border border-[#dfe7e0] bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-[#6f7d73]">{label}</p>
              <Icon className="size-[18px] text-[#708d76]" aria-hidden="true" />
            </div>
            <p className="mt-4 text-[28px] font-semibold tracking-tight text-[#1b382a]">{value}</p>
            <p className="mt-1 text-xs text-[#849087]">{note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-[#dfe7e0] bg-white">
          <div className="flex items-center justify-between border-b border-[#e8ede8] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#20392b]">Actividad reciente</h2>
              <p className="mt-1 text-xs text-[#849087]">Movimientos que requieren seguimiento</p>
            </div>
            <Link href="/admin/pagos" className="inline-flex items-center gap-1 text-xs font-semibold text-[#376348] hover:text-[#173c2d]">Ver pagos <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
          </div>
          <div className="divide-y divide-[#edf1ed]">
            {[
              { name: "María Fernanda Ruiz", detail: "Pago de Fundamentos de Python", amount: "S/ 189", status: "Por revisar" },
              { name: "Diego Salas", detail: "Pago de Excel para negocios", amount: "S/ 149", status: "Por revisar" },
              { name: "Lucía Torres", detail: "Nueva inscripción aprobada", amount: "S/ 229", status: "Aprobado" },
            ].map((entry) => (
              <div key={entry.name} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#2b4033]">{entry.name}</p>
                  <p className="mt-1 text-xs text-[#7d8981]">{entry.detail}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[#304637]">{entry.amount}</span>
                  <span className={`rounded-sm px-2 py-1 text-[10px] font-semibold ${entry.status === "Aprobado" ? "bg-[#edf5ed] text-[#49734e]" : "bg-[#fff4df] text-[#986c20]"}`}>{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#dfe7e0] bg-white p-5">
          <h2 className="text-base font-semibold text-[#20392b]">Accesos de gestión</h2>
          <p className="mt-1 text-xs text-[#849087]">Tareas frecuentes de administración</p>
          <div className="mt-4 divide-y divide-[#edf1ed]">
            {[
              { label: "Administrar cursos", href: "/admin/cursos", icon: BookOpen },
              { label: "Gestionar usuarios", href: "/admin/usuarios", icon: Users },
              { label: "Revisar pagos", href: "/admin/pagos", icon: CreditCard },
              { label: "Consultar reportes", href: "/admin/reportes", icon: ArrowRight },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="group flex items-center justify-between py-3 text-sm font-medium text-[#526358] hover:text-[#1d513a]">
                <span className="flex items-center gap-3"><Icon className="size-4 text-[#7a8e7e]" aria-hidden="true" />{label}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}