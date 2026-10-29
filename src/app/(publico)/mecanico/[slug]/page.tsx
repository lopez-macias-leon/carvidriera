import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgencyAvatar } from "@/components/agency-avatar";
import { LazyMap } from "@/components/catalog-actions";
import { TrackView } from "@/components/contact-bar";
import { ClockIcon, PinIcon, VerifiedIcon, WhatsAppIcon, WrenchIcon } from "@/components/icons";
import { OpenNow } from "@/components/open-now";
import { portal } from "@/config/portal";
import { getTaller, getTalleres } from "@/lib/catalog";
import { horariosPorDia, labelEspecialidad, nombreLocalidad } from "@/lib/format";
import { linkWhatsApp, mensajeTaller } from "@/lib/whatsapp";

export async function generateStaticParams() {
  return (await getTalleres()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mecanico/[slug]">): Promise<Metadata> {
  const t = await getTaller((await params).slug);
  if (!t) return {};
  return {
    title: `${t.nombre}: taller en ${nombreLocalidad(t.localidad)}`,
    description: `${t.nombre}, ${t.direccion}, ${nombreLocalidad(t.localidad)}. ${t.especialidades.map(labelEspecialidad).join(", ")}. Consultá por WhatsApp.`,
    alternates: { canonical: `/mecanico/${t.slug}` },
  };
}

export default async function TallerPage({ params }: PageProps<"/mecanico/[slug]">) {
  const t = await getTaller((await params).slug);
  if (!t) notFound();
  const maps =
    t.lat && t.lng
      ? `https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${t.direccion}, Catamarca`)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: t.nombre,
    address: { "@type": "PostalAddress", streetAddress: t.direccion, addressLocality: nombreLocalidad(t.localidad), addressRegion: "Catamarca", addressCountry: "AR" },
  };

  return (
    <>
      <TrackView id={t.slug} tipo="vista_catalogo" />
      {!portal.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <nav aria-label="Ruta" className="text-sm text-muted">
          <Link href="/mecanicos" className="hover:underline">
            Mecánicos
          </Link>
        </nav>
        <div className="mt-3 flex items-center gap-4">
          <AgencyAvatar agencia={t} size="lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t.nombre}</h1>
            {t.verificado && (
              <p className="flex items-center gap-1 text-sm font-semibold text-brand">
                <VerifiedIcon className="size-4" /> Taller verificado
              </p>
            )}
            <p className="flex items-center gap-1 text-sm text-muted">
              <PinIcon className="size-4" /> {nombreLocalidad(t.localidad)}
            </p>
            <OpenNow horarios={t.horarios} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <a href={linkWhatsApp(t.whatsapp, mensajeTaller(t))} target="_blank" rel="noopener" className="btn btn-wa min-h-12 text-base">
            <WhatsAppIcon className="size-5" /> Consultar por WhatsApp
          </a>
          <a href={maps} target="_blank" rel="noopener" className="btn btn-ghost min-h-12">
            <PinIcon className="size-5" /> Cómo llegar
          </a>
        </div>

        <section className="mt-6" aria-labelledby="especialidades">
          <h2 id="especialidades" className="flex items-center gap-2 font-bold">
            <WrenchIcon className="size-5 text-brand" /> Especialidades
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {t.especialidades.map((e) => (
              <li key={e} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${e === "precompra" ? "bg-brand text-white" : "bg-soft"}`}>
                {labelEspecialidad(e)}
              </li>
            ))}
          </ul>
          {t.especialidades.includes("precompra") && (
            <p className="mt-3 rounded-xl bg-brand-light/50 p-3 text-sm">
              <strong>Revisión precompra:</strong> llevá el auto que querés comprar y te dicen en qué estado está antes de que pagues.
            </p>
          )}
        </section>

        <p className="mt-6 text-muted">{t.descripcion}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="min-w-0 rounded-2xl border border-line bg-surface p-4" aria-labelledby="donde">
            <h2 id="donde" className="flex items-center gap-2 font-bold">
              <PinIcon className="size-5 text-brand" /> Dónde está
            </h2>
            <p className="mt-2 text-sm">
              {t.direccion}, {nombreLocalidad(t.localidad)}
            </p>
            {t.lat && t.lng && (
              <div className="mt-3">
                <LazyMap lat={t.lat} lng={t.lng} nombre={t.nombre} />
              </div>
            )}
          </section>
          <section className="min-w-0 rounded-2xl border border-line bg-surface p-4" aria-labelledby="horarios">
            <h2 id="horarios" className="flex items-center gap-2 font-bold">
              <ClockIcon className="size-5 text-brand" /> Horarios
            </h2>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {horariosPorDia(t.horarios).map((d) => (
                <div key={d.dia} className="contents">
                  <dt className="font-semibold">{d.dia}</dt>
                  <dd className="text-muted">{d.franjas.length ? d.franjas.join(" y ") : "Cerrado"}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
