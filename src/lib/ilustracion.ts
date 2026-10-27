import type { Carroceria } from "./types";

/** Siluetas de las ilustraciones de demostración (viewBox 400×240). */
export const CUERPO: Record<Carroceria, { body: string; windows: string[]; extra?: string }> = {
  sedan: {
    body: "M28,170 C28,150 34,140 60,136 L118,128 L160,92 C168,85 178,82 192,82 L262,82 C276,82 286,86 296,94 L336,128 L366,134 C380,137 386,146 386,160 L386,170 Q386,176 380,176 L336,176 A38,38 0 0,0 260,176 L136,176 A38,38 0 0,0 60,176 L34,176 Q28,176 28,170 Z",
    windows: ["M132,128 L166,98 Q172,92 182,92 L222,92 L222,128 Z", "M232,128 L232,92 L262,92 Q272,92 280,98 L318,128 Z"],
  },
  hatch: {
    body: "M30,170 C30,150 36,140 62,136 L118,128 L158,88 C166,80 176,78 190,78 L300,78 C316,78 326,84 334,96 L354,132 C366,136 372,146 372,158 L372,170 Q372,176 366,176 L336,176 A38,38 0 0,0 260,176 L136,176 A38,38 0 0,0 60,176 L36,176 Q30,176 30,170 Z",
    windows: ["M132,128 L164,96 Q170,88 180,88 L224,88 L224,128 Z", "M234,128 L234,88 L300,88 Q312,88 318,98 L336,128 Z"],
  },
  pickup: {
    body: "M24,166 C24,146 30,136 56,132 L112,124 L140,84 C146,76 154,72 166,72 L226,72 Q236,72 238,82 L240,118 L386,118 L386,170 Q386,176 380,176 L336,176 A38,38 0 0,0 260,176 L136,176 A38,38 0 0,0 60,176 L30,176 Q24,176 24,170 Z",
    windows: ["M122,122 L146,88 Q150,82 158,82 L182,82 L182,122 Z", "M190,122 L190,82 L222,82 Q228,82 228,88 L230,122 Z"],
    extra: "M246,126 L384,126",
  },
  suv: {
    body: "M26,168 C26,148 32,138 58,134 L112,126 L146,80 C152,72 160,68 172,68 L330,68 Q350,68 358,84 L374,124 C382,130 386,140 386,152 L386,170 Q386,176 380,176 L336,176 A38,38 0 0,0 260,176 L136,176 A38,38 0 0,0 60,176 L32,176 Q26,176 26,170 Z",
    windows: [
      "M126,124 L152,86 Q158,78 168,78 L214,78 L214,124 Z",
      "M224,124 L224,78 L282,78 L282,124 Z",
      "M292,124 L292,78 L334,78 Q344,78 348,88 L360,124 Z",
    ],
  },
  furgon: {
    body: "M26,168 C26,148 32,140 56,136 L96,130 L130,72 C136,62 146,58 158,58 L370,58 Q386,58 386,74 L386,170 Q386,176 380,176 L336,176 A38,38 0 0,0 260,176 L136,176 A38,38 0 0,0 60,176 L32,176 Q26,176 26,170 Z",
    windows: ["M108,128 L136,80 Q140,72 150,72 L196,72 L196,128 Z", "M206,128 L206,72 L262,72 L262,128 Z"],
    extra: "M268,72 L268,170",
  },
};

export const FONDOS = [
  ["#dfe8f3", "#f6f8fb"],
  ["#e9e4dc", "#f8f6f2"],
  ["#dde6e3", "#f4f7f6"],
  ["#e6e3ee", "#f7f6fa"],
];

export const VISTAS = ["0 0 400 240", "0 0 400 240", "4 52 236 158", "176 44 224 168"];

/** Oscurece un color hex para contornos y sombras. */
export function oscurecer(hex: string, f = 0.7) {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.round(((n >> s) & 255) * f);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
}

/** La ilustración como texto SVG plano (para la imagen de vista previa al compartir). */
export function svgIlustracion(carroceria: Carroceria, color: string) {
  const f = CUERPO[carroceria];
  const borde = oscurecer(color, 0.55);
  const rueda = (cx: number) =>
    `<circle cx="${cx}" cy="174" r="30" fill="#1c2128"/><circle cx="${cx}" cy="174" r="18" fill="#c7ced8"/><circle cx="${cx}" cy="174" r="5" fill="#7b8592"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 400 280" width="680" height="476">
<rect x="0" y="-20" width="400" height="280" fill="#eaf0f8"/><rect x="0" y="196" width="400" height="64" fill="#dfe6ef"/>
<ellipse cx="205" cy="206" rx="186" ry="9" fill="#000" opacity="0.16"/>
<path d="${f.body}" fill="${color}" stroke="${borde}" stroke-width="2"/>
${f.windows.map((w) => `<path d="${w}" fill="#8fa9c6" stroke="${borde}" stroke-width="1.5"/>`).join("")}
${f.extra ? `<path d="${f.extra}" stroke="${borde}" stroke-width="2" fill="none"/>` : ""}
<rect x="30" y="142" width="18" height="9" rx="4" fill="#fff6d6"/><rect x="372" y="138" width="10" height="14" rx="3" fill="#d23b3b"/>
${rueda(98)}${rueda(298)}</svg>`;
}
