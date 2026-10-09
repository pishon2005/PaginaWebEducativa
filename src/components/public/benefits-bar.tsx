import Image from "next/image";

const features = [
  { label: "Clases 100% prácticas", icon: "/img/sombrerodegraduación.png" },
  { label: "Proyectos reales", icon: "/img/tuerca.png" },
  { label: "Acompañamiento del docente", icon: "/img/personas.png" },
  { label: "Modalidad virtual y presencial", icon: "/img/icono_laptop.png" },
  {
    label: "Enfocado en tu futuro profesional",
    icon: "/img/icono_crecimiento.png",
  },
];

export function BenefitsBar() {
  return (
    <div
      aria-label="Ventajas de aprender en EDUKATECH"
      className="relative z-20 border-t border-white/10 bg-neutral-950/80 lg:absolute lg:inset-x-0 lg:bottom-0"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 px-5 sm:px-8 min-[480px]:grid-cols-2 lg:grid-cols-5 lg:px-14">
        {features.map(({ label, icon }, index) => (
          <div
            key={label}
            className={[
              "flex min-h-[72px] items-center gap-3 py-4 text-white",
              "border-b border-white/10 last:border-b-0",
              "min-[480px]:last:col-span-2",
              "lg:border-b-0 lg:last:col-span-1",
              index < features.length - 1 ? "lg:border-r lg:border-white/10 lg:pr-5" : "",
              index > 0 ? "lg:pl-5" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Image
              src={icon}
              alt=""
              width={44}
              height={44}
              draggable={false}
              className="size-10 shrink-0 select-none object-contain"
            />
            <span className="text-sm font-medium leading-tight text-neutral-200">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

