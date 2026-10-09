import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/public/hero";
import {
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Users,
} from "lucide-react";

const technologies = [
  { label: "Python", icon: "/img/python.png" },
  { label: "MicroPython", icon: "/img/libro.png" },
  { label: "ESP32", icon: "/img/procesador.png" },
  { label: "Electrónica", icon: "/img/rayo_minimalista.png" },
  { label: "IoT", icon: "/img/redwifi.png" },
];

const features = [
  { label: "Clases 100% prácticas", icon: "/img/sombrerodegraduación.png" },
  { label: "Proyectos reales", icon: "/img/tuerca.png" },
  { label: "Acompañamiento del docente", icon: "/img/personas.png" },
  { label: "Modalidad virtual y presencial", icon: "/img/icono_laptop.png" },
  {
    label: "Enfocado en tu futuro profesional",
    icon: "/img/icono_crecimiento.png",
  },
];

const courses: {
  slug: string;
  title: string;
  classes: string;
  modality: string;
  label: string;
  icon: string;
  artwork: string;
}[] = [
    {
      slug: "curso-1",
      title: "Fundamentos de Python",
      classes: "9 clases",
      modality: "Virtual",
      label: "PROGRAMACIÓN",
      icon: "/img/python.png",
      artwork: "from-sky-950 via-blue-800 to-orange-500",
    },
    {
      slug: "curso-2",
      title: "Desarrollo web con React",
      classes: "9 clases",
      modality: "Virtual",
      label: "DESARROLLO WEB",
      icon: "/img/procesador.png",
      artwork: "from-neutral-950 via-indigo-950 to-orange-600",
    },
    {
      slug: "curso-4",
      title: "Introducción a ciencia de datos",
      classes: "9 clases",
      modality: "Virtual",
      label: "CIENCIA DE DATOS",
      icon: "/img/icono_crecimiento.png",
      artwork: "from-slate-950 via-teal-900 to-yellow-500",
    },
    {
      slug: "curso-6",
      title: "SQL y bases de datos",
      classes: "9 clases",
      modality: "Virtual",
      label: "DATOS",
      icon: "/img/procesador.png",
      artwork: "from-neutral-950 via-neutral-800 to-orange-500",
    },
  ];

const projects: {
  name: string;
  image: string;
}[] = [
    {
      name: "Seguidor de línea",
      image: "/img/proyecto-seguidor.png",
    },
    {
      name: "Soccerbot",
      image: "/img/proyecto-soccerbot.png",
    },
    {
      name: "Mini Smart Factory",
      image: "/img/proyecto-smart-factory.png",
    },
  ];

const benefits: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
}[] = [
    {
      id: "recursos",
      eyebrow: "Siempre a tu alcance",
      title: "Materiales y recursos",
      description:
        "Guías, códigos y materiales de apoyo para que sigas construyendo dentro y fuera de clase.",
      icon: "/img/libro.png",
    },
    {
      id: "nosotros",
      eyebrow: "Aprendemos en comunidad",
      title: "Comunidad EDUKATECH",
      description:
        "Comparte ideas, resuelve dudas y encuentra personas que también quieren crear tecnología.",
      icon: "/img/personas.png",
    },
    {
      id: "investigacion",
      eyebrow: "Lleva tus ideas más lejos",
      title: "Asesoría de tesis",
      description:
        "Acompañamiento para transformar una pregunta de investigación en una solución tecnológica.",
      icon: "/img/sombrerodegraduación.png",
    },
  ];

