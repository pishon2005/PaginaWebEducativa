import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAsistenciaAlumnoCurso } from "@/lib/asistencia/demo-asistencia";
import { AttendanceSummary } from "@/components/asistencia/attendance-summary";

export default function AlumnoDashboard() {
  // Alumno demo: Valeria Rojas (id: "4")
  const alumnoId = "4";
  const cursoId = "1"; // Fundamentos de Python
  const asistenciaData = getAsistenciaAlumnoCurso(alumnoId, cursoId);
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#fff7ed] bg-[linear-gradient(115deg,#fff7ed_0%,#fafaf9_62%,#fff7ed_100%)] p-6 sm:p-8">
        <div className="absolute -right-12 -top-16 size-56 rounded-full border border-[#fff7ed]/70" aria-hidden="true" />
        <div className="absolute -right-1 -top-9 size-36 rounded-full border border-[#fff7ed]/70" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ea580c]">Tu espacio de aprendizaje</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Hola, Valeria</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#44403c]">Cada sesión suma. Retoma tus cursos y descubre lo que tienes por delante esta semana.</p>
            <Link href="/cursos" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea580c]">
              Explorar cursos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative flex min-w-[190px] items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#fff7ed] text-[#ea580c]"><BookOpen className="size-5" aria-hidden="true" /></span>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#78716c]">Tu ritmo esta semana</p><p className="mt-1 text-sm font-semibold text-[#171717]">3 cursos activos</p></div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen del alumno">
        {[
          { label: "Cursos en progreso", value: "3", icon: BookOpen },
          { label: "Actividades pendientes", value: "5", icon: Clock3 },
          { label: "Clases completadas", value: "18", icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="flex items-center gap-4 rounded-2xl border border-[#e7e5e4] bg-white px-5 py-4 shadow-[0_8px_24px_-22px_rgba(28,25,23,0.5)]">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#fff7ed] text-[#ea580c]"><Icon className="size-[18px]" aria-hidden="true" /></span>
            <div><p className="text-xs font-medium text-[#78716c]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#171717]">{value}</p></div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white shadow-[0_10px_32px_-28px_rgba(28,25,23,0.55)]">
          <div className="flex items-center justify-between border-b border-[#e7e5e4] px-5 py-4">
            <div><h2 className="text-base font-semibold text-[#171717]">Continúa aprendiendo</h2><p className="mt-1 text-xs text-[#78716c]">Tus cursos activos</p></div>
            <Link href="/alumno/mis-cursos" className="text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Ver todos</Link>
          </div>
          <div className="divide-y divide-[#fafaf9]">
            {[
              { ...getDemoCourse("1"), next: "Módulo 4 · Funciones" },
              { ...getDemoCourse("3"), next: "Módulo 2 · Tablas dinámicas" },
              { ...getDemoCourse("5"), next: "Módulo 6 · Prototipado" },
            ].map((course) => (
              <Link key={course.id} href={`/alumno/mis-cursos/${course.id}`} className="block px-5 py-4 transition-colors hover:bg-[#fff7ed]">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[#171717]">{course.title}</p><span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-[11px] font-bold text-[#ea580c]">{course.progress}%</span></div>
                <p className="mt-1 text-xs text-[#78716c]">Siguiente: {course.next}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e7e5e4]"><div className="h-full rounded-full bg-[#ea580c]" style={{ width: `${course.progress}%` }} /></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white shadow-[0_10px_32px_-28px_rgba(28,25,23,0.55)]">
          <div className="border-b border-[#e7e5e4] px-5 py-4"><h2 className="text-base font-semibold text-[#171717]">Para esta semana</h2><p className="mt-1 text-xs text-[#78716c]">Próximas fechas importantes</p></div>
          <div className="space-y-4 p-5">
            {[
              { date: "07 OCT", title: "Entrega: funciones en Python", course: "Fundamentos de Python", color: "border-[#dba64a]" },
              { date: "09 OCT", title: "Clase nueva disponible", course: "Diseño de interfaces", color: "border-[#ea580c]" },
              { date: "12 OCT", title: "Quiz: fórmulas y funciones", course: "Excel para negocios", color: "border-[#78716c]" },
            ].map((event) => (
              <div key={event.title} className={`border-l-2 pl-3 ${event.color}`}>
                <p className="text-[10px] font-bold tracking-[0.08em] text-[#78716c]">{event.date}</p>
                <p className="mt-1 text-sm font-semibold text-[#171717]">{event.title}</p>
                <p className="mt-1 text-xs text-[#78716c]">{event.course}</p>
              </div>
            ))}
            <Link href="/alumno/calendario" className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Abrir calendario <CalendarDays className="size-3.5" aria-hidden="true" /></Link>
          </div>
        </div>

                {/* Resumen de asistencia */}
                <AttendanceSummary data={asistenciaData} cursoId={cursoId} maxItems={3} />
              </section>
            </div>
          );
        }