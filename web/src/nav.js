/* Submenús del menú superior.
   Escritorio: se abren al pasar el mouse o con el teclado (Tab / Enter en la flecha); Escape cierra.
   Celular: dentro del menú ☰, la flecha despliega cada grupo como acordeón.
   También marca el grupo de la página actual (por ejemplo, Simuladores → Preuniversitario). */
const PARENT = {
  "simuladores.html": "pre", "test-vocacional.html": "pre", "guias.html": "pre", "preuniversitario.html": "pre",
  "diagnostico.html": "niv", "practica.html": "niv", "nivelacion.html": "niv",
  "ingles.html": "eng", "asesoria.html": "ase", "computacion.html": "comp",
};

export function initNav() {
  const items = [...document.querySelectorAll(".nav-item")];
  if (!items.length) return;
  const page = (location.pathname.split("/").pop() || "index.html").replace(/^([^.]+)$/, "$1.html");
  const g = PARENT[page];
  if (g) document.querySelector(`.nav-item[data-group="${g}"] .nav-top`)?.classList.add("on");

  const close = (except) => items.forEach(it => {
    if (it === except) return;
    it.classList.remove("open");
    it.querySelector(".sub-toggle")?.setAttribute("aria-expanded", "false");
  });
  for (const it of items) {
    const btn = it.querySelector(".sub-toggle");
    if (!btn) continue;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const open = !it.classList.contains("open");
      close(it);
      it.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    // Escritorio: al pasar el mouse se abre (CSS) y se anuncia como abierto.
    it.addEventListener("mouseenter", () => { if (matchMedia("(min-width: 961px)").matches) btn.setAttribute("aria-expanded", "true"); });
    it.addEventListener("mouseleave", () => { if (matchMedia("(min-width: 961px)").matches && !it.classList.contains("open")) btn.setAttribute("aria-expanded", "false"); });
  }
  document.addEventListener("click", e => { if (!e.target.closest(".nav-item")) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}
