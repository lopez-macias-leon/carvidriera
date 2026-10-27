"use client";

import { useEffect, useRef, useState } from "react";
import type { Vehiculo } from "@/lib/types";
import { ChevronLeft, ChevronRight, CloseIcon } from "./icons";
import { cantidadFotos, VehiculoFoto } from "./vehiculo-foto";

type V = Pick<Vehiculo, "codigo" | "carroceria" | "colorHex" | "fotos">;

/** Galería deslizable con contador, miniaturas y pantalla completa. */
export function Gallery({ v, titulo, children }: { v: V; titulo: string; children?: React.ReactNode }) {
  const total = cantidadFotos(v);
  const [actual, setActual] = useState(0);
  const [completa, setCompleta] = useState(false);
  const fila = useRef<HTMLUListElement>(null);

  const ir = (i: number, smooth = true) => {
    const n = (i + total) % total;
    const el = fila.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? "smooth" : "instant" });
    setActual(n);
  };

  useEffect(() => {
    if (!completa) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompleta(false);
      if (e.key === "ArrowRight") setActual((a) => (a + 1) % total);
      if (e.key === "ArrowLeft") setActual((a) => (a - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [completa, total]);

  const alt = (i: number) => `Foto ${i + 1} de ${total} de ${titulo}`;

  return (
    <div>
      <div className="relative -mx-4 overflow-hidden bg-soft sm:mx-0 sm:rounded-2xl">
        <ul
          ref={fila}
          className="scroll-row flex aspect-[4/3] overflow-x-auto"
          aria-label={`Fotos de ${titulo}`}
          onScroll={(e) => {
            const el = e.currentTarget;
            setActual(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {Array.from({ length: total }, (_, i) => (
            <li key={i} className="relative w-full shrink-0">
              <button type="button" onClick={() => setCompleta(true)} className="absolute inset-0 size-full cursor-zoom-in" aria-label={`Ver ${alt(i).toLowerCase()} en pantalla completa`}>
                <VehiculoFoto v={v} indice={i} eager={i === 0} alt={alt(i)} className="size-full" />
              </button>
            </li>
          ))}
        </ul>
        {children}
        <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-bold text-white" aria-live="polite">
          {actual + 1}/{total}
        </span>
        <button type="button" onClick={() => ir(actual - 1)} className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow sm:grid" aria-label="Foto anterior">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => ir(actual + 1)} className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow sm:grid" aria-label="Foto siguiente">
          <ChevronRight className="size-5" />
        </button>
      </div>
      {total > 1 && (
        <ul className="scroll-row mt-2 flex gap-2 overflow-x-auto" aria-label="Miniaturas">
          {Array.from({ length: total }, (_, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                aria-current={i === actual}
                className={`relative block h-14 w-[4.7rem] overflow-hidden rounded-lg ring-2 ${i === actual ? "ring-brand" : "ring-transparent opacity-70"}`}
              >
                <VehiculoFoto v={v} indice={i} alt="" className="absolute inset-0 size-full" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {completa && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label={`Fotos de ${titulo}`}>
          <div className="flex items-center justify-between p-3 text-white">
            <span className="text-sm font-bold">
              {actual + 1} / {total}
            </span>
            <button type="button" onClick={() => setCompleta(false)} className="grid size-11 place-items-center rounded-full bg-white/10" aria-label="Cerrar" autoFocus>
              <CloseIcon className="size-6" />
            </button>
          </div>
          <div className="relative flex-1">
            <VehiculoFoto v={v} indice={actual} alt={alt(actual)} className="absolute inset-0 size-full object-contain" />
            <button type="button" onClick={() => setActual((a) => (a - 1 + total) % total)} className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white" aria-label="Foto anterior">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => setActual((a) => (a + 1) % total)} className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white" aria-label="Foto siguiente">
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
