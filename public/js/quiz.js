/* ===== MOTOR DE SIMULADORES (cliente) =====
   FWQuiz.mount(elemento, { quiz, level, sections, onExit })
   Las preguntas y la corrección viven en el servidor (/api/quiz/*): el navegador nunca recibe las respuestas. */
(function () {
  const SEEN_KEY = "fw_seen", CONTACT_KEY = "fw_contact", SEEN_MAX = 3000;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
    return el;
  };
  const post = async (url, data) => {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out.error || "No pudimos conectar. Intenta de nuevo.");
    return out;
  };
  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const bandColor = p => (p >= 80 ? "var(--ok)" : p >= 50 ? "var(--accent)" : "var(--bad)");

  function mount(root, opts) {
    const st = { attempt: null, i: 0, answers: {}, timer: null, left: 0, done: false };
    root.classList.add("runner");
    root.innerHTML = "";
    root.append(h("div", { class: "rn-load" }, "Preparando tus preguntas…"));
    root.scrollIntoView({ block: "start" });
    let first = true;

    const leaveGuard = e => { if (st.attempt && !st.done) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", leaveGuard);

    post("/api/quiz/start", { quiz: opts.quiz, level: opts.level, sections: opts.sections || [], seen: store.get(SEEN_KEY, []) })
      .then(a => {
        st.attempt = a;
        const seen = store.get(SEEN_KEY, []).filter(k => !a.questions.some(q => q.sk === k));
        store.set(SEEN_KEY, seen.concat(a.questions.map(q => q.sk)).slice(-SEEN_MAX));
        if (a.minutes) startTimer(a.minutes * 60);
        renderQ();
      })
      .catch(err => error(err.message));

    function error(msg) {
      root.innerHTML = "";
      root.append(h("div", { class: "rn-load" }, msg, h("div", { class: "row" }, h("button", { class: "btn", onclick: () => mount(root, opts) }, "Reintentar"))));
    }

    function startTimer(sec) {
      st.left = sec;
      st.timer = setInterval(() => {
        st.left--;
        const t = root.querySelector(".rn-timer");
        if (t) { t.textContent = "⏱ " + fmtTime(Math.max(0, st.left)); t.classList.toggle("low", st.left <= 60); }
        if (st.left <= 0) { clearInterval(st.timer); renderGate(true); }
      }, 1000);
    }

    function renderQ() {
      const a = st.attempt, q = a.questions[st.i], n = a.questions.length;
      const answered = Object.keys(st.answers).filter(k => st.answers[k] !== "").length;
      root.innerHTML = "";
      const head = h("div", { class: "rn-head" },
        h("div", {}, h("b", {}, a.title), h("span", {}, a.kind === "vocational" ? "" : " · " + a.label)),
        a.minutes ? h("span", { class: "rn-timer" }, "⏱ " + fmtTime(st.left)) : null);
      const bar = h("div", { class: "bar" }, h("i", { style: `width:${(answered / n) * 100}%` }));
      const meta = h("div", { class: "rn-meta" }, h("span", {}, `Pregunta ${st.i + 1} de ${n}`), a.kind === "vocational" ? null : h("span", { class: "rn-sec" }, q.section));
      const body = h("div", { class: "rn-body" });
      if (q.passage) body.append(h("div", { class: "rn-passage" }, q.passageTitle ? h("b", {}, q.passageTitle) : null, ...q.passage.split("\n").map(p => h("p", {}, p))));
      if (q.svg) body.append(h("div", { class: "rn-seq" }, ...q.svg.map(s => h("div", { class: "rn-fig", html: s })), h("div", { class: "rn-fig q" }, "?")));
      body.append(h("div", { class: "rn-q" }, q.prompt));
      body.append(answerUI(q));
      const last = st.i === n - 1;
      const nav = h("div", { class: "rn-nav" },
        h("button", { class: "btn o", disabled: st.i === 0, onclick: () => { st.i--; renderQ(); } }, "Anterior"),
        h("button", { class: "btn", onclick: () => { if (last) renderGate(false); else { st.i++; renderQ(); } } }, last ? "Terminar" : "Siguiente"));
      root.append(head, bar, meta, body, nav);
      if (first || root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: "start" });
      first = false;
      const focus = root.querySelector(".opt.sel, input, .opt");
      if (focus && document.activeElement && root.contains(document.activeElement)) focus.focus({ preventScroll: true });
    }

    function setAnswer(q, v) { st.answers[q.id] = v; }

    function answerUI(q) {
      const cur = st.answers[q.id] ?? "";
      if (q.type === "text") {
        const inp = h("input", { class: "rn-input", type: "text", value: cur, placeholder: "Escribe tu respuesta", autocomplete: "off", autocapitalize: "off", spellcheck: "false", oninput: e => setAnswer(q, e.target.value) });
        inp.addEventListener("keydown", e => { if (e.key === "Enter") root.querySelector(".rn-nav .btn:last-child").click(); });
        return h("div", {}, inp);
      }
      if (q.type === "order") {
        const picked = cur ? cur.split(" ") : [];
        const pool = q.tokens.slice();
        picked.forEach(w => { const k = pool.indexOf(w); if (k >= 0) pool.splice(k, 1); });
        const redraw = () => { const box = root.querySelector(".rn-order"); box.replaceWith(orderUI()); };
        const orderUI = () => h("div", { class: "rn-order" },
          h("div", { class: "rn-built", "aria-label": "Tu oración" }, picked.length ? picked.map((w, k) => h("button", { class: "tok on", onclick: () => { pool.push(picked.splice(k, 1)[0]); setAnswer(q, picked.join(" ")); redraw(); } }, w)) : h("span", { class: "rn-hint" }, "Toca las palabras en orden…")),
          h("div", { class: "rn-pool" }, pool.map((w, k) => h("button", { class: "tok", onclick: () => { picked.push(pool.splice(k, 1)[0]); setAnswer(q, picked.join(" ")); redraw(); } }, w))));
        return orderUI();
      }
      const wrap = h("div", { class: "rn-opts" + (q.optionsSvg ? " figs" : "") });
      q.options.forEach((o, k) => {
        const b = h("button", { class: "opt" + (cur === o ? " sel" : ""), "aria-pressed": cur === o ? "true" : "false", onclick: () => {
          setAnswer(q, o);
          wrap.querySelectorAll(".opt").forEach(x => { x.classList.remove("sel"); x.setAttribute("aria-pressed", "false"); });
          b.classList.add("sel"); b.setAttribute("aria-pressed", "true");
          const bar = root.querySelector(".bar i");
          if (bar) bar.style.width = (Object.values(st.answers).filter(Boolean).length / st.attempt.questions.length) * 100 + "%";
          if (st.attempt.kind === "vocational") setTimeout(() => { if (st.i < st.attempt.questions.length - 1) { st.i++; renderQ(); } else renderGate(false); }, 220);
        } });
        if (q.optionsSvg) b.innerHTML = `<span class="lt">${"ABCDE"[k]}</span>${o}`;
        else b.append(h("span", { class: "lt" }, "ABCDE"[k]), o);
        wrap.append(b);
      });
      return wrap;
    }

    function renderGate(timeUp) {
      clearInterval(st.timer);
      const a = st.attempt, n = a.questions.length;
      const answered = a.questions.filter(q => st.answers[q.id]).length;
      const c = store.get(CONTACT_KEY, {});
      root.innerHTML = "";
      const msg = h("p", { class: "rn-err", role: "alert" });
      const form = h("form", { class: "rn-form", onsubmit: submit },
        h("label", {}, "Nombre y apellido", h("input", { name: "name", required: true, autocomplete: "name", value: c.name || "", maxlength: 80 })),
        h("label", {}, "WhatsApp", h("input", { name: "phone", type: "tel", inputmode: "tel", autocomplete: "tel", placeholder: "09XXXXXXXX", value: c.phone || "" })),
        h("label", {}, "Correo electrónico", h("input", { name: "email", type: "email", autocomplete: "email", placeholder: "tucorreo@ejemplo.com", value: c.email || "" })),
        h("p", { class: "rn-small" }, "Escribe tu WhatsApp, tu correo o ambos: ahí te enviamos el informe."),
        h("input", { name: "website", class: "hp", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" }),
        h("label", { class: "rn-check" }, h("input", { type: "checkbox", name: "consent", required: true, checked: c.consent }), "Acepto que For Winners use mis datos para enviarme el informe y contactarme sobre sus cursos (LOPDP)."),
        msg,
        h("button", { class: "btn", type: "submit" }, a.kind === "vocational" ? "Ver mis carreras" : "Ver mi resultado"));
      root.append(
        h("div", { class: "rn-gate" },
          h("div", { class: "rn-lock", "aria-hidden": "true" }, h("div", { class: "blur" }, a.kind === "vocational" ? "R I A S E C" : "87 %"), h("span", {}, "🔒")),
          h("h3", {}, timeUp ? "¡Se acabó el tiempo!" : "¡Terminaste! Tu resultado está listo."),
          h("p", { class: "rn-small" }, a.kind === "vocational" ? `Respondiste ${answered} de ${n} preguntas. ¿A dónde te enviamos tu informe vocacional?` : `Respondiste ${answered} de ${n} preguntas. Déjanos tus datos para mostrarte el resultado y enviarte tu informe personalizado.`),
          form,
          answered < n && !timeUp ? h("button", { class: "linkbtn", onclick: () => { st.i = a.questions.findIndex(q => !st.answers[q.id]); renderQ(); if (a.minutes) startTimer(st.left); } }, "Volver a las preguntas sin responder") : null));

      async function submit(e) {
        e.preventDefault();
        const f = new FormData(form);
        const contact = { name: f.get("name"), phone: f.get("phone"), email: f.get("email"), consent: !!f.get("consent") };
        if (!contact.phone && !contact.email) { msg.textContent = "Escribe tu WhatsApp o tu correo."; return; }
        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true; btn.textContent = "Calculando…"; msg.textContent = "";
        try {
          const out = await post("/api/quiz/submit", {
            quiz: a.quiz, level: a.level, contact, website: f.get("website"),
            answers: a.questions.map(q => ({ id: q.id, a: st.answers[q.id] || "" })),
          });
          store.set(CONTACT_KEY, contact);
          st.done = true;
          window.removeEventListener("beforeunload", leaveGuard);
          if (window.gtag) window.gtag("event", "generate_lead", { quiz: a.quiz, level: a.level });
          renderResult(root, out, { contact, onRetry: () => mount(root, opts), onExit: opts.onExit });
        } catch (err) {
          msg.textContent = err.message; btn.disabled = false; btn.textContent = "Ver mi resultado";
        }
      }
    }
  }

  // ---------- Resultados (también usado por informe.html) ----------
  function renderResult(root, out, { contact, onRetry, onExit, readOnly } = {}) {
    const r = out.result;
    root.classList.add("runner");
    root.innerHTML = "";
    const ctaRow = h("div", { class: "row" },
      h("a", { class: "btn", href: out.waUrl, target: "_blank", rel: "noopener" }, r.cta.text),
      onRetry ? h("button", { class: "btn o", onclick: onRetry }, "Practicar otra vez") : null,
      onExit ? h("button", { class: "linkbtn", onclick: onExit }, "Elegir otro") : null);
    const delivered = [];
    if (out.delivery?.email) delivered.push("tu correo");
    if (out.delivery?.whatsapp) delivered.push("tu WhatsApp");
    const note = readOnly ? null : h("p", { class: "rn-small c" }, delivered.length ? `📩 También te enviamos este informe a ${delivered.join(" y ")}.` : "Un asesor de For Winners te contactará con tu informe.");

    if (r.kind === "vocational") {
      root.append(
        h("div", { class: "rn-res-head" }, h("span", { class: "rn-small" }, `${r.title}`), h("div", { class: "rn-code" }, r.code), h("p", {}, r.message)),
        h("div", { class: "rn-bars" }, r.profile.map((p, i) => h("div", { class: "rn-barrow" + (i >= 3 ? " locked" : "") },
          h("div", { class: "rn-barlbl" }, h("b", {}, i >= 3 ? "••••••" : p.name), h("span", {}, i >= 3 ? "🔒" : p.pct + " %")),
          h("div", { class: "bar" }, h("i", { style: `width:${i >= 3 ? 40 : p.pct}%;background:var(--accent)` })),
          i < 2 ? h("p", { class: "rn-small" }, p.desc) : null))),
        h("h3", { class: "rn-h" }, "Carreras afines a tu perfil"),
        h("div", { class: "rn-careers" },
          r.careers.map((c, i) => h("div", { class: "rn-career" }, h("span", { class: "n" }, i + 1), h("div", {}, h("b", {}, c.name), h("span", { class: "rn-small" }, c.area)), h("span", { class: "fit" }, c.fit + " %"))),
          [0, 1, 2].map(i => h("div", { class: "rn-career locked", "aria-hidden": "true" }, h("span", { class: "n" }, i + 4), h("div", {}, h("b", {}, "Carrera compatible"), h("span", { class: "rn-small" }, "Área ••••")), h("span", { class: "fit" }, "🔒")))),
        h("div", { class: "rn-upsell" }, h("b", {}, `🔒 +${r.locked} carreras compatibles más`), h("p", {}, "En tu sesión de orientación vocacional te entregamos el informe completo: todas tus carreras afines, en qué universidades del Ecuador se ofertan, puntajes de referencia y tu plan para prepararte.")),
        ctaRow, note);
      return;
    }

    const ring = h("div", { class: "rn-ring", style: `--p:${r.pct};--c:${bandColor(r.pct)}` }, h("b", {}, r.pct + "%"), h("span", {}, `${r.correct}/${r.total}`));
    root.append(
      h("div", { class: "rn-res-head" }, ring, h("div", {}, h("span", { class: "rn-small" }, `${r.title} · ${r.label}`), h("div", { class: "rn-band" }, r.band), h("p", {}, r.message))),
      h("div", { class: "rn-bars" }, r.sections.map(s => h("div", { class: "rn-barrow" },
        h("div", { class: "rn-barlbl" }, h("b", {}, s.name), h("span", {}, `${s.correct}/${s.total} · ${s.advice}`)),
        h("div", { class: "bar" }, h("i", { style: `width:${Math.max(3, s.pct)}%;background:${bandColor(s.pct)}` }))))),
      r.review.length ? h("h3", { class: "rn-h" }, "Revisemos algunos errores") : null,
      ...r.review.map(x => h("div", { class: "rn-review" }, h("span", { class: "rn-sec" }, x.section), h("p", {}, h("b", {}, x.prompt)), h("p", {}, "Tu respuesta: ", h("span", { class: "bad" }, x.yours)), h("p", {}, "Correcta: ", h("span", { class: "good" }, x.correct)), x.explain ? h("p", { class: "rn-small" }, x.explain) : null)),
      r.locked ? h("div", { class: "rn-upsell" }, h("b", {}, `🔒 ${r.locked} errores más con su explicación paso a paso`), h("p", {}, upsellText(r))) : h("div", { class: "rn-upsell" }, h("b", {}, "¡Excelente trabajo!"), h("p", {}, upsellText(r))),
      ctaRow, note);
  }

  function upsellText(r) {
    if (r.quiz === "diagnostico") return `Los revisamos contigo en tu primera clase de nivelación${r.weak.length ? `, empezando por ${r.weak.slice(0, 2).join(" y ")}` : ""}.`;
    if (r.quiz === "ingles") return "En el curso de inglés trabajamos cada error con tu profesor y practicas speaking, listening, reading y writing por niveles.";
    return `Este simulador tiene solo el 25 % de la prueba real. En el preuniversitario haces simulacros completos y cronometrados, con la explicación de cada pregunta.`;
  }

  window.FWQuiz = { mount, renderResult };
})();
