"use client";

import { useSyncExternalStore } from "react";

/** Favoritos del comprador: solo en este teléfono, sin cuenta. */
const KEY = "cv:favoritos";
const EVENTO = "cv:favoritos";

function leer(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

let cache: string[] | null = null;
const snapshot = () => (cache ??= leer());
const vacio: string[] = [];

function suscribir(cb: () => void) {
  const handler = () => {
    cache = null;
    cb();
  };
  window.addEventListener(EVENTO, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENTO, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useFavoritos() {
  return useSyncExternalStore(suscribir, snapshot, () => vacio);
}

export function alternarFavorito(codigo: string) {
  const actual = leer();
  const nuevo = actual.includes(codigo) ? actual.filter((c) => c !== codigo) : [codigo, ...actual];
  try {
    localStorage.setItem(KEY, JSON.stringify(nuevo));
  } catch {
    /* almacenamiento bloqueado: el favorito no se guarda */
  }
  window.dispatchEvent(new Event(EVENTO));
}
