"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { AgencyAvatar } from "@/components/agency-avatar";
import { CopyLinkButton } from "@/components/copy-link";
import { QrIcon, WhatsAppIcon } from "@/components/icons";
import { AGENCIA_DEMO, useAutosAgencia } from "@/lib/panel";
import { useOrigen } from "@/lib/cliente";
import { linkWhatsApp, urlCatalogo } from "@/lib/whatsapp";

export default function CatalogoPanel() {
  const autos = useAutosAgencia();
  const origen = useOrigen();
  const url = origen ? urlCatalogo(AGENCIA_DEMO.slug, origen) : "";
  const [qr, setQr] = useState("");
  useEffect(() => {
    if (!url) return;
    QRCode.toString(`${url}?ref=qr`, { type: "svg", margin: 1, color: { dark: "#0e1726", light: "#ffffff" } }).then(setQr);
  }, [url]);
  const disponibles = autos?.filter((v) => v.estado === "publicado" || v.estado === "reservado").length ?? 0;

  const descargar = async () => {
    const png = await QRCode.toDataURL(`${url}?ref=qr`, { width: 1024, margin: 2 });
    const a = document.createElement("a");
    a.href = png;
    a.download = `qr-${AGENCIA_DEMO.slug}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Tu catálogo</h1>
        <p className="text-muted">Una página con todo tu stock y sin autos de otras agencias.</p>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-bold">Link de tu catálogo</h2>
        <p className="mt-2 break-all rounded-xl bg-soft px-3 py-2.5 font-mono text-sm">{url || "…"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyLinkButton ruta={`/agencia/${AGENCIA_DEMO.slug}`} />
          <a href={linkWhatsApp("", `Mirá todo nuestro stock acá 👇\n${url}?ref=whatsapp`)} target="_blank" rel="noopener" className="btn btn-wa">
            <WhatsAppIcon className="size-5" /> Compartir por WhatsApp
          </a>
        </div>
        <p className="mt-3 text-sm text-muted">Ideas: ponelo en la bio de Instagram, en tu estado de WhatsApp y en la respuesta automática de WhatsApp Business.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <h2 className="flex items-center gap-2 font-bold">
            <QrIcon className="size-5 text-brand" /> Código QR
          </h2>
          <p className="mt-1 text-sm text-muted">Imprimilo y pegalo en la vidriera o en los autos: escanean y ven todo tu stock.</p>
          <div className="mx-auto mt-4 w-56 rounded-2xl border border-line p-3">
            {qr ? <div aria-label="Código QR del catálogo" role="img" dangerouslySetInnerHTML={{ __html: qr }} /> : <div className="aspect-square" />}
            <p className="mt-2 text-center text-xs font-bold">Escaneá y mirá nuestro stock</p>
          </div>
          <button type="button" onClick={descargar} className="btn btn-ghost mt-4 w-full">
            Descargar QR para imprimir
          </button>
        </section>

        <section className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-bold">Así se ve al compartirlo</h2>
          <p className="mt-1 text-sm text-muted">Vista previa en WhatsApp.</p>
          <div className="mt-4 rounded-2xl bg-[#e7ddd3] p-3">
            <div className="ml-auto max-w-[85%] overflow-hidden rounded-xl bg-[#d9fdd3] shadow-sm">
              <div className="flex items-center gap-3 bg-[#cdeec6] p-3">
                <AgencyAvatar agencia={AGENCIA_DEMO} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{AGENCIA_DEMO.nombre} · {disponibles} autos disponibles</p>
                  <p className="text-xs text-muted">{url.replace(/^https?:\/\//, "").split("/")[0]}</p>
                </div>
              </div>
              <p className="p-3 text-sm">
                Mirá todo nuestro stock acá 👇
                <br />
                <span className="break-all text-[#027eb5]">{url}</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
