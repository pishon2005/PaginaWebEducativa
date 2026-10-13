import Link from "next/link";
import { ArrowRight, Award, BookOpen, CheckCircle2, Clock3, Star, UsersRound } from "lucide-react";

import { getCourseBySlug } from "@/lib/demo-data";

const weeks = [
  { title: "Primeros pasos", classes: ["Bienvenida y entorno de trabajo", "Variables y tipos de datos", "Tu primer programa"] },
  { title: "Decisiones y repetición", classes: ["Condicionales en la práctica", "Bucles y colecciones", "Reto: automatiza una tarea"] },
  { title: "Funciones y proyecto", classes: ["Funciones reutilizables", "Organización del código", "Proyecto final guiado"] },
];

export default async function CursoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = getCourseBySlug(slug);

  return (
    <div className="bg-[#fff7ed] text-[#171717]">
      <section className="border-b border-[#e7e5e4] bg-[#fff7ed]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_310px]">
          <div>
            <Link href="/cursos" className="text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">Catálogo <span className="px-1 text-[#78716c]">/</span> {course.title}</Link>
            <div className="mt-7 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#44403c]"><span>{course.level}</span><span>·</span><span>{course.hours} horas</span><span>·</span><span>Contenido grabado</span></div>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#44403c]">{course.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#44403c]"><span className="flex items-center gap-1.5 font-semibold text-[#9a7136]"><Star className="size-3.5 fill-current" aria-hidden="true" /> 4.9 <span className="font-normal text-[#78716c]">(128 reseñas)</span></span><span className="flex items-center gap-1.5"><UsersRound className="size-3.5" aria-hidden="true" /> {course.students} estudiantes</span><span className="flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" /> Acceso flexible</span></div>
            <p className="mt-6 text-xs text-[#78716c]">Creado por <Link href="/profesores/ana-campos" className="font-semibold text-[#ea580c] hover:underline">Ana María Campos</Link></p>
          </div>
          <div className="hidden aspect-[1.25/1] place-items-center border border-[#fff7ed] bg-white/70 lg:grid"><span className="text-6xl font-semibold tracking-tight text-[#ea580c]">{course.mark}</span></div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 md:py-12 lg:grid-cols-[1fr_310px]">
        <main className="space-y-9">
          <section>
            <h2 className="text-lg font-semibold text-[#171717]">Lo que aprenderás</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Dominar los conceptos fundamentales paso a paso", "Resolver ejercicios cercanos a situaciones reales", "Construir un proyecto para tu portafolio", "Seguir aprendiendo con una ruta clara"].map((outcome) => <p key={outcome} className="flex gap-2.5 text-sm leading-6 text-[#44403c]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#ea580c]" aria-hidden="true" />{outcome}</p>)}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-[#171717]">Contenido del curso</h2><p className="mt-1 text-xs text-[#78716c]">3 módulos · 9 clases · {course.hours} horas</p></div><BookOpen className="size-5 text-[#44403c]" aria-hidden="true" /></div>
            <div className="mt-4 divide-y divide-[#e7e5e4] border border-[#e7e5e4] bg-white">
              {weeks.map((week, index) => <details key={week.title} className="group px-4 py-3" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#ea580c]"><span>Módulo {index + 1}: {week.title}</span><span className="text-[10px] font-normal text-[#78716c]">{week.classes.length} clases</span></summary><ul className="mt-3 space-y-2 border-t border-[#fafaf9] pt-3">{week.classes.map((classTitle, classIndex) => <li key={classTitle} className="flex items-center justify-between gap-3 py-1 text-xs text-[#44403c]"><span className="flex items-center gap-2"><span className="grid size-5 place-items-center border border-[#fff7ed] text-[9px] text-[#ea580c]">{classIndex + 1}</span>{classTitle}</span>{index === 0 && classIndex === 0 ? <Link href="/login" className="text-[10px] font-semibold text-[#ea580c] hover:underline">Vista previa</Link> : <span className="text-[10px]">Lección</span>}</li>)}</ul></details>)}
            </div>
          </section>

          <section className="border-t border-[#e7e5e4] pt-7">
            <h2 className="text-lg font-semibold text-[#171717]">Tu profesora</h2>
            <Link href="/profesores/ana-campos" className="mt-4 flex items-center gap-3 border border-[#e7e5e4] bg-white p-4 hover:border-[#a8a29e]"><span className="grid size-12 place-items-center rounded-full bg-[#ea580c] text-sm font-semibold text-white">AC</span><span className="flex-1"><span className="block text-sm font-semibold text-[#171717]">Ana María Campos</span><span className="mt-1 block text-xs text-[#78716c]">Ingeniera de software · 10+ años enseñando</span></span><ArrowRight className="size-4 text-[#ea580c]" aria-hidden="true" /></Link>
          </section>
        </main>

        <aside className="h-fit border border-[#e7e5e4] bg-white p-5 lg:sticky lg:top-24">
          <div className="grid aspect-[1.8/1] place-items-center bg-[#fff7ed] text-4xl font-semibold text-[#ea580c] lg:hidden">{course.mark}</div>
          <p className="mt-5 text-3xl font-semibold text-[#171717]">S/ {course.price}.00</p>
          <Link href={`/checkout?curso=${slug}`} className="mt-4 flex h-11 items-center justify-center gap-2 bg-[#f97316] text-sm font-semibold text-white transition hover:bg-[#ea580c]">Comprar curso <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <p className="mt-3 text-center text-[10px] text-[#78716c]">Pago manual por Yape o Plin</p>
          <div className="mt-5 border-t border-[#fafaf9] pt-4"><p className="text-xs font-semibold text-[#ea580c]">Este curso incluye</p><ul className="mt-3 space-y-2.5 text-xs text-[#78716c]"><li className="flex gap-2"><BookOpen className="size-3.5 text-[#ea580c]" aria-hidden="true" /> Acceso a todas las lecciones</li><li className="flex gap-2"><Clock3 className="size-3.5 text-[#ea580c]" aria-hidden="true" /> Aprende a tu ritmo</li><li className="flex gap-2"><Award className="size-3.5 text-[#ea580c]" aria-hidden="true" /> Certificado al completar</li></ul></div>
        </aside>
      </div>
    </div>
  );
}