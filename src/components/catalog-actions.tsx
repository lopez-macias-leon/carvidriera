"use client";

import { useState } from "react";
import { compartir } from "@/lib/compartir";
import { registrarEvento } from "@/lib/eventos";
import type { Agencia } from "@/lib/types";
import { linkWhatsApp, mensajeCatalogo, urlCatalogo } from "@/lib/whatsapp";
import { useOrigen } from "./contact-bar";
import { PinIcon, ShareIcon, WhatsAppIcon } from "./icons";

export function CatalogActions({ agencia }: { agencia: Agencia }) {
  const origen = useOrigen();
  const [aviso, setAviso] = useState("");
  const link = urlCatalogo(agencia.slug, origen);
  const maps =
    agencia.lat && agencia.lng
      ? `https://www.google.com/maps/search/?api=1&query=${agencia.lat},${agencia.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${agencia.direccion}, Catamarca`)}`;
  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-2">
      <a
        href={linkWhatsApp(agencia.whatsapp, mensajeCatalogo(agencia, link))}
        target="_blank"
        rel="noopener"
        onClick={() => registrarEvento(agencia.slug, "whatsapp")}
        className="btn btn-wa min-h-12"
      >
        <WhatsAppIcon className="size-5" /> WhatsApp
      </a>
      <a href={maps} target="_blank" rel="noopener" className="btn btn-ghost min-h-12" aria-label="Cómo llegar (abre Google Maps)">
        <PinIcon className="size-5" />
        <span className="hidden sm:inline">Cómo llegar</span>
      </a>
      <button
        type="button"
        className="btn btn-ghost min-h-12"
        aria-label="Compartir catálogo"
        onClick={async () => {
          const r = await compartir({ title: agencia.nombre, text: `Mirá el stock de ${agencia.nombre}`, url: `${link}?ref=compartido` });
          if (r === "copiado") {
            setAviso("Link copiado");
            setTimeout(() => setAviso(""), 2500);
          }
        }}
      >
        <ShareIcon className="size-5" />
        <span className="hidden sm:inline">Compartir</span>
      </button>
      <span role="status" className={`fixed inset-x-0 bottom-6 z-50 mx-auto w-fit rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition ${aviso ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {aviso}
      </span>
    </div>
  );
}

/** Mapa de OpenStreetMap que se carga solo al tocar (no frena la página ni necesita clave). */
export function LazyMap({ lat, lng, nombre }: { lat: number; lng: number; nombre: string }) {
  const [ver, setVer] = useState(false);
  const d = 0.006;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
  return ver ? (
    <iframe title={`Mapa de ${nombre}`} src={src} className="aspect-[4/3] w-full rounded-2xl border border-line sm:aspect-video" loading="lazy" />
  ) : (
    <button type="button" onClick={() => setVer(true)} className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-dashed border-line bg-soft font-bold text-brand sm:aspect-video">
      <span className="flex items-center gap-2">
        <PinIcon className="size-5" /> Ver mapa
      </span>
    </button>
  );
}
