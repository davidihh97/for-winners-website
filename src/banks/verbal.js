import { bank, dict, passages } from "../lib/sources.js";
import { options } from "../lib/rand.js";

// Palabra, sinónimo, antónimo. Sirve para preguntas de sinónimos y antónimos con distractores variables.
const WORDS = [
  ["abnegado", "sacrificado", "egoísta"], ["ameno", "agradable", "aburrido"], ["bonanza", "prosperidad", "crisis"], ["cauto", "prudente", "imprudente"],
  ["clemente", "compasivo", "despiadado"], ["contrito", "arrepentido", "impenitente"], ["copioso", "abundante", "escaso", "abu"], ["diestro", "hábil", "torpe", "hab2"],
  ["discreto", "reservado", "indiscreto"], ["endeble", "débil", "fuerte", "fue"], ["recio", "fuerte", "débil", "fue"], ["enérgico", "vigoroso", "decaído", "ene"],
  ["lánguido", "decaído", "vigoroso", "ene"], ["erudito", "sabio", "ignorante"], ["fecundo", "fértil", "estéril", "abu"], ["fiable", "confiable", "dudoso"],
  ["frugal", "sobrio", "glotón", "mod"], ["gélido", "helado", "ardiente"], ["insigne", "ilustre", "desconocido"], ["jovial", "alegre", "sombrío", "luz"],
  ["lúcido", "claro", "confuso", "cla"], ["nítido", "claro", "borroso", "cla"], ["mendaz", "mentiroso", "sincero"], ["mezquino", "tacaño", "generoso", "gen"],
  ["onírico", "soñado", "real"], ["perspicaz", "agudo", "torpe", "hab2"], ["pertinaz", "obstinado", "flexible", "ten"], ["plácido", "tranquilo", "agitado", "cal"],
  ["presto", "rápido", "lento", "rap"], ["raudo", "veloz", "lento", "rap"], ["fastuoso", "lujoso", "modesto"], ["ecuánime", "imparcial", "parcial"],
  ["ufano", "orgulloso", "avergonzado"], ["exhaustivo", "completo", "superficial", "sup"], ["somero", "superficial", "profundo", "sup"],
  ["inicuo", "injusto", "justo"], ["ladino", "astuto", "ingenuo", "ast"], ["conspicuo", "notable", "desconocido"], ["probo", "honrado", "deshonesto"],
  ["deleznable", "despreciable", "admirable"], ["exultante", "eufórico", "abatido"], ["avezado", "experto", "novato"], ["acucioso", "diligente", "negligente"],
  ["pusilánime", "cobarde", "valeroso", "val"], ["prístino", "original", "alterado"], ["procaz", "insolente", "respetuoso"],
  ["diáfano", "transparente", "opaco", "luz"], ["perenne", "permanente", "temporal", "dur"],
  ["benevolente", "bondadoso", "malvado", "ama"], 
  ["prolijo", "esmerado", "descuidado", "cui"], ["arduo", "difícil", "sencillo"],
  ["sagaz", "astuto", "ingenuo", "ast"], ["tenaz", "perseverante", "inconstante", "ten"], 
  ["afable", "amable", "hosco", "ama"], ["lóbrego", "sombrío", "luminoso", "luz"],
  ["ávido", "ansioso", "indiferente", "pas"], ["recóndito", "oculto", "visible"], ["vetusto", "antiguo", "moderno", "ant"],
  ["intrépido", "valiente", "cobarde", "val"], ["sosegado", "tranquilo", "inquieto", "cal"], ["fortuito", "casual", "intencional"],
  ["impávido", "imperturbable", "asustado", "val"], ["lacónico", "breve", "extenso", "breve"], 
  ["altivo", "orgulloso", "humilde", "hum"], ["apacible", "sereno", "violento", "cal"], ["dócil", "obediente", "rebelde", "obe"],
  ["elocuente", "expresivo", "inexpresivo", "hab"], ["escueto", "conciso", "detallado", "breve"], ["fútil", "insignificante", "importante", "ins"],
  ["inherente", "propio", "ajeno"], ["mesurado", "moderado", "exagerado", "mod"],
  ["nimio", "insignificante", "trascendental", "ins"], ["pulcro", "limpio", "sucio", "cui"],
  ["sumiso", "obediente", "insumiso", "obe"], ["taciturno", "callado", "conversador", "hab"], ["ubérrimo", "fértil", "estéril", "abu"],
  ["vehemente", "apasionado", "indiferente", "pas"], ["zafio", "tosco", "refinado"], ["indulgente", "tolerante", "severo", "sev"],
  ["magnánimo", "generoso", "mezquino", "gen"], ["parco", "moderado", "excesivo", "mod"], ["sucinto", "breve", "extenso", "breve"],
  ["exacerbar", "agravar", "mitigar", "mit"], ["menoscabar", "disminuir", "aumentar", "elo"],
  ["acatar", "obedecer", "desobedecer", "obe"], ["vislumbrar", "entrever", "ignorar"], ["dilapidar", "derrochar", "ahorrar", "gen"],
  ["enaltecer", "elogiar", "denigrar", "elo"], ["soslayar", "eludir", "afrontar"],
];

