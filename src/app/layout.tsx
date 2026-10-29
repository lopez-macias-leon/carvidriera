import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { SwRegister } from "@/components/sw-register";
import { portal } from "@/config/portal";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: portal.siteUrl.includes("[") ? undefined : new URL(portal.siteUrl),
  title: {
    default: `${portal.name} | Autos usados y 0 km en Catamarca`,
    template: `%s | ${portal.name}`,
  },
  description:
    "Autos usados y 0 km de concesionarias y particulares de Catamarca, y mecánicos de confianza. Buscá gratis y consultá directo por WhatsApp. Vendé tu auto gratis.",
  applicationName: portal.name,
  openGraph: { type: "website", locale: "es_AR", siteName: portal.name },
  robots: portal.demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0b3b75",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${manrope.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
