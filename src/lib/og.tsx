import { svgIlustracion } from "./ilustracion";
import type { Vehiculo } from "./types";

export const OG_SIZE = { width: 1200, height: 630 };

/** Imagen del auto para la vista previa: la portada o, en la demo, la ilustración como SVG. */
export function imagenAuto(v: Vehiculo) {
  if (v.fotos[0]) return v.fotos[0].src;
  return `data:image/svg+xml;base64,${Buffer.from(svgIlustracion(v.carroceria, v.colorHex)).toString("base64")}`;
}

export function MarcaOg() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 800 }}>
      <div style={{ display: "flex", width: 52, height: 52, borderRadius: 12, background: "#0b3b75" }} />
      <span style={{ color: "#0e1726" }}>Car</span>
      <span style={{ color: "#0b3b75", marginLeft: -14 }}>Vidriera</span>
    </div>
  );
}
