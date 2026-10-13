"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CirclePlay, Pause, Play } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getDemoCourseContent, getDemoCourseLessons } from "@/lib/demo-course-content";

export function DemoLessonViewer({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const course = getDemoCourse(courseId);
  const modules = getDemoCourseContent(courseId);
  const lessons = getDemoCourseLessons(courseId);
  const lessonIndex = Math.max(0, Math.min(lessons.length - 1, Number(lessonId) - 1 || 0));
  const moduleIndex = Math.max(0, modules.findIndex((_, index) =>
    lessonIndex < modules.slice(0, index + 1).reduce((count, item) => count + item.lessons.length, 0),
  ));
  const lesson = lessons[lessonIndex];
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="space-y-5">
      <section className="relative grid aspect-video place-items-center overflow-hidden bg-[#f97316] text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 0 49%, #fff7ed 49% 50%, transparent 50% 100%)", backgroundSize: "28px 28px" }} aria-hidden="true" />
        <button type="button" onClick={() => setPlaying((current) => !current)} aria-label={playing ? "Pausar vista previa" : "Reproducir vista previa"} className="relative grid size-14 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 transition hover:bg-white/25">{playing ? <Pause className="size-5" aria-hidden="true" /> : <Play className="ml-1 size-5" aria-hidden="true" />}</button>
        <p className="absolute bottom-4 left-4 text-[10px] text-white/70">Video guía de muestra · {lesson.duration} min</p>
        {playing && <p className="absolute bottom-4 right-4 text-[10px] text-white/70">Reproducción de demostración</p>}
      </section>

      <section className="border border-[#e7e5e4] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#44403c]">{course.title} · Clase {lessonIndex + 1} · {lesson.duration} min</p><h1 className="mt-2 text-xl font-semibold text-[#171717]">{lesson.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#44403c]">Video guía y material de apoyo: {lesson.material}. Sigue los pasos de la lección y practica a tu ritmo.</p></div>{completed && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c]"><CheckCircle2 className="size-4" aria-hidden="true" /> Completada</span>}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#fafaf9] pt-4"><Link href={`/alumno/mis-cursos/${courseId}/semanas/${moduleIndex + 1}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#f97316]"><ArrowLeft className="size-3.5" aria-hidden="true" /> Volver al módulo</Link><button type="button" onClick={() => setCompleted((current) => !current)} className="bg-[#f97316] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#ea580c]">{completed ? "Desmarcar completada" : "Marcar como completada"}</button>{lessonIndex < lessons.length - 1 && <Link href={`/alumno/mis-cursos/${courseId}/clases/${lessonIndex + 2}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Siguiente clase <ArrowRight className="size-3.5" aria-hidden="true" /></Link>}</div></section>
      <p className="flex items-center gap-2 text-[10px] text-[#78716c]"><CirclePlay className="size-3.5" aria-hidden="true" /> Los videos, el progreso y la finalización son demostrativos y no se guardan.</p>
    </div>
  );
}