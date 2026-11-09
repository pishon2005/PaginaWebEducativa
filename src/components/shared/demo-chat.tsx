import { UnavailableFeature } from "@/components/shared/unavailable-feature";
type DemoChatProps = { role: "alumno" | "profesor"; courseName?: string };
export function DemoChat({ role: _role, courseName: _courseName }: DemoChatProps) { return <UnavailableFeature title="No hay conversaciones" description="El chat estará disponible cuando se conecte Supabase Realtime." />; }