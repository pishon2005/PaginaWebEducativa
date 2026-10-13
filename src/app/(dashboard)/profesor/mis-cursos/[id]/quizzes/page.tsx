import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { CheckCircle2, Clock3 } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { getQuizzesByCourse } from "@/lib/demo-data";
import { DemoCreateSection } from "@/components/shared/demo-create-section";
import { DemoQuizBuilder } from "@/components/forms/demo-quiz-builder";

export default async function ProfesorQuizzesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const quizzes = getQuizzesByCourse(id);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={id}
        section="evaluaciones"
        description={`Crea evaluaciones y revisa los resultados de ${course.title}.`}
      />

      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3"><div><p className="text-sm font-semibold text-[#171717]">Evaluaciones del curso</p><p className="mt-1 text-xs text-[#78716c]">{course.title}</p></div><span className="text-xs font-medium text-[#44403c]">{quizzes.length} actividades</span></div>
      <div className="space-y-3">{quizzes.map(({ title, status, attempts, score }) => { const Icon = status === "Publicado" ? CheckCircle2 : Clock3; return <article key={title} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e7e5e4] bg-white p-4"><div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#fff7ed] text-[#ea580c]"><Icon className="size-4" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold text-[#171717]">{title}</h2><p className="mt-1 text-xs text-[#78716c]">{attempts} · {score}</p></div></div><span className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${status === "Publicado" ? "border-[#fff7ed] bg-[#fff7ed] text-[#ea580c]" : "border-[#e6e5da] bg-[#faf9f2] text-[#867a51]"}`}>{status}</span></article>})}</div>

            <DemoCreateSection label="Nuevo quiz">
              <DemoQuizBuilder courseId={id} />
            </DemoCreateSection>
          </div>
        );
      }