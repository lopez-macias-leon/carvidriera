"use client";

import Link from "next/link";
import { BarChart } from "@/components/bar-chart";
import { CopyLinkButton } from "@/components/copy-link";
import { ChartIcon, EyeIcon, PlusIcon, ShareIcon, WhatsAppIcon } from "@/components/icons";
import { VehiculoFoto } from "@/components/vehiculo-foto";
import { useAhora } from "@/lib/cliente";
import { formatNumero, formatPrecio, tituloVehiculo } from "@/lib/format";
import { AGENCIA_DEMO, serieDemo, statsDe, useAutosAgencia, VENCE_DEMO } from "@/lib/panel";

const fmtFecha = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long" });

function Tile({ label, valor, Icon, nota }: { label: string; valor: string; Icon: typeof EyeIcon; nota?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-muted">
        <Icon className="size-4" /> {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight">{valor}</p>
      {nota && <p className="text-xs text-muted">{nota}</p>}
    </div>
  );
}

export default function PanelInicio() {
  const autos = useAutosAgencia();
  const hoy = useAhora();
  if (!autos || !hoy) return <p className="py-16 text-center text-muted">Cargando…</p>;

  const activos = autos.filter((v) => v.estado === "publicado" || v.estado === "reservado");
  const conStats = autos.map((v) => ({ v, s: statsDe(v) }));
  const total = conStats.reduce((a, { s }) => ({ vistas: a.vistas + s.vistas, whatsapp: a.whatsapp + s.whatsapp, compartidos: a.compartidos + s.compartidos }), { vistas: 0, whatsapp: 0, compartidos: 0 });
  const top = [...conStats].sort((a, b) => b.s.vistas - a.s.vistas).slice(0, 3);
  const sinConsultas = conStats.filter(({ v, s }) => v.estado === "publicado" && s.whatsapp === 0 && !v.local);
  const mes = hoy.toLocaleDateString("es-AR", { month: "long" });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-2xl bg-brand p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/80">Hola, {AGENCIA_DEMO.nombre}</p>
          <p className="mt-1 text-xl font-extrabold">
            En {mes} tus autos tuvieron {formatNumero(total.vistas)} vistas y {formatNumero(total.whatsapp)} consultas por WhatsApp
          </p>
        </div>
        <Link href="/panel/autos/nuevo" className="btn shrink-0 bg-white text-brand hover:bg-brand-light">
          <PlusIcon className="size-5" /> Cargar auto
        </Link>
      </section>

      <section aria-labelledby="resumen">
        <h1 id="resumen" className="text-lg font-extrabold">
          Resumen del mes
        </h1>
        <p className="text-xs text-muted">Números de ejemplo, más lo que hagas en esta demo.</p>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Autos publicados" valor={String(activos.length)} Icon={ChartIcon} nota="Plan Pro: sin límite" />
          <Tile label="Vistas" valor={formatNumero(total.vistas)} Icon={EyeIcon} />
          <Tile label="Consultas WhatsApp" valor={formatNumero(total.whatsapp)} Icon={WhatsAppIcon} nota={total.vistas ? `${((total.whatsapp / total.vistas) * 100).toFixed(1)}% de las vistas` : undefined} />
          <Tile label="Compartidos" valor={formatNumero(total.compartidos)} Icon={ShareIcon} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4" aria-labelledby="grafico">
        <h2 id="grafico" className="font-bold">
          Vistas por día · últimos 30 días
        </h2>
        <div className="mt-6">
          <BarChart datos={serieDemo(total.vistas, 30, hoy)} titulo="Vistas por día de los autos de la agencia, últimos 30 días" unidad="vistas" />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-line bg-surface p-4" aria-labelledby="top">
          <h2 id="top" className="font-bold">
            Tus autos más vistos
          </h2>
          <ol className="mt-3 divide-y divide-line">
            {top.map(({ v, s }, i) => (
              <li key={v.codigo} className="flex items-center gap-3 py-2.5">
                <span className="w-4 text-sm font-bold text-muted">{i + 1}</span>
                <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-soft">
                  <VehiculoFoto v={v} alt="" className="absolute inset-0 size-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {tituloVehiculo(v)} {v.anio}
                  </span>
                  <span className="block text-sm text-muted">{formatPrecio(v.precio, v.moneda)}</span>
                </span>
                <span className="shrink-0 text-right text-sm">
                  <span className="block font-bold">{formatNumero(s.vistas)} vistas</span>
                  <span className="block text-muted">{s.whatsapp} consultas</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="font-bold">Tu plan</h2>
            <p className="mt-1">
              <span className="font-semibold">Plan Pro</span> · se renueva el {fmtFecha(VENCE_DEMO)}
            </p>
            <p className="mt-1 text-sm text-muted">Autos ilimitados y 12 destacados. Precio fundador: no aumenta mientras sigas suscripto.</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="font-bold">Tu catálogo</h2>
            <p className="mt-1 text-sm text-muted">Compartilo en Instagram y WhatsApp: muestra solo tus autos.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyLinkButton ruta={`/agencia/${AGENCIA_DEMO.slug}`} />
              <Link href="/panel/catalogo" className="btn btn-ghost">
                QR y vista previa
              </Link>
            </div>
          </div>
          {sinConsultas.length > 0 && (
            <div className="rounded-2xl bg-warn-bg p-4 text-warn">
              <p className="font-bold">{sinConsultas.length === 1 ? "1 auto sin consultas" : `${sinConsultas.length} autos sin consultas`} este mes</p>
              <p className="mt-1 text-sm">Probá sumar fotos del interior o revisar el precio: {sinConsultas.map(({ v }) => `${tituloVehiculo(v)} ${v.anio}`).join(", ")}.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
