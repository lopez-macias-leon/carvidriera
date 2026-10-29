"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cajas, combustibles, condiciones, localidades, marcas, tipos } from "@/data/catalogos";
import { cantidadFiltrosActivos, filtrosAQuery, type Filtros, type Orden } from "@/lib/filtros";
import { localidadCorta } from "@/lib/format";
import type { Agencia } from "@/lib/types";
import { CloseIcon, FilterIcon } from "./icons";

type Conteo = Record<string, number>;
export type Conteos = Record<"tipo" | "condicion" | "marca" | "modelo" | "combustible" | "caja" | "localidad" | "agencia" | "vendedor", Conteo>;

const VENDEDORES = [
  { value: "agencia" as const, label: "Concesionarias" },
  { value: "particular" as const, label: "Particulares" },
];

const ANIO_ACTUAL = 2026;
const ANIOS = Array.from({ length: 27 }, (_, i) => ANIO_ACTUAL - i);
const KMS = [10000, 30000, 50000, 80000, 100000, 150000, 200000];

export const ORDENES: { value: Orden; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio_asc", label: "Menor precio" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "km", label: "Menos kilómetros" },
  { value: "anio", label: "Más nuevos" },
];

function useNavegarFiltros(filtros: Filtros) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendiente, start] = useTransition();
  const aplicar = (cambios: Partial<Filtros>) => {
    const qs = filtrosAQuery({ ...filtros, ...cambios, pagina: 1 });
    start(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };
  return { aplicar, pendiente };
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4 last:border-0">
      <legend className="float-left mb-2.5 w-full text-sm font-bold">{titulo}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Chips<T extends string>({
  opciones,
  seleccion,
  onToggle,
  conteo,
}: {
  opciones: { value: T; label: string }[];
  seleccion: T[];
  onToggle: (v: T) => void;
  conteo?: Conteo;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const n = conteo?.[o.value] ?? 0;
        const on = seleccion.includes(o.value);
        return (
          <button key={o.value} type="button" aria-pressed={on} onClick={() => onToggle(o.value)} className={`chip ${!on && conteo && n === 0 ? "opacity-50" : ""}`}>
            {o.label}
            {conteo && <span className={on ? "text-white/80" : "text-muted"}>{n}</span>}
          </button>
        );
      })}
    </div>
  );
}

