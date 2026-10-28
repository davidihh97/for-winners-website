// Envío del informe por correo (Resend) y por WhatsApp (WhatsApp Cloud API de Meta).
// Si faltan las variables de entorno, el envío se omite sin romper el flujo.

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const BRAND = "#0B2A5B", ACCENT = "#F5B921";

export function waLink(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Ecuador: 0991234567 → 593991234567
export function normalizePhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 && d.startsWith("0")) d = "593" + d.slice(1);
  else if (d.length === 9 && d.startsWith("9")) d = "593" + d;
  return d.length >= 10 && d.length <= 15 ? d : "";
}

export function summaryLine(r) {
  if (r.kind === "vocational") return `Perfil ${r.code}: ${r.profile.slice(0, 2).map(p => p.name).join(" + ")}`;
  return `${r.correct}/${r.total} (${r.pct} %) · ${r.band}`;
}

function bar(label, pct, note) {
  const color = pct >= 80 ? "#1F9D55" : pct >= 50 ? ACCENT : "#D64545";
  return `<tr><td style="padding:8px 0">
    <div style="font:600 14px Arial,sans-serif;color:#1D1D1F">${esc(label)} <span style="float:right;color:#6E6E73;font-weight:400">${pct} %${note ? " · " + esc(note) : ""}</span></div>
    <div style="height:10px;background:#E8E8ED;border-radius:6px;margin-top:6px"><div style="height:10px;width:${Math.max(3, pct)}%;background:${color};border-radius:6px"></div></div>
  </td></tr>`;
}

