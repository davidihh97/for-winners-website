// Test vocacional For Winners. Adaptación orientativa (no es la versión oficial de ningún instrumento) que combina:
//  · el enfoque de CareerExplorer: intereses (modelo RIASEC de Holland), personalidad (cinco grandes factores)
//    y valores laborales, para calcular la afinidad con cada carrera;
//  · el modelo NEFELE (Life Design y adaptabilidad de carrera de Savickas): preocupación, control,
//    curiosidad y confianza, para medir qué tan preparado está el estudiante para decidir.
import { bank } from "./lib/sources.js";

export const TYPES = {
  R: { name: "Realista", desc: "Te gusta construir, reparar y trabajar con herramientas, máquinas, plantas o animales. Prefieres resultados concretos." },
  I: { name: "Investigador", desc: "Disfrutas analizar, resolver problemas y entender cómo funcionan las cosas. Tienes curiosidad científica." },
  A: { name: "Artístico", desc: "Eres creativo, expresivo y original. Te atraen el diseño, la comunicación y las artes." },
  S: { name: "Social", desc: "Te motiva ayudar, enseñar y cuidar a otras personas. Tienes empatía y facilidad para escuchar." },
  E: { name: "Emprendedor", desc: "Te gusta liderar, persuadir y tomar decisiones. Te atraen los negocios y los retos." },
  C: { name: "Convencional", desc: "Eres organizado, preciso y metódico. Te sientes cómodo con datos, procesos y normas claras." },
};

// Escalas de respuesta (de mayor a menor puntaje: 4 … 0).
const SCALES = {
  interest: ["Me encanta", "Me gusta", "Me da igual", "No me gusta", "No me gusta nada"],
  agree: ["Totalmente de acuerdo", "De acuerdo", "Ni de acuerdo ni en desacuerdo", "En desacuerdo", "Totalmente en desacuerdo"],
  importance: ["Muy importante", "Importante", "Algo importante", "Poco importante", "Nada importante"],
  describe: ["Me describe totalmente", "Me describe bastante", "Me describe algo", "Me describe poco", "No me describe"],
};
export const SCORE = Object.fromEntries(Object.values(SCALES).flatMap(sc => sc.map((v, i) => [v, 4 - i])));

// ---------- 1. Intereses (RIASEC): 4 de 8 por tipo en cada intento ----------
const INTERESTS = {
  R: ["Armar o reparar aparatos eléctricos", "Trabajar al aire libre con plantas o animales", "Manejar maquinaria o herramientas", "Diseñar y construir una maqueta o estructura", "Instalar redes o equipos de computación", "Cultivar un huerto y mejorar la producción", "Arreglar el motor de un vehículo", "Hacer mediciones en el campo o en una obra", "Fabricar un mueble con tus propias manos", "Practicar un deporte de aventura o de campo"],
  I: ["Hacer experimentos en un laboratorio", "Resolver problemas de matemática difíciles", "Investigar por qué ocurre una enfermedad", "Leer sobre descubrimientos científicos", "Programar una aplicación o un videojuego", "Analizar datos para encontrar patrones", "Entender cómo funciona el cuerpo humano", "Estudiar el comportamiento de los ecosistemas", "Observar el cielo y aprender sobre el universo", "Comprobar si una noticia es verdadera buscando evidencia"],
  A: ["Dibujar, pintar o diseñar", "Escribir cuentos, poemas o guiones", "Tocar un instrumento o componer música", "Editar videos o tomar fotografías", "Decorar espacios o diseñar ropa", "Actuar o participar en obras de teatro", "Crear contenido para redes sociales", "Diseñar la fachada de un edificio", "Inventar recetas y presentar platos de forma original", "Diseñar el logo y la imagen de una marca"],
  S: ["Enseñar a otros algo que sé", "Ayudar a personas con problemas emocionales", "Cuidar a enfermos o adultos mayores", "Organizar actividades para niños", "Trabajar como voluntario en mi comunidad", "Escuchar y aconsejar a mis amigos", "Promover hábitos de vida saludable", "Defender los derechos de otras personas", "Mediar en un conflicto entre compañeros", "Acompañar a alguien en su rehabilitación"],
  E: ["Liderar un equipo para lograr una meta", "Vender un producto o una idea", "Crear mi propio negocio", "Negociar para llegar a un acuerdo", "Hablar en público y convencer a otros", "Organizar un evento grande", "Tomar decisiones importantes bajo presión", "Representar a mi colegio o grupo", "Conseguir auspiciantes para un proyecto", "Dirigir una campaña para una causa"],
  C: ["Llevar las cuentas y el presupuesto de algo", "Ordenar y clasificar información", "Trabajar con hojas de cálculo", "Revisar documentos para encontrar errores", "Seguir procedimientos y normas claras", "Planificar horarios y agendas", "Administrar inventarios o archivos", "Elaborar informes con datos precisos", "Controlar que un proceso cumpla la normativa", "Registrar y archivar los gastos de un proyecto"],
};
for (const [t, list] of Object.entries(INTERESTS)) {
  bank(`voc.${t}`, list.map(x => ({ q: `¿Qué tanto te gustaría… ${x.charAt(0).toLowerCase() + x.slice(1)}?`, o: SCALES.interest })), { keepOrder: true });
}

