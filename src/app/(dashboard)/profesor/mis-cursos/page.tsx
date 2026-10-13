import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight, BookOpen, UsersRound } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

const cursosDemo = [
  { course: getDemoCourse("1"), publicado: true },
  { course: getDemoCourse("2"), publicado: true },
];

export default function ProfesorMisCursosPage() {
  return (
    <div>
      <PageHeader
        title="Mis cursos"
        description="Cursos que dictas actualmente"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursosDemo.map((c) => (
          <Link key={c.course.id} href={`/profesor/mis-cursos/${c.course.id}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2">
            <Card className="h-full rounded-2xl border-[#e7e5e4] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#fff7ed] text-[#ea580c]"><BookOpen className="size-[18px]" aria-hidden="true" /></span>
                  <Badge variant={c.publicado ? "default" : "secondary"}>
                    {c.publicado ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#44403c]">{c.course.subject} · {c.course.level}</p>
                  <CardTitle className="mt-1 text-base text-[#171717]">{c.course.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{c.course.duration} · {c.course.instructor}</p>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between border-t border-[#fafaf9] pt-4">
                <p className="flex items-center gap-2 text-xs font-medium text-[#44403c]"><UsersRound className="size-4 text-[#44403c]" aria-hidden="true" />{c.course.enrolled} alumnos</p>
                <ArrowUpRight className="size-4 text-[#78716c] transition group-hover:text-[#ea580c]" aria-hidden="true" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}