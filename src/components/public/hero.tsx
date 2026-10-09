import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BenefitsBar } from "./benefits-bar";

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
      className="relative isolate flex min-h-[690px] flex-col overflow-hidden bg-neutral-950 text-white sm:min-h-[720px] lg:min-h-[680px]"
    >
      <Image
        src="/img/Fondo1.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />

      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(10,10,10,0.58)_0%,rgba(10,10,10,0.18)_48%,rgba(10,10,10,0)_100%),linear-gradient(0deg,rgba(10,10,10,0.04)_0%,transparent_22%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-neutral-950/65 to-transparent lg:h-28"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto grid w-full max-w-[1440px] flex-1 grid-rows-[auto_18rem] items-start gap-2 px-5 pt-10 sm:grid-rows-[auto_23rem] sm:px-8 sm:pt-12 lg:grid-rows-1 lg:grid-cols-[1.08fr_0.92fr] lg:gap-0 lg:px-14 lg:pt-16 lg:pb-34 lg:items-center">
        <div className="relative z-20 max-w-[700px]">
          <p className="inline-flex select-none items-center gap-3 rounded-md bg-neutral-950/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-100 shadow-lg shadow-black/20 backdrop-blur-sm sm:text-xs">
            Aprende <span className="text-orange-400">·</span> Crea{" "}
            <span className="text-orange-400">·</span> Innova
          </p>
          <h1 className="mt-4 max-w-[700px] text-[clamp(2.25rem,11vw,3rem)] leading-[0.92] font-black tracking-tight text-white drop-shadow-lg sm:text-[clamp(2.75rem,4.4vw,4.5rem)]">
            De cero a
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              proyectos reales
            </span>
          </h1>
          <p className="mt-5 max-w-[470px] text-base leading-6 text-neutral-100 drop-shadow sm:text-lg">
            Cursos prácticos de programación, electrónica,
            microcontroladores e investigación.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cursos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver cursos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#proyectos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-orange-400 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Conoce más
            </Link>
          </div>
        </div>

        <div className="relative z-10 -mx-5 h-full min-h-0 select-none sm:-mx-8 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:mx-0 lg:w-[66%] lg:translate-x-[-20%]">
          <Image
            src="/img/chico_fondo.png"
            alt=""
            fill
            draggable={false}
            priority
            sizes="(max-width: 1023px) 100vw, 66vw"
            className="pointer-events-none select-none object-contain object-bottom lg:object-right-bottom"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 via-transparent to-neutral-950/5 lg:bg-gradient-to-r lg:from-neutral-950/25 lg:via-transparent lg:to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>

      <aside
        aria-label="Tecnologías que aprenderás"
        className="pointer-events-none absolute top-[45%] right-24 z-30 hidden w-56 -translate-y-1/2 select-none rounded-2xl border border-white/15 bg-neutral-950/80 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl lg:block xl:right-72 xl:w-60 xl:p-3.5"
      >
        <ul className="grid gap-2">
          {technologies.map(({ label, icon }) => (
            <li
              key={label}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2 text-sm font-medium text-white xl:gap-4 xl:px-3.5 xl:py-2.5 xl:text-[15px]"
            >
              <Image
                src={icon}
                alt=""
                width={40}
                height={40}
                draggable={false}
                className="size-9 shrink-0 select-none object-contain xl:size-10"
              />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative z-20 px-5 pb-5 sm:px-8 lg:hidden">
        <aside
          aria-label="Tecnologías que aprenderás"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-xl border border-white/15 bg-neutral-950/70 px-4 py-3 backdrop-blur-xl"
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

      <BenefitsBar />
    </section>
  );
}