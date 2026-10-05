"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle2, Clapperboard, FileVideo2, Plus, Trash2, Upload } from "lucide-react";

export function DemoTaskBuilder({ courseId }: { courseId: string }) {
  const [saved, setSaved] = useState(false);
  const [guideName, setGuideName] = useState("");
  const [savedDetails, setSavedDetails] = useState<{ title: string; type: string; deadline: string; duration: string } | null>(null);
  const [rubric, setRubric] = useState([{ id: 1, label: "Funcionamiento y casos límite", points: 10 }, { id: 2, label: "Claridad y organización", points: 6 }, { id: 3, label: "Pruebas y explicación", points: 4 }]);

  function selectGuide(event: ChangeEvent<HTMLInputElement>) {
    setGuideName(event.target.files?.[0]?.name ?? "");
  }

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSavedDetails({
      title: String(data.get("title")),
      type: String(data.get("taskType")),
      deadline: new Date(String(data.get("deadline"))).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" }),
      duration: String(data.get("duration")),
    });
    setSaved(true);
  }

  if (saved) return <div className="rounded-2xl border border-[#d8e7d8] bg-[#f3f8f3] p-5"><CheckCircle2 className="size-5 text-[#5c855f]" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-[#365b3f]">Tarea creada en la demo</p><p className="mt-1 text-sm font-medium text-[#405747]">{savedDetails?.title} · {savedDetails?.type}</p><p className="mt-1 text-xs text-[#68806c]">Vence {savedDetails?.deadline} · duración estimada {savedDetails?.duration} min · curso #{courseId} · rúbrica de {rubric.reduce((total, criterion) => total + criterion.points, 0)} puntos.</p>{guideName && <p className="mt-2 flex items-center gap-2 text-xs text-[#54765a]"><FileVideo2 className="size-4" aria-hidden="true" /> Guía adjunta: {guideName}</p>}<p className="mt-2 text-[10px] text-[#849087]">Se trata de una vista previa; no se almacenaron datos ni archivos.</p></div>;

  return (
    <form onSubmit={submitTask} className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <section className="space-y-4 rounded-2xl border border-[#dfe7e0] bg-white p-5">
          <div><h2 className="text-sm font-semibold text-[#263d2e]">Diseño de la actividad</h2><p className="mt-1 text-xs text-[#849087]">Define qué harán los alumnos y qué material necesitan.</p></div>
          <label className="block text-xs font-semibold text-[#536357]">Título<input name="title" required placeholder="Ej. Proyecto de funciones" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-3 text-sm font-normal" /></label>
          <label className="block text-xs font-semibold text-[#536357]">Instrucciones<textarea name="description" required rows={5} placeholder="Describe el objetivo, los pasos y los criterios de entrega..." className="mt-1.5 w-full rounded-lg border border-[#dfe7df] px-3 py-2 text-sm font-normal" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#536357]">Tipo de actividad<select name="taskType" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option>Práctica entregable</option><option>Proyecto</option><option>Cuestionario</option><option>Trabajo grupal</option><option>Lectura guiada</option></select></label>
            <label className="block text-xs font-semibold text-[#536357]">Modalidad<select name="modality" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option>Individual</option><option>Grupal</option></select></label>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#536357]">Video guía <span className="font-normal text-[#89958d]">· opcional</span></p>
            <label className="mt-1.5 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#cad8cb] bg-[#f8faf8] px-3 py-2 text-xs text-[#56715b] hover:bg-[#f1f6f1]">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eaf2ea]"><Upload className="size-4" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1 truncate font-medium">{guideName || "Selecciona un video de apoyo"}</span>
              <span className="shrink-0 text-[10px] text-[#849087]">MP4, MOV · máx. 50 MB</span>
              <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={selectGuide} className="sr-only" aria-label="Adjuntar video guía" />
            </label>
            {guideName && <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#64806a]"><Clapperboard className="size-3.5" aria-hidden="true" /> Vista previa local: el archivo no se subirá al servidor.</p>}
          </div>
        </section>
        <section className="space-y-3 border border-[#dfe7e0] bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-[#263d2e]">Rúbrica de evaluación</h2><button type="button" onClick={() => setRubric((current) => [...current, { id: Date.now(), label: "Nuevo criterio", points: 1 }])} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#54765a]"><Plus className="size-3.5" aria-hidden="true" />Añadir criterio</button></div>{rubric.map((criterion, index) => <div key={criterion.id} className="grid gap-2 sm:grid-cols-[1fr_100px_36px]"><input aria-label={`Criterio ${index + 1}`} value={criterion.label} onChange={(event) => setRubric((current) => current.map((item) => item.id === criterion.id ? { ...item, label: event.target.value } : item))} className="h-9 border border-[#e3e9e3] px-3 text-xs" /><label className="flex items-center gap-2 text-[10px] text-[#78867d]">Puntos<input aria-label={`Puntos criterio ${index + 1}`} type="number" min="1" value={criterion.points} onChange={(event) => setRubric((current) => current.map((item) => item.id === criterion.id ? { ...item, points: Number(event.target.value) } : item))} className="h-9 w-full border border-[#e3e9e3] px-2 text-xs text-[#425748]" /></label><button type="button" aria-label={`Eliminar criterio ${index + 1}`} disabled={rubric.length === 1} onClick={() => setRubric((current) => current.filter((item) => item.id !== criterion.id))} className="grid size-9 place-items-center text-[#89958d] hover:bg-[#fff4f2] hover:text-[#a14e43] disabled:opacity-40"><Trash2 className="size-4" aria-hidden="true" /></button></div>)}<p className="text-[10px] text-[#849087]">Puntaje total: {rubric.reduce((total, criterion) => total + criterion.points, 0)} puntos · referencia de evaluación sobre 20.</p></section>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl border border-[#dfe7e0] bg-white p-5"><div><h2 className="text-sm font-semibold text-[#263d2e]">Tiempo y entrega</h2><p className="mt-1 text-xs text-[#849087]">Configura el ritmo y el plazo de trabajo.</p></div><label className="block text-xs font-semibold text-[#536357]">Tiempo estimado (minutos)<input name="duration" type="number" min="1" defaultValue="45" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="block text-xs font-semibold text-[#536357]">Disponible desde<input name="availableFrom" required type="datetime-local" defaultValue="2026-10-05T08:00" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-2 text-xs font-normal" /></label><label className="block text-xs font-semibold text-[#536357]">Fecha y hora límite<input name="deadline" required type="datetime-local" defaultValue="2026-10-12T23:59" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-2 text-xs font-normal" /></label><label className="flex items-center gap-2 text-xs text-[#64756a]"><input type="checkbox" defaultChecked className="accent-[#315d3d]" /> Permitir reenvíos</label><label className="block text-xs font-semibold text-[#536357]">Máximo de intentos<input type="number" min="1" defaultValue="2" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="block text-xs font-semibold text-[#536357]">Peso en nota (%)<input type="number" min="0" max="100" defaultValue="20" className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe7df] px-3 text-sm font-normal" /></label><button type="submit" className="h-11 w-full rounded-lg bg-[#173c2d] text-sm font-semibold text-white hover:bg-[#24543e]">Guardar tarea demo</button><p className="text-[10px] leading-5 text-[#89958d]">La tarea se simula solo en esta vista; el video tampoco se sube al servidor.</p></aside>
    </form>
  );
}