import Link from "next/link";
import { ArrowLeft, Award, BadgeCheck, CircleX } from "lucide-react";
import { PrintCertificateButton } from "@/components/shared/print-certificate-button";

export default async function PublicCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const isValid = code.toUpperCase() === "AN-2026-0428";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <Link href="/cursos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647a68] hover:text-[#173c2d] print:hidden"><ArrowLeft className="size-3.5" aria-hidden="true" /> Volver al catálogo</Link>
      <section className={`mt-6 border p-6 sm:p-10 ${isValid ? "border-[#d4e0d4] bg-[#fafcf8]" : "border-[#ead8d5] bg-[#fff9f8]"}`}>
        <div className={`mx-auto grid size-12 place-items-center rounded-full ${isValid ? "bg-[#e8f1e8] text-[#5d825f]" : "bg-[#f7e9e7] text-[#a85b50]"}`}>{isValid ? <BadgeCheck className="size-6" aria-hidden="true" /> : <CircleX className="size-6" aria-hidden="true" />}</div>
        <p className={`mt-3 text-center text-xs font-semibold uppercase tracking-[0.14em] ${isValid ? "text-[#587a5d]" : "text-[#a85b50]"}`}>{isValid ? "Certificado válido" : "Código no encontrado"}</p>
        {isValid ? <div className="mt-8 border border-[#cdd9cd] bg-white px-5 py-10 text-center sm:px-12"><Award className="mx-auto size-9 text-[#a47d3c]" aria-hidden="true" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#708176]">ProyectoClases · Certificado de finalización</p><h1 className="mt-4 text-3xl font-semibold text-[#23422f]">Valeria Rojas</h1><p className="mt-2 text-sm text-[#718078]">Completó satisfactoriamente el curso</p><p className="mt-1 text-xl font-semibold text-[#365b3f]">Excel para negocios</p><p className="mt-4 text-xs text-[#839087]">28 de septiembre de 2026 · 18 horas</p><p className="mt-7 border-t border-[#e6ece5] pt-4 text-[10px] tracking-[0.08em] text-[#8a968d]">CÓDIGO · {code.toUpperCase()}</p></div> : <p className="mx-auto mt-5 max-w-lg text-center text-sm leading-6 text-[#826c68]">No encontramos un certificado asociado a este código en la demo. Revisa que esté escrito correctamente.</p>}
        <div className="mt-6 flex justify-center"><PrintCertificateButton /></div>
      </section>
      <p className="mt-4 text-center text-[10px] text-[#8b978e] print:hidden">Verificación demostrativa; los datos no provienen de una emisión oficial.</p>
    </div>
  );
}