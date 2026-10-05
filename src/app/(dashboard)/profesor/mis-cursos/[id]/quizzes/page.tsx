import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import Link from "next/link";
import { CheckCircle2, Clock3, Plus } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorQuizzesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="evaluaciones"
        description={`Crea evaluaciones y revisa los resultados de ${course.title}.`}
        action={<Link href={`/profesor/mis-cursos/${id}/quizzes/nuevo`} className="inline-flex items-center gap-2 bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]"><Plus className="size-4" aria-hidden="true" /> Nuevo quiz</Link>}
      />

      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e1e8e1] bg-white px-4 py-3"><div><p className="text-sm font-semibold text-[#304637]">Evaluaciones del curso</p><p className="mt-1 text-xs text-[#849087]">{course.title}</p></div><span className="text-xs font-medium text-[#718078]">2 actividades</span></div>
      <div className="space-y-3">{[
        { title: "Variables y tipos de datos", status: "Publicado", attempts: "38 de 54 alumnos", score: "Promedio 16.8/20", icon: CheckCircle2 },
        { title: "Funciones y colecciones", status: "Borrador", attempts: "Aún no disponible", score: "12 min · 1 intento", icon: Clock3 },
      ].map(({ title, status, attempts, score, icon: Icon }) => <article key={title} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dfe7e0] bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#edf4ee] text-[#54765a]"><Icon className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#344a39]">{title}</h2><p className="mt-1 text-xs text-[#849087]">{attempts} · {score}</p></div></div><span className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${status === "Publicado" ? "border-[#d8e7d8] bg-[#f3f8f3] text-[#4e7553]" : "border-[#e6e5da] bg-[#faf9f2] text-[#867a51]"}`}>{status}</span></article>)}</div>
    </div>
  );
}