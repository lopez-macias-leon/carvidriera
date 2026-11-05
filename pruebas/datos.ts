/** Coherencia del catálogo de marcas y modelos. Uso: npm run prueba:datos */
import { marcas, modelosPopulares } from "../src/data/catalogos";
import { vehiculosDemo } from "../src/data/demo";

let fallas = 0;
const ok = (cond: boolean, msg: string) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) fallas++;
};

for (const [marca, populares] of Object.entries(modelosPopulares)) {
  const faltan = populares.filter((m) => !marcas[marca]?.includes(m));
  ok(!faltan.length, `Populares de ${marca} existen en el catálogo${faltan.length ? `: faltan ${faltan.join(", ")}` : ""}`);
}

for (const [marca, modelos] of Object.entries(marcas)) {
  ok(new Set(modelos).size === modelos.length, `${marca} sin modelos repetidos`);
}

const fuera = vehiculosDemo.filter((v) => !marcas[v.marca]?.includes(v.modelo)).map((v) => `${v.marca} ${v.modelo}`);
ok(!fuera.length, `Los autos de la demo usan marcas y modelos del catálogo${fuera.length ? `: ${fuera.join(", ")}` : ""}`);

const total = Object.values(marcas).reduce((n, m) => n + m.length, 0);
console.log(`\n${Object.keys(marcas).length} marcas, ${total} modelos`);
process.exit(fallas ? 1 : 0);
