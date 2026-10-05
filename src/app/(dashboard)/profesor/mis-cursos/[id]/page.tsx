import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, UsersRound } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

export default async function ProfesorCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="resumen"
        description="Organiza tus contenidos, acompaña al grupo y revisa lo próximo."
      />

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumen del curso">
        {[
          { label: "Alumnos inscritos", value: course.enrolled, icon: UsersRound },
          { label: "Módulos publicados", value: "3", icon: BookOpen },
          { label: "Entregas por revisar", value: "8", icon: ClipboardCheck },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-[#e1e8e1] bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#718078]">{label}</p>
              <Icon className="size-4 text-[#708d76]" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#20392b]">{value}</p>
          </article>
        ))}
      </section>

      <Card className="rounded-2xl border-[#dfe7e0]">
        <CardHeader>
          <CardTitle>Un vistazo a tu curso</CardTitle>
          <p className="text-xs text-muted-foreground">
            Mantén el contenido organizado y acompaña el progreso de tus alumnos.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Contenido del curso", detail: "Organiza módulos, clases y videos guía.", href: `/profesor/mis-cursos/${id}/contenido`, icon: BookOpen },
            { title: "Entregas pendientes", detail: "Revisa trabajos y comparte comentarios.", href: `/profesor/mis-cursos/${id}/tareas`, icon: ClipboardCheck },
          ].map(({ title, detail, href, icon: Icon }) => (
            <Link key={title} href={href} className="group flex items-center gap-3 rounded-xl border border-[#e7ece7] p-4 transition hover:border-[#bdcebf] hover:bg-[#f8faf8]">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf4ee] text-[#527456]"><Icon className="size-4" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#304637]">{title}</span><span className="mt-1 block text-xs text-[#849087]">{detail}</span></span>
              <ArrowRight className="size-4 shrink-0 text-[#829087] transition group-hover:translate-x-1 group-hover:text-[#376348]" aria-hidden="true" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}