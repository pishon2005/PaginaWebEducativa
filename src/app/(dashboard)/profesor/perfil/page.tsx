import { PageHeader } from "@/components/shared/page-header";
import { DemoProfileForm } from "@/components/forms/demo-profile-form";

export default function ProfesorPerfilPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Mi perfil" description="Actualiza tu información personal y profesional" />
      <DemoProfileForm />
    </div>
  );
}
