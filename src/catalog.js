// Catálogo de simuladores. Aquí se ajustan número de preguntas, tiempos y temas de cada prueba.
import "./gen/math.js";
import "./gen/physics.js";
import "./gen/reasoning.js";
import "./banks/verbal.js";
import "./banks/school.js";
import "./banks/english.js";
import "./banks/pre.js";
import "./gen/advanced.js";
import "./gen/visual.js";
import "./banks/extra-es.js";
import "./banks/extra-en.js";
import { VOC_SECTIONS } from "./vocational.js";

// Nombre de tema de cada fuente (desglose por temas en el diagnóstico).
export const TOPICS = {
  "m.ops": "Operaciones combinadas", "m.frac": "Fracciones", "m.percent": "Porcentajes", "m.area": "Geometría: áreas y perímetros", "m.problem": "Problemas de la vida diaria",
  "m.eq1": "Ecuaciones lineales", "m.powers": "Potenciación", "m.func": "Funciones", "m.system": "Sistemas de ecuaciones", "m.concepts": "Conceptos básicos", "m.quad": "Ecuaciones cuadráticas",
  "m.deriv": "Derivadas", "m.log": "Logaritmos", "m.trig": "Trigonometría", "ma.line": "Geometría analítica", "ma.ineq": "Inecuaciones", "ma.pyth": "Teorema de Pitágoras", "ma.seq": "Progresiones",
  "ma.limInf": "Límites", "ma.limFactor": "Límites", "ma.chain": "Derivadas", "ma.integral": "Integrales", "ma.det": "Matrices y determinantes", "ma.logeq": "Logaritmos",
  "f.mru": "Movimiento (MRU)", "f.speed": "Movimiento (MRU)", "f.mruv": "Movimiento acelerado (MRUV)", "f.freefall": "Caída libre", "fx.vertical": "Lanzamiento vertical", "f.newton": "Leyes de Newton",
  "f.weight": "Leyes de Newton", "fx.impulse": "Leyes de Newton", "f.energy": "Trabajo y energía", "f.potential": "Trabajo y energía", "fx.work": "Trabajo y energía", "f.power": "Potencia",
  "f.ohm": "Electricidad", "f.density": "Densidad", "fx.circular": "Movimiento circular", "fx.sci": "Notación científica", "f.units": "Unidades de medida", "f.concepts": "Conceptos de física",
  "q.bank": "Química general", "q.bank2": "Reacciones y nomenclatura", "q.symbols": "Tabla periódica", "q.moles": "Estequiometría (moles)", "q.molar": "Masa molar",
  "le.spell": "Ortografía", "le.grammar": "Gramática", "ln.bank": "Lenguaje y argumentación", "vb.syn": "Sinónimos", "vb.ant": "Antónimos", "vb.complete": "Oraciones incompletas",
  "vb.read": "Comprensión lectora", "vb.analogy": "Analogías", "vb.odd": "Término excluido",
  "b.bank": "Biología general", "b.bank2": "Biología general", "b.organs": "Cuerpo humano", "b.organelles": "La célula",
};

// Porcentaje de la prueba real que se muestra en el simulador gratuito.
export const SIM_SHARE = 0.25;

