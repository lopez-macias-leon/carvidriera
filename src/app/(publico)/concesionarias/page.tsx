import type { Metadata } from "next";
import Link from "next/link";
import { AgencyAvatar } from "@/components/agency-avatar";
import { VerifiedIcon } from "@/components/icons";
import { OpenNow } from "@/components/open-now";
import { contarPorAgencia, getAgencias } from "@/lib/catalog";
import { nombreLocalidad } from "@/lib/format";

export const metadata: Metadata = {
  title: "Concesionarias de Catamarca",
  description: "Concesionarias y agencias de autos de Catamarca con su stock de usados y 0 km. Mirá el catálogo de cada una y consultá por WhatsApp.",
};

export default async function ConcesionariasPage() {
  const [agencias, porAgencia] = await Promise.all([getAgencias(), contarPorAgencia()]);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Concesionarias de Catamarca</h1>
      <p className="mt-1 text-muted">Agencias verificadas con su stock de usados y 0 km. Entrá al catálogo de cada una.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/autos?vendedor=agencia" className="chip hover:border-brand">
          Todos los autos de concesionarias
        </Link>
        <Link href="/autos?condicion=0km" className="chip hover:border-brand">
          0 km
        </Link>
        <Link href="/para-concesionarias" className="chip hover:border-brand">
          ¿Tenés una concesionaria? Sumala
        </Link>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agencias.map((a) => (
          <li key={a.slug}>
            <Link href={`/agencia/${a.slug}`} className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand hover:shadow-md">
              <AgencyAvatar agencia={a} />
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-lg font-bold">
                  <span className="truncate">{a.nombre}</span>
                  {a.verificada && <VerifiedIcon className="size-5 shrink-0 text-brand" />}
                </span>
                <span className="block text-sm text-muted">{nombreLocalidad(a.localidad)}</span>
                <span className="mt-1 block">
                  <OpenNow horarios={a.horarios} conHorario={false} />
                </span>
                <span className="mt-1 block font-bold text-brand">{porAgencia[a.slug] ?? 0} autos disponibles</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
