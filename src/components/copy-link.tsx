"use client";

import { useState } from "react";
import { portal } from "@/config/portal";
import { CheckIcon, CopyIcon } from "./icons";

/** Copia el link absoluto de una ruta del portal. */
export function CopyLinkButton({ ruta, texto = "Copiar link" }: { ruta: string; texto?: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-brand"
      onClick={async () => {
        const base = portal.siteUrl.includes("[") ? window.location.origin : portal.siteUrl;
        const url = `${base}${ruta}`;
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          window.prompt("Copiá el link:", url);
        }
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      }}
    >
      {copiado ? <CheckIcon className="size-5" /> : <CopyIcon className="size-5" />}
      <span aria-live="polite">{copiado ? "¡Copiado!" : texto}</span>
    </button>
  );
}
