"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Paperclip, Search, Send, UsersRound } from "lucide-react";

type DemoChatProps = {
  role: "alumno" | "profesor";
  courseName?: string;
};

type ChatMessage = {
  id: number;
  author: string;
  initials: string;
  content: string;
  time: string;
  own?: boolean;
};

const initialMessages: ChatMessage[] = [
  { id: 1, author: "Ana María Campos", initials: "AC", content: "¡Hola! Ya está disponible la práctica de esta semana. Si se traban con el ejercicio de funciones, escriban por aquí y lo revisamos juntos.", time: "09:14" },
  { id: 2, author: "Valeria Rojas", initials: "VR", content: "Gracias, profesora. ¿La entrega incluye también el archivo con el código?", time: "09:22" },
  { id: 3, author: "Ana María Campos", initials: "AC", content: "Sí, sube el archivo .py y agrega una breve explicación de cómo resolviste cada punto.", time: "09:25" },
  { id: 4, author: "Tú", initials: "AN", content: "Perfecto, muchas gracias. Lo estaré subiendo hoy.", time: "09:31", own: true },
];

const studentConversations = [
  { name: "Fundamentos de Python", detail: "Ana María Campos · Curso", unread: 2, initials: "PY" },
  { name: "Ana María Campos", detail: "Profesora · Directo", unread: 0, initials: "AC" },
  { name: "Equipo de estudio", detail: "Valeria, Diego y tú", unread: 1, initials: "ES" },
];

const teacherConversations = [
  { name: "Fundamentos de Python", detail: "Chat del curso · 54 alumnos", unread: 8, initials: "PY" },
  { name: "Valeria Rojas", detail: "Alumna · Python desde Cero", unread: 1, initials: "VR" },
  { name: "Excel para negocios", detail: "Chat del curso · 42 alumnos", unread: 0, initials: "EX" },
];

