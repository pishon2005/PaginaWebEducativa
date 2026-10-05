import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Plus, UsersRound } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";

const cursosDemo = [
  { course: getDemoCourse("1"), precio: 99, alumnos: 45, publicado: true },
  { course: getDemoCourse("2"), precio: 149, alumnos: 32, publicado: true },
  { course: getDemoCourse("3"), precio: 199, alumnos: 0, publicado: false },
];

export default function AdminCursosPage() {
  return (
    <div>
      <PageHeader title="Cursos" description="Gestiona todos los cursos">
        <Link
          href="/admin/cursos/nuevo"
          className={buttonVariants()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo curso
        </Link>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursosDemo.map((c) => (
          <Link key={c.course.id} href={`/admin/cursos/${c.course.id}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#527456] focus-visible:ring-offset-2">
            <Card className="h-full rounded-2xl border-[#e1e8e1] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
              <CardHeader className="gap-4">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#edf4ee] text-[#4f7656]"><BookOpen className="size-[18px]" aria-hidden="true" /></span>
                  <Badge variant={c.publicado ? "default" : "secondary"}>
                    {c.publicado ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078]">{c.course.subject} · {c.course.level}</p>
                  <CardTitle className="mt-1 text-base text-[#243d2e]">{c.course.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto border-t border-[#edf1ed] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-xs text-[#718078]"><UsersRound className="size-4 text-[#708d76]" aria-hidden="true" />{c.alumnos} alumnos inscritos</p>
                  <ArrowUpRight className="size-4 text-[#849087] transition group-hover:text-[#376348]" aria-hidden="true" />
                </div>
                <p className="mt-3 text-lg font-semibold text-[#20392b]">S/ {c.precio}.00</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}