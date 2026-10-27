"use client";

import { useEffect, useState } from "react";
import { agenciasDemo, estadisticasDemo, vehiculosDemo } from "@/data/demo";
import { alCambiar, estadosDemo, listarLocales } from "./demo-store";
import { eventosLocales } from "./eventos";
import type { Vehiculo } from "./types";

/** Demo: el panel entra como esta agencia, sin login. */
export const AGENCIA_DEMO = agenciasDemo[0];
/** Fecha de renovación de ejemplo. */
export const VENCE_DEMO = "2026-11-25";

export type Stats = { vistas: number; whatsapp: number; compartidos: number };

export function statsDe(v: Vehiculo): Stats {
  const base = estadisticasDemo[v.codigo] ?? { vistas: 0, whatsapp: 0, compartidos: 0 };
  const local = eventosLocales()[v.codigo];
  return {
    vistas: base.vistas + (local?.vista ?? 0),
    whatsapp: base.whatsapp + (local?.whatsapp ?? 0),
    compartidos: base.compartidos + (local?.compartir ?? 0),
  };
}

/** Autos de la agencia: los de ejemplo (con cambios de estado hechos acá) + los cargados en este teléfono. */
export function useAutosAgencia() {
  const [autos, setAutos] = useState<Vehiculo[] | null>(null);
  useEffect(() => {
    const cargar = async () => {
      const estados = estadosDemo();
      const locales = (await listarLocales()).filter((v) => v.agencia === AGENCIA_DEMO.slug);
      const ejemplo = vehiculosDemo.filter((v) => v.agencia === AGENCIA_DEMO.slug).map((v) => ({ ...v, estado: estados[v.codigo] ?? v.estado }));
      setAutos([...locales, ...ejemplo]);
    };
    cargar();
    return alCambiar(cargar);
  }, []);
  return autos;
}

/**
 * Serie diaria de ejemplo de los últimos 30 días que suma el total del mes (solo demo:
 * en producción sale de `estadisticas_diarias`). Más movimiento los fines de semana.
 */
export function serieDemo(total: number, dias = 30, hoy = new Date()) {
  const pesos = Array.from({ length: dias }, (_, i) => {
    const d = new Date(hoy.getTime() - (dias - 1 - i) * 86400000);
    const finde = d.getDay() === 0 || d.getDay() === 6 ? 1.5 : 1;
    return finde * (0.75 + 0.5 * Math.abs(Math.sin(i * 1.7)));
  });
  const suma = pesos.reduce((a, b) => a + b, 0);
  let acumulado = 0;
  return pesos.map((p, i) => {
    const d = new Date(hoy.getTime() - (dias - 1 - i) * 86400000);
    const valor = i === dias - 1 ? total - acumulado : Math.round((p / suma) * total);
    acumulado += valor;
    return { fecha: d, valor: Math.max(0, valor) };
  });
}
