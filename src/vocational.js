// Test vocacional basado en el modelo RIASEC de Holland, adaptado a la oferta de pregrado del Ecuador.
import { bank } from "./lib/sources.js";

export const TYPES = {
  R: { name: "Realista", desc: "Te gusta construir, reparar y trabajar con herramientas, máquinas, plantas o animales. Prefieres resultados concretos." },
  I: { name: "Investigador", desc: "Disfrutas analizar, resolver problemas y entender cómo funcionan las cosas. Tienes curiosidad científica." },
  A: { name: "Artístico", desc: "Eres creativo, expresivo y original. Te atraen el diseño, la comunicación y las artes." },
  S: { name: "Social", desc: "Te motiva ayudar, enseñar y cuidar a otras personas. Tienes empatía y facilidad para escuchar." },
  E: { name: "Emprendedor", desc: "Te gusta liderar, persuadir y tomar decisiones. Te atraen los negocios y los retos." },
  C: { name: "Convencional", desc: "Eres organizado, preciso y metódico. Te sientes cómodo con datos, procesos y normas claras." },
};

const ITEMS = {
  R: ["Armar o reparar aparatos eléctricos", "Trabajar al aire libre con plantas o animales", "Manejar maquinaria o herramientas", "Diseñar y construir una maqueta o estructura", "Instalar redes o equipos de computación", "Cultivar un huerto y mejorar la producción", "Arreglar el motor de un vehículo", "Hacer mediciones en el campo o en una obra"],
  I: ["Hacer experimentos en un laboratorio", "Resolver problemas de matemática difíciles", "Investigar por qué ocurre una enfermedad", "Leer sobre descubrimientos científicos", "Programar una aplicación o un videojuego", "Analizar datos para encontrar patrones", "Entender cómo funciona el cuerpo humano", "Estudiar el comportamiento de los ecosistemas"],
  A: ["Dibujar, pintar o diseñar", "Escribir cuentos, poemas o guiones", "Tocar un instrumento o componer música", "Editar videos o tomar fotografías", "Decorar espacios o diseñar ropa", "Actuar o participar en obras de teatro", "Crear contenido para redes sociales", "Diseñar la fachada de un edificio"],
  S: ["Enseñar a otros algo que sé", "Ayudar a personas con problemas emocionales", "Cuidar a enfermos o adultos mayores", "Organizar actividades para niños", "Trabajar como voluntario en mi comunidad", "Escuchar y aconsejar a mis amigos", "Promover hábitos de vida saludable", "Defender los derechos de otras personas"],
  E: ["Liderar un equipo para lograr una meta", "Vender un producto o una idea", "Crear mi propio negocio", "Negociar para llegar a un acuerdo", "Hablar en público y convencer a otros", "Organizar un evento grande", "Tomar decisiones importantes bajo presión", "Representar a mi colegio o grupo"],
  C: ["Llevar las cuentas y el presupuesto de algo", "Ordenar y clasificar información", "Trabajar con hojas de cálculo", "Revisar documentos para encontrar errores", "Seguir procedimientos y normas claras", "Planificar horarios y agendas", "Administrar inventarios o archivos", "Elaborar informes con datos precisos"],
};

const LIKERT = ["Me encanta", "Me gusta", "Me da igual", "No me gusta"];
export const LIKERT_SCORE = { "Me encanta": 3, "Me gusta": 2, "Me da igual": 1, "No me gusta": 0 };

for (const [t, list] of Object.entries(ITEMS)) {
  bank(`voc.${t}`, list.map(x => ({ q: `¿Qué tanto te gustaría… ${x.charAt(0).toLowerCase() + x.slice(1)}?`, o: LIKERT })), { keepOrder: true });
}
export const VOC_LIKERT = LIKERT;

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

export function scoreVocational(answers /* [{type, value}] */) {
  const sum = {}, max = {};
  for (const t of Object.keys(TYPES)) { sum[t] = 0; max[t] = 0; }
  for (const { type, value } of answers) {
    if (!(type in sum)) continue;
    sum[type] += LIKERT_SCORE[value] ?? 0;
    max[type] += 3;
  }
  const profile = Object.keys(TYPES)
    .map(code => ({ code, name: TYPES[code].name, desc: TYPES[code].desc, skill: SKILLS[code], pct: max[code] ? Math.round((sum[code] / max[code]) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);
  const pct = Object.fromEntries(profile.map(p => [p.code, p.pct]));
  const rank = Object.fromEntries(profile.map((p, i) => [p.code, i]));
  const careers = CAREERS
    .map(([name, code, area]) => ({ name, area, code, fit: Math.round(pct[code[0]] * 0.65 + pct[code[1]] * 0.35) }))
    .sort((a, b) => b.fit - a.fit || rank[a.code[0]] - rank[b.code[0]] || rank[a.code[1]] - rank[b.code[1]]);
  // Afinidad por área: promedio de sus 3 carreras más compatibles.
  const byArea = {};
  for (const c of careers) (byArea[c.area] ||= []).push(c.fit);
  const areas = Object.entries(byArea)
    .map(([area, fits]) => ({ area, pct: Math.round(fits.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, fits.length)), careers: careers.filter(c => c.area === area).slice(0, 3).map(c => c.name) }))
    .sort((a, b) => b.pct - a.pct);
  return { profile, careers, areas };
}
