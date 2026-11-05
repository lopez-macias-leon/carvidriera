/** Pruebas de las reglas de moderación de texto y números. Uso: npm run prueba:moderacion */
import { revisarNumeros, revisarTexto } from "../src/lib/moderacion";
const casos: [string, string[]][] = [
  ["Fiat Argo 2019, único dueño. Precio 21.500.000, 68.000 km.", []],
  ["Vehículo impecable, cubiertas nuevas", []],
  ["Llamame al 383 4123456", ["telefono", "contacto"]],
  ["Escribime por wsp 3834-123456", ["telefono", "contacto"]],
  ["Mirá más en www.misautos.com", ["link"]],
  ["Contacto: vendo@gmail.com", ["link"]],
  ["Auto de mierda jaja", ["palabras"]],
  ["Motor 1.6, año 2015, 120000 km", []],
];
let fallas = 0;
for (const [t, esperado] of casos) {
  const r = revisarTexto(t).sort();
  const ok = JSON.stringify(r) === JSON.stringify([...esperado].sort());
  if (!ok) fallas++;
  console.log(ok ? "✓" : "✗", JSON.stringify(t), "→", r.join(", ") || "(ok)");
}
const numeros: [Parameters<typeof revisarNumeros>[0], number][] = [
  [{ precio: 1, moneda: "ARS", km: 10 }, 1],
  [{ precio: 25000, moneda: "USD", km: 900000 }, 1],
  [{ precio: 14000000, moneda: "ARS", km: 80000 }, 0],
  [{ precio: null, moneda: "USD", km: 0 }, 0],
];
for (const [datos, esperado] of numeros) {
  const r = revisarNumeros(datos);
  const ok = r.length === esperado;
  if (!ok) fallas++;
  console.log(ok ? "✓" : "✗", JSON.stringify(datos), "→", r.join(", ") || "(ok)");
}
process.exit(fallas ? 1 : 0);