function PrecioInputs({ filtros, aplicar }: { filtros: Filtros; aplicar: (c: Partial<Filtros>) => void }) {
  const [min, setMin] = useState(filtros.precioMin?.toString() ?? "");
  const [max, setMax] = useState(filtros.precioMax?.toString() ?? "");
  const moneda = filtros.moneda ?? "USD";
  const confirmar = () => {
    const n = (s: string) => (Number(s.replace(/\D/g, "")) > 0 ? Number(s.replace(/\D/g, "")) : undefined);
    const precioMin = n(min);
    const precioMax = n(max);
    if (precioMin === filtros.precioMin && precioMax === filtros.precioMax && filtros.moneda) return;
    aplicar({ moneda, precioMin, precioMax });
  };
  return (
    <div>
      <div role="radiogroup" aria-label="Moneda" className="mb-3 inline-flex rounded-xl border border-line bg-soft p-1">
        {(["ARS", "USD"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={moneda === m}
            onClick={() => aplicar({ moneda: m, precioMin: undefined, precioMax: undefined })}
            className={`min-h-10 rounded-lg px-4 text-sm font-bold ${moneda === m ? "bg-surface text-brand shadow-sm" : "text-muted"}`}
          >
            {m === "ARS" ? "Pesos $" : "Dólares US$"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">Precio desde</span>
          <input inputMode="numeric" placeholder="Desde" value={min} onChange={(e) => setMin(e.target.value)} onBlur={confirmar} onKeyDown={(e) => e.key === "Enter" && confirmar()} className="field" />
        </label>
        <span className="text-muted">–</span>
        <label className="flex-1">
          <span className="sr-only">Precio hasta</span>
          <input inputMode="numeric" placeholder="Hasta" value={max} onChange={(e) => setMax(e.target.value)} onBlur={confirmar} onKeyDown={(e) => e.key === "Enter" && confirmar()} className="field" />
        </label>
      </div>
      <p className="mt-2 text-xs text-muted">Los autos con &quot;Consultar precio&quot; no aparecen al filtrar por precio.</p>
    </div>
  );
}

function FiltrosForm({ filtros, conteos, agencias, aplicar }: { filtros: Filtros; conteos: Conteos; agencias: Agencia[]; aplicar: (c: Partial<Filtros>) => void }) {
  const toggle = <T extends string>(lista: T[] | undefined, v: T) => {
    const actual = lista ?? [];
    const nueva = actual.includes(v) ? actual.filter((x) => x !== v) : [...actual, v];
    return nueva.length ? nueva : undefined;
  };
  const modelos = filtros.marca ? (marcas[filtros.marca] ?? []) : [];
  return (
    <div>
      <Grupo titulo="Vendedor">
        <Chips opciones={VENDEDORES} seleccion={filtros.vendedor ? [filtros.vendedor] : []} conteo={conteos.vendedor} onToggle={(v) => aplicar({ vendedor: filtros.vendedor === v ? undefined : v, agencia: undefined })} />
      </Grupo>
      <Grupo titulo="Tipo">
        <Chips opciones={tipos} seleccion={filtros.tipo ? [filtros.tipo] : []} conteo={conteos.tipo} onToggle={(v) => aplicar({ tipo: filtros.tipo === v ? undefined : v })} />
      </Grupo>
      <Grupo titulo="Condición">
        <Chips opciones={condiciones} seleccion={filtros.condicion ? [filtros.condicion] : []} conteo={conteos.condicion} onToggle={(v) => aplicar({ condicion: filtros.condicion === v ? undefined : v })} />
      </Grupo>
      <Grupo titulo="Marca y modelo">
        <div className="grid gap-2">
          <label>
            <span className="sr-only">Marca</span>
            <select className="field" value={filtros.marca ?? ""} onChange={(e) => aplicar({ marca: e.target.value || undefined, modelo: undefined })}>
              <option value="">Todas las marcas</option>
              {Object.keys(marcas).map((m) => (
                <option key={m} value={m}>
                  {m} ({conteos.marca[m] ?? 0})
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Modelo</span>
            <select className="field disabled:opacity-50" value={filtros.modelo ?? ""} disabled={!filtros.marca} onChange={(e) => aplicar({ modelo: e.target.value || undefined })}>
              <option value="">{filtros.marca ? "Todos los modelos" : "Elegí una marca primero"}</option>
              {modelos.map((m) => (
                <option key={m} value={m}>
                  {m} ({conteos.modelo[m] ?? 0})
                </option>
              ))}
            </select>
          </label>
        </div>
      </Grupo>
      <Grupo titulo="Precio">
        <PrecioInputs key={`${filtros.moneda}-${filtros.precioMin}-${filtros.precioMax}`} filtros={filtros} aplicar={aplicar} />
      </Grupo>
      <Grupo titulo="Año">
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Año desde</span>
            <select className="field" value={filtros.anioMin ?? ""} onChange={(e) => aplicar({ anioMin: Number(e.target.value) || undefined })}>
              <option value="">Desde</option>
              {ANIOS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <span className="text-muted">–</span>
          <label className="flex-1">
            <span className="sr-only">Año hasta</span>
            <select className="field" value={filtros.anioMax ?? ""} onChange={(e) => aplicar({ anioMax: Number(e.target.value) || undefined })}>
              <option value="">Hasta</option>
              {ANIOS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>
      </Grupo>
      <Grupo titulo="Kilómetros">
        <label>
          <span className="sr-only">Kilómetros máximos</span>
          <select className="field" value={filtros.kmMax ?? ""} onChange={(e) => aplicar({ kmMax: Number(e.target.value) || undefined })}>
            <option value="">Cualquier kilometraje</option>
            {KMS.map((k) => (
              <option key={k} value={k}>
                Hasta {k.toLocaleString("es-AR")} km
              </option>
            ))}
          </select>
        </label>
      </Grupo>
      <Grupo titulo="Combustible">
        <Chips opciones={combustibles} seleccion={filtros.combustible ?? []} conteo={conteos.combustible} onToggle={(v) => aplicar({ combustible: toggle(filtros.combustible, v) })} />
      </Grupo>
      <Grupo titulo="Caja">
        <Chips opciones={cajas} seleccion={filtros.caja ? [filtros.caja] : []} conteo={conteos.caja} onToggle={(v) => aplicar({ caja: filtros.caja === v ? undefined : v })} />
      </Grupo>
      <Grupo titulo="Localidad">
        <Chips
          opciones={localidades.map((l) => ({ value: l.slug, label: localidadCorta(l.slug) }))}
          seleccion={filtros.localidad ?? []}
          conteo={conteos.localidad}
          onToggle={(v) => aplicar({ localidad: toggle(filtros.localidad, v) })}
        />
      </Grupo>
      {agencias.length > 1 && filtros.vendedor !== "particular" && (
        <Grupo titulo="Concesionaria">
          <label>
            <span className="sr-only">Agencia</span>
            <select className="field" value={filtros.agencia ?? ""} onChange={(e) => aplicar({ agencia: e.target.value || undefined })}>
              <option value="">Todas las concesionarias</option>
              {agencias.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.nombre} ({conteos.agencia[a.slug] ?? 0})
                </option>
              ))}
            </select>
          </label>
        </Grupo>
      )}
      <Grupo titulo="Más opciones">
        <div className="grid gap-1">
          {(
            [
              ["permuta", "Acepta permuta"],
              ["financiacion", "Con financiación"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" checked={!!filtros[k]} onChange={(e) => aplicar({ [k]: e.target.checked || undefined })} className="size-5 accent-brand" />
              <span className="text-sm font-semibold">{label}</span>
            </label>
          ))}
        </div>
      </Grupo>
    </div>
  );
}

/** Filtros: columna fija en escritorio, panel desde abajo en celular. Cada cambio actualiza la URL. */
export function Filters({ filtros, conteos, agencias, total, soloSheet = false }: { filtros: Filtros; conteos: Conteos; agencias: Agencia[]; total: number; soloSheet?: boolean }) {
  const { aplicar, pendiente } = useNavegarFiltros(filtros);
  const [abierto, setAbierto] = useState(false);
  const n = cantidadFiltrosActivos(filtros);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const limpiar = () => aplicar({ vendedor: undefined, tipo: undefined, condicion: undefined, marca: undefined, modelo: undefined, moneda: undefined, precioMin: undefined, precioMax: undefined, anioMin: undefined, anioMax: undefined, kmMax: undefined, combustible: undefined, caja: undefined, localidad: undefined, agencia: undefined, permuta: undefined, financiacion: undefined });

  return (
    <>
      <button type="button" onClick={() => setAbierto(true)} className={`btn btn-ghost min-h-11 ${soloSheet ? "" : "lg:hidden"}`} aria-haspopup="dialog">
        <FilterIcon className="size-5" />
        Filtros{n > 0 && <span className="grid min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs text-white">{n}</span>}
      </button>

      {!soloSheet && (
        <aside aria-label="Filtros" className={`hidden lg:block ${pendiente ? "opacity-70" : ""}`} data-filtros-desktop>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Filtros</h2>
            {n > 0 && (
              <button type="button" onClick={limpiar} className="text-sm font-semibold text-brand hover:underline">
                Limpiar
              </button>
            )}
          </div>
          <FiltrosForm filtros={filtros} conteos={conteos} agencias={agencias} aplicar={aplicar} />
        </aside>
      )}

      {abierto && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="titulo-filtros">
          <button type="button" aria-label="Cerrar filtros" className="absolute inset-0 bg-ink/40" onClick={() => setAbierto(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 id="titulo-filtros" className="text-lg font-extrabold">
                Filtros
              </h2>
              <div className="flex items-center gap-2">
                {n > 0 && (
                  <button type="button" onClick={limpiar} className="px-2 py-2 text-sm font-semibold text-brand">
                    Limpiar
                  </button>
                )}
                <button type="button" onClick={() => setAbierto(false)} className="grid size-11 place-items-center rounded-full hover:bg-soft" aria-label="Cerrar filtros" autoFocus>
                  <CloseIcon className="size-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
              <FiltrosForm filtros={filtros} conteos={conteos} agencias={agencias} aplicar={aplicar} />
            </div>
            <div className="border-t border-line p-4">
              <button type="button" onClick={() => setAbierto(false)} className="btn btn-brand w-full text-base" aria-live="polite">
                {pendiente ? "Buscando…" : total === 1 ? "Ver 1 auto" : `Ver ${total} autos`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SortSelect({ filtros }: { filtros: Filtros }) {
  const { aplicar } = useNavegarFiltros(filtros);
  return (
    <label className="relative">
      <span className="sr-only">Ordenar por</span>
      <select value={filtros.orden} onChange={(e) => aplicar({ orden: e.target.value as Orden })} className="field min-h-11 w-40 max-w-full py-2 font-semibold">
        {ORDENES.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Chips de filtros activos con botón para quitar cada uno. */
export function ActiveChips({ filtros }: { filtros: Filtros }) {
  const { aplicar } = useNavegarFiltros(filtros);
  const chips: { label: string; quitar: Partial<Filtros> }[] = [];
  if (filtros.q) chips.push({ label: `"${filtros.q}"`, quitar: { q: undefined } });
  if (filtros.tipo) chips.push({ label: tipos.find((t) => t.value === filtros.tipo)?.label ?? filtros.tipo, quitar: { tipo: undefined } });
  if (filtros.condicion) chips.push({ label: filtros.condicion === "0km" ? "0 km" : "Usado", quitar: { condicion: undefined } });
  if (filtros.marca) chips.push({ label: filtros.marca, quitar: { marca: undefined, modelo: undefined } });
  if (filtros.modelo) chips.push({ label: filtros.modelo, quitar: { modelo: undefined } });
  if (filtros.precioMin || filtros.precioMax) {
    const s = filtros.moneda === "ARS" ? "$" : "US$";
    const f = (n?: number) => (n ? `${s} ${n.toLocaleString("es-AR")}` : "");
    chips.push({ label: filtros.precioMin && filtros.precioMax ? `${f(filtros.precioMin)} a ${f(filtros.precioMax)}` : filtros.precioMin ? `Desde ${f(filtros.precioMin)}` : `Hasta ${f(filtros.precioMax)}`, quitar: { precioMin: undefined, precioMax: undefined, moneda: undefined } });
  }
  if (filtros.anioMin || filtros.anioMax) chips.push({ label: `Año ${filtros.anioMin ?? "…"}–${filtros.anioMax ?? "…"}`, quitar: { anioMin: undefined, anioMax: undefined } });
  if (filtros.kmMax) chips.push({ label: `Hasta ${filtros.kmMax.toLocaleString("es-AR")} km`, quitar: { kmMax: undefined } });
  for (const c of filtros.combustible ?? []) chips.push({ label: combustibles.find((x) => x.value === c)?.label ?? c, quitar: { combustible: filtros.combustible!.filter((x) => x !== c) } });
  if (filtros.caja) chips.push({ label: filtros.caja === "manual" ? "Manual" : "Automática", quitar: { caja: undefined } });
  for (const l of filtros.localidad ?? []) chips.push({ label: localidadCorta(l), quitar: { localidad: filtros.localidad!.filter((x) => x !== l) } });
  if (filtros.agencia) chips.push({ label: "Concesionaria", quitar: { agencia: undefined } });
  if (filtros.vendedor) chips.push({ label: filtros.vendedor === "agencia" ? "Concesionarias" : "Particulares", quitar: { vendedor: undefined } });
  if (filtros.permuta) chips.push({ label: "Permuta", quitar: { permuta: undefined } });
  if (filtros.financiacion) chips.push({ label: "Financiación", quitar: { financiacion: undefined } });
  if (!chips.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Filtros activos">
      {chips.map((c) => (
        <li key={c.label}>
          <button
            type="button"
            onClick={() => aplicar(Object.fromEntries(Object.entries(c.quitar).map(([k, v]) => [k, Array.isArray(v) && !v.length ? undefined : v])))}
            className="chip min-h-9 border-brand bg-brand-light text-brand"
            aria-label={`Quitar filtro ${c.label}`}
          >
            {c.label}
            <CloseIcon className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
