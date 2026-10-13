"use client";

import { Printer } from "lucide-react";

export function PrintCertificateButton() {
  return <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 bg-[#f97316] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#ea580c] print:hidden"><Printer className="size-4" aria-hidden="true" /> Imprimir o guardar PDF</button>;
}