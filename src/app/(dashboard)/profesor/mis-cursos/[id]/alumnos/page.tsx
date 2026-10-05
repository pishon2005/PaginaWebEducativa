import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getDemoCourse } from "@/lib/demo-courses";

const alumnosDemo = [
  { id: 1, nombre: "Juan Pérez", email: "juan@email.com", progreso: 65 },
  { id: 2, nombre: "María López", email: "maria@email.com", progreso: 40 },
];

export default async function ProfesorAlumnosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="alumnos" description={`Sigue el avance de quienes participan en ${course.title}.`} />

      <Card className="rounded-2xl border-[#e1e8e1] p-3 sm:p-4">
        <div className="space-y-1">
          {alumnosDemo.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-4 rounded-xl px-3 py-3 odd:bg-[#f7faf7]"
            >
              <Avatar>
                <AvatarFallback>
                  {a.nombre.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{a.nombre}</p>
                <p className="text-xs text-muted-foreground">{a.email}</p>
              </div>
              <div className="w-full sm:ml-auto sm:w-40">
                <Progress value={a.progreso} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}