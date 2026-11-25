// Calendario de temáticas de temporada (Ecuador + fechas mundiales, de educación y de marketing).
// Cada temática tiene fechas por defecto (fijas o calculadas cada año), variantes que rotan por año
// para que no sea siempre igual, y se puede encender/apagar/cambiar desde el panel (FW_CONTENT.temporada).
// La variante cambia cada año (2026 = la primera, 2027 = la segunda…) salvo que el panel fije una.
// Si dos temáticas coinciden gana la de mayor prioridad y, a igual prioridad, la más corta (la más específica).
//
// Efectos disponibles (season/effects.js): snow, hearts, confetti, petals, leaves, sparkles, bats,
// glyphs (letras o símbolos), balloons, fireworks, bubbles. Cinta bajo el menú: lights, ribbon o none.
// La lista de ids y nombres se repite en el panel (admin-forwinners/src/site/seasons.js): si agregas una aquí, agrégala allá.

const D = (y, m, d) => new Date(y, m - 1, d);
const add = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

// Domingo de Pascua (algoritmo anónimo gregoriano).
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return D(y, month, day);
}
// n-ésimo día de la semana (0 = domingo) de un mes.
function nth(y, m, weekday, n) {
  const first = D(y, m, 1);
  return add(first, ((weekday - first.getDay() + 7) % 7) + 7 * (n - 1));
}
const fixed = (m1, d1, m2 = m1, d2 = d1) => y => [D(y, m1, d1), D(m2 < m1 ? y + 1 : y, m2, d2)];

// Paletas: c = colores en modo claro, dk = en modo oscuro (si cambian).
const ECU = ["#FFD100", "#0033A0", "#EF3340"];
const GOLD = ["#C9A227", "#E9C46A", "#F4E3B1"];

