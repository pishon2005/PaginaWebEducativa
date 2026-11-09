import { UnavailableFeature } from "@/components/shared/unavailable-feature";
type DemoCourseEditorProps = { mode: "create" | "edit"; courseId?: string };
export function DemoCourseEditor(_props: DemoCourseEditorProps) { return <UnavailableFeature title="Gestión de cursos en integración" />; }