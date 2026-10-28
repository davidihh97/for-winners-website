// Avisos internos por correo (Resend) al equipo de For Winners. Si faltan las variables de
// entorno, el envío se omite sin romper el flujo. Los estudiantes no reciben envíos: descargan su informe.

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const BRAND = "#0B2A5B";

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
  if (r.kind === "vocational") return `Perfil ${r.code} · carrera sugerida: ${r.top.name}`;
  return `${r.correct}/${r.total} (${r.pct} %) · ${r.band}`;
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

export function adminHtml(lead, extra = "") {
  const rows = Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6E6E73">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join("");
  return `<div style="font:14px Arial,sans-serif"><h2 style="color:${BRAND}">Nuevo contacto desde la web</h2><table>${rows}</table>${extra}</div>`;
}
