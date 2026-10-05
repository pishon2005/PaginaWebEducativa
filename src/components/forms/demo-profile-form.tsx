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
      <aside className="flex flex-col items-center border border-[#dfe7e0] bg-white p-6 text-center"><span className="grid size-24 place-items-center rounded-full bg-[#244d39] text-2xl font-semibold text-white">{firstName[0]}{lastName[0]}</span><p className="mt-4 text-sm font-semibold text-[#344a39]">{firstName} {lastName}</p><p className="mt-1 text-xs text-[#849087]">alumno@aulanorte.pe</p><label className="mt-4 inline-flex cursor-pointer items-center gap-2 border border-[#cdd9cf] px-3 py-2 text-xs font-semibold text-[#4f6e54] hover:bg-[#f4f8f4]"><Upload className="size-3.5" aria-hidden="true" />{photoName || "Cambiar foto"}<input type="file" accept="image/*" className="sr-only" onChange={selectPhoto} /></label><p className="mt-4 border-t border-[#edf1ed] pt-4 text-[10px] text-[#89958d]">Código de alumno · ALU-2026-0001</p></aside>
      <section className="border border-[#dfe7e0] bg-white p-5 sm:p-6"><h2 className="text-sm font-semibold text-[#263d2e]">Información personal</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-[#536357]">Nombre<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357]">Apellido<input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357] sm:col-span-2">Correo electrónico<input type="email" value="alumno@aulanorte.pe" disabled className="mt-1.5 h-10 w-full border border-[#e4eae4] bg-[#f8faf8] px-3 text-sm font-normal text-[#89958d]" /></label><label className="text-xs font-semibold text-[#536357]">Teléfono<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal" /></label><label className="text-xs font-semibold text-[#536357]">País<select value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1.5 h-10 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option>Perú</option><option>Chile</option><option>Colombia</option><option>México</option></select></label><label className="text-xs font-semibold text-[#536357]">Idioma<select defaultValue="es" className="mt-1.5 h-10 w-full border border-[#dfe7df] bg-white px-3 text-xs font-normal"><option value="es">Español</option><option value="en">English</option></select></label><div className="flex items-end"><button type="submit" className="h-10 bg-[#173c2d] px-4 text-xs font-semibold text-white hover:bg-[#24543e]">Guardar cambios</button></div></div>{notice && <p role="status" className="mt-4 flex items-center gap-2 border border-[#d8e7d8] bg-[#f3f8f3] px-3 py-2 text-xs text-[#4e7553]"><CheckCircle2 className="size-4" aria-hidden="true" />{notice} No se guardó en un servidor.</p>}</section>
    </form>
  );
}