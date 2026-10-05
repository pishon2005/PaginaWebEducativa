import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import { ArrowUpRight, Award, CalendarDays, CheckCircle2 } from "lucide-react";

export default function AlumnoCertificadosPage() {
  return (
    <div>
      <PageHeader
        title="Mis certificados"
        description="Certificados obtenidos al completar cursos"
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <article className="relative overflow-hidden border border-[#d6e1d6] bg-[#f8faf6] p-6 sm:p-9">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(135deg,transparent_0_49%,#e8efe5_49%_50%,transparent_50%_100%)]" aria-hidden="true" />
          <div className="relative flex min-h-[270px] flex-col items-center justify-center border border-[#c9d6c9] bg-white/80 px-5 py-8 text-center">
            <Award className="size-8 text-[#a47d3c]" aria-hidden="true" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#708176]">ProyectoClases · Certificado de finalización</p>
            <h2 className="mt-4 text-2xl font-semibold text-[#23422f]">Valeria Rojas</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#718078]">Completó satisfactoriamente el curso</p>
            <p className="mt-1 text-lg font-semibold text-[#365b3f]">Excel para negocios</p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-[#839087]"><CalendarDays className="size-3.5" aria-hidden="true" /> 28 de septiembre de 2026</p>
            <p className="mt-5 border-t border-[#e6ece5] pt-3 text-[9px] tracking-[0.08em] text-[#8a968d]">CÓDIGO DE VERIFICACIÓN · AN-2026-0428</p>
          </div>
          <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-[10px] font-medium text-[#64806a]"><CheckCircle2 className="size-3.5" aria-hidden="true" /> Curso completado</span><Link href="/certificados/AN-2026-0428" className="inline-flex items-center gap-1 text-xs font-semibold text-[#4c7052] hover:text-[#173c2d]">Validar certificado <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link></div>
        </article>
        <aside className="h-fit border border-[#dfe7e0] bg-white p-5"><h2 className="text-sm font-semibold text-[#2a4232]">Certificados</h2><p className="mt-1 text-xs text-[#849087]">Documentos obtenidos al completar un curso.</p><div className="mt-4 border-t border-[#edf1ed] pt-4"><p className="text-xs font-semibold text-[#3b5141]">Excel para negocios</p><p className="mt-1 text-[10px] text-[#849087]">Finalizado · 28 sep 2026</p><p className="mt-3 text-[10px] leading-5 text-[#7d8a81]">Los certificados del prototipo usan datos ficticios. Su emisión real requiere completar el curso y conectar el sistema académico.</p></div></aside>
      </section>
    </div>
  );
}