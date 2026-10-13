"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Circle, MessageCircle } from "lucide-react";

type StudentProgress = {
  id: number;
  nombre: string;
  email: string;
  completedModules: boolean[];
};

type DemoStudentProgressProps = {
  courseId: string;
  modules: string[];
  students: StudentProgress[];
};

export function DemoStudentProgress({ courseId, modules, students }: DemoStudentProgressProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {students.map((student) => {
        const done = student.completedModules.filter(Boolean).length;
        const percent = Math.round((done / modules.length) * 100);
        const open = openId === student.id;

        return (
          <article key={student.id} className="overflow-hidden rounded-xl border border-[#e7e5e4] bg-white">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fff7ed] text-xs font-bold text-[#ea580c]">
                {student.nombre.split(" ").map((n) => n[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#171717]">{student.nombre}</p>
                <p className="mt-0.5 truncate text-xs text-[#78716c]">{student.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${percent >= 70 ? "bg-[#fff7ed] text-[#ea580c]" : percent >= 40 ? "bg-[#fafaf9] text-[#44403c]" : "bg-[#fff4f2] text-[#a24135]"}`}>
                  {percent}%
                </span>
                <span className="hidden text-[10px] text-[#78716c] sm:inline">{done}/{modules.length} módulos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Link href="/profesor/chat" aria-label={`Enviar mensaje a ${student.nombre}`} title={`Enviar mensaje a ${student.nombre}`} className="grid size-9 place-items-center rounded-lg border border-[#e7e5e4] text-[#44403c] transition hover:border-[#f97316] hover:bg-[#fff7ed] hover:text-[#ea580c]">
                  <MessageCircle className="size-4" aria-hidden="true" />
                </Link>
                <button type="button" onClick={() => setOpenId(open ? null : student.id)} aria-expanded={open} aria-label={`Ver módulos de ${student.nombre}`} className="grid size-9 place-items-center rounded-lg border border-[#e7e5e4] text-[#44403c] transition hover:bg-[#fff7ed]">
                  <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </div>
            </div>
            {open && (
              <div className="border-t border-[#fafaf9] bg-[#fff7ed] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Avance por módulo · curso #{courseId}</p>
                <ul className="mt-2 space-y-1.5">
                  {modules.map((moduleTitle, index) => {
                    const completed = student.completedModules[index] ?? false;
                    return (
                      <li key={moduleTitle} className="flex items-center gap-2.5 text-xs">
                        {completed
                          ? <CheckCircle2 className="size-4 shrink-0 text-[#ea580c]" aria-hidden="true" />
                          : <Circle className="size-4 shrink-0 text-[#a8a29e]" aria-hidden="true" />}
                        <span className={completed ? "font-medium text-[#171717]" : "text-[#78716c]"}>
                          Módulo {index + 1} · {moduleTitle}
                        </span>
                        <span className={`ml-auto text-[10px] font-semibold ${completed ? "text-[#ea580c]" : "text-[#a8a29e]"}`}>
                          {completed ? "Completado" : "Pendiente"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
