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

// Carreras de pregrado frecuentes en universidades del Ecuador, con su código RIASEC dominante.
export const CAREERS = [
  ["Medicina", "IS", "Salud"], ["Enfermería", "SI", "Salud"], ["Odontología", "IR", "Salud"], ["Nutrición y Dietética", "IS", "Salud"],
  ["Fisioterapia", "SR", "Salud"], ["Psicología Clínica", "SI", "Salud"], ["Psicología", "SI", "Ciencias sociales"], ["Medicina Veterinaria", "IR", "Agro y ambiente"],
  ["Laboratorio Clínico", "IC", "Salud"], ["Obstetricia", "SI", "Salud"],
  ["Software", "IC", "Ingeniería y tecnología"], ["Tecnologías de la Información", "IC", "Ingeniería y tecnología"], ["Computación", "IR", "Ingeniería y tecnología"],
  ["Ingeniería Civil", "RI", "Ingeniería y tecnología"], ["Electricidad", "RI", "Ingeniería y tecnología"], ["Mecatrónica", "RI", "Ingeniería y tecnología"],
  ["Ingeniería Industrial", "RC", "Ingeniería y tecnología"], ["Telecomunicaciones", "RI", "Ingeniería y tecnología"], ["Ingeniería Automotriz", "RI", "Ingeniería y tecnología"],
  ["Biotecnología", "IR", "Ciencias"], ["Biología", "IR", "Ciencias"], ["Física", "IR", "Ciencias"], ["Matemática", "IC", "Ciencias"], ["Química", "IR", "Ciencias"],
  ["Agronomía", "RI", "Agro y ambiente"], ["Agroindustria", "RE", "Agro y ambiente"], ["Ingeniería Forestal", "RI", "Agro y ambiente"], ["Ingeniería Ambiental", "IR", "Agro y ambiente"], ["Recursos Naturales Renovables", "RI", "Agro y ambiente"],
  ["Arquitectura", "AR", "Arte y diseño"], ["Diseño Gráfico", "AE", "Arte y diseño"], ["Artes Plásticas", "AR", "Arte y diseño"], ["Música", "AS", "Arte y diseño"], ["Diseño Textil y Moda", "AE", "Arte y diseño"],
  ["Comunicación", "AE", "Comunicación"], ["Periodismo", "AS", "Comunicación"], ["Publicidad", "AE", "Comunicación"],
  ["Pedagogía de los Idiomas Nacionales y Extranjeros", "SA", "Educación"], ["Educación Inicial", "SA", "Educación"], ["Educación Básica", "SC", "Educación"],
  ["Pedagogía de la Actividad Física y Deporte", "SR", "Educación"], ["Pedagogía de las Ciencias Experimentales", "SI", "Educación"],
  ["Derecho", "ES", "Ciencias sociales"], ["Trabajo Social", "SE", "Ciencias sociales"], ["Sociología", "SI", "Ciencias sociales"], ["Relaciones Internacionales", "ES", "Ciencias sociales"],
  ["Economía", "IC", "Negocios"], ["Administración de Empresas", "EC", "Negocios"], ["Contabilidad y Auditoría", "CE", "Negocios"], ["Mercadotecnia", "EA", "Negocios"],
  ["Finanzas", "CE", "Negocios"], ["Turismo", "ES", "Negocios"], ["Gastronomía", "AR", "Negocios"], ["Gestión del Talento Humano", "SE", "Negocios"], ["Comercio Exterior", "EC", "Negocios"],
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
    .map(code => ({ code, name: TYPES[code].name, desc: TYPES[code].desc, pct: max[code] ? Math.round((sum[code] / max[code]) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);
  const pct = Object.fromEntries(profile.map(p => [p.code, p.pct]));
  const careers = CAREERS
    .map(([name, code, area]) => ({ name, area, code, fit: Math.round(pct[code[0]] * 0.65 + pct[code[1]] * 0.35) }))
    .sort((a, b) => b.fit - a.fit);
  return { profile, careers };
}
