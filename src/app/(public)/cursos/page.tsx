import { CourseCatalog } from "@/components/shared/course-catalog";

export default function CursosPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d836f]">Aprendizaje práctico</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1e3c2c]">Catálogo de cursos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#738077]">Encuentra formación guiada por especialistas y avanza a tu propio ritmo.</p>
      </div>
      <CourseCatalog />
    </div>
  );
}