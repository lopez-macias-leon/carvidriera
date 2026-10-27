import type { Agencia } from "@/lib/types";

/** Logo de la agencia; sin logo autorizado se muestran sus iniciales. */
export function AgencyAvatar({ agencia, size = "md" }: { agencia: Pick<Agencia, "nombre" | "color">; size?: "sm" | "md" | "lg" }) {
  const iniciales = agencia.nombre
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const tam = { sm: "size-10 text-sm", md: "size-14 text-lg", lg: "size-20 text-2xl" }[size];
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-2xl font-extrabold text-white ${tam}`} style={{ backgroundColor: agencia.color }}>
      {iniciales}
    </span>
  );
}
