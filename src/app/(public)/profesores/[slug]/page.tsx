import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Star,
  UsersRound,
} from "lucide-react";

const courses = [
  {
    slug: "curso-1",
    title: "Fundamentos de Python",
    description: "De tus primeras líneas de código a proyectos útiles.",
    level: "Inicial",
    students: "1,240 alumnos",
    price: "S/ 189",
    color: "bg-[#fff7ed] text-[#ea580c]",
    mark: "PY",
  },
  {
    slug: "curso-2",
    title: "Desarrollo web con React",
    description: "Construye interfaces completas con herramientas actuales.",
    level: "Intermedio",
    students: "860 alumnos",
    price: "S/ 229",
    color: "bg-[#e7e5e4] text-[#78716c]",
    mark: "RE",
  },
];

export default function ProfesorPerfilPage() {
  return (
    <div className="bg-[#fff7ed] text-[#171717]">
      <section className="border-b border-[#e7e5e4] bg-[#fff7ed]">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <Link href="/cursos" className="text-xs font-semibold text-[#ea580c] hover:text-[#f97316]">
            Cursos <span className="px-1 text-[#78716c]">/</span> Profesores
          </Link>
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid size-24 shrink-0 place-items-center rounded-full border-[5px] border-white bg-[#ea580c] text-2xl font-semibold text-white shadow-sm" aria-label="Foto de Ana María Campos">
                AC
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#44403c]">Profesora destacada</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">Ana María Campos</h1>
                <p className="mt-2 text-sm text-[#44403c]">Ingeniera de software · Docente de programación</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#78716c]"><MapPin className="size-3.5" aria-hidden="true" /> Lima, Perú</p>
              </div>
            </div>
            <Link href="/cursos" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c]">
              Ver sus cursos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Python", "React", "Ciencia de datos", "Desarrollo web"].map((skill) => (
              <span key={skill} className="border border-[#fff7ed] bg-white/70 px-3 py-1.5 text-xs font-medium text-[#44403c]">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_300px]">
        <main className="space-y-10">
          <section>
            <div className="flex items-center gap-2"><BriefcaseBusiness className="size-4 text-[#ea580c]" aria-hidden="true" /><h2 className="text-lg font-semibold text-[#171717]">Sobre la profesora</h2></div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#44403c]">Ayudo a personas que empiezan desde cero a convertir ideas en proyectos reales. Combino fundamentos sólidos, ejercicios guiados y ejemplos de trabajo cotidiano para que cada concepto tenga un uso claro desde la primera clase.</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#44403c]">Durante más de 10 años he trabajado en equipos de producto y acompañado a estudiantes en sus primeros pasos en tecnología. En mis cursos encontrarás explicaciones directas, prácticas progresivas y retroalimentación enfocada en avanzar.</p>
          </section>

          <section>
            <div className="flex items-center gap-2"><BookOpen className="size-4 text-[#ea580c]" aria-hidden="true" /><h2 className="text-lg font-semibold text-[#171717]">Cursos de Ana María</h2></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {courses.map((course) => (
                <Link key={course.slug} href={`/cursos/${course.slug}`} className="group border border-[#e7e5e4] bg-white p-4 transition-colors hover:border-[#a8a29e]">
                  <div className={`grid aspect-[2.1/1] place-items-center ${course.color}`}><span className="text-3xl font-semibold tracking-tight">{course.mark}</span></div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#78716c]">{course.level}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#a27634]"><Star className="size-3.5 fill-current" aria-hidden="true" /> 4.9</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[#171717]">{course.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#78716c]">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#fafaf9] pt-3">
                    <span className="text-[11px] text-[#78716c]">{course.students}</span>
                    <span className="text-sm font-bold text-[#ea580c]">{course.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2"><Award className="size-4 text-[#ea580c]" aria-hidden="true" /><h2 className="text-lg font-semibold text-[#171717]">Formación y certificaciones</h2></div>
            <ul className="mt-4 space-y-3">
              {[
                "Ingeniería de Software · Universidad Nacional de Ingeniería",
                "Professional Certificate in Data Science · IBM",
                "Meta Front-End Developer Professional Certificate",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#44403c]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#ea580c]" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </section>
        </main>

        <aside className="h-fit border border-[#e7e5e4] bg-white p-5">
          <h2 className="text-sm font-semibold text-[#171717]">Experiencia en números</h2>
          <div className="mt-4 divide-y divide-[#fafaf9]">
            <div className="flex items-center justify-between py-3"><span className="flex items-center gap-2 text-xs text-[#78716c]"><BriefcaseBusiness className="size-4" aria-hidden="true" /> Experiencia docente</span><strong className="text-sm text-[#ea580c]">10+ años</strong></div>
            <div className="flex items-center justify-between py-3"><span className="flex items-center gap-2 text-xs text-[#78716c]"><UsersRound className="size-4" aria-hidden="true" /> Alumnos</span><strong className="text-sm text-[#ea580c]">2,100+</strong></div>
            <div className="flex items-center justify-between py-3"><span className="flex items-center gap-2 text-xs text-[#78716c]"><Star className="size-4" aria-hidden="true" /> Valoración media</span><strong className="text-sm text-[#ea580c]">4.9 / 5</strong></div>
          </div>
          <Link href="/cursos" className="mt-4 flex items-center justify-center gap-2 border border-[#e7e5e4] px-4 py-2.5 text-xs font-semibold text-[#ea580c] transition hover:bg-[#fff7ed]">Explorar catálogo <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
        </aside>
      </div>
    </div>
  );
}