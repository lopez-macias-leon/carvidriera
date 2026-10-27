import { CUERPO, FONDOS, oscurecer, VISTAS } from "@/lib/ilustracion";
import type { Carroceria } from "@/lib/types";

/**
 * Ilustración de un vehículo para los datos de demostración (no hay fotos reales de agencias).
 * `vista` cambia encuadre y fondo para simular una galería.
 */
function Rueda({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={174} r={30} fill="#1c2128" />
      <circle cx={cx} cy={174} r={18} fill="#c7ced8" />
      <circle cx={cx} cy={174} r={18} fill="none" stroke="#8b95a3" strokeWidth={2} strokeDasharray="4 5" />
      <circle cx={cx} cy={174} r={5} fill="#7b8592" />
    </g>
  );
}

export function CarIllustration({
  carroceria,
  color,
  vista = 0,
  id,
  className,
  label,
}: {
  carroceria: Carroceria;
  color: string;
  vista?: number;
  id: string;
  className?: string;
  label?: string;
}) {
  const forma = CUERPO[carroceria];
  const [fondoA, fondoB] = FONDOS[vista % FONDOS.length];
  const gid = `g-${id}-${vista}`;
  const flip = vista === 1;
  return (
    <svg
      viewBox={VISTAS[vista % VISTAS.length]}
      preserveAspectRatio={vista % VISTAS.length < 2 ? "xMidYMid meet" : "xMidYMid slice"}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fondoA} />
          <stop offset="1" stopColor={fondoB} />
        </linearGradient>
        <linearGradient id={`${gid}-brillo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
        <linearGradient id={`${gid}-vidrio`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bcd3ea" />
          <stop offset="1" stopColor="#5f7894" />
        </linearGradient>
      </defs>
      <rect x="-200" y="-80" width="800" height="400" fill={`url(#${gid}-bg)`} />
      <rect x="-200" y="196" width="800" height="124" fill="#000" opacity={0.04} />
      <ellipse cx="205" cy="206" rx="186" ry="9" fill="#000" opacity={0.16} />
      <g transform={flip ? "translate(410,0) scale(-1,1)" : undefined}>
        <path d={forma.body} fill={color} stroke={oscurecer(color, 0.55)} strokeWidth={2} />
        <path d={forma.body} fill={`url(#${gid}-brillo)`} />
        {forma.windows.map((w) => (
          <path key={w} d={w} fill={`url(#${gid}-vidrio)`} stroke={oscurecer(color, 0.5)} strokeWidth={1.5} />
        ))}
        {forma.extra && <path d={forma.extra} stroke={oscurecer(color, 0.55)} strokeWidth={2} fill="none" />}
        <path d="M60,150 L370,150" stroke={oscurecer(color, 0.75)} strokeWidth={1.5} opacity={0.6} />
        <rect x="30" y="142" width="18" height="9" rx="4" fill="#fff6d6" stroke="#d8c58a" />
        <rect x="372" y="138" width="10" height="14" rx="3" fill="#d23b3b" />
        <Rueda cx={98} />
        <Rueda cx={298} />
      </g>
    </svg>
  );
}
