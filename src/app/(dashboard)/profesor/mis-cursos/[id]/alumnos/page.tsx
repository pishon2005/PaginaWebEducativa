import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { getDemoCourse } from "@/lib/demo-courses";
import { getDemoCourseContent } from "@/lib/demo-course-content";
import { DemoStudentProgress } from "@/components/shared/demo-student-progress";

const alumnosDemo = [
  { id: 1, nombre: "Juan Pérez", email: "juan@email.com", completedModules: [true, true, false] },
  { id: 2, nombre: "María López", email: "maria@email.com", completedModules: [true, false, false] },
  { id: 3, nombre: "Valeria Rojas", email: "alumno@edukatech.pe", completedModules: [true, true, true] },
  { id: 4, nombre: "Diego Martínez", email: "diego@email.com", completedModules: [false, false, false] },
];

export default async function ProfesorAlumnosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getDemoCourse(id);
  const modules = getDemoCourseContent(id).map((module) => module.title);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader courseId={id} section="alumnos" description={`Sigue el avance de quienes participan en ${course.title}.`} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#171717]">Progreso por módulos</p>
          <p className="mt-1 text-xs text-[#78716c]">Expande a cada alumno para ver qué módulos completó o escríbele directamente.</p>
        </div>
        <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#ea580c]">{alumnosDemo.length} alumnos</span>
      </div>

      <DemoStudentProgress courseId={id} modules={modules} students={alumnosDemo} />
    </div>
  );
}