const VERBAL = ["vb.analogy", "vb.syn", "vb.ant", "vb.odd", "vb.complete"];
const NUMERICO = ["rn.series", "rn.ages", "rn.work", "rn.prop", "rn.pchange", "rn.avg", "rn.operator", "rn.grid", "rn.sets", "rn.meet", "rn.letters"];
const LOGICO = ["rl.order", "rl.syllogism", "rl.calendar", "rl.code", ["rl.bank", 2]];
const ABSTRACTO = ["ra.arrow", "ra.poly", "ra.dots", "ra.quad", "ra.orbit", "ra.odd", ["ra.matrix", 2], "ra.pie", "ra.clock", "ra.combo", "ra.grow", "re.cubes", "re.rotate", "re.net"];
const ESPACIAL = ["re.cubes", "re.rotate", "re.net", "re.paint"];
const MATE_PRE = ["m.eq1", "m.powers", "m.func", "m.system", "m.quad", "m.percent", "m.frac", ["m.concepts", 2]];
const FISICA_PRE = ["f.mru", "f.mruv", "f.freefall", "f.newton", "f.weight", "f.energy", "f.potential", "f.ohm", "f.density", "f.power", ["f.concepts", 2]];
const MATE_ING = ["ma.limInf", "ma.limFactor", "ma.chain", "ma.integral", "ma.det", "ma.line", "ma.logeq", "m.deriv", "m.quad", "m.log", "m.trig", "rn.work", "rn.pchange", "rn.ages", "ra.arrow", "ra.poly", "re.net", "re.cubes", "re.rotate", "ra.matrix", "ra.combo"];
const FISICA_ING = [...FISICA_PRE, "fx.vertical", "fx.circular", "fx.sci", "fx.work", "fx.impulse"];
const LENGUAJE = [["ln.bank", 4], "vb.analogy", "vb.ant", "vb.syn", ["le.grammar", 2]];
const ESTADISTICA = [["st.bank", 3], "st.mean", "st.median", "st.mode", "st.var", "st.prob", "st.freq", "st.class"];
const ANATOMIA = [["an.bank", 5], "an.bones", "an.glands", "b.organs"];
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

