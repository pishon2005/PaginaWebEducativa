import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const modalidades = [
  {
    key: "nivelacion",
    title: "Curso de nivelación",
    label: "NIVELACIÓN",
    description: "Para empezar desde cero con bases sólidas",
    icon: "/img/libro.webp",
    artwork: "from-emerald-950 via-teal-900 to-green-500",
  },
  {
    key: "taller",
    title: "Curso de taller",
    label: "TALLER",
    description: "Práctico, presencial y guiado paso a paso",
    icon: "/img/tuerca.webp",
    artwork: "from-amber-950 via-orange-900 to-amber-500",
  },
  {
    key: "libre",
    title: "Curso libre",
    label: "LIBRE",
    description: "A tu ritmo, sin horarios fijos",
    icon: "/img/libro.webp",
    artwork: "from-violet-950 via-purple-900 to-pink-500",
  },
  {
    key: "aplicativo",
    title: "Curso aplicativo",
    label: "APLICATIVO",
    description: "Proyectos reales, listos para aplicar",
    icon: "/img/icono_laptop.webp",
    artwork: "from-blue-950 via-indigo-900 to-cyan-500",
  },
];

export function CoursesSection() {
  return (
    <section
      id="catalogo"
      className="scroll-mt-20 bg-white px-5 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
              Nuestras modalidades
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              Elige cómo quieres aprender
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Cada modalidad está diseñada para adaptarse a tu ritmo y objetivos.
            </p>
          </div>
          <Link
            href="/cursos"
            className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-bold text-orange-600 transition-colors hover:text-orange-700"
          >
            Ver todos los cursos
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {modalidades.map(({ key, title, label, description, icon, artwork }) => (
            <article
              key={key}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
            >
              <Link
                href={`/cursos?modalidad=${key}`}
                aria-label={`Ver cursos de ${title}`}
                className="block"
              >
                <div
                  className={`relative isolate flex aspect-[1.45/1] items-end overflow-hidden bg-gradient-to-br ${artwork} p-5`}
                >
                  <div
                    className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:24px_24px]"
                    aria-hidden="true"
                  />
                  <div className="absolute -top-10 -right-6 -z-10 size-44 rounded-full border border-white/15" aria-hidden="true" />
                  <div className="absolute top-8 right-8 -z-10 size-28 rounded-full border border-white/10" aria-hidden="true" />
                  <Image
                    src={icon}
                    alt=""
                    width={120}
                    height={120}
                    className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 sm:size-28"
                  />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                  <span className="relative">
                    <span className="block text-[10px] font-bold tracking-[0.18em] text-orange-300">
                      {label}
                    </span>
                    <span className="mt-1 block text-lg leading-tight font-bold text-white">
                      {title}
                    </span>
                  </span>
                </div>
              </Link>

              <div className="px-4 py-3">
                <p className="text-sm text-neutral-600 line-clamp-2">{description}</p>
              </div>

              <Link
                href={`/cursos?modalidad=${key}`}
                className="mx-4 mb-4 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Explorar cursos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}