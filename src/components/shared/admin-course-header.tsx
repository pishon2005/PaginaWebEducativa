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
        className="inline-flex items-center gap-2 text-xs font-medium text-[#44403c] transition hover:text-[#f97316]"
      >
        <span aria-hidden="true">←</span> Cursos
      </Link>
      <div className="mt-4 rounded-2xl border border-[#fff7ed] bg-[linear-gradient(110deg,#fff7ed,#fafaf9)] px-5 py-5 sm:px-7 sm:py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#44403c]">
          {course.subject} · {course.level} · Administración
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
          {course.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#44403c]">
          {description}
        </p>
      </div>
      <nav
        aria-label="Administración del curso"
        className="mt-4 flex flex-wrap gap-x-1 border-b border-[#e7e5e4] pb-1"
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
