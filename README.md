# for-winners-website
Sitio web de For Winners (Cloudflare Workers + archivos estáticos + base de datos D1).

## Páginas
| Página | Qué hace |
|---|---|
| `diagnostico.html` | Diagnóstico gratuito por nivel (Escuela, Colegio, Universidad) y materias (Matemática, Física, Química, Lengua, Inglés). Lleva a **Nivelación**. |
| `ingles.html#practica` | Práctica de inglés: Grammar, Writing y Reading del A1 al C1. Lleva al **curso de inglés**. |
| `simuladores.html` | Simuladores de razonamiento para UCE, UPEC y Yachay Tech, y por facultad para la UTN. Llevan al **preuniversitario**. |
| `test-vocacional.html` | Test vocacional (modelo RIASEC) con carreras de pregrado del Ecuador. Lleva a **orientación vocacional**. |
| `asesoria.html` | Tips de redacción académica (parte bloqueada) + formulario que envía una guía gratis. Lleva a **asesoría**. |
| `informe.html?id=…` | Informe en línea que se enlaza desde el correo / WhatsApp. |

## Cómo funcionan los simuladores
- Las preguntas se arman en el servidor (`src/`). El navegador **nunca recibe las respuestas**, así que el resultado solo se ve después de dejar nombre + WhatsApp o correo.
- Hay dos tipos de preguntas: **bancos** escritos a mano (`src/banks/`) y **generadores** que crean preguntas nuevas con números y datos al azar (`src/gen/`).
- Para que no se repitan, el navegador recuerda lo que ya vio el usuario (`localStorage`) y el servidor da prioridad a lo no visto. El orden de las preguntas y de las opciones cambia en cada intento.
- Cada resultado se guarda en la tabla `assessments` y como contacto en `inquiries`.

### Ajustar una prueba
En `src/catalog.js`:
- `SIM_SHARE = 0.25` → el simulador muestra el 25 % de la prueba real.
- `uniLevel(…, { questions: 100, minutes: 120 }, …)` → tamaño y duración de la prueba **real** de cada universidad (**verificar con los simuladores oficiales**).
- Los pesos de cada sección (verbal, numérico, etc.) y las materias por facultad de la UTN.

## Puesta en marcha
```bash
npx wrangler d1 migrations apply for-winners-db --remote
npx wrangler deploy
```

### Variables de entorno (Cloudflare → Worker → Settings → Variables)
| Variable | Para qué |
|---|---|
| `WA_NUMBER` | WhatsApp de For Winners (ej. `593999769785`). |
| `SITE_URL` | Dominio público (ej. `https://forwinners.ec`) para los enlaces del informe. |
| `ADMIN_EMAIL` | Correo que recibe cada nuevo contacto con su resultado. |
| `RESEND_API_KEY` (secreto) y `MAIL_FROM` | Envío de correos con [Resend](https://resend.com). `MAIL_FROM` debe ser de un dominio verificado, ej. `For Winners <informes@forwinners.ec>`. |
| `WHATSAPP_TOKEN` (secreto), `WHATSAPP_PHONE_ID`, `WHATSAPP_TEMPLATE`, `WHATSAPP_LANG` | Envío automático por WhatsApp Cloud API (Meta). Requiere una plantilla aprobada con 4 variables: `{{1}}` nombre, `{{2}}` prueba, `{{3}}` resultado, `{{4}}` enlace al informe. |

Sin estas variables el sitio funciona igual: el resultado se muestra en pantalla, se guarda en la base de datos y el botón de WhatsApp abre el chat con For Winners con el resultado ya escrito.

Secretos: `npx wrangler secret put RESEND_API_KEY` y `npx wrangler secret put WHATSAPP_TOKEN`.
