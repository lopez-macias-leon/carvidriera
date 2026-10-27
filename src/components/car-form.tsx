"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cajas, colores, colorHex, combustibles, condiciones, frasesDescripcion, marcas, tipos } from "@/data/catalogos";
import { slugVehiculo, vehiculosDemo } from "@/data/demo";
import { useOrigen } from "@/lib/cliente";
import { borrarBorrador, guardarBorrador, guardarLocal, leerBorrador, nuevoCodigo } from "@/lib/demo-store";
import { formatKm, formatNumero, formatPrecio, labelCaja, labelCombustible } from "@/lib/format";
import { comprimirFoto } from "@/lib/imagenes";
import { AGENCIA_DEMO } from "@/lib/panel";
import type { Caja, Carroceria, Combustible, Condicion, Foto, Moneda, Tipo, Vehiculo } from "@/lib/types";
import { linkWhatsApp, mensajeCompartirAuto, urlAviso } from "@/lib/whatsapp";
import { CarCard } from "./car-card";
import { CameraIcon, CheckIcon, ChevronLeft, ChevronRight, CloseIcon, WhatsAppIcon } from "./icons";

const MAX_FOTOS = 12;
const MARCAS_POPULARES = ["Toyota", "Volkswagen", "Fiat", "Chevrolet", "Ford", "Renault", "Peugeot", "Nissan"];
const ANIOS = Array.from({ length: 37 }, (_, i) => 2026 - i);
const PASOS = ["Fotos", "El auto", "Precio", "Revisar"];

type Datos = {
  fotos: Foto[];
  condicion: Condicion;
  tipo: Tipo | "";
  marca: string;
  modelo: string;
  version: string;
  anio: number | "";
  km: string;
  combustible: Combustible | "";
  caja: Caja | "";
  color: string;
  puertas: number | "";
  moneda: Moneda;
  precio: string;
  consultar: boolean;
  papeles: boolean;
  documentacion: string;
  permuta: boolean;
  financiacion: boolean;
  descripcion: string;
};

const VACIO: Datos = {
  fotos: [],
  condicion: "usado",
  tipo: "",
  marca: "",
  modelo: "",
  version: "",
  anio: "",
  km: "",
  combustible: "",
  caja: "",
  color: "",
  puertas: "",
  moneda: "USD",
  precio: "",
  consultar: false,
  papeles: true,
  documentacion: "",
  permuta: false,
  financiacion: false,
  descripcion: "",
};

const CARROCERIA: Record<Tipo, Carroceria> = { auto: "sedan", camioneta: "pickup", suv: "suv", utilitario: "furgon" };

function desdeVehiculo(v: Vehiculo, duplicar: boolean): Datos {
  return {
    fotos: duplicar ? [] : v.fotos,
    condicion: v.condicion,
    tipo: v.tipo,
    marca: v.marca,
    modelo: v.modelo,
    version: v.version,
    anio: v.anio,
    km: duplicar ? "" : String(v.km),
    combustible: v.combustible,
    caja: v.caja,
    color: duplicar ? "" : v.color,
    puertas: v.puertas ?? "",
    moneda: v.moneda,
    precio: v.precio !== null ? String(v.precio) : "",
    consultar: v.precio === null,
    papeles: v.papelesAlDia,
    documentacion: v.documentacion ?? "",
    permuta: v.permuta,
    financiacion: v.financiacion,
    descripcion: v.descripcion,
  };
}

