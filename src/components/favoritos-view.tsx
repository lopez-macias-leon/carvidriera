"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listarLocales } from "@/lib/demo-store";
import { useFavoritos } from "@/lib/favoritos";
import type { Agencia, Vehiculo } from "@/lib/types";
import { CarCard, CarGrid } from "./car-card";

export function FavoritosView({ vehiculos, agencias }: { vehiculos: Vehiculo[]; agencias: Agencia[] }) {
  const favoritos = useFavoritos();
  const [locales, setLocales] = useState<Vehiculo[]>([]);
  useEffect(() => {
    listarLocales().then(setLocales);
  }, []);
  const porCodigo = new Map([...vehiculos, ...locales].map((v) => [v.codigo, v]));
  const lista = favoritos.map((c) => porCodigo.get(c)).filter((v): v is Vehiculo => !!v);
  const porSlug = Object.fromEntries(agencias.map((a) => [a.slug, a]));
  if (!lista.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
        <p className="text-lg font-bold">Todavía no guardaste autos</p>
        <p className="mt-1 text-muted">Tocá el corazón en cualquier auto para guardarlo acá.</p>
        <Link href="/autos" className="btn btn-brand mt-4">
          Ver autos
        </Link>
      </div>
    );
  }
  return (
    <CarGrid>
      {lista.map((v) => (
        <CarCard key={v.codigo} v={v} agencia={porSlug[v.agencia]} />
      ))}
    </CarGrid>
  );
}
