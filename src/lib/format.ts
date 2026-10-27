import { cajas, combustibles, localidades, tipos } from "@/data/catalogos";
import type { Caja, Combustible, Horario, Moneda, Tipo, Vehiculo } from "./types";

const numero = new Intl.NumberFormat("es-AR");

export function formatPrecio(precio: number | null, moneda: Moneda) {
  if (precio === null) return "Consultar precio";
  return `${moneda === "USD" ? "US$" : "$"} ${numero.format(precio)}`;
}

export const formatKm = (km: number) => (km === 0 ? "0 km" : `${numero.format(km)} km`);
export const formatNumero = (n: number) => numero.format(n);

export const labelTipo = (t: Tipo) => tipos.find((x) => x.value === t)?.label ?? t;
export const labelCombustible = (c: Combustible) => combustibles.find((x) => x.value === c)?.label ?? c;
export const labelCaja = (c: Caja) => cajas.find((x) => x.value === c)?.label ?? c;
export const nombreLocalidad = (slug: string) => localidades.find((l) => l.slug === slug)?.nombre ?? slug;
/** Nombre corto para tarjetas. */
export const localidadCorta = (slug: string) => (slug === "capital" ? "Catamarca Capital" : nombreLocalidad(slug));

export const tituloVehiculo = (v: Pick<Vehiculo, "marca" | "modelo">) => `${v.marca} ${v.modelo}`;
export const tituloCompleto = (v: Pick<Vehiculo, "marca" | "modelo" | "version" | "anio">) =>
  [v.marca, v.modelo, v.version, v.anio].filter(Boolean).join(" ");

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/** "Lunes a viernes 09:00–13:00 y 17:00–21:00 · Sábado 09:00–13:00" agrupado por día. */
export function horariosPorDia(h: Horario) {
  return [1, 2, 3, 4, 5, 6, 0].map((d) => ({
    dia: DIAS[d],
    franjas: h.filter((f) => f.dias.includes(d)).map((f) => `${f.desde} a ${f.hasta}`),
  }));
}

/** Hora actual en Argentina (UTC-3, sin horario de verano). */
function ahoraArgentina(now = new Date()) {
  const ar = new Date(now.getTime() - 3 * 3600_000);
  return { dia: ar.getUTCDay(), minutos: ar.getUTCHours() * 60 + ar.getUTCMinutes() };
}

const aMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function estaAbierto(h: Horario, now?: Date) {
  const { dia, minutos } = ahoraArgentina(now);
  return h.some((f) => f.dias.includes(dia) && minutos >= aMinutos(f.desde) && minutos < aMinutos(f.hasta));
}

export function horarioDeHoy(h: Horario, now?: Date) {
  const { dia } = ahoraArgentina(now);
  const franjas = h.filter((f) => f.dias.includes(dia)).map((f) => `${f.desde} a ${f.hasta}`);
  return franjas.length ? franjas.join(" y ") : "Cerrado";
}
