"use client";

import { CarForm } from "@/components/car-form";
import Link from "next/link";
import { useCuenta } from "@/lib/moderacion-demo";
import { PARTICULAR_DEMO, topeAlcanzado, useAvisosParticular, vencido } from "@/lib/mi-cuenta";

export default function PublicarParticularPage() {
  const avisos = useAvisosParticular();
  const cuenta = useCuenta(PARTICULAR_DEMO.id);
  if (!avisos || !cuenta) return <p className="py-16 text-center text-muted">Cargando…</p>;
  if (cuenta.bloqueada) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Tu cuenta está bloqueada</h1>
        <p className="mt-2 text-muted">No podés publicar avisos porque se publicó contenido que no respeta las reglas del portal.</p>
        <Link href="/terminos" className="btn btn-ghost mt-5">
          Ver las reglas
        </Link>
      </div>
    );
  }
  return (
    <div className="px-4 pt-6">
      <CarForm publicador={{ tipo: "particular", particular: PARTICULAR_DEMO, topeAlcanzado: topeAlcanzado(avisos.filter((v) => !vencido(v))), cuentaAprobada: cuenta.aprobada }} />
    </div>
  );
}
