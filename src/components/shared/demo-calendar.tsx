"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CircleCheck, ClipboardList, Video } from "lucide-react";
import { demoCalendarEvents, getCourseById } from "@/lib/demo-data";

const events = demoCalendarEvents.map((event) => ({
  date: event.date,
  time: event.time,
  title: event.title,
  course: getCourseById(event.courseId).title,
  type: event.type,
}));

const weekdayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type DemoCalendarProps = {
  eyebrow?: string;
  description?: string;
};

export function DemoCalendar({
  eyebrow = "Organiza tu aprendizaje",
  description = "Clases, tareas y evaluaciones de tus cursos.",
}: DemoCalendarProps) {
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
    return <div key={`${event.date}-${event.title}`} className="flex gap-3 border-l-2 border-[#ea580c] bg-white px-3 py-3"><span className="grid size-8 shrink-0 place-items-center bg-[#fff7ed] text-[#ea580c]"><Icon className="size-4" aria-hidden="true" /></span><div><p className="text-xs font-semibold text-[#171717]">{event.title}</p><p className="mt-1 text-[10px] text-[#78716c]">{event.course} · {event.time}</p></div></div>;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#44403c]">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">Calendario</h1><p className="mt-2 text-sm text-[#44403c]">{description}</p></div><div className="flex gap-1 border border-[#e7e5e4] bg-white p-1" aria-label="Vista del calendario">{(["Mes", "Semana", "Día"] as const).map((calendarView) => <button key={calendarView} type="button" aria-pressed={view === calendarView} onClick={() => setView(calendarView)} className={`px-3 py-2 text-xs font-semibold ${view === calendarView ? "bg-[#f97316] text-white" : "text-[#44403c] hover:bg-[#fff7ed]"}`}>{calendarView}</button>)}</div></section>

      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="border border-[#e7e5e4] bg-white">
          <div className="flex items-center justify-between border-b border-[#e7e5e4] px-4 py-3 sm:px-5"><div className="flex items-center gap-3"><CalendarDays className="size-4 text-[#44403c]" aria-hidden="true" /><h2 className="text-sm font-semibold capitalize text-[#171717]">{monthName}</h2></div><div className="flex gap-1"><button type="button" aria-label="Mes anterior" onClick={() => changeMonth(-1)} className="grid size-8 place-items-center text-[#44403c] hover:bg-[#fff7ed]"><ArrowLeft className="size-4" aria-hidden="true" /></button><button type="button" aria-label="Mes siguiente" onClick={() => changeMonth(1)} className="grid size-8 place-items-center text-[#44403c] hover:bg-[#fff7ed]"><ArrowRight className="size-4" aria-hidden="true" /></button></div></div>
          {view === "Mes" && <div className="grid grid-cols-7">{weekdayNames.map((weekday) => <p key={weekday} className="border-b border-[#fafaf9] py-2 text-center text-[10px] font-semibold text-[#78716c]">{weekday}</p>)}{Array.from({ length: startOffset }, (_, index) => <div key={`empty-${index}`} className="min-h-[76px] border-b border-r border-[#fafaf9] bg-[#fff7ed] sm:min-h-[100px]" />)}{Array.from({ length: monthDays }, (_, index) => { const day = index + 1; const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const dayEvents = eventsFor(dateKey); return <button key={dateKey} type="button" onClick={() => { setSelectedDate(dateKey); setView("Día"); }} aria-label={`${day} ${monthName}${dayEvents.length ? `, ${dayEvents.length} actividades` : ""}`} aria-pressed={selectedDate === dateKey} className={`min-h-[76px] border-b border-r border-[#fafaf9] p-1.5 text-left transition hover:bg-[#fff7ed] sm:min-h-[100px] sm:p-2 ${selectedDate === dateKey ? "bg-[#fff7ed]" : "bg-white"}`}><span className={`grid size-6 place-items-center text-[10px] ${selectedDate === dateKey ? "rounded-full bg-[#f97316] font-semibold text-white" : "text-[#44403c]"}`}>{day}</span><span className="mt-1 block space-y-1">{dayEvents.slice(0, 2).map((event) => <span key={event.title} className="block truncate border-l-2 border-[#ea580c] bg-[#fff7ed] px-1 py-0.5 text-[8px] text-[#ea580c]">{event.title}</span>)}</span></button>; })}</div>}
          {view === "Semana" && <div className="grid grid-cols-7">{weekDates.map((dateKey, index) => <button key={dateKey} type="button" onClick={() => { setSelectedDate(dateKey); setView("Día"); }} className={`min-h-[250px] border-r border-[#fafaf9] p-2 text-left hover:bg-[#fff7ed] ${dateKey === selectedDate ? "bg-[#fff7ed]" : ""}`}><span className="text-[9px] font-semibold text-[#78716c]">{weekdayNames[index]}</span><span className="mt-1 block text-sm font-semibold text-[#171717]">{Number(dateKey.slice(-2))}</span><span className="mt-3 block space-y-2">{eventsFor(dateKey).map((event) => <span key={event.title} className="block border-l-2 border-[#ea580c] bg-[#fff7ed] p-1.5 text-[9px] leading-4 text-[#ea580c]">{event.time} {event.title}</span>)}</span></button>)}</div>}
          {view === "Día" && <div className="min-h-[280px] p-5"><p className="text-xs font-semibold text-[#44403c]">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p><div className="mt-4 space-y-2">{dateEvents.length ? dateEvents.map(renderEvent) : <p className="border border-dashed border-[#e7e5e4] p-8 text-center text-xs text-[#78716c]">No hay actividades programadas para este día.</p>}</div></div>}
        </div>

        <aside className="border border-[#e7e5e4] bg-white p-5"><h2 className="text-sm font-semibold text-[#171717]">Agenda del día</h2><p className="mt-1 text-xs text-[#78716c]">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}</p><div className="mt-4 space-y-2">{dateEvents.length ? dateEvents.map(renderEvent) : <p className="py-6 text-xs text-[#78716c]">No tienes actividades para este día.</p>}</div><div className="mt-5 border-t border-[#fafaf9] pt-4"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#78716c]">Zona horaria</p><p className="mt-1 text-xs text-[#44403c]">Lima · UTC-5</p></div></aside>
      </section>
    </div>
  );
}