import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

const cursosDemo = ["1", "2"].map((id) => getDemoCourse(id));

export default function AlumnoMisCursosPage() {
  return (
    <div>
      <PageHeader
        title="Mis cursos"
        description="Continúa donde lo dejaste"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursosDemo.map((c) => (
          <Link
            key={c.id}
            href={`/alumno/mis-cursos/${c.id}`}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2"
          >
            <Card className="h-full overflow-hidden rounded-2xl border-[#e7e5e4] shadow-[0_8px_24px_-22px_rgba(28,25,23,0.5)] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_32px_-22px_rgba(28,25,23,0.4)]">
              <div className={`relative isolate flex aspect-[2.4/1] items-end overflow-hidden bg-gradient-to-br ${c.artwork} p-4`}>
                <Image src={c.icon} alt="" width={120} height={120} className="absolute right-4 top-1/2 size-20 -translate-y-1/2 rounded-2xl object-cover opacity-90 shadow-lg" aria-hidden="true" />
                <span className="rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">{c.subject}</span>
              </div>
              <CardHeader className="gap-4">
                <div className="flex items-center justify-end">
                  <ArrowUpRight className="size-4 text-[#78716c] transition group-hover:text-[#ea580c]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#44403c]">
                    {c.subject} · {c.level}
                  </p>
                  <CardTitle className="mt-1 text-base text-[#171717]">
                    {c.title}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.instructor}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#44403c]">Tu progreso</span>
                  <span className="font-semibold text-[#ea580c]">{c.progress}%</span>
                </div>
                <Progress value={c.progress} />
                <p className="mt-3 text-[11px] text-[#78716c]">
                  {c.duration} de contenido · {c.students} estudiantes
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}