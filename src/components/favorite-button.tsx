"use client";

import { alternarFavorito, useFavoritos } from "@/lib/favoritos";
import { HeartIcon } from "./icons";

export function FavoriteButton({ codigo, titulo, className = "" }: { codigo: string; titulo: string; className?: string }) {
  const favoritos = useFavoritos();
  const activo = favoritos.includes(codigo);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alternarFavorito(codigo);
      }}
      aria-pressed={activo}
      aria-label={activo ? `Quitar ${titulo} de favoritos` : `Guardar ${titulo} en favoritos`}
      className={`grid size-11 place-items-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 transition hover:bg-white ${activo ? "text-danger" : "text-ink"} ${className}`}
    >
      <HeartIcon filled={activo} className="size-5" />
    </button>
  );
}
