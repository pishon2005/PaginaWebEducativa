import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAssignmentsByCourse } from "@/lib/demo-data";

export default async function ProfesorTareaDetallePage({
  params,
}: {
  params: Promise<{ id: string; tareaId: string }>;
}) {
  const { id, tareaId } = await params;
  const course = getDemoCourse(id);
  const assignment = getAssignmentsByCourse(id).find((task) => task.id === Number(tareaId)) ?? getAssignmentsByCourse(id)[0];

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="tareas"
        description={`${course.title} · revisa los detalles y resultados de la actividad.`}
        action={<Link href={`/profesor/mis-cursos/${id}/tareas/${tareaId}/entregas`} className="inline-flex items-center justify-center rounded-md bg-[#f97316] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#ea580c]">Ver entregas</Link>}
      />
      <h2 className="text-lg font-semibold text-[#171717]">{assignment.title}</h2>

      <Card>
        <CardHeader>
          <CardTitle>Descripción de la tarea</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">Los alumnos implementan una función para filtrar una lista y devolver un resumen. La entrega incluye código fuente y casos de prueba.</p>
          <div className="mt-5 grid gap-4 border-t border-[#fafaf9] pt-4 sm:grid-cols-3"><div><p className="text-[10px] uppercase tracking-[0.08em] text-[#78716c]">Fecha límite</p><p className="mt-1 text-xs font-semibold text-[#ea580c]">{assignment.deadline} · 23:59</p></div><div><p className="text-[10px] uppercase tracking-[0.08em] text-[#78716c]">Peso en nota</p><p className="mt-1 text-xs font-semibold text-[#ea580c]">{assignment.weight}%</p></div><div><p className="text-[10px] uppercase tracking-[0.08em] text-[#78716c]">Entregas</p><p className="mt-1 text-xs font-semibold text-[#ea580c]">{assignment.submissions} alumnos</p></div></div>
          <div className="mt-5 border-t border-[#fafaf9] pt-4"><h3 className="text-xs font-semibold text-[#171717]">Rúbrica de evaluación</h3><div className="mt-3 space-y-2 text-xs text-[#44403c]"><div className="flex justify-between"><span>Funcionamiento y casos límite</span><span>10 puntos</span></div><div className="flex justify-between"><span>Claridad y organización</span><span>6 puntos</span></div><div className="flex justify-between"><span>Pruebas y explicación</span><span>4 puntos</span></div></div></div>
        </CardContent>
      </Card>
    </div>
  );
}