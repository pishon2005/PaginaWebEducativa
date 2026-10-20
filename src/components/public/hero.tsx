"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { BenefitsBar } from "./benefits-bar";

// Solo cambiamos el fondo, el texto se mantiene fijo
const backgrounds = [
  "/img/Fondo1.webp",
  "/img/fondo_proyectos.webp",
  "/img/python.webp",
  "/img/procesador.webp",
  "/img/icono_crecimiento.webp",
  "/img/rayo_minimalista.webp",
];

const AUTO_PLAY_INTERVAL = 5000; // 5 segundos

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Pause on hover
  const handleMouseEnter = useCallback(() => setIsPlaying(false), []);
  const handleMouseLeave = useCallback(() => setIsPlaying(true), []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  }, []);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + backgrounds.length) % backgrounds.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  }, []);

  const currentBackground = backgrounds[currentIndex];

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[690px] flex-col overflow-hidden bg-neutral-950 text-white sm:min-h-[720px] lg:min-h-[680px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Carousel - Solo cambia el fondo */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {backgrounds.map((bg, index) => (
          <div
            key={bg}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={bg}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.58)_0%,rgba(10,10,10,0.18)_48%,rgba(10,10,10,0)_100%),linear-gradient(0deg,rgba(10,10,10,0.04)_0%,transparent_22%)]"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Foreground Image (chico_fondo) - Se mantiene fijo */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-neutral-950/65 to-transparent lg:h-28" aria-hidden="true" />

      {/* Content - Texto FIJO, no cambia */}
      <div
        className="relative z-20 mx-auto grid w-full max-w-[1440px] flex-1 grid-rows-[auto_18rem] items-start gap-2 px-5 pt-10 sm:grid-rows-[auto_23rem] sm:px-8 sm:pt-12 lg:grid-rows-1 lg:grid-cols-[1.08fr_0.92fr] lg:gap-0 lg:px-14 lg:pt-16 lg:pb-34 lg:items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Text Content - FIJO */}
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
            Cursos prácticos de programación, electrónica, microcontroladores e investigación.
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

        {/* Foreground Image (chico_fondo) - FIJO */}
        <div className="relative z-10 -mx-5 h-full min-h-0 select-none sm:-mx-8 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:mx-0 lg:w-[66%] lg:translate-x-[-20%]">
          <Image
            src="/img/chico_fondo.webp"
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

      {/* Navigation Controls - Solo para cambiar fondo */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        <button
          onClick={goPrev}
          className="rounded-full bg-neutral-950/75 p-2 text-neutral-100 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-neutral-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Fondo anterior"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Fondos del carrusel">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Fondo ${index + 1}`}
              className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-orange-500 w-6"
                  : "bg-neutral-300/50 hover:bg-neutral-300"
              }`}
            >
              <span className="sr-only">Fondo {index + 1}</span>
            </button>
          ))}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full bg-neutral-950/75 p-2 text-neutral-100 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-neutral-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={isPlaying ? "Pausar carrusel" : "Reanudar carrusel"}
          >
            {isPlaying ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
          </button>
        </div>

        <button
          onClick={goNext}
          className="rounded-full bg-neutral-950/75 p-2 text-neutral-100 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:bg-neutral-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Siguiente fondo"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Keyboard Navigation */}
      <div
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goPrev();
          if (e.key === "ArrowRight") goNext();
          if (e.key === " ") {
            e.preventDefault();
            setIsPlaying(!isPlaying);
          }
        }}
        className="sr-only"
        tabIndex={0}
        role="region"
        aria-label="Controles de carrusel de fondos"
      />

      <BenefitsBar />
    </section>
  );
}