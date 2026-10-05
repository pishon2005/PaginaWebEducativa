"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Plus, UsersRound } from "lucide-react";

type EnrolledStudent = { id: number; name: string; email: string; progress: number };

const availableStudents = [
  { id: 4, name: "Valeria Rojas", email: "alumno@aulanorte.pe" },
  { id: 5, name: "Diego Salas", email: "diego@email.com" },
  { id: 6, name: "Lucía Torres", email: "lucia@email.com" },
];

export function DemoCourseEnrollments({ courseId }: { courseId: string }) {
  const [students, setStudents] = useState<EnrolledStudent[]>([
    { id: 1, name: "Juan Pérez", email: "juan@email.com", progress: 65 },
    { id: 2, name: "María López", email: "maria@email.com", progress: 40 },
    { id: 3, name: "Carlos Ruiz", email: "carlos@email.com", progress: 90 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  function enrollStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedId = Number(formData.get("student"));
    const selected = availableStudents.find((student) => student.id === selectedId);
    if (!selected || students.some((student) => student.id === selected.id)) {
      setNotice("Ese alumno ya está inscrito o no se encontró.");
      return;
    }
    setStudents((current) => [...current, { ...selected, progress: 0 }]);
    setShowForm(false);
    setNotice(`${selected.name} se inscribió a este curso en la demo.`);
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 border border-[#dfe7e0] bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center bg-[#edf4ee] text-[#54765a]"><UsersRound className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#304637]">Alumnos inscritos</h2><p className="mt-1 text-xs text-[#849087]">Curso #{courseId} · {students.length} estudiantes</p></div></div><button type="button" onClick={() => { setShowForm((visible) => !visible); setNotice(""); }} className="inline-flex items-center gap-2 bg-[#173c2d] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]"><Plus className="size-4" aria-hidden="true" /> Inscribir alumno</button></section>
      {showForm && <form onSubmit={enrollStudent} className="flex flex-col gap-3 border border-[#dfe7e0] bg-white p-4 sm:flex-row sm:items-end"><label className="flex-1 text-xs font-semibold text-[#536357]">Alumno<select name="student" className="mt-1.5 h-10 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal">{availableStudents.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.email}</option>)}</select></label><button type="submit" className="h-10 bg-[#315d3d] px-4 text-xs font-semibold text-white hover:bg-[#244d32]">Confirmar inscripción</button></form>}
      {notice && <p role="status" className="flex items-center gap-2 border border-[#d8e7d8] bg-[#f3f8f3] px-4 py-2.5 text-xs text-[#4e7553]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}
      <section className="divide-y divide-[#edf1ed] border border-[#dfe7e0] bg-white">{students.map((student) => <div key={student.id} className="flex flex-wrap items-center gap-4 px-4 py-3.5"><span className="grid size-9 place-items-center rounded-full bg-[#eaf2eb] text-[10px] font-bold text-[#55765a]">{student.name.split(" ").map((part) => part[0]).join("")}</span><div className="min-w-[180px] flex-1"><p className="text-xs font-semibold text-[#344a39]">{student.name}</p><p className="mt-1 text-[10px] text-[#849087]">{student.email}</p></div><div className="w-full max-w-40"><div className="h-1.5 bg-[#edf1ed]"><div className="h-full bg-[#6e9674]" style={{ width: `${student.progress}%` }} /></div><p className="mt-1 text-right text-[9px] text-[#87938a]">{student.progress}%</p></div><span className="border border-[#dce7dd] bg-[#f5f8f5] px-2 py-1 text-[9px] font-semibold text-[#526c57]">Activo</span></div>)}</section>
    </div>
  );
}