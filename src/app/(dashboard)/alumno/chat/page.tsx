import { PageHeader } from "@/components/shared/page-header";
import { DemoChat } from "@/components/shared/demo-chat";

export default function AlumnoChatInboxPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Mensajes" description="Conversa con tus profesores y compañeros de curso" />
      <DemoChat role="alumno" />
    </div>
  );
}