export function reportHtml(r, { name, reportUrl, waUrl }) {
  const first = esc(String(name).split(" ")[0]);
  let body;
  if (r.kind === "vocational") {
    body = `
      <p style="font:16px/1.5 Arial,sans-serif;color:#1D1D1F;margin:0 0 6px">Tu código vocacional es</p>
      <div style="font:700 44px Arial,sans-serif;color:${BRAND};letter-spacing:4px">${esc(r.code)}</div>
      <p style="font:15px/1.5 Arial,sans-serif;color:#6E6E73">${esc(r.message)}</p>
      <table width="100%" cellpadding="0" cellspacing="0">${r.profile.slice(0, 3).map(p => bar(p.name, p.pct)).join("")}</table>
      <h3 style="font:700 18px Arial,sans-serif;color:#1D1D1F;margin:24px 0 8px">Carreras afines a tu perfil</h3>
      ${r.careers.map((c, i) => `<div style="border:1px solid #E8E8ED;border-radius:12px;padding:12px 16px;margin:8px 0;font:15px Arial,sans-serif"><b>${i + 1}. ${esc(c.name)}</b><span style="float:right;color:#1F9D55">${c.fit} % afinidad</span><br><span style="color:#6E6E73;font-size:13px">${esc(c.area)}</span></div>`).join("")}
      <div style="border:2px dashed ${ACCENT};border-radius:12px;padding:16px;margin:16px 0;font:15px/1.5 Arial,sans-serif;color:#1D1D1F;text-align:center">
        🔒 <b>+${r.locked} carreras compatibles</b>, universidades donde se ofertan y tu plan de preparación están en tu <b>informe completo</b>.
      </div>`;
  } else {
    body = `
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font:700 52px Arial,sans-serif;color:${BRAND}">${r.pct}<span style="font-size:24px">%</span></td>
        <td style="text-align:right;font:14px Arial,sans-serif;color:#6E6E73">${r.correct} de ${r.total} correctas<br><span style="display:inline-block;margin-top:6px;background:${BRAND};color:#fff;border-radius:20px;padding:4px 12px;font-weight:700">${esc(r.band)}</span></td>
      </tr></table>
      <p style="font:15px/1.5 Arial,sans-serif;color:#1D1D1F">${esc(r.message)}</p>
      <table width="100%" cellpadding="0" cellspacing="0">${r.sections.map(s => bar(s.name, s.pct, s.advice)).join("")}</table>
      ${r.review.length ? `<h3 style="font:700 18px Arial,sans-serif;color:#1D1D1F;margin:24px 0 8px">Revisemos ${r.review.length === 1 ? "un error" : "dos errores"}</h3>` : ""}
      ${r.review.map(x => `<div style="background:#F5F5F7;border-radius:12px;padding:14px 16px;margin:8px 0;font:14px/1.5 Arial,sans-serif;color:#1D1D1F"><b>${esc(x.prompt)}</b><br>Tu respuesta: <span style="color:#D64545">${esc(x.yours)}</span><br>Correcta: <span style="color:#1F9D55">${esc(x.correct)}</span>${x.explain ? `<br><span style="color:#6E6E73">${esc(x.explain)}</span>` : ""}</div>`).join("")}
      ${r.locked ? `<div style="border:2px dashed ${ACCENT};border-radius:12px;padding:16px;margin:16px 0;font:15px/1.5 Arial,sans-serif;color:#1D1D1F;text-align:center">🔒 Tienes <b>${r.locked} errores más</b> con su explicación paso a paso. Los revisamos contigo en tu primera clase.</div>` : ""}
      ${r.real ? `<p style="font:13px/1.5 Arial,sans-serif;color:#6E6E73">Este simulador tiene el 25 % de las preguntas de la prueba real. En el curso practicas con simulacros completos y cronometrados.</p>` : ""}`;
  }
  return `<!doctype html><html><body style="margin:0;background:#F5F5F7;padding:24px 12px">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden">
    <tr><td style="background:${BRAND};padding:24px 28px;color:#fff;font:700 20px Arial,sans-serif">For <span style="color:${ACCENT}">Winners</span>
      <div style="font:400 14px Arial,sans-serif;color:#D6E2FA;margin-top:6px">${esc(r.title)} · ${esc(r.label)}</div></td></tr>
    <tr><td style="padding:28px">
      <p style="font:18px Arial,sans-serif;color:#1D1D1F;margin:0 0 16px">Hola ${first}, este es tu informe 👇</p>
      ${body}
      <div style="text-align:center;margin:28px 0 8px">
        <a href="${esc(waUrl)}" style="display:inline-block;background:${ACCENT};color:#2B2000;font:700 16px Arial,sans-serif;padding:14px 28px;border-radius:40px;text-decoration:none">${esc(r.cta.text)}</a>
      </div>
      ${reportUrl ? `<p style="text-align:center;font:13px Arial,sans-serif"><a href="${esc(reportUrl)}" style="color:${BRAND}">Ver mi informe en línea</a></p>` : ""}
    </td></tr>
    <tr><td style="background:#F5F5F7;padding:16px 28px;font:12px Arial,sans-serif;color:#6E6E73">For Winners · Centro de tutorías e inglés · Ibarra, Ecuador<br>Recibiste este correo porque completaste un simulador en nuestro sitio.</td></tr>
  </table></body></html>`;
}

export async function sendEmail(env, { to, subject, html, replyTo }) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM || !to) return "skipped";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    return res.ok ? "sent" : `error ${res.status}`;
  } catch (e) {
    return "error";
  }
}

// Requiere una plantilla aprobada en Meta con 4 variables: {{1}} nombre, {{2}} prueba, {{3}} resultado, {{4}} enlace.
export async function sendWhatsApp(env, { phone, name, title, summary, url }) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_ID || !env.WHATSAPP_TEMPLATE || !phone) return "skipped";
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp", to: phone, type: "template",
        template: {
          name: env.WHATSAPP_TEMPLATE, language: { code: env.WHATSAPP_LANG || "es" },
          components: [{ type: "body", parameters: [name, title, summary, url].map(text => ({ type: "text", text: String(text).slice(0, 200) })) }],
        },
      }),
    });
    return res.ok ? "sent" : `error ${res.status}`;
  } catch (e) {
    return "error";
  }
}

export function adminHtml(lead, extra = "") {
  const rows = Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6E6E73">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join("");
  return `<div style="font:14px Arial,sans-serif"><h2 style="color:${BRAND}">Nuevo contacto desde la web</h2><table>${rows}</table>${extra}</div>`;
}
