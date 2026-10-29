import Link from "next/link";
import { formatKm, formatPrecio, labelCaja, labelCombustible, labelTipo, localidadCorta, nombreLocalidad, tituloCompleto, tituloVehiculo } from "@/lib/format";
import type { Agencia, Taller, Vehiculo } from "@/lib/types";
import { linkWhatsApp, mensajeTaller } from "@/lib/whatsapp";
import { AgencyAvatar } from "./agency-avatar";
import { CarCard, CarGrid, EstadoBadge } from "./car-card";
import { ContactBar, ShareButton, TrackView, WhatsAppButton } from "./contact-bar";
import { FavoriteButton } from "./favorite-button";
import { Gallery } from "./gallery";
import { CheckIcon, ChevronRight, DocIcon, PinIcon, UserIcon, VerifiedIcon, WhatsAppIcon, WrenchIcon } from "./icons";
import { OpenNow } from "./open-now";
import { ReportDialog } from "./report-dialog";

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-xl bg-soft px-3 py-2.5">
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="font-bold">{valor}</dd>
    </div>
  );
}

/** Ficha del auto. Se usa en el servidor y, para autos cargados en la demo, en el navegador. */
export function Ficha({
  v,
  agencia,
  similares,
  masDeLaAgencia,
  desdeCatalogo,
  talleres = [],
}: {
  v: Vehiculo;
  agencia: Agencia | null;
  similares: Vehiculo[];
  masDeLaAgencia: Vehiculo[];
  desdeCatalogo: boolean;
  /** Talleres que hacen revisión precompra (solo se muestran en usados). */
  talleres?: Taller[];
}) {
  const titulo = tituloCompleto(v);
  const disponible = v.estado === "publicado" || v.estado === "reservado";
  const agencias = agencia ? { [agencia.slug]: agencia } : {};
  const masDe = agencia ? `Más autos de ${agencia.nombre}` : "";
  const otros = desdeCatalogo ? [masDeLaAgencia, similares] : [similares, masDeLaAgencia];
  const titulos = desdeCatalogo ? [masDe, "Autos similares"] : ["Autos similares", masDe];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-3">
      {disponible && <TrackView id={v.codigo} />}
      <nav aria-label="Ruta" className="mb-3 flex items-center gap-1 overflow-hidden whitespace-nowrap text-sm text-muted">
        <Link href="/autos" className="hover:underline">
          Autos
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link href={`/autos?marca=${encodeURIComponent(v.marca)}`} className="hover:underline">
          {v.marca}
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate">{v.modelo}</span>
      </nav>

      {!disponible && (
        <div className="mb-4 rounded-2xl bg-ink p-4 text-white">
          <p className="font-bold">{v.estado === "vendido" ? "Este auto ya se vendió" : "Este aviso no está disponible"}</p>
          <p className="text-sm text-white/80">Mirá otros autos parecidos más abajo.</p>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
        <div>
          <Gallery v={v} titulo={titulo}>
            <div className="absolute left-3 top-3">
              <EstadoBadge v={v} />
            </div>
          </Gallery>
          {v.fotos.length === 0 && <p className="mt-1 text-xs text-muted">Ilustración de demostración. En el portal real se ven las fotos que sube el vendedor.</p>}
        </div>

        <div className="mt-4 lg:mt-0">
          <div className="lg:sticky lg:top-20">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{tituloVehiculo(v)}</h1>
            <p className="text-muted">{[v.version, v.anio].filter(Boolean).join(" · ")}</p>
            <p className={`mt-2 text-3xl font-extrabold tracking-tight ${v.precio === null ? "text-brand" : ""}`}>{formatPrecio(v.precio, v.moneda)}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <PinIcon className="size-4" /> {nombreLocalidad(v.localidad)}
            </p>

            {disponible && (
              <div className="mt-4 hidden gap-2 lg:flex">
                <WhatsAppButton v={v} agencia={agencia} className="min-h-12 flex-1 text-base" />
                <ShareButton v={v} titulo={titulo} />
                <FavoriteButton codigo={v.codigo} titulo={titulo} className="size-12 rounded-xl shadow-none ring-line" />
              </div>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              <Dato label="Año" valor={String(v.anio)} />
              <Dato label="Kilómetros" valor={formatKm(v.km)} />
              <Dato label="Combustible" valor={labelCombustible(v.combustible)} />
              <Dato label="Caja" valor={labelCaja(v.caja)} />
              <Dato label="Color" valor={v.color} />
              <Dato label="Tipo" valor={labelTipo(v.tipo)} />
            </dl>

            <section className="mt-4 rounded-2xl border border-line bg-surface p-4" aria-labelledby="documentacion">
              <h2 id="documentacion" className="flex items-center gap-2 font-bold">
                <DocIcon className="size-5 text-brand" /> Documentación
              </h2>
              <p className={`mt-2 flex items-center gap-2 font-bold ${v.papelesAlDia ? "text-ok" : "text-warn"}`}>
                {v.papelesAlDia ? <CheckIcon className="size-5" /> : null}
                {v.papelesAlDia ? "Papeles al día" : "Consultar estado de la documentación"}
              </p>
              {v.documentacion && <p className="mt-1 text-sm">{v.documentacion}</p>}
              <p className="mt-2 text-xs text-muted">Informado por el vendedor. Verificalo antes de comprar.</p>
            </section>

            {agencia ? <AgencyBox agencia={agencia} /> : v.particular && <ParticularBox v={v} />}
          </div>
        </div>
      </div>

      <section className="mt-6 max-w-3xl" aria-labelledby="descripcion">
        <h2 id="descripcion" className="text-lg font-extrabold">
          Descripción
        </h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed">{v.descripcion}</p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          <li className="rounded-full bg-soft px-3 py-1.5 font-semibold">{v.condicion === "0km" ? "0 km" : "Usado"}</li>
          {v.puertas && <li className="rounded-full bg-soft px-3 py-1.5 font-semibold">{v.puertas} puertas</li>}
          <li className="rounded-full bg-soft px-3 py-1.5 font-semibold">{v.permuta ? "Acepta permuta" : "No acepta permuta"}</li>
          {v.financiacion && <li className="rounded-full bg-soft px-3 py-1.5 font-semibold">Con financiación</li>}
        </ul>
      </section>

      {v.condicion === "usado" && talleres.length > 0 && <Precompra v={v} talleres={talleres} />}

      <details className="mt-6 max-w-3xl rounded-2xl border border-line bg-surface p-4" open={v.vendedor === "particular"}>
        <summary className="cursor-pointer font-bold">Consejos para comprar seguro</summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
          <li>Mirá el auto en persona y, si podés, con un mecánico de confianza.</li>
          <li>Pedí el informe de dominio y verificá la documentación antes de pagar.</li>
          <li>No hagas señas ni transferencias sin haber visto el auto y sus papeles.</li>
        </ul>
        <Link href="/consejos-de-compra" className="mt-3 inline-block text-sm font-bold text-brand hover:underline">
          Ver todos los consejos
        </Link>
      </details>

      <div className="mt-4">
        <ReportDialog codigo={v.codigo} />
      </div>

      {otros.map((lista, i) =>
        lista.length ? (
          <section key={titulos[i]} className="mt-10" aria-labelledby={`otros-${i}`}>
            <h2 id={`otros-${i}`} className="text-xl font-extrabold tracking-tight">
              {titulos[i]}
            </h2>
            <div className="mt-4">
              <CarGrid>
                {lista.map((x) => (
                  <CarCard key={x.codigo} v={x} agencia={agencias[x.agencia]} />
                ))}
              </CarGrid>
            </div>
          </section>
        ) : null,
      )}

      {disponible && <ContactBar v={v} agencia={agencia} titulo={titulo} />}
    </div>
  );
}

function AgencyBox({ agencia }: { agencia: Agencia }) {
  return (
    <section className="mt-4 rounded-2xl border border-line bg-surface p-4" aria-labelledby="agencia">
      <h2 id="agencia" className="sr-only">
        Agencia
      </h2>
      <div className="flex items-center gap-3">
        <AgencyAvatar agencia={agencia} />
        <div className="min-w-0">
          <p className="flex items-center gap-1 font-bold">
            <span className="truncate">{agencia.nombre}</span>
          </p>
          {agencia.verificada ? (
            <p className="flex items-center gap-1 text-sm font-semibold text-brand">
              <VerifiedIcon className="size-4" /> Concesionaria verificada
            </p>
          ) : (
            <p className="text-sm text-muted">{localidadCorta(agencia.localidad)}</p>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">
        {agencia.direccion}, {nombreLocalidad(agencia.localidad)}
      </p>
      <p className="mt-1">
        <OpenNow horarios={agencia.horarios} />
      </p>
      <Link href={`/agencia/${agencia.slug}`} className="btn btn-ghost mt-3 w-full">
        Ver todos los autos de la agencia
      </Link>
    </section>
  );
}

function ParticularBox({ v }: { v: Vehiculo }) {
  const p = v.particular!;
  return (
    <section className="mt-4 rounded-2xl border border-line bg-surface p-4" aria-labelledby="vendedor">
      <h2 id="vendedor" className="sr-only">
        Vendedor
      </h2>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-2xl bg-soft text-brand">
          <UserIcon className="size-7" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold">{p.nombre}</p>
          <p className="text-sm font-semibold text-muted">Vendedor particular · {localidadCorta(p.localidad)}</p>
        </div>
      </div>
      <p className="mt-3 rounded-xl bg-warn-bg p-3 text-sm text-warn">
        Encontrate en un lugar público, revisá los papeles y no pagues señas antes de ver el auto.
      </p>
    </section>
  );
}

/** Talleres que hacen revisión precompra: el comprador revisa el auto y el taller recibe clientes. */
function Precompra({ v, talleres }: { v: Vehiculo; talleres: Taller[] }) {
  return (
    <section className="mt-6 max-w-3xl rounded-2xl border border-line bg-surface p-4" aria-labelledby="precompra">
      <h2 id="precompra" className="flex items-center gap-2 font-bold">
        <WrenchIcon className="size-5 text-brand" /> ¿Lo querés revisar antes de comprar?
      </h2>
      <p className="mt-1 text-sm text-muted">Talleres que hacen revisión precompra cerca de este auto.</p>
      <ul className="mt-3 divide-y divide-line">
        {talleres.map((t) => (
          <li key={t.slug} className="flex items-center gap-3 py-2.5">
            <AgencyAvatar agencia={t} size="sm" />
            <Link href={`/mecanico/${t.slug}`} className="min-w-0 flex-1 hover:underline">
              <span className="block truncate font-semibold">{t.nombre}</span>
              <span className="block text-sm text-muted">{localidadCorta(t.localidad)}</span>
            </Link>
            <a href={linkWhatsApp(t.whatsapp, mensajeTaller(t, v))} target="_blank" rel="noopener" className="btn btn-ghost min-h-10 px-3 text-sm text-wa" aria-label={`Consultar a ${t.nombre} por WhatsApp`}>
              <WhatsAppIcon className="size-5" /> Consultar
            </a>
          </li>
        ))}
      </ul>
      <Link href="/mecanicos" className="mt-2 inline-block text-sm font-bold text-brand hover:underline">
        Ver todos los mecánicos
      </Link>
    </section>
  );
}