// ---------- 2. Personalidad (cinco grandes factores): 3 por factor ----------
export const BIG5 = {
  O: { name: "Apertura a la experiencia", high: "Eres curioso, imaginativo y disfrutas las ideas nuevas.", low: "Prefieres lo conocido, lo práctico y probado." },
  C: { name: "Responsabilidad", high: "Eres organizado, constante y cumples lo que te propones.", low: "Eres flexible y espontáneo; te conviene reforzar la planificación." },
  E: { name: "Extraversión", high: "Te energiza estar con gente, hablar y participar.", low: "Prefieres ambientes tranquilos y trabajar con concentración." },
  A: { name: "Amabilidad", high: "Eres empático, cooperativo y te importa el bienestar de los demás.", low: "Eres directo y competitivo; defiendes tus puntos de vista." },
  N: { name: "Estabilidad emocional", high: "Mantienes la calma ante la presión y los cambios.", low: "Sientes mucho las presiones; aprender a manejar el estrés te ayudará." },
};
const PERSONALITY = {
  O: [["Me gusta probar cosas nuevas aunque no sepa cómo saldrán", 1], ["Me hago preguntas sobre cómo funciona el mundo", 1], ["Disfruto el arte, la música o las ideas originales", 1], ["Prefiero hacer las cosas siempre de la misma manera", -1], ["Las ideas abstractas me aburren", -1], ["Me imagino con facilidad soluciones distintas a un problema", 1]],
  C: [["Termino mis tareas antes de la fecha de entrega", 1], ["Planifico lo que voy a hacer durante la semana", 1], ["Mantengo mis cosas ordenadas", 1], ["Suelo dejar las cosas para el último momento", -1], ["Me distraigo con facilidad cuando estudio", -1], ["Reviso mi trabajo antes de entregarlo", 1]],
  E: [["Me resulta fácil hablar con personas que no conozco", 1], ["Disfruto ser el centro de atención en una reunión", 1], ["Me animo a participar en clase o en grupo", 1], ["Prefiero pasar el tiempo libre a solas", -1], ["Me cuesta expresar mis opiniones frente a un grupo", -1], ["Me gusta organizar salidas con mis amigos", 1]],
  A: [["Me pongo en el lugar de los demás", 1], ["Ayudo a mis compañeros aunque no me lo pidan", 1], ["Confío en las buenas intenciones de la gente", 1], ["Me cuesta ceder en una discusión", -1], ["Me molesta tener que trabajar en equipo", -1], ["Trato con amabilidad incluso a quien no me cae bien", 1]],
  N: [["Mantengo la calma en los exámenes", 1], ["Me recupero rápido cuando algo me sale mal", 1], ["Manejo bien la presión del tiempo", 1], ["Me preocupo demasiado por lo que puede salir mal", -1], ["Mi estado de ánimo cambia con facilidad", -1], ["Me pongo muy nervioso ante situaciones nuevas", -1]],
};
for (const [f, list] of Object.entries(PERSONALITY)) {
  bank(`vp.${f}+`, list.filter(([, k]) => k > 0).map(([x]) => ({ q: x, o: SCALES.agree })), { keepOrder: true });
  bank(`vp.${f}-`, list.filter(([, k]) => k < 0).map(([x]) => ({ q: x, o: SCALES.agree })), { keepOrder: true });
}

