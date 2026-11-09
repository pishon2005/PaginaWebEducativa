import type { ReactNode } from "react";
import { UnavailableFeature } from "@/components/shared/unavailable-feature";
export function DemoCreateSection({ label: _label, children: _children }: { label: string; children: ReactNode }) { return <UnavailableFeature title="Funcionalidad en integración" description="La creación de registros se habilitará cuando exista un servicio conectado." />; }