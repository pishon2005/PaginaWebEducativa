import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { DemoForum } from "@/components/shared/demo-forum";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function AlumnoForoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <StudentCourseHeader courseId={id} section="foro" description="Resuelve dudas y construye ideas junto a tus compañeros." />
      <DemoForum role="alumno" courseName={course.title} />
    </div>
  );
}