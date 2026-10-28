import { startAttempt, gradeAttempt } from "./engine.js";
import { publicCatalog } from "./catalog.js";
import { reportHtml, sendEmail, sendWhatsApp, normalizePhone, summaryLine, waLink, adminHtml } from "./notify.js";
import { ACADEMIC_GUIDE_HTML } from "./guide.js";

const DEFAULT_WA = "593999769785";
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const bad = msg => json({ error: msg }, 400);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

async function api(request, env, ctx, url) {
  const p = url.pathname;
  if (p === "/api/catalog" && request.method === "GET") return json(publicCatalog());

  if (p === "/api/quiz/start" && request.method === "POST") {
    const b = await body(request);
    const seen = Array.isArray(b.seen) ? b.seen.filter(x => typeof x === "string").slice(-3000) : [];
    const sections = Array.isArray(b.sections) ? b.sections.map(String).slice(0, 10) : [];
    const attempt = startAttempt(String(b.quiz), String(b.level), { seen, sections });
    return attempt ? json(attempt) : bad("Simulador no encontrado");
  }

  if (p === "/api/quiz/submit" && request.method === "POST") {
    const b = await body(request);
    if (b.website) return json({ ok: true }); // honeypot anti-bots
    const contact = checkContact(b.contact);
    if (contact.error) return bad(contact.error);
    const answers = Array.isArray(b.answers) ? b.answers.filter(x => x && typeof x.id === "string") : [];
    const result = gradeAttempt(String(b.quiz), String(b.level), answers);
    if (!result) return bad("No hay respuestas válidas");

    const id = crypto.randomUUID();
    const origin = env.SITE_URL || url.origin;
    const reportUrl = `${origin}/informe.html?id=${id}`;
    const waNumber = env.WA_NUMBER || DEFAULT_WA;
    const summary = summaryLine(result);
    const waUrl = waLink(waNumber, result.cta.wa + summary);

    await saveAttempt(env, id, result, contact);
    ctx.waitUntil(deliver(env, id, result, contact, { reportUrl, waUrl, summary }));

    return json({
      id, result, reportUrl, waUrl,
      delivery: { email: Boolean(contact.email && env.RESEND_API_KEY), whatsapp: Boolean(contact.phone && env.WHATSAPP_TOKEN) },
    });
  }

  const m = p.match(/^\/api\/report\/([0-9a-f-]{36})$/);
  if (m && request.method === "GET") {
    if (!env.DB) return json({ error: "No disponible" }, 404);
    const row = await env.DB.prepare("SELECT full_name, result_json, created_at FROM assessments WHERE id = ?").bind(m[1]).first();
    if (!row) return json({ error: "Informe no encontrado" }, 404);
    const result = JSON.parse(row.result_json);
    return json({ name: row.full_name.split(" ")[0], created_at: row.created_at, result, waUrl: waLink(env.WA_NUMBER || DEFAULT_WA, result.cta.wa + summaryLine(result)) });
  }

  if (p === "/api/lead" && request.method === "POST") {
    const b = await body(request);
    if (b.website) return json({ ok: true });
    const contact = checkContact(b);
    if (contact.error) return bad(contact.error);
    const service = String(b.service || "Asesoría académica").slice(0, 80);
    const message = String(b.message || "").slice(0, 1000);
    if (env.DB) {
      try {
        await env.DB.prepare("INSERT INTO inquiries (full_name, email, phone, interested_course, message) VALUES (?, ?, ?, ?, ?)")
          .bind(contact.name, contact.email || null, contact.phone || null, service, message || null).run();
      } catch (e) { console.error("lead db", e); }
    }
    ctx.waitUntil((async () => {
      if (b.guide && contact.email) await sendEmail(env, { to: contact.email, subject: "Tu guía de redacción académica · For Winners", html: ACADEMIC_GUIDE_HTML(contact.name, waLink(env.WA_NUMBER || DEFAULT_WA, "Hola For Winners, recibí la guía y quiero una asesoría académica.")) });
      if (env.ADMIN_EMAIL) await sendEmail(env, { to: env.ADMIN_EMAIL, subject: `Nuevo contacto: ${service}`, html: adminHtml({ Nombre: contact.name, Correo: contact.email, Teléfono: contact.phone, Servicio: service, Mensaje: message }, contact.phone ? `<p><a href="${waLink(contact.phone, `Hola ${contact.name}, te escribimos de For Winners.`)}">Escribirle por WhatsApp</a></p>` : "") });
    })());
    return json({ ok: true, guide: Boolean(b.guide && contact.email && env.RESEND_API_KEY) });
  }

  return json({ error: "No encontrado" }, 404);
}

