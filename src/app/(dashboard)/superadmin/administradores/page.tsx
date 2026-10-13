import Link from "next/link";
import { ArrowUpRight, Plus, ShieldCheck, UserRound } from "lucide-react";

const admins = [
  { id: "1", name: "Sofía Herrera", email: "admin@edukatech.pe", role: "Admin", state: "Activo", access: "Total institucional" },
  { id: "2", name: "Ana María Campos", email: "profesor@edukatech.pe", role: "Profesor", state: "Activo", access: "Cursos asignados" },
];

export default function SuperadminAdministradoresPage() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#44403c]">Control de plataforma</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Administradores</h1><p className="mt-2 text-sm text-[#44403c]">Cuentas con acceso de gestión a la institución.</p></div>
        <Link href="/admin/usuarios" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ea580c]"><Plus className="size-4" aria-hidden="true" /> Gestionar cuentas</Link>
      </section>

      <section className="overflow-hidden border border-[#e7e5e4] bg-white">
        <div className="flex items-center justify-between border-b border-[#e7e5e4] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#171717]">Cuentas con acceso de gestión</h2><p className="mt-1 text-xs text-[#78716c]">Directorio demo · 2 cuentas</p></div><ShieldCheck className="size-5 text-[#44403c]" aria-hidden="true" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-[#fff7ed] text-[10px] uppercase tracking-[0.1em] text-[#78716c]"><tr><th className="px-5 py-3 font-semibold">Persona</th><th className="px-5 py-3 font-semibold">Rol</th><th className="px-5 py-3 font-semibold">Alcance</th><th className="px-5 py-3 font-semibold">Estado</th><th className="px-5 py-3" /></tr></thead>
            <tbody className="divide-y divide-[#fafaf9]">{admins.map((admin) => <tr key={admin.email} className="hover:bg-[#fff7ed]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#fff7ed] text-[#ea580c]"><UserRound className="size-4" aria-hidden="true" /></span><span><span className="block font-semibold text-[#171717]">{admin.name}</span><span className="mt-1 block text-xs text-[#78716c]">{admin.email}</span></span></div></td><td className="px-5 py-4"><span className="border border-[#fff7ed] bg-[#fff7ed] px-2 py-1 text-xs font-medium text-[#ea580c]">{admin.role}</span></td><td className="px-5 py-4 text-xs text-[#44403c]">{admin.access}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#ea580c]"><span className="size-1.5 rounded-full bg-[#ea580c]" />{admin.state}</span></td><td className="px-5 py-4"><Link href={`/admin/usuarios/${admin.id}`} aria-label={`Ver cuenta de ${admin.name}`} className="text-[#ea580c] hover:text-[#f97316]"><ArrowUpRight className="size-4" aria-hidden="true" /></Link></td></tr>)}</tbody>
          </table>
        </div>
        <p className="border-t border-[#e7e5e4] px-5 py-3 text-[10px] text-[#78716c]">El alta y los cambios de acceso son demostrativos; no se guardan fuera de esta sesión.</p>
      </section>
    </div>
  );
}