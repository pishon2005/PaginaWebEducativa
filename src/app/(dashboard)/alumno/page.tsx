import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

export default function AlumnoDashboard() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#dce7dc] bg-[linear-gradient(115deg,#eaf2e9_0%,#f4f5ed_62%,#e8efe4_100%)] p-6 sm:p-8">
        <div className="absolute -right-12 -top-16 size-56 rounded-full border border-[#cbdacb]/70" aria-hidden="true" />
        <div className="absolute -right-1 -top-9 size-36 rounded-full border border-[#cbdacb]/70" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#64806a]">Tu espacio de aprendizaje</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b]">Hola, Valeria</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#718078]">Cada sesión suma. Retoma tus cursos y descubre lo que tienes por delante esta semana.</p>
            <Link href="/cursos" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#24543e]">
              Explorar cursos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative flex min-w-[190px] items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#edf4ee] text-[#4f7656]"><BookOpen className="size-5" aria-hidden="true" /></span>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#829087]">Tu ritmo esta semana</p><p className="mt-1 text-sm font-semibold text-[#294132]">3 cursos activos</p></div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen del alumno">
        {[
          { label: "Cursos en progreso", value: "3", icon: BookOpen },
          { label: "Actividades pendientes", value: "5", icon: Clock3 },
          { label: "Clases completadas", value: "18", icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="flex items-center gap-4 rounded-2xl border border-[#e1e8e1] bg-white px-5 py-4 shadow-[0_8px_24px_-22px_rgba(24,58,43,0.5)]">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#edf4ee] text-[#4f7656]"><Icon className="size-[18px]" aria-hidden="true" /></span>
            <div><p className="text-xs font-medium text-[#7b887f]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#1c392b]">{value}</p></div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-[#dfe7e0] bg-white shadow-[0_10px_32px_-28px_rgba(24,58,43,0.55)]">
          <div className="flex items-center justify-between border-b border-[#e8ede8] px-5 py-4">
            <div><h2 className="text-base font-semibold text-[#20392b]">Continúa aprendiendo</h2><p className="mt-1 text-xs text-[#849087]">Tus cursos activos</p></div>
            <Link href="/alumno/mis-cursos" className="text-xs font-semibold text-[#376348] hover:text-[#173c2d]">Ver todos</Link>
          </div>
          <div className="divide-y divide-[#edf1ed]">
            {[
              { ...getDemoCourse("python"), next: "Módulo 4 · Funciones" },
              { ...getDemoCourse("excel"), next: "Módulo 2 · Tablas dinámicas" },
              { ...getDemoCourse("diseno"), next: "Módulo 6 · Prototipado" },
            ].map((course) => (
              <Link key={course.id} href={`/alumno/mis-cursos/${course.id}`} className="block px-5 py-4 transition-colors hover:bg-[#f7faf7]">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[#304637]">{course.title}</p><span className="rounded-full bg-[#edf4ee] px-2.5 py-1 text-[11px] font-bold text-[#59765e]">{course.progress}%</span></div>
                <p className="mt-1 text-xs text-[#829087]">Siguiente: {course.next}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9eee9]"><div className="h-full rounded-full bg-[#4f8059]" style={{ width: `${course.progress}%` }} /></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe7e0] bg-white shadow-[0_10px_32px_-28px_rgba(24,58,43,0.55)]">
          <div className="border-b border-[#e8ede8] px-5 py-4"><h2 className="text-base font-semibold text-[#20392b]">Para esta semana</h2><p className="mt-1 text-xs text-[#849087]">Próximas fechas importantes</p></div>
          <div className="space-y-4 p-5">
            {[
              { date: "07 OCT", title: "Entrega: funciones en Python", course: "Fundamentos de Python", color: "border-[#dba64a]" },
              { date: "09 OCT", title: "Clase nueva disponible", course: "Diseño de interfaces", color: "border-[#6c9b73]" },
              { date: "12 OCT", title: "Quiz: fórmulas y funciones", course: "Excel para negocios", color: "border-[#7a9eb5]" },
            ].map((event) => (
              <div key={event.title} className={`border-l-2 pl-3 ${event.color}`}>
                <p className="text-[10px] font-bold tracking-[0.08em] text-[#7d8a81]">{event.date}</p>
                <p className="mt-1 text-sm font-semibold text-[#304637]">{event.title}</p>
                <p className="mt-1 text-xs text-[#829087]">{event.course}</p>
              </div>
            ))}
            <Link href="/alumno/calendario" className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-[#376348] hover:text-[#173c2d]">Abrir calendario <CalendarDays className="size-3.5" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}