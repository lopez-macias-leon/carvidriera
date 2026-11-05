"use client";

/**
 * Moderación en la demo: cuentas aprobadas o bloqueadas, denuncias y decisiones del administrador.
 * Todo queda en este teléfono. En producción son tablas en Supabase y solo el administrador puede
 * aprobar, rechazar o bloquear (seguridad por fila).
 */
import { useEffect, useState } from "react";
import { DENUNCIAS_PARA_PAUSAR } from "./moderacion";
import { alCambiar, avisarCambio, guardarLocal, listarLocales, obtenerLocal } from "./demo-store";
import type { Vehiculo } from "./types";

const KEY_APROBADAS = "cv:cuentas-aprobadas";
const KEY_BLOQUEADAS = "cv:cuentas-bloqueadas";
const KEY_DENUNCIAS = "cv:denuncias";

function leer<T>(key: string, vacio: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? vacio;
  } catch {
    return vacio;
  }
}
function escribir(key: string, valor: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(valor));
  } catch {
    /* almacenamiento bloqueado */
  }
  avisarCambio();
}

/* ---------- Cuentas ---------- */

/** Una cuenta aprobada ya publicó un aviso que el administrador aceptó: los siguientes salen al instante. */
export const cuentaAprobada = (id: string) => leer<string[]>(KEY_APROBADAS, []).includes(id);
export const cuentaBloqueada = (id: string) => leer<string[]>(KEY_BLOQUEADAS, []).includes(id);

function agregar(key: string, id: string) {
  const lista = leer<string[]>(key, []);
  if (!lista.includes(id)) escribir(key, [...lista, id]);
}

/* ---------- Decisiones del administrador ---------- */

export async function aprobarAviso(v: Vehiculo) {
  await guardarLocal({ ...v, estado: "publicado", motivosRevision: undefined, motivoRechazo: undefined });
  if (v.vendedor === "particular" && v.particular) agregar(KEY_APROBADAS, v.particular.id);
}

export const rechazarAviso = (v: Vehiculo, motivo: string) => guardarLocal({ ...v, estado: "rechazado", motivoRechazo: motivo });

/** Bloquea la cuenta (en producción también su email y su teléfono) y saca todos sus avisos. */
export async function bloquearCuenta(particularId: string) {
  agregar(KEY_BLOQUEADAS, particularId);
  const suyos = (await listarLocales()).filter((v) => v.particular?.id === particularId);
  await Promise.all(suyos.map((v) => guardarLocal({ ...v, estado: "rechazado", motivoRechazo: "Cuenta bloqueada por no respetar las reglas" })));
}

/* ---------- Denuncias ---------- */

export type Denuncia = { id: string; codigo: string; titulo: string; motivo: string; detalle: string; fecha: string; resuelta: boolean };

export const listarDenuncias = () => leer<Denuncia[]>(KEY_DENUNCIAS, []);

/**
 * Guarda la denuncia. Si un aviso cargado en este teléfono junta DENUNCIAS_PARA_PAUSAR,
 * sale del portal y vuelve a revisión (en producción lo hace la base de datos con cualquier aviso).
 */
export async function registrarDenuncia(d: Omit<Denuncia, "id" | "fecha" | "resuelta">) {
  const todas = [...listarDenuncias(), { ...d, id: Math.random().toString(36).slice(2, 9), fecha: new Date().toISOString(), resuelta: false }];
  escribir(KEY_DENUNCIAS, todas);
  const abiertas = todas.filter((x) => x.codigo === d.codigo && !x.resuelta).length;
  if (abiertas >= DENUNCIAS_PARA_PAUSAR) {
    const v = await obtenerLocal(d.codigo);
    if (v && (v.estado === "publicado" || v.estado === "reservado")) {
      await guardarLocal({ ...v, estado: "revision", motivosRevision: [`Recibió ${abiertas} denuncias`] });
    }
  }
}

export const resolverDenuncias = (codigo: string) => escribir(KEY_DENUNCIAS, listarDenuncias().map((x) => (x.codigo === codigo ? { ...x, resuelta: true } : x)));

/* ---------- Para las pantallas ---------- */

/** Cola del administrador: avisos en revisión y denuncias abiertas, actualizados en vivo. */
export function useModeracion() {
  const [estado, setEstado] = useState<{ revision: Vehiculo[]; locales: Vehiculo[]; denuncias: Denuncia[] } | null>(null);
  useEffect(() => {
    const cargar = () =>
      listarLocales().then((locales) =>
        setEstado({ locales, revision: locales.filter((v) => v.estado === "revision"), denuncias: listarDenuncias().filter((d) => !d.resuelta) }),
      );
    cargar();
    return alCambiar(cargar);
  }, []);
  return estado;
}

/** Estado de la cuenta del particular, actualizado en vivo. */
export function useCuenta(id: string) {
  const [cuenta, setCuenta] = useState<{ aprobada: boolean; bloqueada: boolean } | null>(null);
  useEffect(() => {
    const cargar = () => setCuenta({ aprobada: cuentaAprobada(id), bloqueada: cuentaBloqueada(id) });
    cargar();
    return alCambiar(cargar);
  }, [id]);
  return cuenta;
}
