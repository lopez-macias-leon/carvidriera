import { ImageResponse } from "next/og";
import { getAgencia, getTodosLosVehiculos, getVehiculo } from "@/lib/catalog";
import { formatKm, formatPrecio, labelCombustible } from "@/lib/format";
import { imagenAuto, MarcaOg, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Auto publicado en CarVidriera";

export async function generateStaticParams() {
  return (await getTodosLosVehiculos()).map((v) => ({ slug: v.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const v = await getVehiculo((await params).slug);
  if (!v) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
          <MarcaOg />
        </div>
      ),
      size,
    );
  }
  const agencia = await getAgencia(v.agencia);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", width: 680, height: "100%", background: "#eaf0f8", alignItems: "center", justifyContent: "center" }}>
          <img src={imagenAuto(v)} width={680} height={630} style={{ objectFit: "cover" }} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "48px 44px" }}>
          <MarcaOg />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: "#0e1726", lineHeight: 1.05 }}>
              {`${v.marca} ${v.modelo}`}
            </div>
            <div style={{ fontSize: 28, color: "#4f5d70", marginTop: 10 }}>
              {`${v.version} · ${v.anio}`}
            </div>
            <div style={{ fontSize: 60, fontWeight: 800, color: "#0b3b75", marginTop: 26 }}>{formatPrecio(v.precio, v.moneda)}</div>
            <div style={{ fontSize: 28, color: "#0e1726", marginTop: 12 }}>
              {`${formatKm(v.km)} · ${labelCombustible(v.combustible)}`}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#4f5d70" }}>{agencia ? `${agencia.nombre} · Catamarca` : "Catamarca"}</div>
        </div>
      </div>
    ),
    size,
  );
}
