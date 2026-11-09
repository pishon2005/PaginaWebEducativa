import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { DemoLessonViewer } from "@/components/shared/demo-lesson-viewer";
import { getUnavailableCourse } from "@/lib/services/unavailable-data";

export default async function AlumnoLessonPage({
  params,
}: {
  params: Promise<{ id: string; claseId: string }>;
}) {
  const { id, claseId } = await params;
  const course = getUnavailableCourse(id);

  return (
    <div className="space-y-5">
      <StudentCourseHeader
        courseId={id}
        section="contenido"
        description={`${course.title} · continúa con tus clases y materiales.`}
      />
      <DemoLessonViewer courseId={id} lessonId={claseId} />
    </div>
  );
}