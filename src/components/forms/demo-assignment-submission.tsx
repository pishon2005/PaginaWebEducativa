"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function DemoAssignmentSubmission({ assignmentTitle }: { assignmentTitle: string }) {
  const [fileName, setFileName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo supera el límite permitido de 50 MB.");
      setFileName("");
      event.target.value = "";
      return;
    }
    setFileName(file.name);
    setError("");
  }

  function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileName) {
      setError("Selecciona un archivo para enviar la tarea.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="border border-[#d8e7d8] bg-[#f3f8f3] p-5"><CheckCircle2 className="size-5 text-[#5c855f]" aria-hidden="true" /><h2 className="mt-2 text-sm font-semibold text-[#365b3f]">Entrega registrada en la demo</h2><p className="mt-1 text-xs leading-5 text-[#68806c]">{assignmentTitle} · {fileName}</p>{comment && <p className="mt-2 text-xs text-[#718078]">Comentario: {comment}</p>}<p className="mt-3 text-[10px] text-[#839087]">El archivo no se subió ni quedó guardado.</p></div>;
  }

  return (
    <form onSubmit={submitAssignment} className="space-y-4">
      <label className="block text-xs font-semibold text-[#536357]">Archivo de entrega <span className="font-normal text-[#89958d]">(máx. 50 MB)</span><span className="mt-2 flex min-h-14 cursor-pointer items-center gap-3 border border-dashed border-[#cfdacf] bg-[#fafcf9] px-4 py-3 text-xs text-[#718078] hover:bg-[#f5f9f5]"><Upload className="size-4 shrink-0 text-[#66806b]" aria-hidden="true" />{fileName || "Elegir archivo"}<input type="file" required accept=".pdf,.zip,.py,.js,.ts,.doc,.docx,.png,.jpg" className="sr-only" onChange={selectFile} /></span></label>
      <label className="block text-xs font-semibold text-[#536357]">Comentario para la profesora <span className="font-normal text-[#89958d]">(opcional)</span><textarea rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Añade contexto sobre tu trabajo..." className="mt-1.5 w-full resize-y border border-[#dfe7df] px-3 py-2 text-sm font-normal outline-none focus:border-[#78967c]" /></label>
      {error && <p role="alert" className="text-xs font-medium text-[#a24135]">{error}</p>}
      <button type="submit" className="h-10 bg-[#173c2d] px-4 text-xs font-semibold text-white hover:bg-[#24543e]">Enviar tarea</button>
      <p className="text-[10px] text-[#8b978e]">Entrega de prueba · el archivo solo se referencia en esta página.</p>
    </form>
  );
}