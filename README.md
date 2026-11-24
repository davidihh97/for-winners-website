# for-winners-website
Sitio web de For Winners (Cloudflare Workers + archivos estáticos + base de datos D1).

## Páginas
| Página | Qué hace |
|---|---|
| `index.html` | Portada: fondo animado por servicio (o fotos/videos propios) y **un menú interactivo** con los servicios. Al pasar el mouse (o tocar en celular) se ve la vista previa del servicio con una pregunta de muestra; al hacer clic se entra a su página. |
| `preuniversitario.html` | Presencial en Ibarra (UTN, UCE, UPEC, Yachay) y virtual por módulos (resto). Registro Nacional, proceso de admisión, buscador de las 34 instituciones públicas con ficha completa (examen, temario, fechas, calculadora, módulos del curso) y avisos de fechas por WhatsApp. Enlace directo a una ficha: `preuniversitario.html#u-espe`. |
| `practica.html` | Práctica gratuita por tema (53 temas): repaso corto + 5 preguntas generadas con respuesta y explicación. Solo usa generadores, nunca los bancos protegidos (`src/practice.js`, `/api/practice`). |
| `guias.html` | Guías de admisión: proceso, Registro Nacional, contraseña, Registro Social, tipos de examen, universidades cerca de Ibarra, Medicina, calculadora y puntaje. |
| `computacion.html` | Computación e IA: módulos desplegables y un ejemplo interactivo de uso de la IA. |
| `diagnostico.html` | Diagnóstico gratuito: se elige el nivel (Escuela, Colegio, Universidad) y **una** materia (Matemática, Física, Química o Lengua); 12 preguntas con desglose por temas. Lleva a **Nivelación**. |
| `ingles.html#practica` | Práctica de inglés: primero el nivel (A1–C1) y luego la skill (Grammar, Writing, Reading). El resultado se ve sin datos; con datos se descarga el informe completo con cada error explicado. Lleva al **curso de inglés**. |
| `simuladores.html` | Simuladores de razonamiento para UCE, UPEC y Yachay Tech, y por facultad para la UTN. Llevan al **preuniversitario**. |
| `test-vocacional.html` | Test vocacional en 4 partes (61 preguntas), adaptación orientativa inspirada en **CareerExplorer** (intereses RIASEC, personalidad de cinco factores y valores laborales) y en el modelo **NEFELE** (Life Design y adaptabilidad de carrera de Savickas). Muestra la carrera más recomendada entre 86 de pregrado del Ecuador; con datos se descarga el informe PDF de 5 páginas. |
| `asesoria.html` | Tips de redacción académica (parte bloqueada) + guía gratis en PDF a cambio de los datos. Lleva a **asesoría**. |

## Cómo funcionan los simuladores
- Las preguntas se arman en el servidor (`src/`). El navegador **nunca recibe las respuestas**.
- Diagnóstico y simuladores de admisión: el resultado se ve después de dejar nombre y apellido, celular de 10 dígitos (09…), correo verificado y la aceptación de datos; el botón queda inactivo hasta entonces.
- Inglés y test vocacional: el resultado se ve al instante; los datos desbloquean el informe completo.
- **Los informes se descargan en PDF** (generados en el navegador con jsPDF, `public/js/pdf.js`); no se envían por correo ni WhatsApp.
- Hay dos tipos de preguntas: **bancos** escritos a mano (`src/banks/`) y **generadores** que crean preguntas nuevas con números y datos al azar (`src/gen/`).
- Ejercicios visuales generados: series gráficas (matrices 3×3, sectores, relojes, figuras con dos cambios) y razonamiento espacial (conteo de cubos en vista isométrica, giro y reflejo de figuras, desarrollos de cubo, cubos pintados).
- Bancos de respaldo (`src/banks/extra-*.js`) que se suman automáticamente a cada banco original (`BACKUPS` en `src/catalog.js`).
- Para que no se repitan, el navegador recuerda lo que ya vio el usuario (`localStorage`) y el servidor da prioridad a lo no visto. El orden de las preguntas y de las opciones cambia en cada intento.
- Cada resultado se guarda en la tabla `assessments` y como contacto en `inquiries`.

