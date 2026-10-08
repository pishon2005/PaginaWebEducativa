import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Mail,
  Users,
} from "lucide-react";

const footerGroups = [
  {
    title: "Cursos",
    links: [
      { href: "/cursos", label: "Explorar cursos" },
      { href: "/cursos", label: "Programación y tecnología" },
      { href: "/login", label: "Mi aprendizaje" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/#nosotros", label: "Nosotros" },
      { href: "/profesores/ana-campos", label: "Nuestro equipo" },
      { href: "/#contacto", label: "Contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/#privacidad", label: "Aviso de privacidad" },
      { href: "/#terminos", label: "Términos y condiciones" },
    ],
  },
];

const socialLinks = [
  {
    href: "/profesores/ana-campos",
    label: "Conoce a nuestro equipo",
    icon: Users,
  },
  { href: "/cursos", label: "Explora la tecnología", icon: Code2 },
  { href: "/#contacto", label: "Contacto", icon: Mail },
];

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))] lg:gap-8 lg:px-8 lg:py-16">
        <div className="max-w-sm">
          <Link
            href="/"
            aria-label="EDUKATECH Technology Division, inicio"
            className="inline-flex items-center gap-3"
          >
            <span className="grid size-16 place-items-center">
              <Image
                src="/img/logo.png"
                alt=""
                width={72}
                height={72}
                className="size-16 object-contain"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight">
                EDUKA<span className="text-orange-500">TECH</span>
              </span>
              <span className="mt-1 text-[9px] font-bold tracking-[0.16em] text-neutral-400">
                TECHNOLOGY DIVISION
              </span>
            </span>
          </Link>
          <p className="mt-5 text-sm leading-6 text-neutral-400">
            Aprende tecnología creando proyectos reales. Programación,
            electrónica y robótica para construir lo que imaginas.
          </p>
          <Link
            href="/cursos"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition-colors hover:text-yellow-400"
          >
            Descubre los cursos
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={`Enlaces de ${group.title}`}>
            <h2 className="text-sm font-bold text-white">{group.title}</h2>
            <ul className="mt-4 grid gap-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-orange-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-sm font-bold text-white">Comunidad</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-400">
            Conoce al equipo, explora los cursos y conecta con EDUKATECH.
          </p>
          <nav aria-label="Comunidad y contacto" className="mt-4 flex gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className="grid size-9 place-items-center rounded-lg border border-neutral-700 text-neutral-300 transition-colors hover:border-orange-500 hover:bg-neutral-900 hover:text-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <Icon className="size-4" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-neutral-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} EDUKATECH Technology Division. Todos
            los derechos reservados.
          </p>
          <p className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5 text-orange-500" aria-hidden="true" />
            Aprende · Crea · Innova
          </p>
        </div>
      </div>
    </footer>
  );
}