export const THEMES = [
  { id: "fin-de-anio", name: "Año Viejo y Año Nuevo", when: fixed(12, 31, 1, 2), prio: 3,
    greet: "¡Feliz año nuevo! Que este año sea tuyo.",
    variants: [
      { name: "Fuegos artificiales", fx: "fireworks", c: [...GOLD, "#ffffff"], ribbon: "ribbon" },
      { name: "Confeti dorado", fx: "confetti", c: [...GOLD, "#0d1b2e"], dk: [...GOLD, "#ffffff"], ribbon: "ribbon" },
    ] },
  { id: "educacion", name: "Día Internacional de la Educación (24 ene)", when: fixed(1, 23, 1, 24), prio: 2,
    greet: "Día Internacional de la Educación: aprender abre puertas.",
    variants: [
      { name: "Letras y números", fx: "glyphs", glyphs: ["A", "b", "c", "1", "2", "3", "π", "√", "∑", "x²"], c: ["#0B2A5B", "#3a6ea5", "#7aa0c8"], dk: ["#cfe0f5", "#8fb5e0", "#5e88b8"], ribbon: "none" },
      { name: "Estrellas", fx: "sparkles", c: ["#3a6ea5", "#C9A227"], ribbon: "none" },
    ] },
  { id: "amor", name: "Amor y amistad (San Valentín)", when: fixed(2, 7, 2, 14), prio: 1,
    greet: "Feliz día del amor y la amistad.",
    variants: [
      { name: "Corazones", fx: "hearts", c: ["#e63946", "#ff8fa3", "#ffb3c1"], ribbon: "ribbon" },
      { name: "Corazones y confeti", fx: "hearts", mix: "confetti", c: ["#e63946", "#ff8fa3", "#C9A227"], ribbon: "ribbon" },
    ] },
  { id: "carnaval", name: "Carnaval", when: y => { const e = easter(y); return [add(e, -51), add(e, -47)]; }, prio: 2,
    greet: "¡Feliz Carnaval! Disfruta con cuidado.",
    variants: [
      { name: "Confeti de colores", fx: "confetti", c: ["#ff006e", "#fb5607", "#ffbe0b", "#3a86ff", "#8338ec"], ribbon: "ribbon" },
      { name: "Burbujas y espuma", fx: "bubbles", c: ["#8ecae6", "#219ebc", "#bde0fe"], ribbon: "ribbon" },
    ] },
  { id: "mujer", name: "Día Internacional de la Mujer (8 mar)", when: fixed(3, 7, 3, 8), prio: 2,
    greet: "Feliz Día Internacional de la Mujer.",
    variants: [
      { name: "Pétalos violeta", fx: "petals", c: ["#7b2cbf", "#9d4edd", "#c77dff"], ribbon: "ribbon" },
    ] },
  { id: "pi", name: "Día de π / de las matemáticas (14 mar)", when: fixed(3, 14), prio: 2,
    greet: "Feliz Día de π: 3,14159…",
    variants: [
      { name: "Símbolos de π", fx: "glyphs", glyphs: ["π", "3,14", "π", "∞", "√", "π"], c: ["#0B2A5B", "#3a6ea5"], dk: ["#cfe0f5", "#8fb5e0"], ribbon: "none" },
    ] },
  { id: "semana-santa", name: "Semana Santa", when: y => { const e = easter(y); return [add(e, -7), e]; }, prio: 2, off: true,
    greet: "Felices pascuas.",
    variants: [
      { name: "Destellos suaves", fx: "sparkles", c: ["#b8a1d9", "#e8dff5"], dk: ["#b8a1d9", "#6d5a8a"], ribbon: "none" },
    ] },
  { id: "maestro", name: "Día del Maestro en Ecuador (13 abr)", when: fixed(4, 12, 4, 13), prio: 2,
    greet: "Feliz Día del Maestro a quienes enseñan con el corazón.",
    variants: [
      { name: "Estrellas doradas", fx: "sparkles", c: GOLD, ribbon: "ribbon" },
      { name: "Letras", fx: "glyphs", glyphs: ["A", "B", "C", "★", "✓"], c: ["#0B2A5B", "#C9A227"], dk: ["#cfe0f5", "#E9C46A"], ribbon: "ribbon" },
    ] },
  { id: "tierra", name: "Día de la Tierra (22 abr)", when: fixed(4, 22), prio: 2,
    greet: "Día de la Tierra: cuidemos nuestra casa.",
    variants: [{ name: "Hojas verdes", fx: "leaves", c: ["#2a9d8f", "#52b788", "#95d5b2"], ribbon: "none" }] },
  { id: "libro", name: "Día del Libro y del Idioma (23 abr)", when: fixed(4, 23), prio: 2,
    greet: "Día del Libro y del Idioma: ¿qué estás leyendo? What are you reading?",
    variants: [
      { name: "Letras en español e inglés", fx: "glyphs", glyphs: ["Aa", "Bb", "ñ", "¿?", "¡!", "Hi", "Hola", "ABC"], c: ["#0B2A5B", "#3a6ea5", "#C9A227"], dk: ["#cfe0f5", "#8fb5e0", "#E9C46A"], ribbon: "none" },
    ] },
  { id: "regreso-costa", name: "Regreso a clases Costa y Galápagos", when: y => { const m = nth(y, 5, 1, 1); return [add(m, -3), add(m, 4)]; }, prio: 1,
    greet: "¡Buen regreso a clases! Empieza el año con ventaja.",
    variants: [
      { name: "Útiles y números", fx: "glyphs", glyphs: ["✎", "A", "1+1", "π", "√", "ABC", "x"], c: ["#0B2A5B", "#3a6ea5", "#C9A227"], dk: ["#cfe0f5", "#8fb5e0", "#E9C46A"], ribbon: "ribbon" },
    ] },
  { id: "trabajo", name: "Día del Trabajo (1 may)", when: fixed(5, 1), prio: 2,
    greet: "Feliz Día del Trabajo.",
    variants: [{ name: "Destellos", fx: "sparkles", c: ["#e63946", "#C9A227"], ribbon: "none" }] },
  { id: "madre", name: "Día de la Madre (2.º domingo de mayo)", when: y => { const s = nth(y, 5, 0, 2); return [add(s, -6), s]; }, prio: 2,
    greet: "Feliz Día de la Madre.",
    variants: [
      { name: "Pétalos rosados", fx: "petals", c: ["#ff8fa3", "#ffb3c1", "#ffccd5"], ribbon: "ribbon" },
      { name: "Corazones suaves", fx: "hearts", c: ["#ff8fa3", "#ffb3c1", "#c77dff"], ribbon: "ribbon" },
    ] },
  { id: "pichincha", name: "Batalla de Pichincha (24 may)", when: fixed(5, 23, 5, 24), prio: 2,
    greet: "24 de Mayo: Batalla de Pichincha.",
    variants: [{ name: "Tricolor", fx: "confetti", c: ECU, ribbon: "ecuador" }] },
  { id: "nino", name: "Día del Niño (1 jun)", when: fixed(5, 31, 6, 1), prio: 2,
    greet: "¡Feliz Día del Niño!",
    variants: [
      { name: "Globos", fx: "balloons", c: ["#ff006e", "#ffbe0b", "#3a86ff", "#8338ec", "#06d6a0"], ribbon: "ribbon" },
      { name: "Confeti", fx: "confetti", c: ["#ff006e", "#ffbe0b", "#3a86ff", "#06d6a0"], ribbon: "ribbon" },
    ] },
  { id: "ambiente", name: "Día del Medio Ambiente (5 jun)", when: fixed(6, 5), prio: 2,
    greet: "Día del Medio Ambiente.",
    variants: [{ name: "Hojas", fx: "leaves", c: ["#2a9d8f", "#52b788", "#95d5b2"], ribbon: "none" }] },
  { id: "padre", name: "Día del Padre (3.er domingo de junio)", when: y => { const s = nth(y, 6, 0, 3); return [add(s, -4), s]; }, prio: 2,
    greet: "Feliz Día del Padre.",
    variants: [
      { name: "Estrellas", fx: "sparkles", c: ["#0B2A5B", "#3a6ea5", "#C9A227"], dk: ["#8fb5e0", "#cfe0f5", "#E9C46A"], ribbon: "ribbon" },
    ] },
  { id: "inti-raymi", name: "Inti Raymi (21–29 jun)", when: fixed(6, 21, 6, 29), prio: 1,
    greet: "¡Feliz Inti Raymi! Fiesta del Sol y de la cosecha.",
    variants: [
      { name: "Destellos de sol", fx: "sparkles", c: ["#f4a261", "#e9c46a", "#e76f51"], ribbon: "ribbon" },
      { name: "Hojas y sol", fx: "leaves", mix: "sparkles", c: ["#e9c46a", "#f4a261", "#2a9d8f"], ribbon: "ribbon" },
    ] },
  { id: "grito", name: "Primer Grito de Independencia (10 ago)", when: fixed(8, 9, 8, 10), prio: 2,
    greet: "10 de Agosto: Primer Grito de Independencia.",
    variants: [{ name: "Tricolor", fx: "confetti", c: ECU, ribbon: "ecuador" }] },
  { id: "juventud", name: "Día Internacional de la Juventud (12 ago)", when: fixed(8, 12), prio: 2,
    greet: "Día de la Juventud: el futuro es tuyo.",
    variants: [{ name: "Confeti", fx: "confetti", c: ["#3a86ff", "#8338ec", "#ffbe0b"], ribbon: "ribbon" }] },
  { id: "regreso-sierra", name: "Regreso a clases Sierra y Amazonía", when: fixed(9, 1, 9, 7), prio: 1,
    greet: "¡Buen regreso a clases! Empieza el año con ventaja.",
    variants: [
      { name: "Útiles y números", fx: "glyphs", glyphs: ["✎", "A", "1+1", "π", "√", "ABC", "x"], c: ["#0B2A5B", "#3a6ea5", "#C9A227"], dk: ["#cfe0f5", "#8fb5e0", "#E9C46A"], ribbon: "ribbon" },
      { name: "Hojas de cuaderno", fx: "leaves", c: ["#3a6ea5", "#7aa0c8", "#C9A227"], ribbon: "ribbon" },
    ] },
  { id: "alfabetizacion", name: "Día de la Alfabetización (8 sep)", when: fixed(9, 8), prio: 2,
    greet: "Día de la Alfabetización: leer cambia vidas.",
    variants: [{ name: "Abecedario", fx: "glyphs", glyphs: ["A", "B", "C", "D", "E", "Ñ", "a", "e", "o"], c: ["#0B2A5B", "#3a6ea5"], dk: ["#cfe0f5", "#8fb5e0"], ribbon: "none" }] },
  { id: "ibarra", name: "Fiestas de Ibarra (28 sep)", when: fixed(9, 25, 9, 28), prio: 2,
    greet: "¡Felices fiestas, Ibarra, Ciudad Blanca!",
    variants: [
      { name: "Ciudad Blanca", fx: "confetti", c: ["#ffffff", "#C9A227", "#0B2A5B"], dk: ["#ffffff", "#E9C46A", "#8fb5e0"], ribbon: "ribbon" },
      { name: "Fuegos artificiales", fx: "fireworks", c: ["#ffffff", ...GOLD], ribbon: "ribbon" },
    ] },
  { id: "docente", name: "Día Mundial del Docente (5 oct)", when: fixed(10, 5), prio: 2,
    greet: "Feliz Día Mundial del Docente.",
    variants: [{ name: "Estrellas doradas", fx: "sparkles", c: GOLD, ribbon: "ribbon" }] },
  { id: "guayaquil", name: "Independencia de Guayaquil (9 oct)", when: fixed(10, 9), prio: 2,
    greet: "9 de Octubre: Independencia de Guayaquil.",
    variants: [{ name: "Celeste y blanco", fx: "confetti", c: ["#6CACE4", "#ffffff", "#a9cdee"], ribbon: "guayaquil" }] },
  { id: "halloween", name: "Halloween", when: fixed(10, 25, 10, 31), prio: 1,
    greet: "¡Feliz Halloween! Sin miedo a los exámenes.",
    variants: [
      { name: "Murciélagos", fx: "bats", c: ["#2b2d42", "#5a189a"], dk: ["#9d4edd", "#f77f00"], ribbon: "halloween" },
      { name: "Hojas de otoño", fx: "leaves", c: ["#f77f00", "#d62828", "#fcbf49"], ribbon: "halloween" },
    ] },
  { id: "difuntos", name: "Día de los Difuntos (1–2 nov)", when: fixed(11, 1, 11, 2), prio: 2,
    greet: "Día de los Difuntos: colada morada y guaguas de pan.",
    variants: [{ name: "Pétalos morados", fx: "petals", c: ["#5a189a", "#7b2cbf", "#f77f00"], dk: ["#9d4edd", "#c77dff", "#f77f00"], ribbon: "none" }] },
  { id: "cuenca", name: "Independencia de Cuenca (3 nov)", when: fixed(11, 3), prio: 2,
    greet: "3 de Noviembre: Independencia de Cuenca.",
    variants: [{ name: "Rojo y amarillo", fx: "confetti", c: ["#D52B1E", "#FFD100"], ribbon: "cuenca" }] },
  { id: "estudiante", name: "Día Internacional del Estudiante (17 nov)", when: fixed(11, 16, 11, 17), prio: 2,
    greet: "¡Feliz Día del Estudiante! Hoy celebramos tu esfuerzo.",
    variants: [
      { name: "Confeti y letras", fx: "confetti", mix: "glyphs", glyphs: ["A+", "10/10", "✓", "★"], c: ["#3a86ff", "#ffbe0b", "#0B2A5B"], dk: ["#8fb5e0", "#ffbe0b", "#ffffff"], ribbon: "ribbon" },
    ] },
  { id: "black-friday", name: "Black Friday y Cyber Monday", when: y => { const t = nth(y, 11, 4, 4); return [add(t, 1), add(t, 4)]; }, prio: 3, off: true,
    greet: "Black Friday: pregunta por nuestras promociones.",
    variants: [
      { name: "Porcentajes", fx: "glyphs", glyphs: ["%", "-20%", "%", "OFERTA", "%"], c: ["#0d1b2e", "#C9A227"], dk: ["#ffffff", "#E9C46A"], ribbon: "dark" },
    ] },
  { id: "navidad", name: "Navidad", when: fixed(11, 24, 1, 6), prio: 1,
    greet: "¡Feliz Navidad! Gracias por crecer con nosotros.",
    variants: [
      { name: "Nieve y luces", fx: "snow", c: ["#8fa9c8", "#b3c6dd", "#7c98bd"], dk: ["#ffffff", "#e6eef8", "#cfdcee"], ribbon: "lights" },
      { name: "Estrellas doradas", fx: "sparkles", mix: "snow", c: ["#C9A227", "#a8bfd9", "#E9C46A"], dk: ["#E9C46A", "#ffffff", "#F4E3B1"], ribbon: "lights" },
      { name: "Copos grandes", fx: "snow", big: true, c: ["#a8bfd9", "#c7d6e8"], dk: ["#ffffff", "#e6eef8"], ribbon: "christmas" },
    ] },
  { id: "inocentes", name: "Día de los Inocentes (28 dic)", when: fixed(12, 28), prio: 2,
    greet: "28 de diciembre: ¡que no te hagan inocente!",
    variants: [{ name: "Signos de pregunta", fx: "glyphs", glyphs: ["?", "¿?", "!", "?"], c: ["#3a86ff", "#ff006e", "#ffbe0b"], ribbon: "none" }] },
];

