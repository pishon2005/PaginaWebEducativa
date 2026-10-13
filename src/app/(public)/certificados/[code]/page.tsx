import Link from "next/link";
import { ArrowLeft, Award, BadgeCheck, CircleX } from "lucide-react";
import { PrintCertificateButton } from "@/components/shared/print-certificate-button";

export default async function PublicCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const isValid = code.toUpperCase() === "EDK-2026-0428";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <Link href="/cursos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#f97316] print:hidden"><ArrowLeft className="size-3.5" aria-hidden="true" /> Volver al catálogo</Link>
      <section className={`mt-6 border p-6 sm:p-10 ${isValid ? "border-[#fff7ed] bg-[#fff7ed]" : "border-[#ead8d5] bg-[#fff9f8]"}`}>
        <div className={`mx-auto grid size-12 place-items-center rounded-full ${isValid ? "bg-[#fff7ed] text-[#ea580c]" : "bg-[#f7e9e7] text-[#a85b50]"}`}>{isValid ? <BadgeCheck className="size-6" aria-hidden="true" /> : <CircleX className="size-6" aria-hidden="true" />}</div>
        <p className={`mt-3 text-center text-xs font-semibold uppercase tracking-[0.14em] ${isValid ? "text-[#ea580c]" : "text-[#a85b50]"}`}>{isValid ? "Certificado válido" : "Código no encontrado"}</p>
        {isValid ? <div className="mt-8 border border-[#e7e5e4] bg-white px-5 py-10 text-center sm:px-12"><Award className="mx-auto size-9 text-[#a47d3c]" aria-hidden="true" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#44403c]">EDUKATECH · Certificado de finalización</p><h1 className="mt-4 text-3xl font-semibold text-[#ea580c]">Valeria Rojas</h1><p className="mt-2 text-sm text-[#44403c]">Completó satisfactoriamente el curso</p><p className="mt-1 text-xl font-semibold text-[#ea580c]">Excel para negocios</p><p className="mt-4 text-xs text-[#78716c]">28 de septiembre de 2026 · 18 horas</p><p className="mt-7 border-t border-[#e7e5e4] pt-4 text-[10px] tracking-[0.08em] text-[#78716c]">CÓDIGO · {code.toUpperCase()}</p></div> : <p className="mx-auto mt-5 max-w-lg text-center text-sm leading-6 text-[#826c68]">No encontramos un certificado asociado a este código en la demo. Revisa que esté escrito correctamente.</p>}
        <div className="mt-6 flex justify-center"><PrintCertificateButton /></div>
      </section>
      <p className="mt-4 text-center text-[10px] text-[#78716c] print:hidden">Verificación demostrativa; los datos no provienen de una emisión oficial.</p>
    </div>
  );
}