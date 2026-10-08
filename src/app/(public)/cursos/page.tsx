import { CourseCatalog } from "@/components/shared/course-catalog";

export default function CursosPage() {
  return (
    <div className="min-h-full bg-neutral-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
            Formación tecnológica práctica
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Encuentra tu próximo proyecto
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Explora cursos de programación y tecnología, filtra por nivel,
            duración o precio y aprende construyendo.
          </p>
        </div>
        <CourseCatalog />
      </div>
    </div>
  );
}