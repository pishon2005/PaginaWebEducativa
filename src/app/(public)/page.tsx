import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/public/hero";
import { CoursesSection } from "@/components/public/courses-section";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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

      <CoursesSection />

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
