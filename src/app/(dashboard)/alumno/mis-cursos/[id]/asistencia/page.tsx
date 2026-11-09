"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { StudentAttendanceView } from "@/components/asistencia/student-attendance-view";
import { getUnavailableCourse } from "@/lib/services/unavailable-data";
import {
  getUnavailableStudentAttendance,
  getUnavailableAttendanceConfiguration,
  getUnavailableSectionsByCourse,
} from "@/lib/services/unavailable-attendance";
import type { ModalidadAsistencia } from "@/lib/asistencia/tipos";

export default function AlumnoAsistenciaPage() {
  const { id: cursoId } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = getUnavailableCourse(cursoId);
  const secciones = getUnavailableSectionsByCourse(cursoId);
  const seccionInicialId =
    secciones.find((seccion) => seccion.estado === "activa")?.id ??
    secciones[0]?.id;
  const seccionId = searchParams.get("seccionId");
  const seccionSeleccionada = seccionId
    ? secciones.find((seccion) => seccion.id === seccionId)
    : undefined;
  const asistenciaData = seccionSeleccionada
    ? getUnavailableStudentAttendance("4", seccionSeleccionada.id)
    : null;
  const configuracion = seccionSeleccionada
    ? getUnavailableAttendanceConfiguration(seccionSeleccionada.id)
    : null;

  useEffect(() => {
    if (seccionId) return;
    if (seccionInicialId) {
      router.push(
        `/alumno/mis-cursos/${cursoId}/asistencia?seccionId=${seccionInicialId}`,
      );
    }
  }, [cursoId, router, seccionId, seccionInicialId]);

  const manejarCambioSeccion = (nuevaSeccionId: string) => {
    router.push(
      `/alumno/mis-cursos/${cursoId}/asistencia?seccionId=${nuevaSeccionId}`,
    );
  };

  const manejarCambiarModalidad = async (
    claseId: string,
    modalidad: ModalidadAsistencia,
  ) => {
    console.warn("La selección de modalidad requiere un servicio conectado.", {
      claseId,
      modalidad,
    });
  };

  return (
    <div className="space-y-5">
      <StudentCourseHeader
        courseId={cursoId}
        section="asistencia"
        description={`${course.title} · revisa tu historial de asistencia y elige modalidad para clases híbridas.`}
        action={
          secciones.length > 1 && (
            <select
              value={seccionSeleccionada?.id ?? ""}
              onChange={(event) => manejarCambioSeccion(event.target.value)}
              className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
              aria-label="Seleccionar sección"
            >
              {secciones
                .filter((seccion) => seccion.estado === "activa")
                .map((seccion) => (
                  <option key={seccion.id} value={seccion.id}>
                    {seccion.codigo} ·{" "}
                    {seccion.modalidad === "virtual"
                      ? "🌐 Virtual"
                      : seccion.modalidad === "presencial"
                        ? "🏫 Presencial"
                        : "🔄 Híbrida"}
                    {seccion.horario && ` · ${seccion.horario}`}
                  </option>
                ))}
            </select>
          )
        }
      />

      {seccionSeleccionada && asistenciaData && configuracion && (
        <StudentAttendanceView
          data={asistenciaData}
          onCambiarModalidad={manejarCambiarModalidad}
          configuracion={{
            permitirEleccionModalidad: configuracion.permitirEleccionModalidad,
            horasLimiteEleccion: configuracion.horasLimiteEleccion,
          }}
        />
      )}

      {!seccionSeleccionada && (
        <div className="rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] p-8 text-center">
          <p className="text-sm font-medium text-[#44403c]">
            Selecciona una sección
          </p>
          <p className="mt-1 text-xs text-[#78716c]">
            Elige una sección activa para ver tu asistencia
          </p>
        </div>
      )}
    </div>
  );
}
