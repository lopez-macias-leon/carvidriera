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

export type TipoVendedor = "agencia" | "particular";

/** Persona que publica su propio auto (gratis, hasta 2 a la vez). */
export type Particular = {
  id: string;
  /** Nombre visible: nombre y la inicial del apellido. */
  nombre: string;
  /** Formato internacional sin "+". Vacío en la demo. */
  whatsapp: string;
  localidad: string;
};

export type Especialidad =
  | "mecanica"
  | "service"
  | "electricidad"
  | "inyeccion"
  | "diesel"
  | "chapa_pintura"
  | "gomeria"
  | "tren_delantero"
  | "aire"
  | "precompra";

/** Taller mecánico del apartado de mecánicos (suscripción mensual). */
export type Taller = {
  slug: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  localidad: string;
  whatsapp: string;
  horarios: Horario;
  especialidades: Especialidad[];
  verificado: boolean;
  color: string;
  lat?: number;
  lng?: number;
};

export type Vehiculo = {
  codigo: string;
  slug: string;
  vendedor: TipoVendedor;
  /** Slug de la agencia; vacío si vende un particular. */
  agencia: string;
  /** Datos del particular, si vende un particular. */
  particular?: Particular;
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
  /** Fin del destacado pago de un particular (ISO). */
  destacadoHasta?: string;
  publicado: string;
  /** Vencimiento del aviso de particular (ISO). */
  vence?: string;
  /** Particular con la mejora "Aviso completo" (12 fotos y 90 días). */
  completo?: boolean;
  fotos: Foto[];
  /** Cargado desde el panel en este teléfono (demo). */
  local?: boolean;
};
