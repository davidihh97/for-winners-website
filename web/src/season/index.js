// Temática de temporada: decide cuál toca hoy (calendar.js) y, solo si hay una, carga los efectos (effects.js).
// Control desde el panel: FW_CONTENT.temporada. Para probar: ?fw-season=navidad&fw-variant=1 o ?fw-date=2027-02-14
import { resolve, build, getTheme } from "./calendar.js";

let current = null; // { unmount }
let previewId = null, previewVariant = null;

// window.FW.content es el objeto que fw-content.js actualiza con el borrador del panel.
function conf() { return ((window.FW && window.FW.content) || window.FW_CONTENT || {}).temporada || {}; }

function pickToday() {
  const q = new URLSearchParams(location.search);
  const c = conf();
  const forced = previewId || q.get("fw-season");
  if (forced && getTheme(forced)) {
    const v = previewVariant ?? q.get("fw-variant");
    return build(getTheme(forced), { ...(c.temas || {})[forced], ...(v != null && v !== "" ? { variante: v } : {}) }, { ...c, saludo: c.saludo });
  }
  const d = q.get("fw-date");
  const now = d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10), 12) : new Date();
  return resolve(c, now);
}

async function apply() {
  const res = pickToday();
  const sig = res ? `${res.key}|${res.index}|${res.intensity}|${res.greet}` : "";
  if (current && current.sig === sig) return;
  if (current) { current.unmount(); current = null; }
  if (!res) return;
  const { mount } = await import("./effects.js");
  if (current) current.unmount();
  current = { sig, unmount: mount(res, { edit: document.documentElement.classList.contains("fw-editing") || new URLSearchParams(location.search).get("fw-edit") === "1" }) };
}

export function initSeason() {
  apply();
  // El panel cambió el borrador (sin recargar) o pidió ver una temática.
  addEventListener("fw:content", apply);
  addEventListener("fw:season-preview", e => {
    const d = e.detail || {};
    previewId = d.id || null;
    previewVariant = d.variante ?? null;
    apply();
  });
}
