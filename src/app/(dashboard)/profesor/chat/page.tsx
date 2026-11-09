import { PageHeader } from "@/components/shared/page-header";
import { DemoChat } from "@/components/shared/demo-chat";

export default function ProfesorChatInboxPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Mensajes" description="Conversa en privado con tus alumnos inscritos o con administración" />
      <DemoChat role="profesor" />
    </div>
  );
}