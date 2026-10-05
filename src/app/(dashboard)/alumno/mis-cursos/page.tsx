import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
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
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#527456] focus-visible:ring-offset-2"
          >
            <Card className="h-full rounded-2xl border-[#e1e8e1] shadow-[0_8px_24px_-22px_rgba(24,58,43,0.5)] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_32px_-22px_rgba(24,58,43,0.4)]">
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#edf4ee] text-[#4f7656]">
                    <BookOpen className="size-[18px]" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-4 text-[#849087] transition group-hover:text-[#376348]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">
                    {c.subject} · {c.level}
                  </p>
                  <CardTitle className="mt-1 text-base text-[#243d2e]">
                    {c.title}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.instructor}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#718078]">Tu progreso</span>
                  <span className="font-semibold text-[#376348]">{c.progress}%</span>
                </div>
                <Progress value={c.progress} />
                <p className="mt-3 text-[11px] text-[#849087]">
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