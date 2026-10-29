"use client";

import { useEffect, useState } from "react";
import { DIAS_AVISO_PARTICULAR, TOPE_PARTICULAR, type CodigoMejora } from "@/config/planes";
import { alCambiar, guardarLocal, listarLocales } from "./demo-store";
import type { Particular, Vehiculo } from "./types";

/** Demo: "Mi cuenta" entra como este particular, sin login. */
export const PARTICULAR_DEMO: Particular = { id: "p-demo", nombre: "Particular de prueba", whatsapp: "", localidad: "capital" };

const DIA = 86400000;
const enDias = (dias: number, desde = Date.now()) => new Date(desde + dias * DIA).toISOString();

export const cuentaParaTope = (v: Vehiculo) => v.estado === "publicado" || v.estado === "reservado";

/** Avisos del particular cargados en este teléfono. */
export function useAvisosParticular() {
  const [avisos, setAvisos] = useState<Vehiculo[] | null>(null);
  useEffect(() => {
    const cargar = () => listarLocales().then((l) => setAvisos(l.filter((v) => v.vendedor === "particular" && v.particular?.id === PARTICULAR_DEMO.id)));
    cargar();
    return alCambiar(cargar);
  }, []);
  return avisos;
}

export const topeAlcanzado = (avisos: Vehiculo[]) => avisos.filter(cuentaParaTope).length >= TOPE_PARTICULAR;

export const vencido = (v: Vehiculo) => !!v.vence && new Date(v.vence).getTime() < Date.now();

export function diasRestantes(v: Vehiculo) {
  return v.vence ? Math.max(0, Math.ceil((new Date(v.vence).getTime() - Date.now()) / DIA)) : null;
}

/** Renovar: el aviso vuelve a durar 60 días desde hoy. */
export const renovar = (v: Vehiculo) => guardarLocal({ ...v, vence: enDias(DIAS_AVISO_PARTICULAR) });

/**
 * Activa una mejora. En producción lo hace el servidor cuando Mercado Pago confirma el pago;
 * acá se llama después del pago simulado.
 */
export function aplicarMejora(v: Vehiculo, mejora: CodigoMejora) {
  switch (mejora) {
    case "destacado":
      return guardarLocal({ ...v, destacado: true, destacadoHasta: enDias(7) });
    case "subir":
      return guardarLocal({ ...v, publicado: new Date().toISOString() });
    case "completo": {
      const vence = Math.max(v.vence ? new Date(v.vence).getTime() : 0, Date.now() + 90 * DIA);
      return guardarLocal({ ...v, completo: true, vence: new Date(vence).toISOString() });
    }
  }
}
