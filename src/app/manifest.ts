import type { MetadataRoute } from "next";
import { portal } from "@/config/portal";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${portal.name} · ${portal.tagline}`,
    short_name: portal.name,
    description: "Autos usados y 0 km de agencias de Catamarca. Consultá directo por WhatsApp.",
    lang: "es-AR",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7fa",
    theme_color: "#0b3b75",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Ver autos", url: "/autos" },
      { name: "Panel de agencia", url: "/panel" },
    ],
  };
}
