import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { DemoChat } from "@/components/shared/demo-chat";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorCursoChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="mensajes" description={`Responde preguntas y acompaña a tu grupo de ${course.title}.`} />
      <DemoChat role="profesor" courseName={course.title} />
    </div>
  );
}