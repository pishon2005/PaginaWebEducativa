import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-[#fbfcf9] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#e6eee8] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#e8f0e9_0%,#d6e4dc_45%,#8cae9d_46%,#648d80_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-[43%] bg-[linear-gradient(180deg,rgba(128,169,157,0.12),rgba(44,101,89,0.86))]" aria-hidden="true" />
        <div className="absolute bottom-[28%] left-[-8%] h-[36%] w-[116%] rounded-[50%] bg-[#839d83]" aria-hidden="true" />
        <div className="absolute bottom-[22%] left-[-12%] h-[26%] w-[124%] rounded-[50%] bg-[#637f6c]" aria-hidden="true" />
        <div className="absolute bottom-[5%] left-[-10%] h-[28%] w-[120%] rounded-[50%] border-t border-white/30 bg-[#3f756d]/80" aria-hidden="true" />
        <Link href="/" className="relative z-10 flex w-fit items-center gap-3 rounded-full bg-white/70 px-4 py-2.5 text-[#193b2b] backdrop-blur-sm">
          <span className="grid size-9 place-items-center rounded-full bg-[#173c2d] text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight">Aula Norte</span>
        </Link>
        <div className="relative z-10 mb-8 max-w-lg rounded-3xl border border-white/70 bg-white/75 p-6 text-[#173a2c] shadow-[0_20px_55px_-40px_rgba(24,58,43,0.55)] backdrop-blur-md xl:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3e6950]">Un lugar para avanzar</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Tu próxima meta empieza con una buena lección.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#456253]">Aprende a tu ritmo, comparte tus dudas y encuentra el camino que sigue.</p>
        </div>
        <p className="relative z-10 text-xs font-medium text-white/90 drop-shadow-sm">© 2026 Aula Norte · Aprende con propósito</p>
      </section>
      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-10">
        <Link href="/" className="mb-8 flex items-center gap-2 text-[#193b2b] lg:hidden">
          <span className="grid size-9 place-items-center rounded-full bg-[#173c2d] text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight">Aula Norte</span>
        </Link>
        <div className="w-full max-w-[440px]">{children}</div>
        <p className="mt-8 text-center text-xs text-[#87928a] lg:hidden">© 2026 Aula Norte · Aprende con propósito</p>
      </section>
    </main>
  );
}