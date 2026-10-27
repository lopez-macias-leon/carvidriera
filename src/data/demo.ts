/**
 * DATOS DE DEMOSTRACIÓN. Agencias, autos, precios y estadísticas son ficticios:
 * sirven para mostrar el portal a las agencias. No representan a ningún comercio real.
 */
import type { Agencia, Horario, Vehiculo } from "@/lib/types";
import { colorHex } from "./catalogos";

const horarioComercial: Horario = [
  { dias: [1, 2, 3, 4, 5], desde: "09:00", hasta: "13:00" },
  { dias: [1, 2, 3, 4, 5], desde: "17:00", hasta: "21:00" },
  { dias: [6], desde: "09:00", hasta: "13:00" },
];

export const agenciasDemo: Agencia[] = [
  {
    slug: "automotores-demo",
    nombre: "Automotores Demo",
    descripcion: "Agencia ficticia de demostración. Usados seleccionados y 0 km con financiación.",
    direccion: "Av. Ejemplo 1234",
    localidad: "capital",
    whatsapp: "",
    instagram: "",
    horarios: horarioComercial,
    verificada: true,
    plan: "pro",
    color: "#0b3b75",
    lat: -28.4696,
    lng: -65.7795,
  },
  {
    slug: "valle-demo-motors",
    nombre: "Valle Demo Motors",
    descripcion: "Agencia ficticia de demostración. Especialistas en camionetas y utilitarios.",
    direccion: "Ruta de Ejemplo km 5",
    localidad: "valle-viejo",
    whatsapp: "",
    horarios: [
      { dias: [1, 2, 3, 4, 5], desde: "08:30", hasta: "13:00" },
      { dias: [1, 2, 3, 4, 5], desde: "16:30", hasta: "20:30" },
    ],
    verificada: true,
    plan: "pro",
    color: "#7a2e1f",
    lat: -28.4935,
    lng: -65.7303,
  },
  {
    slug: "esquiu-demo-usados",
    nombre: "Esquiú Demo Usados",
    descripcion: "Agencia ficticia de demostración. Autos económicos, ideales como primer auto.",
    direccion: "Calle de Ejemplo 456",
    localidad: "fray-mamerto-esquiu",
    whatsapp: "",
    horarios: horarioComercial,
    verificada: false,
    plan: "basico",
    color: "#2e6b4f",
    lat: -28.3297,
    lng: -65.7193,
  },
];

type Semilla = Omit<Vehiculo, "slug" | "colorHex" | "fotos" | "estado" | "destacado" | "papelesAlDia" | "permuta" | "financiacion" | "descripcion"> &
  Partial<Pick<Vehiculo, "estado" | "destacado" | "papelesAlDia" | "permuta" | "financiacion" | "descripcion">>;

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function slugVehiculo(v: Pick<Vehiculo, "marca" | "modelo" | "version" | "anio" | "codigo">) {
  return `${slugify(`${v.marca} ${v.modelo} ${v.version} ${v.anio}`)}-${v.codigo}`;
}

