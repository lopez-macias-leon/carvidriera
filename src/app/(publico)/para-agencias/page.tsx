import type { Metadata } from "next";
import Link from "next/link";
import { ChartIcon, CheckIcon, PhoneIcon2, QrIcon, StoreIcon, WhatsAppIcon } from "@/components/icons";
import { Faq } from "@/components/page-shell";
import { planes } from "@/config/planes";
import { portal } from "@/config/portal";
import { formatNumero } from "@/lib/format";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Para agencias: publicá tu stock",
  description: "Publicá el stock de tu agencia en CarVidriera, recibí consultas por WhatsApp y tené tu catálogo propio. Sin comisiones por venta.",
};

const BENEFICIOS = [
  { Icon: WhatsAppIcon, t: "Consultas directas por WhatsApp", d: "El comprador te escribe con el auto y el link ya en el mensaje. Sin intermediarios ni comisiones." },
  { Icon: StoreIcon, t: "Tu catálogo propio", d: "Una página con todo tu stock para poner en la bio de Instagram y mandar por WhatsApp. Sin autos de otras agencias." },
  { Icon: ChartIcon, t: "Estadísticas de cada auto", d: "Cuántas personas vieron cada auto y cuántas te consultaron. Sabés qué funciona." },
  { Icon: PhoneIcon2, t: "Cargás un auto en minutos", d: "Desde el celular: sacás las fotos, completás los datos con un toque y listo." },
  { Icon: QrIcon, t: "Código QR para tu agencia", d: "Imprimilo y pegalo en la vidriera o en los autos: escanean y ven todo tu stock." },
  { Icon: CheckIcon, t: "Sin comisiones por venta", d: "Pagás una suscripción mensual fija. La venta es tuya y se cierra con vos." },
];

const FAQ = [
  { p: "¿Cobran comisión por cada auto vendido?", r: "No. Pagás solo la suscripción mensual. La venta se arregla directamente entre vos y el comprador." },
  { p: "¿Quién carga los autos?", r: "Vos, desde el celular, en pocos minutos. Y la primera carga de todo tu stock la hacemos nosotros sin costo." },
  { p: "¿Cómo pago?", r: "Por Mercado Pago o transferencia, todos los meses." },
  { p: "¿Qué pasa si me atraso con el pago?", r: "Tenés 5 días de gracia. Si no se registra el pago, tus autos se pausan; cuando pagás, vuelven a publicarse solos, tal como estaban." },
  { p: "¿Qué es el precio fundador?", r: "Las primeras agencias mantienen su precio mensual sin aumentos mientras sigan suscriptas. Un atraso no hace perder el beneficio: alcanza con ponerse al día." },
  { p: "¿Puedo cambiar de plan?", r: "Sí. Si pasás a Pro, el cambio rige desde tu próximo pago. Si pasás a Básico, elegís qué 5 autos quedan publicados." },
  { p: "¿Puedo darme de baja?", r: "Cuando quieras, sin permanencia mínima. Al darte de baja se borran tus datos y tus autos." },
  { p: "¿Qué necesito para estar verificado?", r: "Tu CUIT. Con eso aparecés como \"Agencia verificada\", que genera más confianza en los compradores." },
];

export default function ParaAgenciasPage() {
  const contacto = linkWhatsApp(portal.whatsapp, `Hola ${portal.name}, tengo una agencia y quiero conocer los planes.`);
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Para agencias y concesionarias</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Tu stock frente a los compradores de Catamarca</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">Recibí consultas reales por WhatsApp, tené tu catálogo propio para compartir y mirá cuántas personas ven cada auto.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a href={contacto} target="_blank" rel="noopener" className="btn btn-wa min-h-12 text-base">
              <WhatsAppIcon className="size-5" /> Quiero sumar mi agencia
            </a>
            <Link href="#planes" className="btn min-h-12 border border-white/30 text-base text-white hover:bg-white/10">
              Ver planes
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12" aria-labelledby="beneficios">
        <h2 id="beneficios" className="text-2xl font-extrabold tracking-tight">
          Qué te da {portal.name}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS.map(({ Icon, t, d }) => (
            <li key={t} className="rounded-2xl border border-line bg-surface p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-light text-brand">
                <Icon className="size-6" />
              </span>
              <p className="mt-3 font-bold">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="planes" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-14" aria-labelledby="titulo-planes">
        <h2 id="titulo-planes" className="text-2xl font-extrabold tracking-tight">
          Planes
        </h2>
        <p className="mt-1 text-muted">Precio mensual. Sin comisiones por venta y sin permanencia mínima.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {planes.map((p) => {
            const pro = p.codigo === "pro";
            return (
              <article key={p.codigo} className={`relative rounded-3xl border p-6 ${pro ? "border-brand bg-surface shadow-lg ring-2 ring-brand" : "border-line bg-surface"}`}>
                {pro && <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">Para más de 5 autos</span>}
                <h3 className="text-xl font-extrabold">Plan {p.nombre}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-extrabold tracking-tight">$ {formatNumero(p.precio)}</span>
                  <span className="text-muted"> / mes</span>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <CheckIcon className="mt-0.5 size-5 shrink-0 text-ok" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <a href={linkWhatsApp(portal.whatsapp, `Hola ${portal.name}, me interesa el plan ${p.nombre} para mi agencia.`)} target="_blank" rel="noopener" className={`btn mt-6 w-full ${pro ? "btn-brand" : "btn-ghost"}`}>
                  Quiero el plan {p.nombre}
                </a>
              </article>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl bg-gold-bg p-4 text-gold">
          <p className="font-bold">Precio fundador</p>
          <p className="text-sm">Las primeras agencias mantienen su precio sin aumentos mientras sigan suscriptas. La carga inicial de tu stock la hacemos nosotros, bonificada.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14" aria-labelledby="como-empezar">
        <h2 id="como-empezar" className="text-2xl font-extrabold tracking-tight">
          Cómo empezar
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {["Nos escribís y te mostramos el portal en 10 minutos.", "Te damos de alta y cargamos tu stock sin costo.", "Compartís tu catálogo y empezás a recibir consultas."].map((t, i) => (
            <li key={t} className="flex gap-3 rounded-2xl border border-line bg-surface p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-extrabold text-white">{i + 1}</span>
              <span className="font-semibold">{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-20 px-4 pt-14" aria-labelledby="titulo-preguntas">
        <h2 id="titulo-preguntas" className="text-2xl font-extrabold tracking-tight">
          Preguntas de agencias
        </h2>
        <div className="mt-5">
          <Faq items={FAQ} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Ver las{" "}
          <Link href="/condiciones-agencias" className="font-semibold text-brand underline">
            condiciones para agencias
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="rounded-3xl bg-brand p-6 text-center text-white sm:p-10">
          <h2 className="text-2xl font-extrabold">¿Lo vemos juntos?</h2>
          <p className="mt-2 text-white/85">Te mostramos cómo se ve tu stock en el portal, en 10 minutos.</p>
          <a href={contacto} target="_blank" rel="noopener" className="btn btn-wa mt-5 min-h-12 text-base">
            <WhatsAppIcon className="size-5" /> Escribinos por WhatsApp
          </a>
          <p className="mt-4 text-sm">
            <Link href="/panel" className="font-semibold text-white underline">
              Ver la demo del panel de agencia
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