const byId = Object.fromEntries(THEMES.map(t => [t.id, t]));
export const getTheme = id => byId[id];

// "24/12" → [mes, día]
function parseDM(s) {
  const m = /^\s*(\d{1,2})\s*[/\-.]\s*(\d{1,2})\s*$/.exec(String(s || ""));
  if (!m) return null;
  const d = +m[1], mo = +m[2];
  return d >= 1 && d <= 31 && mo >= 1 && mo <= 12 ? [mo, d] : null;
}

// Rango de la temática alrededor de la fecha `day` (prueba el año actual y el anterior, por los rangos que cruzan año).
function range(t, cfg, y) {
  const a = parseDM(cfg.desde), b = parseDM(cfg.hasta);
  if (a || b) {
    const [s0, e0] = t.when(y);
    const s = a ? D(y, a[0], a[1]) : s0;
    let e = b ? D(y, b[0], b[1]) : e0;
    if (e < s) e = D(e.getFullYear() + 1, e.getMonth() + 1, e.getDate());
    return [s, e];
  }
  return t.when(y);
}

function inRange(t, cfg, day) {
  for (const y of [day.getFullYear(), day.getFullYear() - 1]) {
    const [s, e] = range(t, cfg, y);
    if (day >= s && day <= add(e, 1) - 1) return { start: s, end: e };
  }
  return null;
}

