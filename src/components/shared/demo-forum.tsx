"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole, Pin, Plus, Search, Send } from "lucide-react";

type DemoForumProps = {
  role: "alumno" | "profesor";
  courseName?: string;
};

type ForumThread = {
  id: number;
  title: string;
  body: string;
  course: string;
  author: string;
  date: string;
  replies: number;
  pinned: boolean;
  closed: boolean;
};

const starterThreads: ForumThread[] = [
  { id: 1, title: "Duda con el ejercicio de funciones", body: "¿Conviene devolver una lista o imprimir el resultado dentro de la función?", course: "Fundamentos de Python", author: "Valeria Rojas", date: "Hoy · 09:18", replies: 3, pinned: true, closed: false },
  { id: 2, title: "Material complementario del módulo 2", body: "Comparto una guía corta para practicar condicionales y bucles.", course: "Fundamentos de Python", author: "Diego Salas", date: "Ayer · 16:42", replies: 5, pinned: false, closed: false },
  { id: 3, title: "¿Cuándo se publica la siguiente clase?", body: "Quería organizar mi horario de estudio para esta semana.", course: "Fundamentos de Python", author: "María López", date: "3 oct · 11:06", replies: 1, pinned: false, closed: true },
  { id: 4, title: "Compartimos fórmulas útiles", body: "¿Qué funciones usan para resumir las ventas del ejercicio?", course: "Excel para negocios", author: "Andrés Vega", date: "Ayer · 14:20", replies: 2, pinned: false, closed: false },
  { id: 5, title: "Comentarios sobre el prototipo", body: "Dejo una pregunta sobre jerarquía visual y contraste.", course: "Diseño de interfaces", author: "Lucía Torres", date: "4 oct · 12:35", replies: 4, pinned: false, closed: false },
];

const forumCourses = [
  "Fundamentos de Python",
  "Desarrollo web con React",
  "Excel para negocios",
  "Introducción a ciencia de datos",
  "Diseño de interfaces",
  "SQL y bases de datos",
];

