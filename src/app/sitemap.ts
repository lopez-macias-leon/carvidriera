import type { MetadataRoute } from "next";
import { portal } from "@/config/portal";
import { tipos } from "@/data/catalogos";
import { getAgencias, getTalleres, getVehiculosVisibles } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = portal.siteUrl.includes("[") ? "" : portal.siteUrl;
  const [vehiculos, agencias, talleres] = await Promise.all([getVehiculosVisibles(), getAgencias(), getTalleres()]);
  const estaticas = ["", "/autos", "/concesionarias", "/para-concesionarias", "/mecanicos", "/para-talleres", "/publicar", "/consejos-de-compra", "/preguntas-frecuentes", "/contacto"];
  return [
    ...estaticas.map((r) => ({ url: `${base}${r}` })),
    ...tipos.map((t) => ({ url: `${base}/autos?tipo=${t.value}` })),
    { url: `${base}/autos?condicion=0km` },
    ...agencias.map((a) => ({ url: `${base}/agencia/${a.slug}` })),
    ...talleres.map((t) => ({ url: `${base}/mecanico/${t.slug}` })),
    ...vehiculos.map((v) => ({ url: `${base}/auto/${v.slug}`, lastModified: v.publicado })),
  ];
}
