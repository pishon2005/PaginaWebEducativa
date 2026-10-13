import Link from "next/link";
import { ArrowLeft, Check, Minus } from "lucide-react";

const permissions = [
  { action: "Ver y administrar cursos", superadmin: true, admin: true, profesor: "Propios", alumno: false },
  { action: "Gestionar usuarios", superadmin: true, admin: true, profesor: false, alumno: false },
  { action: "Aprobar pagos", superadmin: true, admin: true, profesor: false, alumno: false },
  { action: "Crear y calificar actividades", superadmin: true, admin: true, profesor: "Propios", alumno: false },
  { action: "Entregar tareas y resolver quizzes", superadmin: false, admin: false, profesor: false, alumno: true },
  { action: "Ver notas propias", superadmin: false, admin: false, profesor: false, alumno: true },
  { action: "Participar en el chat", superadmin: true, admin: true, profesor: true, alumno: true },
  { action: "Ver reportes y configurar sitio", superadmin: true, admin: true, profesor: false, alumno: false },
  { action: "Gestionar roles y permisos", superadmin: true, admin: false, profesor: false, alumno: false },
];

function PermissionValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ea580c]"><Check className="size-4" aria-label="Permitido" /></span>;
  if (typeof value === "string") return <span className="text-[10px] font-semibold text-[#ea580c]">{value}</span>;
  return <Minus className="mx-auto size-4 text-[#a8a29e]" aria-label="Sin acceso" />;
}

export default function SuperadminRolesPage() {
  return (
    <div className="space-y-7">
      <section>
        <Link href="/superadmin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:text-[#f97316]"><ArrowLeft className="size-3.5" aria-hidden="true" /> Panel superadmin</Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#44403c]">Control de plataforma</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Roles y permisos</h1>
        <p className="mt-2 text-sm text-[#44403c]">Matriz de capacidades definida para el prototipo según la especificación.</p>
      </section>

      <section className="overflow-x-auto border border-[#e7e5e4] bg-white">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-[#fff7ed] text-[10px] uppercase tracking-[0.09em] text-[#44403c]"><tr><th className="w-[38%] px-4 py-3 font-semibold">Capacidad</th><th className="px-4 py-3 text-center font-semibold">Superadmin</th><th className="px-4 py-3 text-center font-semibold">Admin</th><th className="px-4 py-3 text-center font-semibold">Profesor</th><th className="px-4 py-3 text-center font-semibold">Alumno</th></tr></thead>
          <tbody className="divide-y divide-[#fafaf9]">{permissions.map((permission) => <tr key={permission.action} className="hover:bg-[#fff7ed]"><th className="px-4 py-3.5 font-medium text-[#ea580c]">{permission.action}</th><td className="px-4 py-3.5 text-center"><PermissionValue value={permission.superadmin} /></td><td className="px-4 py-3.5 text-center"><PermissionValue value={permission.admin} /></td><td className="px-4 py-3.5 text-center"><PermissionValue value={permission.profesor} /></td><td className="px-4 py-3.5 text-center"><PermissionValue value={permission.alumno} /></td></tr>)}</tbody>
        </table>
      </section>
      <p className="text-xs leading-5 text-[#78716c]">Los permisos se muestran como referencia de producto. La demo no aplica autorización real; cada vista está abierta para exploración.</p>
    </div>
  );
}