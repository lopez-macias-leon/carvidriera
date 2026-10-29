"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CarForm } from "@/components/car-form";
import { vehiculosDemo } from "@/data/demo";
import { obtenerLocal } from "@/lib/demo-store";
import { AGENCIA_DEMO } from "@/lib/panel";
import type { Vehiculo } from "@/lib/types";

function Nuevo() {
  const duplicar = useSearchParams().get("duplicar");
  const demo = duplicar ? vehiculosDemo.find((v) => v.codigo === duplicar) : undefined;
  const [local, setLocal] = useState<Vehiculo | null | undefined>(undefined);
  useEffect(() => {
    if (duplicar && !demo) obtenerLocal(duplicar).then(setLocal);
  }, [duplicar, demo]);
  const base = !duplicar ? null : (demo ?? local);
  if (base === undefined) return <p className="py-16 text-center text-muted">Cargando…</p>;
  return <CarForm key={duplicar ?? "nuevo"} inicial={base ?? undefined} duplicar={!!base} publicador={{ tipo: "agencia", agencia: AGENCIA_DEMO }} />;
}

export default function NuevoAutoPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-muted">Cargando…</p>}>
      <Nuevo />
    </Suspense>
  );
}
