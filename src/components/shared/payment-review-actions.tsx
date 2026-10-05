"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function PaymentReviewActions({ paymentId }: { paymentId: string }) {
  const [status, setStatus] = useState<"Pendiente" | "Aprobado" | "Rechazado">("Pendiente");

  return (
    <div className="flex flex-col items-end gap-2">
      {status === "Pendiente" ? (
        <div className="flex gap-2">
          <button type="button" onClick={() => setStatus("Rechazado")} className="border border-[#ecd7d3] px-3 py-2 text-xs font-semibold text-[#a04f44] hover:bg-[#fff6f4]">Rechazar</button>
          <button type="button" onClick={() => setStatus("Aprobado")} className="bg-[#173c2d] px-3 py-2 text-xs font-semibold text-white hover:bg-[#24543e]">Aprobar pago</button>
        </div>
      ) : (
        <p role="status" className={`flex max-w-[320px] items-start gap-2 border px-3 py-2 text-[10px] leading-5 ${status === "Aprobado" ? "border-[#d8e7d8] bg-[#f3f8f3] text-[#4e7553]" : "border-[#efdfdc] bg-[#fff6f4] text-[#9a5147]"}`}>
          {status === "Aprobado" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
          {status === "Aprobado" ? `Pago #${paymentId} aprobado en demo. La inscripción y las credenciales se representarían aquí.` : `Pago #${paymentId} rechazado en demo. El alumno podría corregir su comprobante.`}
        </p>
      )}
    </div>
  );
}