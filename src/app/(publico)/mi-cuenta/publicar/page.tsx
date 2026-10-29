"use client";

import { CarForm } from "@/components/car-form";
import { PARTICULAR_DEMO, topeAlcanzado, useAvisosParticular, vencido } from "@/lib/mi-cuenta";

export default function PublicarParticularPage() {
  const avisos = useAvisosParticular();
  if (!avisos) return <p className="py-16 text-center text-muted">Cargando…</p>;
  return (
    <div className="px-4 pt-6">
      <CarForm publicador={{ tipo: "particular", particular: PARTICULAR_DEMO, topeAlcanzado: topeAlcanzado(avisos.filter((v) => !vencido(v))) }} />
    </div>
  );
}
