import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getDemoCourseContent } from "@/lib/demo-course-content";

export default async function AlumnoCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const courseModules = getDemoCourseContent(id);

  return (
    <div>
      <StudentCourseHeader
        courseId={id}
        section="contenido"
        description="Retoma tu recorrido y avanza a tu propio ritmo."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-[1.35fr_1fr]">
        <Card className="justify-center bg-[#173c2d] text-white ring-0">
          <CardContent className="py-5 sm:py-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-white/70">Tu avance</p>
                <p className="mt-1 text-3xl font-semibold">{course.progress}%</p>
              </div>
              <p className="pb-1 text-right text-xs text-white/75">
                Un paso más cada día
              </p>
            </div>
            <Progress
              value={course.progress}
              className="mt-4 bg-white/20 [&>div]:bg-[#b9d4ad]"
            />
          </CardContent>
        </Card>
        <Card className="justify-center">
          <CardContent className="grid grid-cols-2 gap-4 py-5 sm:py-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#849087]">
                Duración
              </p>
              <p className="mt-1 text-sm font-semibold text-[#304637]">
                {course.duration}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#849087]">
                Comunidad
              </p>
              <p className="mt-1 text-sm font-semibold text-[#304637]">
                {course.students} estudiantes
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="contenido">
        <TabsList>
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>
        <TabsContent value="contenido">
          <Card>
            <CardHeader>
              <CardTitle>Tu recorrido de aprendizaje</CardTitle>
              <p className="text-xs text-muted-foreground">
                Explora los módulos y continúa desde la próxima clase.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {courseModules.map((module, weekIndex) => (
                <details key={module.title} className="rounded-xl border border-[#e5ebe5] bg-white" open={weekIndex === 1}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[#344a39]"><span>Módulo {weekIndex + 1} · {module.title}</span><span className="text-[10px] font-medium text-[#7e8b81]">{weekIndex === 0 ? module.lessons.length : weekIndex === 1 ? `${Math.max(0, module.lessons.length - 1)} de ${module.lessons.length}` : `0 de ${module.lessons.length}`} clases</span></summary>
                  <ul className="divide-y divide-[#edf1ed] border-t border-[#e8ede8] px-4">
                    {module.lessons.map((lesson, classIndex) => {
                      const completed = weekIndex === 0 || (weekIndex === 1 && classIndex < 2);
                      const lessonId = courseModules.slice(0, weekIndex).reduce((count, previousModule) => count + previousModule.lessons.length, classIndex + 1);
                      return (
                        <li key={lesson.title} className="flex flex-wrap items-center gap-3 py-3 text-xs">
                          <span className="flex min-w-[180px] flex-1 items-center gap-2.5 text-[#5c6d61]">
                            {completed ? <CheckCircle2 className="size-4 shrink-0 text-[#64846a]" aria-hidden="true" /> : <CirclePlay className="size-4 shrink-0 text-[#829087]" aria-hidden="true" />}
                            <span>
                              {lesson.title}
                              <span className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#89958d]">
                                <span>{lesson.duration} min</span><span>·</span>
                                <span>{lesson.hasVideo ? "Video guía" : "Lección"}</span><span>·</span>
                                <span>{lesson.material}</span>
                              </span>
                            </span>
                          </span>
                          <span className="text-[10px] text-[#87938a]">{completed ? "Completada" : "Pendiente"}</span>
                          <Link href={`/alumno/mis-cursos/${id}/clases/${lessonId}`} className="text-[10px] font-semibold text-[#527456] hover:underline">{completed ? "Repasar clase" : "Abrir clase"}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Información del curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Aprende con clases grabadas, ejercicios guiados y actividades para practicar cada concepto.</p>
                <p>Docente: {course.instructor} · {course.duration} · Certificado disponible al completar el curso.</p>
                <Link href="/profesores/ana-campos" className="inline-block text-xs font-semibold text-[#527456] hover:underline">Conoce a tu docente</Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}