// Distractores de otras palabras, excluyendo las que comparten campo semántico (4.º elemento).
const others = (r, all, idx, n) => {
  const [, syn, ant, g] = all[idx];
  return r.shuffle(all.filter((x, i) => i !== idx && !(g && x[3] === g)))
    .map(x => (r.chance(0.5) ? x[1] : x[2]))
    .filter(w => w !== syn && w !== ant)
    .slice(0, n);
};
dict("vb.syn", WORDS, ([w, syn, ant], r, all, idx) => ({
  prompt: `Elige el SINÓNIMO de: ${w.toUpperCase()}`,
  options: options(syn, [ant, ...others(r, all, idx, 4)], 4),
}));
dict("vb.ant", WORDS, ([w, syn, ant], r, all, idx) => ({
  prompt: `Elige el ANTÓNIMO de: ${w.toUpperCase()}`,
  options: options(ant, [syn, ...others(r, all, idx, 4)], 4),
}));

bank("vb.analogy", [
  { q: "ALFARERO es a ARCILLA como ESCULTOR es a:", o: ["Mármol", "Museo", "Cincel", "Estatua"] },
  { q: "VELOCÍMETRO es a VELOCIDAD como CRONÓMETRO es a:", o: ["Tiempo", "Carrera", "Segundo", "Reloj"] },
  { q: "ARCHIPIÉLAGO es a ISLA como CONSTELACIÓN es a:", o: ["Estrella", "Cielo", "Galaxia", "Noche"] },
  { q: "NAVEGANTE es a FARO como VIAJERO es a:", o: ["Señal", "Maleta", "Viaje", "Pasaporte"] },
  { q: "TIMIDEZ es a AUDACIA como TRISTEZA es a:", o: ["Júbilo", "Llanto", "Pena", "Soledad"] },
  { q: "SASTRE es a TIJERA como LEÑADOR es a:", o: ["Hacha", "Bosque", "Madera", "Árbol"] },
  { q: "PEZ es a AGUA como AVE es a:", o: ["Aire", "Nido", "Pluma", "Árbol"] },
  { q: "LIBRO es a PÁGINA como CASA es a:", o: ["Ladrillo", "Puerta", "Techo", "Ciudad"] },
  { q: "FRÍO es a CALOR como OSCURIDAD es a:", o: ["Luz", "Noche", "Sombra", "Sol"] },
  { q: "PINTOR es a PINCEL como ESCRITOR es a:", o: ["Pluma", "Novela", "Lector", "Papel"] },
  { q: "OJO es a VER como OÍDO es a:", o: ["Escuchar", "Sonido", "Oreja", "Música"] },
  { q: "SEMILLA es a ÁRBOL como HUEVO es a:", o: ["Ave", "Nido", "Cáscara", "Yema"] },
  { q: "QUITO es a ECUADOR como LIMA es a:", o: ["Perú", "Bolivia", "Chile", "Colombia"] },
  { q: "AGUA es a SÓLIDO como HIELO es a… (cuando se calienta):", o: ["Líquido", "Frío", "Gas", "Nieve"] },
  { q: "CARPINTERO es a MADERA como HERRERO es a:", o: ["Hierro", "Martillo", "Fuego", "Taller"] },
  { q: "VERSO es a POEMA como ESCENA es a:", o: ["Obra de teatro", "Actor", "Telón", "Público"] },
  { q: "RAÍZ es a PLANTA como CIMIENTO es a:", o: ["Edificio", "Cemento", "Suelo", "Arquitecto"] },
  { q: "ALFABETO es a LETRA como CALENDARIO es a:", o: ["Día", "Año", "Reloj", "Fecha festiva"] },
  { q: "BRÚJULA es a ORIENTACIÓN como RELOJ es a:", o: ["Tiempo", "Hora", "Muñeca", "Aguja"] },
  { q: "SOBERBIA es a HUMILDAD como AVARICIA es a:", o: ["Generosidad", "Riqueza", "Codicia", "Pobreza"] },
  { q: "TRIGO es a PAN como UVA es a:", o: ["Vino", "Viña", "Racimo", "Pasa"] },
  { q: "GRANO es a GRANERO como AGUA es a:", o: ["Represa", "Río", "Lluvia", "Vaso"] },
  { q: "TECLADO es a COMPUTADORA como VOLANTE es a:", o: ["Automóvil", "Rueda", "Chofer", "Carretera"] },
  { q: "CUERO es a ZAPATO como LANA es a:", o: ["Suéter", "Oveja", "Hilo", "Frío"] },
  { q: "CANSANCIO es a DESCANSO como ENFERMEDAD es a:", o: ["Tratamiento", "Médico", "Fiebre", "Hospital"] },
  { q: "ABOGADO es a LEY como MÚSICO es a:", o: ["Partitura", "Guitarra", "Concierto", "Oído"] },
  { q: "CIRCUNFERENCIA es a CÍRCULO como PERÍMETRO es a:", o: ["Polígono", "Línea", "Radio", "Área"] },
  { q: "ESTUDIAR es a APROBAR como ENTRENAR es a:", o: ["Ganar", "Correr", "Gimnasio", "Cansarse"] },
  { q: "MIOPE es a VISTA como SORDO es a:", o: ["Oído", "Voz", "Ruido", "Silencio"] },
  { q: "HOJA es a ÁRBOL como PÉTALO es a:", o: ["Flor", "Tallo", "Jardín", "Polen"] },
]);

