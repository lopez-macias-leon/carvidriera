"use client";

import { useState } from "react";

type Punto = { fecha: Date; valor: number };

const fmtDia = (d: Date) => d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });

/** Columnas por día: una sola serie, sin leyenda (el título la nombra), tooltip al pasar o enfocar y tabla accesible. */
export function BarChart({ datos, titulo, unidad }: { datos: Punto[]; titulo: string; unidad: string }) {
  const [activo, setActivo] = useState<number | null>(null);
  const W = 600;
  const H = 160;
  const max = Math.max(1, ...datos.map((d) => d.valor));
  const techo = Math.ceil(max / 5) * 5 || 5;
  const banda = W / datos.length;
  const ancho = Math.min(24, banda - 2);
  const y = (v: number) => H - (v / techo) * H;
  const p = activo !== null ? datos[activo] : null;

  return (
    <figure className="relative">
      <figcaption className="sr-only">{titulo}</figcaption>
      <div className="relative">
        <svg viewBox={`0 -8 ${W} ${H + 28}`} className="w-full overflow-visible" role="img" aria-label={`${titulo}. Máximo ${max} ${unidad} en un día.`} onMouseLeave={() => setActivo(null)}>
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={0} x2={W} y1={y(techo * f)} y2={y(techo * f)} stroke="#e1e6ee" strokeWidth={1} />
              <text x={W} y={y(techo * f) - 4} textAnchor="end" className="fill-muted text-[11px]">
                {Math.round(techo * f)}
              </text>
            </g>
          ))}
          {datos.map((d, i) => {
            const x = i * banda + (banda - ancho) / 2;
            const alto = Math.max(d.valor ? 2 : 0, H - y(d.valor));
            const r = Math.min(4, alto);
            return (
              <g key={i}>
                <path
                  d={`M${x},${H} V${H - alto + r} Q${x},${H - alto} ${x + r},${H - alto} H${x + ancho - r} Q${x + ancho},${H - alto} ${x + ancho},${H - alto + r} V${H} Z`}
                  fill={activo === null || activo === i ? "#2f6bc0" : "#9dbbe3"}
                />
                <rect
                  x={i * banda}
                  y={-8}
                  width={banda}
                  height={H + 8}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${fmtDia(d.fecha)}: ${d.valor} ${unidad}`}
                  onMouseEnter={() => setActivo(i)}
                  onFocus={() => setActivo(i)}
                  onBlur={() => setActivo(null)}
                  onClick={() => setActivo(i)}
                  className="cursor-pointer outline-none"
                />
              </g>
            );
          })}
          <text x={0} y={H + 18} className="fill-muted text-[11px]">
            {fmtDia(datos[0].fecha)}
          </text>
          <text x={W} y={H + 18} textAnchor="end" className="fill-muted text-[11px]">
            Hoy
          </text>
        </svg>
        {p && activo !== null && (
          <div
            role="status"
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow"
            style={{ left: `${((activo + 0.5) / datos.length) * 100}%` }}
          >
            <span className="font-bold">{p.valor}</span> {unidad} · {fmtDia(p.fecha)}
          </div>
        )}
      </div>
      {/* Las tablas no respetan el ancho de 1px de sr-only: se oculta el contenedor. */}
      <div className="sr-only">
      <table>
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th>Día</th>
            <th>{unidad}</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d, i) => (
            <tr key={i}>
              <td>{fmtDia(d.fecha)}</td>
              <td>{d.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}
