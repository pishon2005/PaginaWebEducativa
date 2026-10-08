import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const technologies = [
  { label: "Python", icon: "/img/python.png" },
  { label: "MicroPython", icon: "/img/libro.png" },
  { label: "ESP32", icon: "/img/procesador.png" },
  { label: "Electrónica", icon: "/img/rayo_minimalista.png" },
  { label: "IoT", icon: "/img/redwifi.png" },
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[420px] flex-col overflow-hidden bg-neutral-950 text-white sm:min-h-[480px] lg:min-h-[520px]"
    >
      {/* ── Imagen de fondo (background tecnológico con formas naranjas) ── */}
      <Image
        src="/img/5c5b480b-2177-4370-8d39-459bbc47687c.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />

      {/* ── Overlay izquierdo: oscurece el 55% izquierdo para que el texto sea legible ── */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.75)_38%,rgba(8,8,8,0.30)_58%,rgba(8,8,8,0.05)_75%,transparent_100%)]"
        aria-hidden="true"
      />
      {/* Overlay inferior sutil para la barra de beneficios */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-neutral-950/70 to-transparent lg:h-24"
        aria-hidden="true"
      />

      {/* ── Contenido principal ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 grid-rows-[1fr_auto] items-stretch gap-0 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:grid-rows-1 lg:items-center lg:px-14">

        {/* ── Columna izquierda: texto ── */}
        <div className="flex flex-col justify-center py-10 sm:py-12 lg:max-w-[520px] lg:py-14">
          {/* Etiqueta APRENDE · CREA · INNOVA */}
          <p className="inline-flex w-fit select-none items-center gap-2.5 rounded-md bg-neutral-950/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:text-xs">
            APRENDE{" "}
            <span className="text-orange-500" aria-hidden="true">·</span>
            {" "}CREA{" "}
            <span className="text-orange-500" aria-hidden="true">·</span>
            {" "}INNOVA
          </p>

          {/* Título */}
          <h1 className="mt-4 text-[clamp(2.6rem,9vw,4rem)] font-black leading-[0.92] tracking-tight text-white drop-shadow-lg sm:text-[clamp(3rem,6vw,4.5rem)]">
            De cero a
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              proyectos reales
            </span>
          </h1>

          {/* Descripción */}
          <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-neutral-100 drop-shadow sm:text-base">
            Cursos prácticos de programación, electrónica,
            microcontroladores e investigación.
          </p>

          {/* Botones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cursos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-950/40 transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
              Ver cursos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 bg-neutral-950/40 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-neutral-950/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Conoce más
            </Link>
          </div>
        </div>

        {/* ── Columna derecha: imagen del estudiante + panel tech ── */}
        <div className="pointer-events-none relative hidden select-none lg:block lg:h-full lg:w-[52%] xl:w-[54%]">
          {/* Imagen del estudiante */}
          <Image
            src="/img/4ff137cd-cd0b-49f5-aa0f-56f69175eaba.png"
            alt=""
            fill
            draggable={false}
            priority
            sizes="55vw"
            className="object-contain object-right-bottom"
          />
          {/* Gradiente de fusión izquierda */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-transparent"
            aria-hidden="true"
          />
          {/* Gradiente inferior */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* Python logo flotante — centro del área de imagen */}
          <div
            className="absolute bottom-[22%] left-[18%] size-14 sm:size-16"
            aria-hidden="true"
          >
            <Image
              src="/img/python.png"
              alt=""
              width={64}
              height={64}
              draggable={false}
              className="size-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Panel de tecnologías — esquina derecha */}
          <aside
            aria-label="Tecnologías que aprenderás"
            className="pointer-events-auto absolute top-1/2 right-4 z-20 w-44 -translate-y-1/2 select-none rounded-xl border border-white/20 bg-neutral-950/70 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl xl:right-6 xl:w-48"
          >
            <ul className="grid gap-2.5">
              {technologies.map(({ label, icon }) => (
                <li
                  key={label}
                  className="flex min-w-0 items-center gap-3 text-sm font-medium text-white"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={40}
                    height={40}
                    draggable={false}
                    className="size-9 shrink-0 select-none object-contain"
                  />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* ── Versión móvil del panel tech (debajo del texto) ── */}
        <div className="pb-5 lg:hidden">
          <aside
            aria-label="Tecnologías que aprenderás"
            className="inline-flex items-center gap-4 rounded-xl border border-white/15 bg-neutral-950/70 px-4 py-3 backdrop-blur-xl"
          >
            {technologies.map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Image
                  src={icon}
                  alt={label}
                  width={28}
                  height={28}
                  draggable={false}
                  className="size-7 object-contain"
                />
                <span className="text-[9px] font-medium text-neutral-300 sm:text-[10px]">
                  {label}
                </span>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}

