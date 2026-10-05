import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { DemoChat } from "@/components/shared/demo-chat";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function AlumnoChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <StudentCourseHeader courseId={id} section="chat" description="Comparte preguntas y conversa con tu comunidad de aprendizaje." />
      <DemoChat role="alumno" courseName={course.title} />
    </div>
  );
}