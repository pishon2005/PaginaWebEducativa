import { UnavailableFeature } from "@/components/shared/unavailable-feature";
type DemoStudentProgressProps = { courseId: string; modules: unknown[]; students: unknown[] };
export function DemoStudentProgress(_props: DemoStudentProgressProps) { return <UnavailableFeature title="No hay progreso disponible" />; }