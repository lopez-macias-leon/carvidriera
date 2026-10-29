import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { Faq } from "@/components/page-shell";
import { planTaller } from "@/config/planes";
import { portal } from "@/config/portal";
import { formatNumero } from "@/lib/format";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Para talleres: sumá tu taller",
  description: "Sumá tu taller mecánico a CarVidriera y recibí consultas por WhatsApp de personas que compran y venden autos en Catamarca.",
};

const FAQ = [
  { p: "¿Cómo me llegan los clientes?", r: "Por WhatsApp, directo a tu número. Te encuentran en el apartado de mecánicos y, si hacés revisión precompra, también en las fichas de autos usados." },
  { p: "¿Qué es la revisión precompra?", r: "Revisar un usado antes de que alguien lo compre. En cada ficha de auto usado mostramos talleres que la hacen, rotando entre todos los suscriptos." },
  { p: "¿Cobran comisión por trabajo?", r: "No. Pagás una suscripción mensual fija." },
  { p: "¿Qué pasa si me atraso?", r: "Tenés 5 días de gracia. Después tu ficha se pausa y vuelve sola cuando pagás." },
  { p: "¿Qué necesito para estar verificado?", r: "Tu CUIT." },
];

export default function ParaTalleresPage() {
  const contacto = linkWhatsApp(portal.whatsapp, `Hola ${portal.name}, tengo un taller y quiero sumarlo al apartado de mecánicos.`);
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Para mecánicos y talleres</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Clientes que llegan con el auto en la mano</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">Aparecé donde la gente de Catamarca compra y vende autos, y recibí consultas por WhatsApp.</p>
          <a href={contacto} target="_blank" rel="noopener" className="btn btn-wa mt-6 min-h-12 text-base">
            <WhatsAppIcon className="size-5" /> Quiero sumar mi taller
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-12" aria-labelledby="plan">
        <h2 id="plan" className="text-2xl font-extrabold tracking-tight">
          Plan para talleres
        </h2>
        <article className="mt-5 rounded-3xl border border-brand bg-surface p-6 ring-2 ring-brand">
          <h3 className="text-xl font-extrabold">Plan {planTaller.nombre}</h3>
          <p className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight">{planTaller.precio === null ? "Precio a definir" : `$ ${formatNumero(planTaller.precio)}`}</span>
            {planTaller.precio !== null && <span className="text-muted"> / mes</span>}
          </p>
          <ul className="mt-5 space-y-2.5">
            {planTaller.items.map((it) => (
              <li key={it} className="flex gap-2">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-ok" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <a href={contacto} target="_blank" rel="noopener" className="btn btn-brand mt-6 w-full">
            Quiero el plan
          </a>
        </article>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-12" aria-labelledby="preguntas-talleres">
        <h2 id="preguntas-talleres" className="text-2xl font-extrabold tracking-tight">
          Preguntas de talleres
        </h2>
        <div className="mt-5">
          <Faq items={FAQ} />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/mecanicos" className="font-bold text-brand underline">
            Ver el apartado de mecánicos
          </Link>
        </p>
      </section>
    </>
  );
}
