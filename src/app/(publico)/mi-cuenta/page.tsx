"use client";

import Link from "next/link";
import { EyeIcon, PlusIcon, UserIcon, WhatsAppIcon } from "@/components/icons";
import { MejorasDialog } from "@/components/mejoras-dialog";
import { VehiculoFoto } from "@/components/vehiculo-foto";
import { TOPE_PARTICULAR } from "@/config/planes";
import { guardarLocal } from "@/lib/demo-store";
import { eventosLocales } from "@/lib/eventos";
import { estaDestacado } from "@/lib/filtros";
import { formatKm, formatPrecio, tituloVehiculo } from "@/lib/format";
import { cuentaParaTope, diasRestantes, PARTICULAR_DEMO, renovar, topeAlcanzado, useAvisosParticular, vencido } from "@/lib/mi-cuenta";
import type { EstadoVehiculo, Vehiculo } from "@/lib/types";

const fmtFecha = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long" });

function Estado({ v }: { v: Vehiculo }) {
  if (vencido(v)) return <span className="rounded-md bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">Vencido</span>;
  const textos: Record<EstadoVehiculo, [string, string]> = {
    publicado: ["Publicado", "bg-ok-bg text-ok"],
    reservado: ["Reservado", "bg-warn-bg text-warn"],
    pausado: ["Pausado", "bg-soft text-muted"],
    borrador: ["Borrador", "bg-soft text-muted"],
    vendido: ["Vendido", "bg-ink text-white"],
  };
  const [label, clase] = textos[v.estado];
  return <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${clase}`}>{label}</span>;
}

function Aviso({ v, sinLugar }: { v: Vehiculo; sinLugar: boolean }) {
  const ev = eventosLocales()[v.codigo];
  const dias = diasRestantes(v);
  const cambiar = (estado: EstadoVehiculo) => guardarLocal({ ...v, estado });
  const activo = cuentaParaTope(v) && !vencido(v);
  return (
    <li className="rounded-2xl border border-line bg-surface p-3">
      <div className="flex gap-3">
        <Link href={`/auto/${v.slug}`} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-soft" aria-label={`Ver aviso de ${tituloVehiculo(v)}`}>
          <VehiculoFoto v={v} alt="" className="absolute inset-0 size-full" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-bold">
              {tituloVehiculo(v)} {v.anio}
            </p>
            <Estado v={v} />
          </div>
          <p className="truncate text-sm text-muted">{formatKm(v.km)}</p>
          <p className="font-extrabold">{formatPrecio(v.precio, v.moneda)}</p>
          <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs font-semibold text-muted">
            <span className="flex items-center gap-1">
              <EyeIcon className="size-3.5" /> {ev?.vista ?? 0} vistas
            </span>
            <span className="flex items-center gap-1">
              <WhatsAppIcon className="size-3.5" /> {ev?.whatsapp ?? 0} consultas
            </span>
          </p>
        </div>
      </div>
      {activo && (
        <p className="mt-2 text-xs text-muted">
          {estaDestacado(v) && v.destacadoHasta ? <span className="font-bold text-gold">Destacado hasta el {fmtFecha(v.destacadoHasta)} · </span> : null}
          {dias !== null && `Vence en ${dias} días`}
          {v.completo && " · Aviso completo"}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
        {activo && <MejorasDialog v={v} />}
        {(vencido(v) || (dias !== null && dias <= 10)) && v.estado !== "vendido" && (
          <button type="button" onClick={() => renovar(v)} className="btn btn-brand min-h-10 px-3 text-sm">
            Renovar 60 días
          </button>
        )}
        {v.estado === "publicado" && (
          <button type="button" onClick={() => cambiar("reservado")} className="btn btn-ghost min-h-10 px-3 text-sm">
            Marcar reservado
          </button>
        )}
        {(v.estado === "publicado" || v.estado === "reservado") && (
          <button type="button" onClick={() => cambiar("pausado")} className="btn btn-ghost min-h-10 px-3 text-sm">
            Pausar
          </button>
        )}
        {(v.estado === "pausado" || v.estado === "borrador" || v.estado === "reservado") && (
          <button type="button" disabled={v.estado !== "reservado" && sinLugar} onClick={() => cambiar("publicado")} className="btn btn-ghost min-h-10 px-3 text-sm disabled:opacity-50">
            {v.estado === "reservado" ? "Quitar reserva" : "Publicar"}
          </button>
        )}
        {v.estado !== "vendido" && v.estado !== "borrador" && (
          <button type="button" onClick={() => cambiar("vendido")} className="btn btn-ghost min-h-10 px-3 text-sm">
            Lo vendí
          </button>
        )}
        <Link href={`/mi-cuenta/editar?codigo=${v.codigo}`} className="btn btn-ghost min-h-10 px-3 text-sm">
          Editar
        </Link>
      </div>
    </li>
  );
}

export default function MiCuentaPage() {
  const avisos = useAvisosParticular();
  if (!avisos) return <p className="py-16 text-center text-muted">Cargando…</p>;
  const activos = avisos.filter((v) => cuentaParaTope(v) && !vencido(v)).length;
  const sinLugar = topeAlcanzado(avisos.filter((v) => !vencido(v)));

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <p className="rounded-xl bg-soft px-3 py-2 text-xs font-semibold text-muted">DEMO · Entrás como un particular de prueba, sin registrarte. Lo que publiques queda solo en este teléfono.</p>
      <div className="mt-4 flex items-center gap-3">
        <span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-brand-light text-brand">
          <UserIcon className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mis avisos</h1>
          <p className="text-sm text-muted">{PARTICULAR_DEMO.nombre}</p>
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-line bg-surface p-4" aria-labelledby="cupo">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="cupo" className="font-bold">
              {activos} de {TOPE_PARTICULAR} autos publicados
            </h2>
            <p className="text-sm text-muted">Publicar es gratis. Los avisos duran 60 días y se renuevan con un toque.</p>
          </div>
          {sinLugar ? (
            <span className="shrink-0 text-right text-sm font-semibold text-warn">Llegaste al máximo</span>
          ) : (
            <Link href="/mi-cuenta/publicar" className="btn btn-brand shrink-0">
              <PlusIcon className="size-5" /> Publicar
            </Link>
          )}
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: TOPE_PARTICULAR }, (_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < activos ? "bg-brand" : "bg-line"}`} />
          ))}
        </div>
        {sinLugar && <p className="mt-3 text-sm text-muted">Para publicar otro, marcá uno como vendido o pausalo. ¿Vendés autos seguido? Mirá los <Link href="/para-concesionarias" className="font-semibold text-brand underline">planes para concesionarias</Link>.</p>}
      </section>

      {avisos.length ? (
        <ul className="mt-5 space-y-3">
          {avisos.map((v) => (
            <Aviso key={v.codigo} v={v} sinLugar={sinLugar} />
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-lg font-bold">Todavía no publicaste ningún auto</p>
          <p className="mt-1 text-muted">Cargalo desde el celular en pocos minutos. Es gratis.</p>
          <Link href="/mi-cuenta/publicar" className="btn btn-brand mt-4">
            <PlusIcon className="size-5" /> Publicar mi auto
          </Link>
        </div>
      )}
    </div>
  );
}
