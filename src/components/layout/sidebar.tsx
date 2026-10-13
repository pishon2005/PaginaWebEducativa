"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ChevronDown,
  BarChart3,
  Bell,
  Menu,
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  CalendarDays,
  MessageCircle,
  Award,
  UserRound,
  ShieldCheck,
  KeyRound,
  MessageSquareText,
} from "lucide-react";

const roleViews = [
  { href: "/superadmin", label: "Superadmin", shortLabel: "Superadmin" },
  { href: "/admin", label: "Administración", shortLabel: "Admin" },
  { href: "/profesor", label: "Profesor", shortLabel: "Profesor" },
  { href: "/alumno", label: "Alumno", shortLabel: "Alumno" },
];

const demoIdentities = {
  superadmin: { name: "Superadmin demo", initials: "SA" },
  admin: { name: "Sofía Herrera", initials: "SH" },
  profesor: { name: "Ana María Campos", initials: "AC" },
  alumno: { name: "Valeria Rojas", initials: "VR" },
} as const;

const demoNotifications = {
  superadmin: [
    { title: "Nuevo usuario registrado", detail: "La institución EDUKATECH sumó un administrador.", time: "Hace 8 min" },
    { title: "Reporte semanal disponible", detail: "Ya puedes revisar el resumen de actividad.", time: "Hace 1 h" },
  ],
  admin: [
    { title: "Nuevo curso pendiente", detail: "Revisa la propuesta de Diseño de interfaces.", time: "Hace 12 min" },
    { title: "Pago por validar", detail: "Hay una solicitud nueva en el registro de pagos.", time: "Hace 1 h" },
  ],
  profesor: [
    { title: "Entregas por revisar", detail: "Tienes 8 actividades nuevas en Python.", time: "Hace 20 min" },
    { title: "Pregunta en el foro", detail: "Un alumno comentó en Fundamentos de Python.", time: "Hace 1 h" },
  ],
  alumno: [
    { title: "Nueva clase disponible", detail: "Ya puedes comenzar el módulo de esta semana.", time: "Hace 10 min" },
    { title: "Fecha de entrega próxima", detail: "Tu práctica de Python vence el 7 de octubre.", time: "Hace 2 h" },
  ],
} as const;

