"use client";

import { useEffect, useMemo, useState } from "react";
import { tipos } from "@/data/catalogos";
import { alCambiar, listarLocales } from "@/lib/demo-store";
import { ordenar, type Orden } from "@/lib/filtros";
import type { Agencia, Vehiculo } from "@/lib/types";
import { CarCard, CarGrid } from "./car-card";
import { ORDENES } from "./filters";

/** Stock de la agencia con filtros simples en el teléfono (el catálogo de una agencia es chico). */
export function StockList({ agencia, stock }: { agencia: Agencia; stock: Vehiculo[] }) {
  const [locales, setLocales] = useState<Vehiculo[]>([]);
  const [tipo, setTipo] = useState<string>("");
  const [condicion, setCondicion] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [orden, setOrden] = useState<Orden>("recientes");

  // Demo: suma los autos que la agencia cargó desde el panel en este teléfono.
  useEffect(() => {
    const cargar = () => listarLocales().then((l) => setLocales(l.filter((v) => v.agencia === agencia.slug && (v.estado === "publicado" || v.estado === "reservado"))));
    cargar();
    return alCambiar(cargar);
  }, [agencia.slug]);

  const todos = useMemo(() => [...locales, ...stock], [locales, stock]);
  const marcas = [...new Set(todos.map((v) => v.marca))].sort();
  const visibles = ordenar(
    todos.filter((v) => (!tipo || v.tipo === tipo) && (!condicion || v.condicion === condicion) && (!marca || v.marca === marca)),
    orden,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="scroll-row -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button type="button" className="chip shrink-0" aria-pressed={!tipo && !condicion} onClick={() => (setTipo(""), setCondicion(""))}>
            Todos <span className="opacity-70">{todos.length}</span>
          </button>
          {tipos
            .filter((t) => todos.some((v) => v.tipo === t.value))
            .map((t) => (
              <button key={t.value} type="button" className="chip shrink-0" aria-pressed={tipo === t.value} onClick={() => setTipo(tipo === t.value ? "" : t.value)}>
                {t.plural}
              </button>
            ))}
          {todos.some((v) => v.condicion === "0km") && (
            <button type="button" className="chip shrink-0" aria-pressed={condicion === "0km"} onClick={() => setCondicion(condicion === "0km" ? "" : "0km")}>
              0 km
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Marca</span>
          <select className="field min-h-11 py-2" value={marca} onChange={(e) => setMarca(e.target.value)}>
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="flex-1">
          <span className="sr-only">Ordenar por</span>
          <select className="field min-h-11 py-2" value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
            {ORDENES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm font-semibold text-muted" aria-live="polite">
        {visibles.length === 1 ? "1 auto" : `${visibles.length} autos`}
      </p>
      <div className="mt-3">
        {visibles.length ? (
          <CarGrid conLateral>
            {visibles.map((v, i) => (
              <CarCard key={v.codigo} v={v} eager={i < 2} desde="agencia" />
            ))}
          </CarGrid>
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-muted">No hay autos con esos filtros.</p>
        )}
      </div>
    </div>
  );
}
