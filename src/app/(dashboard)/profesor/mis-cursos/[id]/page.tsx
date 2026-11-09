import { UnavailableFeature } from "@/components/shared/unavailable-feature";

export default async function ProfesorCursoPage({ params: _params }: { params: Promise<{ id: string }> }) {
  return <UnavailableFeature title="Curso pendiente de integración" description="Las entregas, fechas y contenidos aparecerán cuando exista información real del curso." />;
}