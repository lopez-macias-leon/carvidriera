/**
 * Datos del portal. Todo lo que está entre corchetes es un marcador
 * que hay que reemplazar por el dato real antes de publicar.
 */
export const portal = {
  name: "CarVidriera",
  tagline: "Autos usados y 0 km de Catamarca",
  siteUrl: "https://[dominio].com.ar",
  city: "San Fernando del Valle de Catamarca",
  province: "Catamarca",
  /** WhatsApp del administrador en formato internacional, sin "+" ni espacios (ej. 5493834000000). */
  whatsapp: "",
  email: "[EMAIL]",
  /** Modo demostración: datos ficticios y panel sin login. */
  demo: true,
} as const;

export const isSet = (value: string) => value.length > 0 && !value.includes("[");
