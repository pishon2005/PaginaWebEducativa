import { PageHeader } from "@/components/shared/page-header";
import { DemoSiteSettings } from "@/components/forms/demo-site-settings";

export default function AdminConfiguracionPage() {
  return (
    <div>
      <div className="space-y-5"><PageHeader title="Configuración" description="Personaliza el nombre, la identidad visual y el contacto del sitio" /><DemoSiteSettings /></div>
    </div>
  );
}