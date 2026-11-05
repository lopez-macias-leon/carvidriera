"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { alCambiar, listarLocales } from "@/lib/demo-store";
import { aplicarFiltros, esVisible, estaDestacado, ordenar, type Filtros } from "@/lib/filtros";
import type { Agencia, Vehiculo } from "@/lib/types";
import { CarCard, CarGrid } from "./car-card";

/**
 * Demo: suma a la portada y al listado los autos publicados desde este teléfono
 * (los que esperan revisión o fueron rechazados no se ven). En producción todo sale de la base de datos.
 */
function useLocalesVisibles() {
  const [locales, setLocales] = useState<Vehiculo[]>([]);
  useEffect(() => {
    const cargar = () => listarLocales().then((l) => setLocales(l.filter(esVisible)));
    cargar();
    return alCambiar(cargar);
  }, []);
  return locales;
}

const porSlug = (agencias: Agencia[]) => Object.fromEntries(agencias.map((a) => [a.slug, a]));
const sinRepetir = (lista: Vehiculo[]) => [...new Map(lista.map((v) => [v.codigo, v])).values()];

export function RecientesConLocales({ items, agencias, cantidad }: { items: Vehiculo[]; agencias: Agencia[]; cantidad: number }) {
  const locales = useLocalesVisibles();
  const lista = sinRepetir([...locales, ...items])
    .sort((a, b) => b.publicado.localeCompare(a.publicado))
    .slice(0, cantidad);
  const ag = porSlug(agencias);
  return (
    <CarGrid>
      {lista.map((v, i) => (
        <CarCard key={v.codigo} v={v} agencia={ag[v.agencia]} eager={i < 2} />
      ))}
    </CarGrid>
  );
}

export function DestacadosConLocales({ items, agencias }: { items: Vehiculo[]; agencias: Agencia[] }) {
  const locales = useLocalesVisibles().filter(estaDestacado);
  const lista = sinRepetir([...locales, ...items]);
  const ag = porSlug(agencias);
  if (!lista.length) return null;
  return (
    <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="destacados">
      <h2 id="destacados" className="text-2xl font-extrabold tracking-tight">
        Destacados
      </h2>
      <ul className="scroll-row -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-2">
        {lista.map((v) => (
          <li key={v.codigo} className="w-[78%] shrink-0 sm:w-[44%] lg:w-[31%]">
            <CarCard v={v} agencia={ag[v.agencia]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Resultados del listado: los del servidor más los locales que cumplen los mismos filtros. */
export function ResultadosConLocales({
  items,
  total,
  filtros,
  agencias,
  children,
}: {
  items: Vehiculo[];
  total: number;
  filtros: Filtros;
  agencias: Agencia[];
  /** Filtros activos, junto a la cantidad. */
  children?: React.ReactNode;
}) {
  const locales = aplicarFiltros(useLocalesVisibles(), filtros);
  const lista = ordenar(sinRepetir([...locales, ...items]), filtros.orden);
  const cantidad = total + locales.filter((v) => !items.some((x) => x.codigo === v.codigo)).length;
  const ag = porSlug(agencias);
  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="mr-2 text-sm font-semibold text-muted" aria-live="polite">
          {cantidad === 1 ? "1 auto" : `${cantidad} autos`}
        </p>
        {children}
      </div>
      {lista.length ? (
        <div className="mt-4">
          <CarGrid conLateral>
            {lista.map((v, i) => (
              <CarCard key={v.codigo} v={v} agencia={ag[v.agencia]} eager={i < 2} />
            ))}
          </CarGrid>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-lg font-bold">No encontramos autos con esos filtros</p>
          <p className="mt-1 text-muted">Probá quitar algún filtro o buscar otra marca.</p>
          <Link href="/autos" className="btn btn-brand mt-4">
            Ver todos los autos
          </Link>
        </div>
      )}
    </>
  );
}
