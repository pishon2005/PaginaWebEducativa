"use client";

import { useState, useEffect } from "react";
import { Monitor, Users, AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { ModalidadAsistencia, AsistenciaClaseAlumno, EstadoAsistencia } from "@/lib/asistencia/tipos";
import { MODALIDAD_ASISTENCIA_LABELS, ESTADO_ASISTENCIA_LABELS, ESTADO_ASISTENCIA_COLORES } from "@/lib/asistencia/tipos";

interface ModalitySelectorProps {
  clase: AsistenciaClaseAlumno;
  onCambiarModalidad: (claseId: string, modalidad: ModalidadAsistencia) => Promise<void>;
  deshabilitado?: boolean;
}

export function ModalitySelector({
  clase,
  onCambiarModalidad,
  deshabilitado = false,
}: ModalitySelectorProps) {
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<ModalidadAsistencia | null>(clase.modalidadElegida);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  // Sincronizar con prop usando useEffect
  useEffect(() => {
    setModalidadSeleccionada(clase.modalidadElegida);
  }, [clase.modalidadElegida]);

  const puedeCambiar = clase.puedeCambiarModalidad && !deshabilitado && !cargando;
  const esSoloVirtual = clase.modalidadClase === "virtual";
  const esSoloPresencial = clase.modalidadClase === "presencial";

    // Sincronizar con prop usando useEffect con key
    useEffect(() => {
      setModalidadSeleccionada(clase.modalidadElegida);
    }, [clase.modalidadElegida]);

    // Si la clase no es híbrida, no hay elección
    if (esSoloVirtual) {
    return (
      <div className="rounded-xl border border-[#e7e5e4] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Monitor className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#171717]">Clase 100% Virtual</p>
            <p className="mt-0.5 text-xs text-[#78716c]">Esta clase solo se dicta en modalidad virtual</p>
          </div>
        </div>
        {clase.asistencia && (
          <div className="mt-3 flex items-center gap-2">
            {(() => {
              const estado = clase.asistencia!.estado as EstadoAsistencia;
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[estado]}`}>
                  {estado === "presente" && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
                  {estado === "ausente" && <XCircle className="size-3.5" aria-hidden="true" />}
                  {estado === "tardanza" && <Clock className="size-3.5" aria-hidden="true" />}
                  {ESTADO_ASISTENCIA_LABELS[estado]}
                </span>
              );
            })()}
            <span className="text-xs text-[#78716c]">Asistencia registrada</span>
          </div>
        )}
      </div>
    );
  }

  if (esSoloPresencial) {
    return (
      <div className="rounded-xl border border-[#e7e5e4] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-green-50 text-green-600">
            <Users className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#171717]">Clase 100% Presencial</p>
            <p className="mt-0.5 text-xs text-[#78716c]">Esta clase solo se dicta en modalidad presencial</p>
            {clase.ubicacionPresencial && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#44403c]">
                <span className="size-3.5" aria-hidden="true">📍</span>
                {clase.ubicacionPresencial}
              </p>
            )}
          </div>
        </div>
        {clase.asistencia && (
          <div className="mt-3 flex items-center gap-2">
            {(() => {
              const estado = clase.asistencia!.estado as EstadoAsistencia;
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[estado]}`}>
                  {estado === "presente" && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
                  {estado === "ausente" && <XCircle className="size-3.5" aria-hidden="true" />}
                  {estado === "tardanza" && <Clock className="size-3.5" aria-hidden="true" />}
                  {ESTADO_ASISTENCIA_LABELS[estado]}
                </span>
              );
            })()}
            <span className="text-xs text-[#78716c]">Asistencia registrada</span>
          </div>
        )}
      </div>
    );
  }

  // Clase híbrida - mostrar selector
  const manejarCambio = async (nuevaModalidad: ModalidadAsistencia) => {
    if (!puedeCambiar || modalidadSeleccionada === nuevaModalidad) return;

    setCargando(true);
    setError(null);
    setExito(null);

    try {
      await onCambiarModalidad(clase.claseId, nuevaModalidad);
      setModalidadSeleccionada(nuevaModalidad);
      setExito(`Modalidad cambiada a ${MODALIDAD_ASISTENCIA_LABELS[nuevaModalidad]}`);
        } catch {
      setError("No se pudo cambiar la modalidad. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const horasRestantes = clase.horasRestantesEleccion ?? 0;
  const tiempoAgotado = horasRestantes <= 0;

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="grid size-12 place-items-center rounded-xl bg-purple-50 text-purple-600">
            <Users className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#171717]">Clase Híbrida</p>
            <p className="mt-0.5 text-xs text-[#78716c]">Elige cómo asistirás a esta sesión</p>
            {clase.ubicacionPresencial && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#44403c]">
                <span className="size-3.5" aria-hidden="true">📍</span>
                {clase.ubicacionPresencial}
              </p>
            )}
          </div>
        </div>

        {tiempoAgotado && (
          <div className="flex items-center gap-1.5 shrink-0 rounded-full bg-[#fff4f2] px-3 py-1.5 text-xs font-semibold text-[#a24135]">
            <AlertTriangle className="size-3.5" aria-hidden="true" />
            Tiempo agotado
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#fff4f2] px-3 py-2 text-xs text-[#a24135]" role="alert">
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      {exito && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#f0fdf4] px-3 py-2 text-xs text-[#166534]" role="status">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          {exito}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Opción Virtual */}
        <button
          type="button"
          onClick={() => manejarCambio("virtual")}
          disabled={!puedeCambiar || tiempoAgotado || cargando}
          aria-pressed={modalidadSeleccionada === "virtual"}
          className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
            modalidadSeleccionada === "virtual"
              ? "border-[#f97316] bg-[#fff7ed] shadow-sm shadow-orange-100"
              : "border-[#e7e5e4] bg-white hover:border-[#f97316] hover:bg-[#fff7ed]"
          } ${!puedeCambiar || tiempoAgotado ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="grid size-14 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Monitor className="size-7" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#171717]">Virtual</p>
            <p className="mt-0.5 text-xs text-[#78716c]">Videoconferencia en vivo</p>
          </div>
          {modalidadSeleccionada === "virtual" && (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Seleccionada
            </span>
          )}
          {cargando && modalidadSeleccionada === "virtual" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80">
              <div className="size-5 animate-spin border-2 border-[#e7e5e4] border-t-[#f97316] rounded-full" aria-label="Cargando" />
            </div>
          )}
        </button>

        {/* Opción Presencial */}
        <button
          type="button"
          onClick={() => manejarCambio("presencial")}
          disabled={!puedeCambiar || tiempoAgotado || cargando}
          aria-pressed={modalidadSeleccionada === "presencial"}
          className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
            modalidadSeleccionada === "presencial"
              ? "border-[#f97316] bg-[#fff7ed] shadow-sm shadow-orange-100"
              : "border-[#e7e5e4] bg-white hover:border-[#f97316] hover:bg-[#fff7ed]"
          } ${!puedeCambiar || tiempoAgotado ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="grid size-14 place-items-center rounded-xl bg-green-50 text-green-600">
            <Users className="size-7" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#171717]">Presencial</p>
            <p className="mt-0.5 text-xs text-[#78716c]">En el aula física</p>
          </div>
          {modalidadSeleccionada === "presencial" && (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Seleccionada
            </span>
          )}
          {cargando && modalidadSeleccionada === "presencial" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80">
              <div className="size-5 animate-spin border-2 border-[#e7e5e4] border-t-[#f97316] rounded-full" aria-label="Cargando" />
            </div>
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#78716c]">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          <span>
            {tiempoAgotado
              ? "Plazo de elección finalizado"
              : `Puedes cambiar hasta ${horasRestantes}h antes de la clase`}
          </span>
        </div>
        {clase.modalidadElegida && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fafaf9] px-2.5 py-1 text-xs font-medium text-[#44403c]">
            Actual: {MODALIDAD_ASISTENCIA_LABELS[clase.modalidadElegida]}
          </span>
        )}
      </div>

      {/* Estado de asistencia si ya está registrada */}
      {clase.asistencia && (
        <div className="mt-4 pt-4 border-t border-[#fafaf9]">
          <p className="text-xs font-semibold text-[#44403c]">Tu asistencia</p>
          <div className="mt-2 flex items-center gap-2">
            {(() => {
              const estado = clase.asistencia!.estado as EstadoAsistencia;
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[estado]}`}>
                  {estado === "presente" && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
                  {estado === "ausente" && <XCircle className="size-3.5" aria-hidden="true" />}
                  {estado === "tardanza" && <Clock className="size-3.5" aria-hidden="true" />}
                  {ESTADO_ASISTENCIA_LABELS[estado]}
                </span>
              );
            })()}
            <span className="text-xs text-[#78716c]">
              Registrada como {MODALIDAD_ASISTENCIA_LABELS[clase.asistencia.modalidadAsistencia ?? "virtual"]} ·{" "}
              {clase.asistencia.fechaRegistro?.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" }) ?? "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}