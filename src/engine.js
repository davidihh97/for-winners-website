// Motor de simuladores: arma intentos sin repetir preguntas y los corrige en el servidor.
import { SOURCES } from "./lib/sources.js";
import { rng, randomSeed, shuffle } from "./lib/rand.js";
import { QUIZZES, TOPICS } from "./catalog.js";
import { scoreVocational, CAREERS } from "./vocational.js";

const MAX_TRIES = 20;

export function getLevel(quizId, levelId) {
  const quiz = QUIZZES[quizId];
  const level = quiz && quiz.levels[levelId];
  if (!level) return null;
  return { quiz, level };
}

const norm = src => (Array.isArray(src) ? { key: src[0], w: src[1] } : { key: src, w: 1 });

// Reconstruye una pregunta (con su respuesta) a partir del id.
export function buildById(id) {
  const [key, idx, seed, sub] = String(id).split("|");
  const src = SOURCES[key];
  if (!src) return null;
  try {
    if (src.kind === "gen") return src.build(null, rng(+seed));
    if (src.kind === "bank") return +idx < src.size ? src.build(+idx) : null;
    if (src.kind === "dict") return +idx < src.size ? src.build(+idx, rng(+seed)) : null;
    if (src.kind === "passage") return +idx < src.size ? src.build(+idx, null, +sub) : null;
  } catch { return null; }
  return null;
}

// Clave para recordar lo que ya vio el usuario. En preguntas generadas se recuerda el enunciado (hash).
export const seenKey = (id, q) => {
  const p = String(id).split("|");
  return p[1] === "g" ? `${p[0]}#${hash(promptKey(q))}` : `${p[0]}|${p[1]}`;
};
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

// seen: ids ya vistos por este navegador, del más antiguo al más reciente.
export function startAttempt(quizId, levelId, { sections: only, seen = [] } = {}) {
  const found = getLevel(quizId, levelId);
  if (!found) return null;
  const { quiz, level } = found;
  const seenPos = new Map(seen.map((k, i) => [k, i]));
  const usedKeys = new Set(), prompts = new Set();
  let sections = level.sections;
  // En el diagnóstico se evalúa una sola materia por intento.
  if (quiz.pickSections && only && only.length) sections = sections.filter(s => s.name === only[0]);
  if (!sections.length) sections = level.sections;

  const blocks = [];
  for (const sec of sections) {
    const srcs = sec.src.map(norm).filter(s => SOURCES[s.key]);
    let count = 0, guard = 0;
    while (count < sec.n && guard++ < sec.n * MAX_TRIES) {
      const block = pickOne(srcs, seenPos, usedKeys, prompts);
      if (!block) break;
      block.forEach(b => { b.section = sec.group || sec.name; b.group = sec.group || sec.name; });
      blocks.push(block);
      count += block.length;
    }
  }
  // Test por partes (vocacional): se respeta el orden de las partes y se mezclan las preguntas dentro de cada una.
  let ordered = shuffle(blocks);
  if (quiz.ordered) { const groups = [...new Set(sections.map(s => s.group || s.name))]; ordered = groups.flatMap(g => ordered.filter(b => b[0].group === g)); }
  const questions = ordered.flat().map(toClient);
  return {
    quiz: quizId, level: levelId, title: quiz.title, kind: quiz.kind, flow: quiz.flow || "gate", label: level.label,
    minutes: level.minutes || 0, questions,
  };
}

function pickOne(srcs, seenPos, usedKeys, prompts) {
  // Fuentes con preguntas nunca vistas (los generadores siempre cuentan como nuevas) tienen prioridad.
  const info = srcs.map(s => {
    const src = SOURCES[s.key];
    if (src.kind === "gen") return { s, fresh: true, free: 1 };
    const free = freeIndexes(s.key, src, usedKeys);
    return { s, free: free.length, fresh: free.some(i => !seenPos.has(`${s.key}|${i}`)) };
  }).filter(x => x.free);
  const anyFresh = info.some(x => x.fresh);
  const weighted = info.map(x => ({ s: x.s, w: x.s.w * (x.fresh || !anyFresh ? 1 : 0.05) }));
  if (!weighted.length) return null;

  for (let t = 0; t < MAX_TRIES; t++) {
    const s = weightedPick(weighted);
    const src = SOURCES[s.key];
    if (src.kind === "gen") {
      const seed = randomSeed();
      const q = src.build(null, rng(seed));
      if (prompts.has(promptKey(q))) continue;
      if (t < MAX_TRIES - 2 && seenPos.has(seenKey(`${s.key}|g|${seed}`, q))) continue;
      prompts.add(promptKey(q));
      return [{ id: `${s.key}|g|${seed}`, q }];
    }
    const free = freeIndexes(s.key, src, usedKeys);
    if (!free.length) continue;
    // Primero las nunca vistas (al azar); si no quedan, la que se vio hace más tiempo.
    const unseen = free.filter(i => !seenPos.has(`${s.key}|${i}`));
    const idx = unseen.length ? unseen[Math.floor(Math.random() * unseen.length)]
      : free.sort((a, b) => seenPos.get(`${s.key}|${a}`) - seenPos.get(`${s.key}|${b}`))[0];
    usedKeys.add(`${s.key}|${idx}`);
    if (src.kind === "passage") {
      return shuffle(Array.from({ length: src.count(idx) }, (_, sub) => ({ id: `${s.key}|${idx}|0|${sub}`, q: src.build(idx, null, sub) })));
    }
    const seed = randomSeed();
    const id = src.kind === "dict" ? `${s.key}|${idx}|${seed}` : `${s.key}|${idx}`;
    const q = src.kind === "dict" ? src.build(idx, rng(seed)) : src.build(idx);
    prompts.add(promptKey(q));
    return [{ id, q }];
  }
  return null;
}

