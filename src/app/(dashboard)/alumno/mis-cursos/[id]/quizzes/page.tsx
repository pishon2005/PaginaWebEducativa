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
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3">
        <div><p className="text-sm font-semibold text-[#171717]">Evaluaciones</p><p className="mt-1 text-xs text-[#78716c]">{course.title}</p></div>
        <span className="text-xs font-medium text-[#44403c]">2 actividades</span>
      </div>
      <div className="space-y-3">
        <article className="flex flex-wrap items-center justify-between gap-4 border border-[#e7e5e4] bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center bg-[#fff7ed] text-[#ea580c]"><CheckCircle2 className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#171717]">Quiz: Variables y tipos de datos</h2><p className="mt-1 text-xs text-[#78716c]">Intento completado · 5 oct 2026</p></div></div><span className="text-sm font-semibold text-[#ea580c]">18/20</span></article>
        <article className="flex flex-wrap items-center justify-between gap-4 border border-[#e7e5e4] bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center bg-[#f5f1e8] text-[#9a7136]"><Clock3 className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#171717]">Quiz: Funciones y colecciones</h2><p className="mt-1 text-xs text-[#78716c]">12 minutos · 1 intento</p></div></div><Link href={`/alumno/mis-cursos/${id}/quizzes/1`} className="inline-flex items-center gap-1.5 bg-[#f97316] px-3 py-2 text-xs font-semibold text-white hover:bg-[#ea580c]">Comenzar <ArrowRight className="size-3.5" aria-hidden="true" /></Link></article>
      </div>
    </div>
  );
}