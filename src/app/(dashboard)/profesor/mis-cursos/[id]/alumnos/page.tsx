import { UnavailableFeature } from "@/components/shared/unavailable-feature";

export default async function ProfesorAlumnosPage({ params: _params }: { params: Promise<{ id: string }> }) {
  return <UnavailableFeature title="No hay alumnos registrados" description="El progreso estará disponible cuando se conecte el servicio de matrículas." />;
}