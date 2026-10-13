import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, MessageCircle, Plus, Users } from "lucide-react";

export default function ProfesorDashboard() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[#fff7ed] bg-[linear-gradient(115deg,#fff7ed_0%,#fafaf9_62%,#fff7ed_100%)] p-6 sm:p-8">
        <div className="absolute -right-12 -top-16 size-56 rounded-full border border-[#fff7ed]/70" aria-hidden="true" />
        <div className="absolute -right-1 -top-9 size-36 rounded-full border border-[#fff7ed]/70" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ea580c]">Tu espacio docente</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Buen día, profesora</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#44403c]">Tu acompañamiento hace la diferencia. Aquí tienes lo más importante para hoy.</p>
          </div>
          <Link href="/profesor/mis-cursos" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ea580c]">
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
          <article key={label} className="rounded-2xl border border-[#e7e5e4] bg-white p-5 shadow-[0_8px_24px_-22px_rgba(28,25,23,0.5)]">
            <div className="flex items-center justify-between"><p className="text-sm font-medium text-[#44403c]">{label}</p><span className="grid size-9 place-items-center rounded-xl bg-[#fff7ed] text-[#44403c]"><Icon className="size-[18px]" aria-hidden="true" /></span></div>
            <p className="mt-4 text-[28px] font-semibold tracking-tight text-[#171717]">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white shadow-[0_10px_32px_-28px_rgba(28,25,23,0.55)]">
          <div className="flex items-center justify-between border-b border-[#e7e5e4] px-5 py-4">
            <div><h2 className="text-base font-semibold text-[#171717]">Tus cursos</h2><p className="mt-1 text-xs text-[#78716c]">Acceso rápido al contenido y seguimiento</p></div>
            <Link href="/profesor/mis-cursos" className="text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Ver cursos</Link>
          </div>
          <div className="divide-y divide-[#fafaf9]">
            {[
              { title: "Fundamentos de Python", category: "Programación · 54 alumnos", activity: "8 entregas por revisar" },
              { title: "Excel para negocios", category: "Productividad · 42 alumnos", activity: "2 mensajes sin leer" },
              { title: "Diseño de interfaces", category: "Diseño · 32 alumnos", activity: "Próxima clase: Módulo 6" },
            ].map((course) => (
              <Link key={course.title} href="/profesor/mis-cursos" className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-[#fff7ed]">
                <div><p className="text-sm font-semibold text-[#171717]">{course.title}</p><p className="mt-1 text-xs text-[#78716c]">{course.category}</p></div>
                <span className="text-xs font-medium text-[#ea580c]">{course.activity}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5 shadow-[0_10px_32px_-28px_rgba(28,25,23,0.55)]">
          <h2 className="text-base font-semibold text-[#171717]">Atajos docentes</h2>
          <p className="mt-1 text-xs text-[#78716c]">Acciones disponibles en tu vista</p>
          <div className="mt-4 divide-y divide-[#fafaf9]">
            {[
              { label: "Revisar entregas y calificaciones", href: "/profesor/mis-cursos", icon: ClipboardCheck },
              { label: "Enviar mensaje a un curso", href: "/profesor/chat", icon: MessageCircle },
              { label: "Gestionar semanas y clases", href: "/profesor/mis-cursos", icon: BookOpen },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="group flex items-center justify-between gap-3 py-3 text-sm font-medium text-[#ea580c] hover:text-[#c2410c]">
                <span className="flex items-center gap-3"><Icon className="size-4 text-[#78716c]" aria-hidden="true" />{label}</span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}