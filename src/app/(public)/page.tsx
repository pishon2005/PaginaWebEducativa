import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";

const featuredCourses = [
  {
    slug: "curso-1",
    title: "Fundamentos de Python",
    category: "Programación",
    level: "Inicial",
    mark: "PY",
    color: "bg-[#e1ebe2] text-[#42674a]",
  },
  {
    slug: "curso-2",
    title: "Desarrollo web con React",
    category: "Tecnología",
    level: "Intermedio",
    mark: "RE",
    color: "bg-[#e3edf0] text-[#456a7a]",
  },
  {
    slug: "curso-5",
    title: "Diseño de interfaces digitales",
    category: "Diseño",
    level: "Inicial",
    mark: "UX",
    color: "bg-[#f1eae5] text-[#8b5f45]",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#fbfcf9] text-[#1d3025]">
      <section className="relative isolate overflow-hidden bg-[#eaf1e9]">
        <div
          className="absolute inset-y-0 right-0 -z-10 hidden w-[48%] bg-[radial-gradient(ellipse_at_60%_20%,#f5f0df_0%,transparent_48%),linear-gradient(145deg,#d7e5d9,#c8dbcd_55%,#e5ecdf)] lg:block"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#cbdacb] bg-white/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#507355]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Formación con propósito
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#183a2b] sm:text-5xl lg:text-[3.6rem]">
              El conocimiento transforma cuando encuentras tu camino.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#627268]">
              Aula Norte conecta a estudiantes y docentes en una experiencia
              pensada para aprender con claridad, acompañamiento y propósito.
            </p>
            <Link
              href="#experiencia"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#173c2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#24543e]"
            >
              Conoce nuestra propuesta
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#627268]">
              <span className="flex items-center gap-2">
                <BookOpen className="size-4 text-[#65876b]" aria-hidden="true" />
                Aprendizaje estructurado
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap className="size-4 text-[#65876b]" aria-hidden="true" />
                Acompañamiento docente
              </span>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-lg lg:pl-8"
            aria-label="Nuestro enfoque: aprender, compartir y avanzar"
          >
            <div
              className="absolute -right-6 -top-7 size-28 rounded-[2rem] border border-[#c2d3c3]"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#183e2e] p-6 text-white shadow-[0_24px_70px_-32px_rgba(24,58,43,0.6)] sm:p-8">
              <div
                className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div
                className="absolute -right-5 -top-8 size-44 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9d1bc]">
                  Una idea que nos guía
                </p>
                <p className="mt-5 max-w-sm text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                  Aprender abre posibilidades. Compartirlas las multiplica.
                </p>
              </div>
              <div className="relative mt-8 grid grid-cols-3 gap-2">
                {[
                  { number: "01", label: "Aprender" },
                  { number: "02", label: "Compartir" },
                  { number: "03", label: "Avanzar" },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-white/10 bg-white/[0.08] p-3"
                  >
                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#c7d99f]">
                      {step.number}
                    </span>
                    <p className="mt-3 text-xs font-semibold text-[#f0f5ee] sm:text-sm">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-[#d3e1d4]">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d8e7d6] text-[#315b3d]">
                  <MessageCircle className="size-4" aria-hidden="true" />
                </span>
                <span>Una comunidad que acompaña cada etapa.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="experiencia"
        className="scroll-mt-20 mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d836f]">
            Una experiencia que te acompaña
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1e3c2c] sm:text-3xl">
            Aprender, enseñar y crecer en un mismo espacio.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#738077]">
            Herramientas claras para que estudiantes y docentes se concentren en
            lo importante: avanzar juntos.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Contenido organizado",
              text: "Clases y materiales reunidos en recorridos sencillos de seguir.",
            },
            {
              icon: CheckCircle2,
              title: "Progreso con sentido",
              text: "Actividades y evaluaciones que ayudan a reconocer cada avance.",
            },
            {
              icon: MessageCircle,
              title: "Acompañamiento cercano",
              text: "Comunicación directa con docentes y compañeros de aprendizaje.",
            },
          ].map(({ icon: Icon, title, text }, index) => (
            <article
              key={title}
              className="rounded-2xl border border-[#e1e8df] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_-28px_rgba(24,58,43,0.55)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#edf4ee] text-[#4d7654]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold tracking-[0.12em] text-[#a4afa4]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#243c2d]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#758178]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="docente"
        className="scroll-mt-20 border-y border-[#e4e9e1] bg-[#f0f3ec]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:px-8 md:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d836f]">
              Enseñanza con experiencia
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1e3c2c] sm:text-3xl">
              Personas que comparten lo que saben.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#738077]">
              Cada curso está guiado por especialistas que convierten su
              experiencia en aprendizajes prácticos y cercanos.
            </p>
            <Link
              href="/profesores/ana-campos"
              className="group mt-6 flex items-center gap-3 rounded-2xl border border-[#dfe7dd] bg-white p-4 transition hover:border-[#b7cbb9]"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#244d39] text-sm font-semibold text-white">
                AC
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#294132]">
                  Ana María Campos
                </span>
                <span className="mt-1 block text-xs text-[#7a887e]">
                  Ingeniería de software · Docente
                </span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-[#829087] transition group-hover:translate-x-1 group-hover:text-[#315d3d]"
                aria-hidden="true"
              />
            </Link>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6d836f]">
              Lo que significa aprender en comunidad
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  quote:
                    "Tener mis clases y actividades en un mismo lugar me ayuda a mantener el rumbo.",
                  name: "Valeria Rojas",
                  detail: "Estudiante · Tecnología",
                },
                {
                  quote:
                    "Poder compartir mis dudas y recibir orientación hace la diferencia en cada etapa.",
                  name: "Estudiante de Aula Norte",
                  detail: "Experiencia de aprendizaje",
                },
              ].map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="rounded-2xl border border-[#e1e8df] bg-white p-5 shadow-[0_16px_40px_-35px_rgba(24,58,43,0.6)]"
                >
                  <Quote className="size-5 text-[#729174]" aria-hidden="true" />
                  <blockquote className="mt-3 text-sm leading-6 text-[#405646]">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-[#edf1ed] pt-4">
                    <span className="block text-xs font-semibold text-[#304637]">
                      {testimonial.name}
                    </span>
                    <span className="mt-1 block text-[10px] text-[#829087]">
                      {testimonial.detail}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-[#849087]">
              Testimonios de demostración.
            </p>
          </div>
        </div>
      </section>

      <section
        id="catalogo"
        className="scroll-mt-20 mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d836f]">
              Oferta académica
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1e3c2c]">
              Conocimientos para abrir nuevos caminos.
            </h2>
          </div>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#376348] transition hover:text-[#173c2d]"
          >
            Explorar el catálogo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-7 grid gap-3 md:grid-cols-3">
          {featuredCourses.map((course) => (
            <Link
              key={course.slug}
              href={`/cursos/${course.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-[#e1e8df] bg-white p-4 transition hover:border-[#b7cbb9]"
            >
              <span
                className={`grid size-14 shrink-0 place-items-center rounded-2xl text-sm font-bold ${course.color}`}
              >
                {course.mark}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#869188]">
                  {course.category} · {course.level}
                </span>
                <span className="mt-1 block text-sm font-semibold text-[#304637]">
                  {course.title}
                </span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-[#8b978d] transition group-hover:translate-x-1 group-hover:text-[#315d3d]"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
