# Moderación: cómo se frenan las publicaciones troll

Ninguna barrera alcanza sola. Juntas hacen que subir cualquier cosa sea difícil y que, si pasa, dure poco publicado.

| Barrera | Qué frena | En la demo | En producción |
|---|---|---|---|
| Cuenta con email y WhatsApp | Anónimos | Particular de prueba sin login | Login de Supabase |
| Tope de 2 lugares por particular | Inundar el portal | Sí (los avisos en revisión también ocupan lugar) | Control en la base de datos |
| **Primer aviso en revisión** | Cuentas nuevas que suben cualquier cosa | Sí | Igual |
| **Detector de fotos en el teléfono** | Desnudos y contenido sexual | Sí (NSFW.js) | Igual |
| Revisión de fotos en el servidor | Lo que se saltee el teléfono y fotos que no son de autos | No | Etapa 2 |
| **Filtro de texto** | Insultos, teléfonos, links, "escribime al…" | Sí | También en el servidor |
| **Filtro de números** | Precios y kilometrajes absurdos | Sí | También en el servidor |
| **Denuncias** | Lo que se escapa | Sí: 3 denuncias sacan el aviso de los cargados en el teléfono | La base de datos pausa cualquier aviso |
| **Administrador** | Decide | `/admin`: aprobar, rechazar con motivo, bloquear cuenta | Solo entra el administrador |

Las concesionarias y los talleres están verificados con CUIT y publican directo; el detector de fotos y los avisos del formulario corren igual para ellos.

## Cuándo un aviso de particular va a revisión

Al tocar "Publicar", el aviso queda **En revisión** (no se ve en el portal) si pasa alguna de estas cosas:

1. Es el primer aviso de la cuenta. Cuando el administrador aprueba uno, la cuenta queda aprobada y los siguientes salen al instante.
2. Alguna foto no se pudo revisar en el teléfono (el detector no cargó: sin conexión o navegador viejo).
3. El texto tiene lenguaje inapropiado, un teléfono, un link, un email o pide contacto por fuera del portal.
4. El precio o el kilometraje está fuera de lo normal (por ejemplo, US$ 12.000.000 por haber dejado la moneda en dólares).
5. Juntó 3 denuncias abiertas.

Quien publica ve el motivo en "Mis avisos". El formulario avisa del texto mientras escribe, para que lo corrija antes.

Las reglas están en `src/lib/moderacion.ts` y se prueban con `npm run prueba:moderacion`.

## Detector de fotos en el teléfono

- `src/lib/detector-fotos.ts`, con [NSFW.js](https://github.com/infinitered/nsfwjs) y el modelo MobileNetV2 (sin servidor ni costo).
- Rechaza la foto si la suma de "Porn" y "Hentai" llega a 0,5 o si "Sexy" llega a 0,7. Un portal de autos no tiene por qué mostrar nada sugerente.
- El modelo se descarga recién cuando alguien elige fotos (alrededor de 1,3 MB comprimidos) y queda en caché.
- Si no carga, la foto se acepta pero el aviso va a revisión: nunca se publica una foto sin revisar.
- **Límites:** se puede saltear con conocimientos técnicos, no detecta violencia ni fotos que no son de autos, y puede equivocarse. Por eso existen las otras barreras.

## Para producción (pendiente)

1. **Repetir las reglas en el servidor.** Las del navegador se pueden saltear: la función que guarda el aviso vuelve a correr `revisarTexto` y `revisarNumeros`, y la base de datos decide el estado. Un particular no puede ponerse `publicado` a sí mismo.
2. **Revisión de fotos en el servidor** (etapa 2, cuando haya volumen): cada foto nueva pasa por un servicio de visión que responde si tiene contenido inapropiado y **si hay un auto en la foto**. Opciones: Google Cloud Vision, AWS Rekognition o un modelo con visión como Claude. Cobran por imagen; confirmar costos y cuota gratuita al contratar.
3. **Bloqueo real:** bloquear la cuenta también bloquea su email y su teléfono, para que no vuelva con otra.
4. **Aviso al particular** por email cuando su aviso se aprueba o se rechaza.
5. **Registro de decisiones** del administrador (tabla `auditoria`), útil ante reclamos.
6. **Contenido ilegal:** si aparece material de abuso sexual infantil u otro contenido ilegal, no basta con borrarlo; hay que consultar con un abogado cómo conservar la evidencia y denunciarlo ante las autoridades.

## Sanciones

- Primera vez: se rechaza el aviso con el motivo, y la persona puede corregirlo.
- Contenido grave o reincidencia: se bloquea la cuenta.

Están escritas en los términos y condiciones (sección 1.7).
