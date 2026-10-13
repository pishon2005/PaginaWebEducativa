"use client";

import { ReactNode, useState } from "react";
import { Plus } from "lucide-react";

type DemoCreateSectionProps = {
  label: string;
  children: ReactNode;
};

export function DemoCreateSection({ label, children }: DemoCreateSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-dashed border-[#e7e5e4] bg-white">
      <button
        type="button"
        onClick={() => setOpen((visible) => !visible)}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 px-5 py-4 text-xs font-semibold text-[#ea580c] transition hover:bg-[#fff7ed]"
      >
        <Plus className="size-4" aria-hidden="true" />
        {open ? "Cerrar formulario" : label}
      </button>
      {open && <div className="border-t border-[#e7e5e4] p-4 sm:p-5">{children}</div>}
    </section>
  );
}
