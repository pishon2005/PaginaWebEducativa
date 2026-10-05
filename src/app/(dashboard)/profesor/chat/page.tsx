import { PageHeader } from "@/components/shared/page-header";
import { DemoChat } from "@/components/shared/demo-chat";

export default function ProfesorChatInboxPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Mensajes" description="Atiende consultas y conversaciones de tus cursos" />
      <DemoChat role="profesor" />
    </div>
  );
}