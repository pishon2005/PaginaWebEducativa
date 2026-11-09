import { UnavailableFeature } from "@/components/shared/unavailable-feature";
type DemoContentManagerProps = { courseId: string; mode: string };
export function DemoContentManager(_props: DemoContentManagerProps) { return <UnavailableFeature title="No hay contenidos disponibles" />; }