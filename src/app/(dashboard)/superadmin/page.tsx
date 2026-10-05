import Link from "next/link";
import { ArrowRight, KeyRound, ShieldCheck, UserPlus, UsersRound } from "lucide-react";

export default function SuperadminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718176]">Gobierno de plataforma</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b]">Panel superadmin</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#718078]">Control global de cuentas administrativas, roles y permisos de ProyectoClases.</p>
        </div>
        <Link href="/superadmin/administradores" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24543e]"><UserPlus className="size-4" aria-hidden="true" /> Administradores</Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Estado de la plataforma">
        {[
          { title: "Cuentas administrativas", value: "2", detail: "1 superadmin · 1 admin", icon: UsersRound },
          { title: "Roles configurados", value: "4", detail: "Permisos diferenciados", icon: KeyRound },
          { title: "Estado de seguridad", value: "Activo", detail: "Demo sin conexión a datos reales", icon: ShieldCheck },
        ].map(({ title, value, detail, icon: Icon }) => (
          <article key={title} className="border border-[#dfe7e0] bg-white p-5">
            <div className="flex items-center justify-between"><p className="text-sm font-medium text-[#6f7d73]">{title}</p><Icon className="size-[18px] text-[#708d76]" aria-hidden="true" /></div>
            <p className="mt-4 text-2xl font-semibold text-[#1b382a]">{value}</p>
            <p className="mt-1 text-xs text-[#849087]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/superadmin/administradores" className="group border border-[#dfe7e0] bg-white p-6 transition-colors hover:border-[#b7cbb9]">
          <span className="grid size-10 place-items-center bg-[#edf4ee] text-[#4d7654]"><UsersRound className="size-5" aria-hidden="true" /></span>
          <h2 className="mt-5 text-base font-semibold text-[#243c2d]">Administradores</h2>
          <p className="mt-2 text-sm leading-6 text-[#758178]">Consulta las cuentas que administran la institución y sus estados.</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#4c7052]">Abrir directorio <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
        </Link>
        <Link href="/superadmin/roles" className="group border border-[#dfe7e0] bg-white p-6 transition-colors hover:border-[#b7cbb9]">
          <span className="grid size-10 place-items-center bg-[#edf4ee] text-[#4d7654]"><KeyRound className="size-5" aria-hidden="true" /></span>
          <h2 className="mt-5 text-base font-semibold text-[#243c2d]">Roles y permisos</h2>
          <p className="mt-2 text-sm leading-6 text-[#758178]">Revisa qué capacidades corresponden a cada tipo de cuenta.</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#4c7052]">Ver matriz <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
        </Link>
      </section>
    </div>
  );
}