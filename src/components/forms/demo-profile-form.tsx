"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";

export function DemoProfileForm() {
  const [firstName, setFirstName] = useState("Valeria");
  const [lastName, setLastName] = useState("Rojas");
  const [phone, setPhone] = useState("+51 999 111 222");
  const [country, setCountry] = useState("Perú");
  const [photoName, setPhotoName] = useState("");
  const [notice, setNotice] = useState("");

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    setPhotoName(event.target.files?.[0]?.name ?? "");
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("El perfil se actualizó en esta vista de demostración.");
  }

  return (
    <form onSubmit={saveProfile} className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="flex flex-col items-center border border-[#e7e5e4] bg-white p-6 text-center"><span className="grid size-24 place-items-center rounded-full bg-[#ea580c] text-2xl font-semibold text-white">{firstName[0]}{lastName[0]}</span><p className="mt-4 text-sm font-semibold text-[#171717]">{firstName} {lastName}</p><p className="mt-1 text-xs text-[#78716c]">alumno@edukatech.pe</p><label className="mt-4 inline-flex cursor-pointer items-center gap-2 border border-[#e7e5e4] px-3 py-2 text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed]"><Upload className="size-3.5" aria-hidden="true" />{photoName || "Cambiar foto"}<input type="file" accept="image/*" className="sr-only" onChange={selectPhoto} /></label><p className="mt-4 border-t border-[#fafaf9] pt-4 text-[10px] text-[#78716c]">Código de alumno · ALU-2026-0001</p></aside>
      <section className="border border-[#e7e5e4] bg-white p-5 sm:p-6"><h2 className="text-sm font-semibold text-[#171717]">Información personal</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-[#44403c]">Nombre<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c]">Apellido<input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c] sm:col-span-2">Correo electrónico<input type="email" value="alumno@edukatech.pe" disabled className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-[#fff7ed] px-3 text-sm font-normal text-[#78716c]" /></label><label className="text-xs font-semibold text-[#44403c]">Teléfono<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#44403c]">País<select value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal"><option>Perú</option><option>Chile</option><option>Colombia</option><option>México</option></select></label><label className="text-xs font-semibold text-[#44403c]">Idioma<select defaultValue="es" className="mt-1.5 h-10 w-full border border-[#e7e5e4] bg-white px-3 text-xs font-normal"><option value="es">Español</option><option value="en">English</option></select></label><div className="flex items-end"><button type="submit" className="h-10 bg-[#f97316] px-4 text-xs font-semibold text-white hover:bg-[#ea580c]">Guardar cambios</button></div></div>{notice && <p role="status" className="mt-4 flex items-center gap-2 border border-[#fff7ed] bg-[#fff7ed] px-3 py-2 text-xs text-[#ea580c]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}</section>
    </form>
  );
}