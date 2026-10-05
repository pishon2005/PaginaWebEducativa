import { PageHeader } from "@/components/shared/page-header";
import { DemoAdminUserEditor } from "@/components/forms/demo-admin-user-editor";

export default async function AdminUsuarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="space-y-5"><PageHeader title={`Usuario #${id}`} description="Edita los datos, el rol y el acceso de la cuenta" /><DemoAdminUserEditor userId={id} /></div>
    </div>
  );
}