// Catálogo de simuladores. Aquí se ajustan número de preguntas, tiempos y temas de cada prueba.
import "./gen/math.js";
import "./gen/physics.js";
import "./gen/reasoning.js";
import "./banks/verbal.js";
import "./banks/school.js";
import "./banks/english.js";
import "./vocational.js";

// Porcentaje de la prueba real que se muestra en el simulador gratuito.
export const SIM_SHARE = 0.25;

const VERBAL = ["vb.analogy", "vb.syn", "vb.ant", "vb.odd", "vb.complete"];
const NUMERICO = ["rn.series", "rn.ages", "rn.work", "rn.prop", "rn.pchange", "rn.avg", "rn.operator", "rn.grid", "rn.sets", "rn.meet", "rn.letters"];
const LOGICO = ["rl.order", "rl.syllogism", "rl.calendar", "rl.code", ["rl.bank", 2]];
const ABSTRACTO = ["ra.arrow", "ra.poly", "ra.dots", "ra.quad", "ra.orbit", "ra.odd"];
const MATE_PRE = ["m.eq1", "m.powers", "m.func", "m.system", "m.quad", "m.percent", "m.frac", ["m.concepts", 2]];
const FISICA_PRE = ["f.mru", "f.mruv", "f.freefall", "f.newton", "f.weight", "f.energy", "f.potential", "f.ohm", "f.density", "f.power", ["f.concepts", 2]];
const QUIMICA = [["q.bank", 3], ["q.bank2", 2], ["q.symbols", 2], "q.moles", "q.molar"];
const BIOLOGIA = [["b.bank", 3], ["b.bank2", 2], ["b.organelles", 2], ["b.organs", 2]];
const SOCIALES = [["s.bank", 3], "s.capitals"];

// Reparte n preguntas entre secciones según sus pesos.
function split(total, parts) {
  const sumW = parts.reduce((a, p) => a + p.w, 0);
  const out = parts.map(p => ({ ...p, n: Math.floor((total * p.w) / sumW) }));
  let left = total - out.reduce((a, p) => a + p.n, 0);
  for (let i = 0; left > 0; i = (i + 1) % out.length, left--) out[i].n++;
  return out.map(({ w, ...p }) => p);
}

// real: tamaño y duración de la prueba oficial (AJUSTAR con los simuladores reales de cada universidad).
function uniLevel(label, real, parts) {
  const n = Math.round(real.questions * SIM_SHARE);
  return { label, real, minutes: Math.round(real.minutes * SIM_SHARE), sections: split(n, parts) };
}
const RAZ = (wV, wN, wL, wA) => [
  { name: "Razonamiento verbal", w: wV, src: VERBAL },
  { name: "Razonamiento numérico", w: wN, src: NUMERICO },
  { name: "Razonamiento lógico", w: wL, src: LOGICO },
  { name: "Razonamiento abstracto", w: wA, src: ABSTRACTO },
];

const ENGLISH_LEVELS = {
  a1: { label: "A1 · Principiante", grammar: [["en.g.a1", 3], ["en.g.a1.x", 2], "en.be", "en.article", "en.ps3"] },
  a2: { label: "A2 · Básico", grammar: [["en.g.a2", 3], ["en.g.a2.x", 2], "en.past", "en.comp", "en.ps3"] },
  b1: { label: "B1 · Intermedio", grammar: [["en.g.b1", 3], "en.pp", "en.cond", "en.passive"] },
  b2: { label: "B2 · Intermedio alto", grammar: [["en.g.b2", 3], "en.cond", "en.passive"] },
  c1: { label: "C1 · Avanzado", grammar: [["en.g.c1", 4], "en.cond", "en.passive"] },
};
const SKILLS = {
  grammar: { label: "Grammar", n: 10, src: l => ENGLISH_LEVELS[l].grammar },
  writing: { label: "Writing", n: 8, src: l => [[`en.w.order.${l}`, 1], [`en.w.fix.${l}`, 1]] },
  reading: { label: "Reading", n: 6, src: l => [`en.r.${l}`, `en.r.${l}.x`] },
};
const englishLevels = {};
for (const [l, def] of Object.entries(ENGLISH_LEVELS)) {
  for (const [k, sk] of Object.entries(SKILLS)) {
    englishLevels[`${l}.${k}`] = { label: `${sk.label} · ${def.label}`, minutes: 0, sections: [{ name: sk.label, n: sk.n, src: sk.src(l) }] };
  }
}

