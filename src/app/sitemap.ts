import type { MetadataRoute } from "next";
import { portal } from "@/config/portal";
import { tipos } from "@/data/catalogos";
import { getAgencias, getVehiculosVisibles } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = portal.siteUrl.includes("[") ? "" : portal.siteUrl;
  const [vehiculos, agencias] = await Promise.all([getVehiculosVisibles(), getAgencias()]);
  const estaticas = ["", "/autos", "/agencias", "/para-agencias", "/consejos-de-compra", "/preguntas-frecuentes", "/contacto"];
  return [
    ...estaticas.map((r) => ({ url: `${base}${r}` })),
    ...tipos.map((t) => ({ url: `${base}/autos?tipo=${t.value}` })),
    { url: `${base}/autos?condicion=0km` },
    ...agencias.map((a) => ({ url: `${base}/agencia/${a.slug}` })),
    ...vehiculos.map((v) => ({ url: `${base}/auto/${v.slug}`, lastModified: v.publicado })),
  ];
}
