import Link from "next/link";
import { ArrowUpRight, Plus, ShieldCheck, UserRound } from "lucide-react";

const admins = [
  { id: "1", name: "Sofía Herrera", email: "admin@aulanorte.pe", role: "Admin", state: "Activo", access: "Total institucional" },
  { id: "2", name: "Ana María Campos", email: "profesor@aulanorte.pe", role: "Profesor", state: "Activo", access: "Cursos asignados" },
];

export default function SuperadminAdministradoresPage() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718176]">Control de plataforma</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b]">Administradores</h1><p className="mt-2 text-sm text-[#718078]">Cuentas con acceso de gestión a la institución.</p></div>
        <Link href="/admin/usuarios" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#24543e]"><Plus className="size-4" aria-hidden="true" /> Gestionar cuentas</Link>
      </section>

      <section className="overflow-hidden border border-[#dfe7e0] bg-white">
        <div className="flex items-center justify-between border-b border-[#e8ede8] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#263d2e]">Cuentas con acceso de gestión</h2><p className="mt-1 text-xs text-[#849087]">Directorio demo · 2 cuentas</p></div><ShieldCheck className="size-5 text-[#68856d]" aria-hidden="true" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-[#f8faf8] text-[10px] uppercase tracking-[0.1em] text-[#7a887e]"><tr><th className="px-5 py-3 font-semibold">Persona</th><th className="px-5 py-3 font-semibold">Rol</th><th className="px-5 py-3 font-semibold">Alcance</th><th className="px-5 py-3 font-semibold">Estado</th><th className="px-5 py-3" /></tr></thead>
            <tbody className="divide-y divide-[#edf1ed]">{admins.map((admin) => <tr key={admin.email} className="hover:bg-[#fbfcfa]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#eaf2eb] text-[#4c7052]"><UserRound className="size-4" aria-hidden="true" /></span><span><span className="block font-semibold text-[#344a39]">{admin.name}</span><span className="mt-1 block text-xs text-[#829087]">{admin.email}</span></span></div></td><td className="px-5 py-4"><span className="border border-[#dce7dd] bg-[#f5f8f5] px-2 py-1 text-xs font-medium text-[#526c57]">{admin.role}</span></td><td className="px-5 py-4 text-xs text-[#728076]">{admin.access}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4d7654]"><span className="size-1.5 rounded-full bg-[#72a078]" />{admin.state}</span></td><td className="px-5 py-4"><Link href={`/admin/usuarios/${admin.id}`} aria-label={`Ver cuenta de ${admin.name}`} className="text-[#5c7861] hover:text-[#173c2d]"><ArrowUpRight className="size-4" aria-hidden="true" /></Link></td></tr>)}</tbody>
          </table>
        </div>
        <p className="border-t border-[#e8ede8] px-5 py-3 text-[10px] text-[#8b978e]">El alta y los cambios de acceso son demostrativos; no se guardan fuera de esta sesión.</p>
      </section>
    </div>
  );
}