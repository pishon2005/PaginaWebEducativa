import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDemoCourse } from "@/lib/demo-courses";

const notasDemo = [
  { id: 1, tarea: "Ejercicio 1", nota: 18, peso: 20 },
  { id: 2, tarea: "Ejercicio 2", nota: 15, peso: 20 },
  { id: 3, tarea: "Quiz 1", nota: 20, peso: 10 },
];

export default async function AlumnoNotasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
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

      <Card className="rounded-2xl border-[#dce7dc] bg-[linear-gradient(110deg,#edf4ed,#fff)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">{course.title}</p>
            <p className="mt-2 text-sm text-[#718078]">Promedio actual</p>
            <p className="mt-1 text-3xl font-semibold text-[#20392b]">{promedio.toFixed(2)}<span className="text-base text-[#849087]">/20</span></p>
          </div>
          <Badge variant="default" className="px-3 py-1">Aprobado</Badge>
        </div>
      </Card>

      <Card className="rounded-2xl border-[#e1e8e1] p-3 sm:p-4">
        <div className="space-y-1">
          {notasDemo.map((n) => (
            <div
              key={n.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors odd:bg-[#f7faf7]"
            >
              <span className="text-sm font-medium text-[#304637]">{n.tarea}</span>
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