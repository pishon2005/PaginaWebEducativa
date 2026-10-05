import { PageHeader } from "@/components/shared/page-header";
import { DemoCourseEditor } from "@/components/forms/demo-course-editor";

export default function NuevoCursoPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Nuevo curso" description="Crea la información y el contenido de una nueva formación" />
      <DemoCourseEditor mode="create" />
    </div>
  );
}