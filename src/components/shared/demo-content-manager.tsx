"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Clapperboard, FileVideo2, Plus, Trash2, Upload } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getDemoCourseContent } from "@/lib/demo-course-content";

type ContentItem = { id: number; title: string; detail: string; published?: boolean; guideVideo?: string };

type DemoContentManagerProps = {
  courseId: string;
  mode: "semanas" | "clases";
};

export function DemoContentManager({ courseId, mode }: DemoContentManagerProps) {
  const isClassList = mode === "clases";
  const course = getDemoCourse(courseId);
  const courseModules = getDemoCourseContent(courseId);
  const [items, setItems] = useState<ContentItem[]>(isClassList
    ? courseModules.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => ({
      id: moduleIndex * 10 + lessonIndex + 1,
      title: lesson.title,
      detail: `${lesson.duration} min · ${module.title}`,
      published: moduleIndex === 0 || lessonIndex < 2,
      guideVideo: lesson.hasVideo ? `${lesson.title.toLowerCase().replaceAll(" ", "-")}-guia.mp4` : undefined,
    })))
    : courseModules.map((module, index) => ({ id: index + 1, title: module.title, detail: `${module.lessons.length} clases` })));
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [guideVideos, setGuideVideos] = useState<Record<number, string>>({});
  const [newGuideVideo, setNewGuideVideo] = useState("");

  function selectGuideVideo(itemId: number, event: ChangeEvent<HTMLInputElement>) {
    const fileName = event.target.files?.[0]?.name;
    if (fileName) setGuideVideos((current) => ({ ...current, [itemId]: fileName }));
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title")).trim();
    const detail = isClassList ? `${String(formData.get("duration"))} min` : "0 clases";
    const selectedVideo = formData.get("guideVideo");
    const guideVideo = selectedVideo instanceof File && selectedVideo.size > 0 ? selectedVideo.name : undefined;
    setItems((current) => [...current, { id: Date.now(), title, detail, published: false, guideVideo }]);
    setShowForm(false);
    setNewGuideVideo("");
    setNotice(`${isClassList ? "Clase" : "Módulo"} añadido a esta vista de demostración.`);
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const updated = [...current];
      [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
      return updated;
    });
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e7e5e4] bg-white p-4"><div><h2 className="text-sm font-semibold text-[#171717]">{isClassList ? "Clases y recursos del curso" : "Módulos del curso"}</h2><p className="mt-1 text-xs text-[#78716c]">{course.title} · {items.length} {isClassList ? "clases" : "módulos"}</p></div><button type="button" onClick={() => { setShowForm((visible) => !visible); setNotice(""); }} className="inline-flex items-center gap-2 rounded-lg bg-[#f97316] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#ea580c]"><Plus className="size-4" aria-hidden="true" />{isClassList ? "Nueva clase" : "Nuevo módulo"}</button></section>
      {showForm && <form onSubmit={addItem} className="grid gap-3 rounded-2xl border border-[#e7e5e4] bg-white p-4 sm:grid-cols-[1fr_160px_auto] sm:items-end"><label className="text-[10px] font-semibold text-[#44403c]">{isClassList ? "Título de la clase" : "Título del módulo"}<input name="title" required placeholder={isClassList ? "Ej. Estructuras de datos" : "Ej. Proyecto final"} className="mt-1 h-10 w-full rounded-lg border border-[#e7e5e4] px-3 text-xs font-normal" /></label>{isClassList && <><label className="text-[10px] font-semibold text-[#44403c]">Duración en minutos<input name="duration" type="number" min="1" defaultValue="15" className="mt-1 h-10 w-full rounded-lg border border-[#e7e5e4] px-3 text-xs font-normal" /></label><label className="text-[10px] font-semibold text-[#44403c] sm:col-span-2">Video guía <span className="font-normal text-[#78716c]">· opcional</span><span className="mt-1 flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#e7e5e4] px-3 text-xs font-medium text-[#ea580c]"><Upload className="size-4 shrink-0" aria-hidden="true" /><span className="min-w-0 flex-1 truncate">{newGuideVideo || "Seleccionar video o PDF"}</span><input name="guideVideo" type="file" accept="video/mp4,video/quicktime,video/webm,application/pdf" onChange={(event) => setNewGuideVideo(event.target.files?.[0]?.name ?? "")} className="sr-only" aria-label="Seleccionar material guía" /></span></label></>}<button type="submit" className="h-10 rounded-lg bg-[#f97316] px-4 text-xs font-semibold text-white hover:bg-[#ea580c]">Añadir</button></form>}
      {notice && <p role="status" className="flex items-center gap-2 border border-[#fff7ed] bg-[#fff7ed] px-4 py-2.5 text-xs text-[#ea580c]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}
      <section className="divide-y divide-[#fafaf9] overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white">{items.map((item, index) => <div key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#fff7ed] text-xs font-semibold text-[#ea580c]">{String(index + 1).padStart(2, "0")}</span><div className="min-w-[150px] flex-1"><p className="text-xs font-semibold text-[#171717]">{item.title}</p><p className="mt-1 text-[10px] text-[#78716c]">{item.detail}</p>{isClassList && (guideVideos[item.id] || item.guideVideo) && <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#ea580c]"><FileVideo2 className="size-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{guideVideos[item.id] || item.guideVideo}</span></p>}</div>{isClassList ? <><button type="button" onClick={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, published: !entry.published } : entry))} className={`text-[10px] font-semibold ${item.published ? "text-[#ea580c]" : "text-[#8b7953]"}`}>{item.published ? "Publicada" : "Borrador"}</button><label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#e7e5e4] px-2 text-[10px] font-semibold text-[#44403c] hover:bg-[#fff7ed]"><Clapperboard className="size-3.5" aria-hidden="true" />{guideVideos[item.id] || item.guideVideo ? "Cambiar material" : "Añadir material"}<input type="file" accept="video/mp4,video/quicktime,video/webm,application/pdf" onChange={(event) => selectGuideVideo(item.id, event)} className="sr-only" aria-label={`Adjuntar material guía para ${item.title}`} /></label></> : <div className="flex"><button type="button" aria-label={`Subir ${item.title}`} disabled={index === 0} onClick={() => moveItem(index, -1)} className="grid size-7 place-items-center text-[#78716c] hover:bg-[#fff7ed] disabled:opacity-30"><ArrowUp className="size-3.5" aria-hidden="true" /></button><button type="button" aria-label={`Bajar ${item.title}`} disabled={index === items.length - 1} onClick={() => moveItem(index, 1)} className="grid size-7 place-items-center text-[#78716c] hover:bg-[#fff7ed] disabled:opacity-30"><ArrowDown className="size-3.5" aria-hidden="true" /></button></div>}<button type="button" aria-label={`Eliminar ${item.title}`} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="grid size-7 place-items-center rounded-lg text-[#9b8a87] hover:bg-[#fff4f2] hover:text-[#a14e43]"><Trash2 className="size-3.5" aria-hidden="true" /></button></div>)}</section>
      <p className="text-[10px] text-[#78716c]">{isClassList ? "Los videos y PDF son archivos de demostración seleccionados localmente; no se suben a un servidor." : "Los cambios de estructura solo se mantienen durante esta sesión."}</p>
    </div>
  );
}