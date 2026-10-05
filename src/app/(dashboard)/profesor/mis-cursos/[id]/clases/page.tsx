import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoContentManager } from "@/components/shared/demo-content-manager";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorClasesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="contenido" description={`Administra las lecciones y materiales de ${course.title}.`} />
      <DemoContentManager courseId={id} mode="clases" />
    </div>
  );
}