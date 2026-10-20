"use client";

import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { StudentAttendanceView } from "@/components/asistencia/student-attendance-view";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAsistenciaAlumnoSeccion, getConfiguracionAsistencia, getSeccionesByCurso, getSeccion } from "@/lib/asistencia/demo-asistencia";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AlumnoAsistenciaPage({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cursoId, setCursoId] = useState("");
  const [course, setCourse] = useState<ReturnType<typeof getDemoCourse> | null>(null);
  const [secciones, setSecciones] = useState<ReturnType<typeof getSeccionesByCurso> | null>(null);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<ReturnType<typeof getSeccion> | null>(null);
  const [asistenciaData, setAsistenciaData] = useState<ReturnType<typeof getAsistenciaAlumnoSeccion> | null>(null);
  const [configuracion, setConfiguracion] = useState<ReturnType<typeof getConfiguracionAsistencia> | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const { id } = await params;
      setCursoId(id);
      const c = getDemoCourse(id);
      setCourse(c);
      const secs = getSeccionesByCurso(id);
      setSecciones(secs);
      // Por defecto, primera sección activa
      const secActiva = secs.find((s) => s.estado === "activa") ?? secs[0];
      if (secActiva) {
        router.push(`/alumno/mis-cursos/${id}/asistencia?seccionId=${secActiva.id}`);
      }
      setCargando(false);
    };
    initData();
  }, [params, router]);

  useEffect(() => {
    const seccionId = searchParams.get("seccionId");
    if (seccionId && secciones) {
      const sec = getSeccion(seccionId);
      if (sec) {
        setSeccionSeleccionada(sec);
        const alumnoId = "4";
        setAsistenciaData(getAsistenciaAlumnoSeccion(alumnoId, seccionId));
        setConfiguracion(getConfiguracionAsistencia(seccionId));
      }
    }
  }, [searchParams, secciones]);

  const manejarCambioSeccion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaSeccionId = e.target.value;
    router.push(`/alumno/mis-cursos/${cursoId}/asistencia?seccionId=${nuevaSeccionId}`);
  };

  const manejarCambiarModalidad = async (claseId: string, modalidad: "virtual" | "presencial") => {
    console.log("Cambiar modalidad:", { claseId, modalidad });
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  if (cargando || !course || !secciones) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f97316]" aria-label="Cargando" />
        </div>
      </div>
    );
  }

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
              onChange={manejarCambioSeccion}
              className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
              aria-label="Seleccionar sección"
            >
              {secciones
                .filter((s) => s.estado === "activa")
                .map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.codigo} · {sec.modalidad === "virtual" ? "🌐 Virtual" : sec.modalidad === "presencial" ? "🏫 Presencial" : "🔄 Híbrida"}
                    {sec.horario && ` · ${sec.horario}`}
                  </option>
                ))}
            </select>
          )
        }
      />

      {seccionSeleccionada && asistenciaData && configuracion && (
        <StudentAttendanceView
          data={asistenciaData}
          onCambiarModalidad={async (claseId, modalidad) => {
            console.log("Cambiar modalidad:", { claseId, modalidad });
            await new Promise((resolve) => setTimeout(resolve, 500));
          }}
          configuracion={{
            permitirEleccionModalidad: configuracion.permitirEleccionModalidad,
            horasLimiteEleccion: configuracion.horasLimiteEleccion,
          }}
        />
      )}

      {!seccionSeleccionada && (
        <div className="rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] p-8 text-center">
          <p className="text-sm font-medium text-[#44403c]">Selecciona una sección</p>
          <p className="mt-1 text-xs text-[#78716c]">Elige una sección activa para ver tu asistencia</p>
        </div>
      )}
    </div>
  );
}