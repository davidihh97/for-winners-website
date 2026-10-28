/* ===== INFORMES EN PDF =====
   FWPdf.score(result, contact) · FWPdf.vocational(result, contact) · FWPdf.guide(contact)
   Se generan en el navegador con jsPDF (js/vendor) y se descargan; no se envían por ningún medio. */
(function () {
  const FW = {
    address: "Av. Teodoro Gómez de la Torre 746 y Calixto Miranda, Ibarra, Ecuador",
    hours: "Lunes a sábado, de 9:00 a 20:00",
    social: "TikTok e Instagram: @forwinnersec",
    wa: typeof WA_NUMBER !== "undefined" ? WA_NUMBER : "593999769785",
  };
  const C = { navy: [11, 42, 91], blue: [46, 107, 209], gold: [201, 161, 59], ink: [29, 29, 31], mut: [110, 110, 115], light: [245, 245, 247], line: [222, 222, 228], ok: [31, 157, 85], bad: [214, 69, 69], mid: [201, 161, 59], white: [255, 255, 255] };
  const W = 210, H = 297, M = 16;

  // Las fuentes estándar de PDF solo cubren Latin-1: se traducen los símbolos matemáticos.
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
  const MAP = { "−": "-", "–": "-", "—": "-", "→": "->", "≥": ">=", "≤": "<=", "≠": "!=", "≈": "~", "π": "pi", "√": "raiz ", "∫": "integral ", "∞": "infinito", "Δ": "delta ", "θ": "theta", "μ": "micro", "µ": "micro", "…": "...", "’": "'", "‘": "'", "“": '"', "”": '"', "•": "-", "⊕": "(+)", "∄": "no existe", "ⁿ": "^n", "⁻": "^-", "Ω": " ohm", "·": "·", "₁": "1" };
  const t = s => String(s ?? "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => "^" + [...m].map(c => SUP.indexOf(c)).join(""))
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => String(SUB.indexOf(c)))
    .replace(/[^\u0000-ÿ]/g, c => MAP[c] ?? "")
    .replace(/\s+\n/g, "\n");

  let loading = null;
  function ensure() {
    if (window.jspdf && window.jspdf.jsPDF.API.autoTable) return Promise.resolve();
    const load = src => new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => ko(new Error("No se pudo cargar el generador de PDF")); document.head.append(s); });
    loading ||= load("js/vendor/jspdf.umd.min.js").then(() => load("js/vendor/jspdf.plugin.autotable.min.js"));
    return loading;
  }

  // ---------- piezas de diseño ----------
  function newDoc() {
    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
    doc.setLineHeightFactor(1.3);
    return doc;
  }
  const fill = (doc, c) => doc.setFillColor(...c);
  const color = (doc, c) => doc.setTextColor(...c);
  const font = (doc, size, style = "normal") => { doc.setFont("helvetica", style); doc.setFontSize(size); };

  function header(doc, title, subtitle) {
    fill(doc, C.navy); doc.rect(0, 0, W, 40, "F");
    fill(doc, C.gold); doc.rect(0, 40, W, 1.6, "F");
    font(doc, 22, "bold"); color(doc, C.white); doc.text("FOR", M, 18);
    color(doc, C.gold); doc.text("WINNERS", M + doc.getTextWidth("FOR "), 18);
    font(doc, 8.5); color(doc, [214, 226, 250]); doc.text("CENTRO EDUCATIVO · PREUNIVERSITARIO · IBARRA", M, 25);
    font(doc, 13, "bold"); color(doc, C.white); doc.text(t(title), W - M, 17, { align: "right" });
    font(doc, 9.5); color(doc, [214, 226, 250]); doc.text(t(subtitle), W - M, 24, { align: "right", maxWidth: 110 });
  }
  function footer(doc) {
    const n = doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setDrawColor(...C.line); doc.line(M, H - 20, W - M, H - 20);
      font(doc, 7.5); color(doc, C.mut);
      doc.text(t(`For Winners · ${FW.address}`), M, H - 15);
      doc.text(t(`${FW.hours} · WhatsApp +${FW.wa} · ${FW.social}`), M, H - 11);
      doc.text(`Página ${i} de ${n}`, W - M, H - 11, { align: "right" });
    }
  }
  function personBlock(doc, y, name, line2) {
    fill(doc, C.light); doc.roundedRect(M, y, W - 2 * M, 20, 3, 3, "F");
    font(doc, 8.5); color(doc, C.mut); doc.text("INFORME DE", M + 6, y + 7);
    font(doc, 15, "bold"); color(doc, C.ink); doc.text(t(name), M + 6, y + 14.5);
    font(doc, 9); color(doc, C.mut);
    doc.text(t(line2), W - M - 6, y + 8, { align: "right" });
    doc.text(new Date().toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" }), W - M - 6, y + 14.5, { align: "right" });
    return y + 26;
  }
  function sectionTitle(doc, y, text) {
    fill(doc, C.gold); doc.rect(M, y - 4.2, 2.2, 6, "F");
    font(doc, 13, "bold"); color(doc, C.navy); doc.text(t(text), M + 5, y);
    return y + 6;
  }
  function tile(doc, x, y, w, h, label, value, c = C.navy) {
    doc.setDrawColor(...C.line); fill(doc, C.white); doc.roundedRect(x, y, w, h, 3, 3, "FD");
    font(doc, 8); color(doc, C.mut); doc.text(t(label).toUpperCase(), x + 5, y + 7);
    font(doc, 17, "bold"); color(doc, c); doc.text(t(value), x + 5, y + h - 6, { maxWidth: w - 8 });
  }
  const levelColor = p => (p >= 80 ? C.ok : p >= 50 ? C.mid : C.bad);
  function arc(doc, cx, cy, r1, r2, a0, a1, c) {
    const steps = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.05));
    const pts = [];
    for (let i = 0; i <= steps; i++) { const a = a0 + ((a1 - a0) * i) / steps; pts.push([cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)]); }
    for (let i = steps; i >= 0; i--) { const a = a0 + ((a1 - a0) * i) / steps; pts.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); }
    poly(doc, pts, c, "F");
  }
  function poly(doc, pts, c, style) {
    const d = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
    if (c) fill(doc, c);
    doc.lines(d, pts[0][0], pts[0][1], [1, 1], style, true);
  }
  function donut(doc, cx, cy, r, pct, label) {
    const start = -Math.PI / 2;
    arc(doc, cx, cy, r * 0.68, r, 0, Math.PI * 2, C.light);
    if (pct > 0) arc(doc, cx, cy, r * 0.68, r, start, start + (Math.PI * 2 * Math.min(100, pct)) / 100, levelColor(pct));
    font(doc, 20, "bold"); color(doc, C.ink); doc.text(`${pct}%`, cx, cy + 2, { align: "center" });
    font(doc, 7.5); color(doc, C.mut); doc.text(t(label), cx, cy + 7.5, { align: "center" });
  }
  function bars(doc, x, y, w, rows, opts = {}) {
    const labelW = opts.labelW || 52, rowH = opts.rowH || 9;
    rows.forEach((r, i) => {
      const yy = y + i * rowH;
      font(doc, 9, "bold"); color(doc, C.ink); doc.text(t(r.label), x, yy + 4, { maxWidth: labelW - 2 });
      fill(doc, C.light); doc.roundedRect(x + labelW, yy, w - labelW - 14, 5, 2.5, 2.5, "F");
      const bw = Math.max(2, ((w - labelW - 14) * Math.min(100, r.pct)) / 100);
      fill(doc, r.color || levelColor(r.pct)); doc.roundedRect(x + labelW, yy, bw, 5, 2.5, 2.5, "F");
      font(doc, 9, "bold"); color(doc, C.ink); doc.text(`${r.pct}%`, x + w, yy + 4, { align: "right" });
      if (r.note) {
        font(doc, 7.5); color(doc, C.mut);
        const lines = doc.splitTextToSize(t(r.note), w - labelW - 14);
        doc.text(lines[0] + (lines.length > 1 ? "..." : ""), x + labelW, yy + 8.3);
      }
    });
    return y + rows.length * rowH;
  }
  function radar(doc, cx, cy, r, items) {
    const n = items.length, ang = i => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    doc.setDrawColor(...C.line); doc.setLineWidth(0.25);
    for (const k of [0.25, 0.5, 0.75, 1]) poly(doc, items.map((_, i) => [cx + r * k * Math.cos(ang(i)), cy + r * k * Math.sin(ang(i))]), null, "S");
    items.forEach((_, i) => doc.line(cx, cy, cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))));
    doc.setGState(new doc.GState({ opacity: 0.35 }));
    poly(doc, items.map((it, i) => [cx + (r * it.pct / 100) * Math.cos(ang(i)), cy + (r * it.pct / 100) * Math.sin(ang(i))]), C.blue, "F");
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(...C.navy); doc.setLineWidth(0.6);
    poly(doc, items.map((it, i) => [cx + (r * it.pct / 100) * Math.cos(ang(i)), cy + (r * it.pct / 100) * Math.sin(ang(i))]), null, "S");
    doc.setLineWidth(0.2);
    items.forEach((it, i) => {
      const lx = cx + (r + 7) * Math.cos(ang(i)), ly = cy + (r + 7) * Math.sin(ang(i));
      font(doc, 8, "bold"); color(doc, C.navy); doc.text(t(it.label), lx, ly, { align: Math.abs(Math.cos(ang(i))) < 0.2 ? "center" : Math.cos(ang(i)) > 0 ? "left" : "right" });
      font(doc, 7.5); color(doc, C.mut); doc.text(`${it.pct}%`, lx, ly + 3.6, { align: Math.abs(Math.cos(ang(i))) < 0.2 ? "center" : Math.cos(ang(i)) > 0 ? "left" : "right" });
    });
  }
  function textBox(doc, y, title, body, c = C.gold) {
    font(doc, 10);
    const lines = doc.splitTextToSize(t(body), W - 2 * M - 12);
    const h = 12 + lines.length * 4.6;
    if (y + h > H - 26) { doc.addPage(); y = 20; }
    doc.setDrawColor(...c); doc.setLineWidth(0.6); doc.setLineDashPattern([1.5, 1.2], 0);
    doc.roundedRect(M, y, W - 2 * M, h, 3, 3, "S");
    doc.setLineDashPattern([], 0); doc.setLineWidth(0.2);
    font(doc, 10.5, "bold"); color(doc, C.navy); doc.text(t(title), M + 6, y + 7);
    font(doc, 10); color(doc, C.ink); doc.text(lines, M + 6, y + 12.5);
    return y + h + 6;
  }
  function ensureSpace(doc, y, need) { if (y + need > H - 26) { doc.addPage(); return 20; } return y; }
  const table = (doc, y, opts) => {
    doc.autoTable({
      startY: y, margin: { left: M, right: M, bottom: 26 }, theme: "grid",
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 2.2, lineColor: C.line, lineWidth: 0.15, textColor: C.ink, valign: "middle" },
      headStyles: { fillColor: C.navy, textColor: C.white, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 250, 252] },
      ...opts,
      head: opts.head.map(r => r.map(t)), body: opts.body.map(r => r.map(c => (typeof c === "object" && c ? { ...c, content: t(c.content) } : t(c)))),
    });
    return doc.lastAutoTable.finalY + 8;
  };
  const fileName = (prefix, name) => `${prefix}-${String(name).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`;

  // ---------- informe de puntaje (diagnóstico, inglés, simuladores) ----------
  async function score(r, contact) {
    await ensure();
    const doc = newDoc();
    header(doc, "Informe de resultados", `${r.title} · ${r.label}`);
    let y = personBlock(doc, 48, contact.name, r.title);
    // indicadores
    const tw = (W - 2 * M - 8) / 3;
    tile(doc, M, y, tw, 22, "Puntaje", `${r.pct}%`, levelColor(r.pct));
    tile(doc, M + tw + 4, y, tw, 22, "Respuestas correctas", `${r.correct} de ${r.total}`);
    tile(doc, M + 2 * (tw + 4), y, tw, 22, "Nivel alcanzado", r.band);
    y += 30;
    y = sectionTitle(doc, y, "Resultado general");
    donut(doc, M + 26, y + 26, 24, r.pct, "de aciertos");
    const ry = y + 6;
    font(doc, 10); color(doc, C.ink);
    const msg = doc.splitTextToSize(t(r.message), W - 2 * M - 64);
    doc.text(msg, M + 62, ry + 4);
    let yy = ry + 6 + msg.length * 4.8;
    if (r.strong?.length) { font(doc, 9, "bold"); color(doc, C.ok); doc.text(t("Fortalezas: " + r.strong.join(", ")), M + 62, yy + 2, { maxWidth: W - 2 * M - 64 }); yy += 6; }
    if (r.weak?.length) { font(doc, 9, "bold"); color(doc, C.bad); doc.text(t("A reforzar: " + r.weak.join(", ")), M + 62, yy + 2, { maxWidth: W - 2 * M - 64 }); }
    y += 58;
    const parts = r.topics || r.sections;
    y = ensureSpace(doc, y, parts.length * 12 + 36);
    y = sectionTitle(doc, y, r.topics ? `Resultado por tema · ${r.sections[0].name}` : "Resultado por sección");
    y = bars(doc, M, y + 1, W - 2 * M, parts.map(s => ({ label: s.name, pct: s.pct, note: `${s.correct} de ${s.total} · ${s.advice}` })), { rowH: 12, labelW: 60 }) + 2;
    y = table(doc, y, {
      head: [[r.topics ? "Tema" : "Sección", "Correctas", "Total", "Porcentaje", "Diagnóstico"]],
      body: parts.map(s => [s.name, s.correct, s.total, `${s.pct}%`, { content: s.advice, styles: { textColor: levelColor(s.pct), fontStyle: "bold" } }]),
      columnStyles: { 1: { halign: "center" }, 2: { halign: "center" }, 3: { halign: "center" } },
    });

    const items = r.items || r.review || [];
    if (items.length) {
      y = ensureSpace(doc, y, 40);
      y = sectionTitle(doc, y, r.items ? "Revisión completa de tus respuestas" : "Revisión de algunos errores");
      y = table(doc, y + 1, {
        head: [["N.°", "Pregunta y explicación", "Tu respuesta", "Respuesta correcta", ""]],
        body: items.map((it, i) => [
          i + 1,
          `${it.passage ? `[Lectura: ${it.passage}] ` : ""}${it.prompt}${it.explain ? `\nExplicación: ${it.explain}` : ""}`,
          it.yours, it.correct,
          { content: it.ok ? "Bien" : "Mal", styles: { textColor: it.ok ? C.ok : C.bad, fontStyle: "bold", halign: "center" } },
        ]),
        columnStyles: { 0: { cellWidth: 10, halign: "center" }, 1: { cellWidth: 86 }, 2: { cellWidth: 32 }, 3: { cellWidth: 32 }, 4: { cellWidth: 18 } },
      });
      if (r.locked) y = textBox(doc, y, `${r.locked} errores más por revisar`, "Los revisamos contigo, uno por uno y con su explicación paso a paso, en tu primera clase en For Winners.");
    }
    y = textBox(doc, y, "Tu siguiente paso", recommendation(r));
    contactBox(doc, y, r.cta.text);
    footer(doc);
    doc.save(fileName(`Informe-${r.quiz}`, contact.name));
  }

  function recommendation(r) {
    const weak = r.weak?.length ? r.weak.slice(0, 3).join(", ") : "";
    if (r.quiz === "diagnostico") return `Con una nivelación personalizada trabajamos ${weak ? "primero " + weak + ", " : ""}con explicaciones claras, ejercicios guiados y seguimiento semanal para que mejores tus notas.`;
    if (r.quiz === "ingles") return `En nuestros cursos de inglés por niveles (A1 a C1) practicas grammar, writing, reading, listening y speaking con un profesor que corrige tus errores${weak ? ", empezando por " + weak : ""}.`;
    return `Este simulador tiene el 25 % de la prueba real. En el preuniversitario de For Winners haces simulacros completos y cronometrados, con la explicación de cada pregunta${weak ? " y refuerzo en " + weak : ""}.`;
  }
  function contactBox(doc, y, cta) {
    y = ensureSpace(doc, y, 34);
    fill(doc, C.navy); doc.roundedRect(M, y, W - 2 * M, 30, 3, 3, "F");
    font(doc, 12, "bold"); color(doc, C.gold); doc.text(t(cta), M + 6, y + 9);
    font(doc, 9); color(doc, C.white);
    doc.text(t(`WhatsApp: +${FW.wa}`), M + 6, y + 16);
    doc.text(t(FW.address), M + 6, y + 21);
    doc.text(t(`${FW.hours} · ${FW.social}`), M + 6, y + 26);
  }

  // ---------- informe vocacional ----------
  async function vocational(r, contact) {
    await ensure();
    const doc = newDoc();
    header(doc, "Informe vocacional", "Test de intereses · modelo RIASEC");
    let y = personBlock(doc, 48, contact.name, `Código vocacional: ${r.code}`);
    // carrera recomendada
    fill(doc, C.navy); doc.roundedRect(M, y, W - 2 * M, 30, 3, 3, "F");
    font(doc, 8.5); color(doc, [214, 226, 250]); doc.text("CARRERA MÁS RECOMENDADA PARA TI", M + 6, y + 8);
    font(doc, 18, "bold"); color(doc, C.white); doc.text(t(r.top.name), M + 6, y + 17, { maxWidth: W - 2 * M - 50 });
    font(doc, 9.5); color(doc, C.gold); doc.text(t(r.top.area), M + 6, y + 24);
    font(doc, 24, "bold"); color(doc, C.gold); doc.text(`${r.top.fit}%`, W - M - 6, y + 17, { align: "right" });
    font(doc, 8); color(doc, [214, 226, 250]); doc.text("afinidad", W - M - 6, y + 23, { align: "right" });
    y += 38;
    y = sectionTitle(doc, y, "Tu perfil vocacional");
    radar(doc, M + 42, y + 36, 27, r.profile.slice().sort((a, b) => "RIASEC".indexOf(a.code) - "RIASEC".indexOf(b.code)).map(p => ({ label: p.name, pct: p.pct })));
    font(doc, 10); color(doc, C.ink);
    doc.text(doc.splitTextToSize(t(r.message), 92), W - M - 92, y + 6);
    bars(doc, W - M - 92, y + 20, 92, r.profile.map((p, i) => ({ label: p.name, pct: p.pct, color: i < 3 ? C.navy : [200, 207, 222] })), { labelW: 30, rowH: 8 });
    y += 80;
    y = sectionTitle(doc, y, "Otras carreras muy afines a ti");
    const cw = (W - 2 * M - 4) / 2;
    r.careers.slice(1, 3).forEach((c, i) => {
      const x = M + i * (cw + 4);
      doc.setDrawColor(...C.line); fill(doc, C.white); doc.roundedRect(x, y, cw, 22, 3, 3, "FD");
      font(doc, 11, "bold"); color(doc, C.ink); doc.text(t(c.name), x + 5, y + 9, { maxWidth: cw - 26 });
      font(doc, 8.5); color(doc, C.mut); doc.text(t(c.area), x + 5, y + 17);
      font(doc, 14, "bold"); color(doc, C.ok); doc.text(`${c.fit}%`, x + cw - 5, y + 12, { align: "right" });
    });
    doc.addPage();
    y = 20;
    y = sectionTitle(doc, y, "Áreas en las que tienes mayor destreza");
    font(doc, 9.5); color(doc, C.mut); doc.text(t("Afinidad promedio con las tres carreras más compatibles de cada área."), M + 5, y + 1);
    y = bars(doc, M, y + 7, W - 2 * M, r.areas.map((a, i) => ({ label: a.area, pct: a.pct, color: i < 3 ? C.navy : [160, 172, 196], note: a.careers.join(" · ") })), { labelW: 58, rowH: 11.5 }) + 4;
    y = sectionTitle(doc, y, "Tus destrezas principales");
    y = table(doc, y + 1, {
      head: [["Tipo", "Afinidad", "Destreza", "Qué significa"]],
      body: r.profile.map(p => [{ content: p.name, styles: { fontStyle: "bold" } }, `${p.pct}%`, p.skill, p.desc]),
      columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 18, halign: "center" }, 2: { cellWidth: 48 } },
    });
    doc.addPage(); y = 20;
    y = sectionTitle(doc, y, `Las 15 carreras más afines (de ${r.allCareers} carreras de pregrado del Ecuador)`);
    y = table(doc, y + 1, {
      head: [["N.°", "Carrera", "Área", "Código", "Afinidad"]],
      body: r.careers.map((c, i) => [i + 1, { content: c.name, styles: { fontStyle: i < 3 ? "bold" : "normal" } }, c.area, c.code, `${c.fit}%`]),
      columnStyles: { 0: { cellWidth: 11, halign: "center" }, 3: { cellWidth: 17, halign: "center" }, 4: { cellWidth: 40 } },
      didDrawCell: d => {
        if (d.section === "body" && d.column.index === 4) {
          const pct = parseInt(r.careers[d.row.index].fit, 10);
          fill(doc, C.light); doc.rect(d.cell.x + 13, d.cell.y + d.cell.height / 2 - 1.5, 24, 3, "F");
          fill(doc, d.row.index < 3 ? C.gold : C.blue); doc.rect(d.cell.x + 13, d.cell.y + d.cell.height / 2 - 1.5, (24 * pct) / 100, 3, "F");
        }
      },
    });
    const area = r.areas[0]?.area || r.top.area;
    y = textBox(doc, y, "Recomendaciones", `Tu mayor afinidad está en el área de ${area}. Investiga el pensum de ${r.top.name} y de las otras carreras de tu lista, conversa con profesionales del área y revisa qué examen de admisión necesitas. ${simTip(area)}`);
    y = textBox(doc, y, "Nota", "Este informe es orientativo: describe tus intereses, no tus capacidades. Úsalo junto con una sesión de orientación vocacional para tomar tu decisión.", C.line);
    contactBox(doc, y, "Prepárate para tu examen de admisión con For Winners");
    footer(doc);
    doc.save(fileName("Informe-vocacional", contact.name));
  }
  function simTip(area) {
    if (/Salud/.test(area)) return "Practica con el simulador de la UTN · Ciencias de la Salud en nuestro sitio web.";
    if (/Ingenier|Ciencias exactas|Agro/.test(area)) return "Practica con el simulador de la UTN · FICA-FICAYA o con los de razonamiento (UCE, Yachay Tech).";
    if (/Educaci|Negocios|Turismo/.test(area)) return "Practica con el simulador de la UTN · FECYT-FACAE.";
    return "Practica con los simuladores de razonamiento de la UCE, UPEC o Yachay Tech.";
  }

  // ---------- guía de redacción académica (asesoría) ----------
  const STEPS = [
    ["Delimita el tema", "Pasa de un tema amplio («la contaminación») a una pregunta concreta, medible y con contexto («¿Cómo influye el tráfico vehicular en la calidad del aire del centro de Ibarra?»)."],
    ["Revisa antecedentes antes de escribir", "Lee al menos 10 a 15 fuentes académicas recientes (Google Académico, Scielo, Redalyc, repositorios universitarios) y anota qué dicen y qué falta por investigar."],
    ["Construye objetivos con verbos medibles", "Un objetivo general y tres específicos. Usa verbos como analizar, determinar, comparar o diseñar. Evita «conocer» o «entender»."],
    ["Arma el esquema antes del borrador", "Introducción, marco teórico, metodología, resultados, discusión y conclusiones. Cada capítulo debe responder a un objetivo."],
    ["Cita mientras escribes (APA 7)", "Autor y año en el texto: (Pérez, 2023). Guarda cada referencia en un gestor como Zotero o Mendeley desde el primer día."],
    ["Escribe párrafos con una sola idea", "Oración temática, desarrollo con evidencia y cierre que conecte con la siguiente idea. Entre 5 y 8 líneas por párrafo."],
  ];
  async function guide(contact, service) {
    await ensure();
    const doc = newDoc();
    header(doc, "Guía de redacción académica", "6 pasos para empezar con buen pie");
    let y = personBlock(doc, 48, contact.name, service || "Asesoría académica");
    y = sectionTitle(doc, y, "Los 6 pasos");
    STEPS.forEach(([title, body], i) => {
      font(doc, 10); const lines = doc.splitTextToSize(t(body), W - 2 * M - 18);
      y = ensureSpace(doc, y, 10 + lines.length * 4.6);
      fill(doc, C.gold); doc.circle(M + 4.5, y + 3, 4, "F");
      font(doc, 10, "bold"); color(doc, C.navy); doc.text(String(i + 1), M + 4.5, y + 4.6, { align: "center" });
      font(doc, 11, "bold"); color(doc, C.ink); doc.text(t(title), M + 13, y + 4.4);
      font(doc, 10); color(doc, C.mut); doc.text(lines, M + 13, y + 9.6);
      y += 12 + lines.length * 4.6;
    });
    y = sectionTitle(doc, ensureSpace(doc, y, 60), "Lista de verificación antes de entregar");
    y = table(doc, y + 1, {
      head: [["Revisa", "Listo"]],
      body: ["El título refleja exactamente lo que investigaste", "Cada objetivo tiene resultados que lo responden", "Todas las citas están en la lista de referencias (y viceversa)", "Las tablas y figuras están numeradas y citadas en el texto", "El formato cumple el reglamento de tu universidad", "Revisaste ortografía, similitud y uso de IA"].map(x => [x, "[  ]"]),
      columnStyles: { 1: { cellWidth: 18, halign: "center" } },
    });
    y = textBox(doc, y, "¿Quieres llegar más lejos?", "La guía completa (estructura por capítulos, plantillas de marco teórico y metodología, matriz de consistencia y preparación de la defensa) la trabajamos contigo en la asesoría académica personalizada.");
    contactBox(doc, y, "Agenda tu asesoría académica");
    footer(doc);
    doc.save(fileName("Guia-redaccion-academica", contact.name));
  }

  window.FWPdf = { score, vocational, guide, ensure, FW };
})();
