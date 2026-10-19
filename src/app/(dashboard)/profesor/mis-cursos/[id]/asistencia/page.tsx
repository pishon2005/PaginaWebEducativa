"use client";

import { TeacherCourseHeader } from "@/components/shared/teacher-course-header";
import { AttendanceManager } from "@/components/asistencia/attendance-manager";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAsistenciaClaseProfesor, getClasesConModalidad } from "@/lib/asistencia/demo-asistencia";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProfesorAsistenciaPage({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cursoId, setCursoId] = useState("");
  const [course, setCourse] = useState<ReturnType<typeof getDemoCourse> | null>(null);
  const [clases, setClases] = useState<ReturnType<typeof getClasesConModalidad> | null>(null);
  const [asistenciaData, setAsistenciaData] = useState<ReturnType<typeof getAsistenciaClaseProfesor> | null>(null);
  const [claseSeleccionadaId, setClaseSeleccionadaId] = useState("");
  const [cargando, setCargando] = useState(true);

  // Inicializar datos
  useEffect(() => {
    const initData = async () => {
      const { id } = await params;
      setCursoId(id);
      const c = getDemoCourse(id);
      setCourse(c);
      const cs = getClasesConModalidad(id);
      setClases(cs);
      const claseId = searchParams.get("claseId") ?? cs.find((c) => c.publicado)?.id ?? cs[0]?.id ?? "";
      setClaseSeleccionadaId(claseId);
      if (claseId) {
        setAsistenciaData(getAsistenciaClaseProfesor(id, claseId));
      }
      setCargando(false);
    };
    initData();
  }, [params, searchParams]);

  const manejarCambioClase = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaClaseId = e.target.value;
    setClaseSeleccionadaId(nuevaClaseId);
    router.push(`/profesor/mis-cursos/${cursoId}/asistencia?claseId=${nuevaClaseId}`);
  };

  const manejarGuardar = async (registros: { alumnoId: string; estado: string; modalidadAsistencia: string; observaciones?: string }[]) => {
    console.log("Guardar asistencia:", registros);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const manejarExportar = () => console.log("Exportar asistencia");
  const manejarImportar = async (archivo: File) => console.log("Importar asistencia:", archivo);

  if (cargando || !course || !clases) {
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
      <TeacherCourseHeader
        courseId={cursoId}
        section="asistencia"
        description={`Toma la lista de asistencia para ${course.title}.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={claseSeleccionadaId}
              onChange={manejarCambioClase}
              className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
              aria-label="Seleccionar clase"
            >
              {clases
                .filter((c) => c.publicado)
                .map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    Clase {clase.numero}: {clase.titulo} ({clase.modalidad === "hibrida" ? "Híbrida" : clase.modalidad})
                  </option>
                ))}
            </select>
          </div>
        }
      />

      {asistenciaData ? (
        <AttendanceManager
          data={asistenciaData}
          onGuardarAsistencia={manejarGuardar}
          onExportar={manejarExportar}
          onImportar={manejarImportar}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] p-8 text-center">
          <p className="text-sm font-medium text-[#44403c]">No hay clases disponibles</p>
          <p className="mt-1 text-xs text-[#78716c]">Crea y publica una clase desde la pestaña Contenido</p>
        </div>
      )}
    </div>
  );
}