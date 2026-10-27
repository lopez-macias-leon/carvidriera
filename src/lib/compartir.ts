"use client";

/** Compartir con el menú nativo del teléfono; si no existe, copia el link. Devuelve "copiado" para avisar. */
export async function compartir(datos: { title: string; text: string; url: string }): Promise<"compartido" | "copiado" | "cancelado"> {
  if (navigator.share) {
    try {
      await navigator.share(datos);
      return "compartido";
    } catch {
      return "cancelado";
    }
  }
  try {
    await navigator.clipboard.writeText(datos.url);
  } catch {
    window.prompt("Copiá el link:", datos.url);
  }
  return "copiado";
}
