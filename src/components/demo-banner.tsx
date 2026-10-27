import { portal } from "@/config/portal";

export function DemoBanner() {
  if (!portal.demo) return null;
  return (
    <div className="bg-ink px-4 py-1.5 text-center text-xs font-semibold text-white">
      DEMO · Agencias, autos y precios ficticios, solo para mostrar el portal
    </div>
  );
}
