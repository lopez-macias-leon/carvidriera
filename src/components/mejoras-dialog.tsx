"use client";

import { useRef, useState } from "react";
import { mejoras, type CodigoMejora } from "@/config/planes";
import { formatNumero } from "@/lib/format";
import { aplicarMejora } from "@/lib/mi-cuenta";
import type { Vehiculo } from "@/lib/types";
import { CheckIcon, SparkIcon } from "./icons";

const precioMejora = (precio: number | null) => (precio === null ? "Precio a definir" : `$ ${formatNumero(precio)}`);

/**
 * Elegir y pagar una mejora. Demo: el pago se simula.
 * En producción: el servidor crea la compra y la preferencia de Mercado Pago, la persona paga allá,
 * y el webhook activa la mejora al confirmar el pago.
 */
export function MejorasDialog({ v }: { v: Vehiculo }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [elegida, setElegida] = useState<CodigoMejora>("destacado");
  const [paso, setPaso] = useState<"elegir" | "pagar" | "listo">("elegir");
  const mejora = mejoras.find((m) => m.codigo === elegida)!;

  const abrir = () => {
    setPaso("elegir");
    ref.current?.showModal();
  };

  return (
    <>
      <button type="button" onClick={abrir} className="btn min-h-10 bg-gold-bg px-3 text-sm text-gold hover:brightness-95">
        <SparkIcon className="size-4" /> Destacar
      </button>
      <dialog ref={ref} className="m-auto w-[min(92vw,28rem)] rounded-2xl p-0 backdrop:bg-ink/50" aria-labelledby={`mejoras-${v.codigo}`}>
        <div className="p-5">
          <h2 id={`mejoras-${v.codigo}`} className="text-lg font-extrabold">
            {paso === "listo" ? "¡Mejora activada!" : "Vendé más rápido"}
          </h2>
          <p className="text-sm text-muted">
            {v.marca} {v.modelo} {v.anio}
          </p>

          {paso === "elegir" && (
            <>
              <fieldset className="mt-4 grid gap-2">
                <legend className="sr-only">Elegí una mejora</legend>
                {mejoras.map((m) => (
                  <label key={m.codigo} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${elegida === m.codigo ? "border-brand bg-brand-light/40" : "border-line"}`}>
                    <input type="radio" name={`mejora-${v.codigo}`} value={m.codigo} checked={elegida === m.codigo} onChange={() => setElegida(m.codigo)} className="mt-1 size-5 accent-brand" />
                    <span className="flex-1">
                      <span className="flex justify-between gap-2 font-bold">
                        {m.nombre}
                        <span className="shrink-0 text-sm text-muted">{precioMejora(m.precio)}</span>
                      </span>
                      <span className="block text-sm text-muted">{m.descripcion}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="mt-5 flex gap-2">
                <button type="button" onClick={() => ref.current?.close()} className="btn btn-ghost flex-1">
                  Cancelar
                </button>
                <button type="button" onClick={() => setPaso("pagar")} className="btn btn-brand flex-1">
                  Pagar con Mercado Pago
                </button>
              </div>
            </>
          )}

          {paso === "pagar" && (
            <>
              <div className="mt-4 rounded-xl bg-soft p-4 text-sm">
                <p className="font-bold">{mejora.nombre}</p>
                <p className="text-muted">{precioMejora(mejora.precio)}</p>
                <p className="mt-3">
                  <strong>Demo: no se cobra nada.</strong> En el portal real se abre Mercado Pago y la mejora se activa sola cuando se acredita el pago.
                </p>
              </div>
              <div className="mt-5 flex gap-2">
                <button type="button" onClick={() => setPaso("elegir")} className="btn btn-ghost flex-1">
                  Volver
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await aplicarMejora(v, elegida);
                    setPaso("listo");
                  }}
                  className="btn btn-brand flex-1"
                >
                  Simular pago aprobado
                </button>
              </div>
            </>
          )}

          {paso === "listo" && (
            <>
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-ok-bg p-3 font-semibold text-ok">
                <CheckIcon className="size-5" /> {mejora.nombre} activado en tu aviso.
              </p>
              <form method="dialog">
                <button className="btn btn-brand mt-5 w-full">Listo</button>
              </form>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
