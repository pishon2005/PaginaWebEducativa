"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, UserRound } from "lucide-react";

export function DemoAdminUserEditor({ userId }: { userId: string }) {
  const isProfessor = userId === "3";
  const [name, setName] = useState(isProfessor ? "Ana María" : "Juan");
  const [surname, setSurname] = useState(isProfessor ? "Campos" : "Pérez");
  const [email, setEmail] = useState(isProfessor ? "profesor@aulanorte.pe" : "juan@email.com");
  const [role, setRole] = useState(isProfessor ? "profesor" : "alumno");
  const [active, setActive] = useState(true);
  const [notice, setNotice] = useState("");
  const [deleted, setDeleted] = useState(false);

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(`Los cambios de ${name} ${surname} se aplicaron en esta demo.`);
  }

  if (deleted) return <section className="border border-[#dfe7e0] bg-white p-8 text-center"><p className="text-sm font-semibold text-[#344a39]">Cuenta archivada en la vista demo</p><p className="mt-1 text-xs text-[#849087]">No se eliminó ningún dato del sistema.</p><Link href="/admin/usuarios" className="mt-4 inline-block text-xs font-semibold text-[#4f6e54]">Volver a usuarios</Link></section>;

  return (
    <form onSubmit={saveUser} className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col items-center border border-[#dfe7e0] bg-white p-6 text-center"><span className="grid size-20 place-items-center rounded-full bg-[#eaf2eb] text-[#55765a]"><UserRound className="size-8" aria-hidden="true" /></span><p className="mt-4 text-sm font-semibold text-[#344a39]">{name} {surname}</p><p className="mt-1 text-xs text-[#849087]">{email}</p><p className="mt-4 border-t border-[#edf1ed] pt-3 text-[10px] text-[#89958d]">Usuario demo · #{userId}</p></aside>
      <section className="border border-[#dfe7e0] bg-white p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-[#536357]">Nombre<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357]">Apellido<input required value={surname} onChange={(event) => setSurname(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357] sm:col-span-2">Correo electrónico<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357]">Rol<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option value="alumno">Alumno</option><option value="profesor">Profesor</option><option value="admin">Admin</option></select></label><label className="flex items-center gap-2 self-end text-xs text-[#64756a]"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="accent-[#315d3d]" /> Cuenta activa</label></div><div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-[#edf1ed] pt-4"><button type="button" onClick={() => setDeleted(true)} className="border border-[#ecd7d3] px-3 py-2 text-xs font-semibold text-[#a04f44] hover:bg-[#fff6f4]">Archivar demo</button><button type="submit" className="bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]">Guardar cambios</button></div>{notice && <p role="status" className="mt-4 flex items-center gap-2 text-xs text-[#4e7553]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}</section>
    </form>
  );
}