// ---------- 3. Valores laborales: qué buscas en tu futuro trabajo ----------
export const VALUES = {
  ayudar: "Ayudar a los demás", ingresos: "Buenos ingresos", estabilidad: "Estabilidad laboral", creatividad: "Crear e innovar",
  autonomia: "Autonomía e independencia", liderazgo: "Liderar e influir", aprendizaje: "Aprender e investigar siempre",
  aire: "Trabajo en movimiento o al aire libre", equipo: "Trabajar en equipo", equilibrio: "Equilibrio entre vida y trabajo",
};
const VALUE_ITEMS = {
  ayudar: ["Que mi trabajo mejore la vida de otras personas", "Sentir que sirvo a mi comunidad"],
  ingresos: ["Ganar un buen sueldo", "Tener posibilidades de ingresos altos con el tiempo"],
  estabilidad: ["Tener un empleo seguro y estable", "Saber que tendré trabajo durante muchos años"],
  creatividad: ["Poder crear cosas nuevas en mi trabajo", "Proponer ideas originales y que se apliquen"],
  autonomia: ["Decidir yo mismo cómo hacer mi trabajo", "Poder trabajar por mi cuenta o tener mi propio negocio"],
  liderazgo: ["Llegar a dirigir equipos o empresas", "Tener influencia en las decisiones importantes"],
  aprendizaje: ["Aprender cosas nuevas todo el tiempo", "Investigar y resolver problemas complejos"],
  aire: ["No estar todo el día sentado en una oficina", "Trabajar al aire libre o visitando distintos lugares"],
  equipo: ["Trabajar rodeado de compañeros", "Formar parte de un equipo con un mismo objetivo"],
  equilibrio: ["Tener tiempo para mi familia y mis aficiones", "Tener un horario de trabajo predecible"],
};
for (const [v, list] of Object.entries(VALUE_ITEMS)) {
  bank(`vv.${v}`, list.map(x => ({ q: `En tu futuro trabajo, ¿qué tan importante es para ti… ${x.charAt(0).toLowerCase() + x.slice(1)}?`, o: SCALES.importance })), { keepOrder: true });
}

