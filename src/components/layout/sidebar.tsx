"use client";

import Link from "next/link";
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
  GraduationCap,
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
    { title: "Nuevo usuario registrado", detail: "La institución ProyectoClases sumó un administrador.", time: "Hace 8 min" },
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
    <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col overflow-y-auto border-r border-[#dce4dd] bg-white px-4 py-5 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-xl bg-[#153c2d] text-white">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[15px] font-bold tracking-tight text-[#173c2d]">ProyectoClases</span>
          <span className="block text-xs text-[#738178]">Plataforma educativa</span>
        </span>
      </Link>

      <nav aria-label="Navegación principal" className="mt-8 space-y-6">
        {navigation[role].map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#87938b]">
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
                        ? "bg-[#eaf2ec] text-[#1d513a]"
                        : "text-[#5e6d63] hover:bg-[#f4f7f4] hover:text-[#1d513a]",
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

      <div className="mt-auto border-t border-[#e6ebe6] pt-4">
        <p className="px-3 text-[10px] text-[#9aa49d]">Entorno de demostración · datos de muestra</p>
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
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#dce4dd] bg-white/95 px-4 backdrop-blur md:px-8">
        <div>
          <p className="text-[10px] font-medium text-[#7a887f] sm:text-xs">ProyectoClases · {getRoleName(role)}</p>
          <p className="mt-0.5 text-xs font-semibold text-[#24392d] sm:text-sm">{identity.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {(role === "admin" || role === "superadmin") && (
            <div className="hidden items-center gap-1 rounded-xl border border-[#e0e7e1] bg-[#f8faf8] p-1 sm:flex" aria-label="Cambiar vista de demostración">
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
                        ? "bg-[#173c2d] text-white shadow-sm"
                        : "text-[#66756b] hover:bg-white hover:text-[#173c2d]",
                    )}
                  >
                    {view.shortLabel}
                  </Link>
                );
              })}
            </div>
          )}
          <details className="group relative">
            <summary aria-label={`Notificaciones: ${demoNotifications[role].length} avisos recientes`} className="relative grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-[#e0e7e1] bg-white text-[#53685a] transition hover:bg-[#f4f7f4] [&::-webkit-details-marker]:hidden">
              <Bell className="size-[18px]" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[#c57d45]" aria-hidden="true" />
            </summary>
            <section className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e0e7e1] bg-white shadow-[0_20px_55px_-25px_rgba(24,58,43,0.35)]" aria-label="Avisos recientes">
              <div className="flex items-center justify-between border-b border-[#edf1ed] px-4 py-3.5">
                <div><h2 className="text-sm font-semibold text-[#263d2e]">Notificaciones</h2><p className="mt-0.5 text-[10px] text-[#849087]">Novedades de tu espacio</p></div>
                <span className="rounded-full bg-[#edf4ee] px-2.5 py-1 text-[10px] font-bold text-[#4d7654]">{demoNotifications[role].length} nuevas</span>
              </div>
              <div className="divide-y divide-[#edf1ed]">
                {demoNotifications[role].map((notification) => (
                  <article key={notification.title} className="flex gap-3 px-4 py-3.5">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#6d9b70]" aria-hidden="true" />
                    <div className="min-w-0"><h3 className="text-xs font-semibold text-[#344b3b]">{notification.title}</h3><p className="mt-1 text-[11px] leading-5 text-[#77857b]">{notification.detail}</p><p className="mt-1 text-[10px] text-[#a0aaa2]">{notification.time}</p></div>
                  </article>
                ))}
              </div>
            </section>
          </details>
          <Link href="/" aria-label="Ir al sitio público" className="hidden items-center gap-1.5 text-xs font-semibold text-[#45624f] hover:text-[#183c2d] md:flex">
            Sitio público <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
          <div className="grid size-9 place-items-center rounded-full bg-[#e3ede5] text-xs font-bold text-[#315b40]" aria-label={`Cuenta demo: ${identity.name}`}>
            {identity.initials}
          </div>
        </div>
      </header>
      <div className="relative z-30 border-b border-[#dce4dd] bg-white lg:hidden">
        <button
          type="button"
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-mobile-navigation"
          onClick={() => setMobileNavOpen((open) => !open)}
          className="flex h-11 w-full items-center justify-between px-4 text-xs font-semibold text-[#53685a]"
        >
          <span className="flex items-center gap-2"><Menu className="size-4" aria-hidden="true" /> Navegación</span>
          <ChevronDown className={cn("size-4 transition-transform", mobileNavOpen && "rotate-180")} aria-hidden="true" />
        </button>
        {mobileNavOpen && (
        <nav id="dashboard-mobile-navigation" aria-label="Navegación principal" className="absolute inset-x-0 top-full max-h-[min(70svh,560px)] overflow-y-auto border-b border-[#dce4dd] bg-white px-4 py-4 shadow-[0_18px_35px_-24px_rgba(24,58,43,0.4)]">
          {navigation[role].map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#87938b]">{group.label}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isNavigationItemActive(pathname, item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium", active ? "bg-[#eaf2ec] text-[#1d513a]" : "text-[#5e6d63] hover:bg-[#f4f7f4]")}>
                      <Icon className="size-4 shrink-0" aria-hidden="true" />{item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          {(role === "admin" || role === "superadmin") && (
            <div className="mt-4 border-t border-[#edf1ed] pt-3">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#87938b]">Otros espacios</p>
              <div className="flex flex-wrap gap-2">
                {roleViews.filter((view) => role !== getRole(view.href)).map((view) => (
                  <Link key={view.href} href={view.href} onClick={() => setMobileNavOpen(false)} className="rounded-full border border-[#e1e8e1] px-3 py-1.5 text-[11px] font-medium text-[#617067] hover:bg-[#f4f7f4]">{view.shortLabel}</Link>
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