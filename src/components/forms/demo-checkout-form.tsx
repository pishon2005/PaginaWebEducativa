import { UnavailableFeature } from "@/components/shared/unavailable-feature";
type DemoCheckoutFormProps = { courseTitle: string; price: number };
export function DemoCheckoutForm(_props: DemoCheckoutFormProps) { return <UnavailableFeature title="Pagos no disponibles" description="El registro de pagos se habilitará cuando se conecte el servicio correspondiente." />; }