// ---------- 4. Adaptabilidad de carrera (modelo NEFELE / Savickas) ----------
export const ADAPT = {
  concern: { name: "Preocupación por el futuro", desc: "Pensar en tu futuro y prepararte para él.", tip: "Escribe dónde te ves en 5 años y qué pasos te acercan a esa meta." },
  control: { name: "Control de tus decisiones", desc: "Sentir que tu futuro depende de ti y asumir tus decisiones.", tip: "Ponte metas pequeñas con fecha y cúmplelas: así ganas confianza en tus decisiones." },
  curiosity: { name: "Curiosidad por explorar", desc: "Explorar opciones de carrera, informarte y probar.", tip: "Habla con estudiantes y profesionales de 3 carreras distintas y visita sus facultades." },
  confidence: { name: "Confianza en tus capacidades", desc: "Creer que puedes superar los retos para lograr tus metas.", tip: "Practica con simulacros: ver tu progreso aumenta la confianza para el examen de admisión." },
};
const ADAPT_ITEMS = {
  concern: ["Pienso en cómo será mi futuro profesional", "Me doy cuenta de que las decisiones de hoy influyen en mi futuro", "Me preparo desde ahora para lo que quiero estudiar", "Tengo claro qué necesito para ingresar a la universidad", "Planifico cómo alcanzar mis metas"],
  control: ["Tomo mis propias decisiones sobre mis estudios", "Asumo la responsabilidad de lo que elijo", "Defiendo lo que quiero estudiar aunque otros opinen distinto", "Me mantengo firme en mis metas aunque haya dificultades", "Confío en mi criterio para decidir"],
  curiosity: ["Busco información sobre distintas carreras", "Me pregunto qué otras opciones tengo además de la que pensé", "Converso con profesionales para saber cómo es su trabajo", "Exploro mis intereses probando actividades nuevas", "Comparo universidades y planes de estudio"],
  confidence: ["Me siento capaz de aprender lo que la carrera exige", "Supero los obstáculos cuando estudio algo difícil", "Hago bien mis tareas aunque sean complicadas", "Creo que puedo aprobar el examen de admisión", "Encuentro soluciones cuando algo no me sale"],
};
for (const [c, list] of Object.entries(ADAPT_ITEMS)) bank(`va.${c}`, list.map(x => ({ q: x, o: SCALES.describe })), { keepOrder: true });

// Secciones del test (el catálogo las usa).
export const VOC_SECTIONS = [
  ...Object.keys(TYPES).map(t => ({ name: `int.${t}`, group: "Parte 1 de 4 · Tus intereses", n: 4, src: [`voc.${t}`] })),
  ...Object.keys(BIG5).map(f => ({ name: `per.${f}`, group: "Parte 2 de 4 · Tu forma de ser", n: 3, src: [[`vp.${f}+`, 2], `vp.${f}-`] })),
  ...Object.keys(VALUES).map(v => ({ name: `val.${v}`, group: "Parte 3 de 4 · Lo que buscas en un trabajo", n: 1, src: [`vv.${v}`] })),
  ...Object.keys(ADAPT).map(c => ({ name: `ada.${c}`, group: "Parte 4 de 4 · Tu preparación para decidir", n: 3, src: [`va.${c}`] })),
];

// Destreza principal de cada tipo (se usa en el informe PDF).
export const SKILLS = {
  R: "Habilidad práctica, técnica y manual", I: "Análisis, investigación y razonamiento científico", A: "Creatividad, imaginación y expresión",
  S: "Comunicación, empatía y servicio a los demás", E: "Liderazgo, negociación y toma de decisiones", C: "Organización, precisión y manejo de datos",
};

// Oferta de pregrado frecuente en universidades públicas y privadas del Ecuador, con su código RIASEC dominante.
const SAL = "Salud", ING = "Ingeniería y tecnología", CIE = "Ciencias exactas y naturales", AGR = "Agro y ambiente", ART = "Arte y diseño",
  COM = "Comunicación", EDU = "Educación", SOC = "Ciencias sociales y jurídicas", NEG = "Negocios y administración", TUR = "Turismo y hospitalidad";
