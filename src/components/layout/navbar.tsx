"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e4e9e2] bg-[#fbfcf9]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-[#193b2b]">
          <span className="grid size-9 place-items-center rounded-xl bg-[#173c2d] text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="font-bold tracking-tight">Aula Norte</span>
        </Link>
        <nav aria-label="Navegación pública" className="hidden items-center gap-7 md:flex">
          <Link href="/#experiencia" className="text-sm font-medium text-[#617067] transition hover:text-[#173c2d]">
            La experiencia
          </Link>
          <Link href="/#docente" className="text-sm font-medium text-[#617067] transition hover:text-[#173c2d]">
            Nuestro equipo
          </Link>
          <Link href="/#catalogo" className="text-sm font-medium text-[#617067] transition hover:text-[#173c2d]">
            Oferta académica
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/login" className="rounded-lg px-2 py-2 text-xs font-semibold text-[#526358] transition hover:bg-[#f0f4ef] hover:text-[#173c2d] sm:px-3 sm:text-sm">
            Iniciar sesión
          </Link>
          <button
            type="button"
            aria-label={mobileNavOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-public-navigation"
            onClick={() => setMobileNavOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-xl border border-[#dce5dc] bg-white text-[#34523d] md:hidden"
          >
            {mobileNavOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <nav
          id="mobile-public-navigation"
          aria-label="Navegación pública"
          className="absolute inset-x-0 top-full z-50 grid gap-1 border-b border-[#e0e7e1] bg-white p-3 shadow-[0_20px_55px_-25px_rgba(24,58,43,0.35)] md:hidden"
        >
          {[
            { href: "/#experiencia", label: "La experiencia" },
            { href: "/#docente", label: "Nuestro equipo" },
            { href: "/#catalogo", label: "Oferta académica" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#526358] hover:bg-[#f4f7f4] hover:text-[#173c2d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}