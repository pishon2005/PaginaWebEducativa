import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

const stats = [
  { value: "2,100+", label: "Estudiantes formados" },
  { value: "10+", label: "Años de experiencia docente" },
  { value: "4.9/5", label: "Valoración promedio" },
  { value: "6", label: "Cursos activos" },
];

const team = [
  { name: "Ana María Campos", role: "Ingeniería de software · Docente", initials: "AC" },
  { name: "Mariana Torres", role: "Ciencia de datos · Docente", initials: "MT" },
  { name: "Luis Herrera", role: "Diseño de interfaces · Docente", initials: "LH" },
];

export default function NosotrosPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-neutral-200 bg-neutral-50 px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Aprendemos en comunidad</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">Nosotros</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            EDUKATECH nace para cerrar la brecha entre la teoría y la práctica. Creemos que la tecnología se aprende construyendo.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950">Nuestra misión</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                Cada curso está diseñado alrededor de proyectos reales que puedes mostrar al mundo. No se trata solo de ver videos: se trata de construir, equivocarse, iterar y lograr que algo funcione.
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                Nuestro equipo combina experiencia en ingeniería, educación y desarrollo de producto para acompañarte desde tu primera línea de código hasta tu primer prototipo funcional.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Python", "React", "Robótica", "IoT", "Ciencia de datos"].map((skill) => (
                  <span key={skill} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700">{skill}</span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center">
                  <p className="text-2xl font-bold text-neutral-950">{value}</p>
                  <p className="mt-1 text-xs text-neutral-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-orange-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">Nuestro equipo</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map(({ name, role, initials }) => (
              <article key={name} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <span className="grid size-14 place-items-center rounded-full bg-neutral-950 text-sm font-bold text-white">{initials}</span>
                <h3 className="mt-4 text-base font-bold text-neutral-950">{name}</h3>
                <p className="mt-1 text-sm text-neutral-600">{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-neutral-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-400">¿Listo para empezar?</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Únete a la comunidad EDUKATECH</h2>
              </div>
              <Link href="/cursos" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-600">
                Explorar cursos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
