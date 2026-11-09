import { MessageCircle, Phone } from "lucide-react";
import { EDUKATECH_WHATSAPP_URL } from "@/lib/whatsapp";

export function WhatsAppContact() {
  return (
    <a
      href={EDUKATECH_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      aria-label="Contactar a EDUKATECH por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] sm:bottom-7 sm:right-7"
    >
      <MessageCircle aria-hidden="true" className="size-8" strokeWidth={2.2} />
      <Phone
        aria-hidden="true"
        className="absolute size-3.5"
        strokeWidth={3}
      />
      <span className="sr-only">Abrir conversación en WhatsApp</span>
    </a>
  );
}
