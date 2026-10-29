"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CarForm } from "@/components/car-form";
import { obtenerLocal } from "@/lib/demo-store";
import { AGENCIA_DEMO } from "@/lib/panel";
import type { Vehiculo } from "@/lib/types";

function Editar() {
  const codigo = useSearchParams().get("codigo") ?? "";
  const [v, setV] = useState<Vehiculo | null | undefined>(undefined);
  useEffect(() => {
    obtenerLocal(codigo).then(setV);
  }, [codigo]);
  if (v === undefined) return <p className="py-16 text-center text-muted">Cargando…</p>;
  if (!v)
    return (
      <div className="py-16 text-center">
        <p className="font-bold">No encontramos ese auto</p>
        <Link href="/panel/autos" className="btn btn-brand mt-4">
          Volver a mis autos
        </Link>
      </div>
    );
  return <CarForm inicial={v} publicador={{ tipo: "agencia", agencia: AGENCIA_DEMO }} />;
}

export default function EditarAutoPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-muted">Cargando…</p>}>
      <Editar />
    </Suspense>
  );
}