const semillas: Semilla[] = [
  { codigo: "h7k2q", agencia: "automotores-demo", tipo: "camioneta", carroceria: "pickup", condicion: "usado", marca: "Toyota", modelo: "Hilux", version: "2.8 SRX 4x4 AT", anio: 2021, km: 68000, combustible: "diesel", caja: "automatica", color: "Blanco", puertas: 4, precio: 38500, moneda: "USD", localidad: "capital", publicado: "2026-10-25", destacado: true, permuta: true, documentacion: "08 firmado, VTV vigente, informe de dominio sin deudas" },
  { codigo: "c3m8p", agencia: "automotores-demo", tipo: "auto", carroceria: "sedan", condicion: "0km", marca: "Fiat", modelo: "Cronos", version: "1.3 Drive", anio: 2026, km: 0, combustible: "nafta", caja: "manual", color: "Gris", puertas: 4, precio: 27900000, moneda: "ARS", localidad: "capital", publicado: "2026-10-24", financiacion: true },
  { codigo: "a9t4w", agencia: "valle-demo-motors", tipo: "camioneta", carroceria: "pickup", condicion: "usado", marca: "Volkswagen", modelo: "Amarok", version: "3.0 V6 Highline", anio: 2020, km: 92000, combustible: "diesel", caja: "automatica", color: "Gris", puertas: 4, precio: 34000, moneda: "USD", localidad: "valle-viejo", publicado: "2026-10-24", destacado: true, permuta: true },
  { codigo: "o2n6r", agencia: "esquiu-demo-usados", tipo: "auto", carroceria: "hatch", condicion: "usado", marca: "Chevrolet", modelo: "Onix", version: "1.4 LT", anio: 2018, km: 81000, combustible: "nafta", caja: "manual", color: "Rojo", puertas: 5, precio: 13800000, moneda: "ARS", localidad: "fray-mamerto-esquiu", publicado: "2026-10-23" },
  { codigo: "t5c1x", agencia: "automotores-demo", tipo: "suv", carroceria: "suv", condicion: "usado", marca: "Volkswagen", modelo: "T-Cross", version: "1.6 Comfortline", anio: 2022, km: 41000, combustible: "nafta", caja: "manual", color: "Azul", puertas: 5, precio: 24500, moneda: "USD", localidad: "capital", publicado: "2026-10-23", destacado: true },
  { codigo: "r8g3z", agencia: "valle-demo-motors", tipo: "camioneta", carroceria: "pickup", condicion: "usado", marca: "Ford", modelo: "Ranger", version: "3.2 XLT 4x4", anio: 2019, km: 110000, combustible: "diesel", caja: "manual", color: "Negro", puertas: 4, precio: null, moneda: "USD", localidad: "valle-viejo", publicado: "2026-10-22", permuta: true },
  { codigo: "g4l9v", agencia: "esquiu-demo-usados", tipo: "auto", carroceria: "hatch", condicion: "usado", marca: "Volkswagen", modelo: "Gol Trend", version: "1.6 Trendline", anio: 2016, km: 124000, combustible: "nafta_gnc", caja: "manual", color: "Plata", puertas: 5, precio: 9900000, moneda: "ARS", localidad: "fray-mamerto-esquiu", publicado: "2026-10-22", estado: "reservado" },
  { codigo: "c7r2d", agencia: "automotores-demo", tipo: "auto", carroceria: "sedan", condicion: "usado", marca: "Toyota", modelo: "Corolla", version: "1.8 XEI CVT", anio: 2020, km: 58000, combustible: "nafta", caja: "automatica", color: "Plata", puertas: 4, precio: 21500, moneda: "USD", localidad: "capital", publicado: "2026-10-21" },
  { codigo: "s1w7k", agencia: "valle-demo-motors", tipo: "camioneta", carroceria: "pickup", condicion: "0km", marca: "Fiat", modelo: "Strada", version: "1.3 Volcano CD", anio: 2026, km: 0, combustible: "nafta", caja: "manual", color: "Blanco", puertas: 4, precio: 29800000, moneda: "ARS", localidad: "valle-viejo", publicado: "2026-10-21", financiacion: true },
  { codigo: "p2u8b", agencia: "automotores-demo", tipo: "auto", carroceria: "hatch", condicion: "usado", marca: "Peugeot", modelo: "208", version: "1.6 Feline", anio: 2021, km: 39000, combustible: "nafta", caja: "manual", color: "Rojo", puertas: 5, precio: 19900000, moneda: "ARS", localidad: "capital", publicado: "2026-10-20" },
  { codigo: "k6f3n", agencia: "valle-demo-motors", tipo: "utilitario", carroceria: "furgon", condicion: "usado", marca: "Renault", modelo: "Kangoo", version: "1.6 Confort 5 asientos", anio: 2019, km: 98000, combustible: "nafta", caja: "manual", color: "Blanco", puertas: 5, precio: 14500000, moneda: "ARS", localidad: "valle-viejo", publicado: "2026-10-19" },
  { codigo: "d3s5m", agencia: "esquiu-demo-usados", tipo: "suv", carroceria: "suv", condicion: "usado", marca: "Renault", modelo: "Duster", version: "1.6 Privilege", anio: 2017, km: 105000, combustible: "nafta", caja: "manual", color: "Marrón", puertas: 5, precio: 15200000, moneda: "ARS", localidad: "fray-mamerto-esquiu", publicado: "2026-10-18", permuta: true },
  { codigo: "e9y1h", agencia: "esquiu-demo-usados", tipo: "auto", carroceria: "sedan", condicion: "usado", marca: "Toyota", modelo: "Etios", version: "1.5 XLS", anio: 2019, km: 76000, combustible: "nafta", caja: "manual", color: "Gris", puertas: 4, precio: 15900000, moneda: "ARS", localidad: "fray-mamerto-esquiu", publicado: "2026-10-17" },
  { codigo: "f4q6j", agencia: "automotores-demo", tipo: "suv", carroceria: "suv", condicion: "0km", marca: "Ford", modelo: "Territory", version: "1.8T Titanium", anio: 2026, km: 0, combustible: "nafta", caja: "automatica", color: "Negro", puertas: 5, precio: 42000, moneda: "USD", localidad: "capital", publicado: "2026-10-16", financiacion: true },
  { codigo: "j2v8c", agencia: "valle-demo-motors", tipo: "suv", carroceria: "suv", condicion: "usado", marca: "Jeep", modelo: "Renegade", version: "1.8 Sport", anio: 2018, km: 88000, combustible: "nafta", caja: "manual", color: "Naranja", puertas: 5, precio: 17500, moneda: "USD", localidad: "valle-viejo", publicado: "2026-10-15" },
  { codigo: "n7b4t", agencia: "automotores-demo", tipo: "camioneta", carroceria: "pickup", condicion: "usado", marca: "Nissan", modelo: "Frontier", version: "2.3 LE 4x4 AT", anio: 2022, km: 52000, combustible: "diesel", caja: "automatica", color: "Bordó", puertas: 4, precio: 36500, moneda: "USD", localidad: "capital", publicado: "2026-10-14", permuta: true },
  { codigo: "y5p9g", agencia: "esquiu-demo-usados", tipo: "auto", carroceria: "sedan", condicion: "usado", marca: "Chevrolet", modelo: "Cruze", version: "1.4T LTZ", anio: 2017, km: 99000, combustible: "nafta", caja: "automatica", color: "Blanco", puertas: 4, precio: null, moneda: "ARS", localidad: "fray-mamerto-esquiu", publicado: "2026-10-12", estado: "vendido" },
  { codigo: "w3a7e", agencia: "valle-demo-motors", tipo: "auto", carroceria: "hatch", condicion: "usado", marca: "Renault", modelo: "Sandero", version: "1.6 Stepway", anio: 2020, km: 63000, combustible: "nafta", caja: "manual", color: "Azul", puertas: 5, precio: 16800000, moneda: "ARS", localidad: "valle-viejo", publicado: "2026-10-11" },
];

