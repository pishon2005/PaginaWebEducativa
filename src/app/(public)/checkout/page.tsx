import { DemoCheckoutForm } from "@/components/forms/demo-checkout-form";

const checkoutCourses: Record<string, { title: string; price: number }> = {
  "curso-1": { title: "Fundamentos de Python", price: 189 },
  "curso-2": { title: "Desarrollo web con React", price: 229 },
  "curso-3": { title: "Excel para negocios", price: 149 },
  "curso-4": { title: "Introducción a ciencia de datos", price: 249 },
  "curso-5": { title: "Diseño de interfaces digitales", price: 179 },
  "curso-6": { title: "SQL y bases de datos", price: 269 },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string }>;
}) {
  const { curso } = await searchParams;
  const selectedCourse = checkoutCourses[curso ?? "curso-1"] ?? checkoutCourses["curso-1"];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d836f]">Inscripción</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1e3c2c]">Finalizar compra</h1><p className="mt-2 text-sm text-[#738077]">Completa tus datos y registra el comprobante de pago.</p></div>
      <DemoCheckoutForm courseTitle={selectedCourse.title} price={selectedCourse.price} />
      </div>
  );
}