const navigation = {
  superadmin: [
    {
      label: "Control de plataforma",
      items: [
        { href: "/superadmin", label: "Resumen", icon: LayoutDashboard },
        { href: "/superadmin/administradores", label: "Administradores", icon: ShieldCheck },
        { href: "/superadmin/roles", label: "Roles y permisos", icon: KeyRound },
      ],
    },
  ],
  admin: [
    {
      label: "Panel",
      items: [{ href: "/admin", label: "Resumen", icon: LayoutDashboard }],
    },
    {
      label: "Gestión académica",
      items: [
        { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
        { href: "/admin/usuarios", label: "Usuarios", icon: Users },
        { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
      ],
    },
    {
      label: "Institución",
      items: [
        { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
        { href: "/admin/configuracion", label: "Configuración", icon: Settings },
      ],
    },
  ],
  profesor: [
    {
      label: "Enseñanza",
      items: [
        { href: "/profesor", label: "Resumen", icon: LayoutDashboard },
        { href: "/profesor/mis-cursos", label: "Mis cursos", icon: BookOpen },
        { href: "/profesor/chat", label: "Mensajes", icon: MessageSquareText },
        { href: "/profesor/foro", label: "Foro", icon: MessageCircle },
        { href: "/profesor/calendario", label: "Calendario", icon: CalendarDays },
        { href: "/profesor/perfil", label: "Mi perfil", icon: UserRound },
      ],
    },
  ],
  alumno: [
    {
      label: "Aprendizaje",
      items: [
        { href: "/alumno", label: "Mi resumen", icon: LayoutDashboard },
        { href: "/alumno/mis-cursos", label: "Mis cursos", icon: BookOpen },
        { href: "/alumno/chat", label: "Mensajes", icon: MessageSquareText },
        { href: "/alumno/calendario", label: "Calendario", icon: CalendarDays },
        { href: "/alumno/certificados", label: "Certificados", icon: Award },
        { href: "/alumno/perfil", label: "Mi perfil", icon: UserRound },
      ],
    },
  ],
} as const;

function getRole(pathname: string) {
  if (pathname.startsWith("/superadmin")) return "superadmin";
  if (pathname.startsWith("/profesor")) return "profesor";
  if (pathname.startsWith("/alumno")) return "alumno";
  return "admin";
}

function getRoleName(role: keyof typeof navigation) {
  return roleViews.find((view) => view.href === `/${role}`)?.label;
}

function isNavigationItemActive(pathname: string, href: string) {
  const isSectionRoute = href.split("/").filter(Boolean).length > 1;
  return pathname === href || (isSectionRoute && pathname.startsWith(`${href}/`));
}

export function Sidebar() {
  const pathname = usePathname();
  const role = getRole(pathname);

  return (
    <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col overflow-y-auto border-r border-[#e7e5e4] bg-white px-4 py-5 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <Image src="/img/logo.png" alt="" width={40} height={40} className="size-10 object-contain" />
        <span>
          <span className="block text-[15px] font-black tracking-tight text-neutral-950">EDUKA<span className="text-orange-600">TECH</span></span>
          <span className="block text-[9px] font-bold tracking-[0.14em] text-neutral-500">TECHNOLOGY DIVISION</span>
        </span>
      </Link>

      <nav aria-label="Navegación principal" className="mt-8 space-y-6">
        {navigation[role].map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#78716c]">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isNavigationItemActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-[#fff7ed] text-[#c2410c]"
                        : "text-[#44403c] hover:bg-[#fafaf9] hover:text-[#c2410c]",
                    )}
                  >
                    <Icon className="size-[17px]" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-[#e7e5e4] pt-4">
        <p className="px-3 text-[10px] text-[#78716c]">Entorno de demostración · datos de muestra</p>
      </div>
    </aside>
  );
}

export function DashboardTopbar() {
  const pathname = usePathname();
  const role = getRole(pathname);
  const identity = demoIdentities[role];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#e7e5e4] bg-white/95 px-4 backdrop-blur md:px-8">
        <div>
          <p className="text-[10px] font-medium text-[#78716c] sm:text-xs">EDUKATECH · {getRoleName(role)}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#171717] sm:text-sm">{identity.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {(role === "admin" || role === "superadmin") && (
            <div className="hidden items-center gap-1 rounded-xl border border-[#e7e5e4] bg-[#fff7ed] p-1 sm:flex" aria-label="Cambiar vista de demostración">
              {roleViews.map((view) => {
                const active = role === getRole(view.href);
                return (
                  <Link
                    key={view.href}
                    href={view.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-[#f97316] text-white shadow-sm"
                        : "text-[#44403c] hover:bg-white hover:text-[#f97316]",
                    )}
                  >
                    {view.shortLabel}
                  </Link>
                );
              })}
            </div>
          )}
          <details className="group relative">
            <summary aria-label={`Notificaciones: ${demoNotifications[role].length} avisos recientes`} className="relative grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-[#e7e5e4] bg-white text-[#ea580c] transition hover:bg-[#fafaf9] [&::-webkit-details-marker]:hidden">
              <Bell className="size-[18px]" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[#c57d45]" aria-hidden="true" />
            </summary>
            <section className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white shadow-[0_20px_55px_-25px_rgba(28,25,23,0.35)]" aria-label="Avisos recientes">
              <div className="flex items-center justify-between border-b border-[#fafaf9] px-4 py-3.5">
                <div><h2 className="text-sm font-semibold text-[#171717]">Notificaciones</h2><p className="mt-0.5 text-[10px] text-[#78716c]">Novedades de tu espacio</p></div>
                <span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-[10px] font-bold text-[#ea580c]">{demoNotifications[role].length} nuevas</span>
              </div>
              <div className="divide-y divide-[#fafaf9]">
                {demoNotifications[role].map((notification) => (
                  <article key={notification.title} className="flex gap-3 px-4 py-3.5">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#ea580c]" aria-hidden="true" />
                    <div className="min-w-0"><h3 className="text-xs font-semibold text-[#171717]">{notification.title}</h3><p className="mt-1 text-[11px] leading-5 text-[#44403c]">{notification.detail}</p><p className="mt-1 text-[10px] text-[#78716c]">{notification.time}</p></div>
                  </article>
                ))}
              </div>
              <Link href={`/${role}/notificaciones`} className="block border-t border-[#fafaf9] px-4 py-3 text-center text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed]">Ver todas las notificaciones</Link>
            </section>
          </details>
          <Link href="/" aria-label="Ir al sitio público" className="hidden items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#ea580c] md:flex">
            Sitio público <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
          <div className="grid size-9 place-items-center rounded-full bg-[#fff7ed] text-xs font-bold text-[#ea580c]" aria-label={`Cuenta demo: ${identity.name}`}>
            {identity.initials}
          </div>
        </div>
      </header>
      <div className="relative z-30 border-b border-[#e7e5e4] bg-white lg:hidden">
        <button
          type="button"
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-mobile-navigation"
          onClick={() => setMobileNavOpen((open) => !open)}
          className="flex h-11 w-full items-center justify-between px-4 text-xs font-semibold text-[#ea580c]"
        >
          <span className="flex items-center gap-2"><Menu className="size-4" aria-hidden="true" /> Navegación</span>
          <ChevronDown className={cn("size-4 transition-transform", mobileNavOpen && "rotate-180")} aria-hidden="true" />
        </button>
        {mobileNavOpen && (
        <nav id="dashboard-mobile-navigation" aria-label="Navegación principal" className="absolute inset-x-0 top-full max-h-[min(70svh,560px)] overflow-y-auto border-b border-[#e7e5e4] bg-white px-4 py-4 shadow-[0_18px_35px_-24px_rgba(28,25,23,0.4)]">
          {navigation[role].map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">{group.label}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isNavigationItemActive(pathname, item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium", active ? "bg-[#fff7ed] text-[#c2410c]" : "text-[#44403c] hover:bg-[#fafaf9]")}>
                      <Icon className="size-4 shrink-0" aria-hidden="true" />{item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          {(role === "admin" || role === "superadmin") && (
            <div className="mt-4 border-t border-[#fafaf9] pt-3">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Otros espacios</p>
              <div className="flex flex-wrap gap-2">
                {roleViews.filter((view) => role !== getRole(view.href)).map((view) => (
                  <Link key={view.href} href={view.href} onClick={() => setMobileNavOpen(false)} className="rounded-full border border-[#e7e5e4] px-3 py-1.5 text-[11px] font-medium text-[#44403c] hover:bg-[#fafaf9]">{view.shortLabel}</Link>
                ))}
              </div>
            </div>
          )}
        </nav>
        )}
      </div>
    </>
  );
}