/* ===== PRÁCTICA GRATUITA POR TEMA =====
   Áreas y temas vienen de /api/practice (src/practice.js). Cada ronda: repaso corto + 5 preguntas
   con corrección inmediata y explicación. El navegador recuerda el mejor puntaje de cada tema. */
(function () {
  const root = document.getElementById("practica");
  if (!root) return;
  const KEY = "fw_practica";
  const store = { get() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const tabs = root.querySelector("[data-areas]"), grid = root.querySelector("[data-topics]"), run = document.getElementById("pr-run"), pick = root.querySelector("[data-pick]");
  let AREAS = [], area = null;

  fetch("/api/practice").then(r => r.json()).then(a => {
    AREAS = a;
    const qs = new URLSearchParams(location.search);
    const t = qs.get("t"), want = qs.get("area");
    const byTopic = t && AREAS.find(x => x.topics.some(y => y.id === t));
    showArea((byTopic || AREAS.find(x => x.id === want) || AREAS[0]).id);
    if (byTopic) start(t);
  }).catch(() => { grid.innerHTML = '<p class="rn-small">No pudimos cargar los temas. Revisa tu conexión y recarga la página.</p>'; });

  function showArea(id) {
    area = AREAS.find(a => a.id === id);
    tabs.innerHTML = AREAS.map(a => `<button type="button" class="${a.id === id ? "on" : ""}" aria-pressed="${a.id === id}" data-a="${a.id}">${esc(a.name)}</button>`).join("");
    const best = store.get();
    grid.innerHTML = area.topics.map(t => `<button type="button" data-t="${t.id}"><b>${esc(t.name)}</b><span>${best[t.id] != null ? `Tu mejor resultado: ${best[t.id]}/5` : "5 preguntas · con repaso"}</span>${best[t.id] === 5 ? '<i class="pr-ok" aria-label="Dominado">✓</i>' : ""}</button>`).join("");
  }
  tabs.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b) showArea(b.dataset.a); });
  grid.addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) start(b.dataset.t); });

  async function start(id) {
    const t = area.topics.find(x => x.id === id) || AREAS.flatMap(a => a.topics).find(x => x.id === id);
    pick.hidden = true; run.hidden = false;
    run.innerHTML = '<div class="rn-load">Preparando tus preguntas…</div>';
    run.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `?t=${id}`);
    try {
      const r = await fetch("/api/practice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: id }) });
      const set = await r.json();
      if (!r.ok) throw new Error(set.error || "No pudimos cargar las preguntas.");
      play(set, t);
    } catch (err) {
      run.innerHTML = `<div class="rn-load">${esc(err.message)}<div class="row"><button class="btn" data-retry>Reintentar</button><button class="btn o" data-back>Elegir otro tema</button></div></div>`;
      run.querySelector("[data-retry]").onclick = () => start(id);
      run.querySelector("[data-back]").onclick = back;
    }
  }

  function back() { run.hidden = true; pick.hidden = false; history.replaceState(null, "", location.pathname); showArea(area.id); pick.scrollIntoView({ block: "start" }); }

  function play(set, t) {
    let i = 0, ok = 0;
    const draw = () => {
      const q = set.questions[i], n = set.questions.length;
      run.innerHTML = `
        <div class="rn-head"><div><b>${esc(set.name)}</b></div><span class="rn-timer">${i + 1} / ${n}</span></div>
        <div class="bar"><i style="width:${(i / n) * 100}%"></i></div>
        ${i === 0 ? `<details class="pr-review" open><summary>Repaso rápido</summary><p>${esc(set.review)}</p></details>` : `<details class="pr-review"><summary>Ver el repaso</summary><p>${esc(set.review)}</p></details>`}
        ${q.figure ? `<div class="rn-figure">${q.figure}</div>` : ""}
        ${q.svg ? `<div class="rn-seq">${q.svg.map(s => `<div class="rn-fig">${s}</div>`).join("")}<div class="rn-fig q">?</div></div>` : ""}
        <div class="rn-q">${esc(q.prompt)}</div>
        <div class="rn-opts${q.optionsSvg ? " figs" : ""}">${q.options.map((o, k) => `<button type="button" class="opt" data-k="${k}"><span class="lt">${"ABCDE"[k]}</span>${q.optionsSvg ? o : esc(o)}</button>`).join("")}</div>
        <p class="demo-fb" aria-live="polite"></p>
        <div class="rn-nav"><button class="btn o" data-back>Cambiar de tema</button><button class="btn" data-next hidden>${i === n - 1 ? "Ver mi resultado" : "Siguiente"}</button></div>`;
      run.querySelector("[data-back]").onclick = back;
      const fb = run.querySelector(".demo-fb"), next = run.querySelector("[data-next]");
      run.querySelectorAll(".opt").forEach(b => b.onclick = () => {
        const k = +b.dataset.k, right = k === q.answer;
        if (right) ok++;
        run.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (+x.dataset.k === q.answer) x.classList.add("ok"); });
        if (!right) b.classList.add("no");
        fb.className = "demo-fb " + (right ? "good" : "bad");
        fb.innerHTML = (right ? "<b>¡Correcto!</b> " : "<b>No es esa.</b> ") + esc(q.explain);
        next.hidden = false; next.focus();
      });
      next.onclick = () => { i++; if (i < n) draw(); else end(); };
    };
    const end = () => {
      const n = set.questions.length, best = store.get();
      best[set.topic] = Math.max(best[set.topic] || 0, ok); store.set(best);
      const pct = Math.round((ok / n) * 100), color = pct >= 80 ? "var(--ok)" : pct >= 50 ? "var(--gold)" : "var(--bad)";
      const msg = ok === n ? "¡Lo dominas! Prueba con un tema más difícil o haz un simulador completo." : ok >= 3 ? "Vas bien. Otra ronda con preguntas nuevas te ayuda a fijarlo." : "Este tema necesita refuerzo. Lee el repaso y haz otra ronda: las preguntas cambian cada vez.";
      run.innerHTML = `
        <div class="rn-res-head"><div class="rn-ring" style="--p:${pct};--c:${color}"><b>${ok}/${n}</b><span>correctas</span></div>
          <div><span class="rn-small">${esc(set.name)}</span><div class="rn-band">${ok === n ? "Dominado" : ok >= 3 ? "En progreso" : "A reforzar"}</div><p>${msg}</p></div></div>
        <div class="row"><button class="btn" data-again>Otra ronda (preguntas nuevas)</button><button class="btn o" data-back>Elegir otro tema</button></div>
        <div class="rn-upsell"><b>¿Quieres que un profesor te lo explique?</b><p>En la nivelación y el preuniversitario trabajamos justo los temas donde fallas.</p>
          <div class="row" style="margin-top:12px"><a class="btn o" href="simuladores.html">Hacer un simulador</a><a class="btn o" target="_blank" rel="noopener" href="${wa(`Hola For Winners, practiqué ${set.name} y quiero reforzarlo con un profesor.`)}">Hablar con un profesor</a></div></div>`;
      run.querySelector("[data-again]").onclick = () => start(set.topic);
      run.querySelector("[data-back]").onclick = back;
    };
    draw();
  }
})();
