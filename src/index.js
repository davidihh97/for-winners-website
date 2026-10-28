import { startAttempt, gradeAttempt } from "./engine.js";
import { publicCatalog, QUIZZES } from "./catalog.js";
import { sendEmail, normalizePhone, summaryLine, waLink, adminHtml } from "./notify.js";
import { checkEmail } from "./email-check.js";

const DEFAULT_WA = "593999769785";
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
// Intentos permitidos por IP: evita que alguien automatice la descarga de los bancos de preguntas.
const LIMITS = { start: [[3600, 15], [86400, 40]], submit: [[3600, 20]], lead: [[3600, 10]], check: [[3600, 60]] };
const bad = msg => json({ error: msg }, 400);
const tooMany = () => json({ error: "Demasiados envíos seguidos. Intenta en unos minutos." }, 429);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    try {
      return await api(request, env, ctx, url);
    } catch (e) {
      console.error(e);
      return json({ error: "Error interno" }, 500);
    }
  },
};

// Crea las tablas si aún no existen (equivale a las migraciones), para que el sitio
// funcione aunque no se hayan aplicado a mano en D1.
let schemaReady = null;
function ensureSchema(env) {
  if (!env.DB) return Promise.resolve();
  schemaReady ||= env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS assessments (id TEXT PRIMARY KEY, quiz TEXT NOT NULL, level TEXT, full_name TEXT NOT NULL, email TEXT, phone TEXT, score_pct INTEGER, result_json TEXT NOT NULL, email_status TEXT, whatsapp_status TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_assessments_quiz_date ON assessments(quiz, created_at)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT, phone TEXT, interested_course TEXT, message TEXT, status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS rate_limits (k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0, reset_at INTEGER NOT NULL)"),
  ]).catch(e => { console.error("schema", e); schemaReady = null; });
  return schemaReady;
}

async function api(request, env, ctx, url) {
  const p = url.pathname;
  await ensureSchema(env);
  if (p === "/api/catalog" && request.method === "GET") return json(publicCatalog());

  // Verificación del correo mientras el usuario escribe (formato, dominio con correo y desechables).
  if (p === "/api/check-email" && request.method === "GET") {
    if (await limited(env, request, "check")) return tooMany();
    return json(await checkEmail(url.searchParams.get("e") || ""));
  }

  if (p === "/api/quiz/start" && request.method === "POST") {
    if (await limited(env, request, "start")) return json({ error: "Alcanzaste el límite de simuladores por ahora. Vuelve más tarde o escríbenos por WhatsApp para practicar con un tutor." }, 429);
    const b = await body(request);
    const seen = Array.isArray(b.seen) ? b.seen.filter(x => typeof x === "string").slice(-3000) : [];
    const sections = Array.isArray(b.sections) ? b.sections.map(String).slice(0, 10) : [];
    const attempt = startAttempt(String(b.quiz), String(b.level), { seen, sections });
    return attempt ? json(attempt) : bad("Simulador no encontrado");
  }

  // Inglés y test vocacional: resultado sin datos de contacto (sin revelar respuestas).
  if (p === "/api/quiz/grade" && request.method === "POST") {
    if (await limited(env, request, "submit")) return tooMany();
    const b = await body(request);
    if (QUIZZES[b.quiz]?.flow !== "open") return bad("Este simulador requiere tus datos para ver el resultado");
    const result = gradeAttempt(String(b.quiz), String(b.level), answersOf(b), "summary");
    return result ? json({ result, waUrl: waFor(env, result) }) : bad("No hay respuestas válidas");
  }

  // Diagnóstico y simuladores de admisión: el resultado se muestra después de dejar los datos.
  // Inglés y test vocacional: los datos desbloquean el informe completo en PDF.
  if ((p === "/api/quiz/submit" || p === "/api/quiz/report") && request.method === "POST") {
    if (await limited(env, request, "submit")) return tooMany();
    const b = await body(request);
    if (b.website) return json({ ok: true }); // honeypot anti-bots
    const contact = await checkContact(b.contact);
    if (contact.error) return bad(contact.error);
    const mode = p === "/api/quiz/report" ? "full" : "gate";
    const result = gradeAttempt(String(b.quiz), String(b.level), answersOf(b), mode);
    if (!result) return bad("No hay respuestas válidas");
    const id = crypto.randomUUID();
    await saveAttempt(env, id, result, contact);
    ctx.waitUntil(notifyAdmin(env, result, contact));
    return json({ id, result, waUrl: waFor(env, result), contact: { name: contact.name } });
  }

  if (p === "/api/lead" && request.method === "POST") {
    if (await limited(env, request, "lead")) return tooMany();
    const b = await body(request);
    if (b.website) return json({ ok: true });
    const contact = await checkContact(b);
    if (contact.error) return bad(contact.error);
    const service = String(b.service || "Asesoría académica").slice(0, 80);
    const message = String(b.message || "").slice(0, 1000);
    if (env.DB) {
      try {
        await env.DB.prepare("INSERT INTO inquiries (full_name, email, phone, interested_course, message) VALUES (?, ?, ?, ?, ?)")
          .bind(contact.name, contact.email, contact.phone, service, message || null).run();
      } catch (e) { console.error("lead db", e); }
    }
    if (env.ADMIN_EMAIL) ctx.waitUntil(sendEmail(env, { to: env.ADMIN_EMAIL, subject: `Nuevo contacto: ${service}`, html: adminHtml({ Nombre: contact.name, Correo: contact.email, WhatsApp: contact.phone, Servicio: service, Mensaje: message }, `<p><a href="${waLink(contact.phone, `Hola ${contact.name}, te escribimos de For Winners.`)}">Escribirle por WhatsApp</a></p>`) }));
    return json({ ok: true, name: contact.name });
  }

  return json({ error: "No encontrado" }, 404);
}

