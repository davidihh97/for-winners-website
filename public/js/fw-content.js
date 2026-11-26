/* ===== CONTENIDO EDITABLE DESDE EL PANEL (admin.forwinnersec.com) =====
   El servidor (src/index.js) inyecta el contenido publicado en window.FW_CONTENT.
   Este script, que va antes de main.js en cada página:
   1. Aplica los cambios de textos, enlaces, imágenes, botones ocultos y orden hechos en el panel.
   2. Agrega las secciones nuevas creadas en el panel.
   3. En modo edición (?fw-edit=1 dentro del panel) muestra qué se puede editar y recibe el borrador.
   Si el panel no tiene nada guardado, la página se ve exactamente igual que antes. */
(function () {
  "use strict";
  const ADMIN_ORIGINS = ["https://admin.forwinnersec.com", "http://localhost:5173", "http://localhost:8788", "http://localhost:4173"];
  const qs = new URLSearchParams(location.search);
  const EDIT = qs.get("fw-edit") === "1" && window.parent !== window;
  const KEY = "fw-draft";
  if (EDIT) {
    try {
      const d = sessionStorage.getItem(KEY);
      if (d) window.FW_CONTENT = JSON.parse(d);
    } catch (e) { /* sin almacenamiento: se usa lo publicado */ }
  }
  const C = window.FW_CONTENT || {};
  const PAGE = (location.pathname.split("/").pop() || "index.html").replace(/^$/, "index.html").replace(/^([^.]+)$/, "$1.html");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const lite = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
  const okUrl = u => /^(https?:\/\/|\/|#|[\w-]+\.html|mailto:|tel:|m\/|img\/|media\/)/i.test(String(u || "").trim());
  const norm = s => String(s || "").replace(/\s+/g, " ").trim();
  window.FW = { content: C, page: PAGE, esc, lite };

  // Zonas que se generan con datos (se editan con formularios del panel, no a mano).
  const PANELS = [
    ["#menu, #preview, .svc-preview", "portada"], [".bgs", "portada"], ['[data-island="HeroRandom"]', "portada"], [".fw-season, .fw-ribbon", "temporada"],
    ["#nivel-plans", "nivelacion"], ["#faq-pre", "faq"], ["#testi, #resultados", "testimonios"],
    ["#chips, #panel", "unis"], [".notice", "aviso"], [".wa", "contacto"],
    ["#registro, #cronogramas, .uni-sheet, [data-crono]", "cursos"],
  ];
  const panelOf = el => { for (const [sel, id] of PANELS) if (el.closest(sel)) return id; return null; };

  /* ---------- selector estable para un elemento ---------- */
  function selectorOf(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      if (el.dataset.fwClone) { parts.unshift(`[data-fw-clone="${el.dataset.fwClone}"]`); return parts.join(">"); }
      if (el.id && !/^fw-/.test(el.id)) { parts.unshift("#" + CSS.escape(el.id)); break; }
      let i = 1, s = el;
      // Si algo se movió de lugar, se usa la posición original (los cambios se guardan sobre la página original).
      if (el.dataset.fwI) i = +el.dataset.fwI;
      else while ((s = s.previousElementSibling)) if (s.tagName === el.tagName && !s.dataset.fwClone && !s.dataset.fwSec) i++;
      parts.unshift(`${el.tagName.toLowerCase()}:nth-of-type(${i})`);
      el = el.parentElement;
    }
    if (el === document.body) parts.unshift("body");
    return parts.join(">");
  }

  // Busca un elemento por su selector aunque algo se haya movido (usa la posición original guardada).
  function findSel(sel) {
    if (!document.querySelector("[data-fw-stamped]")) { try { return document.querySelector(sel); } catch (e) { return null; } }
    let cur = null;
    for (const part of String(sel).split(">")) {
      let m;
      if (part === "body") cur = document.body;
      else if (part[0] === "#") { try { cur = document.querySelector(part); } catch (e) { return null; } }
      else if ((m = /^\[data-fw-clone="([\w-]+)"\]$/.exec(part))) cur = document.querySelector(`[data-fw-clone="${m[1]}"]`);
      else if ((m = /^([a-z0-9]+):nth-of-type\((\d+)\)$/.exec(part)) && cur) {
        const tag = m[1].toUpperCase(), n = +m[2];
        let i = 0, hit = null;
        for (const c of cur.children) {
          if (c.tagName !== tag || c.dataset.fwClone || c.dataset.fwSec) continue;
          i++;
          if ((c.dataset.fwI ? +c.dataset.fwI : i) === n) { hit = c; break; }
        }
        cur = hit;
      } else return null;
      if (!cur) return null;
    }
    return cur;
  }

  /* ---------- texto: respeta íconos y formato ---------- */
  const INLINE = new Set(["EM", "B", "STRONG", "I", "BR", "SMALL", "SPAN"]);
  const ownText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  // Elementos armados con partes (p. ej. un enlace con <b>título</b><span>detalle</span>):
  // se edita cada parte por separado para no perder el diseño.
  const structured = el => !ownText(el) && [...el.children].filter(c => c.tagName !== "BR").length >= 2
    && [...el.children].every(c => INLINE.has(c.tagName) && !c.children.length);
  const simple = el => !structured(el) && [...el.children].every(c => INLINE.has(c.tagName) && !c.children.length);
  function setText(el, text) {
    if (simple(el)) { el.innerHTML = lite(text); return; }
    const nodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    const big = nodes.sort((a, b) => b.textContent.length - a.textContent.length)[0];
    if (big) big.textContent = " " + text + " ";
  }

  /* ---------- estilos permitidos (todo valor se valida: no se acepta CSS libre) ---------- */
  const okColor = v => /^#[0-9a-f]{3,8}$/i.test(String(v || ""));
  const num = (v, lo, hi) => { const n = Number(v); return v !== "" && v != null && Number.isFinite(n) && n >= lo && n <= hi ? n : null; };
  const STYLE = {
    size: ["font-size", v => { const n = num(v, 8, 160); return n == null ? null : n > 22 ? `clamp(${Math.round(n * 0.62)}px, ${(n / 14.4).toFixed(2)}vw, ${n}px)` : `${n}px`; }],
    color: ["color", v => (okColor(v) ? v : null)],
    bg: ["background-color", v => (okColor(v) ? v : null)],
    weight: ["font-weight", v => (["400", "500", "600", "700", "800", "900"].includes(String(v)) ? String(v) : null)],
    italic: ["font-style", v => (v === true || v === "true" ? "italic" : v === false || v === "false" ? "normal" : null)],
    align: ["text-align", v => (["left", "center", "right"].includes(v) ? v : null)],
    transform: ["text-transform", v => (["none", "uppercase"].includes(v) ? v : null)],
    mt: ["margin-top", v => { const n = num(v, -40, 240); return n == null ? null : `${n}px`; }],
    mb: ["margin-bottom", v => { const n = num(v, -40, 240); return n == null ? null : `${n}px`; }],
    pad: ["padding", v => { const n = num(v, 0, 80); return n == null ? null : `${n}px`; }],
    radius: ["border-radius", v => { const n = num(v, 0, 80); return n == null ? null : `${n}px`; }],
    width: ["max-width", v => { const n = num(v, 10, 100); return n == null ? null : `${n}%`; }],
    spacing: ["letter-spacing", v => { const n = num(v, -3, 12); return n == null ? null : `${n}px`; }],
    lh: ["line-height", v => { const n = num(v, 0.8, 3); return n == null ? null : String(n); }],
  };
  const baseCss = document.createElement("style");
  baseCss.textContent = '@media(max-width:760px){[data-fw-only="desktop"]{display:none!important}}@media(min-width:761px){[data-fw-only="mobile"]{display:none!important}}';
  document.head.append(baseCss);

  /* ---------- colores y letras de toda la web ---------- */
  const FONTS = { Inter: "sans-serif", Poppins: "sans-serif", Montserrat: "sans-serif", Nunito: "sans-serif", "DM Sans": "sans-serif", Raleway: "sans-serif", "Playfair Display": "serif", Lora: "serif", Merriweather: "serif" };
  function applyTheme() {
    const t = C.theme || {};
    let st = document.getElementById("fw-theme");
    if (!st) { st = document.createElement("style"); st.id = "fw-theme"; document.head.append(st); }
    const v = [], dark = [];
    if (okColor(t.primary)) v.push(`--brand:${t.primary};--cta:${t.primary};--primary-hover:${t.primary}`);
    if (okColor(t.secondary)) v.push(`--primary:${t.secondary};--cta-hover:${t.secondary}`);
    if (okColor(t.highlight)) v.push(`--hero-em:${t.highlight};--primary-2:${t.highlight}`);
    if (okColor(t.gold)) {
      v.push(`--gold:${t.gold};--gold-2:color-mix(in srgb,${t.gold} 55%,#fff)`);
      dark.push(`--cta:${t.gold};--cta-hover:color-mix(in srgb,${t.gold} 55%,#fff)`);
    }
    const links = [];
    for (const [key, vars] of [["headFont", ["--font-head", "--font-display"]], ["bodyFont", ["--font-body"]]]) {
      const f = t[key];
      if (!FONTS[f]) continue;
      for (const name of vars) v.push(`${name}:"${f}",system-ui,${FONTS[f]}`);
      links.push(f);
    }
    const size = num(t.baseSize, 14, 22);
    st.textContent = `:root{${v.join(";")}}${dark.length ? `.dark,.big,.home{${dark.join(";")}}` : ""}${size ? `body{font-size:${size}px}` : ""}`;
    document.querySelectorAll("link[data-fw-font]").forEach(l => l.remove());
    for (const f of links) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.dataset.fwFont = "";
      l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,800;1,900&display=swap`;
      document.head.append(l);
    }
  }

  /* ---------- aplicar cambios a la página ---------- */
  const originals = new Map(); // elemento → estado original (para el modo edición)
  function remember(el) {
    if (!originals.has(el)) originals.set(el, { html: el.innerHTML, href: el.getAttribute("href"), src: el.getAttribute("src"), style: el.getAttribute("style"), cls: el.className, parent: el.parentNode, next: el.nextSibling });
  }
  function revertAll() {
    document.querySelectorAll("video[data-fw-video], [data-fw-clone]").forEach(v => v.remove());
    for (const [el, o] of originals) {
      el.innerHTML = o.html;
      o.href == null ? el.removeAttribute("href") : el.setAttribute("href", o.href);
      if (o.src != null) el.setAttribute("src", o.src);
      o.style == null ? el.removeAttribute("style") : el.setAttribute("style", o.style);
      el.className = o.cls;
      el.removeAttribute("data-fw-only");
      if (o.parent && el.parentNode === o.parent) o.parent.insertBefore(el, o.next && o.next.parentNode === o.parent ? o.next : null);
    }
    originals.clear();
  }

  // Si en lugar de una foto se elige un video, se muestra el video en su lugar (la foto queda oculta).
  const isVideo = u => /\.(mp4|webm|mov)(\?|$)/i.test(String(u || ""));
  function showVideo(img, src) {
    const v = document.createElement("video");
    Object.assign(v, { src, autoplay: true, muted: true, loop: true, playsInline: true });
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.dataset.fwVideo = "";
    v.className = img.className;
    v.setAttribute("aria-label", img.getAttribute("alt") || "");
    v.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
    img.style.setProperty("display", "none", "important");
    img.after(v);
  }
  window.FW.isVideo = isVideo;

  const broken = [];
  // Bloques (secciones, tarjetas, listas): se reconocen por su primer título, porque parte de su contenido se arma después.
  const headOf = el => norm((el.querySelector("h1,h2,h3,h4,b,strong") || {}).textContent || "").slice(0, 80);
  // Los bloques grandes guardan solo el comienzo de su texto (200 letras) para reconocerlos.
  const sameText = (el, orig) => { const t = norm(el.textContent), o = norm(orig); return o.length >= 200 ? t.startsWith(o) : t === o; };
  function applyOverrides() {
    const list = (C.overrides && C.overrides[PAGE]) || [];
    broken.length = 0;
    document.querySelectorAll("[data-fw-sec]").forEach(n => n.remove()); // renderSections las vuelve a poner
    const q = sel => { try { return document.querySelector(sel); } catch (e) { return null; } };
    // Elementos agregados con «Duplicar»: copia del original, al final de los de su tipo (no mueve a los demás).
    for (const o of list) {
      const src = (o.clones || []).length && q(o.sel);
      if (!src || !src.parentNode) continue;
      for (const id of o.clones) {
        if (!/^[\w-]{1,40}$/.test(id) || document.querySelector(`[data-fw-clone="${id}"]`)) continue;
        const c = src.cloneNode(true);
        [c, ...c.querySelectorAll("*")].forEach(n => { [...n.attributes].forEach(a => { if (a.name === "id" || a.name.startsWith("data-fw-")) n.removeAttribute(a.name); }); });
        c.style.removeProperty("display");
        c.dataset.fwClone = id;
        const same = [...src.parentNode.children].filter(x => x.tagName === src.tagName);
        same[same.length - 1].after(c);
      }
    }
    const found = list.map(o => {
      const el = q(o.sel);
      if (!el || (o.orig && !sameText(el, o.orig) && !originals.has(el)) || (o.head && headOf(el) !== o.head)) { broken.push(o.sel); return null; }
      return [o, el];
    }).filter(Boolean);
    for (const [o, el] of found) {
      remember(el);
      if (o.text != null && o.text !== "") setText(el, o.text);
      if (o.href && el.tagName === "A" && okUrl(o.href)) { el.setAttribute("href", o.href); if (/^https?:/.test(o.href)) { el.target = "_blank"; el.rel = "noopener"; } }
      if (o.src && el.tagName === "IMG" && okUrl(o.src)) {
        if (isVideo(o.src)) showVideo(el, o.src);
        else { el.setAttribute("src", o.src); el.removeAttribute("srcset"); }
      }
      for (const [k, val] of Object.entries(o.style || {})) {
        const def = STYLE[k];
        const css = def && def[1](val);
        if (css) el.style.setProperty(def[0], css, "important");
      }
      if (o.variant && el.classList.contains("btn")) el.classList.toggle("o", o.variant === "outline");
      if (o.show === "desktop" || o.show === "mobile") el.setAttribute("data-fw-only", o.show);
      if (o.hidden) el.style.setProperty("display", "none", "important");
    }
    // Cambios de orden al final, cuando todos los selectores ya se resolvieron.
    // Antes, cada hermano guarda su posición original para que los selectores sigan apuntando bien.
    for (const [o, el] of found) {
      if (o.pos == null || !el.parentNode || el.parentNode.dataset.fwStamped) continue;
      el.parentNode.dataset.fwStamped = "";
      const n = {};
      for (const c of el.parentNode.children) {
        if (c.dataset.fwClone || c.dataset.fwSec) continue;
        n[c.tagName] = (n[c.tagName] || 0) + 1;
        c.dataset.fwI = n[c.tagName];
      }
    }
    for (const [o, el] of found) {
      if (o.pos == null || !el.parentNode) continue;
      const sibs = [...el.parentNode.children].filter(x => x !== el);
      const ref = sibs[Math.max(0, Math.min(o.pos, sibs.length))] || null;
      el.parentNode.insertBefore(el, ref);
    }
  }

  /* ---------- secciones nuevas ---------- */
  const btns = (list = []) => list.filter(b => b.label).length
    ? `<div class="row">${list.filter(b => b.label).map(b => `<a class="btn ${b.style === "outline" ? "o" : ""} ${b.style === "whatsapp" ? "wal" : ""}" href="${okUrl(b.url) ? esc(b.url) : "#"}"${/^https?:/.test(b.url || "") ? ' target="_blank" rel="noopener"' : ""}>${esc(b.label)}</a>`).join("")}</div>` : "";
  const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const RENDER = {
    hero: s => `<div class="wrap c">${s.kicker ? `<p class="eyebrow">${esc(s.kicker)}</p>` : ""}<h2>${lite(s.title)}</h2>${s.subtitle ? `<p class="lead">${lite(s.subtitle)}</p>` : ""}${btns(s.buttons)}${s.image ? `<img src="${esc(s.image)}" alt="${esc(s.imageAlt || s.title)}" style="margin-top:36px;border-radius:var(--r-card);max-width:100%">` : ""}</div>`,
    features: s => `<div class="wrap"><div class="c"><h2>${lite(s.title)}</h2>${s.subtitle ? `<p class="lead">${lite(s.subtitle)}</p>` : ""}</div><div class="g g3">${(s.items || []).map(i => `<div class="card">${i.icon ? `<span style="font-size:30px">${esc(i.icon)}</span>` : ""}<h3>${esc(i.title)}</h3><p>${lite(i.text)}</p></div>`).join("")}</div>${btns(s.buttons)}</div>`,
    text: s => `<div class="wrap"><div class="g g2" style="margin-top:0;align-items:center">${s.image && s.imageSide === "left" ? `<img src="${esc(s.image)}" alt="" style="border-radius:var(--r-card);max-width:100%">` : ""}<div><h2>${lite(s.title)}</h2>${s.subtitle ? `<p class="lead" style="margin-left:0">${lite(s.subtitle)}</p>` : ""}${s.body ? `<p style="margin-top:18px">${lite(s.body)}</p>` : ""}${btns(s.buttons).replace('class="row"', 'class="row" style="justify-content:flex-start"')}</div>${s.image && s.imageSide !== "left" ? `<img src="${esc(s.image)}" alt="" style="border-radius:var(--r-card);max-width:100%">` : ""}</div></div>`,
    cta: s => `<div class="wrap c"><h2>${lite(s.title)}</h2>${s.subtitle || s.body ? `<p class="lead">${lite(s.subtitle || s.body)}</p>` : ""}${btns(s.buttons)}</div>`,
    faq: s => `<div class="wrap"><h2 class="c">${lite(s.title)}</h2><div style="margin-top:40px">${(s.items || []).map(i => `<details><summary>${esc(i.title)}</summary><p>${lite(i.text)}</p></details>`).join("")}</div></div>`,
    courses: s => {
      const list = ((C.public && C.public.courses) || []).filter(c => !(s.courseIds || []).length || s.courseIds.includes(c.id));
      return `<div class="wrap"><div class="c"><h2>${lite(s.title)}</h2>${s.subtitle ? `<p class="lead">${lite(s.subtitle)}</p>` : ""}</div><div class="g g3">${list.map(c => `<div class="card"><p style="font-size:13px;font-weight:600;color:var(--gold-text)">${esc(c.group || "")}</p><h3>${esc(c.name)}</h3><p>${esc(String(c.hours).replace(".", ","))} horas · ${esc(c.weeks)} semanas</p>${c.format ? `<p>${esc(c.format)}</p>` : ""}${s.showPrices !== false && c.price ? `<div class="px" style="font-size:28px;font-weight:700;color:var(--brand)">$${esc(c.price)}</div>` : ""}</div>`).join("")}</div>${btns(s.buttons)}</div>`;
    },
    schedule: s => {
      const rows = ((C.public && C.public.schedule) || []).filter(b => !(s.categoryIds || []).length || s.categoryIds.includes(b.categoryId))
        .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.start.localeCompare(b.start));
      return `<div class="wrap"><h2 class="c">${lite(s.title)}</h2>${s.subtitle ? `<p class="lead c">${lite(s.subtitle)}</p>` : ""}<div class="g-table g3"><div><span>Día</span><span>Clase</span><span>Horario</span></div>${rows.map(b => `<div><span>${esc(b.day)}</span><span>${esc(b.service)}</span><span>${esc(b.start)} – ${esc(b.end)}</span></div>`).join("")}</div>${btns(s.buttons)}</div>`;
    },
  };
  function renderSections() {
    document.querySelectorAll("[data-fw-sec]").forEach(n => n.remove());
    const main = document.querySelector("main");
    if (!main) return;
    const secs = (C.sections || []).filter(s => (s.page || "index.html") === PAGE && (s.visible || EDIT));
    for (const s of secs) {
      if (!RENDER[s.type]) continue;
      const el = document.createElement("section");
      el.className = { alt: "alt", dark: "dark" }[s.bg] || "";
      el.dataset.fwSec = s.id;
      if (s.anchor) el.id = s.anchor;
      if (!s.visible) el.style.opacity = ".35";
      if (s.show === "desktop" || s.show === "mobile") el.setAttribute("data-fw-only", s.show);
      el.innerHTML = RENDER[s.type](s);
      const first = main.querySelector(":scope > section");
      if (s.position === "top" && first) first.after(el);
      else main.append(el);
    }
  }

  applyTheme();
  applyOverrides();
  renderSections();

  /* ---------- modo edición (solo dentro del panel) ---------- */
  const hex = c => { const m = String(c).match(/\d+(\.\d+)?/g); if (!m || (m.length > 3 && +m[3] === 0)) return ""; return "#" + m.slice(0, 3).map(x => (+x).toString(16).padStart(2, "0")).join(""); };
  if (!EDIT) return;
  let admin = null;
  const CAND = "h1,h2,h3,h4,h5,p,li,a,button,summary,label,img,small,figcaption,.eyebrow,.tag";
  const style = document.createElement("style");
  style.textContent = `[data-fw-hover]{outline:2px dashed #2E6BD1!important;outline-offset:3px;cursor:pointer!important}
  [data-fw-sel]{outline:3px solid #C9A13B!important;outline-offset:3px}
  [data-fw-panel-hover]{outline:2px dashed #C9A13B!important;outline-offset:4px;cursor:pointer!important}
  [data-fw-inline]{outline:3px solid #2E6BD1!important;outline-offset:3px;cursor:text!important;background:rgba(46,107,209,.06)}
  .fw-edit-badge{position:fixed;right:12px;bottom:12px;z-index:9999;background:#0B2A5B;color:#fff;font:600 12px Inter,sans-serif;padding:6px 10px;border-radius:999px;opacity:.85;pointer-events:none}`;
  document.head.append(style);
  const badge = document.createElement("div");
  badge.className = "fw-edit-badge"; badge.textContent = "Modo edición · clic para elegir · doble clic para escribir";
  document.body.append(badge);

  const post = msg => admin && window.parent.postMessage(msg, admin);
  const target = e => {
    const sec = e.target.closest("[data-fw-sec]");
    if (sec) return { el: sec, kind: "section" };
    const panel = panelOf(e.target);
    if (panel) return { el: e.target.closest(PANELS.find(([, id]) => id === panel)[0]) || e.target, kind: "panel", panel };
    let el = (e.target.matches("video[data-fw-video]") && e.target.previousElementSibling) || e.target.closest(CAND);
    if (el && el !== e.target && e.target.parentElement === el && structured(el)) el = e.target;
    return el && el.closest("main, nav, header, footer, body") ? { el, kind: "el" } : null;
  };
  let hovered = null;
  document.addEventListener("mouseover", e => {
    const t = target(e);
    if (hovered) { hovered.removeAttribute("data-fw-hover"); hovered.removeAttribute("data-fw-panel-hover"); }
    hovered = t && t.el;
    if (hovered) hovered.setAttribute(t.kind === "el" ? "data-fw-hover" : "data-fw-panel-hover", "");
  });
  // Abrir el menú del celular y los submenús sí funciona al editar (para llegar a sus textos).
  const PASS = ".burger, .sub-toggle";
  const BLOCKS = "main, nav, header, footer, body, html";
  let editing = null;
  document.addEventListener("click", e => {
    if (e.target.closest(PASS)) return;
    if (editing && editing.contains(e.target)) { e.preventDefault(); return; }
    const t = target(e);
    e.preventDefault(); e.stopPropagation();
    if (!t) return;
    select(t);
  }, true);
  function select(t) {
    document.querySelectorAll("[data-fw-sel]").forEach(x => x.removeAttribute("data-fw-sel"));
    t.el.setAttribute("data-fw-sel", "");
    if (t.kind === "section") return post({ fwPick: { section: t.el.dataset.fwSec } });
    if (t.kind === "panel") return post({ fwPick: { panel: t.panel } });
    post({ fwPick: pickOf(t.el) });
  }
  const canInline = el => el.tagName !== "IMG" && !structured(el) && simple(el);
  function origOf(el) {
    const o = originals.get(el);
    const tmp = document.createElement("div"); tmp.innerHTML = o ? o.html : el.innerHTML;
    tmp.querySelectorAll("[data-fw-clone]").forEach(n => n.remove());
    return norm(tmp.textContent);
  }
  function pickOf(el) {
    const textEditable = el.tagName !== "IMG" && !structured(el) && (simple(el) || ownText(el));
    const orig = origOf(el);
    const sameTag = el.parentNode ? [...el.parentNode.children].filter(x => x.tagName === el.tagName && !x.dataset.fwClone).length : 1;
    const up = el.parentElement && !el.parentElement.matches(BLOCKS) && !el.dataset.fwClone ? el.parentElement : null;
    return {
      sel: selectorOf(el), tag: el.tagName.toLowerCase(),
      orig: textEditable || el.tagName === "IMG" ? orig : "", head: textEditable || el.tagName === "IMG" ? "" : headOf(el), text: norm(el.textContent),
      clone: el.dataset.fwClone || null, inClone: !el.dataset.fwClone && !!el.closest("[data-fw-clone]"),
      // Se puede duplicar si es parte de una lista de elementos iguales (opciones, tarjetas, puntos…).
      canDup: !el.dataset.fwClone && !el.closest("[data-fw-clone]") && sameTag >= 2 && !el.matches(BLOCKS + ", section"),
      parent: up ? { sel: selectorOf(up), label: blockName(up) } : null,
      inline: canInline(el),
      block: !textEditable && el.tagName !== "IMG",
      href: el.getAttribute("href"), src: el.getAttribute("src"),
      textEditable: el.tagName !== "IMG" && !structured(el) && (simple(el) || ownText(el)),
      siblings: el.parentNode ? el.parentNode.children.length : 1,
      isBtn: el.classList.contains("btn"), outline: el.classList.contains("o"), isWa: el.classList.contains("wal"),
      cur: (() => { const cs = getComputedStyle(el); return { size: Math.round(parseFloat(cs.fontSize)), color: hex(cs.color), bg: hex(cs.backgroundColor), weight: cs.fontWeight, align: cs.textAlign === "start" ? "left" : cs.textAlign }; })(),
      index: el.parentNode ? [...el.parentNode.children].indexOf(el) : 0,
    };
  }
  function blockName(el) {
    const h = el.querySelector("h1,h2,h3,h4,b,strong");
    const what = { LI: "Elemento de lista", UL: "Lista", OL: "Lista", SECTION: "Sección", ARTICLE: "Tarjeta", A: "Enlace", FIGURE: "Foto" }[el.tagName]
      || (el.classList.contains("card") ? "Tarjeta" : "Bloque");
    return h && h !== el ? `${what}: ${norm(h.textContent).slice(0, 40)}` : what;
  }

  /* ---------- escribir directo en la página (doble clic) ---------- */
  document.addEventListener("dblclick", e => {
    const t = target(e);
    if (!t || t.kind !== "el" || !canInline(t.el)) return;
    e.preventDefault();
    startInline(t.el);
  }, true);
  function startInline(el) {
    if (editing) finishInline(true);
    editing = el;
    const before = norm(el.innerText), orig = origOf(el), sel = selectorOf(el);
    el.dataset.fwInline = "";
    el.setAttribute("contenteditable", "plaintext-only");
    if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el);
    const range = getSelection(); range.removeAllRanges(); range.addRange(r);
    const key = e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); finishInline(true); }
      if (e.key === "Escape") { e.preventDefault(); finishInline(false); }
    };
    const blur = () => finishInline(true);
    el.addEventListener("keydown", key);
    el.addEventListener("blur", blur);
    el._fwInline = { before, orig, sel, key, blur };
  }
  function finishInline(save) {
    const el = editing;
    if (!el) return;
    editing = null;
    const { before, orig, sel, key, blur } = el._fwInline || {};
    el.removeEventListener("keydown", key); el.removeEventListener("blur", blur);
    el.removeAttribute("contenteditable"); delete el.dataset.fwInline; delete el._fwInline;
    const text = String(el.innerText || "").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
    if (!save || !text) return post({ fwRefresh: true }); // vuelve a poner el texto como estaba
    if (norm(text) === before) return;
    post({ fwInline: { sel, orig, text } });
  }

  /* ---------- lista de secciones de la página ---------- */
  function sectionsOf() {
    const main = document.querySelector("main");
    if (!main) return [];
    return [...main.children].filter(x => x.tagName === "SECTION" && !x.dataset.fwSec).map(x => {
      const title = norm((x.querySelector("h1,h2,h3") || {}).textContent || "") || (x.querySelector("[data-island]") ? "Portada" : norm(x.textContent).slice(0, 50));
      return { sel: selectorOf(x), title: title.slice(0, 70), orig: "", head: headOf(x), hidden: x.style.display === "none", index: [...main.children].filter(c => !c.dataset.fwSec && !c.dataset.fwClone).indexOf(x) };
    });
  }
  // Formularios y botones no deben funcionar mientras se edita.
  document.addEventListener("submit", e => e.preventDefault(), true);

  window.addEventListener("message", e => {
    if (!ADMIN_ORIGINS.includes(e.origin) || !e.data) return;
    admin = e.origin;
    const d = e.data;
    if (d.fwDraft) {
      try { sessionStorage.setItem(KEY, JSON.stringify(d.fwDraft)); } catch (err) { /* ignorar */ }
      if (d.reload) {
        try { sessionStorage.setItem("fw-scroll", String(scrollY)); } catch (err) { /* ignorar */ }
        location.reload();
        return;
      }
      Object.keys(C).forEach(k => delete C[k]);
      Object.assign(C, d.fwDraft);
      applyTheme(); revertAll(); applyOverrides(); renderSections();
      window.dispatchEvent(new Event("fw:content"));
      post({ fwBroken: broken.slice(), fwSections: sectionsOf() });
      const was = d.reselect && document.querySelector(d.reselect);
      if (was) was.setAttribute("data-fw-sel", "");
    }
    if ("fwSeasonPreview" in d) window.dispatchEvent(new CustomEvent("fw:season-preview", { detail: d.fwSeasonPreview || {} }));
    if (d.fwHello) post({ fwReady: { page: PAGE, title: document.title, description: (document.querySelector('meta[name="description"]') || {}).content || "", broken: broken.slice(), sections: sectionsOf() } });
    if (d.fwSelect) {
      const el = findSel(d.fwSelect.sel);
      if (el) {
        if (d.fwSelect.scroll !== false) el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Si el bloque es una zona que se edita con formulario, se abre ese formulario.
        const pz = panelOf(el);
        select(pz ? { el, kind: "panel", panel: pz } : { el, kind: "el" });
      }
    }
    if (d.fwScrollTo) { const s = document.querySelector(`[data-fw-sec="${CSS.escape(d.fwScrollTo)}"]`); if (s) s.scrollIntoView({ behavior: "smooth", block: "center" }); }
  });
  try { const y = sessionStorage.getItem("fw-scroll"); if (y) { sessionStorage.removeItem("fw-scroll"); addEventListener("load", () => scrollTo(0, +y)); } } catch (e) { /* ignorar */ }
  for (const o of ADMIN_ORIGINS) window.parent.postMessage({ fwLoaded: { page: PAGE } }, o);
})();
