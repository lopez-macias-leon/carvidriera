import type { Caja, Combustible, Condicion, Especialidad, Localidad, Tipo } from "@/lib/types";

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

/**
 * Marcas y modelos que se venden o circulan en Argentina, incluidos usados que ya no se fabrican.
 * Lista cerrada para que los filtros y el SEO no se llenen de variantes ("toyota", "TOYOTA"…).
 * Si falta uno, quien publica lo escribe a mano y el aviso pasa por revisión; el administrador lo suma acá.
 */
export const marcas: Record<string, string[]> = {
  Audi: ["A1", "A3", "A4", "A5", "Q2", "Q3", "Q5", "Q7", "Q8"],
  BMW: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "X1", "X2", "X3", "X4", "X5", "X6"],
  BYD: ["Dolphin", "Dolphin Mini", "Seal", "Song Plus", "Yuan Plus"],
  Chery: ["QQ", "Tiggo 2", "Tiggo 3", "Tiggo 4", "Tiggo 7", "Tiggo 8"],
  Chevrolet: ["Agile", "Astra", "Aveo", "Blazer", "Camaro", "Captiva", "Celta", "Classic", "Cobalt", "Corsa", "Corsa Classic", "Cruze", "Equinox", "Meriva", "Montana", "Onix", "Onix Plus", "Prisma", "S10", "Sonic", "Spark", "Spin", "Tracker", "Trailblazer", "Vectra", "Zafira"],
  Citroën: ["Aircross", "Basalt", "Berlingo", "C3", "C3 Aircross", "C4", "C4 Cactus", "C4 Lounge", "C5 Aircross", "C-Elysée", "Jumper", "Jumpy", "Xsara Picasso"],
  Dodge: ["Journey"],
  DS: ["DS3", "DS7"],
  Fiat: ["500", "Argo", "Cronos", "Doblo", "Ducato", "Duna", "Fastback", "Fiorino", "Grand Siena", "Idea", "Linea", "Mobi", "Palio", "Palio Weekend", "Pulse", "Punto", "Qubo", "Siena", "Strada", "Titano", "Toro", "Uno", "Uno Way"],
  Ford: ["Bronco Sport", "Courier", "EcoSport", "Escape", "Explorer", "F-150", "Fiesta", "Focus", "Ka", "Kuga", "Maverick", "Mondeo", "Mustang", "Ranger", "Territory", "Transit"],
  Haval: ["H6", "Jolion"],
  Honda: ["Accord", "City", "Civic", "CR-V", "Fit", "HR-V", "Pilot", "WR-V", "ZR-V"],
  Hyundai: ["Accent", "Creta", "Elantra", "Grand i10", "H1", "HB20", "i10", "i30", "Kona", "Santa Fe", "Tucson", "Veloster"],
  Iveco: ["Daily"],
  JAC: ["S2", "T6", "T8"],
  Jeep: ["Cherokee", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wrangler"],
  Kia: ["Carnival", "Cerato", "K2500", "Picanto", "Rio", "Seltos", "Sorento", "Soul", "Sportage", "Stonic"],
  "Mercedes-Benz": ["Clase A", "Clase B", "Clase C", "Clase E", "GLA", "GLB", "GLC", "GLE", "Sprinter", "Vito"],
  Mini: ["Cooper", "Countryman"],
  Mitsubishi: ["ASX", "Eclipse Cross", "L200", "Lancer", "Montero", "Outlander"],
  Nissan: ["Frontier", "Kicks", "Leaf", "March", "Note", "Pathfinder", "Sentra", "Tiida", "Versa", "X-Trail"],
  Peugeot: ["206", "207", "207 Compact", "208", "2008", "3008", "301", "307", "308", "408", "5008", "508", "Boxer", "Expert", "Partner", "Rifter"],
  RAM: ["1000", "1500", "2500", "Rampage"],
  Renault: ["Alaskan", "Arkana", "Captur", "Clio", "Duster", "Duster Oroch", "Fluence", "Kangoo", "Kardian", "Koleos", "Kwid", "Logan", "Master", "Megane", "Oroch", "Sandero", "Sandero Stepway", "Scenic", "Stepway", "Symbol", "Trafic", "Twingo"],
  Subaru: ["Forester", "Outback", "XV"],
  Suzuki: ["Fun", "Grand Vitara", "Jimny", "Swift", "Vitara"],
  Toyota: ["86", "Camry", "C-HR", "Corolla", "Corolla Cross", "Etios", "Hiace", "Hilux", "Land Cruiser", "Prius", "RAV4", "SW4", "Yaris", "Yaris Cross"],
  Volkswagen: ["Amarok", "Bora", "Crossfox", "Fox", "Gol", "Gol Trend", "Golf", "Nivus", "Passat", "Polo", "Saveiro", "Scirocco", "Sharan", "Suran", "T-Cross", "Taos", "Tiguan", "Tiguan Allspace", "Touareg", "Transporter", "Up!", "Vento", "Virtus", "Voyage"],
  Volvo: ["XC40", "XC60", "XC90"],
};

/** Modelos más vendidos de cada marca: se muestran primero en el formulario de carga. */
export const modelosPopulares: Record<string, string[]> = {
  Chevrolet: ["Onix", "Cruze", "Tracker", "S10", "Corsa", "Prisma", "Agile", "Spin"],
  Citroën: ["C3", "C4 Cactus", "Berlingo", "C4 Lounge"],
  Fiat: ["Cronos", "Argo", "Strada", "Toro", "Palio", "Mobi", "Siena", "Uno"],
  Ford: ["Ranger", "EcoSport", "Ka", "Fiesta", "Focus", "Territory", "Maverick"],
  Honda: ["HR-V", "City", "Civic", "CR-V", "Fit"],
  Hyundai: ["Creta", "Tucson", "HB20", "i10"],
  Jeep: ["Renegade", "Compass", "Commander"],
  Nissan: ["Frontier", "Kicks", "Versa", "March", "Sentra"],
  Peugeot: ["208", "2008", "308", "207", "206", "3008", "Partner"],
  Renault: ["Sandero", "Stepway", "Duster", "Kangoo", "Logan", "Kwid", "Clio", "Oroch"],
  Toyota: ["Hilux", "Corolla", "Etios", "Yaris", "SW4", "Corolla Cross"],
  Volkswagen: ["Amarok", "Gol Trend", "Gol", "T-Cross", "Polo", "Virtus", "Taos", "Suran"],
};

export const especialidades: { value: Especialidad; label: string }[] = [
  { value: "mecanica", label: "Mecánica general" },
  { value: "service", label: "Service" },
  { value: "precompra", label: "Revisión precompra" },
  { value: "electricidad", label: "Electricidad" },
  { value: "inyeccion", label: "Inyección" },
  { value: "diesel", label: "Diésel" },
  { value: "chapa_pintura", label: "Chapa y pintura" },
  { value: "gomeria", label: "Gomería" },
  { value: "tren_delantero", label: "Tren delantero" },
  { value: "aire", label: "Aire acondicionado" },
];

export const frasesDescripcion = [
  "Único dueño",
  "Service oficial al día",
  "Cubiertas nuevas",
  "Llave duplicado",
  "Recibimos usados",
  "VTV vigente",
  "Impecable estado",
];
