"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Download, Upload, CheckCircle2, XCircle, Clock, ShieldCheck, Users, Monitor, MoreVertical, AlertTriangle, Info } from "lucide-react";
import type { AsistenciaClaseProfesor, EstadoAsistencia, ModalidadAsistencia, RegistroAsistencia } from "@/lib/asistencia/tipos";
import { ESTADO_ASISTENCIA_LABELS, ESTADO_ASISTENCIA_COLORES, MODALIDAD_ASISTENCIA_LABELS, METODO_REGISTRO_LABELS } from "@/lib/asistencia/tipos";

interface AttendanceManagerProps {
  data: AsistenciaClaseProfesor;
  onGuardarAsistencia: (registros: RegistroAsistencia[]) => Promise<void>;
  onExportar?: () => void;
  onImportar?: (archivo: File) => Promise<void>;
  cargando?: boolean;
  soloLectura?: boolean;
}

const ESTADOS: readonly EstadoAsistencia[] = ["presente", "ausente", "tardanza", "justificado"] as const;
const MODALIDADES: readonly ModalidadAsistencia[] = ["virtual", "presencial"] as const;

// Función para crear el estado inicial de registros
function crearRegistrosIniciales(data: AsistenciaClaseProfesor): Record<string, { estado: EstadoAsistencia; modalidad: ModalidadAsistencia; observaciones: string }> {
  const iniciales: Record<string, { estado: EstadoAsistencia; modalidad: ModalidadAsistencia; observaciones: string }> = {};
  data.alumnos.forEach((alumno) => {
    if (alumno.asistencia) {
      iniciales[alumno.alumnoId] = {
        estado: alumno.asistencia.estado,
        modalidad: alumno.asistencia.modalidadAsistencia,
        observaciones: alumno.asistencia.observaciones ?? "",
      };
    } else {
      iniciales[alumno.alumnoId] = {
        estado: "presente",
        modalidad: alumno.modalidadElegida ?? "virtual",
        observaciones: "",
      };
    }
  });
  return iniciales;
}

