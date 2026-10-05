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
    color: "bg-[#e8f0e7] text-[#466d4b]",
    mark: "PY",
  },
  {
    slug: "curso-2",
    title: "Desarrollo web con React",
    description: "Construye interfaces completas con herramientas actuales.",
    level: "Intermedio",
    students: "860 alumnos",
    price: "S/ 229",
    color: "bg-[#e8eef1] text-[#456777]",
    mark: "RE",
  },
];

export default function ProfesorPerfilPage() {
  return (
    <div className="bg-[#f6f8f5] text-[#20352a]">
      <section className="border-b border-[#dfe7df] bg-[#eaf1e9]">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <Link href="/cursos" className="text-xs font-semibold text-[#58705c] hover:text-[#173c2d]">
            Cursos <span className="px-1 text-[#9ca99e]">/</span> Profesores
          </Link>
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid size-24 shrink-0 place-items-center rounded-full border-[5px] border-white bg-[#244d39] text-2xl font-semibold text-white shadow-sm" aria-label="Foto de Ana María Campos">
                AC
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#67806b]">Profesora destacada</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b] sm:text-4xl">Ana María Campos</h1>
                <p className="mt-2 text-sm text-[#65756a]">Ingeniera de software · Docente de programación</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[#7d8b80]"><MapPin className="size-3.5" aria-hidden="true" /> Lima, Perú</p>
              </div>
            </div>
            <Link href="/cursos" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#173c2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24543e]">
              Ver sus cursos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Python", "React", "Ciencia de datos", "Desarrollo web"].map((skill) => (
              <span key={skill} className="border border-[#cddbcf] bg-white/70 px-3 py-1.5 text-xs font-medium text-[#4d6652]">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_300px]">
        <main className="space-y-10">
          <section>
            <div className="flex items-center gap-2"><BriefcaseBusiness className="size-4 text-[#66806b]" aria-hidden="true" /><h2 className="text-lg font-semibold text-[#24402e]">Sobre la profesora</h2></div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#66756b]">Ayudo a personas que empiezan desde cero a convertir ideas en proyectos reales. Combino fundamentos sólidos, ejercicios guiados y ejemplos de trabajo cotidiano para que cada concepto tenga un uso claro desde la primera clase.</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#66756b]">Durante más de 10 años he trabajado en equipos de producto y acompañado a estudiantes en sus primeros pasos en tecnología. En mis cursos encontrarás explicaciones directas, prácticas progresivas y retroalimentación enfocada en avanzar.</p>
          </section>

          <section>
            <div className="flex items-center gap-2"><BookOpen className="size-4 text-[#66806b]" aria-hidden="true" /><h2 className="text-lg font-semibold text-[#24402e]">Cursos de Ana María</h2></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {courses.map((course) => (
                <Link key={course.slug} href={`/cursos/${course.slug}`} className="group border border-[#dfe7df] bg-white p-4 transition-colors hover:border-[#b7cbb9]">
                  <div className={`grid aspect-[2.1/1] place-items-center ${course.color}`}><span className="text-3xl font-semibold tracking-tight">{course.mark}</span></div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a887e]">{course.level}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#a27634]"><Star className="size-3.5 fill-current" aria-hidden="true" /> 4.9</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[#2b4233]">{course.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#7a887e]">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#edf1ed] pt-3">
                    <span className="text-[11px] text-[#7a887e]">{course.students}</span>
                    <span className="text-sm font-bold text-[#31533c]">{course.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2"><Award className="size-4 text-[#66806b]" aria-hidden="true" /><h2 className="text-lg font-semibold text-[#24402e]">Formación y certificaciones</h2></div>
            <ul className="mt-4 space-y-3">
              {[
                "Ingeniería de Software · Universidad Nacional de Ingeniería",
                "Professional Certificate in Data Science · IBM",
                "Meta Front-End Developer Professional Certificate",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#66756b]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#64846a]" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </section>
        </main>

        <aside className="h-fit border border-[#dfe7df] bg-white p-5">
          <h2 className="text-sm font-semibold text-[#294232]">Experiencia en números</h2>
          <div className="mt-4 divide-y divide-[#edf1ed]">
            <div className="flex items-center justify-between py-3"><span className="flex items-center gap-2 text-xs text-[#758178]"><BriefcaseBusiness className="size-4" aria-hidden="true" /> Experiencia docente</span><strong className="text-sm text-[#35533c]">10+ años</strong></div>
            <div className="flex items-center justify-between py-3"><span className="flex items-center gap-2 text-xs text-[#758178]"><UsersRound className="size-4" aria-hidden="true" /> Alumnos</span><strong className="text-sm text-[#35533c]">2,100+</strong></div>
            <div className="flex items-center justify-between py-3"><span className="flex items-center gap-2 text-xs text-[#758178]"><Star className="size-4" aria-hidden="true" /> Valoración media</span><strong className="text-sm text-[#35533c]">4.9 / 5</strong></div>
          </div>
          <Link href="/cursos" className="mt-4 flex items-center justify-center gap-2 border border-[#cdd9cf] px-4 py-2.5 text-xs font-semibold text-[#355b3e] transition hover:bg-[#f5f9f5]">Explorar catálogo <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
        </aside>
      </div>
    </div>
  );
}