function aVehiculo(d: Datos, base?: Vehiculo, estado: Vehiculo["estado"] = "publicado"): Vehiculo {
  const codigo = base?.codigo ?? nuevoCodigo();
  const tipo = (d.tipo || "auto") as Tipo;
  const km = d.condicion === "0km" ? 0 : Number(d.km) || 0;
  const v = {
    codigo,
    agencia: AGENCIA_DEMO.slug,
    tipo,
    carroceria: tipo === "auto" && d.puertas === 5 ? ("hatch" as const) : CARROCERIA[tipo],
    condicion: d.condicion,
    marca: d.marca,
    modelo: d.modelo,
    version: d.version.trim(),
    anio: Number(d.anio) || 2026,
    km,
    combustible: (d.combustible || "nafta") as Combustible,
    caja: (d.caja || "manual") as Caja,
    color: d.color || "Gris",
    colorHex: colorHex[d.color] ?? "#7b8794",
    puertas: d.puertas || undefined,
    precio: d.consultar ? null : Number(d.precio) || null,
    moneda: d.moneda,
    papelesAlDia: d.papeles,
    documentacion: d.documentacion.trim() || undefined,
    permuta: d.permuta,
    financiacion: d.financiacion,
    descripcion: d.descripcion.trim(),
    localidad: AGENCIA_DEMO.localidad,
    estado,
    destacado: false,
    publicado: base?.publicado ?? new Date().toISOString(),
    fotos: d.fotos,
    local: true,
  };
  return { ...v, slug: slugVehiculo(v) };
}

/* ---------- Controles ---------- */

