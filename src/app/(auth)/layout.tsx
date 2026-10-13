import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-neutral-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(249,115,22,0.22),transparent_50%),radial-gradient(ellipse_at_90%_100%,rgba(250,204,21,0.12),transparent_45%)]" aria-hidden="true" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden="true" />
        <div className="absolute -right-24 top-1/4 size-80 rounded-full border border-orange-500/20" aria-hidden="true" />
        <div className="absolute -right-10 top-1/3 size-44 rounded-full border border-orange-400/15" aria-hidden="true" />
        <Link href="/" className="relative z-10 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
          <Image src="/img/logo.png" alt="" width={36} height={36} className="size-9 object-contain" />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-black tracking-tight text-white">EDUKA<span className="text-orange-500">TECH</span></span>
            <span className="mt-0.5 text-[8px] font-bold tracking-[0.16em] text-neutral-400">TECHNOLOGY DIVISION</span>
          </span>
        </Link>
        <div className="relative z-10 mb-8 max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-md xl:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Aprende · Crea · Innova</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">Tu próxima meta empieza con una buena lección.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300">Aprende a tu ritmo, comparte tus dudas y encuentra el camino que sigue.</p>
        </div>
        <p className="relative z-10 text-xs font-medium text-neutral-400">© 2026 EDUKATECH Technology Division</p>
      </section>
      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-10">
        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <Image src="/img/logo.png" alt="" width={40} height={40} className="size-10 object-contain" />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-neutral-950">EDUKA<span className="text-orange-600">TECH</span></span>
            <span className="mt-0.5 text-[8px] font-bold tracking-[0.16em] text-neutral-500">TECHNOLOGY DIVISION</span>
          </span>
        </Link>
        <div className="w-full max-w-[440px]">{children}</div>
        <p className="mt-8 text-center text-xs text-neutral-400 lg:hidden">© 2026 EDUKATECH Technology Division</p>
      </section>
    </main>
  );
}