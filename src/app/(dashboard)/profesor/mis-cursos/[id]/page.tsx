import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardCheck, MessageCircle } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAssignmentsByCourse } from "@/lib/demo-data";
import { getDemoCourseContent } from "@/lib/demo-course-content";

const pendingReviews = [
  { student: "Juan Pérez", task: "Ejercicio 1 · Funciones y colecciones", sent: "Hoy, 08:40" },
  { student: "María López", task: "Ejercicio 1 · Funciones y colecciones", sent: "Ayer, 21:15" },
  { student: "Diego Martínez", task: "Ejercicio 2 · Automatización", sent: "Ayer, 18:02" },
];

export default async function ProfesorCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const assignments = getAssignmentsByCourse(id);
  const modules = getDemoCourseContent(id);
  const totalSubmissions = assignments.reduce((total, task) => total + task.submissions, 0);
  const nextDeadlines = [...assignments].sort((a, b) => a.deadlineISO.localeCompare(b.deadlineISO)).slice(0, 3);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="resumen"
        description="Lo que necesita tu atención hoy en este curso."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white">
          <div className="flex items-center justify-between border-b border-[#fafaf9] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-[#171717]">Entregas recientes por revisar</h2>
              <p className="mt-1 text-xs text-[#78716c]">{totalSubmissions} entregas acumuladas en el curso</p>
            </div>
            <ClipboardCheck className="size-5 text-[#44403c]" aria-hidden="true" />
          </div>
          <div className="divide-y divide-[#fafaf9]">
            {pendingReviews.map((review) => (
              <div key={`${review.student}-${review.sent}`} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#fff7ed] text-[10px] font-bold text-[#ea580c]">
                  {review.student.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#171717]">{review.student}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[#78716c]">{review.task} · {review.sent}</p>
                </div>
                <Link href={`/profesor/mis-cursos/${id}/tareas/1/entregas`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ea580c] hover:text-[#c2410c]">
                  Revisar <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#e7e5e4] bg-white">
            <div className="flex items-center justify-between border-b border-[#fafaf9] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#171717]">Próximas fechas límite</h2>
                <p className="mt-1 text-xs text-[#78716c]">Tareas activas del curso</p>
              </div>
              <CalendarClock className="size-5 text-[#44403c]" aria-hidden="true" />
            </div>
            <div className="divide-y divide-[#fafaf9]">
              {nextDeadlines.map((task) => (
                <Link key={task.id} href={`/profesor/mis-cursos/${id}/tareas/${task.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-[#fff7ed]">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#171717]">{task.title}</p>
                    <p className="mt-0.5 text-[11px] text-[#78716c]">{task.type} · {task.submissions} entregas</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#fff7ed] px-2.5 py-1 text-[10px] font-semibold text-[#ea580c]">{task.deadline}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e7e5e4] bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#171717]">Estado del contenido</h2>
                <p className="mt-1 text-xs text-[#78716c]">{modules.length} módulos · {modules.reduce((total, module) => total + module.lessons.length, 0)} clases · {course.enrolled} alumnos inscritos</p>
              </div>
              <Link href="/profesor/chat" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e7e5e4] px-3 py-2 text-[11px] font-semibold text-[#ea580c] transition hover:bg-[#fff7ed]">
                <MessageCircle className="size-3.5" aria-hidden="true" /> Avisar al curso
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}