import { DemoCheckoutForm } from "@/components/forms/demo-checkout-form";
import { getCourseBySlug } from "@/lib/demo-data";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string }>;
}) {
  const { curso } = await searchParams;
  const selectedCourse = getCourseBySlug(curso ?? "curso-1");

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#44403c]">Inscripción</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Finalizar compra</h1><p className="mt-2 text-sm text-[#44403c]">Completa tus datos y registra el comprobante de pago.</p></div>
      <DemoCheckoutForm courseTitle={selectedCourse.title} price={selectedCourse.price} />
      </div>
  );
}