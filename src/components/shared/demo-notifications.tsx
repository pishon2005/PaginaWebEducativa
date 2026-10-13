"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

type Notification = { title: string; detail: string; time: string };

const notificationsByRole: Record<string, Notification[]> = {
  alumno: [
    { title: "Nueva clase disponible", detail: "Ya puedes comenzar el módulo de esta semana en Fundamentos de Python.", time: "Hace 10 min" },
    { title: "Fecha de entrega próxima", detail: "Tu práctica de Python vence el 7 de octubre.", time: "Hace 2 h" },
    { title: "Respuesta en el foro", detail: "Ana María respondió tu consulta sobre funciones.", time: "Ayer" },
    { title: "Nota publicada", detail: "Ya está disponible tu calificación del Ejercicio 2.", time: "Hace 2 días" },
  ],
  profesor: [
    { title: "Entregas por revisar", detail: "Tienes 8 actividades nuevas en Fundamentos de Python.", time: "Hace 20 min" },
    { title: "Pregunta en el foro", detail: "Un alumno comentó en Fundamentos de Python.", time: "Hace 1 h" },
    { title: "Nueva inscripción", detail: "Un alumno se inscribió a Desarrollo web con React.", time: "Ayer" },
  ],
  admin: [
    { title: "Nuevo curso pendiente", detail: "Revisa la propuesta de Diseño de interfaces digitales.", time: "Hace 12 min" },
    { title: "Pago por validar", detail: "Hay una solicitud nueva en el registro de pagos.", time: "Hace 1 h" },
    { title: "Reporte mensual listo", detail: "El resumen de septiembre ya está disponible.", time: "Ayer" },
  ],
  superadmin: [
    { title: "Nuevo usuario registrado", detail: "La institución sumó un administrador.", time: "Hace 8 min" },
    { title: "Reporte semanal disponible", detail: "Ya puedes revisar el resumen de actividad.", time: "Hace 1 h" },
  ],
};

export function DemoNotificationsPage({ role }: { role: string }) {
  const initial = notificationsByRole[role] ?? notificationsByRole.alumno;
  const [read, setRead] = useState<number[]>([]);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e7e5e4] bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#fff7ed] text-[#ea580c]"><Bell className="size-5" aria-hidden="true" /></span>
          <div>
            <h1 className="text-base font-semibold text-[#171717]">Notificaciones</h1>
            <p className="mt-0.5 text-xs text-[#78716c]">{initial.length - read.length} sin leer de {initial.length}</p>
          </div>
        </div>
        <button type="button" onClick={() => setRead(initial.map((_, index) => index))} className="inline-flex items-center gap-2 rounded-lg border border-[#e7e5e4] px-3 py-2 text-xs font-semibold text-[#44403c] hover:bg-[#fff7ed]">
          <CheckCheck className="size-4" aria-hidden="true" /> Marcar todas como leídas
        </button>
      </section>
      <section className="divide-y divide-[#fafaf9] overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white">
        {initial.map((notification, index) => {
          const isRead = read.includes(index);
          return (
            <button key={notification.title} type="button" onClick={() => setRead((current) => current.includes(index) ? current : [...current, index])} className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-[#fafaf9] ${isRead ? "opacity-60" : ""}`}>
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${isRead ? "bg-[#e7e5e4]" : "bg-[#f97316]"}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#171717]">{notification.title}</span>
                <span className="mt-1 block text-xs leading-5 text-[#78716c]">{notification.detail}</span>
                <span className="mt-1 block text-[10px] text-[#a8a29e]">{notification.time}</span>
              </span>
              {!isRead && <span className="shrink-0 rounded-full bg-[#fff7ed] px-2 py-1 text-[10px] font-semibold text-[#ea580c]">Nueva</span>}
            </button>
          );
        })}
      </section>
      <p className="text-[10px] text-[#a8a29e]">Las notificaciones son de demostración y no se guardan fuera de esta sesión.</p>
    </div>
  );
}
