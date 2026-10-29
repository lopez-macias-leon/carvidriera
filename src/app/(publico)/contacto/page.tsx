import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { PageShell } from "@/components/page-shell";
import { isSet, portal } from "@/config/portal";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  return (
    <PageShell titulo="Contacto" bajada="¿Tenés una consulta sobre el portal? Escribinos.">
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={linkWhatsApp(portal.whatsapp, `Hola ${portal.name}, quería hacer una consulta.`)} target="_blank" rel="noopener" className="btn btn-wa min-h-14 text-base">
          <WhatsAppIcon className="size-5" /> Escribir por WhatsApp
        </a>
        <p className="flex min-h-14 items-center justify-center rounded-xl border border-line bg-surface px-4 font-semibold">
          {isSet(portal.email) ? <a href={`mailto:${portal.email}`}>{portal.email}</a> : "[EMAIL]"}
        </p>
      </div>
      <p className="mt-6 rounded-2xl bg-soft p-4">
        <strong>¿Querés consultar por un auto?</strong> Escribile directo a la agencia desde la ficha del auto: CarVidriera no vende autos.
      </p>
      <p className="mt-4">
        ¿Tenés una agencia?{" "}
        <Link href="/para-concesionarias" className="font-bold text-brand underline">
          Mirá los planes
        </Link>
        .
      </p>
    </PageShell>
  );
}
