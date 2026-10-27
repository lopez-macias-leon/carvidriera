import type { Caja, Combustible, Condicion, Localidad, Tipo } from "@/lib/types";

export const localidades: Localidad[] = [
  { slug: "capital", nombre: "San Fernando del Valle de Catamarca" },
  { slug: "valle-viejo", nombre: "Valle Viejo" },
  { slug: "fray-mamerto-esquiu", nombre: "Fray Mamerto Esquiú" },
];

export const tipos: { value: Tipo; label: string; plural: string }[] = [
  { value: "auto", label: "Auto", plural: "Autos" },
  { value: "camioneta", label: "Camioneta / Pick-up", plural: "Camionetas y pick-ups" },
  { value: "suv", label: "SUV", plural: "SUV" },
  { value: "utilitario", label: "Utilitario", plural: "Utilitarios" },
];

export const condiciones: { value: Condicion; label: string }[] = [
  { value: "0km", label: "0 km" },
  { value: "usado", label: "Usado" },
];

export const combustibles: { value: Combustible; label: string }[] = [
  { value: "nafta", label: "Nafta" },
  { value: "diesel", label: "Diésel" },
  { value: "gnc", label: "GNC" },
  { value: "nafta_gnc", label: "Nafta/GNC" },
  { value: "hibrido", label: "Híbrido" },
  { value: "electrico", label: "Eléctrico" },
];

export const cajas: { value: Caja; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "automatica", label: "Automática" },
];

export const colores = ["Blanco", "Gris", "Plata", "Negro", "Rojo", "Azul", "Bordó", "Verde", "Beige", "Marrón", "Naranja"];

export const colorHex: Record<string, string> = {
  Blanco: "#f4f5f7",
  Gris: "#7b8794",
  Plata: "#c3c9d1",
  Negro: "#1f2329",
  Rojo: "#c62828",
  Azul: "#1f4e9c",
  Bordó: "#6d1a2a",
  Verde: "#2e6b4f",
  Beige: "#d8c7a3",
  Marrón: "#6b4a32",
  Naranja: "#e0742b",
};

/** Marcas y modelos (lista cerrada; en producción la administra el admin). */
export const marcas: Record<string, string[]> = {
  Chevrolet: ["Cruze", "Onix", "S10", "Tracker", "Spin"],
  Citroën: ["C3", "C4 Cactus", "Berlingo"],
  Fiat: ["Argo", "Cronos", "Mobi", "Pulse", "Strada", "Toro", "Fiorino"],
  Ford: ["EcoSport", "Ka", "Ranger", "Territory", "Maverick"],
  Honda: ["City", "HR-V", "Civic"],
  Jeep: ["Compass", "Renegade", "Commander"],
  Nissan: ["Frontier", "Kicks", "Versa", "Sentra"],
  Peugeot: ["208", "2008", "308", "3008", "Partner"],
  Renault: ["Alaskan", "Duster", "Kangoo", "Kwid", "Logan", "Sandero", "Stepway", "Oroch"],
  Toyota: ["Corolla", "Corolla Cross", "Etios", "Hilux", "SW4", "Yaris"],
  Volkswagen: ["Amarok", "Gol Trend", "Nivus", "Polo", "Saveiro", "T-Cross", "Taos", "Virtus"],
};

export const frasesDescripcion = [
  "Único dueño",
  "Service oficial al día",
  "Cubiertas nuevas",
  "Llave duplicado",
  "Recibimos usados",
  "VTV vigente",
  "Impecable estado",
];
