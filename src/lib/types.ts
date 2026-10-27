export type Moneda = "ARS" | "USD";
export type Tipo = "auto" | "camioneta" | "suv" | "utilitario";
export type Condicion = "0km" | "usado";
export type Combustible = "nafta" | "diesel" | "gnc" | "nafta_gnc" | "hibrido" | "electrico";
export type Caja = "manual" | "automatica";
export type EstadoVehiculo = "borrador" | "publicado" | "reservado" | "pausado" | "vendido";
/** Silueta usada en las ilustraciones de la demo. */
export type Carroceria = "sedan" | "hatch" | "pickup" | "suv" | "furgon";

export type Localidad = { slug: string; nombre: string };

export type Horario = { dias: number[]; desde: string; hasta: string }[];

export type Agencia = {
  slug: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  localidad: string;
  /** Formato internacional sin "+". Vacío en la demo: WhatsApp deja elegir el contacto. */
  whatsapp: string;
  instagram?: string;
  horarios: Horario;
  verificada: boolean;
  plan: "basico" | "pro";
  color: string;
  lat?: number;
  lng?: number;
};

export type Foto = { src: string; alt?: string };

export type Vehiculo = {
  codigo: string;
  slug: string;
  agencia: string;
  tipo: Tipo;
  carroceria: Carroceria;
  condicion: Condicion;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  km: number;
  combustible: Combustible;
  caja: Caja;
  color: string;
  /** Color de la ilustración (solo demo). */
  colorHex: string;
  puertas?: number;
  precio: number | null;
  moneda: Moneda;
  papelesAlDia: boolean;
  documentacion?: string;
  permuta: boolean;
  financiacion: boolean;
  descripcion: string;
  localidad: string;
  estado: EstadoVehiculo;
  destacado: boolean;
  publicado: string;
  fotos: Foto[];
  /** Cargado desde el panel en este teléfono (demo). */
  local?: boolean;
};
