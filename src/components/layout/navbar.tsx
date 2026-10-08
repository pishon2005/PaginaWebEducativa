"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Cpu,
  FlaskConical,
  GraduationCap,
  Menu,
  Search,
  Users,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationLinks = [
  { href: "/", label: "Inicio" },
  { href: "/cursos", label: "Cursos" },
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#investigacion", label: "Investigación" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

const mobileQuickLinks = [
  { href: "/cursos", label: "Explorar cursos", icon: GraduationCap },
  { href: "/#proyectos", label: "Proyectos", icon: Cpu },
  { href: "/#investigacion", label: "Investigación", icon: FlaskConical },
  { href: "/#nosotros", label: "Comunidad", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  // Cuadro naranja: prioriza hover, luego ruta activa, y por defecto "Inicio".
  const activeHref =
    hoveredHref ??
    navigationLinks.find((item) => {
      const clean = item.href.split("#")[0];
      if (clean === "/") return pathname === "/";
      return pathname === clean || pathname.startsWith(`${clean}/`);
    })?.href ??
    "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-[76px] lg:px-8">
        <Link
          href="/"
          aria-label="EDUKATECH Technology Division, inicio"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="grid size-16 place-items-center">
            <Image
              src="/img/logo.png"
              alt=""
              width={80}
              height={80}
              className="size-16 object-contain"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-neutral-950 sm:text-2xl">
              EDUKA<span className="text-orange-600">TECH</span>
            </span>
            <span className="mt-1 text-[9px] font-bold tracking-[0.16em] text-neutral-600 sm:text-[10px]">
              TECHNOLOGY DIVISION
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-0.5 lg:flex"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {navigationLinks.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredHref(item.href)}
                onFocus={() => setHoveredHref(item.href)}
                onBlur={() => setHoveredHref(null)}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-400 text-neutral-950"
                    : "text-neutral-700 hover:text-orange-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/cursos"
            aria-label="Buscar cursos"
            title="Buscar cursos"
            className="grid size-10 place-items-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <Link
            href="/cursos"
            className="hidden min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:inline-flex"
          >
            Inscríbete
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Abrir menú de navegación"
                  className="grid size-10 place-items-center rounded-lg border border-neutral-200 text-neutral-900 transition-colors hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 lg:hidden"
                >
                  <Menu className="size-5" aria-hidden="true" />
                </button>
              }
            />
            <SheetContent
              side="right"
              className="w-[min(22rem,85vw)] gap-0 border-neutral-200 bg-white p-0"
            >
              <SheetHeader className="border-b border-neutral-200 px-5 py-5">
                <SheetTitle className="flex items-center gap-2.5 text-left">
                  <span className="grid size-11 place-items-center">
                    <Image
                      src="/img/logo.png"
                      alt=""
                      width={52}
                      height={52}
                      className="size-11 object-contain"
                    />
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="text-lg font-black text-neutral-950">
                      EDUKA<span className="text-orange-600">TECH</span>
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-[0.14em] text-neutral-600">
                      TECHNOLOGY DIVISION
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Navegación móvil"
                className="grid gap-1 p-4"
              >
                {navigationLinks.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="rounded-lg px-3 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-orange-50 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-orange-600"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ))}
              </nav>
              <div className="mx-4 border-t border-neutral-200 pt-4">
                <p className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Explora EDUKATECH
                </p>
                <div className="mt-2 grid gap-1">
                  {mobileQuickLinks.map(({ href, label, icon: Icon }) => (
                    <SheetClose
                      key={href}
                      render={
                        <Link
                          href={href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-orange-800"
                        >
                          <Icon
                            className="size-4 text-orange-600"
                            aria-hidden="true"
                          />
                          {label}
                        </Link>
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="mt-auto p-4">
                <SheetClose
                  render={
                    <Link
                      href="/cursos"
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                      Inscríbete
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}