import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, MessageCircle, Plus, Users } from "lucide-react";

export default function ProfesorDashboard() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#dce7dc] bg-[linear-gradient(115deg,#eaf2e9_0%,#f4f5ed_62%,#e8efe4_100%)] p-6 sm:p-8">
        <div className="absolute -right-12 -top-16 size-56 rounded-full border border-[#cbdacb]/70" aria-hidden="true" />
        <div className="absolute -right-1 -top-9 size-36 rounded-full border border-[#cbdacb]/70" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#64806a]">Tu espacio docente</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b]">Buen día, profesora</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#718078]">Tu acompañamiento hace la diferencia. Aquí tienes lo más importante para hoy.</p>
          </div>
          <Link href="/profesor/mis-cursos" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#24543e]">
            <Plus className="size-4" aria-hidden="true" /> Gestionar cursos
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen docente">
        {[
          { label: "Cursos a cargo", value: "3", icon: BookOpen },
          { label: "Alumnos inscritos", value: "128", icon: Users },
          { label: "Por calificar", value: "12", icon: ClipboardCheck },
          { label: "Mensajes nuevos", value: "5", icon: MessageCircle },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-[#e1e8e1] bg-white p-5 shadow-[0_8px_24px_-22px_rgba(24,58,43,0.5)]">
            <div className="flex items-center justify-between"><p className="text-sm font-medium text-[#6f7d73]">{label}</p><span className="grid size-9 place-items-center rounded-xl bg-[#edf4ee] text-[#708d76]"><Icon className="size-[18px]" aria-hidden="true" /></span></div>
            <p className="mt-4 text-[28px] font-semibold tracking-tight text-[#1b382a]">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-[#dfe7e0] bg-white shadow-[0_10px_32px_-28px_rgba(24,58,43,0.55)]">
          <div className="flex items-center justify-between border-b border-[#e8ede8] px-5 py-4">
            <div><h2 className="text-base font-semibold text-[#20392b]">Tus cursos</h2><p className="mt-1 text-xs text-[#849087]">Acceso rápido al contenido y seguimiento</p></div>
            <Link href="/profesor/mis-cursos" className="text-xs font-semibold text-[#376348] hover:text-[#173c2d]">Ver cursos</Link>
          </div>
          <div className="divide-y divide-[#edf1ed]">
            {[
              { title: "Fundamentos de Python", category: "Programación · 54 alumnos", activity: "8 entregas por revisar" },
              { title: "Excel para negocios", category: "Productividad · 42 alumnos", activity: "4 preguntas en el foro" },
              { title: "Diseño de interfaces", category: "Diseño · 32 alumnos", activity: "Próxima clase: Módulo 6" },
            ].map((course) => (
              <Link key={course.title} href="/profesor/mis-cursos" className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-[#fbfcfa]">
                <div><p className="text-sm font-semibold text-[#304637]">{course.title}</p><p className="mt-1 text-xs text-[#829087]">{course.category}</p></div>
                <span className="text-xs font-medium text-[#607764]">{course.activity}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe7e0] bg-white p-5 shadow-[0_10px_32px_-28px_rgba(24,58,43,0.55)]">
          <h2 className="text-base font-semibold text-[#20392b]">Atajos docentes</h2>
          <p className="mt-1 text-xs text-[#849087]">Acciones disponibles en tu vista</p>
          <div className="mt-4 divide-y divide-[#edf1ed]">
            {[
              { label: "Revisar entregas y calificaciones", href: "/profesor/mis-cursos", icon: ClipboardCheck },
              { label: "Publicar en el foro del curso", href: "/profesor/foro", icon: MessageCircle },
              { label: "Gestionar semanas y clases", href: "/profesor/mis-cursos", icon: BookOpen },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="group flex items-center justify-between gap-3 py-3 text-sm font-medium text-[#526358] hover:text-[#1d513a]">
                <span className="flex items-center gap-3"><Icon className="size-4 text-[#7a8e7e]" aria-hidden="true" />{label}</span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}