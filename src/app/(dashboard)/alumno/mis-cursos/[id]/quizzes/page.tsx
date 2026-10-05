import Link from "next/link";
import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function AlumnoQuizzesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <StudentCourseHeader courseId={id} section="evaluaciones" description="Revisa tus resultados y prepárate para el siguiente reto." />
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e1e8e1] bg-white px-4 py-3">
        <div><p className="text-sm font-semibold text-[#304637]">Evaluaciones</p><p className="mt-1 text-xs text-[#849087]">{course.title}</p></div>
        <span className="text-xs font-medium text-[#718078]">2 actividades</span>
      </div>
      <div className="space-y-3">
        <article className="flex flex-wrap items-center justify-between gap-4 border border-[#dfe7e0] bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center bg-[#edf4ee] text-[#54765a]"><CheckCircle2 className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#344a39]">Quiz: Variables y tipos de datos</h2><p className="mt-1 text-xs text-[#849087]">Intento completado · 5 oct 2026</p></div></div><span className="text-sm font-semibold text-[#4b7351]">18/20</span></article>
        <article className="flex flex-wrap items-center justify-between gap-4 border border-[#dfe7e0] bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center bg-[#f5f1e8] text-[#9a7136]"><Clock3 className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#344a39]">Quiz: Funciones y colecciones</h2><p className="mt-1 text-xs text-[#849087]">12 minutos · 1 intento</p></div></div><Link href={`/alumno/mis-cursos/${id}/quizzes/1`} className="inline-flex items-center gap-1.5 bg-[#173c2d] px-3 py-2 text-xs font-semibold text-white hover:bg-[#24543e]">Comenzar <ArrowRight className="size-3.5" aria-hidden="true" /></Link></article>
      </div>
    </div>
  );
}