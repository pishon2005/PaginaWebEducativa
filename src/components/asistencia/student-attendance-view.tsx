"use client";

import { useState, useMemo } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, ShieldCheck, Monitor, Users, AlertTriangle, Filter } from "lucide-react";
import React from "react";
import type { AsistenciaAlumnoSeccion, EstadoAsistencia, ModalidadAsistencia, ModalidadClase, Asistencia } from "@/lib/asistencia/tipos";
import { MODALIDAD_LABELS, MODALIDAD_ASISTENCIA_LABELS, ESTADO_ASISTENCIA_LABELS, ESTADO_ASISTENCIA_COLORES } from "@/lib/asistencia/tipos";

const ESTADOS: readonly EstadoAsistencia[] = ["presente", "ausente", "tardanza", "justificado"] as const;

interface StudentAttendanceViewProps {
  data: AsistenciaAlumnoSeccion;
  onCambiarModalidad?: (claseId: string, modalidad: ModalidadAsistencia) => Promise<void>;
  configuracion?: {
    permitirEleccionModalidad: boolean;
    horasLimiteEleccion: number;
  };
  cargando?: boolean;
}

export function StudentAttendanceView({
  data,
  onCambiarModalidad,
  configuracion,
  cargando = false,
}: StudentAttendanceViewProps) {
  const [filtroEstado, setFiltroEstado] = useState<EstadoAsistencia | "todos">("todos");
  const [filtroModalidad, setFiltroModalidad] = useState<ModalidadClase | "todas">("todas");
  const [vista, setVista] = useState<"lista" | "calendario">("lista");
  const [claseExpandida, setClaseExpandida] = useState<string | null>(null);

  const clasesFiltradas = useMemo(() => {
    return data.clases.filter((clase) => {
      const estado = clase.asistencia?.estado ?? null;
      const coincideEstado = filtroEstado === "todos" || estado === filtroEstado;
      const coincideModalidad = filtroModalidad === "todas" || clase.modalidadClase === filtroModalidad;
      return coincideEstado && coincideModalidad;
    });
  }, [data.clases, filtroEstado, filtroModalidad]);

  const proximasClases = useMemo(() => {
    return data.clases
      .filter((c) => !c.asistencia || c.asistencia.estado === null)
      .slice(0, 3);
  }, [data.clases]);

  const clasesPasadas = useMemo(() => {
    return data.clases.filter((c) => c.asistencia && c.asistencia.estado !== null);
  }, [data.clases]);

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
      {/* Resumen general */}
      <div className="rounded-2xl border border-[#e7e5e4] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">Mi asistencia en {data.cursoTitulo}</h2>
            <p className="mt-1 text-xs text-[#78716c]">Resumen de tu participación en el curso</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex gap-1 bg-[#fafaf9] rounded-lg p-1">
              {ESTADOS.map((estado) => {
                const config = {
                  presente: { label: "Asistidas", color: "green", key: "asistidas" },
                  ausente: { label: "Ausentes", color: "red", key: "ausentes" },
                  tardanza: { label: "Tardanzas", color: "yellow", key: "tardanzas" },
                  justificado: { label: "Justificadas", color: "blue", key: "justificados" },
                }[estado];
                const Icon = getIconoEstado(estado);
                const value = data.resumen[config.key as keyof typeof data.resumen] ?? 0;
                return (
                  <div key={estado} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
                    {React.createElement(Icon, { className: "size-3.5", "aria-hidden": "true" })}
                    {value}
                  </div>
                );
              })}
            </div>
            <div className="rounded-full border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#ea580c]">
              {data.resumen.porcentajeAsistencia}% asistencia
            </div>
          </div>
        </div>

        {/* Próximas clases */}
        {proximasClases.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#fafaf9]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#78716c] mb-3">Próximas clases</p>
            <div className="flex flex-wrap gap-2">
              {proximasClases.map((clase) => (
                <button
                  key={clase.claseId}
                  type="button"
                  onClick={() => setClaseExpandida(claseExpandida === clase.claseId ? null : clase.claseId)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-xs font-medium text-[#44403c] transition hover:border-[#f97316] hover:bg-[#fff7ed]"
                >
                  <span className="rounded-full bg-[#fff7ed] px-2 py-0.5 text-[10px] font-bold text-[#ea580c]">
                    Clase {clase.claseNumero}
                  </span>
                  <span className="truncate max-w-[200px]">{clase.claseTitulo}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    clase.modalidadClase === "virtual" ? "bg-blue-50 text-blue-700" :
                    clase.modalidadClase === "presencial" ? "bg-green-50 text-green-700" :
                    "bg-purple-50 text-purple-700"
                  }`}>
                    {clase.modalidadClase === "virtual" && <Monitor className="size-3" aria-hidden="true" />}
                    {clase.modalidadClase === "presencial" && <Users className="size-3" aria-hidden="true" />}
                    {clase.modalidadClase === "hibrida" && <Users className="size-3" aria-hidden="true" />}
                    {MODALIDAD_LABELS[clase.modalidadClase as "virtual" | "presencial" | "hibrida"]}
                  </span>
                  {clase.modalidadElegida && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fafaf9] px-2 py-0.5 text-[10px] font-medium text-[#44403c]">
                      Tu elección: {MODALIDAD_ASISTENCIA_LABELS[clase.modalidadElegida as "virtual" | "presencial"]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#e7e5e4] bg-white p-3">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-[#a8a29e]" aria-hidden="true" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoAsistencia | "todos")}
            className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
            aria-label="Filtrar por estado de asistencia"
          >
            <option value="todos">Todos los estados</option>
            <option value="presente">Presente</option>
            <option value="ausente">Ausente</option>
            <option value="tardanza">Tardanza</option>
            <option value="justificado">Justificado</option>
            <option value="sin_registro">Sin registro</option>
          </select>

          <select
            value={filtroModalidad}
            onChange={(e) => setFiltroModalidad(e.target.value as ModalidadClase | "todas")}
            className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
            aria-label="Filtrar por modalidad de clase"
          >
            <option value="todas">Todas las modalidades</option>
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
            <option value="hibrida">Híbrida</option>
          </select>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 border-l border-[#e7e5e4] pl-3">
          <button
            type="button"
            onClick={() => setVista("lista")}
            aria-pressed={vista === "lista"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${vista === "lista" ? "bg-[#f97316] text-white" : "text-[#78716c] hover:bg-[#fafaf9]"}`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setVista("calendario")}
            aria-pressed={vista === "calendario"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${vista === "calendario" ? "bg-[#f97316] text-white" : "text-[#78716c] hover:bg-[#fafaf9]"}`}
          >
            <Calendar className="size-3.5" aria-hidden="true" />
            Calendario
          </button>
        </div>
      </div>

      {/* Vista Lista */}
      {vista === "lista" && (
        <div className="space-y-2" role="list" aria-label="Historial de asistencia">
          {clasesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] px-6 py-8 text-center">
              <Calendar className="size-12 text-[#a8a29e]" aria-hidden="true" />
              <p className="text-sm font-medium text-[#44403c]">No hay clases que coincidan</p>
              <p className="text-xs text-[#78716c]">Intenta ajustar los filtros</p>
            </div>
          ) : (
            clasesFiltradas.map((clase) => {
              const expandida = claseExpandida === clase.claseId;
              const tieneAsistencia = !!clase.asistencia && clase.asistencia.estado !== null;
              const estado = clase.asistencia?.estado;
              const modalidadAsistencia = clase.asistencia?.modalidadAsistencia;

              return (
                <article
                  key={clase.claseId}
                  className={`overflow-hidden rounded-xl border bg-white transition-all ${
                    expandida ? "border-[#f97316] shadow-sm" : "border-[#e7e5e4] hover:border-[#f97316]"
                  }`}
                  role="listitem"
                >
                  <button
                    type="button"
                    onClick={() => setClaseExpandida(expandida ? null : clase.claseId)}
                    className="w-full flex flex-wrap items-center gap-3 px-4 py-3.5 text-left"
                    aria-expanded={expandida}
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
                                                    {MODALIDAD_LABELS[clase.modalidadClase as "virtual" | "presencial" | "hibrida"]}
                        </span>
                        {clase.ubicacionPresencial && (
                          <span className="flex items-center gap-1">
                            <span aria-hidden="true">📍</span>
                            {clase.ubicacionPresencial}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {tieneAsistencia && estado && (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[estado as EstadoAsistencia]}`}>
                          {React.createElement(getIconoEstado(estado), { className: "size-3.5", "aria-hidden": "true" })}
                          {ESTADO_ASISTENCIA_LABELS[estado as EstadoAsistencia]}
                        </span>
                      )}
                      {!tieneAsistencia && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fafaf9] px-3 py-1 text-xs font-medium text-[#a8a29e]">
                          <AlertTriangle className="size-3.5" aria-hidden="true" />
                          Pendiente
                        </span>
                      )}

                      {clase.modalidadElegida && (
                        <span className="hidden inline-flex items-center gap-1 rounded-full bg-[#fafaf9] px-2.5 py-1 text-[10px] font-medium text-[#44403c] sm:inline-flex">
                          {clase.modalidadElegida === "virtual" ? <Monitor className="size-3" aria-hidden="true" /> : <Users className="size-3" aria-hidden="true" />}
                          {MODALIDAD_ASISTENCIA_LABELS[clase.modalidadElegida as "virtual" | "presencial"]}
                        </span>
                      )}

                      <span className="grid size-9 place-items-center text-[#a8a29e]">
                        {expandida ? <span className="rotate-180">▲</span> : <span>▼</span>}
                      </span>
                    </div>
                  </button>

                  {expandida && (
                    <div className="border-t border-[#fafaf9] bg-[#fafaf9] px-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Modalidad de la clase</p>
                          <p className="text-sm text-[#171717]">{MODALIDAD_LABELS[clase.modalidadClase as "virtual" | "presencial" | "hibrida"]}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Tu elección</p>
                          <p className="text-sm text-[#171717]">
                            {clase.modalidadElegida
                                                        ? MODALIDAD_ASISTENCIA_LABELS[clase.modalidadElegida as "virtual" | "presencial"]
                              : <span className="text-[#a8a29e]">No elegida</span>}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Tu asistencia</p>
                          {tieneAsistencia && estado ? (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[estado as EstadoAsistencia]}`}>
                                {React.createElement(getIconoEstado(estado), { className: "size-3.5", "aria-hidden": "true" })}
                                {ESTADO_ASISTENCIA_LABELS[estado as EstadoAsistencia]}
                              </span>
                              <span className="text-xs text-[#78716c]">
                                {modalidadAsistencia && `(${MODALIDAD_ASISTENCIA_LABELS[modalidadAsistencia as "virtual" | "presencial"]})`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-[#a8a29e]">Pendiente de registrar</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Registrado</p>
                          {tieneAsistencia && clase.asistencia?.fechaRegistro ? (
                            <p className="text-sm text-[#171717]">
                              {clase.asistencia.fechaRegistro.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                          ) : (
                            <span className="text-sm text-[#a8a29e]">—</span>
                          )}
                        </div>

                        {clase.ubicacionPresencial && (
                          <div className="sm:col-span-2 lg:col-span-2 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Ubicación presencial</p>
                            <p className="flex items-center gap-1.5 text-sm text-[#171717]">
                              <span aria-hidden="true">📍</span>
                              {clase.ubicacionPresencial}
                            </p>
                          </div>
                        )}

                        {tieneAsistencia && clase.asistencia?.metodoRegistro && (
                          <div className="sm:col-span-2 lg:col-span-2 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Método de registro</p>
                            <p className="text-sm text-[#171717]">{clase.asistencia.metodoRegistro === "manual" ? "Manual (Profesor)" : clase.asistencia.metodoRegistro === "qr" ? "Código QR" : clase.asistencia.metodoRegistro === "self" ? "Auto-registro" : "Importado"}</p>
                          </div>
                        )}

                        {clase.asistencia && 'observaciones' in clase.asistencia && (clase.asistencia as Asistencia).observaciones && (
                          <div className="sm:col-span-2 lg:col-span-4 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Observaciones</p>
                            <p className="text-sm text-[#44403c]">{(clase.asistencia as Asistencia).observaciones}</p>
                          </div>
                        )}

                        {/* Selector de modalidad para clases híbridas futuras */}
                        {configuracion?.permitirEleccionModalidad &&
                          clase.modalidadClase === "hibrida" &&
                          !tieneAsistencia &&
                          clase.puedeCambiarModalidad && (
                          <div className="sm:col-span-2 lg:col-span-4 space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Elige tu modalidad</p>
                            <div className="flex flex-wrap gap-2">
                              {["virtual", "presencial"].map((mod) => (
                                <button
                                  key={mod}
                                  type="button"
                                  onClick={() => onCambiarModalidad?.(clase.claseId, mod as ModalidadAsistencia)}
                                  disabled={cargando}
                                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                                    clase.modalidadElegida === mod
                                      ? "border-[#f97316] bg-[#fff7ed] text-[#ea580c]"
                                      : "border border-[#e7e5e4] bg-white text-[#44403c] hover:border-[#f97316] hover:bg-[#fff7ed]"
                                  }`}
                                >
                                  {mod === "virtual" ? <Monitor className="size-3.5" aria-hidden="true" /> : <Users className="size-3.5" aria-hidden="true" />}
                                  {MODALIDAD_ASISTENCIA_LABELS[mod as ModalidadAsistencia]}
                                </button>
                              ))}
                            </div>
                            {clase.horasRestantesEleccion !== null && clase.horasRestantesEleccion > 0 && (
                              <p className="flex items-center gap-1.5 text-[10px] text-[#78716c]">
                                <AlertTriangle className="size-3.5" aria-hidden="true" />
                                Puedes cambiar hasta {clase.horasRestantesEleccion}h antes de la clase
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Vista Calendario - Placeholder */}
      {vista === "calendario" && (
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 text-center">
          <Calendar className="size-12 mx-auto text-[#a8a29e]" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-[#171717]">Vista de calendario</h3>
          <p className="mt-1 text-xs text-[#78716c]">Próximamente: visualización mensual de tu asistencia</p>
        </div>
      )}
    </div>
  );
}