"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, ImagePlus, Settings2 } from "lucide-react";

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
  const [coverName, setCoverName] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  function selectCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverName(file.name);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));
  }

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
      <div className="flex flex-wrap gap-2">{["Información", "Contenido", "Configuración"].map((tab) => <button key={tab} type="button" aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} className={`border px-4 py-2.5 text-xs font-semibold ${activeTab === tab ? "border-[#f97316] bg-[#f97316] text-white" : "border-[#e7e5e4] bg-white text-[#44403c] hover:bg-[#fff7ed]"}`}>{tab}</button>)}</div>

      <form onSubmit={saveDraft} className="space-y-4">
        {activeTab === "Información" && <section className="grid gap-4 border border-[#e7e5e4] bg-white p-5 sm:grid-cols-2"><label className="text-xs font-semibold text-[#44403c] sm:col-span-2">Título del curso<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Ej. Fundamentos de Python" className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c] sm:col-span-2">Descripción corta<input required placeholder="Una línea que resuma el curso" className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c] sm:col-span-2">Descripción completa<textarea required rows={5} placeholder="Objetivos, contenidos y público del curso..." className="mt-1.5 w-full border border-[#e7e5e4] px-3 py-2 text-sm font-normal" /></label><div className="sm:col-span-2"><span className="text-xs font-semibold text-[#44403c]">Imagen de portada</span><label className="mt-1.5 flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-[#e7e5e4] text-xs font-medium text-[#ea580c] transition hover:bg-[#fff7ed]"><ImagePlus className="size-5" aria-hidden="true" />{coverName || "Seleccionar imagen (JPG, PNG o WebP)"}<input type="file" accept="image/*" onChange={selectCover} className="sr-only" aria-label="Seleccionar imagen de portada" /></label>{coverPreview && (
          <div className="mt-3 overflow-hidden border border-[#e7e5e4]">
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local con URL de objeto */}
            <img src={coverPreview} alt="Vista previa de la portada" className="h-40 w-full object-cover" />
            <p className="bg-[#fff7ed] px-3 py-2 text-[10px] text-[#78716c]">Así se verá la portada en el catálogo. La imagen no se sube a un servidor en esta demo.</p>
          </div>
        )}</div></section>}

        {activeTab === "Contenido" && <section className="border border-[#e7e5e4] bg-white p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-[#171717]">Estructura del curso</h2><p className="mt-1 text-xs text-[#78716c]">Organiza los módulos, clases y materiales.</p></div><FileText className="size-5 text-[#44403c]" aria-hidden="true" /></div><div className="mt-4 space-y-2">{["Módulo 1 · Primeros pasos", "Módulo 2 · Fundamentos", "Módulo 3 · Proyecto final"].map((week, index) => <div key={week} className="flex items-center justify-between border border-[#e7e5e4] px-4 py-3"><span className="text-xs font-medium text-[#ea580c]">{week}</span><span className="text-[10px] text-[#78716c]">{index + 2} clases</span></div>)}</div>{isCreate ? <p className="mt-4 text-[10px] text-[#78716c]">Guarda primero el curso para administrar semanas, clases y materiales desde el panel.</p> : <Link href={`/admin/cursos/${courseId}/semanas`} className="mt-4 inline-flex border border-[#e7e5e4] px-3 py-2 text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed]">Gestionar semanas y clases</Link>}</section>}

        {activeTab === "Configuración" && <section className="grid gap-4 border border-[#e7e5e4] bg-white p-5 sm:grid-cols-2"><label className="text-xs font-semibold text-[#44403c]">Precio (S/)<input type="number" min="0" defaultValue={isCreate ? "" : "189"} placeholder="189" className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c]">Duración (horas)<input type="number" min="1" defaultValue={isCreate ? "" : "24"} placeholder="24" className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c]">Nivel<select defaultValue="inicial" className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal"><option value="inicial">Inicial</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></label><label className="text-xs font-semibold text-[#44403c]">Profesor<select defaultValue="ana" className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal"><option value="ana">Ana María Campos</option><option value="carlos">Carlos Mendoza</option></select></label><label className="flex items-center gap-2 text-xs text-[#44403c]"><input type="checkbox" defaultChecked={!isCreate} className="accent-[#f97316]" /> Habilitar certificado</label><label className="flex items-center gap-2 text-xs text-[#44403c]"><input type="checkbox" defaultChecked={!isCreate} className="accent-[#f97316]" /> Publicar en el catálogo</label><div className="flex items-center gap-2 text-[#44403c] sm:col-span-2"><Settings2 className="size-4" aria-hidden="true" /><span className="text-[10px]">Las opciones se aplican a esta vista de demostración.</span></div></section>}

        {error && <p role="alert" className="text-xs font-medium text-[#a24135]">{error}</p>}
        {notice && <p role="status" className="flex items-center gap-2 border border-[#fff7ed] bg-[#fff7ed] px-4 py-3 text-xs text-[#ea580c]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}
        <div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => persistCourse("draft")} className="border border-[#e7e5e4] bg-white px-4 py-2.5 text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed]">Guardar borrador</button><button type="button" onClick={() => persistCourse("publish")} className="bg-[#f97316] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#ea580c]">{isCreate ? "Publicar curso demo" : "Guardar cambios"}</button></div>
      </form>
    </div>
  );
}