import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAssignmentsByCourse } from "@/lib/demo-data";

export default async function ProfesorTareasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const tareasDemo = getAssignmentsByCourse(id);
  const totalSubmissions = tareasDemo.reduce((total, task) => total + task.submissions, 0);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="tareas"
        description="Prepara actividades, revisa plazos y acompaña las entregas."
        action={<Link href={`/profesor/mis-cursos/${id}/tareas/nueva`} className={buttonVariants()}><Plus className="mr-2 h-4 w-4" /> Nueva tarea</Link>}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3">
        <div><p className="text-sm font-semibold text-[#171717]">Actividades del curso</p><p className="mt-1 text-xs text-[#78716c]">{course.title}</p></div>
        <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold text-[#8a6a36]">{totalSubmissions} entregas por revisar</span>
      </div>

      <div className="space-y-3">
        {tareasDemo.map((t) => (
          <Card key={t.id} className="rounded-2xl border-[#e7e5e4]">
            <CardHeader className="flex flex-wrap flex-row items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff7ed] text-[#ea580c]"><Calendar className="size-4" aria-hidden="true" /></div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm text-[#171717]">{t.title}</CardTitle>
                <div className="mt-1 text-xs text-muted-foreground">
                  {t.type} · Entrega: {t.deadline}
                </div>
              </div>
              <Badge variant="secondary">{t.submissions} entregas</Badge>
              <Link
                href={`/profesor/mis-cursos/${id}/tareas/${t.id}`}
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                Ver
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}