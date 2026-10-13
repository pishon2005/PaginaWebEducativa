import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";

const resourceGroups = [
  {
    title: "Guías de instalación",
    description: "Python, Arduino IDE, drivers y entornos de desarrollo listos para usar.",
    icon: "/img/libro.png",
    items: ["Python 3.12 + VS Code", "Arduino IDE y drivers CH340", "Node.js y npm", "Git y GitHub Desktop"],
  },
  {
    title: "Códigos de ejemplo",
    description: "Proyectos base comentados para que experimentes sin empezar desde cero.",
    icon: "/img/tuerca.png",
    items: ["Hola mundo en Python", "Blink con ESP32", "API REST con Express", "Componente React reutilizable"],
  },
  {
    title: "Plantillas de proyectos",
    description: "Estructuras listas para robótica, IoT y aplicaciones web.",
    icon: "/img/procesador.png",
    items: ["Seguidor de línea base", "Dashboard IoT con MQTT", "Landing page responsive", "Análisis de datos con Pandas"],
  },
  {
    title: "Comunidad y soporte",
    description: "Espacios para resolver dudas y compartir avances con otros estudiantes.",
    icon: "/img/personas.png",
    items: ["Foro de estudiantes", "Sesiones de preguntas en vivo", "Canal de Discord", "Mentorías 1 a 1"],
  },
];

export default function RecursosPage() {
  return (
    <div className="bg-neutral-50">
      <section className="border-b border-neutral-200 bg-white px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Siempre a tu alcance</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">Recursos para seguir construyendo</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Materiales de apoyo, guías y herramientas que complementan tu aprendizaje dentro y fuera de clase.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            {resourceGroups.map(({ title, description, icon, items }) => (
              <article key={title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-neutral-950 shadow-sm shadow-orange-500/10">
                    <Image src={icon} alt="" width={40} height={40} className="size-9 object-contain" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-950">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-700">
                      <FileText className="size-4 shrink-0 text-orange-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition-colors hover:text-orange-800">
                  <Download className="size-4" aria-hidden="true" />
                  Descargar pack demo
                </button>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-neutral-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-400">¿Necesitas algo específico?</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Solicita un recurso para tu proyecto</h2>
              </div>
              <Link href="/cursos" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-600">
                Explorar cursos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
