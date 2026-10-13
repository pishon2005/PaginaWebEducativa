import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentReviewActions } from "@/components/shared/payment-review-actions";
import { demoPayments, getCourseById } from "@/lib/demo-data";

export default async function AdminPagoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = demoPayments.find((entry) => entry.id === Number(id)) ?? demoPayments[0];
  const course = getCourseById(payment.courseId);

  return (
    <div>
      <PageHeader
        title={`Pago #${id}`}
        description="Verifica el voucher y aprueba o rechaza el pago"
      >
        <PaymentReviewActions paymentId={id} />
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-md border bg-muted">
                <p className="text-sm text-muted-foreground">
                  Vista previa del voucher
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos del pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alumno</span>
                <span className="font-medium">{payment.student}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Curso</span>
                <span className="font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-medium">S/ {payment.amount}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método</span>
                <span className="font-medium">{payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado inicial</span>
                <Badge variant={payment.status === "aprobado" ? "default" : payment.status === "rechazado" ? "destructive" : "secondary"} className="capitalize">{payment.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}