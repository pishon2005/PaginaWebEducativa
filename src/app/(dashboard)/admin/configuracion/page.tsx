import { PageHeader } from "@/components/shared/page-header";
import { DemoSiteSettings } from "@/components/forms/demo-site-settings";
import { DemoPageEditor } from "@/components/forms/demo-page-editor";

export default function AdminConfiguracionPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-5"><PageHeader title="Configuración" description="Personaliza el nombre, la identidad visual y el contacto del sitio" /><DemoSiteSettings /></div>
      <div className="space-y-5"><PageHeader title="Editor de la página principal" description="Edita los textos, el contacto y las secciones visibles de la portada sin tocar código" /><DemoPageEditor /></div>
    </div>
  );
}