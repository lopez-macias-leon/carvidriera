import Link from "next/link";
import { formatKm, formatPrecio, labelCombustible, labelCaja, localidadCorta, tituloCompleto, tituloVehiculo } from "@/lib/format";
import type { Agencia, Vehiculo } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";
import { estaDestacado } from "@/lib/filtros";
import { PinIcon, UserIcon, VerifiedIcon } from "./icons";
import { VehiculoFoto } from "./vehiculo-foto";

export function EstadoBadge({ v }: { v: Pick<Vehiculo, "estado" | "destacado" | "destacadoHasta" | "condicion"> }) {
  if (v.estado === "reservado") return <span className="rounded-md bg-warn-bg px-2 py-1 text-xs font-bold text-warn">Reservado</span>;
  if (v.estado === "vendido") return <span className="rounded-md bg-ink px-2 py-1 text-xs font-bold text-white">Vendido</span>;
  return (
    <span className="flex gap-1.5">
      {estaDestacado(v) && <span className="rounded-md bg-gold-bg px-2 py-1 text-xs font-bold text-gold">Destacado</span>}
      {v.condicion === "0km" && <span className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-white">0 km</span>}
    </span>
  );
}

export function CarCard({
  v,
  agencia,
  eager = false,
  desde,
}: {
  v: Vehiculo;
  agencia?: Pick<Agencia, "nombre" | "verificada">;
  eager?: boolean;
  /** Origen del click (ej. catálogo de agencia), para priorizar sus autos en la ficha. */
  desde?: string;
}) {
  const titulo = tituloVehiculo(v);
  const href = `/auto/${v.slug}${desde ? `?desde=${desde}` : ""}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(14,23,38,0.04)] transition hover:shadow-md">
      <div className="relative aspect-[4/3] bg-soft">
        <VehiculoFoto v={v} eager={eager} alt={tituloCompleto(v)} className="absolute inset-0 size-full" />
        <div className="absolute left-2.5 top-2.5">
          <EstadoBadge v={v} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className={`text-xl font-extrabold tracking-tight ${v.precio === null ? "text-brand" : "text-ink"}`}>{formatPrecio(v.precio, v.moneda)}</p>
        <h3 className="font-bold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {titulo}
          </Link>
        </h3>
        <p className="truncate text-sm text-muted">{v.version}</p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {v.anio} · {formatKm(v.km)} · {labelCombustible(v.combustible)} · {labelCaja(v.caja)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2.5 text-xs text-muted">
          <span className="flex min-w-0 items-center gap-1">
            <PinIcon className="size-3.5 shrink-0" />
            <span className="truncate">{localidadCorta(v.localidad)}</span>
          </span>
          {v.vendedor === "particular" ? (
            <span className="flex min-w-0 items-center gap-1 font-semibold text-ink">
              <UserIcon className="size-3.5 shrink-0" />
              <span className="truncate">Particular</span>
            </span>
          ) : agencia && (
            <span className="flex min-w-0 items-center gap-1 font-semibold text-ink">
              <span className="truncate">{agencia.nombre}</span>
              {agencia.verificada && (
                <>
                  <VerifiedIcon className="size-4 shrink-0 text-brand" />
                  <span className="sr-only">(agencia verificada)</span>
                </>
              )}
            </span>
          )}
        </div>
      </div>
      <FavoriteButton codigo={v.codigo} titulo={`${titulo} ${v.anio}`} className="absolute right-2.5 top-2.5 z-10" />
    </article>
  );
}

export function CarGrid({ children, conLateral = false }: { children: React.ReactNode; conLateral?: boolean }) {
  const cols = conLateral ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4";
  return <div className={`grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 ${cols}`}>{children}</div>;
}
