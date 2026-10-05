import Link from "next/link";
import { ArrowRight, Award, BookOpen, CheckCircle2, Clock3, Star, UsersRound } from "lucide-react";

const courseData: Record<string, { title: string; description: string; price: number; level: string; hours: number; students: string; mark: string }> = {
  "curso-1": { title: "Fundamentos de Python", description: "Aprende lógica de programación y construye tus primeros proyectos con Python, incluso si nunca has escrito código.", price: 189, level: "Inicial", hours: 24, students: "1,240", mark: "PY" },
  "curso-2": { title: "Desarrollo web con React", description: "Diseña y construye interfaces web modernas con componentes, estado y buenas prácticas de desarrollo.", price: 229, level: "Intermedio", hours: 32, students: "860", mark: "RE" },
  "curso-3": { title: "Excel para negocios", description: "Analiza información, automatiza tareas repetitivas y convierte hojas de cálculo en decisiones claras.", price: 149, level: "Inicial", hours: 18, students: "740", mark: "XL" },
  "curso-4": { title: "Introducción a ciencia de datos", description: "Prepara y explora datos para encontrar patrones y comunicar hallazgos útiles.", price: 249, level: "Intermedio", hours: 36, students: "520", mark: "DS" },
  "curso-5": { title: "Diseño de interfaces digitales", description: "Crea experiencias accesibles con fundamentos de diseño visual, prototipado y sistemas de componentes.", price: 179, level: "Inicial", hours: 20, students: "630", mark: "UX" },
  "curso-6": { title: "SQL y bases de datos", description: "Consulta, modela y administra información con SQL y bases relacionales.", price: 269, level: "Avanzado", hours: 42, students: "390", mark: "SQL" },
};

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

  const course = courseData[slug] ?? { title: "Curso de especialización", description: "Aprende con lecciones prácticas, ejercicios guiados y acompañamiento docente.", price: 199, level: "Inicial", hours: 24, students: "320", mark: "AN" };

  return (
    <div className="bg-[#f6f8f5] text-[#20352a]">
      <section className="border-b border-[#dfe7df] bg-[#eaf1e9]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_310px]">
          <div>
            <Link href="/cursos" className="text-xs font-semibold text-[#58705c] hover:text-[#173c2d]">Catálogo <span className="px-1 text-[#9ca99e]">/</span> {course.title}</Link>
            <div className="mt-7 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b806e]"><span>{course.level}</span><span>·</span><span>{course.hours} horas</span><span>·</span><span>Contenido grabado</span></div>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#183a2b] sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65756a]">{course.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#69776d]"><span className="flex items-center gap-1.5 font-semibold text-[#9a7136]"><Star className="size-3.5 fill-current" aria-hidden="true" /> 4.9 <span className="font-normal text-[#849087]">(128 reseñas)</span></span><span className="flex items-center gap-1.5"><UsersRound className="size-3.5" aria-hidden="true" /> {course.students} estudiantes</span><span className="flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" /> Acceso flexible</span></div>
            <p className="mt-6 text-xs text-[#758178]">Creado por <Link href="/profesores/ana-campos" className="font-semibold text-[#42674a] hover:underline">Ana María Campos</Link></p>
          </div>
          <div className="hidden aspect-[1.25/1] place-items-center border border-[#d4e0d4] bg-white/70 lg:grid"><span className="text-6xl font-semibold tracking-tight text-[#527456]">{course.mark}</span></div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 md:py-12 lg:grid-cols-[1fr_310px]">
        <main className="space-y-9">
          <section>
            <h2 className="text-lg font-semibold text-[#24402e]">Lo que aprenderás</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Dominar los conceptos fundamentales paso a paso", "Resolver ejercicios cercanos a situaciones reales", "Construir un proyecto para tu portafolio", "Seguir aprendiendo con una ruta clara"].map((outcome) => <p key={outcome} className="flex gap-2.5 text-sm leading-6 text-[#66756b]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#64846a]" aria-hidden="true" />{outcome}</p>)}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-[#24402e]">Contenido del curso</h2><p className="mt-1 text-xs text-[#849087]">3 módulos · 9 clases · {course.hours} horas</p></div><BookOpen className="size-5 text-[#718b75]" aria-hidden="true" /></div>
            <div className="mt-4 divide-y divide-[#e7ece7] border border-[#dfe7df] bg-white">
              {weeks.map((week, index) => <details key={week.title} className="group px-4 py-3" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#394f3e]"><span>Módulo {index + 1}: {week.title}</span><span className="text-[10px] font-normal text-[#849087]">{week.classes.length} clases</span></summary><ul className="mt-3 space-y-2 border-t border-[#edf1ed] pt-3">{week.classes.map((classTitle, classIndex) => <li key={classTitle} className="flex items-center justify-between gap-3 py-1 text-xs text-[#718078]"><span className="flex items-center gap-2"><span className="grid size-5 place-items-center border border-[#dce6dd] text-[9px] text-[#617965]">{classIndex + 1}</span>{classTitle}</span>{index === 0 && classIndex === 0 ? <Link href="/login" className="text-[10px] font-semibold text-[#507456] hover:underline">Vista previa</Link> : <span className="text-[10px]">Lección</span>}</li>)}</ul></details>)}
            </div>
          </section>

          <section className="border-t border-[#e1e8e1] pt-7">
            <h2 className="text-lg font-semibold text-[#24402e]">Tu profesora</h2>
            <Link href="/profesores/ana-campos" className="mt-4 flex items-center gap-3 border border-[#dfe7df] bg-white p-4 hover:border-[#b7cbb9]"><span className="grid size-12 place-items-center rounded-full bg-[#244d39] text-sm font-semibold text-white">AC</span><span className="flex-1"><span className="block text-sm font-semibold text-[#294132]">Ana María Campos</span><span className="mt-1 block text-xs text-[#7a887e]">Ingeniera de software · 10+ años enseñando</span></span><ArrowRight className="size-4 text-[#64806a]" aria-hidden="true" /></Link>
          </section>
        </main>

        <aside className="h-fit border border-[#dfe7df] bg-white p-5 lg:sticky lg:top-24">
          <div className="grid aspect-[1.8/1] place-items-center bg-[#eaf1e9] text-4xl font-semibold text-[#527456] lg:hidden">{course.mark}</div>
          <p className="mt-5 text-3xl font-semibold text-[#1c3d2c]">S/ {course.price}.00</p>
          <Link href={`/checkout?curso=${slug}`} className="mt-4 flex h-11 items-center justify-center gap-2 bg-[#173c2d] text-sm font-semibold text-white transition hover:bg-[#24543e]">Comprar curso <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <p className="mt-3 text-center text-[10px] text-[#849087]">Pago manual por Yape o Plin</p>
          <div className="mt-5 border-t border-[#edf1ed] pt-4"><p className="text-xs font-semibold text-[#526358]">Este curso incluye</p><ul className="mt-3 space-y-2.5 text-xs text-[#758178]"><li className="flex gap-2"><BookOpen className="size-3.5 text-[#6d8a70]" aria-hidden="true" /> Acceso a todas las lecciones</li><li className="flex gap-2"><Clock3 className="size-3.5 text-[#6d8a70]" aria-hidden="true" /> Aprende a tu ritmo</li><li className="flex gap-2"><Award className="size-3.5 text-[#6d8a70]" aria-hidden="true" /> Certificado al completar</li></ul></div>
        </aside>
      </div>
    </div>
  );
}