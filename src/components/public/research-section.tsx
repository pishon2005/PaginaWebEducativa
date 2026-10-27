import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ResearchLine = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

const researchLines: ResearchLine[] = [
  {
    id: "tesis",
    title: "Tesis",
    description:
      "Acompañamiento metodológico para llevar una pregunta de investigación hasta su defensa.",
    image: "/img/sombrerodegraduación.webp",
    alt: "Birrete de graduación",
  },
  {
    id: "articulo-cientifico",
    title: "Artículo científico",
    description:
      "Publicación revisada por pares: metodología, resultados y escritura técnica con estándares reales.",
    image: "/img/libro.webp",
    alt: "Libro abierto",
  },
  {
    id: "patente",
    title: "Patente",
    description:
      "Protección de invenciones y prototipos con el registro de propiedad industrial.",
    image: "/img/procesador.webp",
    alt: "Circuito integrado",
  },
];

export function ResearchSection() {
  return (
    <section
      id="investigaciones"
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
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
              Del aprendizaje a la investigación
            </p>
            <h2 className="mt-3 text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl">
              Convierte lo aprendido en{" "}
              <span className="text-orange-500">investigación</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-300">
              Metodología, publicación y propiedad intelectual para que tu
              proyecto trascienda el aula.
            </p>
            <Link
              href="/cursos"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/40 transition-all hover:bg-orange-600 hover:shadow-orange-500/50"
            >
              Ver cursos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {researchLines.map(({ id, title, description, image, alt }) => (
              <article
                key={id}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl shadow-black/60 ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-1 hover:border-orange-500/70 hover:ring-orange-500/20"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(max-width: 1023px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <span className="block w-full rounded-lg bg-neutral-950 px-3 py-2 text-center text-xs font-bold tracking-wide text-white shadow-lg sm:text-sm">
                      {title}
                    </span>
                    <p className="mt-2 hidden text-[11px] leading-4 text-neutral-300 sm:block">
                      {description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
