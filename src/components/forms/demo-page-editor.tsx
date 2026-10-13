"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Eye, EyeOff, LayoutTemplate } from "lucide-react";

type SectionKey = "catalogo" | "proyectos" | "contacto";

const sectionLabels: Record<SectionKey, string> = {
  catalogo: "Catálogo de cursos",
  proyectos: "Proyectos",
  contacto: "Contacto",
};

export function DemoPageEditor() {
  const [heroEyebrow, setHeroEyebrow] = useState("Aprende · Crea · Innova");
  const [heroTitle, setHeroTitle] = useState("De cero a proyectos reales");
  const [heroSubtitle, setHeroSubtitle] = useState("Cursos prácticos de programación, electrónica, robótica y más, con proyectos que puedes mostrar desde la primera clase.");
  const [ctaLabel, setCtaLabel] = useState("Explorar cursos");
  const [contactEmail, setContactEmail] = useState("contacto@edukatech.pe");
  const [contactPhone, setContactPhone] = useState("+51 999 999 999");
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({ catalogo: true, proyectos: true, contacto: true });
  const [notice, setNotice] = useState("");

  function toggleSection(key: SectionKey) {
    setSections((current) => ({ ...current, [key]: !current[key] }));
  }

  function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Los cambios de la página principal se aplicaron en esta vista de demostración.");
  }

  return (
    <form onSubmit={savePage} className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <section className="space-y-4 border border-[#e7e5e4] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#171717]">Portada (hero)</h2>
              <p className="mt-1 text-xs text-[#78716c]">Textos principales que ve cualquier visitante al entrar.</p>
            </div>
            <LayoutTemplate className="size-5 text-[#44403c]" aria-hidden="true" />
          </div>
          <label className="block text-xs font-semibold text-[#44403c]">Texto pequeño superior<input value={heroEyebrow} onChange={(event) => setHeroEyebrow(event.target.value)} maxLength={60} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label>
          <label className="block text-xs font-semibold text-[#44403c]">Titular principal<input required value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} maxLength={80} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label>
          <label className="block text-xs font-semibold text-[#44403c]">Descripción<textarea rows={3} value={heroSubtitle} onChange={(event) => setHeroSubtitle(event.target.value)} maxLength={220} className="mt-1.5 w-full border border-[#e7e5e4] px-3 py-2 text-sm font-normal" /></label>
          <label className="block text-xs font-semibold text-[#44403c]">Texto del botón principal<input required value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} maxLength={30} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label>
        </section>

        <section className="space-y-4 border border-[#e7e5e4] bg-white p-5">
          <h2 className="text-sm font-semibold text-[#171717]">Contacto visible</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#44403c]">Correo de contacto<input type="email" required value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label>
            <label className="block text-xs font-semibold text-[#44403c]">Teléfono<input type="tel" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label>
          </div>
        </section>

        <section className="space-y-3 border border-[#e7e5e4] bg-white p-5">
          <div>
            <h2 className="text-sm font-semibold text-[#171717]">Secciones visibles</h2>
            <p className="mt-1 text-xs text-[#78716c]">Activa u oculta bloques de la página principal sin tocar código.</p>
          </div>
          {(Object.keys(sectionLabels) as SectionKey[]).map((key) => (
            <button key={key} type="button" onClick={() => toggleSection(key)} aria-pressed={sections[key]} className="flex w-full items-center justify-between border border-[#e7e5e4] px-4 py-3 text-left transition hover:bg-[#fff7ed]">
              <span className="flex items-center gap-2.5 text-xs font-semibold text-[#171717]">
                {sections[key] ? <Eye className="size-4 text-[#ea580c]" aria-hidden="true" /> : <EyeOff className="size-4 text-[#a8a29e]" aria-hidden="true" />}
                {sectionLabels[key]}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${sections[key] ? "bg-[#fff7ed] text-[#ea580c]" : "bg-[#fafaf9] text-[#78716c]"}`}>{sections[key] ? "Visible" : "Oculta"}</span>
            </button>
          ))}
        </section>
      </div>

      <aside className="h-fit border border-[#e7e5e4] bg-white p-5">
        <h2 className="text-xs font-semibold text-[#44403c]">Vista previa de la portada</h2>
        <div className="mt-4 space-y-3 border border-[#e7e5e4] bg-[#171717] p-5 text-white">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#f97316]">{heroEyebrow || "Texto superior"}</p>
          <p className="text-lg font-black leading-tight">{heroTitle || "Titular principal"}</p>
          <p className="text-[11px] leading-5 text-[#d6d3d1]">{heroSubtitle || "Descripción de la portada"}</p>
          <span className="inline-flex rounded-full bg-[#f97316] px-4 py-2 text-[11px] font-bold text-white">{ctaLabel || "Botón"}</span>
        </div>
        <div className="mt-3 space-y-1.5 border border-[#e7e5e4] p-4 text-[11px] text-[#44403c]">
          <p className="font-semibold text-[#171717]">Contacto</p>
          <p>{contactEmail}</p>
          <p>{contactPhone}</p>
        </div>
        <div className="mt-3 border border-[#e7e5e4] p-4">
          <p className="text-[11px] font-semibold text-[#171717]">Secciones de la página</p>
          <ul className="mt-2 space-y-1 text-[10px] text-[#78716c]">
            {(Object.keys(sectionLabels) as SectionKey[]).map((key) => <li key={key}>{sectionLabels[key]} · {sections[key] ? "visible" : "oculta"}</li>)}
          </ul>
        </div>
        <button type="submit" className="mt-5 h-10 w-full bg-[#f97316] text-xs font-semibold text-white hover:bg-[#ea580c]">Aplicar cambios demo</button>
        {notice && <p role="status" className="mt-3 flex gap-2 text-[10px] leading-5 text-[#ea580c]"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}
      </aside>
    </form>
  );
}
