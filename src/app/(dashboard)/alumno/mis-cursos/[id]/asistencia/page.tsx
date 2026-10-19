"use client";

import { StudentCourseHeader } from "@/components/shared/student-course-header";
import { StudentAttendanceView } from "@/components/asistencia/student-attendance-view";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAsistenciaAlumnoCurso, getConfiguracionAsistencia } from "@/lib/asistencia/demo-asistencia";
import { useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AlumnoAsistenciaPage({ params }: Props) {
  const [cursoId, setCursoId] = useState("");
  const [course, setCourse] = useState<ReturnType<typeof getDemoCourse> | null>(null);
  const [asistenciaData, setAsistenciaData] = useState<ReturnType<typeof getAsistenciaAlumnoCurso> | null>(null);
  const [configuracion, setConfiguracion] = useState<ReturnType<typeof getConfiguracionAsistencia> | null>(null);
  const [cargando, setCargando] = useState(true);

  // Inicializar datos en el cliente
  const initData = async () => {
    const { id } = await params;
    setCursoId(id);
    const c = getDemoCourse(id);
    setCourse(c);
    const alumnoId = "4";
    setAsistenciaData(getAsistenciaAlumnoCurso(alumnoId, id));
    setConfiguracion(getConfiguracionAsistencia(id));
    setCargando(false);
  };

  // Ejecutar inicialización
  if (typeof window !== "undefined" && !cursoId) {
    initData();
  }

  const manejarCambiarModalidad = async (claseId: string, modalidad: "virtual" | "presencial") => {
    console.log("Cambiar modalidad:", { claseId, modalidad });
    await new Promise((resolve) => setTimeout(resolve, 500));
    // En producción: llamar a API real y actualizar estado local
  };

  if (cargando || !course || !asistenciaData || !configuracion) {
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
      />

      <StudentAttendanceView
        data={asistenciaData}
        onCambiarModalidad={manejarCambiarModalidad}
        configuracion={{
          permitirEleccionModalidad: configuracion.permitirEleccionModalidad,
          horasLimiteEleccion: configuracion.horasLimiteEleccion,
        }}
      />
    </div>
  );
}