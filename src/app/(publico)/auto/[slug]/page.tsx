import type { Metadata } from "next";
import { Ficha } from "@/components/ficha";
import { FichaLocal } from "@/components/ficha-local";
import { portal } from "@/config/portal";
import { getAgencia, getAgencias, getSimilares, getStockAgencia, getTodosLosVehiculos, getVehiculo, getVehiculosVisibles } from "@/lib/catalog";
import { formatKm, formatPrecio, nombreLocalidad, tituloCompleto } from "@/lib/format";

export async function generateStaticParams() {
  return (await getTodosLosVehiculos()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/auto/[slug]">): Promise<Metadata> {
  const v = await getVehiculo((await params).slug);
  if (!v) return { title: "Aviso", robots: { index: false } };
  const titulo = `${tituloCompleto(v)} ${v.condicion === "0km" ? "0 km" : "usado"} en Catamarca`;
  const precio = v.precio !== null ? ` · ${formatPrecio(v.precio, v.moneda)}` : "";
  return {
    title: `${titulo}${precio}`,
    description: `${tituloCompleto(v)}, ${formatKm(v.km)}${precio} en ${nombreLocalidad(v.localidad)}. Mirá fotos y datos, y consultá directo por WhatsApp a la agencia.`,
    alternates: { canonical: `/auto/${v.slug}` },
    openGraph: { title: `${tituloCompleto(v)}${precio}`, type: "website" },
    robots: v.estado === "publicado" || v.estado === "reservado" ? undefined : { index: false },
  };
}

export default async function AutoPage({ params, searchParams }: PageProps<"/auto/[slug]">) {
  const { slug } = await params;
  const { desde } = await searchParams;
  const v = await getVehiculo(slug);

  if (!v) {
    // Demo: puede ser un auto cargado desde el panel en este teléfono. En producción, notFound().
    const [agencias, similares] = await Promise.all([getAgencias(), getVehiculosVisibles()]);
    return <FichaLocal slug={slug} agencias={agencias} similares={similares} />;
  }

  const agencia = (await getAgencia(v.agencia))!;
  const [similares, stock] = await Promise.all([getSimilares(v), getStockAgencia(v.agencia)]);
  const masDeLaAgencia = stock.filter((x) => x.codigo !== v.codigo).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: tituloCompleto(v),
    brand: { "@type": "Brand", name: v.marca },
    model: v.modelo,
    vehicleModelDate: String(v.anio),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.km, unitCode: "KMT" },
    fuelType: v.combustible,
    vehicleTransmission: v.caja === "manual" ? "Manual" : "Automática",
    color: v.color,
    itemCondition: v.condicion === "0km" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    ...(v.precio !== null && {
      offers: {
        "@type": "Offer",
        price: v.precio,
        priceCurrency: v.moneda,
        availability: v.estado === "publicado" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
        seller: { "@type": "AutoDealer", name: agencia.nombre },
      },
    }),
  };

  return (
    <>
      {!portal.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <Ficha v={v} agencia={agencia} similares={similares} masDeLaAgencia={masDeLaAgencia} desdeCatalogo={desde === "agencia"} />
    </>
  );
}
