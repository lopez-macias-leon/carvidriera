"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { marcas } from "@/data/catalogos";
import { normalizar } from "@/lib/filtros";
import { SearchIcon } from "./icons";

const SUGERENCIAS = Object.entries(marcas).flatMap(([marca, modelos]) => [marca, ...modelos.map((m) => `${marca} ${m}`)]);

/** Buscador por marca o modelo con sugerencias. Sin JavaScript funciona como formulario GET. */
export function SearchBox({ defaultValue = "", grande = false }: { defaultValue?: string; grande?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  const listId = useId();

  const opciones = useMemo(() => {
    const t = normalizar(q.trim());
    if (t.length < 2) return [];
    return SUGERENCIAS.filter((s) => normalizar(s).split(" ").some((w) => w.startsWith(t)) || normalizar(s).startsWith(t)).slice(0, 6);
  }, [q]);

  const ir = (texto: string) => {
    setAbierto(false);
    router.push(texto.trim() ? `/autos?q=${encodeURIComponent(texto.trim())}` : "/autos");
  };

  return (
    <form
      action="/autos"
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        ir(activo >= 0 && opciones[activo] ? opciones[activo] : q);
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscá marca o modelo
      </label>
      <div className={`flex items-center gap-2 rounded-2xl border border-line bg-surface shadow-sm focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-light ${grande ? "p-2" : "p-1.5"}`}>
        <SearchIcon className="ml-2 size-5 shrink-0 text-muted" />
        <input
          id={`${listId}-input`}
          name="q"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setAbierto(true);
            setActivo(-1);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setTimeout(() => setAbierto(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActivo((i) => Math.min(i + 1, opciones.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActivo((i) => Math.max(i - 1, -1));
            } else if (e.key === "Escape") setAbierto(false);
          }}
          placeholder="Marca o modelo, ej. Hilux"
          autoComplete="off"
          role="combobox"
          aria-expanded={abierto && opciones.length > 0}
          aria-controls={listId}
          aria-activedescendant={activo >= 0 ? `${listId}-${activo}` : undefined}
          className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted ${grande ? "py-2.5" : "py-1.5"}`}
        />
        <button type="submit" className={`btn btn-brand shrink-0 ${grande ? "" : "min-h-10 px-3 text-sm"}`}>
          Buscar
        </button>
      </div>
      {abierto && opciones.length > 0 && (
        <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-surface py-1 shadow-lg">
          {opciones.map((o, i) => (
            <li
              key={o}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activo}
              onMouseDown={(e) => {
                e.preventDefault();
                setQ(o);
                ir(o);
              }}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-left ${i === activo ? "bg-soft" : "hover:bg-soft"}`}
            >
              <SearchIcon className="size-4 text-muted" />
              {o}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
