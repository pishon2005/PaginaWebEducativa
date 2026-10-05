import { PageHeader } from "@/components/shared/page-header";
import { BarChart3, BookOpen, TrendingUp, Users } from "lucide-react";

const sales = [
  { course: "Python desde Cero", amount: 3820, share: 88 },
  { course: "React Avanzado", amount: 2740, share: 63 },
  { course: "Excel para negocios", amount: 1980, share: 46 },
  { course: "Diseño de interfaces", amount: 1420, share: 33 },
];

const monthlyStudents = [
  { month: "May", count: 18 }, { month: "Jun", count: 26 }, { month: "Jul", count: 32 },
  { month: "Ago", count: 29 }, { month: "Sep", count: 41 }, { month: "Oct", count: 36 },
];

export default function AdminReportesPage() {
  return (
    <div>
      <PageHeader title="Reportes" description="Métricas de ventas, alumnos y avance de cursos" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Ventas de octubre", value: "S/ 9,960", detail: "+12% vs. septiembre", icon: TrendingUp },
          { title: "Alumnos activos", value: "128", detail: "36 con actividad esta semana", icon: Users },
          { title: "Cursos publicados", value: "6", detail: "2 en preparación", icon: BookOpen },
          { title: "Inscripciones", value: "42", detail: "En los últimos 30 días", icon: BarChart3 },
        ].map(({ title, value, detail, icon: Icon }) => <article key={title} className="border border-[#dfe7e0] bg-white p-4"><div className="flex items-center justify-between"><p className="text-xs font-medium text-[#718078]">{title}</p><Icon className="size-4 text-[#708d76]" aria-hidden="true" /></div><p className="mt-3 text-2xl font-semibold text-[#1b382a]">{value}</p><p className="mt-1 text-[10px] text-[#849087]">{detail}</p></article>)}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <section className="border border-[#dfe7e0] bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold text-[#263d2e]">Ventas por curso</h2><p className="mt-1 text-[10px] text-[#849087]">Ingresos acumulados · últimos 30 días</p></div><select aria-label="Periodo de ventas" className="border border-[#dfe7e0] bg-white px-2 py-1.5 text-[10px] text-[#617067]"><option>Últimos 30 días</option><option>Este trimestre</option><option>Este año</option></select></div><div className="mt-6 space-y-4">{sales.map((sale) => <div key={sale.course}><div className="mb-1.5 flex items-center justify-between gap-2 text-xs"><span className="font-medium text-[#526358]">{sale.course}</span><span className="font-semibold text-[#405747]">S/ {sale.amount.toLocaleString("es-PE")}</span></div><div className="h-2 bg-[#edf1ed]"><div className="h-full bg-[#6e9674]" style={{ width: `${sale.share}%` }} /></div></div>)}</div><p className="mt-5 border-t border-[#edf1ed] pt-3 text-[10px] text-[#8b978e]">Datos simulados para vista previa.</p></section>
        <section className="border border-[#dfe7e0] bg-white p-5"><div><h2 className="text-sm font-semibold text-[#263d2e]">Nuevos alumnos</h2><p className="mt-1 text-[10px] text-[#849087]">Inscripciones por mes · 2026</p></div><div className="mt-7 flex h-[205px] items-end justify-between gap-2 border-b border-l border-[#e7ece7] px-3 pb-0 pt-4">{monthlyStudents.map((item) => <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] text-[#7d8a81]">{item.count}</span><div className="w-full max-w-8 bg-[#82a486]" style={{ height: `${item.count * 3}px` }} /><span className="mb-2 text-[9px] text-[#829087]">{item.month}</span></div>)}</div><div className="mt-4 flex items-center justify-between text-[10px] text-[#849087]"><span>Alumnos inscritos</span><span className="font-semibold text-[#527456]">+15% este trimestre</span></div></section>
      </div>
    </div>
  );
}