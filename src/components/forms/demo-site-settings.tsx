"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";

export function DemoSiteSettings() {
  const [siteName, setSiteName] = useState("EDUKATECH");
  const [description, setDescription] = useState("Cursos prácticos para avanzar en tu carrera.");
  const [email, setEmail] = useState("contacto@edukatech.pe");
  const [primaryColor, setPrimaryColor] = useState("#f97316");
  const [logo, setLogo] = useState("");
  const [notice, setNotice] = useState("");

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("La configuración se actualizó en la vista previa de esta sesión.");
  }

  return (
    <form onSubmit={saveSettings} className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <section className="space-y-4 border border-[#e7e5e4] bg-white p-5"><h2 className="text-sm font-semibold text-[#171717]">Información del sitio</h2><label className="block text-xs font-semibold text-[#44403c]">Nombre del sitio<input required value={siteName} onChange={(event) => setSiteName(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="block text-xs font-semibold text-[#44403c]">Descripción<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 w-full border border-[#e7e5e4] px-3 py-2 text-sm font-normal" /></label><label className="block text-xs font-semibold text-[#44403c]">Correo de contacto<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label></section>
        <section className="space-y-4 border border-[#e7e5e4] bg-white p-5"><h2 className="text-sm font-semibold text-[#171717]">Apariencia</h2><label className="block text-xs font-semibold text-[#44403c]">Logotipo<input type="file" accept="image/*" onChange={(event) => setLogo(event.target.files?.[0]?.name ?? "")} className="mt-1.5 block w-full border border-dashed border-[#e7e5e4] p-3 text-xs font-normal text-[#44403c]" /></label>{logo && <p className="text-[10px] text-[#44403c]">Archivo seleccionado: {logo}</p>}<label className="flex items-center gap-3 text-xs font-semibold text-[#44403c]">Color principal<input type="color" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} className="size-10 cursor-pointer border border-[#e7e5e4] bg-white p-1" /><span className="font-normal text-[#78716c]">{primaryColor}</span></label></section>
      </div>
      <aside className="h-fit border border-[#e7e5e4] bg-white p-5"><h2 className="text-xs font-semibold text-[#44403c]">Vista previa</h2><div className="mt-4 border border-[#e7e5e4] p-4"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center text-white" style={{ backgroundColor: primaryColor }}><GraduationCap className="size-4" aria-hidden="true" /></span><span className="text-sm font-semibold text-[#171717]">{siteName || "Nombre del sitio"}</span></div><p className="mt-4 text-xs leading-5 text-[#44403c]">{description || "Descripción del sitio"}</p><p className="mt-3 text-[10px] text-[#78716c]">{email}</p></div><button type="submit" className="mt-5 h-10 w-full bg-[#f97316] text-xs font-semibold text-white hover:bg-[#ea580c]">Guardar cambios demo</button>{notice && <p role="status" className="mt-3 flex gap-2 text-[10px] leading-5 text-[#ea580c]"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}</aside>
    </form>
  );
}