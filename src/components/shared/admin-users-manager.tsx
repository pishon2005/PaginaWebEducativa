"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, UserRound } from "lucide-react";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: "Alumno" | "Profesor" | "Admin";
  active: boolean;
};

const initialUsers: DemoUser[] = [
  { id: "1", name: "Juan Pérez", email: "juan@email.com", role: "Alumno", active: true },
  { id: "2", name: "María López", email: "maria@email.com", role: "Alumno", active: true },
  { id: "3", name: "Ana María Campos", email: "profesor@aulanorte.pe", role: "Profesor", active: true },
  { id: "4", name: "Valeria Rojas", email: "alumno@aulanorte.pe", role: "Alumno", active: true },
];

export function AdminUsersManager() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos los roles");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const visibleUsers = useMemo(() => users.filter((user) => {
    const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (roleFilter === "Todos los roles" || user.role === roleFilter);
  }), [query, roleFilter, users]);

  function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim().toLowerCase();
    const role = String(formData.get("role")) as DemoUser["role"];
    setUsers((currentUsers) => [...currentUsers, { id: String(Date.now()), name, email, role, active: true }]);
    setNotice(`${name} se añadió a esta vista de demostración.`);
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen de usuarios">
        {[{ label: "Total de usuarios", value: users.length }, { label: "Activos", value: users.filter((user) => user.active).length }, { label: "Profesores", value: users.filter((user) => user.role === "Profesor").length }].map((stat) => <article key={stat.label} className="border border-[#dfe7e0] bg-white p-4"><p className="text-xs text-[#7b887f]">{stat.label}</p><p className="mt-1 text-2xl font-semibold text-[#24402e]">{stat.value}</p></article>)}
      </section>

      <section className="border border-[#dfe7e0] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e8ede8] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row">
            <label className="relative block flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#859188]" aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar usuarios" placeholder="Buscar por nombre o correo" className="h-10 w-full border border-[#dfe7df] pl-9 pr-3 text-xs outline-none focus:border-[#78967c]" /></label>
            <select aria-label="Filtrar por rol" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-10 border border-[#dfe7df] bg-white px-3 text-xs text-[#526358]"><option>Todos los roles</option><option>Alumno</option><option>Profesor</option><option>Admin</option></select>
          </div>
          <button type="button" onClick={() => { setShowForm((visible) => !visible); setNotice(""); }} className="inline-flex h-10 items-center justify-center gap-2 bg-[#173c2d] px-4 text-xs font-semibold text-white hover:bg-[#24543e]"><Plus className="size-4" aria-hidden="true" /> Nuevo usuario</button>
        </div>

        {showForm && <form onSubmit={createUser} className="grid gap-3 border-b border-[#e8ede8] bg-[#f8faf8] p-4 sm:grid-cols-[1fr_1fr_150px_auto] sm:items-end"><label className="text-[10px] font-semibold text-[#64756a]">Nombre<input required name="name" placeholder="Nombre completo" className="mt-1 h-9 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal" /></label><label className="text-[10px] font-semibold text-[#64756a]">Correo<input required name="email" type="email" placeholder="persona@email.com" className="mt-1 h-9 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal" /></label><label className="text-[10px] font-semibold text-[#64756a]">Rol<select name="role" className="mt-1 h-9 w-full border border-[#dfe7df] bg-white px-2 text-xs font-normal"><option>Alumno</option><option>Profesor</option><option>Admin</option></select></label><button type="submit" className="h-9 bg-[#315d3d] px-4 text-xs font-semibold text-white hover:bg-[#244d32]">Añadir</button></form>}
        {notice && <p role="status" className="border-b border-[#dce8dc] bg-[#f1f7f1] px-4 py-2.5 text-xs text-[#4d7252]">{notice} No se guardó en un servidor.</p>}

        <div className="divide-y divide-[#edf1ed]">
          {visibleUsers.map((user) => <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5"><Link href={`/admin/usuarios/${user.id}`} className="flex min-w-[220px] flex-1 items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#eaf2eb] text-[#55765a]"><UserRound className="size-4" aria-hidden="true" /></span><span><span className="block text-xs font-semibold text-[#33493a]">{user.name}</span><span className="mt-1 block text-[10px] text-[#829087]">{user.email}</span></span></Link><span className="min-w-20 border border-[#dce7dd] bg-[#f5f8f5] px-2 py-1 text-center text-[10px] font-medium text-[#526c57]">{user.role}</span><span className={`min-w-16 text-center text-[10px] font-semibold ${user.active ? "text-[#4d7654]" : "text-[#a15c51]"}`}>{user.active ? "Activo" : "Inactivo"}</span><button type="button" onClick={() => setUsers((currentUsers) => currentUsers.map((currentUser) => currentUser.id === user.id ? { ...currentUser, active: !currentUser.active } : currentUser))} className="text-[10px] font-semibold text-[#63796a] hover:text-[#173c2d]">{user.active ? "Desactivar" : "Activar"}</button></div>)}
          {visibleUsers.length === 0 && <p className="px-5 py-10 text-center text-xs text-[#849087]">No hay usuarios que coincidan con estos filtros.</p>}
        </div>
        <p className="border-t border-[#e8ede8] px-5 py-3 text-[10px] text-[#8b978e]">Los cambios se mantienen solo mientras esta página permanezca abierta.</p>
      </section>
    </div>
  );
}