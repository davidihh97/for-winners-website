// Verifica que un correo sea real: formato, que el dominio reciba correo (registro MX vía DNS
// sobre HTTPS de Cloudflare) y que no sea un servicio de correo desechable.
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const COMMON = new Set(["gmail.com", "hotmail.com", "hotmail.es", "outlook.com", "outlook.es", "live.com", "yahoo.com", "yahoo.es", "icloud.com", "me.com", "msn.com", "protonmail.com", "proton.me"]);
const DISPOSABLE = new Set(["mailinator.com", "yopmail.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "temp-mail.org", "trashmail.com", "sharklasers.com", "getnada.com", "maildrop.cc", "dispostable.com", "fakeinbox.com"]);
const TYPOS = { "gmial.com": "gmail.com", "gamil.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.es": "gmail.com", "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.con": "hotmail.com", "hotmail.co": "hotmail.com", "outlok.com": "outlook.com", "outlook.con": "outlook.com", "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com" };
const cache = new Map();

async function domainReceivesMail(domain) {
  if (COMMON.has(domain)) return true;
  if (cache.has(domain)) return cache.get(domain);
  let ok = true; // si el DNS no responde, no se bloquea al usuario
  try {
    const q = async type => {
      const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, { headers: { accept: "application/dns-json" } });
      return r.ok ? r.json() : null;
    };
    const mx = await q("MX");
    if (mx) {
      if (mx.Status === 3) ok = false; // el dominio no existe
      else if (!(mx.Answer || []).some(a => a.type === 15)) { const a = await q("A"); ok = Boolean(a && (a.Answer || []).some(x => x.type === 1)); }
    }
  } catch (e) { console.error("dns", e); }
  cache.set(domain, ok);
  return ok;
}

export async function checkEmail(raw) {
  const email = String(raw || "").trim().toLowerCase().slice(0, 120);
  if (!EMAIL_RE.test(email)) return { ok: false, reason: "Escribe un correo válido" };
  const domain = email.split("@")[1];
  if (TYPOS[domain]) return { ok: false, reason: `¿Quisiste decir ${email.split("@")[0]}@${TYPOS[domain]}?`, suggestion: `${email.split("@")[0]}@${TYPOS[domain]}` };
  if (DISPOSABLE.has(domain)) return { ok: false, reason: "Usa un correo personal, no uno temporal" };
  if (!(await domainReceivesMail(domain))) return { ok: false, reason: "Ese dominio de correo no existe" };
  return { ok: true, email };
}
