"use client";

import { useEffect, useState } from "react";
import { useOrigen } from "@/lib/cliente";
import { compartir } from "@/lib/compartir";
import { registrarEvento } from "@/lib/eventos";
import type { Agencia, Vehiculo } from "@/lib/types";
import { contactoVendedor, linkWhatsApp, mensajeConsulta, urlAviso } from "@/lib/whatsapp";
import { FavoriteButton } from "./favorite-button";
import { ShareIcon, WhatsAppIcon } from "./icons";

/** Registra la vista del aviso una vez cargada la página (los robots no ejecutan JavaScript). */
export function TrackView({ id, tipo = "vista" }: { id: string; tipo?: "vista" | "vista_catalogo" }) {
  useEffect(() => {
    if (localStorage.getItem("cv:soy-agencia")) return;
    registrarEvento(id, tipo);
  }, [id, tipo]);
  return null;
}

export { useOrigen } from "@/lib/cliente";

export function WhatsAppButton({ v, agencia, className = "" }: { v: Vehiculo; agencia: Agencia | null; className?: string }) {
  const origen = useOrigen();
  const href = linkWhatsApp(contactoVendedor(v, agencia).whatsapp, mensajeConsulta(v, agencia, `${urlAviso(v.slug, origen)}?ref=whatsapp`));
  return (
    <a href={href} target="_blank" rel="noopener" onClick={() => registrarEvento(v.codigo, "whatsapp")} className={`btn btn-wa ${className}`}>
      <WhatsAppIcon className="size-5" />
      {v.estado === "reservado" ? "Consultar igual" : "Consultar por WhatsApp"}
    </a>
  );
}

export function ShareButton({ v, titulo, conTexto = false }: { v: Vehiculo; titulo: string; conTexto?: boolean }) {
  const origen = useOrigen();
  const [aviso, setAviso] = useState("");
  const onClick = async () => {
    const r = await compartir({ title: titulo, text: `Mirá este ${titulo} en CarVidriera`, url: urlAviso(v.slug, origen) });
    if (r !== "cancelado") registrarEvento(v.codigo, "compartir");
    if (r === "copiado") {
      setAviso("Link copiado");
      setTimeout(() => setAviso(""), 2500);
    }
  };
  return (
    <>
      <button type="button" onClick={onClick} className={conTexto ? "btn btn-ghost" : "grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface"} aria-label={conTexto ? undefined : "Compartir aviso"}>
        <ShareIcon className="size-5" />
        {conTexto && "Compartir"}
      </button>
      <span role="status" className={`fixed inset-x-0 bottom-24 z-50 mx-auto w-fit rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition ${aviso ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {aviso}
      </span>
    </>
  );
}

/** Barra fija abajo en celular: WhatsApp grande + compartir + favorito. */
export function ContactBar({ v, agencia, titulo }: { v: Vehiculo; agencia: Agencia | null; titulo: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <WhatsAppButton v={v} agencia={agencia} className="min-h-12 flex-1 text-base" />
        <ShareButton v={v} titulo={titulo} />
        <FavoriteButton codigo={v.codigo} titulo={titulo} className="size-12 rounded-xl shadow-none ring-line" />
      </div>
    </div>
  );
}