export function AttendanceManager({
  data,
  onGuardarAsistencia,
  onExportar,
  onImportar,
  cargando = false,
  soloLectura = false,
}: AttendanceManagerProps) {
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState<ModalidadAsistencia | "todas">("todas");
  const [filtroEstado, setFiltroEstado] = useState<EstadoAsistencia | "todos">("todos");
  const [registros, setRegistros] = useState<Record<string, { estado: EstadoAsistencia; modalidad: ModalidadAsistencia; observaciones: string }>>(() => crearRegistrosIniciales(data));
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [mostrarSoloSinRegistro, setMostrarSoloSinRegistro] = useState(false);

  // Ref para rastrear si ya se inicializó (evitar setState en primer render)
  const inicializadoRef = useRef(false);

  // Actualizar registros cuando cambien los alumnos (nuevos alumnos)
  useEffect(() => {
    // Solo actualizar después del primer render para evitar cascading renders
    if (!inicializadoRef.current) {
      inicializadoRef.current = true;
      return;
    }
    setRegistros((prev) => {
      const nuevosRegistros = { ...prev };
      let hayCambios = false;
      data.alumnos.forEach((alumno) => {
        if (!nuevosRegistros[alumno.alumnoId]) {
          nuevosRegistros[alumno.alumnoId] = {
            estado: alumno.asistencia?.estado ?? "presente",
            modalidad: alumno.modalidadElegida ?? "virtual",
            observaciones: alumno.asistencia?.observaciones ?? "",
          };
          hayCambios = true;
        }
      });
      return hayCambios ? nuevosRegistros : prev;
    });
  }, [data.alumnos]);

  // Alumnos filtrados
  const alumnosFiltrados = useMemo(() => {
    return data.alumnos.filter((alumno) => {
      const registro = registros[alumno.alumnoId];
      const coincideBusqueda =
        alumno.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        alumno.apellido.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        alumno.email.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        (alumno.codigoAlumno?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ?? false);

      const coincideModalidad = filtroModalidad === "todas" || registro?.modalidad === filtroModalidad;
      const coincideEstado = filtroEstado === "todos" || registro?.estado === filtroEstado;
      const coincideSinRegistro = !mostrarSoloSinRegistro || !alumno.asistencia;

      return coincideBusqueda && coincideModalidad && coincideEstado && coincideSinRegistro;
    });
  }, [data.alumnos, registros, filtroBusqueda, filtroModalidad, filtroEstado, mostrarSoloSinRegistro]);

  // Estadísticas en tiempo real
  const stats = useMemo(() => {
    const presentes = Object.values(registros).filter((r) => r.estado === "presente").length;
    const ausentes = Object.values(registros).filter((r) => r.estado === "ausente").length;
    const tardanzas = Object.values(registros).filter((r) => r.estado === "tardanza").length;
    const justificados = Object.values(registros).filter((r) => r.estado === "justificado").length;
    const virtual = Object.values(registros).filter((r) => r.modalidad === "virtual").length;
    const presencial = Object.values(registros).filter((r) => r.modalidad === "presencial").length;

    return { presentes, ausentes, tardanzas, justificados, virtual, presencial, total: data.totalInscritos };
  }, [registros, data.totalInscritos]);

  const manejarCambioEstado = (alumnoId: string, nuevoEstado: EstadoAsistencia) => {
    setRegistros((prev) => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], estado: nuevoEstado },
    }));
  };

  const manejarCambioModalidad = (alumnoId: string, nuevaModalidad: ModalidadAsistencia) => {
    setRegistros((prev) => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], modalidad: nuevaModalidad },
    }));
  };

  const manejarCambioObservaciones = (alumnoId: string, observaciones: string) => {
    setRegistros((prev) => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], observaciones },
    }));
  };

  const manejarGuardar = async () => {
    if (cargando || guardando) return;

    setGuardando(true);
    setMensaje(null);

    try {
      const registrosParaGuardar: RegistroAsistencia[] = Object.entries(registros).map(([alumnoId, reg]) => ({
        alumnoId,
        estado: reg.estado,
        modalidadAsistencia: reg.modalidad,
        observaciones: reg.observaciones || undefined,
      }));

      await onGuardarAsistencia(registrosParaGuardar);
      setMensaje({ tipo: "exito", texto: "Asistencia guardada correctamente" });
        } catch {
      setMensaje({ tipo: "error", texto: "Error al guardar la asistencia. Intenta de nuevo." });
    } finally {
      setGuardando(false);
    }
  };

  const manejarMarcarTodos = (estado: EstadoAsistencia) => {
    const nuevosRegistros = { ...registros };
    data.alumnos.forEach((alumno) => {
      nuevosRegistros[alumno.alumnoId] = {
        ...nuevosRegistros[alumno.alumnoId],
        estado,
      };
    });
    setRegistros(nuevosRegistros);
  };

  const manejarToggleExpandir = (alumnoId: string) => {
    setExpandidos((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(alumnoId)) nuevo.delete(alumnoId);
      else nuevo.add(alumnoId);
      return nuevo;
    });
  };

  const hayCambios = useMemo(() => {
    return data.alumnos.some((alumno) => {
      const reg = registros[alumno.alumnoId];
      const original = alumno.asistencia;
      if (!original && reg.estado !== "presente") return true;
      if (!original) return false;
      return (
        original.estado !== reg.estado ||
        original.modalidadAsistencia !== reg.modalidad ||
        (original.observaciones ?? "") !== (reg.observaciones ?? "")
      );
    });
  }, [data.alumnos, registros]);

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <div className="rounded-2xl border border-[#e7e5e4] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">Tomar lista: {data.clase.titulo}</h2>
            <p className="mt-1 text-xs text-[#78716c]">
              {data.clase.modalidad === "hibrida" && "Clase híbrida · "}
              Semana {data.clase.semana?.numero ?? "?"} · Clase {data.clase.numero} ·{" "}
              {data.clase.duracionMinutos ? `${data.clase.duracionMinutos} min` : "Sin duración"}
            </p>
            {data.clase.ubicacionPresencial && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#44403c]">
                <span aria-hidden="true">📍</span>
                {data.clase.ubicacionPresencial}
                {data.clase.capacidadPresencial && ` · Cupo máx: ${data.clase.capacidadPresencial}`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex gap-1 bg-[#fafaf9] rounded-lg p-1">
              {ESTADOS.map((estado) => {
                const config = {
                  presente: { label: "Presentes", icon: CheckCircle2, color: "green" },
                  ausente: { label: "Ausentes", icon: XCircle, color: "red" },
                  tardanza: { label: "Tardanzas", icon: Clock, color: "yellow" },
                  justificado: { label: "Justificados", icon: ShieldCheck, color: "blue" },
                }[estado];
                const Icon = config.icon;
                const count = stats[`${estado}s` as keyof typeof stats] ?? 0;
                return (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => manejarMarcarTodos(estado)}
                    disabled={soloLectura || cargando || guardando}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      count > 0 ? `bg-${config.color}-100 text-${config.color}-800` : "text-[#78716c] hover:bg-[#e7e5e4]"
                    } ${soloLectura ? "opacity-50" : ""}`}
                    title={`Marcar todos como ${config.label.toLowerCase()}`}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {count}
                  </button>
                );
              })}
            </div>

            {!soloLectura && (
              <>
                {onExportar && (
                  <button
                    type="button"
                    onClick={onExportar}
                    disabled={cargando || guardando}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-semibold text-[#44403c] transition hover:bg-[#fafaf9]"
                    title="Exportar a CSV"
                  >
                    <Download className="size-3.5" aria-hidden="true" />
                    Exportar
                  </button>
                )}
                {onImportar && (
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-semibold text-[#44403c] cursor-pointer transition hover:bg-[#fafaf9]">
                    <Upload className="size-3.5" aria-hidden="true" />
                    Importar
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="sr-only"
                      onChange={(e) => e.target.files?.[0] && onImportar!(e.target.files[0])}
                      disabled={cargando || guardando}
                    />
                  </label>
                )}
                <button
                  type="button"
                  onClick={manejarGuardar}
                  disabled={cargando || guardando || !hayCambios || soloLectura}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#f97316] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {guardando ? (
                    <>
                      <div className="size-3.5 animate-spin border-2 border-white/30 border-t-white rounded-full" aria-hidden="true" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar asistencia"
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats por modalidad */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#44403c]">
            <Monitor className="size-3.5 text-blue-600" aria-hidden="true" />
            <span>Virtual: <strong>{stats.virtual}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#44403c]">
            <Users className="size-3.5 text-green-600" aria-hidden="true" />
            <span>Presencial: <strong>{stats.presencial}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#78716c]">
            <Users className="size-3.5" aria-hidden="true" />
            <span>Total inscritos: <strong>{stats.total}</strong></span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#e7e5e4] bg-white p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a8a29e]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar alumno (nombre, email, código)..."
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-[#e7e5e4] bg-white text-sm placeholder:text-[#a8a29e] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
            aria-label="Buscar alumno"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroModalidad}
            onChange={(e) => setFiltroModalidad(e.target.value as ModalidadAsistencia | "todas")}
            className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
            aria-label="Filtrar por modalidad"
          >
            <option value="todas">Todas las modalidades</option>
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoAsistencia | "todos")}
            className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="presente">Presente</option>
            <option value="ausente">Ausente</option>
            <option value="tardanza">Tardanza</option>
            <option value="justificado">Justificado</option>
          </select>

          <label className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#44403c] cursor-pointer transition hover:bg-[#fafaf9]">
            <input
              type="checkbox"
              checked={mostrarSoloSinRegistro}
              onChange={(e) => setMostrarSoloSinRegistro(e.target.checked)}
              className="accent-[#f97316]"
            />
            Solo sin registro
          </label>
        </div>
      </div>

      {/* Mensajes */}
      {mensaje && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-xs ${
            mensaje.tipo === "exito"
              ? "bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534]"
              : "bg-[#fff4f2] border border-[#fecaca] text-[#a24135]"
          }`}
          role={mensaje.tipo === "exito" ? "status" : "alert"}
        >
          {mensaje.tipo === "exito" ? <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" /> : <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />}
          {mensaje.texto}
        </div>
      )}

      {/* Lista de alumnos */}
      <div className="space-y-2" role="list" aria-label="Lista de alumnos para tomar asistencia">
        {alumnosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] px-6 py-8 text-center">
            <Users className="size-12 text-[#a8a29e]" aria-hidden="true" />
            <p className="text-sm font-medium text-[#44403c]">No hay alumnos que coincidan</p>
            <p className="text-xs text-[#78716c]">Intenta ajustar los filtros o la búsqueda</p>
          </div>
        ) : (
          alumnosFiltrados.map((alumno) => {
            const registro = registros[alumno.alumnoId];
            const expandido = expandidos.has(alumno.alumnoId);
            const tieneAsistenciaPrevia = !!alumno.asistencia;
            const metodoOriginal = alumno.asistencia?.metodoRegistro;

            return (
              <article
                key={alumno.alumnoId}
                className={`overflow-hidden rounded-xl border bg-white transition-all ${
                  expandido ? "border-[#f97316] shadow-sm" : "border-[#e7e5e4] hover:border-[#f97316]"
                }`}
                role="listitem"
              >
                <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fff7ed] text-xs font-bold text-[#ea580c]">
                    {alumno.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#171717]">
                      {alumno.nombre} {alumno.apellido}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#78716c]">{alumno.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Modalidad elegida por el alumno */}
                    {alumno.modalidadElegida && (
                      <span className="hidden inline-flex items-center gap-1 rounded-full bg-[#fafaf9] px-2.5 py-1 text-[10px] font-medium text-[#44403c] sm:inline-flex">
                        <Monitor className="size-3" aria-hidden="true" />
                        {MODALIDAD_ASISTENCIA_LABELS[alumno.modalidadElegida]}
                      </span>
                    )}

                    {/* Estado actual */}
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_ASISTENCIA_COLORES[registro?.estado ?? "presente"]}`}>
                      {registro?.estado === "presente" && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
                      {registro?.estado === "ausente" && <XCircle className="size-3.5" aria-hidden="true" />}
                      {registro?.estado === "tardanza" && <Clock className="size-3.5" aria-hidden="true" />}
                      {registro?.estado === "justificado" && <ShieldCheck className="size-3.5" aria-hidden="true" />}
                      {ESTADO_ASISTENCIA_LABELS[registro?.estado ?? "presente"]}
                    </span>

                    {/* Modalidad de asistencia actual */}
                    <span className="hidden inline-flex items-center gap-1 rounded-full bg-[#fafaf9] px-2.5 py-1 text-[10px] font-medium text-[#44403c] sm:inline-flex">
                      {registro?.modalidad === "virtual" ? <Monitor className="size-3" aria-hidden="true" /> : <Users className="size-3" aria-hidden="true" />}
                      {MODALIDAD_ASISTENCIA_LABELS[registro?.modalidad ?? "virtual"]}
                    </span>

                    {/* Indicador de registro previo */}
                    {tieneAsistenciaPrevia && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 py-1 text-[10px] font-medium text-[#92400e]" title={`Registrado vía ${METODO_REGISTRO_LABELS[metodoOriginal ?? "manual"]}`}>
                        <Info className="size-3" aria-hidden="true" />
                        Previo
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => manejarToggleExpandir(alumno.alumnoId)}
                      aria-expanded={expandido}
                      aria-label={expandido ? `Ocultar detalles de ${alumno.nombre}` : `Ver detalles de ${alumno.nombre}`}
                      className="grid size-9 place-items-center rounded-lg border border-[#e7e5e4] text-[#44403c] transition hover:bg-[#fff7ed]"
                    >
                      <MoreVertical className={`size-4 transition-transform ${expandido ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Detalles expandidos */}
                {expandido && (
                  <div className="border-t border-[#fafaf9] bg-[#fafaf9] px-4 py-3">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Selector de estado */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Estado</label>
                        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Estado de asistencia para ${alumno.nombre} ${alumno.apellido}`}>
                          {ESTADOS.map((estado) => (
                            <button
                              key={estado}
                              type="button"
                              onClick={() => manejarCambioEstado(alumno.alumnoId, estado)}
                              disabled={soloLectura || cargando || guardando}
                              aria-pressed={registro?.estado === estado}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                registro?.estado === estado
                                  ? ESTADO_ASISTENCIA_COLORES[estado]
                                  : "bg-white text-[#44403c] hover:bg-[#fafaf9] border border-[#e7e5e4]"
                              } ${soloLectura ? "opacity-50" : ""}`}
                            >
                              {estado === "presente" && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
                              {estado === "ausente" && <XCircle className="size-3.5" aria-hidden="true" />}
                              {estado === "tardanza" && <Clock className="size-3.5" aria-hidden="true" />}
                              {estado === "justificado" && <ShieldCheck className="size-3.5" aria-hidden="true" />}
                              {ESTADO_ASISTENCIA_LABELS[estado]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Selector de modalidad */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Modalidad</label>
                        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Modalidad de asistencia para ${alumno.nombre} ${alumno.apellido}`}>
                          {MODALIDADES.map((modalidad) => (
                            <button
                              key={modalidad}
                              type="button"
                              onClick={() => manejarCambioModalidad(alumno.alumnoId, modalidad)}
                              disabled={soloLectura || cargando || guardando}
                              aria-pressed={registro?.modalidad === modalidad}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                registro?.modalidad === modalidad
                                  ? "border-[#f97316] bg-[#fff7ed] text-[#ea580c]"
                                  : "bg-white text-[#44403c] hover:bg-[#fafaf9] border border-[#e7e5e4]"
                              } ${soloLectura ? "opacity-50" : ""}`}
                            >
                              {modalidad === "virtual" ? <Monitor className="size-3.5" aria-hidden="true" /> : <Users className="size-3.5" aria-hidden="true" />}
                              {MODALIDAD_ASISTENCIA_LABELS[modalidad]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Observaciones */}
                      <div className="sm:col-span-2 lg:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78716c]">Observaciones</label>
                        <textarea
                          value={registro?.observaciones ?? ""}
                          onChange={(e) => manejarCambioObservaciones(alumno.alumnoId, e.target.value)}
                          placeholder="Observaciones opcionales..."
                          rows={2}
                          disabled={soloLectura || cargando || guardando}
                          className="w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-xs text-[#171717] placeholder:text-[#a8a29e] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316] disabled:opacity-50"
                          aria-label={`Observaciones para ${alumno.nombre} ${alumno.apellido}`}
                        />
                      </div>

                      {/* Info del alumno */}
                      <div className="sm:col-span-2 lg:col-span-2 space-y-1 text-[10px] text-[#78716c]">
                        <p>Código: <span className="text-[#44403c]">{alumno.codigoAlumno ?? "—"}</span></p>
                        {tieneAsistenciaPrevia && alumno.asistencia && (
                          <>
                            <p>Registrado: <span className="text-[#44403c]">{alumno.asistencia.fechaRegistro.toLocaleString("es-PE")}</span></p>
                            <p>Método: <span className="text-[#44403c]">{METODO_REGISTRO_LABELS[alumno.asistencia.metodoRegistro]}</span></p>
                            {alumno.asistencia.observaciones && (
                              <p>Obs. original: <span className="text-[#44403c]">{alumno.asistencia.observaciones}</span></p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}

        {/* Resumen de cambios pendientes */}
        {hayCambios && !soloLectura && (
          <div className="rounded-xl border border-[#f97316] bg-[#fff7ed] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#ea580c]">
                <AlertTriangle className="size-5" aria-hidden="true" />
                <span>Hay cambios sin guardar</span>
              </div>
              <button
                type="button"
                onClick={manejarGuardar}
                disabled={guardando}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#f97316] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ea580c]"
              >
                {guardando ? "Guardando..." : "Guardar ahora"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}