### Dificultad en los simuladores de admisión (UCE, UPEC, Yachay Tech y UTN)
- Solo hay **preguntas básicas** (Parte 1) y **avanzadas** (Parte 2). Las de dificultad media **no aparecen**.
- Cada sección se reparte mitad básicas y mitad avanzadas; el simulador muestra primero todas las básicas y, tras un aviso, las avanzadas.
- El resultado (pantalla y PDF) incluye «Básicas vs. avanzadas».
- La dificultad de cada fuente está en `src/difficulty.js` (listas `EASY` y `HARD`; lo que no está en ninguna se considera media). Para cambiar una fuente de nivel, muévela de lista.
- El diagnóstico, el inglés y el test vocacional no cambian.

### Vistas previas
`public/js/preview.js` agrega en todas las páginas: preguntas de muestra con corrección al instante (`data-demo`), resultados de ejemplo (`data-mock`), ventanas de vista previa (`data-open` + `<dialog class="sheet">`) y pestañas (`data-tabs`). Las preguntas de muestra son originales y **no** salen de los bancos de los simuladores.

### Universidades, fechas y cursos (`public/js/cronogramas.js`)
- `REVISADO`, `REGISTRO`: fecha de revisión y fechas del Registro Nacional (también en `AVISO`, al final de `public/js/main.js`).
- `UNIS`: una fila por institución (fechas `i`/`e`, tipo `t`, modalidad `m`, ciudad `c`, `med`, `calc`, enlaces oficiales).
- `CURSOS`: qué universidades son presenciales y, cuando existan, precio, inicio y horario de cada modalidad (vacío = «Consultar»).
- Temarios: `public/data/temarios.json` (se carga solo al abrir una ficha).
- Canal de avisos: pega el enlace de tu canal de WhatsApp en `window.CANAL_WA` (inicio de `public/js/main.js`).
- Al publicar las guías, `guias.html` se generó con estos datos: si cambian, actualiza también sus listas.

### Fotos o videos de la portada
Sube los archivos a `public/media/` y escribe su ruta en `MEDIA` al inicio del script de `public/index.html` (ej. `sim: "media/simuladores.mp4"`). Los videos deben ser cortos, sin sonido y livianos (ideal < 4 MB, .mp4). Si no hay archivo, se muestra la ilustración animada del servicio.

### Estructura de cada simulador (25 % de la prueba real)
Tomada de los simuladores de curso de For Winners. **Ninguna pregunta del material de curso está en el sitio**: el contenido web es original y los generadores evitan reproducir los datos de esas preguntas.

| Simulador | Prueba real | Simulador web | Secciones |
|---|---|---|---|
| UCE | 150 preg. · 120 min | 38 preg. · 30 min | Verbal, Numérico, Lógico, Abstracto |
| UPEC | 60 preg. · 60 min | 15 preg. · 15 min | Verbal, Numérico, Lógico, Atención y concentración |
| Yachay Tech | 80 preg. · 90 min | 20 preg. · 23 min | Verbal, Numérico, Lógico, Abstracto + módulo de matemáticas, lectura científica y espacial |
| UTN FICA · FICAYA | 90 preg. · 120 min | 23 preg. · 30 min | Lenguaje, Estadística, Matemática, Física, Química |
| UTN Ciencias de la Salud | 90 preg. · 90 min | 23 preg. · 23 min | Lenguaje, Estadística, Biología, Anatomía, Química |
| UTN FECYT · FACAE | 100 preg. · 120 min (*) | 25 preg. · 30 min | Matemática/estadística/abstracto, Emprendimiento, Verbal |

(*) El simulador de curso no indica tiempo; se asumieron 120 minutos.

### Protección del contenido
- El navegador solo recibe las preguntas del intento actual, nunca el banco completo ni las respuestas.
- Límite por IP: 15 simuladores por hora y 40 por día (tabla `rate_limits`), para impedir la descarga automatizada.
- En el simulador están bloqueados copiar, seleccionar, el clic derecho, arrastrar, imprimir y Ctrl/Cmd + P/S/U; el contenido lleva marca de agua.
- `/api/` no se indexa en buscadores (`robots.txt` y `X-Robots-Tag`).
- Los PDF del material de curso no se suben al repositorio (`.gitignore`).

### Ajustar una prueba
En `src/catalog.js`:
- `SIM_SHARE = 0.25` → el simulador muestra el 25 % de la prueba real.
- `uniLevel(…, { questions: 100, minutes: 120 }, …)` → tamaño y duración de la prueba **real** de cada universidad (**verificar con los simuladores oficiales**).
- Los pesos de cada sección (verbal, numérico, etc.) y las materias por facultad de la UTN.

