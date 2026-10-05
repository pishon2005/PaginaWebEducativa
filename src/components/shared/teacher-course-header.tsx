import type { ReactNode } from "react";
import Link from "next/link";
import { getDemoCourse } from "@/lib/demo-courses";

const sections = [
  { id: "resumen", label: "Resumen", path: "" },
  { id: "contenido", label: "Contenido", path: "/contenido" },
  { id: "tareas", label: "Tareas", path: "/tareas" },
  { id: "evaluaciones", label: "Evaluaciones", path: "/quizzes" },
  { id: "alumnos", label: "Alumnos", path: "/alumnos" },
  { id: "mensajes", label: "Mensajes", path: "/chat" },
] as const;

type Section = (typeof sections)[number]["id"];

interface TeacherCourseHeaderProps {
  courseId: string;
  section: Section;
  description: string;
  action?: ReactNode;
}

export function TeacherCourseHeader({
  courseId,
  section,
  description,
  action,
}: TeacherCourseHeaderProps) {
  const course = getDemoCourse(courseId);

  return (
    <header className="mb-6">
      <Link
        href="/profesor/mis-cursos"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#718078] transition hover:text-[#173c2d]"
      >
        <span aria-hidden="true">←</span> Mis cursos
      </Link>
      <div className="mt-4 rounded-2xl border border-[#dce7dc] bg-[linear-gradient(110deg,#edf4ed,#f7f7f1)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#69816d]">
              {course.subject} · {course.level} · Espacio docente
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3a2b] sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">
              {description}
            </p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
      <nav
        aria-label="Gestión del curso"
        className="mt-4 flex flex-wrap gap-x-1 border-b border-[#e1e8e1] pb-1"
      >
        {sections.map((item) => {
          const active = item.id === section;

          return (
            <Link
              key={item.id}
              href={`/profesor/mis-cursos/${courseId}${item.path}`}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                active
                  ? "border-[#376348] text-[#244b34]"
                  : "border-transparent text-[#7b887f] hover:text-[#376348]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
