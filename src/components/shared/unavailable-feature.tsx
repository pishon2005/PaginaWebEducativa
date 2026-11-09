import { Info } from "lucide-react";

export function UnavailableFeature({
  title = "Funcionalidad en integración",
  description = "Esta función estará disponible cuando se conecte el servicio correspondiente.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e5e4] bg-white p-8 text-center">
      <Info className="mx-auto size-8 text-[#ea580c]" aria-hidden="true" />
      <h2 className="mt-3 text-base font-semibold text-[#171717]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78716c]">
        {description}
      </p>
    </div>
  );
}
