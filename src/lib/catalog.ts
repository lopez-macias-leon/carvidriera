/**
 * Acceso a los datos del portal. Hoy lee los datos de demostración;
 * con Supabase, estas mismas funciones consultan la vista `vehiculos_publicos`.
 */
import { agenciasDemo, vehiculosDemo } from "@/data/demo";
import { aplicarFiltros, contar, esVisible, ordenar, POR_PAGINA, type Filtros } from "./filtros";
import type { Agencia, Vehiculo } from "./types";

export async function getVehiculosVisibles() {
  return vehiculosDemo.filter(esVisible);
}

export async function buscarVehiculos(f: Filtros) {
  const visibles = await getVehiculosVisibles();
  const resultados = ordenar(aplicarFiltros(visibles, f), f.orden);
  return {
    total: resultados.length,
    items: resultados.slice(0, f.pagina * POR_PAGINA),
    hayMas: resultados.length > f.pagina * POR_PAGINA,
    conteos: {
      tipo: contar(visibles, f, "tipo", "tipo"),
      condicion: contar(visibles, f, "condicion", "condicion"),
      marca: contar(visibles, f, "marca", "marca"),
      modelo: contar(visibles, f, "modelo", "modelo"),
      combustible: contar(visibles, f, "combustible", "combustible"),
      caja: contar(visibles, f, "caja", "caja"),
      localidad: contar(visibles, f, "localidad", "localidad"),
      agencia: contar(visibles, f, "agencia", "agencia"),
    },
  };
}

/** Por slug; también devuelve vendidos/pausados para mostrar "no disponible". */
export async function getVehiculo(slug: string) {
  return vehiculosDemo.find((v) => v.slug === slug) ?? null;
}

export async function getTodosLosVehiculos() {
  return vehiculosDemo;
}

export async function getRecientes(n: number) {
  return ordenar(await getVehiculosVisibles(), "recientes").slice(0, n);
}

export async function getDestacados() {
  return (await getVehiculosVisibles()).filter((v) => v.destacado && v.estado === "publicado");
}

export async function getSimilares(v: Vehiculo, n = 4) {
  const otros = (await getVehiculosVisibles()).filter((x) => x.codigo !== v.codigo);
  const puntaje = (x: Vehiculo) =>
    (x.modelo === v.modelo ? 4 : 0) + (x.marca === v.marca ? 2 : 0) + (x.tipo === v.tipo ? 3 : 0) + (x.condicion === v.condicion ? 1 : 0);
  return otros
    .map((x) => ({ x, p: puntaje(x) }))
    .filter(({ p }) => p >= 3)
    .sort((a, b) => b.p - a.p)
    .slice(0, n)
    .map(({ x }) => x);
}

export async function getAgencias(): Promise<Agencia[]> {
  return agenciasDemo;
}

export async function getAgencia(slug: string) {
  return agenciasDemo.find((a) => a.slug === slug) ?? null;
}

export async function getStockAgencia(slug: string) {
  return ordenar((await getVehiculosVisibles()).filter((v) => v.agencia === slug), "recientes");
}

export async function contarPorAgencia() {
  const conteo: Record<string, number> = {};
  for (const v of await getVehiculosVisibles()) conteo[v.agencia] = (conteo[v.agencia] ?? 0) + 1;
  return conteo;
}

export async function contarPorTipo() {
  const visibles = await getVehiculosVisibles();
  return {
    auto: visibles.filter((v) => v.tipo === "auto").length,
    camioneta: visibles.filter((v) => v.tipo === "camioneta").length,
    suv: visibles.filter((v) => v.tipo === "suv").length,
    "0km": visibles.filter((v) => v.condicion === "0km").length,
  };
}

