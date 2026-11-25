/* Enfoque y desenfoque al hacer scroll (manual o con clic).
   Cada bloque de contenido está nítido mientras ocupa la franja central de la pantalla y se
   desenfoca y atenúa al entrar o salir por arriba o por abajo. Se desactiva si el usuario
   pidió menos movimiento en su sistema. */
const SEL = "main > section > .wrap > *, main > section > .wrap > .head > *, [data-focus]";
const SKIP = ".head, dialog, .services, .cue, #runner, #pr-run, .runner, [data-nofocus]";
const MAX_BLUR = 7;    // px
const MIN_OPACITY = .25;

export function initFocus() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const active = new Set();
  let els = [];
  let queued = false;

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) active.add(e.target);
      else { active.delete(e.target); e.target.style.filter = ""; e.target.style.opacity = ""; }
    }
    queue();
  }, { rootMargin: "15% 0px 15% 0px" });

  function collect() {
    els.forEach(el => io.unobserve(el));
    els = [...document.querySelectorAll(SEL)].filter(el => !el.matches(SKIP) && el.offsetParent !== null);
    els.forEach(el => { el.classList.add("fx-focus"); io.observe(el); });
  }

  function paint() {
    queued = false;
    const vh = innerHeight, top = vh * .1, bottom = vh * .9, band = bottom - top;
    for (const el of active) {
      const r = el.getBoundingClientRect();
      if (!r.height) continue;
      const overlap = Math.max(0, Math.min(r.bottom, bottom) - Math.max(r.top, top));
      // Un bloque alto está enfocado cuando cubre al menos media franja (no hace falta que quepa entero).
      const ratio = Math.min(1, overlap / Math.min(r.height, band * .5));
      const k = 1 - ratio; // 0 = enfocado, 1 = fuera de la franja
      el.style.filter = k > .02 ? `blur(${(k * MAX_BLUR).toFixed(2)}px)` : "";
      el.style.opacity = k > .02 ? (1 - k * (1 - MIN_OPACITY)).toFixed(3) : "";
    }
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(paint); } }

  collect();
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  // Las islas de React y los scripts de cada página agregan contenido después: se vuelve a buscar.
  new MutationObserver(() => { clearTimeout(collect.t); collect.t = setTimeout(() => { collect(); queue(); }, 120); })
    .observe(document.querySelector("main") || document.body, { childList: true, subtree: false });
  setTimeout(() => { collect(); queue(); }, 600);
}

/* Enlaces con data-scroll="#destino": scroll animado (el enfoque/desenfoque lo hace initFocus). */
export function initScrollLinks() {
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-scroll]");
    if (!a) return;
    const t = document.querySelector(a.dataset.scroll);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });
}
