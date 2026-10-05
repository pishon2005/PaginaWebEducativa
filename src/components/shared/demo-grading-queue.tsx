"use client";

import { FormEvent, useState } from "react";
import { Check, ClipboardCheck } from "lucide-react";

type Submission = { id: number; name: string; email: string; date: string; grade?: number };

const initialSubmissions: Submission[] = [
  { id: 1, name: "Juan Pérez", email: "juan@email.com", date: "4 oct 2026" },
  { id: 2, name: "María López", email: "maria@email.com", date: "5 oct 2026", grade: 18 },
  { id: 3, name: "Valeria Rojas", email: "alumno@aulanorte.pe", date: "5 oct 2026" },
];

export function DemoGradingQueue() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  function saveGrade(id: number, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const grade = Number(formData.get("grade"));
    if (grade < 0 || grade > 20) return;
    setSubmissions((current) => current.map((submission) => submission.id === id ? { ...submission, grade } : submission));
    setReviewingId(null);
    setNotice("La calificación y retroalimentación se actualizaron en la demo.");
  }

  return (
    <div className="space-y-4">
      {notice && <p role="status" className="flex items-center gap-2 border border-[#d8e7d8] bg-[#f3f8f3] px-4 py-2.5 text-xs text-[#4e7553]"><Check className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}
      <div className="grid gap-3 sm:grid-cols-3">{[{ label: "Por calificar", value: submissions.filter((submission) => submission.grade === undefined).length }, { label: "Calificadas", value: submissions.filter((submission) => submission.grade !== undefined).length }, { label: "Escala", value: "0–20" }].map((stat) => <article key={stat.label} className="border border-[#dfe7e0] bg-white p-4"><p className="text-xs text-[#7b887f]">{stat.label}</p><p className="mt-1 text-xl font-semibold text-[#24402e]">{stat.value}</p></article>)}</div>
      <section className="divide-y divide-[#edf1ed] border border-[#dfe7e0] bg-white">{submissions.map((submission) => <div key={submission.id} className="p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-[#344a39]">{submission.name}</p><p className="mt-1 text-[10px] text-[#849087]">{submission.email} · entregado {submission.date}</p></div><div className="flex items-center gap-3">{submission.grade !== undefined && <span className="text-xs font-bold text-[#4e7553]">{submission.grade}/20</span>}<button type="button" onClick={() => setReviewingId((current) => current === submission.id ? null : submission.id)} className="border border-[#cdd9cf] px-3 py-2 text-xs font-semibold text-[#4f6e54] hover:bg-[#f4f8f4]">{submission.grade === undefined ? "Revisar" : "Editar nota"}</button></div></div>{reviewingId === submission.id && <form onSubmit={(event) => saveGrade(submission.id, event)} className="mt-4 grid gap-3 border-t border-[#edf1ed] pt-4 sm:grid-cols-[130px_1fr_auto]"><label className="text-[10px] font-semibold text-[#64756a]">Nota (0–20)<input name="grade" type="number" min="0" max="20" step="0.1" defaultValue={submission.grade ?? ""} required className="mt-1 h-9 w-full border border-[#dfe7df] px-2 text-xs" /></label><label className="text-[10px] font-semibold text-[#64756a]">Retroalimentación<textarea name="feedback" rows={2} placeholder="Comentario para el alumno" className="mt-1 w-full resize-y border border-[#dfe7df] px-3 py-2 text-xs font-normal" /></label><button type="submit" className="self-end bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]"><ClipboardCheck className="mr-1.5 inline size-3.5" aria-hidden="true" />Guardar nota</button></form>}</div>)}</section>
    </div>
  );
}