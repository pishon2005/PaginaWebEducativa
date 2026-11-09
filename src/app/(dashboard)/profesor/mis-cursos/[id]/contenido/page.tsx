import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoCourseContentStudio } from "@/components/shared/demo-course-content-studio";
import { getUnavailableCourse } from "@/lib/services/unavailable-data";

export default async function ProfesorContenidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getUnavailableCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="contenido"
        description={`Diseña el recorrido, las clases y los recursos de ${course.title}.`}
      />
      <DemoCourseContentStudio courseId={id} />
    </div>
  );
}
