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
    ["#menu, #preview, .svc-preview", "portada"], [".bgs", "portada"],
    ["#nivel-plans", "nivelacion"], ["#faq-pre", "faq"], ["#testi, #resultados", "testimonios"],
    ["#chips, #panel", "unis"], [".notice", "aviso"], [".wa, .wal", "contacto"],
    ["#registro, #cronogramas, .uni-sheet, [data-crono]", "cursos"],
  ];
  const panelOf = el => { for (const [sel, id] of PANELS) if (el.closest(sel)) return id; return null; };

  /* ---------- selector estable para un elemento ---------- */
  function selectorOf(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      if (el.id && !/^fw-/.test(el.id)) { parts.unshift("#" + CSS.escape(el.id)); break; }
      let i = 1, s = el;
      while ((s = s.previousElementSibling)) if (s.tagName === el.tagName) i++;
      parts.unshift(`${el.tagName.toLowerCase()}:nth-of-type(${i})`);
      el = el.parentElement;
    }
    if (el === document.body) parts.unshift("body");
    return parts.join(">");
  }

  /* ---------- texto: respeta íconos y formato ---------- */
  const INLINE = new Set(["EM", "B", "STRONG", "I", "BR", "SMALL", "SPAN"]);
  const simple = el => [...el.children].every(c => INLINE.has(c.tagName) && !c.children.length);
  function setText(el, text) {
    if (simple(el)) { el.innerHTML = lite(text); return; }
    const nodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    const big = nodes.sort((a, b) => b.textContent.length - a.textContent.length)[0];
    if (big) big.textContent = " " + text + " ";
  }

  /* ---------- aplicar cambios a la página ---------- */
  const originals = new Map(); // elemento → estado original (para el modo edición)
  function remember(el) {
    if (!originals.has(el)) originals.set(el, { html: el.innerHTML, href: el.getAttribute("href"), src: el.getAttribute("src"), display: el.style.display, parent: el.parentNode, next: el.nextSibling });
  }
  function revertAll() {
    for (const [el, o] of originals) {
      el.innerHTML = o.html;
      o.href == null ? el.removeAttribute("href") : el.setAttribute("href", o.href);
      if (o.src != null) el.setAttribute("src", o.src);
      el.style.display = o.display;
      if (o.parent && el.parentNode === o.parent) o.parent.insertBefore(el, o.next && o.next.parentNode === o.parent ? o.next : null);
    }
    originals.clear();
  }

  const broken = [];
  function applyOverrides() {
    const list = (C.overrides && C.overrides[PAGE]) || [];
    broken.length = 0;
    const found = list.map(o => {
      let el = null;
      try { el = document.querySelector(o.sel); } catch (e) { /* selector inválido */ }
      if (!el || (o.orig && norm(el.textContent) !== norm(o.orig) && !originals.has(el))) { broken.push(o.sel); return null; }
      return [o, el];
    }).filter(Boolean);
    for (const [o, el] of found) {
      remember(el);
      if (o.text != null && o.text !== "") setText(el, o.text);
      if (o.href && el.tagName === "A" && okUrl(o.href)) { el.setAttribute("href", o.href); if (/^https?:/.test(o.href)) { el.target = "_blank"; el.rel = "noopener"; } }
      if (o.src && el.tagName === "IMG" && okUrl(o.src)) { el.setAttribute("src", o.src); el.removeAttribute("srcset"); }
      el.style.display = o.hidden ? "none" : originals.get(el).display;
    }
    // Cambios de orden al final, cuando todos los selectores ya se resolvieron.
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
      el.innerHTML = RENDER[s.type](s);
      const first = main.querySelector(":scope > section");
      if (s.position === "top" && first) first.after(el);
      else main.append(el);
    }
  }

  applyOverrides();
  renderSections();

  /* ---------- modo edición (solo dentro del panel) ---------- */
  if (!EDIT) return;
  let admin = null;
  const CAND = "h1,h2,h3,h4,h5,p,li,a,button,summary,label,img,small,figcaption,.eyebrow,.tag";
  const style = document.createElement("style");
  style.textContent = `[data-fw-hover]{outline:2px dashed #2E6BD1!important;outline-offset:3px;cursor:pointer!important}
  [data-fw-sel]{outline:3px solid #C9A13B!important;outline-offset:3px}
  [data-fw-panel-hover]{outline:2px dashed #C9A13B!important;outline-offset:4px;cursor:pointer!important}
  .fw-edit-badge{position:fixed;right:12px;bottom:12px;z-index:9999;background:#0B2A5B;color:#fff;font:600 12px Inter,sans-serif;padding:6px 10px;border-radius:999px;opacity:.85;pointer-events:none}`;
  document.head.append(style);
  const badge = document.createElement("div");
  badge.className = "fw-edit-badge"; badge.textContent = "Modo edición · haz clic en lo que quieras cambiar";
  document.body.append(badge);

  const post = msg => admin && window.parent.postMessage(msg, admin);
  const target = e => {
    const sec = e.target.closest("[data-fw-sec]");
    if (sec) return { el: sec, kind: "section" };
    const panel = panelOf(e.target);
    if (panel) return { el: e.target.closest(PANELS.find(([, id]) => id === panel)[0]) || e.target, kind: "panel", panel };
    const el = e.target.closest(CAND);
    return el && el.closest("main, nav, header, footer, body") ? { el, kind: "el" } : null;
  };
  let hovered = null;
  document.addEventListener("mouseover", e => {
    const t = target(e);
    if (hovered) { hovered.removeAttribute("data-fw-hover"); hovered.removeAttribute("data-fw-panel-hover"); }
    hovered = t && t.el;
    if (hovered) hovered.setAttribute(t.kind === "el" ? "data-fw-hover" : "data-fw-panel-hover", "");
  });
  document.addEventListener("click", e => {
    const t = target(e);
    e.preventDefault(); e.stopPropagation();
    if (!t) return;
    document.querySelectorAll("[data-fw-sel]").forEach(x => x.removeAttribute("data-fw-sel"));
    t.el.setAttribute("data-fw-sel", "");
    if (t.kind === "section") return post({ fwPick: { section: t.el.dataset.fwSec } });
    if (t.kind === "panel") return post({ fwPick: { panel: t.panel } });
    const el = t.el, o = originals.get(el);
    const tmp = document.createElement("div"); tmp.innerHTML = o ? o.html : el.innerHTML;
    post({ fwPick: {
      sel: selectorOf(el), tag: el.tagName.toLowerCase(),
      orig: norm(tmp.textContent), text: norm(el.textContent),
      href: el.getAttribute("href"), src: el.getAttribute("src"),
      textEditable: el.tagName !== "IMG" && (simple(el) || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())),
      siblings: el.parentNode ? el.parentNode.children.length : 1,
      index: el.parentNode ? [...el.parentNode.children].indexOf(el) : 0,
    } });
  }, true);
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
      revertAll(); applyOverrides(); renderSections();
      post({ fwBroken: broken.slice() });
    }
    if (d.fwHello) post({ fwReady: { page: PAGE, title: document.title, description: (document.querySelector('meta[name="description"]') || {}).content || "", broken: broken.slice() } });
    if (d.fwScrollTo) { const s = document.querySelector(`[data-fw-sec="${CSS.escape(d.fwScrollTo)}"]`); if (s) s.scrollIntoView({ behavior: "smooth", block: "center" }); }
  });
  try { const y = sessionStorage.getItem("fw-scroll"); if (y) { sessionStorage.removeItem("fw-scroll"); addEventListener("load", () => scrollTo(0, +y)); } } catch (e) { /* ignorar */ }
  for (const o of ADMIN_ORIGINS) window.parent.postMessage({ fwLoaded: { page: PAGE } }, o);
})();
