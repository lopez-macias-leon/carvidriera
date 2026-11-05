"use client";

import Link from "next/link";
import { useState } from "react";
import { FlagIcon } from "@/components/icons";
import { VehiculoFoto } from "@/components/vehiculo-foto";
import { guardarLocal } from "@/lib/demo-store";
import { formatKm, formatPrecio, tituloCompleto } from "@/lib/format";
import { aprobarAviso, bloquearCuenta, rechazarAviso, resolverDenuncias, useModeracion, type Denuncia } from "@/lib/moderacion-demo";
import type { Vehiculo } from "@/lib/types";

const MOTIVOS_RECHAZO = [
  "Fotos inapropiadas",
  "Las fotos no son del auto",
  "Datos falsos o engañosos",
  "Teléfono o links en el texto",
  "Lenguaje inapropiado",
  "Aviso duplicado",
];

function AvisoParaRevisar({ v }: { v: Vehiculo }) {
  const [accion, setAccion] = useState<"" | "rechazar" | "bloquear">("");
  const [motivo, setMotivo] = useState(MOTIVOS_RECHAZO[0]);
  const vendedor = v.vendedor === "particular" ? `${v.particular?.nombre ?? "Particular"} · particular` : "Concesionaria";
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold">{tituloCompleto(v)}</p>
          <p className="text-sm text-muted">
            {formatPrecio(v.precio, v.moneda)} · {formatKm(v.km)} · {vendedor}
          </p>
        </div>
        <Link href={`/auto/${v.slug}`} className="text-sm font-bold text-brand hover:underline">
          Ver como comprador
        </Link>
      </div>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Motivos de la revisión">
        {(v.motivosRevision ?? ["Revisión"]).map((m) => (
          <li key={m} className="rounded-full bg-warn-bg px-2.5 py-1 text-xs font-semibold text-warn">
            {m}
          </li>
        ))}
      </ul>
      {/* Las fotos primero: es lo que más hay que mirar. */}
      <ul className="scroll-row mt-3 flex gap-2 overflow-x-auto" aria-label="Fotos del aviso">
        {(v.fotos.length ? v.fotos : [null]).map((_, i) => (
          <li key={i} className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-soft">
            <VehiculoFoto v={v} indice={i} alt={`Foto ${i + 1}`} className="absolute inset-0 size-full" />
          </li>
        ))}
      </ul>
      {v.descripcion && <p className="mt-3 whitespace-pre-line rounded-xl bg-soft p-3 text-sm">{v.descripcion}</p>}

      {accion === "" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => aprobarAviso(v)} className="btn btn-brand flex-1">
            Aprobar
          </button>
          <button type="button" onClick={() => setAccion("rechazar")} className="btn btn-ghost flex-1">
            Rechazar
          </button>
          {v.vendedor === "particular" && (
            <button type="button" onClick={() => setAccion("bloquear")} className="btn btn-ghost text-danger">
              Bloquear cuenta
            </button>
          )}
        </div>
      )}
      {accion === "rechazar" && (
        <div className="mt-4 rounded-xl border border-line p-3">
          <label className="block text-sm font-bold" htmlFor={`motivo-${v.codigo}`}>
            Motivo del rechazo (lo ve quien publicó)
          </label>
          <select id={`motivo-${v.codigo}`} className="field mt-1" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
            {MOTIVOS_RECHAZO.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setAccion("")} className="btn btn-ghost flex-1">
              Cancelar
            </button>
            <button type="button" onClick={() => rechazarAviso(v, motivo)} className="btn btn-brand flex-1">
              Rechazar aviso
            </button>
          </div>
        </div>
      )}
      {accion === "bloquear" && v.particular && (
        <div className="mt-4 rounded-xl bg-danger/10 p-3 text-sm text-danger">
          <p className="font-bold">¿Bloquear a {v.particular.nombre}?</p>
          <p>Se rechazan todos sus avisos y no puede volver a publicar. En el portal real también se bloquean su email y su teléfono.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setAccion("")} className="btn btn-ghost flex-1 text-ink">
              Cancelar
            </button>
            <button type="button" onClick={() => bloquearCuenta(v.particular!.id)} className="btn flex-1 bg-danger text-white">
              Bloquear cuenta
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function GrupoDenuncias({ codigo, denuncias, aviso }: { codigo: string; denuncias: Denuncia[]; aviso?: Vehiculo }) {
  const motivos = [...new Set(denuncias.map((d) => d.motivo))];
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="flex items-center gap-2 font-bold">
          <FlagIcon className="size-4 text-danger" /> {denuncias[0].titulo}
        </p>
        <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger">
          {denuncias.length === 1 ? "1 denuncia" : `${denuncias.length} denuncias`}
        </span>
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {motivos.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      {denuncias.some((d) => d.detalle) && (
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {denuncias
            .filter((d) => d.detalle)
            .map((d) => (
              <li key={d.id}>“{d.detalle}”</li>
            ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {aviso && (
          <Link href={`/auto/${aviso.slug}`} className="btn btn-ghost">
            Ver aviso
          </Link>
        )}
        {aviso && aviso.estado !== "revision" && (
          <button
            type="button"
            onClick={async () => {
              await guardarLocal({ ...aviso, estado: "revision", motivosRevision: [`Denunciado: ${motivos.join(", ")}`] });
              resolverDenuncias(codigo);
            }}
            className="btn btn-brand"
          >
            Sacar y revisar
          </button>
        )}
        <button type="button" onClick={() => resolverDenuncias(codigo)} className="btn btn-ghost">
          Descartar
        </button>
      </div>
      {!aviso && <p className="mt-2 text-xs text-muted">Aviso de ejemplo: en el portal real también se puede sacar desde acá.</p>}
    </li>
  );
}

export default function AdminPage() {
  const datos = useModeracion();
  const [pestana, setPestana] = useState<"revision" | "denuncias">("revision");
  if (!datos) return <p className="py-16 text-center text-muted">Cargando…</p>;
  const grupos = new Map<string, Denuncia[]>();
  for (const d of datos.denuncias) grupos.set(d.codigo, [...(grupos.get(d.codigo) ?? []), d]);
  const porAviso = [...grupos];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Moderación</h1>
      <p className="text-sm text-muted">Revisá los avisos antes de que se publiquen y atendé las denuncias.</p>

      <div role="tablist" aria-label="Moderación" className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-line bg-soft p-1">
        {(
          [
            ["revision", `Para revisar (${datos.revision.length})`],
            ["denuncias", `Denuncias (${porAviso.length})`],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={pestana === id} onClick={() => setPestana(id)} className={`min-h-11 rounded-lg text-sm font-bold ${pestana === id ? "bg-surface text-brand shadow-sm" : "text-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4">
        {pestana === "revision" &&
          (datos.revision.length ? (
            <ul className="space-y-3">
              {datos.revision.map((v) => (
                <AvisoParaRevisar key={v.codigo} v={v} />
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-muted">No hay avisos esperando revisión.</p>
          ))}
        {pestana === "denuncias" &&
          (porAviso.length ? (
            <ul className="space-y-3">
              {porAviso.map(([codigo, ds]) => (
                <GrupoDenuncias key={codigo} codigo={codigo} denuncias={ds} aviso={datos.locales.find((v) => v.codigo === codigo)} />
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-muted">No hay denuncias abiertas.</p>
          ))}
      </div>
    </div>
  );
}
