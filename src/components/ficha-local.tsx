"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { obtenerLocal } from "@/lib/demo-store";
import type { Agencia, Taller, Vehiculo } from "@/lib/types";
import { Ficha } from "./ficha";

/** Ficha de un auto cargado en este teléfono desde un panel (solo demo). */
export function FichaLocal({ slug, agencias, similares, talleres }: { slug: string; agencias: Agencia[]; similares: Vehiculo[]; talleres: Taller[] }) {
  const [v, setV] = useState<Vehiculo | null | undefined>(undefined);
  useEffect(() => {
    obtenerLocal(slug).then(setV);
  }, [slug]);
  if (v === undefined) return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-muted">Cargando…</div>;
  const agencia = v?.vendedor === "agencia" ? (agencias.find((a) => a.slug === v.agencia) ?? null) : null;
  if (!v || (v.vendedor === "agencia" && !agencia)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">No encontramos este aviso</h1>
        <p className="mt-2 text-muted">Puede que se haya vendido o que el link esté incompleto.</p>
        <Link href="/autos" className="btn btn-brand mt-5">
          Ver todos los autos
        </Link>
      </div>
    );
  }
  const parecidos = similares.filter((x) => x.tipo === v.tipo || x.marca === v.marca).slice(0, 4);
  const precompra = talleres.filter((t) => t.especialidades.includes("precompra")).slice(0, 3);
  return <Ficha v={v} agencia={agencia} similares={parecidos} masDeLaAgencia={[]} desdeCatalogo={false} talleres={precompra} />;
}
