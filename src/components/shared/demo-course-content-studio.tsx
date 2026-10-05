"use client";

import { useState } from "react";
import { BookOpen, Clapperboard } from "lucide-react";
import { DemoContentManager } from "@/components/shared/demo-content-manager";
import { getDemoCourse } from "@/lib/demo-courses";
import { getDemoCourseContent } from "@/lib/demo-course-content";

export function DemoCourseContentStudio({ courseId }: { courseId: string }) {
  const [view, setView] = useState<"modules" | "lessons">("modules");
  const course = getDemoCourse(courseId);
  const modules = getDemoCourseContent(courseId);
  const lessonsCount = modules.reduce((count, module) => count + module.lessons.length, 0);
  const activeView = view === "modules" ? "semanas" : "clases";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dfe7e0] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#718176]">Editor de contenido</p>
            <h2 className="mt-1 text-base font-semibold text-[#263d2e]">{course.title}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#7d8981]">Organiza el recorrido por módulos y prepara cada clase con su duración, estado y video guía.</p>
          </div>
          <div className="flex gap-2 text-[10px] font-medium text-[#718078]">
            <span className="rounded-full bg-[#f1f6f1] px-3 py-1.5">{modules.length} módulos</span>
            <span className="rounded-full bg-[#f1f6f1] px-3 py-1.5">{lessonsCount} clases</span>
          </div>
        </div>
        <div className="mt-5 flex gap-2 border-t border-[#edf1ed] pt-4" role="tablist" aria-label="Tipo de contenido">
          <button type="button" role="tab" aria-selected={view === "modules"} onClick={() => setView("modules")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${view === "modules" ? "bg-[#173c2d] text-white" : "bg-[#f4f7f4] text-[#607166] hover:bg-[#eaf2ea]"}`}><BookOpen className="size-3.5" aria-hidden="true" /> Módulos</button>
          <button type="button" role="tab" aria-selected={view === "lessons"} onClick={() => setView("lessons")} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${view === "lessons" ? "bg-[#173c2d] text-white" : "bg-[#f4f7f4] text-[#607166] hover:bg-[#eaf2ea]"}`}><Clapperboard className="size-3.5" aria-hidden="true" /> Clases y videos</button>
        </div>
      </section>
      <div role="tabpanel" aria-label={view === "modules" ? "Módulos del curso" : "Clases y videos guía"}>
        <DemoContentManager key={`${courseId}-${view}`} courseId={courseId} mode={activeView} />
      </div>
    </div>
  );
}
