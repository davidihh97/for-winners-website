# for-winners-website
Sitio web de For Winners (Cloudflare Workers + archivos estáticos + base de datos D1).

## Páginas
| Página | Qué hace |
|---|---|
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

## Puesta en marcha
```bash
npx wrangler d1 migrations apply for-winners-db --remote   # aplica 0002 y 0003
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
