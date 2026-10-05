import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

const tareasDemo = [
  { id: 1, titulo: "Ejercicio 1 · Funciones y colecciones", limite: "07/10/2026", estado: "pendiente" },
  { id: 2, titulo: "Ejercicio 2 · Automatización", limite: "12/10/2026", estado: "entregado", nota: 18 },
];

export default async function AlumnoTareasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const pendingCount = tareasDemo.filter((task) => task.estado === "pendiente").length;

  return (
    <div className="space-y-5">
      <StudentCourseHeader
        courseId={id}
        section="tareas"
        description="Organiza tus entregas y revisa las fechas importantes."
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e1e8e1] bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#304637]">Tus actividades</p>
          <p className="mt-1 text-xs text-[#849087]">{course.title}</p>
        </div>
        <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#8a6a36]">
          {pendingCount} {pendingCount === 1 ? "pendiente" : "pendientes"}
        </span>
      </div>
      <div className="space-y-3">
        {tareasDemo.map((t) => (
          <Card key={t.id} className="rounded-2xl border-[#e1e8e1]">
            <CardHeader className="flex flex-wrap flex-row items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#527456]">
                <Calendar className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm text-[#304637]">{t.titulo}</CardTitle>
                <div className="mt-1 text-xs text-muted-foreground">
                  Entrega: {t.limite}
                </div>
              </div>
              {t.nota !== undefined && (
                <Badge variant="outline">Nota: {t.nota}/20</Badge>
              )}
              <Badge
                className="capitalize"
                variant={t.estado === "entregado" ? "default" : "secondary"}
              >
                {t.estado}
              </Badge>
              <Link
                href={`/alumno/mis-cursos/${id}/tareas/${t.id}`}
                className={buttonVariants({ size: "sm" })}
              >
                {t.estado === "entregado" ? "Ver entrega" : "Entregar"}
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}