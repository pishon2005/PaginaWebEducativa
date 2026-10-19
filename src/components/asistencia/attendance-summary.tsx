"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, XCircle, Clock, ShieldCheck, Users, Monitor, AlertTriangle, ArrowRight } from "lucide-react";
import React from "react";
import type { AsistenciaAlumnoCurso, EstadoAsistencia } from "@/lib/asistencia/tipos";
import { ESTADO_ASISTENCIA_LABELS, ESTADO_ASISTENCIA_COLORES, MODALIDAD_LABELS, MODALIDAD_ASISTENCIA_LABELS } from "@/lib/asistencia/tipos";

interface AttendanceSummaryProps {
  data: AsistenciaAlumnoCurso;
  cursoId: string;
  maxItems?: number;
}

export function AttendanceSummary({ data, cursoId, maxItems = 3 }: AttendanceSummaryProps) {
  const [vista, setVista] = useState<"proximas" | "recientes">("proximas");

  const proximasClases = useMemo(() => {
    return data.clases
      .filter((c) => !c.asistencia || c.asistencia.estado === null)
      .sort((a, b) => a.claseNumero - b.claseNumero);
  }, [data.clases]);

  const recientesClases = useMemo(() => {
    return data.clases
      .filter((c) => c.asistencia && c.asistencia.estado !== null)
      .sort((a, b) => b.claseNumero - a.claseNumero);
  }, [data.clases]);

  const clasesAMostrar = vista === "proximas" ? proximasClases.slice(0, maxItems) : recientesClases.slice(0, maxItems);
  const hayMas = vista === "proximas" ? proximasClases.length > maxItems : recientesClases.length > maxItems;

  const getIconoEstado = (estado: EstadoAsistencia) => {
      switch (estado) {
        case "presente": return CheckCircle2;
        case "ausente": return XCircle;
        case "tardanza": return Clock;
        case "justificado": return ShieldCheck;
      }
    };

  return (
    <div className="space-y-4">
      {/* Header con resumen */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e7e5e4] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#fff7ed] text-[#ea580c]">
            <Calendar className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#171717]">Mi asistencia</p>
            <p className="mt-0.5 text-xs text-[#78716c]">{data.resumen.porcentajeAsistencia}% · {data.resumen.asistidas}/{data.resumen.totalClases} clases</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVista("proximas")}
            aria-pressed={vista === "proximas"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${vista === "proximas" ? "bg-[#f97316] text-white" : "text-[#78716c] hover:bg-[#fafaf9]"}`}
          >
            Próximas
          </button>
          <button
            type="button"
            onClick={() => setVista("recientes")}
            aria-pressed={vista === "recientes"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${vista === "recientes" ? "bg-[#f97316] text-white" : "text-[#78716c] hover:bg-[#fafaf9]"}`}
          >
            Recientes
          </button>
          <Link
            href={`/alumno/mis-cursos/${cursoId}/asistencia`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#f97316] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#ea580c]"
          >
            Ver todo
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { estado: "presente", label: "Presente", icon: CheckCircle2, color: "green", valor: data.resumen.asistidas },
          { estado: "ausente", label: "Ausente", icon: XCircle, color: "red", valor: data.resumen.ausentes },
        ].map(({ estado, label, icon: Icon, color, valor }) => (
          <div key={estado} className="rounded-xl border border-[#e7e5e4] bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">{label}</span>
              <Icon className={`size-4 text-${color}-600`} aria-hidden="true" />
            </div>
            <p className="mt-1 text-2xl font-bold text-[#171717]">{valor}</p>
          </div>
        ))}
      </div>

      {/* Lista de clases */}
      <div className="space-y-2" role="list" aria-label={vista === "proximas" ? "Próximas clases" : "Clases recientes"}>
        {clasesAMostrar.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] p-6 text-center">
            <Calendar className="size-10 mx-auto text-[#a8a29e]" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-[#44403c]">
              {vista === "proximas" ? "No hay clases próximas" : "No hay clases recientes"}
            </p>
            <p className="mt-1 text-xs text-[#78716c]">
              {vista === "proximas" ? "Las próximas clases aparecerán aquí" : "Tu historial de asistencia se mostrará aquí"}
            </p>
          </div>
        ) : (
          clasesAMostrar.map((clase) => {
            const tieneAsistencia = !!clase.asistencia && clase.asistencia.estado !== null;
                        const estado = clase.asistencia?.estado;

            return (
              <article
                key={clase.claseId}
                className="rounded-xl border border-[#e7e5e4] bg-white p-3 hover:border-[#f97316] transition-colors"
                role="listitem"
              >
                <Link
                  href={`/alumno/mis-cursos/${cursoId}/clases/${clase.claseNumero}`}
                  className="flex flex-wrap items-center gap-3"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fff7ed] text-xs font-bold text-[#ea580c]">
                    {clase.claseNumero}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#171717]">{clase.claseTitulo}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#78716c]">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        clase.modalidadClase === "virtual" ? "bg-blue-50 text-blue-700" :
                        clase.modalidadClase === "presencial" ? "bg-green-50 text-green-700" :
                        "bg-purple-50 text-purple-700"
                      }`}>
                        {clase.modalidadClase === "virtual" && <Monitor className="size-3" aria-hidden="true" />}
                        {clase.modalidadClase === "presencial" && <Users className="size-3" aria-hidden="true" />}
                        {clase.modalidadClase === "hibrida" && <Users className="size-3" aria-hidden="true" />}
                        {MODALIDAD_LABELS[clase.modalidadClase]}
                      </span>
                      {clase.modalidadElegida && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fafaf9] px-2 py-0.5 text-[10px] font-medium text-[#44403c]">
                          {clase.modalidadElegida === "virtual" ? <Monitor className="size-3" aria-hidden="true" /> : <Users className="size-3" aria-hidden="true" />}
                          {MODALIDAD_ASISTENCIA_LABELS[clase.modalidadElegida]}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {tieneAsistencia && estado ? (
                                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[estado]}`}>
                                            {React.createElement(getIconoEstado(estado), { className: "size-3.5", "aria-hidden": "true" })}
                                            {ESTADO_ASISTENCIA_LABELS[estado]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fafaf9] px-3 py-1 text-xs font-medium text-[#a8a29e]">
                        <AlertTriangle className="size-3.5" aria-hidden="true" />
                        Pendiente
                      </span>
                    )}

                    {clase.modalidadClase === "hibrida" && !tieneAsistencia && clase.puedeCambiarModalidad && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2 py-1 text-[10px] font-semibold text-[#ea580c]">
                        <AlertTriangle className="size-3" aria-hidden="true" />
                        Elegir modalidad
                      </span>
                    )}

                    <ArrowRight className="size-4 text-[#a8a29e]" aria-hidden="true" />
                  </div>
                </Link>
              </article>
            );
          })
        )}

        {hayMas && (
          <Link
            href={`/alumno/mis-cursos/${cursoId}/asistencia`}
            className="block text-center rounded-xl border border-[#e7e5e4] bg-white px-4 py-3 text-xs font-semibold text-[#ea580c] hover:bg-[#fff7ed] transition-colors"
          >
            Ver todas las clases ({vista === "proximas" ? proximasClases.length : recientesClases.length})
          </Link>
        )}
      </div>
    </div>
  );
}