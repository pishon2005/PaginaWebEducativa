import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorTareaDetallePage({
  params,
}: {
  params: Promise<{ id: string; tareaId: string }>;
}) {
  const { id, tareaId } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="tareas"
        description={`${course.title} · revisa los detalles y resultados de la actividad.`}
        action={<Link href={`/profesor/mis-cursos/${id}/tareas/${tareaId}/entregas`} className="inline-flex items-center justify-center rounded-md bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]">Ver entregas</Link>}
      />
      <h2 className="text-lg font-semibold text-[#243d2e]">Ejercicio {tareaId}: Funciones y colecciones</h2>

      <Card>
        <CardHeader>
          <CardTitle>Descripción de la tarea</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">Los alumnos implementan una función para filtrar una lista y devolver un resumen. La entrega incluye código fuente y casos de prueba.</p>
          <div className="mt-5 grid gap-4 border-t border-[#edf1ed] pt-4 sm:grid-cols-3"><div><p className="text-[10px] uppercase tracking-[0.08em] text-[#849087]">Fecha límite</p><p className="mt-1 text-xs font-semibold text-[#425748]">7 oct 2026 · 23:59</p></div><div><p className="text-[10px] uppercase tracking-[0.08em] text-[#849087]">Peso en nota</p><p className="mt-1 text-xs font-semibold text-[#425748]">20%</p></div><div><p className="text-[10px] uppercase tracking-[0.08em] text-[#849087]">Entregas</p><p className="mt-1 text-xs font-semibold text-[#425748]">30 alumnos</p></div></div>
          <div className="mt-5 border-t border-[#edf1ed] pt-4"><h3 className="text-xs font-semibold text-[#3b5141]">Rúbrica de evaluación</h3><div className="mt-3 space-y-2 text-xs text-[#6e7d72]"><div className="flex justify-between"><span>Funcionamiento y casos límite</span><span>10 puntos</span></div><div className="flex justify-between"><span>Claridad y organización</span><span>6 puntos</span></div><div className="flex justify-between"><span>Pruebas y explicación</span><span>4 puntos</span></div></div></div>
        </CardContent>
      </Card>
    </div>
  );
}