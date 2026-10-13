import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoForum } from "@/components/shared/demo-forum";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorCursoForoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="foro"
        description={`Modera las conversaciones y publica avisos para el grupo de ${course.title}.`}
      />
      <DemoForum role="profesor" courseName={course.title} />
    </div>
  );
}