async function body(request) {
  try {
    const text = await request.text();
    if (text.length > 200000) return {};
    return JSON.parse(text) || {};
  } catch { return {}; }
}

function checkContact(c = {}) {
  const name = String(c.name || "").trim().replace(/\s+/g, " ").slice(0, 80);
  const email = String(c.email || "").trim().toLowerCase().slice(0, 120);
  const phone = normalizePhone(c.phone);
  if (name.length < 2) return { error: "Escribe tu nombre" };
  if (email && !EMAIL_RE.test(email)) return { error: "El correo no es válido" };
  if (c.phone && !phone) return { error: "El teléfono no es válido" };
  if (!email && !phone) return { error: "Escribe tu correo o tu WhatsApp" };
  if (!c.consent) return { error: "Debes aceptar el tratamiento de datos" };
  return { name, email, phone };
}

async function saveAttempt(env, id, result, contact) {
  if (!env.DB) return;
  const score = result.kind === "vocational" ? null : result.pct;
  const note = `${result.title} (${result.label}): ${summaryLine(result)}`;
  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO assessments (id, quiz, level, full_name, email, phone, score_pct, result_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(id, result.quiz, result.level, contact.name, contact.email || null, contact.phone || null, score, JSON.stringify(result)),
      env.DB.prepare("INSERT INTO inquiries (full_name, email, phone, interested_course, message) VALUES (?, ?, ?, ?, ?)")
        .bind(contact.name, contact.email || null, contact.phone || null, result.cta.service, note),
    ]);
  } catch (e) { console.error("save attempt", e); }
}

async function deliver(env, id, result, contact, { reportUrl, waUrl, summary }) {
  const html = reportHtml(result, { name: contact.name, reportUrl: env.DB ? reportUrl : "", waUrl });
  const [emailStatus, waStatus] = await Promise.all([
    sendEmail(env, { to: contact.email, subject: `${contact.name.split(" ")[0]}, tu informe: ${result.title}`, html }),
    sendWhatsApp(env, { phone: contact.phone, name: contact.name.split(" ")[0], title: result.title, summary, url: reportUrl }),
  ]);
  if (env.ADMIN_EMAIL) {
    await sendEmail(env, {
      to: env.ADMIN_EMAIL, subject: `Lead ${result.cta.service}: ${contact.name} · ${summary}`,
      html: adminHtml({ Nombre: contact.name, Correo: contact.email, WhatsApp: contact.phone, Prueba: `${result.title} · ${result.label}`, Resultado: summary, "Prioridades": (result.weak || []).join(", ") },
        `${contact.phone ? `<p><a href="${waLink(contact.phone, `Hola ${contact.name.split(" ")[0]}, te escribimos de For Winners por tu resultado en ${result.title}.`)}">Escribirle por WhatsApp</a></p>` : ""}<p><a href="${reportUrl}">Ver informe</a></p>`),
    });
  }
  if (env.DB) {
    try { await env.DB.prepare("UPDATE assessments SET email_status = ?, whatsapp_status = ? WHERE id = ?").bind(emailStatus, waStatus, id).run(); } catch (e) { console.error(e); }
  }
}

