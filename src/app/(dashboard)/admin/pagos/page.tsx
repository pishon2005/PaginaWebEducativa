import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const pagosDemo = [
  { id: 1, alumno: "Juan Pérez", curso: "Python desde Cero", monto: 99, estado: "pendiente", metodo: "Yape" },
  { id: 2, alumno: "María López", curso: "React Avanzado", monto: 149, estado: "aprobado", metodo: "Plin" },
  { id: 3, alumno: "Carlos Ruiz", curso: "Data Science", monto: 199, estado: "rechazado", metodo: "Yape" },
];

export default function AdminPagosPage() {
  return (
    <div>
      <PageHeader
        title="Pagos"
        description="Verifica y aprueba los pagos de los alumnos"
      />

      <Card className="rounded-2xl border-[#e1e8e1] p-3 sm:p-4">
        <div className="space-y-1">
          {pagosDemo.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-3 odd:bg-[#f7faf7]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#304637]">{p.alumno}</p>
                <p className="text-xs text-muted-foreground">
                  {p.curso} · {p.metodo}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-sm font-semibold text-[#304637]">S/ {p.monto}.00</span>
                <Badge
                  variant={
                    p.estado === "aprobado"
                      ? "default"
                      : p.estado === "rechazado"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {p.estado}
                </Badge>
                <Link
                  href={`/admin/pagos/${p.id}`}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Ver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}