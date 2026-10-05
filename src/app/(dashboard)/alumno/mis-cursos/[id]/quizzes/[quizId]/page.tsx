import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { DemoQuiz } from "@/components/forms/demo-quiz";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function AlumnoQuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id, quizId } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <StudentCourseHeader courseId={id} section="evaluaciones" description={`Evaluación de ${course.title} · responde con calma y revisa tus respuestas.`} />
      <h2 className="text-lg font-semibold text-[#243d2e]">{quizId === "1" ? "Funciones y colecciones" : `Evaluación ${quizId}`}</h2>
      <DemoQuiz courseId={id} />
    </div>
  );
}