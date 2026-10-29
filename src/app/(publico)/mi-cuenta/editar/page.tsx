"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CarForm } from "@/components/car-form";
import { obtenerLocal } from "@/lib/demo-store";
import { PARTICULAR_DEMO } from "@/lib/mi-cuenta";
import type { Vehiculo } from "@/lib/types";

function Editar() {
  const codigo = useSearchParams().get("codigo") ?? "";
  const [v, setV] = useState<Vehiculo | null | undefined>(undefined);
  useEffect(() => {
    obtenerLocal(codigo).then(setV);
  }, [codigo]);
  if (v === undefined) return <p className="py-16 text-center text-muted">Cargando…</p>;
  if (!v || v.vendedor !== "particular")
    return (
      <div className="py-16 text-center">
        <p className="font-bold">No encontramos ese aviso</p>
        <Link href="/mi-cuenta" className="btn btn-brand mt-4">
          Volver a mis avisos
        </Link>
      </div>
    );
  return <CarForm inicial={v} publicador={{ tipo: "particular", particular: PARTICULAR_DEMO, topeAlcanzado: false }} />;
}

export default function EditarParticularPage() {
  return (
    <div className="px-4 pt-6">
      <Suspense fallback={<p className="py-16 text-center text-muted">Cargando…</p>}>
        <Editar />
      </Suspense>
    </div>
  );
}
