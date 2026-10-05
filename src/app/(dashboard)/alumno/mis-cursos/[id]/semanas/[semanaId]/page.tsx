import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getDemoCourse } from "@/lib/demo-courses";
import { getDemoCourseContent } from "@/lib/demo-course-content";

export default async function AlumnoSemanaPage({
  params,
}: {
  params: Promise<{ id: string; semanaId: string }>;
}) {
  const { id, semanaId } = await params;
  const course = getDemoCourse(id);
  const modules = getDemoCourseContent(id);
  const moduleIndex = Math.max(0, Math.min(modules.length - 1, Number(semanaId) - 1 || 0));
  const currentModule = modules[moduleIndex];
  const firstLessonIndex = modules.slice(0, moduleIndex).reduce((count, item) => count + item.lessons.length, 0);

  return (
    <div className="space-y-5">
      <StudentCourseHeader
        courseId={id}
        section="contenido"
        description={`${course.title} · avanza con las clases y materiales del módulo.`}
      />
      <div className="rounded-xl border border-[#e1e8e1] bg-white px-4 py-3">
        <p className="text-sm font-semibold text-[#304637]">Módulo {moduleIndex + 1} · {currentModule.title}</p>
        <p className="mt-1 text-xs text-[#849087]">{currentModule.lessons.length} clases · videos guía y materiales de aprendizaje</p>
      </div>

      <div className="space-y-3">
        {currentModule.lessons.map((lesson, index) => (
          <Card key={lesson.title} className="rounded-2xl border-[#e1e8e1]">
            <CardHeader className="flex flex-row items-center gap-3">
              {(moduleIndex === 0 || (moduleIndex === 1 && index < 2)) ? (
                <CheckCircle2 className="size-5 shrink-0 text-green-600" aria-hidden="true" />
              ) : (
                <Play className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <CardTitle className="flex-1 text-base">
                Clase {index + 1}: {lesson.title}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {lesson.duration} min
              </span>
              <Link href={`/alumno/mis-cursos/${id}/clases/${firstLessonIndex + index + 1}`} className="border border-[#cdd9cf] px-3 py-2 text-xs font-semibold text-[#4f6e54] hover:bg-[#f4f8f4]">
                Abrir clase
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lesson.hasVideo && <Badge variant="secondary"><Play className="mr-1 size-3" aria-hidden="true" /> Video guía</Badge>}
                <Badge variant="secondary">
                  <FileText className="mr-1 h-3 w-3" /> {lesson.material}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}