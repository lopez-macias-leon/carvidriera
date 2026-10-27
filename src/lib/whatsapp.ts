import { portal } from "@/config/portal";
import { formatKm, formatPrecio, tituloCompleto } from "./format";
import type { Agencia, Vehiculo } from "./types";

/** Link absoluto al aviso. En la demo, sin dominio todavía, se usa el origen actual del navegador. */
export function urlAviso(slug: string, origin?: string) {
  const base = portal.siteUrl.includes("[") ? (origin ?? "") : portal.siteUrl;
  return `${base}/auto/${slug}`;
}

export function urlCatalogo(slug: string, origin?: string) {
  const base = portal.siteUrl.includes("[") ? (origin ?? "") : portal.siteUrl;
  return `${base}/agencia/${slug}`;
}

/** Link de WhatsApp. Sin número (demo), WhatsApp deja elegir a quién mandarlo. */
export function linkWhatsApp(numero: string, texto: string) {
  const destino = numero.replace(/\D/g, "");
  return `https://wa.me/${destino}?text=${encodeURIComponent(texto)}`;
}

export function mensajeConsulta(v: Vehiculo, agencia: Agencia, link: string) {
  const datos = [formatKm(v.km), v.precio !== null ? formatPrecio(v.precio, v.moneda) : null]
    .filter(Boolean)
    .join(", ");
  return `Hola ${agencia.nombre}, vi en ${portal.name} el ${tituloCompleto(v)} (${datos}) y quería consultar si sigue disponible.\n${link}`;
}

/** Para que la agencia comparta su propio aviso. */
export function mensajeCompartirAuto(v: Vehiculo, link: string) {
  const datos = [formatKm(v.km), v.precio !== null ? formatPrecio(v.precio, v.moneda) : null].filter(Boolean).join(", ");
  return `Mirá este ${tituloCompleto(v)} (${datos}):\n${link}`;
}

export function mensajeCatalogo(agencia: Agencia, link: string) {
  return `Hola ${agencia.nombre}, vi su catálogo en ${portal.name} y quería hacer una consulta.\n${link}`;
}
