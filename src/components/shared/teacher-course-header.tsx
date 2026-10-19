import type { ReactNode } from "react";
import Link from "next/link";
import { getDemoCourse } from "@/lib/demo-courses";

const sections = [
  { id: "resumen", label: "Resumen", path: "" },
  { id: "contenido", label: "Contenido", path: "/contenido" },
  { id: "tareas", label: "Tareas", path: "/tareas" },
  { id: "evaluaciones", label: "Evaluaciones", path: "/quizzes" },
  { id: "asistencia", label: "Asistencia", path: "/asistencia" },
  { id: "alumnos", label: "Alumnos", path: "/alumnos" },
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
        className="inline-flex items-center gap-2 text-xs font-medium text-[#44403c] transition hover:text-[#f97316]"
      >
        <span aria-hidden="true">←</span> Mis cursos
      </Link>
      <div className="mt-4 rounded-2xl border border-[#fff7ed] bg-[linear-gradient(110deg,#fff7ed,#fafaf9)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#44403c]">
              {course.subject} · {course.level} · Espacio docente
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#44403c]">
              {description}
            </p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
      <nav
        aria-label="Gestión del curso"
        className="mt-4 flex flex-wrap gap-x-1 border-b border-[#e7e5e4] pb-1"
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
                  ? "border-[#ea580c] text-[#c2410c]"
                  : "border-transparent text-[#78716c] hover:text-[#ea580c]"
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
