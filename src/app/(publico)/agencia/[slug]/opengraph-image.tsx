import { ImageResponse } from "next/og";
import { getAgencia, getAgencias, getStockAgencia } from "@/lib/catalog";
import { nombreLocalidad } from "@/lib/format";
import { MarcaOg, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Catálogo de la agencia en CarVidriera";

export async function generateStaticParams() {
  return (await getAgencias()).map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const agencia = await getAgencia((await params).slug);
  const stock = agencia ? await getStockAgencia(agencia.slug) : [];
  const iniciales = (agencia?.nombre ?? "CV")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", height: 200, background: `linear-gradient(120deg, ${agencia?.color ?? "#0b3b75"}, #0e1726)` }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "0 64px", marginTop: -90, flex: 1 }}>
          <div style={{ display: "flex", width: 180, height: 180, borderRadius: 36, background: agencia?.color ?? "#0b3b75", border: "10px solid white", color: "white", fontSize: 72, fontWeight: 800, alignItems: "center", justifyContent: "center" }}>
            {iniciales}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#0e1726", marginTop: 20 }}>{agencia?.nombre ?? "Agencia"}</div>
          <div style={{ display: "flex", fontSize: 34, color: "#4f5d70", marginTop: 8 }}>
            {`${stock.length} autos disponibles · ${agencia ? nombreLocalidad(agencia.localidad) : "Catamarca"}`}
          </div>
        </div>
        <div style={{ display: "flex", padding: "0 64px 40px" }}>
          <MarcaOg />
        </div>
      </div>
    ),
    size,
  );
}
