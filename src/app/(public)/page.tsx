import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/public/hero";
import {
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Users,
} from "lucide-react";

import { demoCoursesList } from "@/lib/demo-data";

const courses = demoCoursesList
  .filter((course) => course.published)
  .slice(0, 4)
  .map((course) => ({
    slug: course.slug,
    title: course.title,
    classes: course.classes,
    modality: course.modality,
    label: course.category,
    icon: course.icon,
    artwork: course.artwork,
  }));

const projects: {
  name: string;
  image: string;
}[] = [
    {
      name: "Seguidor de línea",
      image: "/img/proyecto-seguidor.webp",
    },
    {
      name: "Soccerbot",
      image: "/img/proyecto-soccerbot.webp",
    },
    {
      name: "Mini Smart Factory",
      image: "/img/proyecto-smart-factory.webp",
    },
  ];


export default function HomePage() {
  return (
    <div className="bg-white text-neutral-900">
      <Hero />

      <section
        id="catalogo"
        className="scroll-mt-24 bg-white px-5 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                Nuestros cursos
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Aprende lo que necesitas para tus proyectos
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
                Formación práctica para desarrollar habilidades, experimentar
                con tecnología y llevar tus ideas a la realidad.
              </p>
            </div>
            <Link
              href="/cursos"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-orange-700 transition-colors hover:text-orange-800"
            >
              Ver todos los cursos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map(
              ({
                slug,
                title,
                classes,
                modality,
                label,
                icon,
                artwork,
              }) => (
                <article
                  key={slug}
                  className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
                >
                  <Link
                    href={`/cursos/${slug}`}
                    aria-label={`Más información sobre ${title}`}
                    className="block"
                  >
                    <div
                      className={`relative isolate flex aspect-[1.45/1] items-end overflow-hidden bg-gradient-to-br ${artwork} p-5`}
                    >
                      <div
                        className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:24px_24px]"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute -top-12 -right-8 -z-10 size-48 rounded-full border border-white/20"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute top-6 right-7 -z-10 size-32 rounded-full border border-white/15"
                        aria-hidden="true"
                      />
                      <Image
                        src={icon}
                        alt=""
                        width={144}
                        height={144}
                        className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 sm:size-32"
                      />
                      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />
                      <span className="relative">
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-orange-300">
                          {label}
                        </span>
                        <span className="mt-1 block text-xl leading-tight font-bold text-white">
                          {title}
                        </span>
                      </span>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-2 px-4 py-3 text-xs text-neutral-600">
                    <span className="flex items-center gap-2">
                      <Users
                        className="size-4 text-orange-600"
                        aria-hidden="true"
                      />
                      {classes}
                    </span>
                    <span className="flex items-center justify-end gap-2">
                      <Monitor
                        className="size-4 text-orange-600"
                        aria-hidden="true"
                      />
                      {modality}
                    </span>
                  </div>
                  <Link
                    href={`/cursos/${slug}`}
                    className="mx-4 mb-4 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    Más información
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
  id="proyectos"
  className="scroll-mt-24 relative isolate flex items-center overflow-hidden bg-neutral-950 px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-14"
>
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/fondo_proyectos.webp')" }}
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-neutral-950/50"
  />

  <div className="mx-auto w-full max-w-[1400px]">
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-center lg:gap-10">
      {/* ==== Columna izquierda: texto ==== */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
          Del aprendizaje a la acción
        </p>
        <h2 className="mt-3 text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl">
          Convierte lo aprendido en{" "}
          <span className="text-orange-500">proyectos reales</span>
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-300">
          Aplicamos la teoría en soluciones prácticas para robótica,
          automatización, IoT y más.
        </p>
        <Link
          href="/cursos"
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/40 transition-all hover:bg-orange-600 hover:shadow-orange-500/50"
        >
          Ver proyectos
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {/* ==== Columna derecha: 3 tarjetas ==== */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {projects.map(({ name, image }) => (
          <article
            key={name}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl shadow-black/60 ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-1 hover:border-orange-500/70 hover:ring-orange-500/20"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 1023px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="block w-full rounded-lg bg-neutral-950 px-3 py-2 text-center text-xs font-bold tracking-wide text-white shadow-lg sm:text-sm">
                  {name}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </div>
</section>

      <section
        id="contacto"
        className="scroll-mt-24 bg-neutral-50 px-5 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 rounded-xl bg-neutral-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-400">
                Tu próxima idea empieza aquí
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                ¿Listo para construir algo increíble?
              </h3>
            </div>
            <Link
              href="/cursos"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              Encuentra tu curso
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