// real: tamaño y duración de la prueba oficial, según los simuladores de curso de For Winners.
function uniLevel(label, real, parts) {
  const n = Math.round(real.questions * SIM_SHARE);
  return { label, real, minutes: Math.round(real.minutes * SIM_SHARE), sections: split(n, parts) };
}
const V = w => ({ name: "Razonamiento verbal", w, src: [...VERBAL, ["vb.read", 2]] });
const N = w => ({ name: "Razonamiento numérico", w, src: NUMERICO });
const L = w => ({ name: "Razonamiento lógico", w, src: LOGICO });
const A = w => ({ name: "Razonamiento abstracto", w, src: ABSTRACTO });
const ATENCION = w => ({ name: "Atención y concentración", w, src: ["at.letters", "at.digits", "at.pairs"] });
const YACHAY_EXTRA = w => ({ name: "Módulo Yachay: matemática, lectura científica y espacial", w, src: [["ma.ineq", 2], ["m.system", 1], ["ma.line", 1], ["m.func", 1], ["ma.pyth", 2], ["ma.solid", 2], ["ma.seq", 2], ["ma.sets", 2], ["rn.sets", 1], ["yc.read", 1], ["re.paint", 2], ["re.cubes", 2], ["re.rotate", 2], ["re.net", 1]] });

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
    kind: "score", flow: "gate", title: "Diagnóstico académico", pickSections: true,
    cta: { service: "Nivelación", text: "Agenda tu clase de nivelación", wa: "Hola For Winners, hice el diagnóstico académico y quiero reforzar: " },
    levels: {
      egb: { label: "Escuela (EGB)", sections: [
        { name: "Matemática", n: 12, src: ["m.ops", "m.frac", "m.percent", "m.area", "m.problem"] },
        { name: "Lengua y Literatura", n: 12, src: [["le.spell", 2], ["le.grammar", 2], "vb.syn", "vb.analogy", "vb.odd"] },
        { name: "Ciencias Naturales", n: 12, src: [["b.bank", 2], ["b.bank2", 2], "b.organs", "b.organelles", "f.units", "q.symbols"] },
      ] },
      bach: { label: "Colegio (Bachillerato)", sections: [
        { name: "Matemática", n: 12, src: ["m.eq1", "m.powers", "m.func", "m.system", "m.frac", "m.percent", "m.concepts", "ma.line", "ma.ineq", "ma.pyth", "ma.seq", "m.trig"] },
        { name: "Física", n: 12, src: ["f.mru", "f.speed", "f.mruv", "f.newton", "f.weight", "f.energy", "f.ohm", "f.density", "fx.vertical", "fx.circular", "fx.sci", ["f.concepts", 2]] },
        { name: "Química", n: 12, src: QUIMICA },
        { name: "Lengua y Literatura", n: 12, src: [["le.grammar", 3], ["ln.bank", 3], "le.spell", "vb.syn", "vb.ant", "vb.complete", "vb.read"] },
      ] },
      uni: { label: "Universidad", sections: [
        { name: "Matemática", n: 12, src: ["m.quad", "m.deriv", "m.log", "m.trig", "m.system", "m.func", "ma.limInf", "ma.limFactor", "ma.chain", "ma.integral", "ma.det", "ma.logeq"] },
        { name: "Física", n: 12, src: ["f.mruv", "f.freefall", "f.energy", "f.potential", "f.power", "f.ohm", "fx.vertical", "fx.work", "fx.impulse", "fx.circular", ["f.concepts", 2]] },
        { name: "Química", n: 12, src: QUIMICA },
        { name: "Lengua y Redacción", n: 12, src: [["le.grammar", 2], ["ln.bank", 3], "vb.complete", "vb.analogy", "vb.ant", "vb.read"] },
      ] },
    },
  },
  ingles: {
    kind: "score", flow: "open", title: "Práctica de inglés",
    cta: { service: "Curso de inglés", text: "Quiero mi curso de inglés", wa: "Hola For Winners, hice la práctica de inglés y quiero información del curso. Resultado: " },
    levels: englishLevels,
  },
  uce: {
    kind: "score", title: "Simulador Universidad Central del Ecuador",
    cta: { service: "Preuniversitario UCE", text: "Reservar cupo en el preuniversitario", wa: "Hola For Winners, hice el simulador de la Central y quiero el preuniversitario. Resultado: " },
    levels: { general: uniLevel("Razonamiento", { questions: 150, minutes: 120 }, [V(40), N(40), L(35), A(35)]) },
  },
  upec: {
    kind: "score", title: "Simulador UPEC",
    cta: { service: "Preuniversitario UPEC", text: "Reservar cupo en el preuniversitario", wa: "Hola For Winners, hice el simulador de la UPEC y quiero el preuniversitario. Resultado: " },
    levels: { general: uniLevel("Razonamiento y atención", { questions: 60, minutes: 60 }, [V(15), N(15), L(15), ATENCION(15)]) },
  },
  yachay: {
    kind: "score", title: "Simulador Yachay Tech",
    cta: { service: "Preuniversitario Yachay Tech", text: "Reservar cupo en el preuniversitario", wa: "Hola For Winners, hice el simulador de Yachay Tech y quiero el preuniversitario. Resultado: " },
    levels: { general: uniLevel("Razonamiento + módulo de matemáticas", { questions: 80, minutes: 90 }, [V(15), N(15), L(12), A(13), YACHAY_EXTRA(25)]) },
  },
  utn: {
    kind: "score", title: "Simulador Universidad Técnica del Norte",
    cta: { service: "Preuniversitario UTN", text: "Reservar cupo en el preuniversitario UTN", wa: "Hola For Winners, hice el simulador UTN y quiero el preuniversitario. Resultado: " },
    levels: {
      ingenierias: uniLevel("FICA · FICAYA (Ingenierías)", { questions: 90, minutes: 120 }, [
        { name: "Lenguaje", w: 10, src: LENGUAJE }, { name: "Estadística", w: 10, src: ESTADISTICA },
        { name: "Matemática", w: 30, src: [...MATE_ING, ...MATE_PRE] }, { name: "Física", w: 30, src: FISICA_ING },
        { name: "Química", w: 10, src: QUIMICA },
      ]),
      salud: uniLevel("FCCSS · Ciencias de la Salud", { questions: 90, minutes: 90 }, [
        { name: "Lenguaje", w: 10, src: LENGUAJE }, { name: "Estadística", w: 10, src: ESTADISTICA },
        { name: "Biología", w: 20, src: BIOLOGIA }, { name: "Anatomía", w: 40, src: ANATOMIA },
        { name: "Química", w: 10, src: QUIMICA },
      ]),
      // El simulador de curso FECYT-FACAE no indica tiempo: se asumen 120 minutos (AJUSTAR si es distinto).
      fecyt: uniLevel("FECYT · FACAE (Educación y Ciencias Administrativas)", { questions: 100, minutes: 120 }, [
        { name: "Matemática, estadística y abstracto", w: 30, src: ["m.frac", "m.eq1", "m.system", "m.powers", "ma.line", "ma.det", "ma.limInf", "ma.integral", "st.median", "st.prob", "st.var", "st.class", ["st.bank", 2], "ra.poly", "ra.arrow", "ra.dots", "ra.orbit", "ra.matrix", "ra.pie", "ra.clock", "ra.combo", "re.rotate"] },
        { name: "Emprendimiento", w: 40, src: [["em.bank", 3], ["em.calc", 2]] },
        { name: "Verbal", w: 30, src: [["ln.bank", 3], "vb.syn", "vb.ant", "vb.analogy", "vb.roman", "le.spell", "le.grammar"] },
      ]),
    },
  },
  vocacional: {
    kind: "vocational", flow: "open", title: "Test vocacional",
    cta: { service: "Orientación vocacional", text: "Quiero mi sesión de orientación", wa: "Hola For Winners, hice el test vocacional y quiero una sesión de orientación. Mi perfil: " },
    ordered: true,
    levels: { general: { label: "Intereses, personalidad, valores y adaptabilidad", minutes: 0, sections: VOC_SECTIONS } },
  },
};

