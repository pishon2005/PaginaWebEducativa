import { PageHeader } from "@/components/shared/page-header";
import { DemoForum } from "@/components/shared/demo-forum";

export default function ProfesorForoPage() {
  return (
    <div>
      <PageHeader title="Foro" description="Publica avisos y modera las consultas de tus alumnos" />
      <DemoForum role="profesor" />
    </div>
  );
}