/** Filtros y orden del listado. Sin datos: se usa también desde componentes del navegador. */
import type { Caja, Combustible, Condicion, Moneda, Tipo, Vehiculo } from "./types";

export const POR_PAGINA = 24;

/** Visible en el portal: publicado o reservado (y, en producción, agencia al día y sin bloqueo). */
export const esVisible = (v: Vehiculo) => v.estado === "publicado" || v.estado === "reservado";

export type Orden = "recientes" | "precio_asc" | "precio_desc" | "km" | "anio";

export type Filtros = {
  q?: string;
  tipo?: Tipo;
  condicion?: Condicion;
  marca?: string;
  modelo?: string;
  moneda?: Moneda;
  precioMin?: number;
  precioMax?: number;
  anioMin?: number;
  anioMax?: number;
  kmMax?: number;
  combustible?: Combustible[];
  caja?: Caja;
  localidad?: string[];
  agencia?: string;
  permuta?: boolean;
  financiacion?: boolean;
  orden: Orden;
  pagina: number;
};

type Params = Record<string, string | string[] | undefined>;

const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const varios = (v: string | string[] | undefined) => {
  const list = (Array.isArray(v) ? v : v ? v.split(",") : []).filter(Boolean);
  return list.length ? list : undefined;
};
const num = (v: string | string[] | undefined) => {
  const n = Number(uno(v));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export function leerFiltros(p: Params): Filtros {
  const orden = uno(p.orden) as Orden | undefined;
  return {
    q: uno(p.q)?.trim(),
    tipo: uno(p.tipo) as Tipo | undefined,
    condicion: uno(p.condicion) as Condicion | undefined,
    marca: uno(p.marca),
    modelo: uno(p.modelo),
    moneda: uno(p.moneda) as Moneda | undefined,
    precioMin: num(p.precio_min),
    precioMax: num(p.precio_max),
    anioMin: num(p.anio_min),
    anioMax: num(p.anio_max),
    kmMax: num(p.km_max),
    combustible: varios(p.combustible) as Combustible[] | undefined,
    caja: uno(p.caja) as Caja | undefined,
    localidad: varios(p.localidad),
    agencia: uno(p.agencia),
    permuta: uno(p.permuta) === "1" || undefined,
    financiacion: uno(p.financiacion) === "1" || undefined,
    orden: orden && ["recientes", "precio_asc", "precio_desc", "km", "anio"].includes(orden) ? orden : "recientes",
    pagina: Math.max(1, Math.floor(num(p.pagina) ?? 1)),
  };
}

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function coincideTexto(v: Vehiculo, q: string) {
  const texto = normalizar(`${v.marca} ${v.modelo} ${v.version} ${v.anio}`);
  return normalizar(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((palabra) => texto.includes(palabra));
}

/** Aplica todos los filtros salvo los indicados (para contar opciones de cada filtro). */
export function aplicarFiltros(lista: Vehiculo[], f: Filtros, salvo?: keyof Filtros) {
  return lista.filter((v) => {
    if (f.q && salvo !== "q" && !coincideTexto(v, f.q)) return false;
    if (f.tipo && salvo !== "tipo" && v.tipo !== f.tipo) return false;
    if (f.condicion && salvo !== "condicion" && v.condicion !== f.condicion) return false;
    if (f.marca && salvo !== "marca" && v.marca !== f.marca) return false;
    if (f.modelo && salvo !== "modelo" && salvo !== "marca" && v.modelo !== f.modelo) return false;
    if (salvo !== "moneda" && f.moneda && (f.precioMin || f.precioMax)) {
      // Con filtro de precio solo entran los autos con precio en esa moneda (no se convierte).
      if (v.precio === null || v.moneda !== f.moneda) return false;
      if (f.precioMin && v.precio < f.precioMin) return false;
      if (f.precioMax && v.precio > f.precioMax) return false;
    } else if (f.moneda && salvo !== "moneda" && v.moneda !== f.moneda) return false;
    if (f.anioMin && v.anio < f.anioMin) return false;
    if (f.anioMax && v.anio > f.anioMax) return false;
    if (f.kmMax && v.km > f.kmMax) return false;
    if (f.combustible && salvo !== "combustible" && !f.combustible.includes(v.combustible)) return false;
    if (f.caja && salvo !== "caja" && v.caja !== f.caja) return false;
    if (f.localidad && salvo !== "localidad" && !f.localidad.includes(v.localidad)) return false;
    if (f.agencia && salvo !== "agencia" && v.agencia !== f.agencia) return false;
    if (f.permuta && !v.permuta) return false;
    if (f.financiacion && !v.financiacion) return false;
    return true;
  });
}

export function ordenar(lista: Vehiculo[], orden: Orden) {
  const conPrecio = (v: Vehiculo) => v.precio !== null;
  const copia = [...lista];
  switch (orden) {
    case "precio_asc":
    case "precio_desc": {
      const dir = orden === "precio_asc" ? 1 : -1;
      // Sin precio ("Consultar") al final. Distintas monedas no se mezclan: primero pesos, después dólares.
      return copia.sort((a, b) => {
        if (conPrecio(a) !== conPrecio(b)) return conPrecio(a) ? -1 : 1;
        if (a.moneda !== b.moneda) return a.moneda === "ARS" ? -1 : 1;
        return ((a.precio ?? 0) - (b.precio ?? 0)) * dir;
      });
    }
    case "km":
      return copia.sort((a, b) => a.km - b.km);
    case "anio":
      return copia.sort((a, b) => b.anio - a.anio || b.publicado.localeCompare(a.publicado));
    default:
      // Reservados al final dentro del mismo orden.
      return copia.sort(
        (a, b) => Number(a.estado === "reservado") - Number(b.estado === "reservado") || b.publicado.localeCompare(a.publicado),
      );
  }
}

/** Cuenta cuántos autos hay por valor de un campo, respetando el resto de los filtros. */
export function contar<K extends keyof Vehiculo>(lista: Vehiculo[], f: Filtros, campo: K, salvo: keyof Filtros) {
  const conteo = new Map<string, number>();
  for (const v of aplicarFiltros(lista, f, salvo)) {
    const key = String(v[campo]);
    conteo.set(key, (conteo.get(key) ?? 0) + 1);
  }
  return Object.fromEntries(conteo);
}

/** Querystring a partir de filtros, para links y paginación. */
export function filtrosAQuery(f: Partial<Filtros>) {
  const p = new URLSearchParams();
  const set = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === "" || v === false) return;
    p.set(k, Array.isArray(v) ? v.join(",") : v === true ? "1" : String(v));
  };
  set("q", f.q);
  set("tipo", f.tipo);
  set("condicion", f.condicion);
  set("marca", f.marca);
  set("modelo", f.modelo);
  set("moneda", f.moneda);
  set("precio_min", f.precioMin);
  set("precio_max", f.precioMax);
  set("anio_min", f.anioMin);
  set("anio_max", f.anioMax);
  set("km_max", f.kmMax);
  set("combustible", f.combustible);
  set("caja", f.caja);
  set("localidad", f.localidad);
  set("agencia", f.agencia);
  set("permuta", f.permuta);
  set("financiacion", f.financiacion);
  if (f.orden && f.orden !== "recientes") set("orden", f.orden);
  if (f.pagina && f.pagina > 1) set("pagina", f.pagina);
  return p.toString();
}

/** Cantidad de filtros activos (sin contar orden ni búsqueda). */
export function cantidadFiltrosActivos(f: Filtros) {
  return [
    f.tipo,
    f.condicion,
    f.marca,
    f.modelo,
    f.precioMin || f.precioMax,
    f.anioMin || f.anioMax,
    f.kmMax,
    f.combustible?.length,
    f.caja,
    f.localidad?.length,
    f.agencia,
    f.permuta,
    f.financiacion,
  ].filter(Boolean).length;
}

