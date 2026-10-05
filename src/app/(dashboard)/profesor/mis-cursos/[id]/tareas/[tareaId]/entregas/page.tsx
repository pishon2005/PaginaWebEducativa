import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoGradingQueue } from "@/components/shared/demo-grading-queue";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorEntregasPage({
  params,
}: {
  params: Promise<{ id: string; tareaId: string }>;
}) {
  const { id, tareaId } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="tareas" description={`Revisa las entregas del Ejercicio ${tareaId} de ${course.title}.`} />
      <DemoGradingQueue />
    </div>
  );
}