export const CAREERS = [
  ["Medicina", "IS", SAL], ["Enfermería", "SI", SAL], ["Obstetricia", "SI", SAL], ["Odontología", "IR", SAL], ["Nutrición y Dietética", "IS", SAL],
  ["Fisioterapia", "SR", SAL], ["Terapia Ocupacional", "SR", SAL], ["Terapia de Lenguaje", "SA", SAL], ["Laboratorio Clínico", "IC", SAL],
  ["Imagenología y Radiología", "IR", SAL], ["Optometría", "IR", SAL], ["Bioquímica y Farmacia", "IC", SAL], ["Psicología Clínica", "SI", SAL],
  ["Software", "IC", ING], ["Tecnologías de la Información", "IC", ING], ["Computación", "IR", ING], ["Ciencia de Datos", "IC", ING], ["Ciberseguridad", "IC", ING],
  ["Telecomunicaciones", "RI", ING], ["Electrónica y Automatización", "RI", ING], ["Electricidad", "RI", ING], ["Mecánica", "RI", ING], ["Mecatrónica", "RI", ING],
  ["Ingeniería Automotriz", "RI", ING], ["Ingeniería Industrial", "RC", ING], ["Ingeniería Civil", "RI", ING], ["Ingeniería Química", "IR", ING],
  ["Ingeniería en Alimentos", "IR", ING], ["Ingeniería en Minas", "RI", ING], ["Ingeniería en Petróleos", "RI", ING], ["Geología", "IR", ING],
  ["Biología", "IR", CIE], ["Biotecnología", "IR", CIE], ["Física", "IR", CIE], ["Matemática", "IC", CIE], ["Química", "IR", CIE], ["Estadística", "CI", CIE],
  ["Agronomía", "RI", AGR], ["Agropecuaria", "RE", AGR], ["Agroindustria", "RE", AGR], ["Ingeniería Forestal", "RI", AGR], ["Ingeniería Ambiental", "IR", AGR],
  ["Recursos Naturales Renovables", "RI", AGR], ["Medicina Veterinaria", "IR", AGR], ["Acuicultura", "RI", AGR],
  ["Arquitectura", "AR", ART], ["Diseño Gráfico", "AE", ART], ["Diseño de Interiores", "AR", ART], ["Diseño Textil y Moda", "AE", ART], ["Artes Plásticas", "AR", ART],
  ["Artes Escénicas", "AS", ART], ["Música", "AS", ART], ["Cine y Producción Audiovisual", "AE", ART], ["Diseño Industrial", "AR", ART],
  ["Comunicación", "AE", COM], ["Periodismo", "AS", COM], ["Publicidad", "AE", COM], ["Relaciones Públicas", "ES", COM],
  ["Educación Inicial", "SA", EDU], ["Educación Básica", "SC", EDU], ["Pedagogía de los Idiomas Nacionales y Extranjeros", "SA", EDU],
  ["Pedagogía de las Matemáticas y la Física", "SI", EDU], ["Pedagogía de las Ciencias Experimentales", "SI", EDU], ["Pedagogía de la Lengua y la Literatura", "SA", EDU],
  ["Pedagogía de la Historia y las Ciencias Sociales", "SI", EDU], ["Educación Especial", "SA", EDU], ["Psicopedagogía", "SI", EDU], ["Pedagogía de la Actividad Física y Deporte", "SR", EDU],
  ["Psicología", "SI", SOC], ["Derecho", "ES", SOC], ["Trabajo Social", "SE", SOC], ["Sociología", "SI", SOC], ["Ciencias Políticas", "ES", SOC], ["Relaciones Internacionales", "ES", SOC],
  ["Economía", "IC", NEG], ["Administración de Empresas", "EC", NEG], ["Contabilidad y Auditoría", "CE", NEG], ["Finanzas", "CE", NEG], ["Mercadotecnia", "EA", NEG],
  ["Comercio Exterior y Negocios Internacionales", "EC", NEG], ["Gestión del Talento Humano", "SE", NEG], ["Administración Pública", "EC", NEG], ["Emprendimiento e Innovación", "EA", NEG],
  ["Turismo", "ES", TUR], ["Hotelería", "ES", TUR], ["Gastronomía", "AR", TUR],
];

// Valores que suele ofrecer cada área profesional.
const AREA_VALUES = {
  [SAL]: ["ayudar", "estabilidad", "aprendizaje"], [ING]: ["ingresos", "aprendizaje", "equipo"], [CIE]: ["aprendizaje", "autonomia"],
  [AGR]: ["aire", "aprendizaje"], [ART]: ["creatividad", "autonomia"], [COM]: ["creatividad", "equipo", "liderazgo"],
  [EDU]: ["ayudar", "equilibrio", "estabilidad"], [SOC]: ["ayudar", "liderazgo"], [NEG]: ["ingresos", "liderazgo", "estabilidad"],
  [TUR]: ["equipo", "aire", "creatividad"],
};
// Rasgos de personalidad asociados a cada tipo de interés.
const TYPE_TRAITS = { R: ["C", "N"], I: ["O"], A: ["O"], S: ["A", "E"], E: ["E"], C: ["C"] };

