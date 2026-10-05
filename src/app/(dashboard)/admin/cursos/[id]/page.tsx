import { AdminCourseHeader } from "@/components/shared/admin-course-header";
import { DemoCourseEditor } from "@/components/forms/demo-course-editor";

export default async function AdminCursoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-5">
      <AdminCourseHeader courseId={id} section="informacion" description="Edita los datos generales y la presentación del curso." />
      <DemoCourseEditor mode="edit" courseId={id} />
    </div>
  );
}