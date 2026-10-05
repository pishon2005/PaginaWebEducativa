import { PageHeader } from "@/components/shared/page-header";
import { AdminUsersManager } from "@/components/shared/admin-users-manager";

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Usuarios" description="Busca, crea y administra cuentas de la institución" />
      <AdminUsersManager />
    </div>
  );
}