const promptKey = q => q.prompt + (q.svg ? q.svg.join("") : "") + (q.figure || "");
const freeIndexes = (key, src, used) => Array.from({ length: src.size }, (_, i) => i).filter(i => !used.has(`${key}|${i}`));
function weightedPick(list) {
  let x = Math.random() * list.reduce((a, b) => a + b.w, 0);
  for (const it of list) if ((x -= it.w) <= 0) return it.s;
  return list[list.length - 1].s;
}

function toClient({ id, q, section }) {
  const type = q.type || "mc";
  const out = { id, sk: seenKey(id, q), section, type, prompt: q.prompt };
  if (q.passage) { out.passage = q.passage; out.passageTitle = q.passageTitle; }
  if (q.svg) out.svg = q.svg;
  if (q.figure) out.figure = q.figure;
  if (q.optionsSvg) out.optionsSvg = true;
  if (type === "mc") out.options = q.keepOrder ? q.options.slice() : shuffle(q.options);
  if (type === "order") {
    let tokens = q.answer.split(/\s+/);
    for (let i = 0; i < 5; i++) { tokens = shuffle(tokens); if (tokens.join(" ") !== q.answer) break; }
    out.tokens = tokens;
  }
  return out;
}

// ---------------- Corrección ----------------
export const normText = s => String(s ?? "").normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, " ").replace(/[\s.!?,;:]+$/g, "").trim();

function isCorrect(q, value) {
  const type = q.type || "mc";
  if (value == null || value === "") return false;
  if (type === "text") return q.accept.some(a => normText(a) === normText(value));
  if (type === "order") return normText(q.answer) === normText(value);
  if (q.optionsSvg) return String(value) === q.options[0];
  return normText(value) === normText(q.options[0]);
}

const correctText = q => (q.type === "text" ? q.accept[0] : q.type === "order" ? q.answer : q.options[0]);

// Mapa clave de fuente → sección, para no confiar en lo que envía el navegador.
function sectionMap(level) {
  const m = new Map();
  for (const s of level.sections) for (const src of s.src) { const k = norm(src).key; if (!m.has(k)) m.set(k, s.name); }
  return m;
}

// mode: "gate" (resultado con revisión parcial), "summary" (solo puntajes, sin datos de contacto)
// o "full" (informe completo para descargar en PDF).
export function gradeAttempt(quizId, levelId, answers /* [{id, a}] */, mode = "gate") {
  const found = getLevel(quizId, levelId);
  if (!found) return null;
  const { quiz, level } = found;
  const secOf = sectionMap(level);
  const seen = new Set();
  const graded = [];
  for (const { id, a } of answers.slice(0, 80)) {
    if (seen.has(id)) continue;
    seen.add(id);
    const key = String(id).split("|")[0];
    const section = secOf.get(key);
    if (!section) continue;
    const q = buildById(id);
    if (!q) continue;
    graded.push({ id, section, q, a: typeof a === "string" ? a.slice(0, 300) : "", ok: isCorrect(q, a) });
  }
  if (!graded.length) return null;
  const base = { quiz: quizId, level: levelId, title: quiz.title, label: level.label, kind: quiz.kind, cta: quiz.cta, mode };
  return quiz.kind === "vocational" ? vocationalResult(base, graded, mode) : scoreResult(base, quiz, level, graded, mode);
}

const band = pct => pct >= 85 ? "Sobresaliente" : pct >= 70 ? "Competitivo" : pct >= 50 ? "En progreso" : "Inicial";
const sectionAdvice = pct => pct >= 80 ? "Buen dominio" : pct >= 50 ? "Refuerzo recomendado" : "Necesita apoyo";

