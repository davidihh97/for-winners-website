/* ===== VISTAS PREVIAS INTERACTIVAS =====
   Preguntas de muestra, ventanas de vista previa, pestañas y resultados de ejemplo.
   Las preguntas de muestra son originales y solo sirven para que el visitante vea el formato:
   no forman parte de los bancos de los simuladores.

   <div data-demo="numerico"></div>             → todas las muestras del área
   <div data-demo="numerico" data-tier="hard">  → solo avanzadas
   <div data-demo="numerico" data-switch>       → con selector Básica / Avanzada
   <button data-open="pv-x">                    → abre <dialog id="pv-x" class="sheet">
   <div data-tabs> [data-tab="a"] … [data-panel="a"] → pestañas
   <div data-mock="simulador|diagnostico|ingles|vocacional"> → resultado de ejemplo */
(function () {
  // ---------- figuras para las muestras de razonamiento abstracto ----------
  const svg = inner => `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const arrow = deg => svg(`<g transform="rotate(${deg} 30 30)"><path d="M30 48V12M18 24l12-12 12 12"/></g>`);
  const poly = (n, filled) => {
    const pts = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return `${(30 + 20 * Math.cos(a)).toFixed(1)},${(30 + 20 * Math.sin(a)).toFixed(1)}`; }).join(" ");
    return svg(`<polygon points="${pts}" ${filled ? 'fill="currentColor"' : ""}/>`);
  };

  // t: "easy" (básica) | "hard" (avanzada) · o[0] es la correcta · e: explicación · free: sin respuesta correcta
  const DEMOS = {
    verbal: [
      { t: "easy", q: "Elige el SINÓNIMO de: VELOZ", o: ["rápido", "lento", "pesado", "tranquilo"], e: "Veloz y rápido significan lo mismo: que se mueve con mucha velocidad." },
      { t: "easy", q: "Término excluido: rojo, azul, verde, mesa", o: ["mesa", "rojo", "azul", "verde"], e: "Rojo, azul y verde son colores; mesa es un objeto." },
      { t: "hard", q: "LIBRO es a BIBLIOTECA como CUADRO es a:", o: ["museo", "pintor", "marco", "color"], e: "Relación objeto–lugar donde se guarda y se exhibe: los libros en la biblioteca, los cuadros en el museo." },
      { t: "hard", q: "«Aunque el proyecto superó el presupuesto, los resultados justificaron la inversión.» Se infiere que:", o: ["Costó más de lo previsto, pero valió la pena", "El proyecto fracasó", "No hubo presupuesto", "Los resultados fueron malos"], e: "«Aunque» introduce una dificultad (gastaron más) que no impide la conclusión positiva (valió la pena)." },
    ],
    numerico: [
      { t: "easy", q: "¿Qué número continúa la serie? 4, 8, 12, 16, …", o: ["20", "18", "24", "22"], e: "Se suma 4 cada vez: 16 + 4 = 20." },
      { t: "easy", q: "Si 3 cuadernos cuestan $6, ¿cuánto cuestan 5?", o: ["$10", "$12", "$8", "$15"], e: "Cada cuaderno cuesta $2 → 5 × 2 = $10." },
      { t: "hard", q: "Un precio sube un 20 % y luego baja un 20 %. Respecto del precio inicial, el precio final es:", o: ["4 % menor", "Igual", "4 % mayor", "2 % menor"], e: "1,20 × 0,80 = 0,96 → queda un 4 % por debajo. ¡La trampa es pensar que se compensan!" },
      { t: "hard", q: "4 obreros terminan una obra en 6 días. ¿En cuántos días la terminan 3 obreros al mismo ritmo?", o: ["8", "4,5", "7", "9"], e: "Es proporción inversa: 4 × 6 = 24 jornadas de trabajo → 24 ÷ 3 = 8 días." },
    ],
    logico: [
      { t: "easy", q: "Si hoy es martes, ¿qué día será dentro de 3 días?", o: ["viernes", "jueves", "sábado", "miércoles"], e: "Martes + 3 → miércoles, jueves, viernes." },
      { t: "easy", q: "Ana es más alta que Luis y Luis es más alto que Eva. ¿Quién es la más baja?", o: ["Eva", "Ana", "Luis", "No se puede saber"], e: "Orden: Ana > Luis > Eva." },
      { t: "hard", q: "Todos los A son B. Algunos B son C. ¿Qué conclusión es SIEMPRE válida?", o: ["Ninguna de las otras", "Algunos A son C", "Todos los C son A", "Ningún A es C"], e: "Los B que son C podrían no ser A: con estas premisas no se puede concluir nada sobre A y C." },
      { t: "hard", q: "¿Cuántas personas debe haber, como mínimo, en un grupo para asegurar que dos cumplan años el mismo mes?", o: ["13", "12", "2", "24"], e: "Principio del palomar: 12 meses + 1 persona = 13." },
    ],
    abstracto: [
      { t: "easy", q: "¿Qué figura continúa la secuencia?", seq: [arrow(0), arrow(90), arrow(180)], o: [arrow(270), arrow(0), arrow(90), arrow(45)], fig: true, e: "La flecha gira 90° en el sentido del reloj en cada paso." },
      { t: "hard", q: "¿Qué figura continúa la secuencia? (cambian dos cosas a la vez)", seq: [poly(3, false), poly(4, true), poly(5, false)], o: [poly(6, true), poly(6, false), poly(5, true), poly(7, true)], fig: true, e: "Cada figura tiene un lado más (3, 4, 5 → 6) y el relleno se alterna (vacía, llena, vacía → llena)." },
    ],
    atencion: [
      { t: "easy", q: "¿Cuántas veces aparece la letra «b»?\nb d b p q b d d b", o: ["4", "3", "5", "6"], e: "Posiciones 1, 3, 6 y 9: cuatro veces." },
      { t: "hard", q: "¿Cuántos pares son EXACTAMENTE iguales (incluidas las tildes)?\nPérez Ruiz | Perez Ruiz\n47 815 | 47 815\nQuito Sur | Quito Sur\n90 316 | 90 361", o: ["2", "3", "1", "4"], e: "Solo «47 815» y «Quito Sur». «Pérez» lleva tilde en un lado y «316 / 361» cambia el orden." },
    ],
    matematica: [
      { t: "easy", q: "Resuelve: 3x − 5 = 10", o: ["x = 5", "x = 15", "x = 3", "x = −5"], e: "3x = 15 → x = 5." },
      { t: "easy", q: "¿Cuál es el 25 % de 80?", o: ["20", "25", "16", "32"], e: "25 % es la cuarta parte: 80 ÷ 4 = 20." },
      { t: "hard", q: "Calcula: lím (x→3) (x² − 9) / (x − 3)", o: ["6", "0", "3", "No existe"], e: "Factoriza: (x − 3)(x + 3) / (x − 3) = x + 3 → 3 + 3 = 6." },
      { t: "hard", q: "Calcula la integral definida: ∫ de 0 a 2 de 3x² dx", o: ["8", "12", "6", "4"], e: "La primitiva es x³: 2³ − 0³ = 8." },
    ],
    fisica: [
      { t: "easy", q: "¿Qué fuerza neta se necesita para que un cuerpo de 5 kg acelere a 2 m/s²?", o: ["10 N", "7 N", "2,5 N", "3 N"], e: "F = m · a = 5 × 2 = 10 N." },
      { t: "easy", q: "La unidad de la energía en el Sistema Internacional es el:", o: ["joule (J)", "newton (N)", "vatio (W)", "pascal (Pa)"], e: "El joule mide energía y trabajo." },
      { t: "hard", q: "Se lanza una pelota hacia arriba a 30 m/s. Con g = 10 m/s², ¿qué altura máxima alcanza?", o: ["45 m", "90 m", "30 m", "3 m"], e: "h = v² / (2g) = 900 / 20 = 45 m." },
    ],
    quimica: [
      { t: "easy", q: "El símbolo químico del oro es:", o: ["Au", "Ag", "Or", "O"], e: "Au viene del latín aurum. Ag es la plata." },
      { t: "hard", q: "¿Cuántos moles hay en 88 g de CO₂? (masa molar 44 g/mol)", o: ["2", "0,5", "44", "4"], e: "n = masa / masa molar = 88 / 44 = 2 mol." },
    ],
    biologia: [
      { t: "easy", q: "¿En qué orgánulo ocurre la fotosíntesis?", o: ["Cloroplasto", "Mitocondria", "Ribosoma", "Núcleo"], e: "El cloroplasto tiene clorofila y transforma la luz en energía química." },
      { t: "hard", q: "Si una hebra de ADN es ATG-CCA, su hebra complementaria es:", o: ["TAC-GGT", "UAC-GGU", "ATG-CCA", "GCA-TTG"], e: "En el ADN, A se une con T y C con G. (U solo aparece en el ARN)." },
    ],
    anatomia: [
      { t: "easy", q: "El hueso más largo del cuerpo humano es el:", o: ["fémur", "húmero", "tibia", "radio"], e: "El fémur, en el muslo." },
      { t: "hard", q: "¿Qué estructura separa la cavidad torácica de la abdominal y es clave en la respiración?", o: ["El diafragma", "El esternón", "La pleura", "El peritoneo"], e: "El diafragma es un músculo: al contraerse baja y entra el aire a los pulmones." },
    ],
    estadistica: [
      { t: "easy", q: "¿Cuál es la media aritmética de 4, 6 y 8?", o: ["6", "5", "7", "18"], e: "(4 + 6 + 8) ÷ 3 = 18 ÷ 3 = 6." },
      { t: "hard", q: "¿Cuál es la varianza poblacional de 2, 4 y 6?", o: ["8/3 ≈ 2,67", "4", "2", "6"], e: "Media = 4. Desvíos²: 4, 0, 4 → 8 ÷ 3 ≈ 2,67." },
    ],
    emprendimiento: [
      { t: "easy", q: "En el modelo Canvas, la «propuesta de valor» describe:", o: ["Qué problema resuelves y por qué te eligen", "Cuánto cuesta el local", "Quiénes son tus socios", "Cómo pagas a tus proveedores"], e: "Es la razón por la que un cliente te prefiere frente a la competencia." },
      { t: "hard", q: "Costos fijos: $600 al mes. Precio: $15. Costo variable: $10 por unidad. ¿Cuál es el punto de equilibrio?", o: ["120 unidades", "40 unidades", "60 unidades", "24 unidades"], e: "PE = costos fijos ÷ (precio − costo variable) = 600 ÷ 5 = 120." },
    ],
    lenguaje: [
      { t: "easy", q: "¿Qué palabra está escrita correctamente?", o: ["exhausto", "exausto", "exaústo", "hexausto"], e: "Exhausto se escribe con «xh»." },
      { t: "hard", q: "En «María regaló flores a su madre», el complemento directo es:", o: ["flores", "a su madre", "María", "regaló"], e: "Lo que se regala: «flores» (se puede cambiar por «las»: María las regaló)." },
    ],
    // Inglés por nivel
    "en-a1": [{ q: "She ___ a teacher.", o: ["is", "are", "am", "be"], e: "With he / she / it we use «is»." }, { q: "I ___ two brothers.", o: ["have", "has", "having", "am have"], e: "I / you / we / they + have." }],
    "en-a2": [{ q: "Yesterday we ___ to the beach.", o: ["went", "go", "goes", "going"], e: "Past simple of «go» is «went»." }, { q: "This book is ___ than that one.", o: ["more interesting", "interestinger", "most interesting", "more interestinger"], e: "Long adjectives use «more … than»." }],
    "en-b1": [{ q: "I ___ here since 2020.", o: ["have lived", "live", "am living", "lived"], e: "«Since» + present perfect for something that continues today." }, { q: "If it rains, we ___ at home.", o: ["will stay", "would stay", "stayed", "stay will"], e: "First conditional: if + present, will + verb." }],
    "en-b2": [{ q: "If I had known, I ___ you.", o: ["would have told", "would tell", "told", "will tell"], e: "Third conditional: if + past perfect, would have + participle." }, { q: "The bridge ___ next year.", o: ["will be built", "will build", "is building", "builds"], e: "Passive voice in the future: will be + participle." }],
    "en-c1": [{ q: "Hardly ___ the room when the phone rang.", o: ["had she entered", "she had entered", "did she entered", "she entered"], e: "Inversion after «Hardly»: auxiliary + subject." }, { q: "It is essential that every student ___ informed.", o: ["be", "is", "was", "will be"], e: "Subjunctive after «It is essential that…»: base form «be»." }],
    // Test vocacional: no hay respuestas buenas ni malas
    "voc-intereses": [{ q: "¿Cuánto te gustaría… diseñar una aplicación para resolver un problema de tu barrio?", o: ["Me encantaría", "Me gustaría", "Me da igual", "No me gustaría"], free: true, e: "Esta respuesta suma a tus intereses Investigador y Emprendedor (modelo RIASEC)." }],
    "voc-personalidad": [{ q: "¿Qué tanto te describe? «Termino lo que empiezo, aunque me cueste.»", o: ["Totalmente", "Bastante", "Un poco", "Nada"], free: true, e: "Mide tu responsabilidad, uno de los cinco grandes factores de la personalidad." }],
    "voc-valores": [{ q: "En un trabajo, ¿qué tan importante es para ti… ayudar directamente a otras personas?", o: ["Imprescindible", "Importante", "Me da igual", "Nada importante"], free: true, e: "Mide tus valores laborales: lo que necesitas de un trabajo para sentirte bien en él." }],
    "voc-adaptabilidad": [{ q: "¿Qué tan cierto es? «Ya averigüé qué materias y qué examen de admisión tiene la carrera que me interesa.»", o: ["Muy cierto", "Algo cierto", "Poco cierto", "Nada cierto"], free: true, e: "Mide tu adaptabilidad de carrera (modelo NEFELE, Savickas): qué tan preparado estás para decidir." }],
    // Nivelación por nivel
    "niv-primaria": [{ q: "Resuelve: 3/4 + 1/4", o: ["1", "4/8", "3/16", "2/4"], e: "Mismo denominador: 3 + 1 = 4 → 4/4 = 1." }, { q: "Un rectángulo mide 6 cm de largo y 4 cm de ancho. ¿Cuál es su área?", o: ["24 cm²", "20 cm²", "10 cm²", "48 cm²"], e: "Área = largo × ancho = 6 × 4." }],
    "niv-bachillerato": [{ q: "Resuelve el sistema: x + y = 10 ; x − y = 2", o: ["x = 6, y = 4", "x = 4, y = 6", "x = 8, y = 2", "x = 5, y = 5"], e: "Sumando: 2x = 12 → x = 6; y = 4." }, { q: "Un móvil recorre 120 m en 8 s a velocidad constante. ¿Cuál es su velocidad?", o: ["15 m/s", "960 m/s", "12 m/s", "8 m/s"], e: "v = d / t = 120 / 8." }],
    "niv-universidad": [{ q: "Si f(x) = x³ − 2x, ¿cuánto vale f′(2)?", o: ["10", "4", "12", "8"], e: "f′(x) = 3x² − 2 → 3·4 − 2 = 10." }, { q: "Calcula: lím (x→∞) (2x² + 1) / (x² − 3)", o: ["2", "0", "∞", "1/3"], e: "Mismo grado: cociente de los coeficientes principales, 2/1." }],
  };
  const TIER_TXT = { easy: "Básica", hard: "Avanzada" };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function demo(el) {
    const keys = el.dataset.demo.split(",").map(s => s.trim()).filter(k => DEMOS[k]);
    if (!keys.length) return;
    let tier = el.dataset.tier || "", idx = 0;
    const list = () => keys.flatMap(k => DEMOS[k]).filter(d => !tier || d.t === tier);
    el.classList.add("demo");
    const draw = () => {
      const items = list();
      if (!items.length) return;
      const d = items[idx % items.length];
      const switcher = el.hasAttribute("data-switch")
        ? `<div class="demo-switch" role="tablist">${["easy", "hard"].map(t => `<button type="button" role="tab" aria-selected="${tier === t}" class="${tier === t ? "on" : ""}" data-t="${t}">${t === "easy" ? "Pregunta básica" : "Pregunta avanzada"}</button>`).join("")}</div>` : "";
      el.innerHTML = `${switcher}<div class="demo-top"><span class="demo-lbl">${d.free ? "Ejemplo de pregunta" : "Pregunta de muestra"}</span>${d.t ? `<span class="rn-tier ${d.t}">${TIER_TXT[d.t]}</span>` : ""}</div>
        ${d.seq ? `<div class="rn-seq">${d.seq.map(s => `<div class="rn-fig">${s}</div>`).join("")}<div class="rn-fig q">?</div></div>` : ""}
        <p class="demo-q">${esc(d.q)}</p>
        <div class="rn-opts${d.fig ? " figs" : ""}">${(d.free ? (x => x) : shuffle)(d.o.map((o, i) => [o, i])).map(([o, i], k) => `<button type="button" class="opt" data-i="${i}"><span class="lt">${"ABCD"[k]}</span>${d.fig ? o : esc(o)}</button>`).join("")}</div>
        <p class="demo-fb" aria-live="polite"></p>
        ${items.length > 1 ? `<button type="button" class="linkbtn demo-next">Ver otra pregunta ›</button>` : ""}`;
      el.querySelectorAll(".demo-switch button").forEach(b => b.onclick = () => { tier = b.dataset.t; idx = 0; draw(); });
      const fb = el.querySelector(".demo-fb");
      el.querySelectorAll(".opt").forEach(b => b.onclick = () => {
        const ok = b.dataset.i === "0";
        el.querySelectorAll(".opt").forEach(x => { x.disabled = true; x.classList.remove("sel"); if (!d.free && x.dataset.i === "0") x.classList.add("ok"); });
        if (d.free) b.classList.add("sel"); else if (!ok) b.classList.add("no");
        fb.className = "demo-fb " + (d.free ? "" : ok ? "good" : "bad");
        fb.innerHTML = (d.free ? "" : ok ? "<b>¡Correcto!</b> " : "<b>Casi.</b> ") + esc(d.e || "");
      });
      const nx = el.querySelector(".demo-next");
      if (nx) nx.onclick = () => { idx++; draw(); };
    };
    if (el.hasAttribute("data-switch") && !tier) tier = "easy";
    draw();
    el._demo = { set(k) { el.dataset.demo = k; keys.splice(0, keys.length, ...k.split(",").filter(x => DEMOS[x])); idx = 0; draw(); } };
  }

  // ---------- resultados de ejemplo ----------
  const MOCKS = {
    simulador: { pct: 64, band: "En progreso", title: "Simulador Universidad Central · Razonamiento", msg: "Vas bien en las básicas, pero las avanzadas definen el cupo.", bars: [["Razonamiento verbal", 73], ["Razonamiento numérico", 55], ["Razonamiento lógico", 75], ["Razonamiento abstracto", 50]], tiers: [["Preguntas básicas", 85], ["Preguntas avanzadas", 39]] },
    diagnostico: { pct: 58, band: "En progreso", title: "Diagnóstico · Colegio · Matemática", msg: "Detectamos temas que conviene reforzar antes de que se acumulen.", bars: [["Ecuaciones lineales", 100], ["Funciones", 67], ["Sistemas de ecuaciones", 33], ["Trigonometría", 25]] },
    ingles: { pct: 80, band: "Competitivo", title: "Práctica de inglés · Grammar · B1", msg: "¡Muy bien! Estás listo para subir de nivel.", bars: [["Present perfect", 100], ["Conditionals", 75], ["Passive voice", 50]] },
  };
  const color = p => (p >= 80 ? "var(--ok)" : p >= 50 ? "var(--gold)" : "var(--bad)");
  function mock(el) {
    const k = el.dataset.mock;
    el.classList.add("mock");
    if (k === "vocacional") {
      el.innerHTML = `<span class="mock-tag">Ejemplo de resultado</span><div class="rn-top"><span class="rn-small">La carrera que más te conviene</span><div class="rn-topname">Ingeniería en Software</div><span class="rn-sec">Ingenierías y tecnología</span><span class="rn-fitbig">91 % de afinidad</span></div>
        <div class="rn-bars"><div class="rn-barrow"><div class="rn-barlbl"><b>Tu preparación para decidir</b><span>72 % · Buena</span></div><div class="bar"><i style="width:72%"></i></div></div></div>
        <h3 class="rn-h">También van contigo</h3><div class="rn-careers"><div class="rn-career"><span class="n">2</span><div><b>Ciencia de Datos</b><span class="rn-small">Ingenierías y tecnología</span></div><span class="fit">88 %</span></div><div class="rn-career"><span class="n">3</span><div><b>Telecomunicaciones</b><span class="rn-small">Ingenierías y tecnología</span></div><span class="fit">84 %</span></div><div class="rn-career locked" aria-hidden="true"><span class="n">4</span><div><b>Carrera oculta</b><span class="rn-small">En tu informe PDF</span></div><span class="fit">80 %</span></div></div>`;
      return;
    }
    const m = MOCKS[k]; if (!m) return;
    const bar = ([n, p]) => `<div class="rn-barrow"><div class="rn-barlbl"><b>${n}</b><span>${p} %</span></div><div class="bar"><i style="width:${Math.max(3, p)}%;background:${color(p)}"></i></div></div>`;
    el.innerHTML = `<span class="mock-tag">Ejemplo de resultado</span>
      <div class="rn-res-head"><div class="rn-ring" style="--p:${m.pct};--c:${color(m.pct)}"><b>${m.pct}%</b><span>de aciertos</span></div><div><span class="rn-small">${m.title}</span><div class="rn-band">${m.band}</div><p class="rn-small">${m.msg}</p></div></div>
      <div class="rn-bars">${m.bars.map(bar).join("")}</div>
      ${m.tiers ? `<h3 class="rn-h">Básicas vs. avanzadas</h3><div class="rn-bars">${m.tiers.map(bar).join("")}</div>` : ""}
      <div class="mock-pdf"><span aria-hidden="true"><svg class="i"><use href="img/icons.svg#file"></use></svg></span><div><b>Informe en PDF</b><p class="rn-small">Gráficos, detalle por ${k === "diagnostico" ? "tema" : "sección"} y plan de mejora.</p></div></div>`;
  }

  // ---------- ventanas de vista previa ----------
  function sheets() {
    document.querySelectorAll("dialog.sheet").forEach(d => {
      if (!d.querySelector(".sheet-x")) d.insertAdjacentHTML("afterbegin", '<button type="button" class="sheet-x" aria-label="Cerrar vista previa"><svg class="i" aria-hidden="true"><use href="img/icons.svg#x"></use></svg></button>');
      // Nombre accesible de la ventana: su propio título.
      const t = d.querySelector("h2, h3");
      if (t && !d.hasAttribute("aria-labelledby")) { t.id = t.id || d.id + "-t"; d.setAttribute("aria-labelledby", t.id); }
      d.querySelector(".sheet-x").onclick = () => d.close();
      d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
    });
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-open]");
      if (!b) return;
      const d = document.getElementById(b.dataset.open);
      if (!d) return;
      e.preventDefault();
      if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    });
  }

  // ---------- pestañas ----------
  let tabSeq = 0;
  function tabs(root) {
    const btns = [...root.querySelectorAll("[data-tab]")], panels = [...root.querySelectorAll("[data-panel]")];
    const uid = "tb" + ++tabSeq;
    const list = btns[0] && btns[0].parentElement;
    if (list) list.setAttribute("role", "tablist");
    const show = (k, focus) => {
      btns.forEach(b => { const on = b.dataset.tab === k; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      panels.forEach(p => { p.hidden = p.dataset.panel !== k; });
    };
    panels.forEach(p => { p.id = p.id || `${uid}-p-${p.dataset.panel}`; p.setAttribute("role", "tabpanel"); });
    btns.forEach((b, i) => {
      b.type = "button"; b.setAttribute("role", "tab"); b.id = b.id || `${uid}-t-${b.dataset.tab}`;
      const p = panels.find(x => x.dataset.panel === b.dataset.tab);
      if (p) { b.setAttribute("aria-controls", p.id); p.setAttribute("aria-labelledby", b.id); }
      b.onclick = () => show(b.dataset.tab);
      // Flechas, Inicio y Fin mueven entre pestañas (patrón ARIA de pestañas).
      b.onkeydown = e => {
        const n = btns.length, j = { ArrowRight: i + 1, ArrowLeft: i - 1 + n, Home: 0, End: n - 1 }[e.key];
        if (j == null) return;
        e.preventDefault(); show(btns[j % n].dataset.tab, true);
      };
    });
    const first = btns.find(b => b.classList.contains("on")) || btns[0];
    if (first) show(first.dataset.tab);
  }

  function mountAll(root = document) {
    root.querySelectorAll("[data-demo]").forEach(el => { if (!el._demo) demo(el); });
    root.querySelectorAll("[data-mock]").forEach(el => { if (!el.classList.contains("mock")) mock(el); });
    root.querySelectorAll("[data-tabs]").forEach(el => { if (!el._tabs) { el._tabs = true; tabs(el); } });
  }
  sheets();
  mountAll();
  window.FWPreview = { mountAll, demo, DEMOS };
})();