export const QUIZZES = {
  diagnostico: {
    kind: "score", title: "Diagnóstico académico", pickSections: true,
    cta: { service: "Nivelación", text: "Agenda tu clase de nivelación", wa: "Hola For Winners, hice el diagnóstico académico y quiero reforzar: " },
    levels: {
      egb: { label: "Escuela (EGB)", sections: [
        { name: "Matemática", n: 4, src: ["m.ops", "m.frac", "m.percent", "m.area", "m.problem"] },
        { name: "Lengua y Literatura", n: 4, src: [["le.spell", 2], ["le.grammar", 2], "vb.syn"] },
        { name: "Ciencias Naturales", n: 4, src: [["b.bank", 2], "b.organs", "b.organelles", "f.units"] },
        { name: "Inglés", n: 4, src: [["en.g.a1", 2], "en.be", "en.article", "en.ps3"] },
      ] },
      bach: { label: "Colegio (Bachillerato)", sections: [
        { name: "Matemática", n: 4, src: ["m.eq1", "m.powers", "m.func", "m.system", "m.frac", "m.percent", "m.concepts"] },
        { name: "Física", n: 4, src: ["f.mru", "f.speed", "f.mruv", "f.newton", "f.weight", "f.energy", "f.ohm", "f.density", ["f.concepts", 2]] },
        { name: "Química", n: 4, src: QUIMICA },
        { name: "Lengua y Literatura", n: 4, src: [["le.grammar", 3], "le.spell", "vb.syn", "vb.ant", "vb.complete"] },
        { name: "Inglés", n: 4, src: [["en.g.a2", 2], ["en.g.b1", 2], "en.past", "en.comp"] },
      ] },
      uni: { label: "Universidad", sections: [
        { name: "Matemática", n: 4, src: ["m.quad", "m.deriv", "m.log", "m.trig", "m.system", "m.func"] },
        { name: "Física", n: 4, src: ["f.mruv", "f.freefall", "f.energy", "f.potential", "f.power", "f.ohm", ["f.concepts", 2]] },
        { name: "Química", n: 4, src: QUIMICA },
        { name: "Lengua y Redacción", n: 4, src: [["le.grammar", 2], "vb.complete", "vb.analogy", "vb.ant"] },
        { name: "Inglés", n: 4, src: [["en.g.b1", 2], ["en.g.b2", 2], "en.cond", "en.passive"] },
      ] },
    },
  },
  ingles: {
    kind: "score", title: "Práctica de inglés",
    cta: { service: "Curso de inglés", text: "Quiero mi curso de inglés", wa: "Hola For Winners, hice la práctica de inglés y quiero información del curso. Resultado: " },
    levels: englishLevels,
  },
  uce: {
    kind: "score", title: "Simulador Universidad Central del Ecuador",
    cta: { service: "Preuniversitario UCE", text: "Reservar cupo en el preuniversitario", wa: "Hola For Winners, hice el simulador de la Central y quiero el preuniversitario. Resultado: " },
    levels: { general: uniLevel("Razonamiento", { questions: 100, minutes: 120 }, RAZ(3, 3, 2, 2)) },
  },
  upec: {
    kind: "score", title: "Simulador UPEC",
    cta: { service: "Preuniversitario UPEC", text: "Reservar cupo en el preuniversitario", wa: "Hola For Winners, hice el simulador de la UPEC y quiero el preuniversitario. Resultado: " },
    levels: { general: uniLevel("Razonamiento", { questions: 100, minutes: 120 }, RAZ(3, 3, 2, 2)) },
  },
  yachay: {
    kind: "score", title: "Simulador Yachay Tech",
    cta: { service: "Preuniversitario Yachay Tech", text: "Reservar cupo en el preuniversitario", wa: "Hola For Winners, hice el simulador de Yachay Tech y quiero el preuniversitario. Resultado: " },
    levels: { general: uniLevel("Razonamiento", { questions: 100, minutes: 120 }, RAZ(2, 4, 3, 2)) },
  },
  utn: {
    kind: "score", title: "Simulador Universidad Técnica del Norte",
    cta: { service: "Preuniversitario UTN", text: "Reservar cupo en el preuniversitario UTN", wa: "Hola For Winners, hice el simulador UTN y quiero el preuniversitario. Resultado: " },
    levels: {
      fica: uniLevel("FICA · Ingeniería en Ciencias Aplicadas", { questions: 100, minutes: 120 }, [
        { name: "Matemática", w: 3, src: MATE_PRE }, { name: "Física", w: 2, src: FISICA_PRE },
        { name: "Razonamiento numérico", w: 3, src: NUMERICO }, { name: "Razonamiento lógico", w: 2, src: LOGICO },
      ]),
      ficaya: uniLevel("FICAYA · Ciencias Agropecuarias y Ambientales", { questions: 100, minutes: 120 }, [
        { name: "Biología", w: 3, src: BIOLOGIA }, { name: "Química", w: 2, src: QUIMICA },
        { name: "Matemática", w: 2, src: MATE_PRE }, { name: "Razonamiento", w: 3, src: [...NUMERICO, ...LOGICO] },
      ]),
      salud: uniLevel("FCCSS · Ciencias de la Salud", { questions: 100, minutes: 120 }, [
        { name: "Biología", w: 3, src: BIOLOGIA }, { name: "Química", w: 3, src: QUIMICA },
        { name: "Razonamiento verbal", w: 2, src: VERBAL }, { name: "Razonamiento numérico", w: 2, src: NUMERICO },
      ]),
      fecyt: uniLevel("FECYT · FACAE (Educación y Ciencias Administrativas)", { questions: 100, minutes: 120 }, [
        { name: "Lengua y Literatura", w: 2, src: ["le.grammar", "le.spell", "vb.complete"] }, { name: "Estudios Sociales", w: 2, src: SOCIALES },
        { name: "Razonamiento verbal", w: 3, src: VERBAL }, { name: "Razonamiento numérico", w: 3, src: NUMERICO },
      ]),
    },
  },
  vocacional: {
    kind: "vocational", title: "Test vocacional",
    cta: { service: "Orientación vocacional", text: "Quiero mi sesión de orientación", wa: "Hola For Winners, hice el test vocacional y quiero mi informe completo. Mi perfil: " },
    levels: { general: { label: "Intereses y preferencias", minutes: 0, sections: ["R", "I", "A", "S", "E", "C"].map(t => ({ name: t, n: 5, src: [`voc.${t}`] })) } },
  },
};

export function publicCatalog() {
  return Object.fromEntries(Object.entries(QUIZZES).map(([id, q]) => [id, {
    title: q.title, kind: q.kind,
    levels: Object.fromEntries(Object.entries(q.levels).map(([k, l]) => [k, {
      label: l.label, minutes: l.minutes || 0, questions: l.sections.reduce((a, s) => a + s.n, 0),
      real: l.real || null, sections: q.kind === "vocational" ? [] : l.sections.map(s => s.name),
    }])),
  }]));
}