const answersOf = b => (Array.isArray(b.answers) ? b.answers.filter(x => x && typeof x.id === "string") : []);
const waFor = (env, result) => waLink(env.WA_NUMBER || DEFAULT_WA, result.cta.wa + summaryLine(result));

async function limited(env, request, action) {
  if (!env.DB) return false;
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const now = Math.floor(Date.now() / 1000);
  try {
    for (const [win, max] of LIMITS[action]) {
      const k = `${action}:${win}:${ip}`;
      const row = await env.DB.prepare(
        "INSERT INTO rate_limits (k, n, reset_at) VALUES (?1, 1, ?2) ON CONFLICT(k) DO UPDATE SET n = CASE WHEN reset_at <= ?3 THEN 1 ELSE n + 1 END, reset_at = CASE WHEN reset_at <= ?3 THEN ?2 ELSE reset_at END RETURNING n"
      ).bind(k, now + win, now).first();
      if (row && row.n > max) return true;
    }
  } catch (e) { console.error("rate limit", e); }
  return false;
}

async function body(request) {
  try {
    const text = await request.text();
    if (text.length > 200000) return {};
    return JSON.parse(text) || {};
  } catch { return {}; }
}

// Nombre y apellido, celular ecuatoriano de 10 dígitos (09…), correo verificable y aceptación de datos.
async function checkContact(c = {}) {
  const name = String(c.name || "").trim().replace(/\s+/g, " ").slice(0, 80);
  const digits = String(c.phone || "").replace(/\D/g, "");
  if (name.split(" ").filter(w => w.length >= 2).length < 2) return { error: "Escribe tu nombre y apellido" };
  if (!/^09\d{8}$/.test(digits)) return { error: "El celular debe tener 10 dígitos y empezar con 09" };
  const mail = await checkEmail(c.email);
  if (!mail.ok) return { error: mail.reason || "El correo no es válido" };
  if (!c.consent) return { error: "Debes aceptar el tratamiento de datos" };
  return { name, email: mail.email, phone: normalizePhone(digits) };
}

async function saveAttempt(env, id, result, contact) {
  if (!env.DB) return;
  const score = result.kind === "vocational" ? null : result.pct;
  const note = `${result.title} (${result.label}): ${summaryLine(result)}`;
  try {
    await env.DB.prepare("INSERT INTO assessments (id, quiz, level, full_name, email, phone, score_pct, result_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, result.quiz, result.level, contact.name, contact.email, contact.phone, score, JSON.stringify(result)).run();
    await env.DB.prepare("INSERT INTO inquiries (full_name, email, phone, interested_course, message) VALUES (?, ?, ?, ?, ?)")
      .bind(contact.name, contact.email, contact.phone, result.cta.service, note).run();
  } catch (e) { console.error("save attempt", e); }
}

// Aviso interno opcional al equipo de For Winners (el estudiante no recibe envíos: descarga su informe).
async function notifyAdmin(env, result, contact) {
  if (!env.ADMIN_EMAIL) return;
  const summary = summaryLine(result);
  await sendEmail(env, {
    to: env.ADMIN_EMAIL, subject: `Lead ${result.cta.service}: ${contact.name} · ${summary}`,
    html: adminHtml({ Nombre: contact.name, Correo: contact.email, WhatsApp: contact.phone, Prueba: `${result.title} · ${result.label}`, Resultado: summary, Prioridades: (result.weak || []).join(", ") },
      `<p><a href="${waLink(contact.phone, `Hola ${contact.name.split(" ")[0]}, te escribimos de For Winners por tu resultado en ${result.title}.`)}">Escribirle por WhatsApp</a></p>`),
  });
}