## Diseño (noviembre de 2026): minimalista con React
- **Vite + React**, con varias páginas: cada ruta sigue siendo su propio `.html` (mismas direcciones, contenido legible por Google y editable desde el panel).
- `web/*.html`: las páginas. `<!--@nav-->` y `<!--@footer-->` se reemplazan al compilar por `web/partials/nav.html` y `footer.html`.
- `web/src/styles/site.css`: todo el diseño (tinta azul marino sobre blanco, líneas finas, fotos en blanco y negro, letra Inter). Las variables `--brand`, `--cta`, `--font-*`, etc. siguen respondiendo al panel.
- `web/src/main.jsx` + `web/src/islands/`: partes animadas con **React Bits** (`web/src/reactbits/`, licencia MIT): `RotatingText` (titular de la portada), `FlowingMenu` (servicios) y `CountUp`. Usan **motion**.
- `public/`: se copia tal cual. El motor de simuladores (`js/quiz.js`), los PDF (`js/pdf.js`), fechas y universidades (`js/cronogramas.js`), vistas previas (`js/preview.js`), práctica (`js/practica.js`), `js/main.js` y `js/fw-content.js` (panel) no cambiaron de funcionamiento.
- Comandos: `npm run dev` (diseño, con recarga al instante; el API se toma de `wrangler dev` en el puerto 8787), `npm run build` (genera `dist/`), `npm run deploy` (compila y publica).

### Fotos (carpeta `public/media/`)
| Archivo | Dónde aparece |
|---|---|
| `portada.jpg` | Portada, foto ancha bajo el titular |
| `preuniversitario.jpg` | Portada (vertical) y Preuniversitario (ancha) |
| `simuladores.jpg`, `test-vocacional.jpg`, `diagnostico.jpg`, `ingles.jpg`, `nivelacion.jpg`, `asesoria.jpg`, `computacion.jpg` | Franja del menú de servicios de la portada |

JPG en blanco y negro (el sitio igual las pasa a escala de grises), **2400 × 1600 px** (3:2), menos de 400 KB cada una. Mientras falte una foto se ve un recuadro gris. También se pueden poner desde el panel (Portada → fotos), que tiene prioridad.

## Panel de administración (admin.forwinnersec.com)
Los textos, botones, imágenes, precios, preguntas frecuentes, testimonios, aviso superior, WhatsApp y SEO se editan desde el panel (repositorio `admin-forwinners`), que usa esta misma base D1.
- `migrations/0004_admin_panel.sql`: tablas del panel (contenido, usuarios, imágenes, notas, pagos a profesores) y columnas nuevas para estudiantes, grupos, pagos e interesados.
- `src/content.js`: inyecta lo publicado en cada página como `window.FW_CONTENT` (y el título/descripción de Google), sirve las imágenes subidas en `/m/<id>` y solo deja que el panel muestre la web dentro de un marco (`frame-ancestors`).
- `public/js/fw-content.js` (va antes de `main.js` en todas las páginas): aplica los cambios de textos, enlaces, imágenes, orden y botones ocultos; agrega las secciones nuevas; y en el modo edición del panel (`?fw-edit=1`) marca lo que se puede editar.
- `main.js`, `cronogramas.js` e `index.html` usan los valores del panel si existen; si no, los de siempre. **Sin contenido publicado, la web se ve exactamente igual.**
- Las páginas pasan por el Worker (`run_worker_first` en `wrangler.jsonc`); css, js e imágenes se sirven directo.
- Lo publicado tarda hasta 30 segundos en verse (caché en memoria del Worker).

## Puesta en marcha
```bash
npx wrangler d1 migrations apply for-winners-db --remote   # aplica 0002, 0003 y 0004
npx wrangler deploy
```

### Variables de entorno (opcionales)
| Variable | Para qué |
|---|---|
| `WA_NUMBER` | WhatsApp de For Winners (ej. `593999769785`). |
| `ADMIN_EMAIL`, `RESEND_API_KEY` (secreto) y `MAIL_FROM` | Aviso interno por correo al equipo de For Winners cada vez que llega un contacto ([Resend](https://resend.com)). Los estudiantes no reciben correos: descargan su informe. |

Sin estas variables el sitio funciona igual: cada contacto queda guardado en la base de datos (tablas `assessments` e `inquiries`).

Secreto: `npx wrangler secret put RESEND_API_KEY`.

## Datos de For Winners
Av. Teodoro Gómez de la Torre 746 y Calixto Miranda, Ibarra, Ecuador · Lunes a sábado, de 9:00 a 20:00 · TikTok e Instagram: @forwinnersec
