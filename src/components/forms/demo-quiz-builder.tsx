"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { getDemoCourseContent } from "@/lib/demo-course-content";

type QuestionDraft = { id: number; type: string };

export function DemoQuizBuilder({ courseId }: { courseId: string }) {
  const modules = getDemoCourseContent(courseId);
  const [questions, setQuestions] = useState<QuestionDraft[]>([{ id: 1, type: "Opción múltiple" }]);
  const [saved, setSaved] = useState(false);

  function addQuestion() {
    setQuestions((current) => [...current, { id: Date.now(), type: "Opción múltiple" }]);
  }

  function removeQuestion(id: number) {
    setQuestions((current) => current.filter((question) => question.id !== id));
  }

  function saveQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  if (saved) return <div className="border border-[#fff7ed] bg-[#fff7ed] p-5"><CheckCircle2 className="size-5 text-[#ea580c]" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-[#ea580c]">Quiz guardado en la vista demo</p><p className="mt-1 text-xs text-[#44403c]">Curso #{courseId} · {questions.length} preguntas · no se guardó en un servidor.</p></div>;

  return (
    <form onSubmit={saveQuiz} className="space-y-5">
      <section className="grid gap-4 border border-[#e7e5e4] bg-white p-5 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[#44403c] sm:col-span-2">Título del quiz<input required placeholder="Ej. Fundamentos de funciones" className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label>
        <label className="text-xs font-semibold text-[#44403c]">Tiempo límite<select className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal"><option>Sin límite</option><option>15 minutos</option><option>30 minutos</option><option>60 minutos</option></select></label>
        <label className="text-xs font-semibold text-[#44403c]">Intentos permitidos<select className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal"><option>1 intento</option><option>2 intentos</option><option>3 intentos</option></select></label>
        <label className="text-xs font-semibold text-[#44403c] sm:col-span-2">Módulo asignado<select required className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal">{modules.map((module, index) => <option key={module.title}>Módulo {index + 1} · {module.title}</option>)}</select></label>
        <label className="flex items-center gap-2 text-xs text-[#44403c] sm:col-span-2"><input type="checkbox" className="accent-[#f97316]" /> Mostrar respuestas al finalizar el intento</label>
      </section>

      <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-[#171717]">Preguntas ({questions.length})</h2><button type="button" onClick={addQuestion} className="inline-flex items-center gap-1.5 border border-[#e7e5e4] px-3 py-2 text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed]"><Plus className="size-3.5" aria-hidden="true" /> Añadir pregunta</button></div>
        {questions.map((question, index) => <div key={question.id} className="border border-[#e7e5e4] bg-white p-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#ea580c]">Pregunta {index + 1}</p><button type="button" onClick={() => removeQuestion(question.id)} aria-label={`Eliminar pregunta ${index + 1}`} disabled={questions.length === 1} className="grid size-8 place-items-center text-[#78716c] hover:bg-[#fff4f2] hover:text-[#a14e43] disabled:opacity-40"><Trash2 className="size-4" aria-hidden="true" /></button></div><input required placeholder="Escribe la pregunta" className="mt-3 h-10 w-full border border-[#e7e5e4] px-3 text-xs" /><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_100px]"><input placeholder="Opción A" className="h-9 border border-[#e7e5e4] px-3 text-xs" /><select aria-label={`Tipo de pregunta ${index + 1}`} value={question.type} onChange={(event) => setQuestions((current) => current.map((item) => item.id === question.id ? { ...item, type: event.target.value } : item))} className="h-9 border border-[#e7e5e4] bg-white px-2 text-xs"><option>Opción múltiple</option><option>Verdadero o falso</option><option>Respuesta abierta</option></select><input type="number" min="1" defaultValue="1" aria-label={`Puntos pregunta ${index + 1}`} className="h-9 border border-[#e7e5e4] px-2 text-xs" /></div></div>)}
      </section>
      <button type="submit" className="h-11 bg-[#f97316] px-5 text-sm font-semibold text-white hover:bg-[#ea580c]">Guardar quiz demo</button>
    </form>
  );
}