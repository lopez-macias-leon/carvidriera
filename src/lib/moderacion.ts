/**
 * Reglas para frenar publicaciones troll: texto, precio y cuándo un aviso pasa por revisión.
 * Son funciones puras: se usan en el formulario (para avisar antes) y, en producción,
 * también en el servidor al guardar, porque lo del navegador se puede saltear.
 */
import { normalizar } from "./filtros";
import type { Moneda } from "./types";

/** Denuncias que pausan un aviso hasta que el administrador lo revise. */
export const DENUNCIAS_PARA_PAUSAR = 3;

/** Palabras que mandan el aviso a revisión. Se comparan como palabras enteras, sin acentos. */
const PROHIBIDAS = ["puto", "puta", "putos", "pija", "verga", "concha", "orto", "culo", "mierda", "forro", "pelotudo", "boludo", "trolo", "sexo", "porno", "xxx", "nazi", "droga", "falopa"];

/** Formas de sacar al comprador del portal: el contacto va por el botón de WhatsApp. */
const PIDE_CONTACTO = ["whatsapp", "wsp", "whatsap", "llamame", "llamar al", "escribime", "mi cel", "mi celular", "mi numero", "telefono", "instagram", "facebook"];

export type MotivoTexto = "palabras" | "telefono" | "link" | "contacto";

export const textoMotivo: Record<MotivoTexto, string> = {
  palabras: "Lenguaje inapropiado en el texto",
  telefono: "Teléfono en la descripción",
  link: "Link o email en la descripción",
  contacto: "Pide contacto por fuera del portal",
};

/** Revisa título y descripción. Devuelve los problemas encontrados (vacío si está bien). */
export function revisarTexto(texto: string): MotivoTexto[] {
  const motivos = new Set<MotivoTexto>();
  const limpio = normalizar(texto);
  const palabras = new Set(limpio.split(/[^a-z0-9]+/).filter(Boolean));
  if (PROHIBIDAS.some((p) => palabras.has(p))) motivos.add("palabras");

  // Los números con puntos de miles (precios, km) no cuentan: "21.500.000" no es un teléfono.
  const sinMiles = limpio.replace(/\b\d{1,3}(\.\d{3})+\b/g, " ");
  if (/(\+?\d[\s\-()]*){8,}/.test(sinMiles)) motivos.add("telefono");

  if (/(https?:\/\/|www\.|\b[\w-]+\.(com|ar|net|org)\b|[\w.+-]+@[\w-]+\.\w+)/.test(limpio)) motivos.add("link");
  if (PIDE_CONTACTO.some((p) => limpio.includes(p))) motivos.add("contacto");
  return [...motivos];
}

/** Rangos razonables: fuera de ellos el aviso no se rechaza, pero pasa por revisión. */
const RANGO_PRECIO: Record<Moneda, [number, number]> = {
  ARS: [1_000_000, 1_500_000_000],
  USD: [1_000, 300_000],
};

export function revisarNumeros({ precio, moneda, km }: { precio: number | null; moneda: Moneda; km: number }): string[] {
  const motivos: string[] = [];
  const [min, max] = RANGO_PRECIO[moneda];
  if (precio !== null && (precio < min || precio > max)) motivos.push("Precio fuera de lo normal");
  if (km > 600_000) motivos.push("Kilometraje fuera de lo normal");
  return motivos;
}
