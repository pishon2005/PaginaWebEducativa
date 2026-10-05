import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoAssignmentSubmission } from "@/components/forms/demo-assignment-submission";
import Link from "next/link";

export default async function AlumnoTareaDetallePage({
  params,
}: {
  params: Promise<{ id: string; tareaId: string }>;
}) {
  const { id, tareaId } = await params;
  const assignmentTitle = `Ejercicio ${tareaId}: Funciones y colecciones`;

  return (
    <div className="space-y-5">
      <StudentCourseHeader
        courseId={id}
        section="tareas"
        description="Revisa las indicaciones y prepara tu entrega."
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#243d2e]">{assignmentTitle}</h2>
        <Link href={`/alumno/mis-cursos/${id}/tareas`} className="text-xs font-semibold text-[#56715b] hover:text-[#173c2d]">Volver a tareas</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">Crea una función que reciba una lista de datos, filtre los elementos válidos y devuelva un resumen. Incluye al menos dos casos de prueba y explica brevemente tu decisión de diseño.</p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-xs text-[#718078]"><li>Entrega un archivo de código y una explicación breve.</li><li>La rúbrica considera funcionamiento, claridad y pruebas.</li><li>Se permite hasta 2 reenvíos antes de la fecha límite.</li></ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tu entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <DemoAssignmentSubmission assignmentTitle={assignmentTitle} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha límite</span>
                <span className="font-medium">07/10/2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso en nota</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reenvíos</span>
                <span className="font-medium">2 restantes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}