export function DemoChat({ role, courseName }: DemoChatProps) {
  const conversations = role === "profesor" ? teacherConversations : studentConversations;
  const [activeName, setActiveName] = useState(courseName ?? conversations[0].name);
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [attachment, setAttachment] = useState("");
  const [mobileThreadOpen, setMobileThreadOpen] = useState(Boolean(courseName));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = conversations.find(
    (conversation) => conversation.name === activeName,
  );
  const filteredConversations = useMemo(
    () => conversations.filter((conversation) => conversation.name.toLowerCase().includes(search.toLowerCase())),
    [conversations, search],
  );

  useEffect(() => {
    if (mobileThreadOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, mobileThreadOpen]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() && !attachment) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        author: "Tú",
        initials: role === "profesor" ? "AC" : "VR",
        content: message.trim() || `Archivo adjunto: ${attachment}`,
        time: new Intl.DateTimeFormat("es-PE", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
        own: true,
      },
    ]);
    setMessage("");
    setAttachment("");
  }

  return (
    <section className="grid h-[min(680px,calc(100dvh-14rem))] min-h-[380px] overflow-hidden rounded-2xl border border-[#dfe7e0] bg-white shadow-[0_16px_45px_-38px_rgba(24,58,43,0.6)] md:min-h-[480px] md:grid-cols-[minmax(240px,280px)_minmax(0,1fr)]">
      <aside className={`${mobileThreadOpen ? "hidden md:flex" : "flex"} min-h-0 flex-col border-b border-[#e8ede8] bg-[#fcfdfb] md:border-r md:border-b-0`}>
        <div className="border-b border-[#e8ede8] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#263d2e]">Conversaciones</p>
            <span className="rounded-full bg-[#edf4ee] px-2 py-1 text-[10px] font-semibold text-[#55715c]">{conversations.length}</span>
          </div>
          <label className="relative mt-3 block">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#87948a]" aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar conversación" aria-label="Buscar conversación" className="h-10 w-full rounded-xl border border-[#e1e8e1] bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#78967c] focus:ring-2 focus:ring-[#e5eee5]" />
          </label>
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
          {filteredConversations.map((conversation) => (
            <button key={conversation.name} type="button" onClick={() => { setActiveName(conversation.name); setMobileThreadOpen(true); }} aria-pressed={activeName === conversation.name} className={`flex w-full min-w-0 items-center gap-3 rounded-xl p-3 text-left transition ${activeName === conversation.name ? "bg-[#edf4ee]" : "hover:bg-[#f1f5f1]"}`}>
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e1ebe2] text-xs font-bold text-[#496c4f]">{conversation.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-[#33493a]">{conversation.name}</span>
                <span className="mt-1 block truncate text-[10px] text-[#849087]">{conversation.detail}</span>
              </span>
              {conversation.unread > 0 && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#4c7654] text-[10px] font-semibold text-white">{conversation.unread}</span>}
            </button>
          ))}
          {filteredConversations.length === 0 && <p className="px-3 py-5 text-xs text-[#839087]">No hay conversaciones con ese nombre.</p>}
        </div>
      </aside>

      <div className={`${mobileThreadOpen ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col`}>
        <header className="flex min-w-0 items-center gap-3 border-b border-[#e8ede8] bg-white px-3 py-3.5 sm:px-4 md:px-5">
          <button type="button" onClick={() => setMobileThreadOpen(false)} aria-label="Volver a conversaciones" className="grid size-9 shrink-0 place-items-center rounded-xl text-[#607366] transition hover:bg-[#f1f5f1] md:hidden">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e3ece4] text-[10px] font-bold text-[#496c4f]">{activeConversation?.initials ?? "AN"}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#263d2e]">{activeName}</p>
            <p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-[#7e8b81]"><span className="size-1.5 shrink-0 rounded-full bg-[#6d9b70]" /> {activeConversation?.detail ?? courseName ?? (role === "profesor" ? "Vista docente · mensajes" : "Vista alumno · mensajes")}</p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 text-[10px] text-[#77857b] sm:flex"><UsersRound className="size-3.5" aria-hidden="true" /> {role === "profesor" ? "54 participantes" : "12 participantes"}</span>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,#fbfcfa,#f5f8f4)] p-3 sm:p-4 md:p-6" aria-label="Historial de mensajes" aria-live="polite">
          <p className="mx-auto w-fit rounded-full border border-[#e6ebe6] bg-white px-3 py-1 text-[10px] text-[#89958c] shadow-sm">Hoy</p>
          {messages.map((chatMessage) => (
            <div key={chatMessage.id} className={`flex gap-2.5 ${chatMessage.own ? "justify-end" : "justify-start"}`}>
              {!chatMessage.own && <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e3ece4] text-[10px] font-bold text-[#496c4f]">{chatMessage.initials}</span>}
              <div className={`min-w-0 max-w-[calc(100%-2.5rem)] sm:max-w-[85%] ${chatMessage.own ? "text-right" : ""}`}>
                <p className="mb-1 text-[10px] font-semibold text-[#77857b]">{chatMessage.own ? "Tú" : chatMessage.author}</p>
                <p className={`whitespace-pre-wrap px-4 py-3 text-xs leading-5 shadow-sm ${chatMessage.own ? "rounded-2xl rounded-br-md bg-[#1d4b35] text-white" : "rounded-2xl rounded-bl-md border border-[#e4eae4] bg-white text-[#47584b]"}`}>{chatMessage.content}</p>
                <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#98a29b]">{chatMessage.time} {chatMessage.own && <Check className="size-3 text-[#709477]" aria-label="Enviado" />}</p>
              </div>
              {chatMessage.own && <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e3ece4] text-[10px] font-bold text-[#496c4f]">{chatMessage.initials}</span>}
            </div>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <form onSubmit={sendMessage} className="border-t border-[#e8ede8] bg-white p-3 md:p-4">
          {attachment && <p className="mb-2 text-[10px] text-[#59705e]">Adjunto: {attachment}</p>}
          <div className="flex items-center gap-2">
            <label className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-[#77857b] transition hover:bg-[#f1f5f1]" title="Adjuntar archivo" aria-label="Adjuntar archivo">
              <Paperclip className="size-4" aria-hidden="true" />
              <input type="file" accept=".pdf,.zip,.png,.jpg,.jpeg" className="sr-only" aria-label="Seleccionar archivo adjunto" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? "")} />
            </label>
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribe un mensaje..." aria-label="Escribe un mensaje" className="h-11 min-w-0 flex-1 rounded-xl border border-[#dfe7e0] bg-[#fbfcfa] px-4 text-xs outline-none transition focus:border-[#78967c] focus:bg-white focus:ring-2 focus:ring-[#e5eee5]" />
            <button type="submit" aria-label="Enviar mensaje" className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#173c2d] text-white shadow-sm transition hover:bg-[#24543e]"><Send className="size-4" aria-hidden="true" /></button>
          </div>
          <p className="mt-2 pl-10 text-[9px] text-[#9aa49d]">Conversación de demostración</p>
        </form>
      </div>
    </section>
  );
}