const descripcionBase = (s: Semilla) =>
  s.condicion === "0km"
    ? `${s.marca} ${s.modelo} ${s.version} 0 km. Entrega inmediata sujeta a disponibilidad. Consultá por planes de financiación y toma de usados.`
    : `${s.marca} ${s.modelo} ${s.version} ${s.anio}, ${s.km.toLocaleString("es-AR")} km. Muy buen estado general, service al día. Se puede ver en la agencia en horario comercial.`;

export const vehiculosDemo: Vehiculo[] = semillas.map((s) => ({
  estado: "publicado",
  destacado: false,
  papelesAlDia: true,
  permuta: false,
  financiacion: false,
  descripcion: descripcionBase(s),
  ...s,
  slug: slugVehiculo(s),
  colorHex: colorHex[s.color] ?? "#7b8794",
  fotos: [],
}));

/** Estadísticas de ejemplo del panel (ficticias, para la demo). */
export const estadisticasDemo: Record<string, { vistas: number; whatsapp: number; compartidos: number }> = {
  h7k2q: { vistas: 412, whatsapp: 31, compartidos: 12 },
  c3m8p: { vistas: 268, whatsapp: 17, compartidos: 5 },
  t5c1x: { vistas: 305, whatsapp: 22, compartidos: 9 },
  c7r2d: { vistas: 190, whatsapp: 11, compartidos: 3 },
  p2u8b: { vistas: 154, whatsapp: 9, compartidos: 4 },
  f4q6j: { vistas: 221, whatsapp: 14, compartidos: 6 },
  n7b4t: { vistas: 98, whatsapp: 4, compartidos: 1 },
};
