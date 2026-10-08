import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    name: "Seguidor de línea",
    detail: "Robótica · Sensores · Arduino",
    icon: "/img/tuerca.png",
    art: "from-neutral-900 via-neutral-800 to-orange-950",
    dot: "bg-orange-400",
    index: 1,
  },
  {
    name: "Soccerbot",
    detail: "Electrónica · Control · Robótica",
    icon: "/img/procesador.png",
    art: "from-slate-950 via-blue-950 to-neutral-800",
    dot: "bg-sky-300",
    index: 2,
  },
  {
    name: "Mini Smart Factory",
    detail: "Automatización · IoT · Industria",
    icon: "/img/icono_crecimiento.png",
    art: "from-neutral-950 via-stone-800 to-yellow-950",
    dot: "bg-yellow-300",
    index: 3,
  },
];

export function ProjectsSection() {
  return (
    <section
      id="proyectos"
      className="scroll-mt-20 relative isolate overflow-hidden bg-neutral-950 px-5 py-16 text-white sm:px-6 md:py-20 lg:px-8"
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_100%_0%,rgba(249,115,22,0.22),transparent_40%),linear-gradient(135deg,#0a0a0a_0%,#171717_60%,#301404_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              Del aprendizaje a la acción
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Convierte lo aprendido en{" "}
              <span className="text-yellow-400">proyectos reales</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base">
              Experimenta, resuelve problemas y construye soluciones que puedes
              mostrar al mundo.
            </p>
          </div>
          <Link
            href="/cursos"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            Ver proyectos
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {projects.map(({ name, detail, icon, art, dot, index }) => (
            <article
              key={name}
              className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-900 transition duration-200 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-black/20"
            >
              <div
                className={`relative isolate grid aspect-[1.6/1] place-items-center overflow-hidden bg-gradient-to-br ${art}`}
              >
                <div
                  className="absolute inset-0 -z-10 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:28px_28px]"
                  aria-hidden="true"
                />
                <span className="absolute top-4 left-4 rounded-md border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[10px] tracking-wider text-neutral-300">
                  PROYECTO_0{index}
                </span>
                <span className="grid size-20 place-items-center rounded-2xl border border-white/15 bg-black/30 shadow-[0_0_48px_-12px_rgba(249,115,22,0.5)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={icon}
                    alt=""
                    width={56}
                    height={56}
                    className="size-12 object-contain"
                  />
                </span>
                <span
                  className={`absolute right-4 bottom-4 size-2 rounded-full ${dot} shadow-[0_0_10px_currentColor]`}
                  aria-hidden="true"
                />
              </div>
              <div className="border-t border-white/5 p-4">
                <h3 className="text-base font-bold text-white">{name}</h3>
                <p className="mt-1 text-xs text-neutral-500">{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

