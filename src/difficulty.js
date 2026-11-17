// Dificultad de cada fuente de preguntas en los simuladores de admisión.
//   "easy"   → Parte 1 · Preguntas básicas (se responden aplicando una regla o un dato directo)
//   "medium" → NO se usan en los simuladores de admisión
//   "hard"   → Parte 2 · Preguntas avanzadas (varios pasos, trampas o razonamiento abstracto)
// Una fuente que no aparece aquí se considera "medium" y queda fuera de los simuladores.
// Para mover una fuente de nivel basta con cambiarla de lista.

const EASY = [
  // Verbal y lenguaje
  "vb.syn", "vb.ant", "vb.odd", "vb.odd2", "vb.roman", "le.spell", "le.grammar2", "ln.bank2",
  // Numérico
  "rn.series", "rn.prop", "rn.letters", "rn.operator",
  // Lógico
  "rl.order", "rl.calendar", "rl.code",
  // Abstracto
  "ra.arrow", "ra.dots", "ra.poly", "ra.grow", "ra.clock",
  // Atención
  "at.letters", "at.digits",
  // Matemática
  "m.eq1", "m.powers", "m.percent", "m.frac", "m.concepts", "m.func", "m.log", "m.trig", "ma.line", "ma.pyth",
  // Estadística
  "st.mean", "st.mode", "st.median", "st.freq", "st.bank2",
  // Física
  "f.newton", "f.weight", "f.density", "f.power", "f.ohm", "f.concepts", "f.concepts2",
  // Química
  "q.symbols", "q.bank",
  // Biología y anatomía
  "b.organs", "b.organelles", "b.bank3", "an.bones", "an.bank",
  // Emprendimiento
  "em.bank", "em.bank2",
];

const HARD = [
  // Verbal y lenguaje
  "vb.analogy", "vb.analogy2", "vb.read", "vb.read2", "yc.read", "ln.bank", "le.grammar",
  // Numérico
  "rn.work", "rn.ages", "rn.pchange", "rn.sets", "rn.meet",
  // Lógico
  "rl.syllogism", "rl.bank", "rl.bank2",
  // Abstracto y espacial
  "ra.matrix", "ra.combo", "re.cubes", "re.rotate", "re.net", "re.paint",
  // Atención
  "at.pairs",
  // Matemática
  "ma.limInf", "ma.limFactor", "ma.chain", "ma.integral", "ma.logeq", "ma.seq", "ma.sets",
  // Estadística
  "st.var", "st.class", "st.prob", "st.bank",
  // Física
  "fx.vertical", "fx.work", "fx.impulse",
  // Química
  "q.bank2", "q.moles",
  // Biología y anatomía
  "b.bank2", "an.bank2", "an.glands",
  // Emprendimiento
  "em.calc",
];

export const TIER = Object.fromEntries([...EASY.map(k => [k, "easy"]), ...HARD.map(k => [k, "hard"])]);
export const tierOf = key => TIER[key] || "medium";
export const TIER_LABEL = { easy: "Parte 1 · Básicas", hard: "Parte 2 · Avanzadas" };
