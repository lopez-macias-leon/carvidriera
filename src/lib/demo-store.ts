"use client";

/**
 * Almacenamiento de la demo del panel: los autos que la agencia carga quedan en este teléfono
 * (IndexedDB, con las fotos ya comprimidas). En producción esto se reemplaza por Supabase.
 */
import type { EstadoVehiculo, Vehiculo } from "./types";

const DB = "carvidriera-demo";
const STORE = "vehiculos";
const EVENTO = "cv:demo-store";

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "codigo" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Si el navegador bloquea IndexedDB (ventana privada, vista embebida), los datos viven en memoria hasta recargar. */
const memoria = new Map<string, { codigo: string }>();
const memoriaStore = {
  getAll: () => [...memoria.values()],
  get: (k: string) => memoria.get(k),
  put: (v: { codigo: string }) => void memoria.set(v.codigo, v),
  delete: (k: string) => void memoria.delete(k),
};

async function tx<T>(modo: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  let db: IDBDatabase;
  try {
    db = await abrir();
  } catch {
    // Mismo uso que un IDBObjectStore, resuelto en el momento.
    const fake = new Proxy({} as IDBObjectStore, {
      get: (_, prop: keyof typeof memoriaStore) => (...args: never[]) => ({ result: (memoriaStore[prop] as (...a: never[]) => unknown)(...args) }),
    });
    return (fn(fake) as unknown as { result: T }).result;
  }
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, modo).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listarLocales(): Promise<Vehiculo[]> {
  try {
    const todos = await tx<Vehiculo[]>("readonly", (s) => s.getAll());
    return todos.filter((v) => v.codigo !== BORRADOR).sort((a, b) => b.publicado.localeCompare(a.publicado));
  } catch {
    return [];
  }
}

export async function obtenerLocal(slugOCodigo: string) {
  const todos = await listarLocales();
  return todos.find((v) => v.slug === slugOCodigo || v.codigo === slugOCodigo) ?? null;
}

export async function guardarLocal(v: Vehiculo) {
  await tx("readwrite", (s) => s.put({ ...v, local: true }));
  window.dispatchEvent(new Event(EVENTO));
}

export async function borrarLocal(codigo: string) {
  await tx("readwrite", (s) => s.delete(codigo));
  window.dispatchEvent(new Event(EVENTO));
}

export function alCambiar(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  return () => window.removeEventListener(EVENTO, cb);
}

/** Cambios de estado de los autos de ejemplo hechos desde el panel (solo en este teléfono). */
const KEY_ESTADOS = "cv:estados";
export function estadosDemo(): Record<string, EstadoVehiculo> {
  try {
    return JSON.parse(localStorage.getItem(KEY_ESTADOS) ?? "{}");
  } catch {
    return {};
  }
}
export function cambiarEstadoDemo(codigo: string, estado: EstadoVehiculo) {
  try {
    localStorage.setItem(KEY_ESTADOS, JSON.stringify({ ...estadosDemo(), [codigo]: estado }));
  } catch {
    /* almacenamiento bloqueado */
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** Borrador del asistente de carga (con sus fotos): si se corta o entra una llamada, no se pierde. */
const BORRADOR = "__borrador__";
export async function leerBorrador<T>(): Promise<T | null> {
  try {
    const r = await tx<{ datos: T } | undefined>("readonly", (s) => s.get(BORRADOR));
    return r?.datos ?? null;
  } catch {
    return null;
  }
}
export async function guardarBorrador(datos: unknown) {
  try {
    await tx("readwrite", (s) => s.put({ codigo: BORRADOR, datos }));
  } catch {
    /* sin espacio: el borrador no se guarda */
  }
}
export async function borrarBorrador() {
  try {
    await tx("readwrite", (s) => s.delete(BORRADOR));
  } catch {
    /* nada */
  }
}

export const nuevoCodigo = () => Math.random().toString(36).slice(2, 7);
