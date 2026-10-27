"use client";

import { useAhora } from "@/lib/cliente";
import { estaAbierto, horarioDeHoy } from "@/lib/format";
import type { Horario } from "@/lib/types";

/** "Abierto ahora" calculado en el teléfono (la página puede estar en caché). */
export function OpenNow({ horarios, conHorario = true }: { horarios: Horario; conHorario?: boolean }) {
  const ahora = useAhora();
  if (!ahora) return <span className="text-sm text-muted">&nbsp;</span>;
  const abierto = estaAbierto(horarios, ahora);
  return (
    <span className="text-sm">
      <span className={`font-bold ${abierto ? "text-ok" : "text-danger"}`}>{abierto ? "Abierto ahora" : "Cerrado ahora"}</span>
      {conHorario && <span className="text-muted"> · Hoy: {horarioDeHoy(horarios, ahora)}</span>}
    </span>
  );
}
