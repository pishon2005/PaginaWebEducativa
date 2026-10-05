import Link from "next/link";
import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoQuizBuilder } from "@/components/forms/demo-quiz-builder";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorNuevoQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="evaluaciones" description={`Prepara una evaluación para el grupo de ${course.title}.`} action={<Link href={`/profesor/mis-cursos/${id}/quizzes`} className="text-xs font-semibold text-[#56715b] hover:text-[#173c2d]">Volver a evaluaciones</Link>} />
      <h2 className="text-lg font-semibold text-[#243d2e]">Nuevo quiz</h2>
      <DemoQuizBuilder courseId={id} />
    </div>
  );
}