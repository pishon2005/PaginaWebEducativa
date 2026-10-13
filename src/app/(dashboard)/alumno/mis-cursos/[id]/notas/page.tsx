import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAssignmentsByCourse, getQuizzesByCourse } from "@/lib/demo-data";

export default async function AlumnoNotasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const notasDemo = [
    ...getAssignmentsByCourse(id)
      .filter((assignment) => assignment.grade !== undefined)
      .map((assignment) => ({ id: `t-${assignment.id}`, tarea: assignment.title, nota: assignment.grade ?? 0, peso: assignment.weight })),
    ...getQuizzesByCourse(id)
      .filter((quiz) => quiz.status === "Publicado")
      .map((quiz) => ({ id: `q-${quiz.id}`, tarea: `Quiz · ${quiz.title}`, nota: 18, peso: 10 })),
  ];
  const promedio =
    notasDemo.reduce((acc, n) => acc + n.nota * (n.peso / 100), 0) /
    notasDemo.reduce((acc, n) => acc + n.peso / 100, 0);

  return (
    <div className="space-y-5">
      <StudentCourseHeader
        courseId={id}
        section="notas"
        description="Consulta tus resultados y sigue de cerca tu avance."
      />

      <Card className="rounded-2xl border-[#fff7ed] bg-[linear-gradient(110deg,#fff7ed,#fff)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#44403c]">{course.title}</p>
            <p className="mt-2 text-sm text-[#44403c]">Promedio actual</p>
            <p className="mt-1 text-3xl font-semibold text-[#171717]">{promedio.toFixed(2)}<span className="text-base text-[#78716c]">/20</span></p>
          </div>
          <Badge variant="default" className="px-3 py-1">Aprobado</Badge>
        </div>
      </Card>

      <Card className="rounded-2xl border-[#e7e5e4] p-3 sm:p-4">
        <div className="space-y-1">
          {notasDemo.map((n) => (
            <div
              key={n.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors odd:bg-[#fff7ed]"
            >
              <span className="text-sm font-medium text-[#171717]">{n.tarea}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Peso: {n.peso}%
                </span>
                <span className="font-bold">{n.nota}/20</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}