"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CircleCheck, ClipboardList, Video } from "lucide-react";

const events = [
  { date: "2026-10-07", time: "18:00", title: "Entrega: funciones en Python", course: "Fundamentos de Python", type: "tarea" },
  { date: "2026-10-09", time: "10:00", title: "Nueva clase disponible", course: "Diseño de interfaces", type: "clase" },
  { date: "2026-10-12", time: "20:00", title: "Quiz: fórmulas y funciones", course: "Excel para negocios", type: "quiz" },
  { date: "2026-10-15", time: "18:00", title: "Sesión de preguntas", course: "Fundamentos de Python", type: "clase" },
  { date: "2026-10-21", time: "23:59", title: "Entrega: proyecto final", course: "Diseño de interfaces", type: "tarea" },
];

const weekdayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function AlumnoCalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState("2026-10-07");
  const [view, setView] = useState<"Mes" | "Semana" | "Día">("Mes");
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
  const monthDays = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const dateEvents = useMemo(() => events.filter((event) => event.date === selectedDate), [selectedDate]);
  const weekDates = useMemo(() => {
    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(date);
      day.setDate(date.getDate() + index);
      return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    });
  }, [selectedDate]);

  function eventsFor(date: string) {
    return events.filter((event) => event.date === date);
  }

  function changeMonth(amount: number) {
    setCurrentMonth(new Date(year, month + amount, 1));
    setSelectedDate(`${year}-${String(month + amount + 1).padStart(2, "0")}-01`);
  }

  function renderEvent(event: (typeof events)[number]) {
    const Icon = event.type === "clase" ? Video : event.type === "quiz" ? CircleCheck : ClipboardList;
    return <div key={`${event.date}-${event.title}`} className="flex gap-3 border-l-2 border-[#76a07b] bg-white px-3 py-3"><span className="grid size-8 shrink-0 place-items-center bg-[#edf4ee] text-[#58795e]"><Icon className="size-4" aria-hidden="true" /></span><div><p className="text-xs font-semibold text-[#344a39]">{event.title}</p><p className="mt-1 text-[10px] text-[#809087]">{event.course} · {event.time}</p></div></div>;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718176]">Organiza tu aprendizaje</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183a2b]">Calendario</h1><p className="mt-2 text-sm text-[#718078]">Clases, tareas y evaluaciones de tus cursos.</p></div><div className="flex gap-1 border border-[#dfe7e0] bg-white p-1" aria-label="Vista del calendario">{(["Mes", "Semana", "Día"] as const).map((calendarView) => <button key={calendarView} type="button" aria-pressed={view === calendarView} onClick={() => setView(calendarView)} className={`px-3 py-2 text-xs font-semibold ${view === calendarView ? "bg-[#173c2d] text-white" : "text-[#637369] hover:bg-[#f3f7f3]"}`}>{calendarView}</button>)}</div></section>

      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="border border-[#dfe7e0] bg-white">
          <div className="flex items-center justify-between border-b border-[#e8ede8] px-4 py-3 sm:px-5"><div className="flex items-center gap-3"><CalendarDays className="size-4 text-[#6a886e]" aria-hidden="true" /><h2 className="text-sm font-semibold capitalize text-[#334a39]">{monthName}</h2></div><div className="flex gap-1"><button type="button" aria-label="Mes anterior" onClick={() => changeMonth(-1)} className="grid size-8 place-items-center text-[#6c7c71] hover:bg-[#f3f7f3]"><ArrowLeft className="size-4" aria-hidden="true" /></button><button type="button" aria-label="Mes siguiente" onClick={() => changeMonth(1)} className="grid size-8 place-items-center text-[#6c7c71] hover:bg-[#f3f7f3]"><ArrowRight className="size-4" aria-hidden="true" /></button></div></div>
          {view === "Mes" && <div className="grid grid-cols-7">{weekdayNames.map((weekday) => <p key={weekday} className="border-b border-[#edf1ed] py-2 text-center text-[10px] font-semibold text-[#829087]">{weekday}</p>)}{Array.from({ length: startOffset }, (_, index) => <div key={`empty-${index}`} className="min-h-[76px] border-b border-r border-[#edf1ed] bg-[#fafcfa] sm:min-h-[100px]" />)}{Array.from({ length: monthDays }, (_, index) => { const day = index + 1; const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const dayEvents = eventsFor(dateKey); return <button key={dateKey} type="button" onClick={() => { setSelectedDate(dateKey); setView("Día"); }} aria-label={`${day} ${monthName}${dayEvents.length ? `, ${dayEvents.length} actividades` : ""}`} aria-pressed={selectedDate === dateKey} className={`min-h-[76px] border-b border-r border-[#edf1ed] p-1.5 text-left transition hover:bg-[#f5f9f5] sm:min-h-[100px] sm:p-2 ${selectedDate === dateKey ? "bg-[#f2f7f2]" : "bg-white"}`}><span className={`grid size-6 place-items-center text-[10px] ${selectedDate === dateKey ? "rounded-full bg-[#315d3d] font-semibold text-white" : "text-[#536459]"}`}>{day}</span><span className="mt-1 block space-y-1">{dayEvents.slice(0, 2).map((event) => <span key={event.title} className="block truncate border-l-2 border-[#74a079] bg-[#eff5ef] px-1 py-0.5 text-[8px] text-[#4d6851]">{event.title}</span>)}</span></button>; })}</div>}
          {view === "Semana" && <div className="grid grid-cols-7">{weekDates.map((dateKey, index) => <button key={dateKey} type="button" onClick={() => { setSelectedDate(dateKey); setView("Día"); }} className={`min-h-[250px] border-r border-[#edf1ed] p-2 text-left hover:bg-[#f8faf8] ${dateKey === selectedDate ? "bg-[#f4f8f4]" : ""}`}><span className="text-[9px] font-semibold text-[#849087]">{weekdayNames[index]}</span><span className="mt-1 block text-sm font-semibold text-[#344a39]">{Number(dateKey.slice(-2))}</span><span className="mt-3 block space-y-2">{eventsFor(dateKey).map((event) => <span key={event.title} className="block border-l-2 border-[#76a07b] bg-[#edf4ee] p-1.5 text-[9px] leading-4 text-[#4d6851]">{event.time} {event.title}</span>)}</span></button>)}</div>}
          {view === "Día" && <div className="min-h-[280px] p-5"><p className="text-xs font-semibold text-[#708176]">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p><div className="mt-4 space-y-2">{dateEvents.length ? dateEvents.map(renderEvent) : <p className="border border-dashed border-[#dfe7e0] p-8 text-center text-xs text-[#829087]">No hay actividades programadas para este día.</p>}</div></div>}
        </div>

        <aside className="border border-[#dfe7e0] bg-white p-5"><h2 className="text-sm font-semibold text-[#2a4232]">Agenda del día</h2><p className="mt-1 text-xs text-[#849087]">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}</p><div className="mt-4 space-y-2">{dateEvents.length ? dateEvents.map(renderEvent) : <p className="py-6 text-xs text-[#829087]">No tienes actividades para este día.</p>}</div><div className="mt-5 border-t border-[#edf1ed] pt-4"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#849087]">Zona horaria</p><p className="mt-1 text-xs text-[#56685b]">Lima · UTC-5</p></div></aside>
      </section>
    </div>
  );
}