bank("vb.odd", [
  { q: "Término excluido: Saturno, Júpiter, Sirio, Neptuno", o: ["Sirio", "Saturno", "Júpiter", "Neptuno"], e: "Sirio es una estrella; los demás son planetas." },
  { q: "Término excluido: Loja, Ambato, Riobamba, Medellín", o: ["Medellín", "Loja", "Ambato", "Riobamba"], e: "Medellín está en Colombia." },
  { q: "Término excluido: manzana, pera, silla, uva", o: ["Silla", "Manzana", "Pera", "Uva"] },
  { q: "Término excluido: guitarra, violín, arpa, flauta", o: ["Flauta", "Guitarra", "Violín", "Arpa"], e: "La flauta es de viento; los demás son de cuerda." },
  { q: "Término excluido: cuadrado, rombo, triángulo, rectángulo", o: ["Triángulo", "Cuadrado", "Rombo", "Rectángulo"], e: "Los demás tienen cuatro lados." },
  { q: "Término excluido: alegría, tristeza, mesa, ira", o: ["Mesa", "Alegría", "Tristeza", "Ira"] },
  { q: "Término excluido: correr, saltar, nadar, rápido", o: ["Rápido", "Correr", "Saltar", "Nadar"], e: "Rápido es adjetivo; los demás son verbos." },
  { q: "Término excluido: ballena, delfín, tiburón, foca", o: ["Tiburón", "Ballena", "Delfín", "Foca"], e: "El tiburón es un pez; los demás son mamíferos." },
  { q: "Término excluido: hidrógeno, oxígeno, agua, nitrógeno", o: ["Agua", "Hidrógeno", "Oxígeno", "Nitrógeno"], e: "El agua es un compuesto; los demás son elementos." },
  { q: "Término excluido: martillo, destornillador, serrucho, clavo", o: ["Clavo", "Martillo", "Destornillador", "Serrucho"], e: "El clavo no es una herramienta." },
  { q: "Término excluido: rojo, azul, amarillo, redondo", o: ["Redondo", "Rojo", "Azul", "Amarillo"] },
  { q: "Término excluido: corazón, hígado, pulmón, hueso", o: ["Hueso", "Corazón", "Hígado", "Pulmón"], e: "Los demás son órganos." },
  { q: "Término excluido: soneto, oda, novela, elegía", o: ["Novela", "Soneto", "Oda", "Elegía"], e: "La novela es narrativa; las demás son composiciones líricas." },
  { q: "Término excluido: kilómetro, metro, litro, centímetro", o: ["Litro", "Kilómetro", "Metro", "Centímetro"], e: "El litro mide volumen." },
  { q: "Término excluido: Imbabura, Pichincha, Carchi, Antioquia", o: ["Antioquia", "Imbabura", "Pichincha", "Carchi"], e: "Antioquia es un departamento de Colombia." },
  { q: "Término excluido: lunes, martes, enero, viernes", o: ["Enero", "Lunes", "Martes", "Viernes"] },
  { q: "Término excluido: suma, resta, división, ecuación", o: ["Ecuación", "Suma", "Resta", "División"], e: "Los demás son operaciones." },
  { q: "Término excluido: generoso, altruista, dadivoso, egoísta", o: ["Egoísta", "Generoso", "Altruista", "Dadivoso"] },
  { q: "Término excluido: Bolívar, Sucre, Cervantes, San Martín", o: ["Cervantes", "Bolívar", "Sucre", "San Martín"], e: "Cervantes fue escritor; los demás, libertadores." },
  { q: "Término excluido: trucha, tilapia, sardina, rana", o: ["Rana", "Trucha", "Tilapia", "Sardina"], e: "La rana es anfibio." },
]);

