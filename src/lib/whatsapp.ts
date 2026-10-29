import { portal } from "@/config/portal";
import { formatKm, formatPrecio, tituloCompleto } from "./format";
import type { Agencia, Taller, Vehiculo } from "./types";

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

/** A quién se le escribe por un auto: la concesionaria o el particular. */
export function contactoVendedor(v: Vehiculo, agencia?: Pick<Agencia, "nombre" | "whatsapp"> | null) {
  if (v.vendedor === "particular") return { nombre: v.particular?.nombre ?? "", whatsapp: v.particular?.whatsapp ?? "" };
  return { nombre: agencia?.nombre ?? "", whatsapp: agencia?.whatsapp ?? "" };
}

export function mensajeConsulta(v: Vehiculo, agencia: Pick<Agencia, "nombre" | "whatsapp"> | null | undefined, link: string) {
  const { nombre } = contactoVendedor(v, agencia);
  const datos = [formatKm(v.km), v.precio !== null ? formatPrecio(v.precio, v.moneda) : null]
    .filter(Boolean)
    .join(", ");
  return `Hola${nombre ? ` ${nombre}` : ""}, vi en ${portal.name} el ${tituloCompleto(v)} (${datos}) y quería consultar si sigue disponible.\n${link}`;
}

/** Para que la agencia comparta su propio aviso. */
export function mensajeCompartirAuto(v: Vehiculo, link: string) {
  const datos = [formatKm(v.km), v.precio !== null ? formatPrecio(v.precio, v.moneda) : null].filter(Boolean).join(", ");
  return `Mirá este ${tituloCompleto(v)} (${datos}):\n${link}`;
}

export function mensajeCatalogo(agencia: Agencia, link: string) {
  return `Hola ${agencia.nombre}, vi su catálogo en ${portal.name} y quería hacer una consulta.\n${link}`;
}

export function mensajeTaller(taller: Pick<Taller, "nombre">, v?: Vehiculo) {
  return v
    ? `Hola ${taller.nombre}, vi en ${portal.name} un ${tituloCompleto(v)} y quería consultar por una revisión antes de comprarlo.`
    : `Hola ${taller.nombre}, los encontré en ${portal.name} y quería hacer una consulta.`;
}