function scoreResult(base, quiz, level, graded, mode) {
  const order = level.sections.map(s => s.name);
  const bySec = new Map();
  for (const g of graded) {
    const s = bySec.get(g.section) || { name: g.section, correct: 0, total: 0 };
    s.total++; if (g.ok) s.correct++;
    bySec.set(g.section, s);
  }
  const sections = [...bySec.values()].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
    .map(s => ({ ...s, pct: Math.round((s.correct / s.total) * 100), advice: sectionAdvice((s.correct / s.total) * 100) }));
  const correct = graded.filter(g => g.ok).length, total = graded.length;
  const pct = Math.round((correct / total) * 100);
  const weak = sections.filter(s => s.pct < 70).sort((a, b) => a.pct - b.pct).map(s => s.name);
  const strong = sections.filter(s => s.pct >= 80).map(s => s.name);
  const wrong = graded.filter(g => !g.ok);
  const isFig = q => q.optionsSvg || q.svg || q.figure;
  const detail = g => ({
    section: g.section, ok: g.ok, prompt: isFig(g.q) ? "Pregunta de figuras (razonamiento abstracto o espacial)" : g.q.prompt,
    passage: g.q.passageTitle || "",
    yours: isFig(g.q) ? (g.a ? (g.ok ? "Figura correcta" : "Figura incorrecta") : "Sin responder") : g.a || "Sin responder",
    correct: isFig(g.q) ? "Se revisa en clase" : correctText(g.q), explain: g.q.explain || "",
  });
  const out = {
    ...base, correct, total, pct, band: band(pct), sections, weak, strong, wrongCount: wrong.length,
    real: level.real || null, message: scoreMessage(base.quiz, pct, weak),
  };
  if (quiz.pickSections) {
    const by = new Map();
    for (const g of graded) {
      const name = TOPICS[g.id.split("|")[0]] || g.section;
      const tp = by.get(name) || { name, correct: 0, total: 0 };
      tp.total++; if (g.ok) tp.correct++;
      by.set(name, tp);
    }
    out.topics = [...by.values()].map(tp => ({ ...tp, pct: Math.round((tp.correct / tp.total) * 100), advice: sectionAdvice((tp.correct / tp.total) * 100) })).sort((a, b) => a.pct - b.pct);
    out.weak = out.topics.filter(tp => tp.pct < 70).map(tp => tp.name);
    out.strong = out.topics.filter(tp => tp.pct >= 80).map(tp => tp.name);
    out.message = scoreMessage(base.quiz, pct, out.weak);
  }
  if (mode === "full") out.items = graded.map(detail);
  // Informe parcial: solo se revelan algunas correcciones; el resto queda para la clase.
  if (mode === "gate") { out.review = wrong.slice(0, 2).map(detail); out.locked = Math.max(0, wrong.length - out.review.length); }
  return out;
}

function scoreMessage(quiz, pct, weak) {
  const w = weak.length ? ` Tus prioridades: ${weak.slice(0, 3).join(", ")}.` : "";
  if (quiz === "diagnostico") return (pct >= 80 ? "Tienes una base sólida. Un plan de práctica te ayudará a mantenerla." : "Detectamos temas que conviene reforzar antes de que se acumulen.") + w;
  if (quiz === "ingles") return (pct >= 80 ? "¡Muy bien! Estás listo para subir de nivel." : "Con práctica guiada puedes dominar este nivel en pocas semanas.") + w;
  if (quiz === "vocacional") return "";
  return (pct >= 70 ? "Vas por buen camino, pero el examen real es 4 veces más largo y con más presión de tiempo." : "Aún estás lejos del puntaje que necesitas. La buena noticia: el razonamiento se entrena.") + w;
}

function vocationalResult(base, graded, mode) {
  const answers = graded.map(g => ({ key: g.id.split("|")[0], value: g.a }));
  const r = scoreVocational(answers);
  const code = r.profile.slice(0, 3).map(p => p.code).join("");
  const out = {
    ...base, total: graded.length, code, top: r.careers[0], careers: r.careers.slice(0, 3), allCareers: CAREERS.length,
    message: `Tu perfil predominante es ${r.profile[0].name}, seguido de ${r.profile[1].name} y ${r.profile[2].name}.`,
    profileTop: r.profile.slice(0, 2).map(p => ({ code: p.code, name: p.name, desc: p.desc })),
    readiness: r.readiness, readinessLabel: r.readinessLabel, topValues: r.values.slice(0, 3).map(v => v.name),
  };
  if (mode === "full") Object.assign(out, { profile: r.profile, areas: r.areas, careers: r.careers.slice(0, 15), personality: r.personality, values: r.values, adaptability: r.adaptability });
  return out;
}