bank("vb.complete", [
  { q: "Completa: A pesar de su ______, logró terminar la maratón.", o: ["cansancio", "alegría", "rapidez", "victoria"] },
  { q: "Completa: El científico presentó una hipótesis ______ que fue confirmada por los datos.", o: ["audaz", "inútil", "falsa", "olvidada"] },
  { q: "Completa: La ______ del río obligó a evacuar a los vecinos.", o: ["crecida", "sequía", "calma", "belleza"] },
  { q: "Completa: Su discurso fue tan ______ que nadie pudo entender la idea principal.", o: ["confuso", "claro", "breve", "preciso"] },
  { q: "Completa: Para ______ el examen, estudió todas las tardes durante un mes.", o: ["aprobar", "olvidar", "evitar", "perder"] },
  { q: "Completa: La empresa tuvo que ______ gastos porque sus ventas bajaron.", o: ["reducir", "duplicar", "celebrar", "ignorar"] },
  { q: "Completa: Aunque era ______, aceptó hablar frente a todo el auditorio.", o: ["tímido", "extrovertido", "famoso", "elocuente"] },
  { q: "Completa: El testigo dio una versión ______ de los hechos: no omitió ningún detalle.", o: ["minuciosa", "vaga", "breve", "falsa"] },
  { q: "Completa: Las medidas ______ ayudaron a prevenir la enfermedad.", o: ["preventivas", "tardías", "inútiles", "curativas"] },
  { q: "Completa: Con ______ y paciencia, el equipo resolvió el problema.", o: ["perseverancia", "pereza", "prisa", "descuido"] },
  { q: "Completa: El volcán permanece ______, pero los científicos lo vigilan.", o: ["inactivo", "en erupción", "destruido", "lejano"] },
  { q: "Completa: No es ______ usar el celular mientras se conduce.", o: ["prudente", "obligatorio", "necesario", "divertido"] },
  { q: "Completa: La biblioteca ______ miles de libros antiguos.", o: ["alberga", "destruye", "vende", "olvida"] },
  { q: "Completa: Su respuesta fue ______: dijo solo «sí».", o: ["lacónica", "extensa", "ambigua", "elocuente"] },
  { q: "Completa: Los resultados fueron ______ con lo que esperábamos: coincidieron totalmente.", o: ["coherentes", "contradictorios", "ajenos", "opuestos"] },
]);