export function DemoForum({ role, courseName }: DemoForumProps) {
  const [threads, setThreads] = useState(starterThreads);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(courseName ?? "Todos los cursos");
  const [showComposer, setShowComposer] = useState(false);
  const [selectedThread, setSelectedThread] = useState<number | null>(null);
  const [draftReply, setDraftReply] = useState("");
  const [notice, setNotice] = useState("");
  const visibleThreads = useMemo(() => threads.filter((thread) => {
    const matchesCourse = selectedCourse === "Todos los cursos" || thread.course === selectedCourse;
    const matchesSearch = `${thread.title} ${thread.body} ${thread.author} ${thread.course}`.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  }), [search, selectedCourse, threads]);

  function addThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title")).trim();
    const body = String(data.get("body")).trim();
    const course = String(data.get("course"));
    setThreads((current) => [{ id: Date.now(), title, body, course, author: role === "alumno" ? "Valeria Rojas" : "Ana María Campos", date: "Ahora", replies: 0, pinned: false, closed: false }, ...current]);
    setSelectedCourse(course);
    setShowComposer(false);
    setNotice("El tema se añadió a esta vista de demostración.");
  }

  function addReply(threadId: number, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draftReply.trim()) return;
    setThreads((current) => current.map((thread) => thread.id === threadId ? { ...thread, replies: thread.replies + 1 } : thread));
    setDraftReply("");
    setNotice("Tu respuesta se añadió en esta sesión demo.");
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#dfe7e0] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#718176]">Comunidad de aprendizaje</p>
            <h2 className="mt-1 text-base font-semibold text-[#263d2e]">Foro de cursos</h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-[#7d8981]">
              {role === "profesor" ? "Publica avisos, responde preguntas y modera las conversaciones." : "Pregunta, comparte recursos y conversa con docentes y compañeros."}
            </p>
          </div>
          <button type="button" onClick={() => { setShowComposer((visible) => !visible); setNotice(""); }} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#173c2d] px-4 text-xs font-semibold text-white hover:bg-[#24543e]"><Plus className="size-4" aria-hidden="true" />{role === "profesor" ? "Publicar tema" : "Nueva consulta"}</button>
        </div>
        <div className="mt-4 grid gap-3 border-t border-[#edf1ed] pt-4 sm:grid-cols-[minmax(180px,0.7fr)_1fr]">
          <label className="text-[10px] font-semibold text-[#64756a]">
            Ver conversaciones de
            <select aria-label="Filtrar foro por curso" value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)} disabled={Boolean(courseName)} className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] bg-white px-3 text-xs font-medium text-[#405747] disabled:bg-[#f7f9f6]">
              {!courseName && <option>Todos los cursos</option>}
              {forumCourses.map((course) => <option key={course}>{course}</option>)}
            </select>
          </label>
          <label className="relative block self-end">
            <span className="sr-only">Buscar en los temas del foro</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#859188]" aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar temas" placeholder="Buscar temas o respuestas" className="h-10 w-full rounded-lg border border-[#dfe7df] pl-9 pr-3 text-xs outline-none focus:border-[#78967c]" />
          </label>
        </div>
        <p className="mt-3 text-[10px] text-[#849087]">
          {selectedCourse === "Todos los cursos" ? "Los temas muestran a qué curso pertenece cada conversación." : `Estás viendo el espacio de ${selectedCourse}.`}
        </p>
      </section>

      {showComposer && <form onSubmit={addThread} className="space-y-3 rounded-2xl border border-[#dfe7e0] bg-white p-4"><label className="block text-xs font-semibold text-[#536357]">Curso de la conversación<select name="course" defaultValue={courseName ?? (selectedCourse === "Todos los cursos" ? forumCourses[0] : selectedCourse)} disabled={Boolean(courseName)} className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] bg-white px-3 text-xs font-normal disabled:bg-[#f7f9f6]">{(courseName ? [courseName] : forumCourses).map((course) => <option key={course}>{course}</option>)}</select>{courseName && <input type="hidden" name="course" value={courseName} />}</label><label className="block text-xs font-semibold text-[#536357]">Título<input name="title" required maxLength={100} placeholder="¿Sobre qué quieres conversar?" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="block text-xs font-semibold text-[#536357]">Mensaje<textarea name="body" required rows={3} maxLength={1000} placeholder="Escribe el contexto de tu consulta..." className="mt-1.5 w-full resize-y rounded-lg border border-[#dfe7df] px-3 py-2 text-sm font-normal" /></label><button type="submit" className="rounded-lg bg-[#315d3d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#244d32]">Publicar en el foro</button></form>}
      {notice && <p role="status" className="border border-[#dce8dc] bg-[#f1f7f1] px-4 py-2.5 text-xs text-[#4d7252]">{notice} No se guardó en un servidor.</p>}

      <section className="space-y-3" aria-label="Temas del foro">
        {visibleThreads.map((thread) => <article key={thread.id} className="border border-[#dfe7e0] bg-white">
          <div className="flex flex-wrap items-start justify-between gap-3 p-4">
            <button type="button" onClick={() => setSelectedThread((current) => current === thread.id ? null : thread.id)} className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-2">{thread.pinned && <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8a713d]"><Pin className="size-3" aria-hidden="true" /> Fijado</span>}{thread.closed && <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#87938a]"><LockKeyhole className="size-3" aria-hidden="true" /> Cerrado</span>}</span>
              <span className="mt-1 block text-sm font-semibold text-[#304637]">{thread.title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#748177]">{thread.body}</span>
              <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#8a958d]"><span className="font-semibold text-[#58705c]">{thread.course}</span><span>{thread.author}</span><span>{thread.date}</span><span>{thread.replies} respuestas</span></span>
            </button>
            {role === "profesor" && <div className="flex gap-2"><button type="button" onClick={() => setThreads((current) => current.map((item) => item.id === thread.id ? { ...item, pinned: !item.pinned } : item))} className="border border-[#e1e8e1] px-2.5 py-1.5 text-[10px] font-semibold text-[#64766a] hover:bg-[#f6f9f6]">{thread.pinned ? "Desfijar" : "Fijar"}</button><button type="button" onClick={() => setThreads((current) => current.map((item) => item.id === thread.id ? { ...item, closed: !item.closed } : item))} className="border border-[#e1e8e1] px-2.5 py-1.5 text-[10px] font-semibold text-[#64766a] hover:bg-[#f6f9f6]">{thread.closed ? "Reabrir" : "Cerrar"}</button></div>}
          </div>
          {selectedThread === thread.id && <div className="border-t border-[#edf1ed] bg-[#fbfcfa] p-4"><div className="space-y-3"><p className="flex items-start gap-2 text-xs leading-5 text-[#64756a]"><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#e7eee7] text-[8px] font-bold text-[#4c7052]">AC</span><span><strong className="text-[#405747]">Ana María Campos</strong><br />Buena pregunta. Revisemos el ejemplo en la próxima clase; mientras tanto, prueba ambos enfoques y compara el resultado.</span></p><p className="flex items-center gap-1.5 text-[10px] text-[#64806a]"><CheckCircle2 className="size-3.5" aria-hidden="true" />Respuesta del profesor</p></div>{!thread.closed && <form onSubmit={(event) => addReply(thread.id, event)} className="mt-4 flex gap-2"><input value={draftReply} onChange={(event) => setDraftReply(event.target.value)} aria-label="Escribe una respuesta" placeholder="Escribe una respuesta..." className="h-9 min-w-0 flex-1 border border-[#dfe7df] bg-white px-3 text-xs" /><button type="submit" aria-label="Enviar respuesta" className="grid size-9 shrink-0 place-items-center bg-[#315d3d] text-white hover:bg-[#244d32]"><Send className="size-3.5" aria-hidden="true" /></button></form>}</div>}
        </article>)}
        {visibleThreads.length === 0 && <div className="border border-dashed border-[#d9e2d9] bg-white px-5 py-12 text-center"><p className="text-sm font-semibold text-[#3f5645]">No hay temas con esa búsqueda</p><p className="mt-1 text-xs text-[#829087]">Prueba con otra palabra.</p></div>}
      </section>
    </div>
  );
}