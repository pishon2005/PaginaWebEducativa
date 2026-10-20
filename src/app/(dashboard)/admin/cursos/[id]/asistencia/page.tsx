"use client";

import { AdminCourseHeader } from "@/components/shared/admin-course-header";
import { AttendanceManager } from "@/components/asistencia/attendance-manager";
import { getDemoCourse } from "@/lib/demo-courses";
import { getAsistenciaClaseProfesor, getSeccionesByCurso, getSeccion, getClasesBySeccion } from "@/lib/asistencia/demo-asistencia";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminAsistenciaPage({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cursoId, setCursoId] = useState("");
  const [course, setCourse] = useState<ReturnType<typeof getDemoCourse> | null>(null);
  const [secciones, setSecciones] = useState<ReturnType<typeof getSeccionesByCurso> | null>(null);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<ReturnType<typeof getSeccion> | null>(null);
  const [clases, setClases] = useState<ReturnType<typeof getClasesBySeccion> | null>(null);
  const [asistenciaData, setAsistenciaData] = useState<ReturnType<typeof getAsistenciaClaseProfesor> | null>(null);
  const [claseSeleccionadaId, setClaseSeleccionadaId] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const { id } = await params;
      setCursoId(id);
      const c = getDemoCourse(id);
      setCourse(c);
      const secs = getSeccionesByCurso(id);
      setSecciones(secs);
      const secActiva = secs.find((s) => s.estado === "activa") ?? secs[0];
      if (secActiva) {
        router.push(`/admin/cursos/${id}/asistencia?seccionId=${secActiva.id}`);
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
        const cs = getClasesBySeccion(seccionId);
        setClases(cs);
        const claseId = searchParams.get("claseId") ?? cs.find((c) => c.publicado)?.id ?? cs[0]?.id ?? "";
        if (claseId) {
          setAsistenciaData(getAsistenciaClaseProfesor(seccionId, claseId));
        }
      }
    }
  }, [searchParams, secciones]);

  const manejarCambioSeccion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaSeccionId = e.target.value;
    router.push(`/admin/cursos/${cursoId}/asistencia?seccionId=${nuevaSeccionId}`);
  };

  const manejarCambioClase = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaClaseId = e.target.value;
    setClaseSeleccionadaId(nuevaClaseId);
    router.push(`/admin/cursos/${cursoId}/asistencia?seccionId=${seccionSeleccionada?.id}&claseId=${nuevaClaseId}`);
  };

  const manejarGuardar = async (registros: { alumnoId: string; estado: string; modalidadAsistencia: string; observaciones?: string }[]) => {
    console.log("Admin guardar asistencia:", registros);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const manejarExportar = () => console.log("Admin exportar asistencia");
  const manejarImportar = async (archivo: File) => console.log("Admin importar:", archivo);

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
      <AdminCourseHeader
        courseId={cursoId}
        section="asistencia"
        description={`Visualiza y gestiona la asistencia de ${course.title}.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {secciones.length > 1 && (
              <select
                value={seccionSeleccionada?.id ?? ""}
                onChange={(e) => {
                  const nuevaSeccionId = e.target.value;
                  router.push(`/admin/cursos/${cursoId}/asistencia?seccionId=${nuevaSeccionId}`);
                }}
                className="h-9 rounded-lg border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]"
                aria-label="Seleccionar sección"
              >
                {secciones
                  .filter((s) => s.estado === "activa")
                  .map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.codigo} · {sec.modalidad === "virtual" ? "🌐 Virtual" : sec.modalidad === "presencial" ? "🏫 Presencial" : "🔄 Híbrida"}
                    </option>
                  ))}
              </select>
            )}
            {seccionSeleccionada && clases && clases.length > 0 && (
              <select
                value={claseSeleccionadaId}
                onChange={(e) => {
                  const nuevaClaseId = e.target.value;
                  router.push(`/admin/cursos/${cursoId}/asistencia?seccionId=${seccionSeleccionada?.id}&claseId=${nuevaClaseId}`);
                }}
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
            )}
          </div>
        }
      />

      {seccionSeleccionada && clases && clases.length > 0 && asistenciaData ? (
        <AttendanceManager
          data={asistenciaData}
          onGuardarAsistencia={async (registros) => {
            console.log("Admin guardar asistencia:", registros);
            await new Promise((resolve) => setTimeout(resolve, 500));
          }}
          onExportar={() => console.log("Admin exportar asistencia")}
          onImportar={async (archivo) => console.log("Admin importar:", archivo)}
          soloLectura={false}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] p-8 text-center">
          <p className="text-sm font-medium text-[#44403c]">Selecciona una sección y clase</p>
          <p className="mt-1 text-xs text-[#78716c]">Elige una sección activa y una clase publicada para ver la asistencia</p>
        </div>
      )}
    </div>
  );
}