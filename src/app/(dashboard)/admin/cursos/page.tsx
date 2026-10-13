import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus, UsersRound } from "lucide-react";
import { getDemoCourse } from "@/lib/demo-courses";
import { demoCoursesList } from "@/lib/demo-data";

const cursosDemo = demoCoursesList.map((course) => ({
  course: getDemoCourse(course.id),
  precio: course.price,
  alumnos: course.enrolled,
  publicado: course.published,
}));

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
          <Link key={c.course.id} href={`/admin/cursos/${c.course.id}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2">
            <Card className="h-full overflow-hidden rounded-2xl border-[#e7e5e4] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
              <div className={`relative isolate flex aspect-[2.4/1] items-end overflow-hidden bg-gradient-to-br ${c.course.artwork} p-4`}>
                <Image src={c.course.icon} alt="" width={120} height={120} className="absolute right-4 top-1/2 size-20 -translate-y-1/2 rounded-2xl object-cover opacity-90 shadow-lg" aria-hidden="true" />
                <Badge variant={c.publicado ? "default" : "secondary"}>
                  {c.publicado ? "Publicado" : "Borrador"}
                </Badge>
              </div>
              <CardHeader className="gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#44403c]">{c.course.subject} · {c.course.level}</p>
                  <CardTitle className="mt-1 text-base text-[#171717]">{c.course.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-auto border-t border-[#fafaf9] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-xs text-[#44403c]"><UsersRound className="size-4 text-[#44403c]" aria-hidden="true" />{c.alumnos} alumnos inscritos</p>
                  <ArrowUpRight className="size-4 text-[#78716c] transition group-hover:text-[#ea580c]" aria-hidden="true" />
                </div>
                <p className="mt-3 text-lg font-semibold text-[#171717]">S/ {c.precio}.00</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}