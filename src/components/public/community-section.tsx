import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const communityCards = [
  {
    id: "recursos",
    eyebrow: "Siempre a tu alcance",
    title: "Materiales y recursos",
    description:
      "Guías, códigos y materiales de apoyo para que sigas construyendo dentro y fuera de clase.",
    icon: "/img/libro.png",
  },
  {
    id: "nosotros",
    eyebrow: "Aprendemos en comunidad",
    title: "Comunidad EDUKATECH",
    description:
      "Comparte ideas, resuelve dudas y encuentra personas que también quieren crear tecnología.",
    icon: "/img/personas.png",
  },
  {
    id: "investigacion",
    eyebrow: "Lleva tus ideas más lejos",
    title: "Asesoría de tesis",
    description:
      "Acompañamiento para transformar una pregunta de investigación en una solución tecnológica.",
    icon: "/img/sombrerodegraduación.png",
  },
];

export function CommunitySection() {
  return (
    <section
      id="beneficios"
      className="scroll-mt-20 bg-neutral-50 px-5 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
            Crece con EDUKATECH
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Más que cursos: una comunidad que impulsa tus ideas
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {communityCards.map(({ id, eyebrow, title, description, icon }) => (
            <article
              id={id}
              key={id}
              className="scroll-mt-28 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-neutral-950 shadow-sm shadow-orange-500/10">
                <Image
                  src={icon}
                  alt=""
                  width={36}
                  height={36}
                  className="size-8 object-contain"
                />
              </span>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
                {eyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold text-neutral-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {description}
              </p>
            </article>
          ))}
        </div>

        {/* CTA final */}
        <div
          id="contacto"
          className="scroll-mt-20 relative mt-6 flex flex-col gap-5 overflow-hidden rounded-xl bg-neutral-950 px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(249,115,22,0.12),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              Tu próxima idea empieza aquí
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              ¿Listo para construir algo increíble?
            </h3>
          </div>
          <Link
            href="/cursos"
            className="relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Encuentra tu curso
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

