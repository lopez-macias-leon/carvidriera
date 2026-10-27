"use client";

import { useSyncExternalStore } from "react";

/** Valores que solo existen en el navegador, sin desajustes al hidratar. */
const sinSuscripcion = () => () => {};

export const useHidratado = () => useSyncExternalStore(sinSuscripcion, () => true, () => false);

export const useOrigen = () => useSyncExternalStore(sinSuscripcion, () => window.location.origin, () => "");

let ahora: Date | null = null;
/** Fecha y hora al abrir la página (null durante el render del servidor). */
export const useAhora = () => useSyncExternalStore(sinSuscripcion, () => (ahora ??= new Date()), () => null);
