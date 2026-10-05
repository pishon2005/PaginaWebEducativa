"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, Code2, Database, Palette, Search, Star, Table2 } from "lucide-react";

const courses = [
  { slug: "curso-1", title: "Fundamentos de Python", description: "Aprende a programar con proyectos guiados desde cero.", level: "Inicial", hours: 24, price: 189, students: "1,240", icon: Code2, tint: "bg-[#eaf1e9] text-[#42674a]", mark: "PY" },
  { slug: "curso-2", title: "Desarrollo web con React", description: "Diseña interfaces y crea aplicaciones web modernas.", level: "Intermedio", hours: 32, price: 229, students: "860", icon: Code2, tint: "bg-[#e9eff2] text-[#456a7a]", mark: "RE" },
  { slug: "curso-3", title: "Excel para negocios", description: "Organiza datos, automatiza tareas y crea reportes claros.", level: "Inicial", hours: 18, price: 149, students: "740", icon: Table2, tint: "bg-[#eef2e7] text-[#627344]", mark: "XL" },
  { slug: "curso-4", title: "Introducción a ciencia de datos", description: "Interpreta datos y presenta hallazgos accionables.", level: "Intermedio", hours: 36, price: 249, students: "520", icon: BarChart3, tint: "bg-[#f4eee3] text-[#937042]", mark: "DS" },
  { slug: "curso-5", title: "Diseño de interfaces digitales", description: "Construye experiencias accesibles y sistemas visuales.", level: "Inicial", hours: 20, price: 179, students: "630", icon: Palette, tint: "bg-[#f1eae5] text-[#8b5f45]", mark: "UX" },
  { slug: "curso-6", title: "SQL y bases de datos", description: "Consulta, modela y administra datos relacionales.", level: "Avanzado", hours: 42, price: 269, students: "390", icon: Database, tint: "bg-[#e8edf0] text-[#526c7c]", mark: "SQL" },
];

export function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("Todos los niveles");
  const [maxPrice, setMaxPrice] = useState("Cualquier precio");
  const [duration, setDuration] = useState("Cualquier duración");

  const visibleCourses = useMemo(() => courses.filter((course) => {
    const matchesQuery = `${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesLevel = level === "Todos los niveles" || course.level === level;
    const matchesPrice = maxPrice === "Cualquier precio" || course.price <= Number(maxPrice);
    const matchesDuration = duration === "Cualquier duración" || (duration === "Hasta 20 horas" ? course.hours <= 20 : duration === "21 a 40 horas" ? course.hours > 20 && course.hours <= 40 : course.hours > 40);
    return matchesQuery && matchesLevel && matchesPrice && matchesDuration;
  }), [duration, level, maxPrice, query]);

  function clearFilters() {
    setQuery("");
    setLevel("Todos los niveles");
    setMaxPrice("Cualquier precio");
    setDuration("Cualquier duración");
  }

  return (
    <div>
      <div className="grid gap-3 border border-[#dfe7df] bg-white p-4 md:grid-cols-[1fr_repeat(3,minmax(150px,0.55fr))]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#859188]" aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por curso o tema" aria-label="Buscar cursos" className="h-10 w-full border border-[#dfe7df] pl-9 pr-3 text-sm outline-none focus:border-[#78967c]" />
        </label>
        <select aria-label="Filtrar por nivel" value={level} onChange={(event) => setLevel(event.target.value)} className="h-10 border border-[#dfe7df] bg-white px-3 text-xs text-[#526358] outline-none focus:border-[#78967c]">
          {["Todos los niveles", "Inicial", "Intermedio", "Avanzado"].map((option) => <option key={option}>{option}</option>)}
        </select>
        <select aria-label="Filtrar por precio máximo" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-10 border border-[#dfe7df] bg-white px-3 text-xs text-[#526358] outline-none focus:border-[#78967c]">
          <option>Cualquier precio</option><option value="180">Hasta S/ 180</option><option value="230">Hasta S/ 230</option><option value="300">Hasta S/ 300</option>
        </select>
        <select aria-label="Filtrar por duración" value={duration} onChange={(event) => setDuration(event.target.value)} className="h-10 border border-[#dfe7df] bg-white px-3 text-xs text-[#526358] outline-none focus:border-[#78967c]">
          {["Cualquier duración", "Hasta 20 horas", "21 a 40 horas", "Más de 40 horas"].map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-[#7c8980]">{visibleCourses.length} cursos disponibles</p>
        <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#56715b] hover:text-[#173c2d]">Limpiar filtros</button>
      </div>

      {visibleCourses.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => {
            const Icon = course.icon;
            return (
              <Link key={course.slug} href={`/cursos/${course.slug}`} className="group border border-[#dfe7df] bg-white p-4 transition-colors hover:border-[#b7cbb9]">
                <div className={`relative grid aspect-[2.05/1] place-items-center ${course.tint}`}><Icon className="absolute right-4 top-4 size-5 opacity-70" aria-hidden="true" /><span className="text-3xl font-semibold tracking-tight">{course.mark}</span></div>
                <div className="mt-4 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#78867d]">{course.level} · {course.hours} horas</span><span className="flex items-center gap-1 text-xs font-semibold text-[#9a7136]"><Star className="size-3.5 fill-current" aria-hidden="true" /> 4.9</span></div>
                <h2 className="mt-2 text-base font-semibold text-[#294132] group-hover:text-[#356142]">{course.title}</h2>
                <p className="mt-1 min-h-10 text-xs leading-5 text-[#7a887e]">{course.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-[#edf1ed] pt-3"><span className="flex items-center gap-1.5 text-[10px] text-[#829087]"><BookOpen className="size-3.5" aria-hidden="true" /> {course.students} alumnos</span><span className="text-sm font-bold text-[#31533c]">S/ {course.price}</span></div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 border border-dashed border-[#d9e2d9] bg-white px-5 py-14 text-center"><BookOpen className="mx-auto size-6 text-[#809183]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-[#3f5645]">No encontramos cursos con esos filtros</p><p className="mt-1 text-xs text-[#829087]">Prueba con otro nivel, duración o rango de precio.</p><button type="button" onClick={clearFilters} className="mt-4 text-xs font-semibold text-[#4c7052]">Ver todos los cursos</button></div>
      )}
    </div>
  );
}