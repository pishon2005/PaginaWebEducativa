import { AdminCourseHeader } from "@/components/shared/admin-course-header";
import { DemoContentManager } from "@/components/shared/demo-content-manager";

export default async function AdminSemanasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-5">
      <AdminCourseHeader courseId={id} section="contenido" description="Organiza los módulos y el recorrido de aprendizaje del curso." />
      <DemoContentManager courseId={id} mode="semanas" />
    </div>
  );
}