const pctOf = (sum, max) => (max ? Math.round((sum / max) * 100) : 0);

// answers: [{ key: "voc.R" | "vp.O+" | "vp.O-" | "vv.ayudar" | "va.concern", value }]
export function scoreVocational(answers) {
  const acc = {};
  const add = (k, v) => { (acc[k] ||= { s: 0, m: 0 }); acc[k].s += v; acc[k].m += 4; };
  for (const { key, value } of answers) {
    const v = SCORE[value];
    if (v == null) continue;
    const [kind, rest] = key.split(".");
    if (kind === "voc") add("i." + rest, v);
    else if (kind === "vp") add("p." + rest[0], rest[1] === "-" ? 4 - v : v);
    else if (kind === "vv") add("v." + rest, v);
    else if (kind === "va") add("a." + rest, v);
  }
  const get = k => (acc[k] ? pctOf(acc[k].s, acc[k].m) : 50);

  const personality = Object.entries(BIG5).map(([code, f]) => { const pct = get("p." + code); return { code, name: f.name, pct, text: pct >= 55 ? f.high : f.low }; });
  const big = Object.fromEntries(personality.map(p => [p.code, p.pct]));
  const values = Object.entries(VALUES).map(([code, name]) => ({ code, name, pct: get("v." + code) })).sort((a, b) => b.pct - a.pct);
  const val = Object.fromEntries(values.map(v => [v.code, v.pct]));
  const adaptability = Object.entries(ADAPT).map(([code, a]) => ({ code, ...a, pct: get("a." + code) }));
  const readiness = Math.round(adaptability.reduce((x, a) => x + a.pct, 0) / adaptability.length);

  // Tipo RIASEC: 80 % intereses + 20 % rasgos de personalidad afines.
  const profile = Object.keys(TYPES).map(code => {
    const interest = get("i." + code);
    const traits = TYPE_TRAITS[code].reduce((x, t) => x + big[t], 0) / TYPE_TRAITS[code].length;
    return { code, name: TYPES[code].name, desc: TYPES[code].desc, skill: SKILLS[code], interest, pct: Math.round(interest * 0.8 + traits * 0.2) };
  }).sort((a, b) => b.pct - a.pct);
  const pct = Object.fromEntries(profile.map(p => [p.code, p.pct]));
  const rank = Object.fromEntries(profile.map((p, i) => [p.code, i]));

  // Afinidad con cada carrera: 75 % perfil de intereses y personalidad + 25 % valores laborales del área.
  const careers = CAREERS.map(([name, code, area]) => {
    const fitType = pct[code[0]] * 0.65 + pct[code[1]] * 0.35;
    const vs = AREA_VALUES[area] || [];
    const fitVal = vs.length ? vs.reduce((x, v) => x + val[v], 0) / vs.length : fitType;
    return { name, area, code, fit: Math.round(fitType * 0.75 + fitVal * 0.25) };
  }).sort((a, b) => b.fit - a.fit || rank[a.code[0]] - rank[b.code[0]] || rank[a.code[1]] - rank[b.code[1]]);

  const byArea = {};
  for (const c of careers) (byArea[c.area] ||= []).push(c.fit);
  const areas = Object.entries(byArea)
    .map(([area, fits]) => ({ area, pct: Math.round(fits.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, fits.length)), careers: careers.filter(c => c.area === area).slice(0, 3).map(c => c.name) }))
    .sort((a, b) => b.pct - a.pct);
  const readinessLabel = readiness >= 75 ? "Alta: estás listo para decidir" : readiness >= 55 ? "Media: vas por buen camino" : "En construcción: te conviene explorar más antes de decidir";
  return { profile, careers, areas, personality, values, adaptability, readiness, readinessLabel };
}
