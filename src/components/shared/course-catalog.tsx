"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Monitor,
  Search,
  Users,
} from "lucide-react";

const courses = [
  {
    slug: "curso-1",
    title: "Fundamentos de Python",
    description: "Aprende a programar con proyectos guiados desde cero.",
    level: "Inicial",
    hours: 24,
    classes: "9 clases",
    price: 189,
    modality: "Virtual",
    icon: "/img/python.png",
    artwork: "from-sky-950 via-blue-900 to-orange-600",
    category: "PROGRAMACIÓN",
  },
  {
    slug: "curso-2",
    title: "Desarrollo web con React",
    description: "Diseña interfaces y crea aplicaciones web modernas.",
    level: "Intermedio",
    hours: 32,
    classes: "9 clases",
    price: 229,
    modality: "Virtual",
    icon: "/img/procesador.png",
    artwork: "from-neutral-950 via-indigo-950 to-orange-700",
    category: "DESARROLLO WEB",
  },
  {
    slug: "curso-3",
    title: "Excel para negocios",
    description: "Organiza datos, automatiza tareas y crea reportes claros.",
    level: "Inicial",
    hours: 18,
    classes: "9 clases",
    price: 149,
    modality: "Virtual",
    icon: "/img/icono_crecimiento.png",
    artwork: "from-neutral-950 via-emerald-950 to-yellow-600",
    category: "PRODUCTIVIDAD",
  },
  {
    slug: "curso-4",
    title: "Introducción a ciencia de datos",
    description: "Interpreta datos y presenta hallazgos accionables.",
    level: "Intermedio",
    hours: 36,
    classes: "9 clases",
    price: 249,
    modality: "Virtual",
    icon: "/img/icono_crecimiento.png",
    artwork: "from-slate-950 via-teal-950 to-yellow-600",
    category: "CIENCIA DE DATOS",
  },
  {
    slug: "curso-5",
    title: "Diseño de interfaces digitales",
    description: "Construye experiencias accesibles y sistemas visuales.",
    level: "Inicial",
    hours: 20,
    classes: "9 clases",
    price: 179,
    modality: "Virtual",
    icon: "/img/icono_laptop.png",
    artwork: "from-neutral-950 via-rose-950 to-orange-600",
    category: "DISEÑO DIGITAL",
  },
  {
    slug: "curso-6",
    title: "SQL y bases de datos",
    description: "Consulta, modela y administra datos relacionales.",
    level: "Avanzado",
    hours: 42,
    classes: "9 clases",
    price: 269,
    modality: "Virtual",
    icon: "/img/procesador.png",
    artwork: "from-neutral-950 via-neutral-800 to-orange-600",
    category: "BASES DE DATOS",
  },
];

export function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("Todos los niveles");
  const [maxPrice, setMaxPrice] = useState("Cualquier precio");
  const [duration, setDuration] = useState("Cualquier duración");

  const visibleCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesQuery = `${course.title} ${course.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesLevel =
          level === "Todos los niveles" || course.level === level;
        const matchesPrice =
          maxPrice === "Cualquier precio" || course.price <= Number(maxPrice);
        const matchesDuration =
          duration === "Cualquier duración" ||
          (duration === "Hasta 20 horas"
            ? course.hours <= 20
            : duration === "21 a 40 horas"
              ? course.hours > 20 && course.hours <= 40
              : course.hours > 40);

        return (
          matchesQuery && matchesLevel && matchesPrice && matchesDuration
        );
      }),
    [duration, level, maxPrice, query],
  );

  function clearFilters() {
    setQuery("");
    setLevel("Todos los niveles");
    setMaxPrice("Cualquier precio");
    setDuration("Cualquier duración");
  }

  return (
    <div>
      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_repeat(3,minmax(150px,0.55fr))]">
        <label className="relative block sm:col-span-2 lg:col-span-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por curso o tema"
            aria-label="Buscar cursos"
            className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 pr-3 pl-9 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-3 focus:ring-orange-500/15"
          />
        </label>
        <label className="sr-only" htmlFor="catalog-level">
          Filtrar por nivel
        </label>
        <select
          id="catalog-level"
          aria-label="Filtrar por nivel"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="h-11 min-w-0 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-700 outline-none transition focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15"
        >
          {["Todos los niveles", "Inicial", "Intermedio", "Avanzado"].map(
            (option) => (
              <option key={option}>{option}</option>
            ),
          )}
        </select>
        <label className="sr-only" htmlFor="catalog-price">
          Filtrar por precio máximo
        </label>
        <select
          id="catalog-price"
          aria-label="Filtrar por precio máximo"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          className="h-11 min-w-0 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-700 outline-none transition focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15"
        >
          <option>Cualquier precio</option>
          <option value="180">Hasta S/ 180</option>
          <option value="230">Hasta S/ 230</option>
          <option value="300">Hasta S/ 300</option>
        </select>
        <label className="sr-only" htmlFor="catalog-duration">
          Filtrar por duración
        </label>
        <select
          id="catalog-duration"
          aria-label="Filtrar por duración"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          className="h-11 min-w-0 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-700 outline-none transition focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15"
        >
          {[
            "Cualquier duración",
            "Hasta 20 horas",
            "21 a 40 horas",
            "Más de 40 horas",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-neutral-600">
          <span className="font-semibold text-neutral-950">
            {visibleCourses.length}
          </span>{" "}
          {visibleCourses.length === 1 ? "curso disponible" : "cursos disponibles"}
        </p>
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Limpiar filtros
        </button>
      </div>

      {visibleCourses.length ? (
        <div className="mt-3 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <article
              key={course.slug}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <Link
                href={`/cursos/${course.slug}`}
                aria-label={`Más información sobre ${course.title}`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-orange-600"
              >
                <div
                  className={`relative isolate flex aspect-[1.65/1] items-end overflow-hidden bg-gradient-to-br ${course.artwork} p-5`}
                >
                  <Image
                    src={course.icon}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    draggable={false}
                    className="pointer-events-none select-none object-contain p-8 opacity-90 transition duration-300 group-hover:scale-105 sm:p-10"
                  />
                  <div
                    className="absolute inset-0 -z-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/15 to-neutral-950/10"
                    aria-hidden="true"
                  />
                  <span className="absolute top-4 right-4 rounded-md border border-white/20 bg-neutral-950/55 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    S/ {course.price}
                  </span>
                  <span className="relative z-10">
                    <span className="block text-[10px] font-bold tracking-[0.16em] text-orange-300">
                      {course.category}
                    </span>
                    <span className="mt-1 block text-xl leading-tight font-bold text-white drop-shadow sm:text-2xl">
                      {course.title}
                    </span>
                  </span>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-2 px-4 py-3 text-xs text-neutral-600">
                <span className="flex min-w-0 items-center gap-2">
                  <Users
                    className="size-4 shrink-0 text-orange-600"
                    aria-hidden="true"
                  />
                  {course.classes}
                </span>
                <span className="flex items-center justify-end gap-2">
                  <Monitor
                    className="size-4 shrink-0 text-orange-600"
                    aria-hidden="true"
                  />
                  {course.modality}
                </span>
              </div>
              <Link
                href={`/cursos/${course.slug}`}
                className="mx-4 mb-4 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Más información
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-14 text-center">
          <BookOpen
            className="mx-auto size-7 text-orange-600"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-semibold text-neutral-900">
            No encontramos cursos con esos filtros
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            Prueba con otro nivel, duración o rango de precio.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Ver todos los cursos
          </button>
        </div>
      )}
    </div>
  );
}
