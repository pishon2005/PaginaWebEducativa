"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { AttendanceManager } from "@/components/asistencia/attendance-manager";
import { getUnavailableCourse } from "@/lib/services/unavailable-data";
import {
  getUnavailableTeacherAttendance,
  getUnavailableClassesBySection,
  getUnavailableSectionsByCourse,
} from "@/lib/services/unavailable-attendance";
import type { RegistroAsistencia } from "@/lib/asistencia/tipos";

export default function ProfesorAsistenciaPage() {
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
  const clases = seccionSeleccionada
    ? getUnavailableClassesBySection(seccionSeleccionada.id)
    : [];
  const claseId =
    searchParams.get("claseId") ??
    clases.find((clase) => clase.publicado)?.id ??
    clases[0]?.id;
  const claseValida = claseId
    ? clases.some((clase) => clase.id === claseId)
    : false;
  const asistenciaData =
    seccionId && claseId && claseValida
      ? getUnavailableTeacherAttendance(seccionId, claseId)
      : null;

  useEffect(() => {
    if (seccionId) return;
    if (seccionInicialId) {
      router.push(
        `/profesor/mis-cursos/${cursoId}/asistencia?seccionId=${seccionInicialId}`,
      );
    }
  }, [cursoId, router, seccionId, seccionInicialId]);

  const manejarCambioSeccion = (nuevaSeccionId: string) => {
    router.push(
      `/profesor/mis-cursos/${cursoId}/asistencia?seccionId=${nuevaSeccionId}`,
    );
  };

  const manejarCambioClase = (nuevaClaseId: string) => {
    if (!seccionSeleccionada) return;
    router.push(
      `/profesor/mis-cursos/${cursoId}/asistencia?seccionId=${seccionSeleccionada.id}&claseId=${nuevaClaseId}`,
    );
  };

  const manejarGuardar = async (registros: RegistroAsistencia[]) => {
    console.warn("El guardado de asistencia requiere un servicio conectado.", {
      registros,
    });
  };

  const manejarExportar = () => console.log("Exportar asistencia");
  const manejarImportar = async (archivo: File) =>
    console.log("Importar asistencia:", archivo);

  return (
    <div className="space-y-5">
      <TeacherCourseHeader
        courseId={cursoId}
        section="asistencia"
        description={`Toma la lista de asistencia para ${course.title}.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {secciones.length > 1 && (
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
                    </option>
                  ))}
              </select>
            )}
            {seccionSeleccionada && clases.length > 0 && (
              <select
                value={claseValida ? claseId : ""}
                onChange={(event) => manejarCambioClase(event.target.value)}
                className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
                aria-label="Seleccionar clase"
              >
                {clases
                  .filter((clase) => clase.publicado)
                  .map((clase) => (
                    <option key={clase.id} value={clase.id}>
                      Clase {clase.numero}: {clase.titulo} (
                      {clase.modalidad === "hibrida"
                        ? "Híbrida"
                        : clase.modalidad}
                      )
                    </option>
                  ))}
              </select>
            )}
          </div>
        }
      />

      {seccionSeleccionada && clases.length > 0 && asistenciaData ? (
        <AttendanceManager
          data={asistenciaData}
          onGuardarAsistencia={manejarGuardar}
          onExportar={manejarExportar}
          onImportar={manejarImportar}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] p-8 text-center">
          <p className="text-sm font-medium text-[#44403c]">
            Selecciona una sección y clase
          </p>
          <p className="mt-1 text-xs text-[#78716c]">
            Elige una sección activa y una clase publicada para tomar lista
          </p>
        </div>
      )}
    </div>
  );
}
