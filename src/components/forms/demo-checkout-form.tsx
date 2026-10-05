"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, CreditCard, Upload } from "lucide-react";

type DemoCheckoutFormProps = {
  courseTitle: string;
  price: number;
};

const MAX_VOUCHER_SIZE = 50 * 1024 * 1024;

export function DemoCheckoutForm({ courseTitle, price }: DemoCheckoutFormProps) {
  const [method, setMethod] = useState("Yape");
  const [voucherName, setVoucherName] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function selectVoucher(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setVoucherName("");
      return;
    }
    if (file.size > MAX_VOUCHER_SIZE) {
      setError("El archivo supera el límite de 50 MB.");
      setVoucherName("");
      event.target.value = "";
      return;
    }
    setError("");
    setVoucherName(file.name);
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!voucherName) {
      setError("Adjunta la captura de tu voucher para continuar.");
      return;
    }
    setError("");
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <section className="mx-auto max-w-xl border border-[#dfe7df] bg-white p-6 text-center sm:p-9">
        <CheckCircle2 className="mx-auto size-10 text-[#5c855f]" aria-hidden="true" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#64806a]">Solicitud demo registrada</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#1e3c2c]">Voucher recibido</h1>
        <p className="mt-3 text-sm leading-6 text-[#738077]">Tu solicitud de compra para <strong className="text-[#405747]">{courseTitle}</strong> quedó lista para revisión. En esta demo no se envía ningún pago ni correo.</p>
        <div className="mt-6 flex items-center justify-between border border-[#e5ebe5] bg-[#f8faf8] px-4 py-3 text-left text-xs"><span className="text-[#77857b]">Método · {method}</span><span className="font-semibold text-[#405747]">S/ {price}.00</span></div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#8c978e]"><ClipboardCheck className="size-3.5" aria-hidden="true" /> Referencia demo AN-2026-00124</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/cursos" className="border border-[#cdd9cf] px-4 py-2.5 text-xs font-semibold text-[#355b3e] hover:bg-[#f5f9f5]">Volver al catálogo</Link><Link href="/login" className="bg-[#173c2d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#24543e]">Ir a iniciar sesión</Link></div>
      </section>
    );
  }

  return (
    <form onSubmit={submitPayment} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <section className="border border-[#dfe7df] bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[#263d2e]">Datos del alumno</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-semibold text-[#536357]">Nombre<input name="nombre" required autoComplete="given-name" placeholder="Valeria" className="h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal outline-none focus:border-[#78967c]" /></label>
            <label className="space-y-1.5 text-xs font-semibold text-[#536357]">Apellido<input name="apellido" required autoComplete="family-name" placeholder="Rojas" className="h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal outline-none focus:border-[#78967c]" /></label>
            <label className="space-y-1.5 text-xs font-semibold text-[#536357] sm:col-span-2">Correo electrónico<input name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className="h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal outline-none focus:border-[#78967c]" /></label>
            <label className="space-y-1.5 text-xs font-semibold text-[#536357] sm:col-span-2">Teléfono<input name="telefono" type="tel" required autoComplete="tel" placeholder="+51 999 999 999" className="h-10 w-full border border-[#dfe7df] px-3 text-sm font-normal outline-none focus:border-[#78967c]" /></label>
          </div>
        </section>

        <section className="border border-[#dfe7df] bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[#263d2e]">Pago manual</h2>
          <p className="mt-1 text-xs text-[#849087]">Selecciona el medio que usaste y adjunta el comprobante.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {["Yape", "Plin"].map((paymentMethod) => <label key={paymentMethod} className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm font-semibold transition ${method === paymentMethod ? "border-[#83a087] bg-[#f4f8f4] text-[#355b3e]" : "border-[#e2e8e2] text-[#627067]"}`}><input type="radio" name="metodo" value={paymentMethod} checked={method === paymentMethod} onChange={() => setMethod(paymentMethod)} className="accent-[#315d3d]" />{paymentMethod}<span className="ml-auto text-[10px] font-normal text-[#89958d]">Transferencia</span></label>)}
          </div>
          <div className="mt-4 flex flex-col gap-1 border border-[#e4ebe4] bg-[#f8faf8] p-4 text-xs text-[#66766a] sm:flex-row sm:items-center sm:justify-between"><span><strong className="text-[#3e5943]">Número demo:</strong> +51 999 111 222</span><span><strong className="text-[#3e5943]">Titular:</strong> Aula Norte Demo</span></div>
          <label className="mt-4 block text-xs font-semibold text-[#536357]">Voucher de pago <span className="font-normal text-[#89958d]">(PDF, JPG o PNG · máx. 50 MB)</span>
            <span className="mt-2 flex min-h-16 cursor-pointer items-center gap-3 border border-dashed border-[#cfdacf] bg-[#fafcf9] px-4 py-3 text-xs text-[#718078] hover:bg-[#f5f9f5]"><Upload className="size-4 shrink-0 text-[#66806b]" aria-hidden="true" />{voucherName || "Seleccionar archivo"}<input type="file" accept=".pdf,.png,.jpg,.jpeg" required onChange={selectVoucher} className="sr-only" /></span>
          </label>
          {error && <p role="alert" className="mt-3 text-xs font-medium text-[#a24135]">{error}</p>}
        </section>
      </div>

      <aside className="h-fit border border-[#dfe7df] bg-white p-5 lg:sticky lg:top-24">
        <h2 className="text-base font-semibold text-[#263d2e]">Resumen de compra</h2>
        <div className="mt-4 flex items-start gap-3 border-y border-[#edf1ed] py-4"><span className="grid size-10 shrink-0 place-items-center bg-[#eaf1e9] text-[#527456]"><CreditCard className="size-4" aria-hidden="true" /></span><span><span className="block text-xs font-semibold text-[#344a39]">{courseTitle}</span><span className="mt-1 block text-[10px] text-[#829087]">Acceso individual</span></span></div>
        <div className="mt-4 flex justify-between text-xs text-[#758178]"><span>Total</span><strong className="text-base text-[#1c3d2c]">S/ {price}.00</strong></div>
        <button type="submit" className="mt-5 h-11 w-full bg-[#173c2d] text-sm font-semibold text-white transition hover:bg-[#24543e]">Registrar voucher demo</button>
        <p className="mt-3 text-[10px] leading-5 text-[#89958d]">La solicitud solo se muestra en pantalla. No procesa pagos, no sube archivos y no crea una cuenta real.</p>
      </aside>
    </form>
  );
}