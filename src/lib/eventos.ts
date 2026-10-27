"use client";

/**
 * Registro de vistas, clics en WhatsApp y compartidos.
 * Se envía con sendBeacon para no perder el evento cuando el navegador salta a WhatsApp.
 * En la demo además se suma en este teléfono, para que el panel muestre los números en vivo.
 */
export type TipoEvento = "vista" | "whatsapp" | "compartir" | "vista_catalogo";

const KEY = "cv:eventos";

export function registrarEvento(id: string, tipo: TipoEvento) {
  // Una vista por auto por día y por teléfono (el servidor además deduplica con una huella anónima).
  if (tipo === "vista" || tipo === "vista_catalogo") {
    const marca = `cv:visto:${tipo}:${id}:${new Date().toISOString().slice(0, 10)}`;
    try {
      if (sessionStorage.getItem(marca) || localStorage.getItem(marca)) return;
      localStorage.setItem(marca, "1");
    } catch {
      /* sin almacenamiento: se envía igual */
    }
  }
  try {
    navigator.sendBeacon?.("/api/evento", JSON.stringify({ id, tipo }));
  } catch {
    /* sin conexión: el evento se pierde */
  }
  try {
    const todos = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    const actual = todos[id] ?? { vista: 0, whatsapp: 0, compartir: 0, vista_catalogo: 0 };
    actual[tipo] = (actual[tipo] ?? 0) + 1;
    todos[id] = actual;
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch {
    /* almacenamiento bloqueado */
  }
}

export function eventosLocales(): Record<string, Record<TipoEvento, number>> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