/**
 * Decide qué temática mostrar.
 * conf = FW_CONTENT.temporada: { modo: 'auto'|'off'|'force', forzar, intensidad, saludo, temas: { id: { on, variante, desde, hasta, saludo, intensidad } } }
 * Devuelve null o { theme, variant, intensity, greet, key }.
 */
export function resolve(conf = {}, now = new Date()) {
  const temas = conf.temas || {};
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const modo = conf.modo || "auto";
  if (modo === "off") return null;
  let pick = null, year = day.getFullYear();
  if (modo === "force" && byId[conf.forzar]) pick = byId[conf.forzar];
  else {
    let best = null;
    for (const t of THEMES) {
      const c = temas[t.id] || {};
      const on = c.on === undefined ? !t.off : !!c.on;
      if (!on) continue;
      const r = inRange(t, c, day);
      if (!r) continue;
      const len = r.end - r.start;
      if (!best || t.prio > best.t.prio || (t.prio === best.t.prio && len < best.len)) best = { t, len, r };
    }
    if (!best) return null;
    pick = best.t;
    year = best.r.start.getFullYear();
  }
  return build(pick, temas[pick.id] || {}, conf, year);
}

export function build(t, c, conf, year = new Date().getFullYear()) {
  const n = t.variants.length;
  const v = c.variante === undefined || c.variante === "" || c.variante === "auto" ? (((year - 2026) % n) + n) % n : Math.min(n - 1, Math.max(0, +c.variante || 0));
  return {
    theme: t, variant: t.variants[v], index: v,
    intensity: c.intensidad || conf.intensidad || "baja",
    greet: conf.saludo === false ? "" : (c.saludo || t.greet),
    key: `${t.id}-${year}`,
  };
}
