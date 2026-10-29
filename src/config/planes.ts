/** Planes de suscripción para agencias (precios mensuales en pesos). */
export const planes = [
  {
    codigo: "basico",
    nombre: "Básico",
    precio: 60000,
    limiteAutos: 5,
    destacados: 0,
    items: ["Hasta 5 autos publicados", "Catálogo propio con link y QR", "Consultas directas por WhatsApp", "Vistas y consultas de cada auto en el mes", "Carga inicial del stock bonificada"],
  },
  {
    codigo: "pro",
    nombre: "Pro",
    precio: 80000,
    limiteAutos: null,
    destacados: 12,
    items: [
      "Autos ilimitados",
      "12 autos destacados en la portada y el listado",
      "Catálogo propio con link y QR",
      "Estadísticas completas: historial, de dónde llegan y exportar",
      "Carga inicial del stock bonificada",
    ],
  },
] as const;

export const diasDeGracia = 5;

/* ---------- Particulares (publican gratis) ---------- */

/** Autos publicados o reservados a la vez por particular. */
export const TOPE_PARTICULAR = 2;
/** Días que dura un aviso gratis de particular antes de renovarlo. */
export const DIAS_AVISO_PARTICULAR = 60;
/** Fotos de un aviso gratis (12 con "Aviso completo"). */
export const FOTOS_PARTICULAR = 8;

export type CodigoMejora = "destacado" | "subir" | "completo";

/** Mejoras pagas para particulares. `precio: null` = a definir (marcador). */
export const mejoras: { codigo: CodigoMejora; nombre: string; descripcion: string; dias: number; precio: number | null }[] = [
  { codigo: "destacado", nombre: "Destacado 7 días", descripcion: "Arriba del listado y en la portada, con la etiqueta Destacado.", dias: 7, precio: null },
  { codigo: "subir", nombre: "Subir al principio", descripcion: "Tu aviso vuelve a Recién publicados.", dias: 0, precio: null },
  { codigo: "completo", nombre: "Aviso completo", descripcion: "Hasta 12 fotos y 90 días publicado.", dias: 90, precio: null },
];

/* ---------- Talleres (apartado de mecánicos) ---------- */

/** Suscripción mensual de talleres. `precio: null` = a definir (marcador). */
export const planTaller = {
  nombre: "Taller",
  precio: null as number | null,
  items: [
    "Ficha propia con especialidades, horarios y cómo llegar",
    "Consultas directas por WhatsApp",
    "Aparecés en las fichas de autos usados si hacés revisión precompra",
    "Vistas y consultas del mes",
  ],
};
