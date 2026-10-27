import type { Vehiculo } from "@/lib/types";
import { CarIllustration } from "./car-illustration";

/** Foto del aviso o, en la demo, la ilustración del vehículo. */
export function VehiculoFoto({
  v,
  indice = 0,
  className = "",
  eager = false,
  alt,
}: {
  v: Pick<Vehiculo, "codigo" | "carroceria" | "colorHex" | "fotos">;
  indice?: number;
  className?: string;
  eager?: boolean;
  alt: string;
}) {
  const foto = v.fotos[indice];
  if (foto) {
    // eslint-disable-next-line @next/next/no-img-element -- las fotos ya se suben comprimidas y en su tamaño final
    return <img src={foto.src} alt={foto.alt ?? alt} loading={eager ? "eager" : "lazy"} decoding="async" className={`object-cover ${className}`} />;
  }
  return <CarIllustration carroceria={v.carroceria} color={v.colorHex} vista={indice} id={v.codigo} className={className} label={alt} />;
}

/** Cantidad de imágenes de la galería (las ilustraciones simulan 4 vistas). */
export const cantidadFotos = (v: Pick<Vehiculo, "fotos">) => (v.fotos.length ? v.fotos.length : 4);
