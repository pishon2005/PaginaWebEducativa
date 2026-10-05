import Link from "next/link";
import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoTaskBuilder } from "@/components/forms/demo-task-builder";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorNuevaTareaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="tareas" description={`Prepara una actividad para el grupo de ${course.title}.`} action={<Link href={`/profesor/mis-cursos/${id}/tareas`} className="text-xs font-semibold text-[#56715b] hover:text-[#173c2d]">Volver a tareas</Link>} />
      <h2 className="text-lg font-semibold text-[#243d2e]">Nueva tarea</h2>
      <DemoTaskBuilder courseId={id} />
    </div>
  );
}