// Bancos de respaldo: donde se use un banco, se suman sus bancos extra con el mismo peso,
// así cada intento tiene más preguntas disponibles y se repiten cada vez menos.
const BACKUPS = {
  "vb.analogy": ["vb.analogy2"], "vb.odd": ["vb.odd2"], "vb.complete": ["vb.complete2"], "vb.read": ["vb.read2"],
  "rl.bank": ["rl.bank2"], "le.grammar": ["le.grammar2"], "ln.bank": ["ln.bank2"], "q.bank": ["q.bank3"], "b.bank": ["b.bank3"],
  "an.bank": ["an.bank2"], "s.bank": ["s.bank2"], "f.concepts": ["f.concepts2"], "em.bank": ["em.bank2"], "st.bank": ["st.bank2"],
  ...Object.fromEntries(["a1", "a2", "b1", "b2", "c1"].flatMap(l => [
    [`en.g.${l}`, [`en.g.${l}.y`]], [`en.w.order.${l}`, [`en.w.order.${l}.y`]], [`en.w.fix.${l}`, [`en.w.fix.${l}.y`]], [`en.r.${l}`, [`en.r.${l}.y`]],
  ])),
};
for (const quiz of Object.values(QUIZZES)) for (const level of Object.values(quiz.levels)) for (const sec of level.sections) {
  const extra = [];
  for (const src of sec.src) {
    const [key, w] = Array.isArray(src) ? src : [src, 1];
    for (const b of BACKUPS[key] || []) if (!sec.src.some(x => (Array.isArray(x) ? x[0] : x) === b)) extra.push([b, w]);
  }
  sec.src = [...sec.src, ...extra];
}

export function publicCatalog() {
  return Object.fromEntries(Object.entries(QUIZZES).map(([id, q]) => [id, {
    title: q.title, kind: q.kind, flow: q.flow || "gate",
    levels: Object.fromEntries(Object.entries(q.levels).map(([k, l]) => [k, {
      label: l.label, minutes: l.minutes || 0, questions: l.sections.reduce((a, s) => a + s.n, 0),
      real: l.real || null, sections: q.kind === "vocational" ? [] : l.sections.map(s => s.name),
    }])),
  }]));
}