export default function HomePage() {
  return (
    <div className="bg-white text-neutral-900">
      <Hero />

      <section
        id="catalogo"
        className="scroll-mt-24 bg-white px-5 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                Nuestros cursos
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Aprende lo que necesitas para tus proyectos
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
                Formación práctica para desarrollar habilidades, experimentar
                con tecnología y llevar tus ideas a la realidad.
              </p>
            </div>
            <Link
              href="/cursos"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-orange-700 transition-colors hover:text-orange-800"
            >
              Ver todos los cursos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map(
              ({
                slug,
                title,
                classes,
                modality,
                label,
                icon,
                artwork,
              }) => (
                <article
                  key={slug}
                  className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
                >
                  <Link
                    href={`/cursos/${slug}`}
                    aria-label={`Más información sobre ${title}`}
                    className="block"
                  >
                    <div
                      className={`relative isolate flex aspect-[1.45/1] items-end overflow-hidden bg-gradient-to-br ${artwork} p-5`}
                    >
                      <div
                        className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:24px_24px]"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute -top-12 -right-8 -z-10 size-48 rounded-full border border-white/20"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute top-6 right-7 -z-10 size-32 rounded-full border border-white/15"
                        aria-hidden="true"
                      />
                      <Image
                        src={icon}
                        alt=""
                        width={144}
                        height={144}
                        className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-lg transition duration-300 group-hover:scale-110 sm:size-32"
                      />
                      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/5 to-black/10" />
                      <span className="relative">
                        <span className="block text-[10px] font-bold tracking-[0.16em] text-orange-300">
                          {label}
                        </span>
                        <span className="mt-1 block text-xl leading-tight font-bold text-white">
                          {title}
                        </span>
                      </span>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-2 px-4 py-3 text-xs text-neutral-600">
                    <span className="flex items-center gap-2">
                      <Users
                        className="size-4 text-orange-600"
                        aria-hidden="true"
                      />
                      {classes}
                    </span>
                    <span className="flex items-center justify-end gap-2">
                      <Monitor
                        className="size-4 text-orange-600"
                        aria-hidden="true"
                      />
                      {modality}
                    </span>
                  </div>
                  <Link
                    href={`/cursos/${slug}`}
                    className="mx-4 mb-4 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    Más información
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
  id="proyectos"
  className="scroll-mt-24 relative isolate flex items-center overflow-hidden bg-neutral-950 px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-14"
>
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/fondo_proyectos.png')" }}
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-neutral-950/50"
  />

  <div className="mx-auto w-full max-w-[1400px]">
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-center lg:gap-10">
      {/* ==== Columna izquierda: texto ==== */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
          Del aprendizaje a la acción
        </p>
        <h2 className="mt-3 text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl">
          Convierte lo aprendido en{" "}
          <span className="text-orange-500">proyectos reales</span>
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-300">
          Aplicamos la teoría en soluciones prácticas para robótica,
          automatización, IoT y más.
        </p>
        <Link
          href="/cursos"
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/40 transition-all hover:bg-orange-600 hover:shadow-orange-500/50"
        >
          Ver proyectos
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {/* ==== Columna derecha: 3 tarjetas ==== */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {projects.map(({ name, image }) => (
          <article
            key={name}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl shadow-black/60 ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-1 hover:border-orange-500/70 hover:ring-orange-500/20"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 1023px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="block w-full rounded-lg bg-neutral-950 px-3 py-2 text-center text-xs font-bold tracking-wide text-white shadow-lg sm:text-sm">
                  {name}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </div>
</section>

      <section
        id="beneficios"
        className="scroll-mt-24 bg-neutral-50 px-5 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
              Crece con EDUKATECH
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              Más que cursos: una comunidad que impulsa tus ideas
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {benefits.map(
              ({ id, eyebrow, title, description, icon }) => (
                <article
                  id={id}
                  key={id}
                  className="scroll-mt-28 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-neutral-950 shadow-sm shadow-orange-500/20">
                    <Image
                      src={icon}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 object-contain"
                    />
                  </span>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-700">
                    {eyebrow}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-neutral-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {description}
                  </p>
                </article>
              ),
            )}
          </div>
          <div
            id="contacto"
            className="scroll-mt-24 mt-8 flex flex-col gap-4 rounded-xl bg-neutral-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-400">
                Tu próxima idea empieza aquí
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                ¿Listo para construir algo increíble?
              </h3>
            </div>
            <Link
              href="/cursos"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              Encuentra tu curso
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