passages("vb.read", [
  { title: "El páramo", text: "Los páramos andinos funcionan como enormes esponjas: su suelo, rico en materia orgánica, retiene el agua de la lluvia y la neblina y la libera lentamente hacia ríos y quebradas. Gran parte del agua que consumen ciudades como Quito proviene de estos ecosistemas. Sin embargo, la quema de pajonales, el avance de la frontera agrícola y el pastoreo excesivo compactan el suelo y reducen su capacidad de almacenamiento.",
    qs: [
      { q: "¿Cuál es la idea principal del texto?", o: ["Los páramos regulan el agua y están amenazados por actividades humanas", "Quito tiene problemas de abastecimiento de agua", "La agricultura es la principal actividad de los Andes", "La neblina es más importante que la lluvia"] },
      { q: "En el texto, la palabra «esponjas» se usa para expresar que los páramos:", o: ["Absorben y liberan agua poco a poco", "Son blandos al caminar", "Están llenos de agujeros", "Limpian el aire"] },
      { q: "Según el texto, el pastoreo excesivo:", o: ["Compacta el suelo", "Aumenta la materia orgánica", "Produce más neblina", "No afecta al páramo"] },
    ] },
  { title: "La lectura en pantalla", text: "Diversos estudios sugieren que, al leer textos largos en pantallas, las personas tienden a escanear la información y a recordar menos detalles que cuando leen en papel. No obstante, los investigadores aclaran que la diferencia se reduce cuando el lector se fija metas claras, toma notas y evita las distracciones de notificaciones. El problema, concluyen, no es tanto el soporte como el hábito de lectura que este favorece.",
    qs: [
      { q: "¿Qué conclusión plantean los investigadores?", o: ["El hábito de lectura influye más que el soporte", "El papel siempre es mejor que la pantalla", "Las pantallas impiden aprender", "Tomar notas es inútil"] },
      { q: "La expresión «no obstante» introduce una idea que:", o: ["Matiza lo dicho antes", "Repite lo anterior", "Da un ejemplo", "Cierra el texto"] },
      { q: "Según el texto, una estrategia para leer mejor en pantalla es:", o: ["Evitar las notificaciones", "Leer más rápido", "Usar letra pequeña", "Leer solo textos cortos"] },
    ] },
  { title: "Eugenio Espejo", text: "Eugenio Espejo, nacido en Quito en 1747, fue médico, periodista y pensador. Publicó «Primicias de la Cultura de Quito», uno de los primeros periódicos de la Real Audiencia, y escribió sobre higiene pública en una época en que las epidemias eran frecuentes. Sus ideas críticas sobre la educación y la administración colonial le valieron persecuciones, pero también lo convirtieron en un precursor del pensamiento independentista.",
    qs: [
      { q: "Según el texto, Espejo es considerado precursor de la independencia porque:", o: ["Difundió ideas críticas sobre el orden colonial", "Dirigió batallas contra los españoles", "Fue presidente de la Real Audiencia", "Curó una epidemia en Quito"] },
      { q: "¿Qué actividad NO se atribuye a Espejo en el texto?", o: ["Militar", "Médico", "Periodista", "Pensador"] },
    ] },
  { title: "El sueño y la memoria", text: "Durante el sueño profundo, el cerebro reorganiza la información adquirida durante el día y fortalece las conexiones relacionadas con lo aprendido. Por eso, quienes estudian toda la noche antes de un examen suelen rendir peor que quienes distribuyen el estudio en varios días y duermen lo suficiente. Dormir no es tiempo perdido: es parte del proceso de aprender.",
    qs: [
      { q: "El propósito del texto es:", o: ["Explicar la relación entre el sueño y el aprendizaje", "Recomendar estudiar de noche", "Describir las fases del sueño", "Criticar los exámenes"] },
      { q: "Del texto se infiere que estudiar la noche anterior al examen:", o: ["No es la estrategia más eficaz", "Garantiza mejores notas", "Fortalece la memoria", "Es lo que recomiendan los expertos"] },
    ] },
]);
