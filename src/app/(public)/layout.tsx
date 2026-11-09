import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppContact } from "@/components/shared/whatsapp-contact";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <aside
        role="status"
        aria-label="Aviso de demostración"
        className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs leading-5 text-amber-950"
      >
        Sitio de demostración: los cursos, productos, perfiles y cifras son
        ilustrativos, no ofertas verificadas ni registros institucionales. El
        checkout no procesa pagos; no ingreses datos personales ni realices
        pagos.
      </aside>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppContact />
    </div>
  );
}