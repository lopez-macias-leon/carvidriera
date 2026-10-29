"use client";

import Link from "next/link";
import { useState } from "react";
import { especialidades, localidades } from "@/data/catalogos";
import { labelEspecialidad, localidadCorta } from "@/lib/format";
import type { Especialidad, Taller } from "@/lib/types";
import { AgencyAvatar } from "./agency-avatar";
import { PinIcon, VerifiedIcon } from "./icons";
import { OpenNow } from "./open-now";

export function TallerCard({ t }: { t: Taller }) {
  return (
    <article className="relative flex h-full gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand hover:shadow-md">
      <AgencyAvatar agencia={t} />
      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-1 text-lg font-bold">
          <Link href={`/mecanico/${t.slug}`} className="truncate after:absolute after:inset-0 after:content-['']">
            {t.nombre}
          </Link>
          {t.verificado && (
            <>
              <VerifiedIcon className="size-5 shrink-0 text-brand" />
              <span className="sr-only">(taller verificado)</span>
            </>
          )}
        </h3>
        <p className="flex items-center gap-1 text-sm text-muted">
          <PinIcon className="size-3.5" /> {localidadCorta(t.localidad)}
        </p>
        <p className="mt-1">
          <OpenNow horarios={t.horarios} conHorario={false} />
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {t.especialidades.map((e) => (
            <li key={e} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${e === "precompra" ? "bg-brand-light text-brand" : "bg-soft text-ink"}`}>
              {labelEspecialidad(e)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Talleres con filtros por especialidad y localidad (la lista es chica: se filtra en el teléfono). */
export function TalleresList({ talleres, inicial }: { talleres: Taller[]; inicial?: Especialidad }) {
  const [especialidad, setEspecialidad] = useState<Especialidad | "">(inicial ?? "");
  const [localidad, setLocalidad] = useState("");
  const visibles = talleres.filter((t) => (!especialidad || t.especialidades.includes(especialidad)) && (!localidad || t.localidad === localidad));
  const disponibles = especialidades.filter((e) => talleres.some((t) => t.especialidades.includes(e.value)));
  return (
    <div>
      <div className="scroll-row -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" className="chip shrink-0" aria-pressed={!especialidad} onClick={() => setEspecialidad("")}>
          Todas
        </button>
        {disponibles.map((e) => (
          <button key={e.value} type="button" className="chip shrink-0" aria-pressed={especialidad === e.value} onClick={() => setEspecialidad(especialidad === e.value ? "" : e.value)}>
            {e.label}
          </button>
        ))}
      </div>
      <label className="mt-3 block max-w-xs">
        <span className="sr-only">Localidad</span>
        <select className="field min-h-11 py-2" value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
          <option value="">Todas las localidades</option>
          {localidades.map((l) => (
            <option key={l.slug} value={l.slug}>
              {localidadCorta(l.slug)}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-4 text-sm font-semibold text-muted" aria-live="polite">
        {visibles.length === 1 ? "1 taller" : `${visibles.length} talleres`}
      </p>
      {visibles.length ? (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((t) => (
            <li key={t.slug} className="min-w-0">
              <TallerCard t={t} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-muted">No hay talleres con esos filtros.</p>
      )}
    </div>
  );
}
