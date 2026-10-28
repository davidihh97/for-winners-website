/* ===== MOTOR DE SIMULADORES (cliente) =====
   FWQuiz.mount(elemento, { quiz, level, sections, onExit })
   FWQuiz.contactForm({ button, extra, onSubmit })
   Las preguntas y la corrección viven en el servidor (/api/quiz/*): el navegador nunca recibe las respuestas.
   Flujos: "gate" (diagnóstico y admisión: datos → resultado) y "open" (inglés y vocacional:
   resultado libre; los datos desbloquean el informe completo en PDF). */
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
  const bandColor = p => (p >= 80 ? "var(--ok)" : p >= 50 ? "var(--gold)" : "var(--bad)");

  // ---------- Formulario de contacto validado ----------
  // El botón queda inactivo hasta que: nombre y apellido, celular de 10 dígitos (09…),
  // correo verificado por el servidor y casilla de datos marcada.
  function contactForm({ button, extra = [], onSubmit }) {
    const c = store.get(CONTACT_KEY, {});
    const ok = { name: false, phone: false, email: false, consent: false };
    let emailSeq = 0, emailTimer = null;
    const hint = (k, text, good) => { const el = form.querySelector(`[data-hint="${k}"]`); el.textContent = text; el.className = "rn-hint2 " + (good ? "good" : text ? "bad" : ""); };
    const refresh = () => { btn.disabled = !Object.values(ok).every(Boolean); };
    const nameIn = h("input", { name: "name", autocomplete: "name", maxlength: 80, value: c.name || "", placeholder: "Ej.: María Pérez",
      oninput: e => { const v = e.target.value.trim(); ok.name = v.split(/\s+/).filter(w => w.length >= 2).length >= 2; hint("name", v && !ok.name ? "Escribe tu nombre y tu apellido" : "", false); refresh(); } });
    const phoneIn = h("input", { name: "phone", type: "tel", inputmode: "numeric", autocomplete: "tel", maxlength: 10, placeholder: "09XXXXXXXX", value: c.phone || "",
      oninput: e => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
        const v = e.target.value; ok.phone = /^09\d{8}$/.test(v);
        hint("phone", !v ? "" : ok.phone ? "✓ Número válido" : v.length < 10 ? `Faltan ${10 - v.length} dígitos` : "Debe empezar con 09", ok.phone); refresh();
      } });
    const emailIn = h("input", { name: "email", type: "email", autocomplete: "email", inputmode: "email", maxlength: 120, placeholder: "tucorreo@ejemplo.com", value: c.email || "",
      oninput: () => checkEmail() });
    function checkEmail() {
      const v = emailIn.value.trim().toLowerCase();
      ok.email = false; refresh();
      clearTimeout(emailTimer);
      if (!v) return hint("email", "");
      if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v)) return hint("email", "Escribe un correo completo, por ejemplo nombre@gmail.com");
      hint("email", "Verificando correo…", false);
      const seq = ++emailSeq;
      emailTimer = setTimeout(async () => {
        try {
          const r = await fetch("/api/check-email?e=" + encodeURIComponent(v)).then(x => x.json());
          if (seq !== emailSeq) return;
          ok.email = !!r.ok;
          if (r.suggestion) {
            const el = form.querySelector('[data-hint="email"]');
            el.className = "rn-hint2 bad"; el.textContent = "";
            el.append("¿Quisiste decir ", h("button", { type: "button", class: "linkbtn inline", onclick: () => { emailIn.value = r.suggestion; checkEmail(); } }, r.suggestion), "?");
          } else hint("email", r.ok ? "✓ Correo verificado" : r.reason || "Correo no válido", r.ok);
        } catch { if (seq === emailSeq) { ok.email = true; hint("email", "", false); } }
        refresh();
      }, 450);
    }
    const consentIn = h("input", { type: "checkbox", name: "consent", onchange: e => { ok.consent = e.target.checked; refresh(); } });
    const msg = h("p", { class: "rn-err", role: "alert" });
    const btn = h("button", { class: "btn", type: "submit", disabled: true }, button);
    const form = h("form", { class: "rn-form", novalidate: true, onsubmit: async e => {
      e.preventDefault();
      if (btn.disabled) return;
      const contact = { name: nameIn.value.trim(), phone: phoneIn.value, email: emailIn.value.trim().toLowerCase(), consent: consentIn.checked };
      const extras = Object.fromEntries(new FormData(form));
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = "Preparando…"; msg.textContent = "";
      try {
        await onSubmit(contact, extras);
        store.set(CONTACT_KEY, { name: contact.name, phone: contact.phone, email: contact.email });
      } catch (err) { msg.textContent = err.message; }
      btn.textContent = label; refresh();
    } },
      h("label", {}, "Nombre y apellido", nameIn, h("span", { "data-hint": "name", class: "rn-hint2" })),
      h("label", {}, "Celular (WhatsApp)", phoneIn, h("span", { "data-hint": "phone", class: "rn-hint2" })),
      h("label", {}, "Correo electrónico", emailIn, h("span", { "data-hint": "email", class: "rn-hint2" })),
      ...extra,
      h("input", { name: "website", class: "hp", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" }),
      h("label", { class: "rn-check" }, consentIn, "Acepto que For Winners use mis datos para contactarme sobre sus cursos, de acuerdo con la Ley Orgánica de Protección de Datos Personales."),
      msg, btn);
    // Valida los datos guardados de un intento anterior.
    [nameIn, phoneIn].forEach(i => i.value && i.dispatchEvent(new Event("input")));
    if (emailIn.value) checkEmail();
    return form;
  }

  // Protección del contenido: sin copiar, arrastrar, menú contextual, imprimir ni guardar la página.
  function protect(root) {
    if (root.dataset.protected) return;
    root.dataset.protected = "1";
    const allow = e => e.target.closest && e.target.closest("input, textarea, select");
    ["copy", "cut", "contextmenu", "dragstart", "selectstart"].forEach(ev => root.addEventListener(ev, e => { if (!allow(e)) e.preventDefault(); }));
    document.addEventListener("keydown", e => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "u"].includes(k) && document.querySelector(".runner .rn-q")) e.preventDefault();
    });
  }

  function mount(root, opts) {
    protect(root);
    const st = { attempt: null, i: 0, answers: {}, timer: null, left: 0, done: false };
    root.classList.add("runner");
    root.innerHTML = "";
    root.append(h("div", { class: "rn-load" }, "Preparando tus preguntas…"));
    root.scrollIntoView({ block: "start", behavior: "instant" });
    let first = true;

    const leaveGuard = e => { if (st.attempt && !st.done) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", leaveGuard);
    const finished = () => { st.done = true; window.removeEventListener("beforeunload", leaveGuard); };
    const answers = () => st.attempt.questions.map(q => ({ id: q.id, a: st.answers[q.id] || "" }));
    const ctx = { onRetry: () => mount(root, opts), onExit: opts.onExit };

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
        if (st.left <= 0) { clearInterval(st.timer); finish(true); }
      }, 1000);
    }

    function finish(timeUp) {
      clearInterval(st.timer);
      if (st.attempt.flow === "open") return renderOpen();
      renderGate(timeUp);
    }

    function renderQ() {
      const a = st.attempt, q = a.questions[st.i], n = a.questions.length;
      const answered = Object.keys(st.answers).filter(k => st.answers[k] !== "").length;
      root.innerHTML = "";
      const head = h("div", { class: "rn-head" },
        h("div", {}, h("b", {}, a.title), h("span", {}, a.kind === "vocational" ? "" : " · " + a.label)),
        a.minutes ? h("span", { class: "rn-timer" }, "⏱ " + fmtTime(st.left)) : null);
      const bar = h("div", { class: "bar" }, h("i", { style: `width:${(answered / n) * 100}%` }));
      const meta = h("div", { class: "rn-meta" }, h("span", {}, `Pregunta ${st.i + 1} de ${n}`), h("span", { class: "rn-sec" }, q.section));
      const body = h("div", { class: "rn-body" });
      if (q.passage) body.append(h("div", { class: "rn-passage" }, q.passageTitle ? h("b", {}, q.passageTitle) : null, ...q.passage.split("\n").map(p => h("p", {}, p))));
      if (q.figure) body.append(h("div", { class: "rn-figure", html: q.figure }));
      if (q.svg) body.append(h("div", { class: "rn-seq" }, ...q.svg.map(s => h("div", { class: "rn-fig", html: s })), h("div", { class: "rn-fig q" }, "?")));
      body.append(h("div", { class: "rn-q" }, q.prompt));
      body.append(answerUI(q));
      const last = st.i === n - 1;
      const nav = h("div", { class: "rn-nav" },
        h("button", { class: "btn o", disabled: st.i === 0, onclick: () => { st.i--; renderQ(); } }, "Anterior"),
        h("button", { class: "btn", onclick: () => { if (last) finish(false); else { st.i++; renderQ(); } } }, last ? "Terminar" : "Siguiente"));
      root.append(head, bar, meta, body, nav);
      if (first || root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: "start", behavior: "instant" });
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
          if (st.attempt.kind === "vocational") setTimeout(() => { if (st.i < st.attempt.questions.length - 1) { st.i++; renderQ(); } else finish(false); }, 220);
        } });
        if (q.optionsSvg) b.innerHTML = `<span class="lt">${"ABCDE"[k]}</span>${o}`;
        else b.append(h("span", { class: "lt" }, "ABCDE"[k]), o);
        wrap.append(b);
      });
      return wrap;
    }

    // Diagnóstico y simuladores de admisión: los datos son necesarios para ver el resultado.
    function renderGate(timeUp) {
      const a = st.attempt, n = a.questions.length;
      const answered = a.questions.filter(q => st.answers[q.id]).length;
      root.innerHTML = "";
      const form = contactForm({ button: "Ver mi resultado", onSubmit: async contact => {
        const out = await post("/api/quiz/submit", { quiz: a.quiz, level: a.level, contact, answers: answers(), website: form.querySelector("[name=website]").value });
        finished();
        if (window.gtag) window.gtag("event", "generate_lead", { quiz: a.quiz, level: a.level });
        renderResult(root, out, { ...ctx, contact });
      } });
      root.append(h("div", { class: "rn-gate" },
        h("div", { class: "rn-lock", "aria-hidden": "true" }, h("div", { class: "blur" }, "87 %"), h("span", {}, "🔒")),
        h("h3", {}, timeUp ? "¡Se acabó el tiempo!" : "¡Terminaste! Tu resultado está listo."),
        h("p", { class: "rn-small" }, `Respondiste ${answered} de ${n} preguntas. Completa tus datos para ver tu resultado y descargar tu informe en PDF.`),
        form,
        answered < n && !timeUp ? h("button", { class: "linkbtn", onclick: () => { st.i = a.questions.findIndex(q => !st.answers[q.id]); renderQ(); if (a.minutes) startTimer(st.left); } }, "Volver a las preguntas sin responder") : null));
    }

    // Inglés y test vocacional: resultado inmediato; los datos desbloquean el informe completo.
    async function renderOpen() {
      const a = st.attempt;
      root.innerHTML = "";
      root.append(h("div", { class: "rn-load" }, "Calculando tu resultado…"));
      try {
        const out = await post("/api/quiz/grade", { quiz: a.quiz, level: a.level, answers: answers() });
        finished();
        renderResult(root, out, { ...ctx, unlock: async contact => {
          const full = await post("/api/quiz/report", { quiz: a.quiz, level: a.level, contact, answers: answers() });
          if (window.gtag) window.gtag("event", "generate_lead", { quiz: a.quiz, level: a.level });
          await (a.kind === "vocational" ? FWPdf.vocational : FWPdf.score)(full.result, contact);
        } });
      } catch (err) { error(err.message); }
    }
  }

  // ---------- Resultados ----------
  function renderResult(root, out, { contact, onRetry, onExit, unlock } = {}) {
    const r = out.result;
    root.classList.add("runner");
    root.innerHTML = "";
    const ctaRow = h("div", { class: "row" },
      h("a", { class: "btn" + (unlock ? " o" : ""), href: out.waUrl, target: "_blank", rel: "noopener" }, r.cta.text),
      onRetry ? h("button", { class: "btn o", onclick: onRetry }, r.kind === "vocational" ? "Repetir el test" : "Practicar otra vez") : null,
      onExit ? h("button", { class: "linkbtn", onclick: onExit }, "Elegir otro") : null);

    // Bloque de descarga: con datos ya validados (gate) o pidiéndolos (open).
    const downloadBox = () => {
      if (!unlock) {
        const b = h("button", { class: "btn", onclick: async () => { b.disabled = true; b.textContent = "Generando PDF…"; try { await FWPdf.score(r, contact); b.textContent = "✓ Informe descargado"; } catch (e) { b.textContent = "Reintentar descarga"; } b.disabled = false; } }, "Descargar mi informe (PDF)");
        return h("div", { class: "rn-download" }, h("b", {}, "📄 Tu informe en PDF"), h("p", {}, "Con tus gráficos, el detalle por sección y tu plan de mejora."), b);
      }
      const box = h("div", { class: "rn-download" });
      const vocational = r.kind === "vocational";
      const form = contactForm({ button: "Descargar informe completo (PDF)", onSubmit: async c => {
        await unlock(c);
        box.innerHTML = "";
        box.append(h("b", {}, "✓ Tu informe se descargó"), h("p", {}, "Revisa la carpeta de descargas de tu dispositivo."),
          h("button", { class: "linkbtn", onclick: () => unlock(c) }, "Descargar otra vez"));
      } });
      box.append(
        h("b", {}, vocational ? "📄 Informe vocacional completo" : "📄 ¿Cuáles respondiste mal?"),
        h("p", {}, vocational
          ? "Descarga gratis tu informe en PDF: tus áreas de mayor destreza (salud, educación, ingenierías, negocios…), tu personalidad, tus valores laborales, tu preparación para decidir con consejos y las 15 carreras más afines a ti."
          : `Descarga gratis tu informe completo en PDF: cada pregunta con tu respuesta, la respuesta correcta y la explicación${r.wrongCount ? ` de tus ${r.wrongCount} errores` : ""}.`),
        form);
      return box;
    };

    if (r.kind === "vocational") {
      root.append(
        h("div", { class: "rn-res-head" }, h("div", { class: "rn-top" },
          h("span", { class: "rn-small" }, "La carrera que más te conviene"),
          h("div", { class: "rn-topname" }, r.top.name),
          h("span", { class: "rn-sec" }, r.top.area), h("span", { class: "rn-fitbig" }, `${r.top.fit} % de afinidad`))),
        h("p", { class: "rn-small", style: "margin-top:14px" }, `Analizamos ${r.allCareers} carreras de pregrado que se ofertan en el Ecuador según tus intereses, tu forma de ser y lo que buscas en un trabajo. ${r.message}`),
        h("div", { class: "rn-bars" },
          h("div", { class: "rn-barrow" }, h("div", { class: "rn-barlbl" }, h("b", {}, "Tu preparación para decidir"), h("span", {}, `${r.readiness} % · ${r.readinessLabel}`)), h("div", { class: "bar" }, h("i", { style: `width:${r.readiness}%` })))),
        h("p", { class: "rn-small" }, `Lo que más valoras en un trabajo: ${r.topValues.join(", ")}.`),
        h("h3", { class: "rn-h" }, "También van contigo"),
        h("div", { class: "rn-careers" }, r.careers.slice(1, 3).map((c, i) => h("div", { class: "rn-career" }, h("span", { class: "n" }, i + 2), h("div", {}, h("b", {}, c.name), h("span", { class: "rn-small" }, c.area)), h("span", { class: "fit" }, c.fit + " %")))),
        downloadBox(), ctaRow);
      return;
    }

    const ring = h("div", { class: "rn-ring", style: `--p:${r.pct};--c:${bandColor(r.pct)}` }, h("b", {}, r.pct + "%"), h("span", {}, `${r.correct}/${r.total}`));
    root.append(
      h("div", { class: "rn-res-head" }, ring, h("div", {}, h("span", { class: "rn-small" }, `${r.title} · ${r.label}`), h("div", { class: "rn-band" }, r.band), h("p", {}, r.message))),
      r.topics ? h("h3", { class: "rn-h" }, `Resultado por tema · ${r.sections[0].name}`) : null,
      h("div", { class: "rn-bars" }, (r.topics || r.sections).map(s => h("div", { class: "rn-barrow" },
        h("div", { class: "rn-barlbl" }, h("b", {}, s.name), h("span", {}, `${s.correct}/${s.total} · ${s.advice}`)),
        h("div", { class: "bar" }, h("i", { style: `width:${Math.max(3, s.pct)}%;background:${bandColor(s.pct)}` }))))),
      r.review?.length ? h("h3", { class: "rn-h" }, "Revisemos algunos errores") : null,
      ...(r.review || []).map(x => h("div", { class: "rn-review" }, h("span", { class: "rn-sec" }, x.section), h("p", {}, h("b", {}, x.prompt)), h("p", {}, "Tu respuesta: ", h("span", { class: "bad" }, x.yours)), h("p", {}, "Correcta: ", h("span", { class: "good" }, x.correct)), x.explain ? h("p", { class: "rn-small" }, x.explain) : null)),
      r.locked ? h("div", { class: "rn-upsell" }, h("b", {}, `🔒 ${r.locked} errores más con su explicación paso a paso`), h("p", {}, upsellText(r))) : null,
      downloadBox(), ctaRow);
  }

  function upsellText(r) {
    if (r.quiz === "diagnostico") return `Los revisamos contigo en tu primera clase de nivelación${r.weak.length ? `, empezando por ${r.weak.slice(0, 2).join(" y ")}` : ""}.`;
    return "Este simulador tiene solo el 25 % de la prueba real. En el preuniversitario haces simulacros completos y cronometrados, con la explicación de cada pregunta.";
  }

  window.FWQuiz = { mount, renderResult, contactForm };
})();
