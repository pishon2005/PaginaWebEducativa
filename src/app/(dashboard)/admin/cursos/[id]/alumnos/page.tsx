import { AdminCourseHeader } from "@/components/shared/admin-course-header";
import { DemoCourseEnrollments } from "@/components/shared/demo-course-enrollments";

export default async function AdminAlumnosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-5">
      <AdminCourseHeader courseId={id} section="alumnos" description="Administra inscripciones y revisa el avance de los participantes." />
      <DemoCourseEnrollments courseId={id} />
    </div>
  );
}