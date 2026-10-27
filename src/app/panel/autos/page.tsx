"use client";

import Link from "next/link";
import { useState } from "react";
import { EstadoBadge } from "@/components/car-card";
import { EyeIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { VehiculoFoto } from "@/components/vehiculo-foto";
import { cambiarEstadoDemo, guardarLocal } from "@/lib/demo-store";
import { formatKm, formatPrecio, tituloVehiculo } from "@/lib/format";
import { statsDe, useAutosAgencia } from "@/lib/panel";
import type { EstadoVehiculo, Vehiculo } from "@/lib/types";

const FILTROS: { value: EstadoVehiculo | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "publicado", label: "Publicados" },
  { value: "reservado", label: "Reservados" },
  { value: "pausado", label: "Pausados" },
  { value: "borrador", label: "Borradores" },
  { value: "vendido", label: "Vendidos" },
];

const ESTADO_TEXTO: Record<EstadoVehiculo, { label: string; clase: string }> = {
  publicado: { label: "Publicado", clase: "bg-ok-bg text-ok" },
  reservado: { label: "Reservado", clase: "bg-warn-bg text-warn" },
  pausado: { label: "Pausado", clase: "bg-soft text-muted" },
  borrador: { label: "Borrador", clase: "bg-soft text-muted" },
  vendido: { label: "Vendido", clase: "bg-ink text-white" },
};

async function cambiarEstado(v: Vehiculo, estado: EstadoVehiculo) {
  if (v.local) await guardarLocal({ ...v, estado });
  else cambiarEstadoDemo(v.codigo, estado);
}

function Acciones({ v }: { v: Vehiculo }) {
  const opciones: { estado: EstadoVehiculo; label: string }[] = [];
  if (v.estado !== "publicado") opciones.push({ estado: "publicado", label: v.estado === "borrador" ? "Publicar" : "Volver a publicar" });
  if (v.estado === "publicado") opciones.push({ estado: "reservado", label: "Marcar reservado" });
  if (v.estado === "publicado" || v.estado === "reservado") opciones.push({ estado: "pausado", label: "Pausar" });
  if (v.estado !== "vendido" && v.estado !== "borrador") opciones.push({ estado: "vendido", label: "Marcar vendido" });
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button key={o.estado} type="button" onClick={() => cambiarEstado(v, o.estado)} className={`btn min-h-10 px-3 text-sm ${o.estado === "publicado" ? "btn-brand" : "btn-ghost"}`}>
          {o.label}
        </button>
      ))}
      {v.local && (
        <Link href={`/panel/autos/editar?codigo=${v.codigo}`} className="btn btn-ghost min-h-10 px-3 text-sm">
          Editar
        </Link>
      )}
      <Link href={`/panel/autos/nuevo?duplicar=${v.codigo}`} className="btn btn-ghost min-h-10 px-3 text-sm">
        Duplicar
      </Link>
    </div>
  );
}

export default function MisAutos() {
  const autos = useAutosAgencia();
  const [filtro, setFiltro] = useState<EstadoVehiculo | "todos">("todos");
  if (!autos) return <p className="py-16 text-center text-muted">Cargando…</p>;
  const lista = autos.filter((v) => filtro === "todos" || v.estado === filtro);
  const activos = autos.filter((v) => v.estado === "publicado" || v.estado === "reservado").length;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mis autos</h1>
          <p className="text-sm text-muted">{activos} publicados · Plan Pro sin límite</p>
        </div>
        <Link href="/panel/autos/nuevo" className="btn btn-brand">
          <PlusIcon className="size-5" /> <span className="hidden sm:inline">Cargar auto</span>
          <span className="sm:hidden">Cargar</span>
        </Link>
      </div>

      <div className="scroll-row -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {FILTROS.map((f) => {
          const n = f.value === "todos" ? autos.length : autos.filter((v) => v.estado === f.value).length;
          return (
            <button key={f.value} type="button" aria-pressed={filtro === f.value} onClick={() => setFiltro(f.value)} className="chip shrink-0">
              {f.label} <span className="opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 space-y-3">
        {lista.map((v) => {
          const s = statsDe(v);
          const estado = ESTADO_TEXTO[v.estado];
          return (
            <li key={v.codigo} className="rounded-2xl border border-line bg-surface p-3">
              <div className="flex gap-3">
                <Link href={`/auto/${v.slug}`} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-soft" aria-label={`Ver aviso de ${tituloVehiculo(v)}`}>
                  <VehiculoFoto v={v} alt="" className="absolute inset-0 size-full" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-bold">
                      {tituloVehiculo(v)} {v.anio}
                    </p>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${estado.clase}`}>{estado.label}</span>
                  </div>
                  <p className="truncate text-sm text-muted">
                    {v.version} · {formatKm(v.km)}
                  </p>
                  <p className="font-extrabold">{formatPrecio(v.precio, v.moneda)}</p>
                  <p className="mt-0.5 flex gap-3 text-xs font-semibold text-muted">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="size-3.5" /> {s.vistas} vistas
                    </span>
                    <span className="flex items-center gap-1">
                      <WhatsAppIcon className="size-3.5" /> {s.whatsapp} consultas
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-3 border-t border-line pt-3">
                <Acciones v={v} />
              </div>
              {v.destacado && (
                <div className="mt-2">
                  <EstadoBadge v={{ ...v, condicion: "usado" }} />
                </div>
              )}
            </li>
          );
        })}
        {!lista.length && <li className="rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-muted">No hay autos en este estado.</li>}
      </ul>
    </div>
  );
}