function Opciones<T extends string | number>({
  label,
  opciones,
  valor,
  onChange,
  columnas = false,
}: {
  label: string;
  opciones: { value: T; label: React.ReactNode }[];
  valor: T | "";
  onChange: (v: T) => void;
  columnas?: boolean;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <p id={id} className="mb-2 font-bold">
        {label}
      </p>
      <div className={columnas ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2"}>
        {opciones.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={valor === o.value} onClick={() => onChange(o.value)} className={`chip min-h-12 ${columnas ? "justify-center rounded-xl" : ""}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Interruptor({ label, ayuda, valor, onChange }: { label: string; ayuda?: string; valor: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={valor} onClick={() => onChange(!valor)} className="flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-2 text-left">
      <span>
        <span className="block font-bold">{label}</span>
        {ayuda && <span className="block text-sm text-muted">{ayuda}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${valor ? "bg-brand" : "bg-[#c5cedb]"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${valor ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

/* ---------- Paso 1: fotos ---------- */

function PasoFotos({ fotos, setFotos }: { fotos: Foto[]; setFotos: (f: (prev: Foto[]) => Foto[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [procesando, setProcesando] = useState(0);
  const [error, setError] = useState("");

  const agregar = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const lugar = MAX_FOTOS - fotos.length;
    const lista = Array.from(files).slice(0, lugar);
    if (files.length > lugar) setError(`Podés subir hasta ${MAX_FOTOS} fotos. Se agregaron las primeras ${lugar}.`);
    setProcesando((n) => n + lista.length);
    for (const f of lista) {
      try {
        const { src } = await comprimirFoto(f);
        setFotos((prev) => (prev.length < MAX_FOTOS ? [...prev, { src }] : prev));
      } catch {
        setError("Alguna foto no se pudo leer. Probá con otra.");
      }
      setProcesando((n) => n - 1);
    }
  };

  const mover = (i: number, dir: -1 | 1) =>
    setFotos((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copia = [...prev];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });

  return (
    <div>
      <h2 className="text-xl font-extrabold">Fotos del auto</h2>
      <p className="mt-1 text-muted">Hasta {MAX_FOTOS}. La primera es la portada. Se achican solas para que carguen rápido.</p>
      <input ref={input} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => (agregar(e.target.files), (e.target.value = ""))} aria-label="Elegir fotos" />
      <button type="button" onClick={() => input.current?.click()} disabled={fotos.length >= MAX_FOTOS} className="mt-4 flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/40 bg-brand-light/40 font-bold text-brand disabled:opacity-50">
        <CameraIcon className="size-8" />
        {fotos.length ? "Agregar más fotos" : "Elegir fotos o sacar con la cámara"}
        <span className="text-sm font-semibold text-muted">
          {fotos.length} de {MAX_FOTOS}
        </span>
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      {(fotos.length > 0 || procesando > 0) && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotos.map((f, i) => (
            <li key={f.src.slice(-40) + i} className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="relative aspect-[4/3] bg-soft">
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local */}
                <img src={f.src} alt={`Foto ${i + 1}`} className="absolute inset-0 size-full object-cover" />
                {i === 0 && <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-xs font-bold text-white">Portada</span>}
                <button type="button" onClick={() => setFotos((prev) => prev.filter((_, j) => j !== i))} className="absolute right-1.5 top-1.5 grid size-9 place-items-center rounded-full bg-ink/70 text-white" aria-label={`Quitar foto ${i + 1}`}>
                  <CloseIcon className="size-5" />
                </button>
              </div>
              <div className="flex items-center justify-between p-1">
                <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="grid size-10 place-items-center rounded-lg hover:bg-soft disabled:opacity-30" aria-label={`Mover foto ${i + 1} antes`}>
                  <ChevronLeft className="size-5" />
                </button>
                {i > 0 ? (
                  <button type="button" onClick={() => setFotos((prev) => [prev[i], ...prev.filter((_, j) => j !== i)])} className="px-2 text-xs font-bold text-brand">
                    Usar de portada
                  </button>
                ) : (
                  <span className="text-xs text-muted">Foto 1</span>
                )}
                <button type="button" onClick={() => mover(i, 1)} disabled={i === fotos.length - 1} className="grid size-10 place-items-center rounded-lg hover:bg-soft disabled:opacity-30" aria-label={`Mover foto ${i + 1} después`}>
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </li>
          ))}
          {Array.from({ length: procesando }, (_, i) => (
            <li key={`p${i}`} className="grid aspect-[4/3] animate-pulse place-items-center rounded-xl bg-soft text-sm font-semibold text-muted">
              Optimizando…
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 rounded-xl bg-soft p-3 text-sm">
        <p className="font-bold">Fotos que más consultas generan</p>
        <p className="text-muted">Frente, lateral, trasera, interior, tablero con los km y motor. De día y con fondo despejado.</p>
      </div>
    </div>
  );
}

/* ---------- Paso 2: el auto ---------- */

function PasoAuto({ d, set }: { d: Datos; set: (c: Partial<Datos>) => void }) {
  const modelos = d.marca ? (marcas[d.marca] ?? []) : [];
  const versiones = [...new Set(vehiculosDemo.filter((v) => v.marca === d.marca && v.modelo === d.modelo).map((v) => v.version))];
  const kmNum = Number(d.km);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Datos del auto</h2>
      <Opciones label="Condición" opciones={condiciones} valor={d.condicion} onChange={(condicion) => set({ condicion, ...(condicion === "0km" ? { km: "0", anio: 2026 } : { km: d.km === "0" ? "" : d.km }) })} columnas />
      <Opciones label="Tipo" opciones={tipos.map((t) => ({ value: t.value, label: t.label }))} valor={d.tipo} onChange={(tipo) => set({ tipo })} columnas />

      <div>
        <Opciones label="Marca" opciones={MARCAS_POPULARES.map((m) => ({ value: m, label: m }))} valor={d.marca} onChange={(marca) => set({ marca, modelo: "" })} />
        <label className="mt-2 block">
          <span className="sr-only">Otra marca</span>
          <select className="field" value={MARCAS_POPULARES.includes(d.marca) ? "" : d.marca} onChange={(e) => set({ marca: e.target.value, modelo: "" })}>
            <option value="">Otra marca…</option>
            {Object.keys(marcas).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      {d.marca && <Opciones label="Modelo" opciones={modelos.map((m) => ({ value: m, label: m }))} valor={d.modelo} onChange={(modelo) => set({ modelo })} />}

      <label className="block">
        <span className="font-bold">Versión</span>
        <input className="field mt-2" value={d.version} onChange={(e) => set({ version: e.target.value })} placeholder="Ej. 2.8 SRX 4x4 AT" list="versiones" autoComplete="off" />
        <datalist id="versiones">
          {versiones.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="font-bold">Año</span>
          <select className="field mt-2" value={d.anio} onChange={(e) => set({ anio: Number(e.target.value) || "" })}>
            <option value="">Elegir</option>
            {ANIOS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        {d.condicion === "usado" && (
          <label className="block">
            <span className="font-bold">Kilómetros</span>
            <input className="field mt-2" inputMode="numeric" value={d.km ? formatNumero(kmNum) : ""} onChange={(e) => set({ km: e.target.value.replace(/\D/g, "").slice(0, 7) })} placeholder="Ej. 68.000" />
          </label>
        )}
      </div>
      {kmNum > 500000 && (
        <p role="alert" className="-mt-3 text-sm font-semibold text-warn">
          ¿{formatNumero(kmNum)} km? Revisá el kilometraje.
        </p>
      )}

      <Opciones label="Combustible" opciones={combustibles} valor={d.combustible} onChange={(combustible) => set({ combustible })} />
      <Opciones label="Caja" opciones={cajas} valor={d.caja} onChange={(caja) => set({ caja })} columnas />
      <Opciones
        label="Color"
        opciones={colores.map((c) => ({
          value: c,
          label: (
            <>
              <span aria-hidden="true" className="size-4 rounded-full ring-1 ring-black/15" style={{ background: colorHex[c] }} />
              {c}
            </>
          ),
        }))}
        valor={d.color}
        onChange={(color) => set({ color })}
      />
      <Opciones label="Puertas (opcional)" opciones={[2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))} valor={d.puertas} onChange={(puertas) => set({ puertas })} />
    </div>
  );
}

/* ---------- Paso 3: precio y detalles ---------- */

function PasoPrecio({ d, set }: { d: Datos; set: (c: Partial<Datos>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold">Precio y detalles</h2>
      <div>
        <p className="mb-2 font-bold">Moneda</p>
        <div role="radiogroup" aria-label="Moneda" className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-soft p-1">
          {(["ARS", "USD"] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={d.moneda === m} onClick={() => set({ moneda: m })} className={`min-h-12 rounded-lg font-bold ${d.moneda === m ? "bg-surface text-brand shadow-sm" : "text-muted"}`}>
              {m === "ARS" ? "Pesos $" : "Dólares US$"}
            </button>
          ))}
        </div>
      </div>
      {!d.consultar && (
        <label className="block">
          <span className="font-bold">Precio</span>
          <span className="relative mt-2 block">
            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">{d.moneda === "USD" ? "US$" : "$"}</span>
            <input className="field pl-14 text-xl font-extrabold" inputMode="numeric" value={d.precio ? formatNumero(Number(d.precio)) : ""} onChange={(e) => set({ precio: e.target.value.replace(/\D/g, "").slice(0, 11) })} placeholder="0" />
          </span>
        </label>
      )}
      <Interruptor label="Consultar precio" ayuda="No mostrar el precio en el aviso" valor={d.consultar} onChange={(consultar) => set({ consultar })} />

      <div className="space-y-2 pt-2">
        <Interruptor label="Papeles al día" ayuda="Se muestra como informado por la agencia" valor={d.papeles} onChange={(papeles) => set({ papeles })} />
        <label className="block">
          <span className="text-sm font-bold">Detalle de la documentación (opcional)</span>
          <input className="field mt-1" value={d.documentacion} onChange={(e) => set({ documentacion: e.target.value })} placeholder="Ej. 08 firmado, VTV vigente" maxLength={140} />
        </label>
        <Interruptor label="Acepta permuta" valor={d.permuta} onChange={(permuta) => set({ permuta })} />
        <Interruptor label="Con financiación" valor={d.financiacion} onChange={(financiacion) => set({ financiacion })} />
      </div>

      <div>
        <label className="block">
          <span className="font-bold">Descripción (opcional)</span>
          <textarea className="field mt-2" rows={4} maxLength={1500} value={d.descripcion} onChange={(e) => set({ descripcion: e.target.value })} placeholder="Contá lo que hace especial a este auto" />
        </label>
        <p className="mt-2 text-sm text-muted">Tocá para sumar:</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {frasesDescripcion.map((f) => (
            <button key={f} type="button" onClick={() => set({ descripcion: d.descripcion.includes(f) ? d.descripcion : `${d.descripcion}${d.descripcion && !d.descripcion.endsWith(" ") ? ". " : ""}${f}` })} className="chip min-h-9 text-sm">
              + {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Asistente ---------- */

const faltantes = (d: Datos, paso: number) => {
  const f: string[] = [];
  if (paso === 1) {
    if (!d.tipo) f.push("tipo");
    if (!d.marca) f.push("marca");
    if (!d.modelo) f.push("modelo");
    if (!d.anio) f.push("año");
    if (d.condicion === "usado" && !d.km) f.push("kilómetros");
    if (!d.combustible) f.push("combustible");
    if (!d.caja) f.push("caja");
    if (!d.color) f.push("color");
  }
  if (paso === 2 && !d.consultar && !Number(d.precio)) f.push("precio (o activá \"Consultar precio\")");
  return f;
};

export function CarForm({ inicial, duplicar = false }: { inicial?: Vehiculo; duplicar?: boolean }) {
  const editando = !!inicial && !duplicar;
  const [d, setD] = useState<Datos>(inicial ? desdeVehiculo(inicial, duplicar) : VACIO);
  const [paso, setPaso] = useState(0);
  const [faltan, setFaltan] = useState<string[]>([]);
  const [borradorPrevio, setBorradorPrevio] = useState<{ paso: number; datos: Datos } | null>(null);
  const [listo, setListo] = useState<Vehiculo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const cargado = useRef(false);
  const titulo = useRef<HTMLDivElement>(null);

  // Borrador: se ofrece retomar al entrar y se guarda solo en cada cambio.
  useEffect(() => {
    if (editando || duplicar) {
      cargado.current = true;
      return;
    }
    leerBorrador<{ paso: number; datos: Datos }>().then((b) => {
      if (b && (b.datos.fotos.length || b.datos.marca)) setBorradorPrevio(b);
      cargado.current = true;
    });
  }, [editando, duplicar]);
  useEffect(() => {
    if (!cargado.current || editando || listo || borradorPrevio) return;
    const t = setTimeout(() => guardarBorrador({ paso, datos: d }), 400);
    return () => clearTimeout(t);
  }, [d, paso, editando, listo, borradorPrevio]);

  const set = (c: Partial<Datos>) => setD((prev) => ({ ...prev, ...c }));
  const irA = (n: number) => {
    setPaso(n);
    setFaltan([]);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 });
      titulo.current?.focus();
    });
  };
  const siguiente = () => {
    const f = faltantes(d, paso);
    if (f.length) return setFaltan(f);
    irA(paso + 1);
  };
  const guardar = async (estado: Vehiculo["estado"]) => {
    setGuardando(true);
    const v = aVehiculo(d, editando ? inicial : undefined, estado);
    await guardarLocal(v);
    await borrarBorrador();
    setGuardando(false);
    setListo(v);
    window.scrollTo({ top: 0 });
  };

  if (listo) return <Listo v={listo} editando={editando} />;

  if (borradorPrevio) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-lg font-extrabold">Tenés un auto sin terminar</p>
        <p className="mt-1 text-muted">
          {[borradorPrevio.datos.marca, borradorPrevio.datos.modelo].filter(Boolean).join(" ") || "Sin marca todavía"} · {borradorPrevio.datos.fotos.length} fotos
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="btn btn-brand"
            onClick={() => {
              setD(borradorPrevio.datos);
              setPaso(borradorPrevio.paso);
              setBorradorPrevio(null);
            }}
          >
            Seguir donde estaba
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              await borrarBorrador();
              setBorradorPrevio(null);
            }}
          >
            Empezar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const preview = aVehiculo(d, editando ? inicial : undefined);

  return (
    <div className="mx-auto max-w-2xl">
      <div ref={titulo} tabIndex={-1} className="outline-none">
        <p className="text-sm font-bold text-brand">
          {editando ? "Editar auto" : duplicar ? "Duplicar auto" : "Cargar auto"} · Paso {paso + 1} de {PASOS.length}
        </p>
        <ol className="mt-2 grid grid-cols-4 gap-1.5" aria-label="Pasos">
          {PASOS.map((p, i) => (
            <li key={p}>
              <button type="button" disabled={i > paso} onClick={() => irA(i)} className="w-full text-left disabled:cursor-default" aria-current={i === paso ? "step" : undefined}>
                <span className={`block h-1.5 rounded-full ${i <= paso ? "bg-brand" : "bg-line"}`} />
                <span className={`mt-1 block text-xs font-semibold ${i === paso ? "text-ink" : "text-muted"}`}>{p}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-4 sm:p-6">
        {paso === 0 && <PasoFotos fotos={d.fotos} setFotos={(fn) => setD((prev) => ({ ...prev, fotos: fn(prev.fotos) }))} />}
        {paso === 1 && <PasoAuto d={d} set={set} />}
        {paso === 2 && <PasoPrecio d={d} set={set} />}
        {paso === 3 && (
          <div>
            <h2 className="text-xl font-extrabold">Revisá y publicá</h2>
            <p className="mt-1 text-muted">Así va a ver el comprador la tarjeta de tu auto.</p>
            <div className="mx-auto mt-4 max-w-xs">
              <CarCard v={preview} agencia={AGENCIA_DEMO} />
            </div>
            <dl className="mt-5 divide-y divide-line rounded-xl border border-line text-sm">
              {[
                ["Fotos", `${d.fotos.length} de ${MAX_FOTOS}`],
                ["Precio", formatPrecio(preview.precio, preview.moneda)],
                ["Año y km", `${preview.anio} · ${formatKm(preview.km)}`],
                ["Motor y caja", `${labelCombustible(preview.combustible)} · ${labelCaja(preview.caja)}`],
                ["Papeles", d.papeles ? "Al día" : "Consultar"],
              ].map(([k, val]) => (
                <div key={k} className="flex justify-between gap-4 px-3 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{val}</dd>
                </div>
              ))}
            </dl>
            {!d.fotos.length && <p className="mt-3 rounded-xl bg-warn-bg p-3 text-sm font-semibold text-warn">Sin fotos: en la demo se muestra una ilustración. Los autos con fotos reciben muchas más consultas.</p>}
          </div>
        )}

        {faltan.length > 0 && (
          <p role="alert" className="mt-5 rounded-xl bg-warn-bg p-3 text-sm font-semibold text-warn">
            Falta completar: {faltan.join(", ")}.
          </p>
        )}
      </div>

      <div className="sticky bottom-16 z-30 -mx-4 mt-4 flex gap-2 border-t border-line bg-bg px-4 py-3 md:bottom-0 md:mx-0 md:rounded-2xl md:border">
        {paso > 0 && (
          <button type="button" onClick={() => irA(paso - 1)} className="btn btn-ghost">
            <ChevronLeft className="size-5" /> Atrás
          </button>
        )}
        {paso < 3 ? (
          <button type="button" onClick={siguiente} className="btn btn-brand flex-1">
            {paso === 0 && !d.fotos.length ? "Seguir sin fotos" : "Siguiente"} <ChevronRight className="size-5" />
          </button>
        ) : (
          <>
            {!editando && (
              <button type="button" disabled={guardando} onClick={() => guardar("borrador")} className="btn btn-ghost">
                Guardar borrador
              </button>
            )}
            <button type="button" disabled={guardando} onClick={() => guardar(editando ? inicial!.estado : "publicado")} className="btn btn-brand flex-1">
              <CheckIcon className="size-5" /> {editando ? "Guardar cambios" : "Publicar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Listo({ v, editando }: { v: Vehiculo; editando: boolean }) {
  const origen = useOrigen();
  const publicado = v.estado === "publicado";
  return (
    <div className="mx-auto max-w-lg text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-ok-bg text-ok">
        <CheckIcon className="size-9" />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold">{editando ? "Cambios guardados" : publicado ? "¡Listo! Tu auto ya está publicado" : "Guardado como borrador"}</h1>
      <p className="mt-1 text-muted">
        {v.marca} {v.modelo} {v.anio}
      </p>
      <div className="mx-auto mt-5 max-w-xs text-left">
        <CarCard v={v} agencia={AGENCIA_DEMO} />
      </div>
      <div className="mt-6 grid gap-2">
        {publicado && (
          <>
            <Link href={`/auto/${v.slug}`} className="btn btn-brand">
              Ver cómo lo ve el comprador
            </Link>
            <a href={linkWhatsApp("", mensajeCompartirAuto(v, urlAviso(v.slug, origen)))} target="_blank" rel="noopener" className="btn btn-wa">
              <WhatsAppIcon className="size-5" /> Compartir por WhatsApp
            </a>
          </>
        )}
        <a href="/panel/autos/nuevo" className="btn btn-ghost">
          Cargar otro auto
        </a>
        <Link href="/panel/autos" className="py-2 font-semibold text-brand">
          Ir a mis autos
        </Link>
      </div>
    </div>
  );
}
