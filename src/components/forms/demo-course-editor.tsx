"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Settings2 } from "lucide-react";

type DemoCourseEditorProps = {
  mode: "create" | "edit";
  courseId?: string;
};

export function DemoCourseEditor({ mode, courseId = "" }: DemoCourseEditorProps) {
  const isCreate = mode === "create";
  const [activeTab, setActiveTab] = useState("Información");
  const [title, setTitle] = useState(isCreate ? "" : courseId === "1" ? "Fundamentos de Python" : "Desarrollo web con React");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function persistCourse(action: "draft" | "publish") {
    if (!title.trim()) {
      setError("Escribe el título del curso antes de continuar.");
      setActiveTab("Información");
      return;
    }
    setError("");
    setNotice(action === "publish" ? `“${title}” quedó publicado en la demo.` : `El borrador “${title}” se guardó en esta vista.`);
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    persistCourse("draft");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">{["Información", "Contenido", "Configuración"].map((tab) => <button key={tab} type="button" aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} className={`border px-4 py-2.5 text-xs font-semibold ${activeTab === tab ? "border-[#173c2d] bg-[#173c2d] text-white" : "border-[#dfe7e0] bg-white text-[#64756a] hover:bg-[#f5f8f5]"}`}>{tab}</button>)}</div>

      <form onSubmit={saveDraft} className="space-y-4">
        {activeTab === "Información" && <section className="grid gap-4 border border-[#dfe7e0] bg-white p-5 sm:grid-cols-2"><label className="text-xs font-semibold text-[#536357] sm:col-span-2">Título del curso<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Ej. Fundamentos de Python" className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357] sm:col-span-2">Descripción corta<input required placeholder="Una línea que resuma el curso" className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357] sm:col-span-2">Descripción completa<textarea required rows={5} placeholder="Objetivos, contenidos y público del curso..." className="mt-1.5 w-full border border-[#dfe7df] px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357] sm:col-span-2">Imagen de portada<input type="file" accept="image/*" className="mt-1.5 block w-full border border-dashed border-[#dfe7df] p-3 text-xs font-normal text-[#718078]" /></label></section>}

        {activeTab === "Contenido" && <section className="border border-[#dfe7e0] bg-white p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-[#304637]">Estructura del curso</h2><p className="mt-1 text-xs text-[#849087]">Organiza los módulos, clases y materiales.</p></div><FileText className="size-5 text-[#708d76]" aria-hidden="true" /></div><div className="mt-4 space-y-2">{["Módulo 1 · Primeros pasos", "Módulo 2 · Fundamentos", "Módulo 3 · Proyecto final"].map((week, index) => <div key={week} className="flex items-center justify-between border border-[#e7ece7] px-4 py-3"><span className="text-xs font-medium text-[#506256]">{week}</span><span className="text-[10px] text-[#89958d]">{index + 2} clases</span></div>)}</div>{isCreate ? <p className="mt-4 text-[10px] text-[#89958d]">Guarda primero el curso para administrar semanas, clases y materiales desde el panel.</p> : <Link href={`/admin/cursos/${courseId}/semanas`} className="mt-4 inline-flex border border-[#cdd9cf] px-3 py-2 text-xs font-semibold text-[#4f6e54] hover:bg-[#f4f8f4]">Gestionar semanas y clases</Link>}</section>}

        {activeTab === "Configuración" && <section className="grid gap-4 border border-[#dfe7e0] bg-white p-5 sm:grid-cols-2"><label className="text-xs font-semibold text-[#536357]">Precio (S/)<input type="number" min="0" defaultValue={isCreate ? "" : "189"} placeholder="189" className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357]">Duración (horas)<input type="number" min="1" defaultValue={isCreate ? "" : "24"} placeholder="24" className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357]">Nivel<select defaultValue="inicial" className="mt-1.5 h-10 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option value="inicial">Inicial</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></label><label className="text-xs font-semibold text-[#536357]">Profesor<select defaultValue="ana" className="mt-1.5 h-10 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option value="ana">Ana María Campos</option><option value="carlos">Carlos Mendoza</option></select></label><label className="flex items-center gap-2 text-xs text-[#617067]"><input type="checkbox" defaultChecked={!isCreate} className="accent-[#315d3d]" /> Habilitar certificado</label><label className="flex items-center gap-2 text-xs text-[#617067]"><input type="checkbox" defaultChecked={!isCreate} className="accent-[#315d3d]" /> Publicar en el catálogo</label><div className="flex items-center gap-2 text-[#68786d] sm:col-span-2"><Settings2 className="size-4" aria-hidden="true" /><span className="text-[10px]">Las opciones se aplican a esta vista de demostración.</span></div></section>}

        {error && <p role="alert" className="text-xs font-medium text-[#a24135]">{error}</p>}
        {notice && <p role="status" className="flex items-center gap-2 border border-[#d8e7d8] bg-[#f3f8f3] px-4 py-3 text-xs text-[#4e7553]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}
        <div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => persistCourse("draft")} className="border border-[#cdd9cf] bg-white px-4 py-2.5 text-xs font-semibold text-[#4f6e54] hover:bg-[#f4f8f4]">Guardar borrador</button><button type="button" onClick={() => persistCourse("publish")} className="bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]">{isCreate ? "Publicar curso demo" : "Guardar cambios"}</button></div>
      </form>
    </div>
  );
}