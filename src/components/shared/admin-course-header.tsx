import Link from "next/link";
import { getDemoCourse } from "@/lib/demo-courses";

const sections = [
  { id: "informacion", label: "Información", path: "" },
  { id: "contenido", label: "Contenido", path: "/semanas" },
  { id: "alumnos", label: "Alumnos", path: "/alumnos" },
] as const;

type Section = (typeof sections)[number]["id"];

interface AdminCourseHeaderProps {
  courseId: string;
  section: Section;
  description: string;
}

export function AdminCourseHeader({
  courseId,
  section,
  description,
}: AdminCourseHeaderProps) {
  const course = getDemoCourse(courseId);

  return (
    <header className="mb-6">
      <Link
        href="/admin/cursos"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#718078] transition hover:text-[#173c2d]"
      >
        <span aria-hidden="true">←</span> Cursos
      </Link>
      <div className="mt-4 rounded-2xl border border-[#dce7dc] bg-[linear-gradient(110deg,#edf4ed,#f7f7f1)] px-5 py-5 sm:px-7 sm:py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#69816d]">
          {course.subject} · {course.level} · Administración
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3a2b] sm:text-3xl">
          {course.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">
          {description}
        </p>
      </div>
      <nav
        aria-label="Administración del curso"
        className="mt-4 flex flex-wrap gap-x-1 border-b border-[#e1e8e1] pb-1"
      >
        {sections.map((item) => {
          const active = item.id === section;

          return (
            <Link
              key={item.id}
              href={`/admin/cursos/${courseId}${item.path}`}
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
