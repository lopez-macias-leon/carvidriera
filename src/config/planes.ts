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
