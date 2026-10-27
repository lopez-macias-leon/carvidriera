import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgencyAvatar } from "@/components/agency-avatar";
import { CatalogActions, LazyMap } from "@/components/catalog-actions";
import { TrackView } from "@/components/contact-bar";
import { ClockIcon, PinIcon, VerifiedIcon } from "@/components/icons";
import { OpenNow } from "@/components/open-now";
import { StockList } from "@/components/stock-list";
import { portal } from "@/config/portal";
import { getAgencia, getAgencias, getStockAgencia } from "@/lib/catalog";
import { horariosPorDia, nombreLocalidad } from "@/lib/format";

export async function generateStaticParams() {
  return (await getAgencias()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/agencia/[slug]">): Promise<Metadata> {
  const agencia = await getAgencia((await params).slug);
  if (!agencia) return {};
  const stock = await getStockAgencia(agencia.slug);
  return {
    title: `${agencia.nombre}: autos en ${nombreLocalidad(agencia.localidad)}`,
    description: `${stock.length} autos disponibles en ${agencia.nombre}, ${agencia.direccion}, ${nombreLocalidad(agencia.localidad)}. Mirá el stock y consultá por WhatsApp.`,
    alternates: { canonical: `/agencia/${agencia.slug}` },
    openGraph: { title: `${agencia.nombre} · ${stock.length} autos disponibles` },
  };
}

export default async function AgenciaPage({ params }: PageProps<"/agencia/[slug]">) {
  const agencia = await getAgencia((await params).slug);
  if (!agencia) notFound();
  const stock = await getStockAgencia(agencia.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: agencia.nombre,
    address: { "@type": "PostalAddress", streetAddress: agencia.direccion, addressLocality: nombreLocalidad(agencia.localidad), addressRegion: "Catamarca", addressCountry: "AR" },
    ...(agencia.lat && { geo: { "@type": "GeoCoordinates", latitude: agencia.lat, longitude: agencia.lng } }),
  };

  return (
    <>
      <TrackView id={agencia.slug} tipo="vista_catalogo" />
      {!portal.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <section className="border-b border-line bg-surface">
        <div className="h-20 sm:h-28" style={{ background: `linear-gradient(120deg, ${agencia.color}, #0e1726)` }} />
        <div className="mx-auto max-w-6xl px-4 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <span className="rounded-3xl bg-surface p-1.5 shadow-sm">
              <AgencyAvatar agencia={agencia} size="lg" />
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{agencia.nombre}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {agencia.verificada && (
              <span className="flex items-center gap-1 font-semibold text-brand">
                <VerifiedIcon className="size-4" /> Agencia verificada
              </span>
            )}
            <span className="flex items-center gap-1 text-muted">
              <PinIcon className="size-4" /> {nombreLocalidad(agencia.localidad)}
            </span>
            <span className="font-bold">{stock.length} autos disponibles</span>
          </p>
          <p className="mt-1">
            <OpenNow horarios={agencia.horarios} />
          </p>
          <div className="mt-4 max-w-xl">
            <CatalogActions agencia={agencia} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <section aria-labelledby="stock">
          <h2 id="stock" className="sr-only">
            Stock
          </h2>
          <StockList agencia={agencia} stock={stock} />
        </section>

        <aside className="mt-10 space-y-4 lg:mt-0">
          {agencia.descripcion && <p className="text-muted">{agencia.descripcion}</p>}
          <section className="rounded-2xl border border-line bg-surface p-4" aria-labelledby="donde">
            <h2 id="donde" className="flex items-center gap-2 font-bold">
              <PinIcon className="size-5 text-brand" /> Dónde estamos
            </h2>
            <p className="mt-2 text-sm">
              {agencia.direccion}, {nombreLocalidad(agencia.localidad)}
            </p>
            {agencia.lat && agencia.lng && (
              <div className="mt-3">
                <LazyMap lat={agencia.lat} lng={agencia.lng} nombre={agencia.nombre} />
              </div>
            )}
          </section>
          <section className="rounded-2xl border border-line bg-surface p-4" aria-labelledby="horarios">
            <h2 id="horarios" className="flex items-center gap-2 font-bold">
              <ClockIcon className="size-5 text-brand" /> Horarios
            </h2>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {horariosPorDia(agencia.horarios).map((d) => (
                <div key={d.dia} className="contents">
                  <dt className="font-semibold">{d.dia}</dt>
                  <dd className="text-muted">{d.franjas.length ? d.franjas.join(" y ") : "Cerrado"}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>

      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-sm text-muted">
        Catálogo en{" "}
        <Link href="/" className="font-bold text-brand hover:underline">
          {portal.name}
        </Link>
        , autos de agencias de Catamarca.
      </p>
    </>
  );
}
