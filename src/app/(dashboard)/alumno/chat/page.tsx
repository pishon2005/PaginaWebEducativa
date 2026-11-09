import { PageHeader } from "@/components/shared/page-header";
import { DemoChat } from "@/components/shared/demo-chat";

export default function AlumnoChatInboxPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Mensajes" description="Conversa en privado con tus profesores asignados o con soporte" />
      <DemoChat role="alumno" />
    </div>
  );
}