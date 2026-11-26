// Materias nuevas del diagnóstico (currículo del Ministerio de Educación del Ecuador, 2016 y ajustes posteriores):
// Historia, Filosofía, Estudios Sociales, Biología (genética, ecología, evolución), más Química,
// Contabilidad y Matemática financiera (primeros semestres), y Lengua (acentuación).
// Los generadores (gen) también alimentan la práctica gratuita por tema (src/practice.js).
import { bank, dict, gen } from "../lib/sources.js";
import { options, fmt } from "../lib/rand.js";

const money = n => "$" + (Math.round(n * 100) / 100).toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ================= HISTORIA (BGU) =================
bank("hi.bank", [
  { q: "El Primer Grito de Independencia de Quito ocurrió el:", o: ["10 de agosto de 1809", "24 de mayo de 1822", "9 de octubre de 1820", "13 de mayo de 1830"] },
  { q: "La Batalla de Pichincha (24 de mayo de 1822) fue dirigida por:", o: ["Antonio José de Sucre", "Simón Bolívar", "Juan José Flores", "Eloy Alfaro"] },
  { q: "Ecuador se separó de la Gran Colombia y se constituyó como Estado en:", o: ["1830", "1809", "1822", "1895"] },
  { q: "El primer presidente del Ecuador fue:", o: ["Juan José Flores", "Vicente Rocafuerte", "Gabriel García Moreno", "Eloy Alfaro"] },
  { q: "La Revolución Liberal de 1895 fue liderada por:", o: ["Eloy Alfaro", "Gabriel García Moreno", "José María Velasco Ibarra", "Juan José Flores"] },
  { q: "Una obra emblemática del gobierno de Eloy Alfaro fue:", o: ["El ferrocarril Guayaquil–Quito", "La Panamericana", "El oleoducto transecuatoriano", "La dolarización"] },
  { q: "El Protocolo de Río de Janeiro, que redujo el territorio ecuatoriano, se firmó en:", o: ["1942", "1830", "1998", "1960"] },
  { q: "La paz definitiva con el Perú se firmó en Brasilia en:", o: ["1998", "1942", "1981", "1995"] },
  { q: "Ecuador adoptó el dólar como moneda oficial en:", o: ["2000", "1995", "2008", "1992"] },
  { q: "La Constitución vigente del Ecuador fue aprobada en:", o: ["2008", "1998", "1979", "2000"] },
  { q: "El auge cacaotero (la «pepa de oro») ocurrió principalmente entre:", o: ["Finales del siglo XIX e inicios del XX", "La época colonial temprana", "Los años 70 del siglo XX", "El siglo XXI"] },
  { q: "El boom petrolero ecuatoriano empezó en la década de:", o: ["1970", "1920", "1950", "1990"] },
  { q: "La Real Audiencia de Quito fue creada en:", o: ["1563", "1534", "1809", "1700"] },
  { q: "La cultura precolombina conocida como la más antigua de cerámica en América es:", o: ["Valdivia", "Inca", "Cañari", "Caranqui"] },
  { q: "El último gobernante inca antes de la conquista española fue:", o: ["Atahualpa", "Huayna Cápac", "Rumiñahui", "Pachacútec"] },
  { q: "Eugenio Espejo fue un precursor de la independencia y además:", o: ["Médico, periodista y escritor", "General del ejército realista", "Primer presidente del Ecuador", "Conquistador español"] },
  { q: "La Revolución Francesa comenzó en:", o: ["1789", "1776", "1810", "1848"] },
  { q: "La Revolución Industrial se inició en:", o: ["Inglaterra, siglo XVIII", "Francia, siglo XVII", "Estados Unidos, siglo XX", "Alemania, siglo XVI"] },
  { q: "La Primera Guerra Mundial ocurrió entre:", o: ["1914 y 1918", "1939 y 1945", "1904 y 1910", "1918 y 1925"] },
  { q: "La Segunda Guerra Mundial terminó en:", o: ["1945", "1918", "1939", "1950"] },
  { q: "La Guerra Fría enfrentó principalmente a:", o: ["Estados Unidos y la Unión Soviética", "Alemania y Francia", "China y Japón", "Inglaterra y España"] },
  { q: "El Muro de Berlín cayó en:", o: ["1989", "1961", "1991", "1945"] },
  { q: "Cristóbal Colón llegó a América en:", o: ["1492", "1534", "1500", "1453"] },
  { q: "El Renacimiento fue un movimiento cultural que:", o: ["Recuperó los valores de la Antigüedad clásica", "Rechazó el arte y la ciencia", "Comenzó en el siglo XX", "Nació en América"] },
  { q: "La Reforma protestante fue iniciada por:", o: ["Martín Lutero", "Juan Calvino en América", "Carlos V", "Galileo Galilei"] },
  { q: "La Declaración de Independencia de Estados Unidos se firmó en:", o: ["1776", "1789", "1810", "1492"] },
  { q: "La caída de Constantinopla (1453) marca tradicionalmente el fin de la:", o: ["Edad Media", "Edad Antigua", "Edad Moderna", "Prehistoria"] },
  { q: "El sistema económico basado en la propiedad privada y el libre mercado es el:", o: ["Capitalismo", "Feudalismo", "Socialismo", "Mercantilismo colonial"] },
  { q: "La encomienda colonial consistía en:", o: ["Entregar indígenas a un español para que trabajaran y pagaran tributo", "Un impuesto al comercio con Europa", "Un tipo de escuela religiosa", "Repartir tierras entre los indígenas"] },
  { q: "La Independencia de Guayaquil se proclamó el:", o: ["9 de octubre de 1820", "10 de agosto de 1809", "3 de noviembre de 1820", "24 de mayo de 1822"] },
  { q: "La Independencia de Cuenca se proclamó el:", o: ["3 de noviembre de 1820", "9 de octubre de 1820", "10 de agosto de 1809", "6 de marzo de 1845"] },
  { q: "La Revolución Marcista de 1845 terminó con el gobierno de:", o: ["Juan José Flores", "Vicente Rocafuerte", "Eloy Alfaro", "García Moreno"] },
]);

// Cronología: ¿qué ocurrió primero?
const EVENTS = [
  ["Llegada de Colón a América", 1492], ["Fundación española de Quito", 1534], ["Creación de la Real Audiencia de Quito", 1563],
  ["Revolución Francesa", 1789], ["Primer Grito de Independencia", 1809], ["Independencia de Guayaquil", 1820],
  ["Batalla de Pichincha", 1822], ["Nacimiento de la República del Ecuador", 1830], ["Revolución Liberal de Alfaro", 1895],
  ["Inauguración del ferrocarril a Quito", 1908], ["Primera Guerra Mundial", 1914], ["Protocolo de Río de Janeiro", 1942],
  ["Fin de la Segunda Guerra Mundial", 1945], ["Inicio del boom petrolero ecuatoriano", 1972], ["Retorno a la democracia en Ecuador", 1979],
  ["Caída del Muro de Berlín", 1989], ["Paz con el Perú (Brasilia)", 1998], ["Dolarización", 2000], ["Constitución de Montecristi", 2008],
  ["Revolución Industrial en Inglaterra", 1760], ["Independencia de Estados Unidos", 1776], ["Caída de Constantinopla", 1453],
];
gen("hi.order", r => {
  const [a, b, c, d] = r.sample(EVENTS, 4);
  const first = [a, b, c, d].reduce((m, e) => (e[1] < m[1] ? e : m));
  const ask = r.chance(0.5);
  if (ask) {
    return { prompt: "¿Cuál de estos hechos ocurrió PRIMERO?", options: options(first[0], [a, b, c, d].filter(e => e !== first).map(e => e[0])),
      explain: [a, b, c, d].sort((x, y) => x[1] - y[1]).map(e => `${e[0]} (${e[1]})`).join(" → ") };
  }
  const last = [a, b, c, d].reduce((m, e) => (e[1] > m[1] ? e : m));
  return { prompt: "¿Cuál de estos hechos ocurrió MÁS RECIENTEMENTE?", options: options(last[0], [a, b, c, d].filter(e => e !== last).map(e => e[0])),
    explain: [a, b, c, d].sort((x, y) => x[1] - y[1]).map(e => `${e[0]} (${e[1]})`).join(" → ") };
});
gen("hi.century", r => {
  const [ev, y] = r.pick(EVENTS);
  const c = Math.floor((y - 1) / 100) + 1;
  const rom = n => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"][n];
  return { prompt: `«${ev}» ocurrió en ${y}. ¿A qué siglo corresponde?`, options: options(`Siglo ${rom(c)}`, [`Siglo ${rom(c - 1)}`, `Siglo ${rom(c + 1 > 21 ? c - 2 : c + 1)}`, `Siglo ${rom(c - 2 > 0 ? c - 2 : c + 1)}`]),
    explain: `El siglo es el número de centenas + 1 (salvo los años terminados en 00): ${y} → siglo ${rom(c)}.` };
});

// ================= FILOSOFÍA (BGU) =================
bank("fi.bank", [
  { q: "La filosofía nace en la antigua Grecia como el paso del:", o: ["Mito al logos (la razón)", "Logos al mito", "Arte a la religión", "Comercio a la política"] },
  { q: "Para Tales de Mileto, el principio (arché) de todas las cosas era:", o: ["El agua", "El fuego", "El aire", "Los números"] },
  { q: "«Solo sé que no sé nada» se atribuye a:", o: ["Sócrates", "Platón", "Aristóteles", "Descartes"] },
  { q: "El método de Sócrates basado en preguntas para llegar a la verdad se llama:", o: ["Mayéutica", "Dialéctica hegeliana", "Empirismo", "Duda metódica"] },
  { q: "El mito de la caverna pertenece a:", o: ["Platón", "Aristóteles", "Sócrates", "Heráclito"] },
  { q: "Para Platón, el mundo verdadero y perfecto es el mundo de:", o: ["Las ideas", "Los sentidos", "Los átomos", "La materia"] },
  { q: "«Todo fluye, nada permanece» resume el pensamiento de:", o: ["Heráclito", "Parménides", "Pitágoras", "Demócrito"] },
  { q: "El filósofo que fue maestro de Alejandro Magno y escribió sobre lógica y ética fue:", o: ["Aristóteles", "Platón", "Epicuro", "Sócrates"] },
  { q: "«Pienso, luego existo» es de:", o: ["René Descartes", "Immanuel Kant", "John Locke", "David Hume"] },
  { q: "El racionalismo sostiene que el conocimiento proviene principalmente de:", o: ["La razón", "La experiencia sensible", "La fe", "La tradición"] },
  { q: "El empirismo sostiene que el conocimiento proviene de:", o: ["La experiencia", "Las ideas innatas", "La revelación", "La intuición mística"] },
  { q: "Un representante del empirismo inglés es:", o: ["John Locke", "René Descartes", "Platón", "Hegel"] },
  { q: "El imperativo categórico («obra solo según aquella máxima que puedas querer que se convierta en ley universal») es de:", o: ["Immanuel Kant", "Friedrich Nietzsche", "Karl Marx", "Aristóteles"] },
  { q: "La rama de la filosofía que estudia el conocimiento es la:", o: ["Epistemología (gnoseología)", "Ética", "Estética", "Metafísica"] },
  { q: "La rama de la filosofía que estudia la moral y el buen actuar es la:", o: ["Ética", "Lógica", "Estética", "Ontología"] },
  { q: "La rama de la filosofía que estudia la belleza y el arte es la:", o: ["Estética", "Ética", "Lógica", "Epistemología"] },
  { q: "La ontología estudia:", o: ["El ser en cuanto ser", "El razonamiento válido", "El lenguaje", "La política"] },
  { q: "El utilitarismo (Bentham, Mill) juzga una acción como buena si:", o: ["Produce la mayor felicidad para el mayor número", "Cumple el deber sin importar las consecuencias", "Agrada a Dios", "La decide la mayoría por votación"] },
  { q: "«Dios ha muerto» es una frase de:", o: ["Friedrich Nietzsche", "Jean-Paul Sartre", "Karl Marx", "Kant"] },
  { q: "El existencialismo afirma que «la existencia precede a la esencia». Su principal exponente es:", o: ["Jean-Paul Sartre", "Aristóteles", "Tomás de Aquino", "Descartes"] },
  { q: "Para Marx, el motor de la historia es:", o: ["La lucha de clases", "La voluntad de poder", "El espíritu absoluto", "La providencia divina"] },
  { q: "Una falacia es:", o: ["Un razonamiento que parece válido pero no lo es", "Una verdad demostrada", "Un tipo de silogismo válido", "Una definición científica"] },
  { q: "Atacar a la persona en lugar de a su argumento es la falacia:", o: ["Ad hominem", "Ad populum", "Petición de principio", "Falsa causa"] },
  { q: "«Todos lo hacen, así que debe estar bien» es la falacia:", o: ["Ad populum", "Ad hominem", "Ad verecundiam", "Hombre de paja"] },
  { q: "El razonamiento que va de casos particulares a una conclusión general es:", o: ["Inductivo", "Deductivo", "Analógico", "Abductivo"] },
  { q: "El razonamiento que va de lo general a lo particular y, si las premisas son verdaderas, garantiza la conclusión es:", o: ["Deductivo", "Inductivo", "Analógico", "Estadístico"] },
  { q: "Santo Tomás de Aquino es representante de la filosofía:", o: ["Escolástica medieval", "Moderna", "Contemporánea", "Presocrática"] },
  { q: "El «contrato social» como origen del Estado fue planteado por:", o: ["Rousseau, Hobbes y Locke", "Platón y Aristóteles", "Nietzsche y Sartre", "Tales y Anaxímenes"] },
  { q: "Para Aristóteles, el ser humano es por naturaleza un:", o: ["Animal político (social)", "Ser solitario", "Espíritu puro", "Lobo para el hombre"] },
  { q: "El «buen vivir» (sumak kawsay), recogido en la Constitución del Ecuador, propone:", o: ["Vivir en armonía con la comunidad y la naturaleza", "Acumular riqueza individual", "Rechazar toda tecnología", "Vivir solo para el trabajo"] },
]);

// Lógica proposicional: valor de verdad de una proposición compuesta.
gen("fi.logic", r => {
  const p = r.chance(0.5), q = r.chance(0.5);
  const V = b => (b ? "V" : "F");
  const ops = [
    ["p ∧ q", p && q, "La conjunción (∧) solo es verdadera si ambas son verdaderas."],
    ["p ∨ q", p || q, "La disyunción (∨) es falsa solo si ambas son falsas."],
    ["p → q", !p || q, "El condicional (→) es falso solo cuando p es V y q es F."],
    ["p ↔ q", p === q, "El bicondicional (↔) es verdadero si ambas tienen el mismo valor."],
    ["¬p ∧ q", !p && q, "Primero niega p (¬) y luego aplica la conjunción."],
    ["¬(p ∨ q)", !(p || q), "Resuelve el paréntesis y luego niega."],
    ["p → ¬q", !p || !q, "Niega q y luego aplica el condicional."],
  ];
  const [expr, val, why] = r.pick(ops);
  return { prompt: `Si p es ${V(p)} y q es ${V(q)}, ¿cuál es el valor de verdad de ${expr}?`, options: [V(val), V(!val)], keepOrder: false, explain: why };
});

// ================= ESTUDIOS SOCIALES (EGB) =================
bank("es.bank", [
  { q: "Las cuatro regiones naturales del Ecuador son:", o: ["Costa, Sierra, Amazonía y Galápagos", "Norte, Sur, Este y Oeste", "Costa, Andes, Selva y Desierto", "Pichincha, Guayas, Azuay y Manabí"] },
  { q: "¿Cuántas provincias tiene el Ecuador?", o: ["24", "22", "20", "26"] },
  { q: "El volcán más alto del Ecuador es el:", o: ["Chimborazo", "Cotopaxi", "Imbabura", "Tungurahua"] },
  { q: "La línea imaginaria que da nombre al Ecuador divide la Tierra en:", o: ["Hemisferio norte y hemisferio sur", "Hemisferio oriental y occidental", "Zonas frías y cálidas", "Continentes"] },
  { q: "Los símbolos patrios del Ecuador son:", o: ["La bandera, el escudo y el himno", "El cóndor, la bandera y el volcán", "El escudo, la moneda y la bandera", "El himno, la Constitución y el escudo"] },
  { q: "El autor de la letra del Himno Nacional del Ecuador es:", o: ["Juan León Mera", "Antonio Neumane", "Juan Montalvo", "José Joaquín de Olmedo"] },
  { q: "El río más largo que recorre la Amazonía ecuatoriana y desemboca en el Amazonas es el:", o: ["Napo", "Guayas", "Mira", "Esmeraldas"] },
  { q: "El río más importante de la Costa ecuatoriana, que pasa por Guayaquil, es el:", o: ["Guayas", "Napo", "Pastaza", "Chota"] },
  { q: "Las Islas Galápagos se encuentran en el océano:", o: ["Pacífico", "Atlántico", "Índico", "Ártico"] },
  { q: "La capital del Ecuador es:", o: ["Quito", "Guayaquil", "Cuenca", "Ibarra"] },
  { q: "Imbabura es conocida como la provincia de los:", o: ["Lagos", "Volcanes nevados", "Manglares", "Ríos amazónicos"] },
  { q: "El lago o laguna más conocida de Imbabura, cerca de Otavalo, es:", o: ["San Pablo", "Quilotoa", "Cuicocha en Galápagos", "Limoncocha"] },
  { q: "Los tres poderes clásicos del Estado son:", o: ["Ejecutivo, Legislativo y Judicial", "Militar, Policial y Civil", "Electoral, Social y Económico", "Presidencial, Municipal y Provincial"] },
  { q: "En el Ecuador, las leyes las aprueba la:", o: ["Asamblea Nacional", "Corte Constitucional", "Presidencia", "Contraloría"] },
  { q: "El continente donde está el Ecuador es:", o: ["América del Sur", "América Central", "América del Norte", "Oceanía"] },
  { q: "Los países que limitan con el Ecuador son:", o: ["Colombia y Perú", "Colombia y Venezuela", "Perú y Bolivia", "Brasil y Perú"] },
  { q: "Las líneas imaginarias que van de polo a polo se llaman:", o: ["Meridianos", "Paralelos", "Trópicos", "Círculos polares"] },
  { q: "El océano más grande del planeta es el:", o: ["Pacífico", "Atlántico", "Índico", "Ártico"] },
  { q: "Un mapa que muestra montañas, valles y llanuras es un mapa:", o: ["Físico (de relieve)", "Político", "Económico", "Demográfico"] },
  { q: "Las personas que habitan un territorio y sus características forman su:", o: ["Población", "Relieve", "Clima", "Hidrografía"] },
  { q: "El pueblo indígena conocido por su comercio de tejidos en la provincia de Imbabura es el:", o: ["Otavalo (kichwa)", "Shuar", "Tsáchila", "Awá"] },
  { q: "El idioma ancestral más hablado en la Sierra ecuatoriana es el:", o: ["Kichwa", "Shuar chicham", "Cha'palaa", "Tsafiki"] },
  { q: "Un derecho de todos los niños según la Constitución es:", o: ["La educación", "Trabajar desde los 8 años", "Votar", "Conducir"] },
  { q: "La actividad económica que extrae recursos de la naturaleza (agricultura, pesca, minería) es del sector:", o: ["Primario", "Secundario", "Terciario", "Cuaternario"] },
  { q: "Ecuador es uno de los mayores exportadores del mundo de:", o: ["Banano", "Trigo", "Café de Colombia", "Petróleo de Arabia"] },
]);

// ================= BIOLOGÍA: genética, ecología y evolución =================
gen("b.genetics", r => {
  const traits = [["semilla amarilla", "semilla verde", "A"], ["flor morada", "flor blanca", "P"], ["tallo alto", "tallo enano", "T"], ["pelo negro", "pelo blanco", "N"]];
  const [dom, rec, L] = r.pick(traits);
  const l = L.toLowerCase();
  const kind = r.int(0, 3);
  if (kind === 0) return { prompt: `Se cruzan dos heterocigotos ${L}${l} × ${L}${l}. ¿Qué proporción de la descendencia tendrá ${rec} (${rec.split(" ")[0]} recesivo)?`, options: options("1/4 (25 %)", ["3/4 (75 %)", "1/2 (50 %)", "0 %"]), explain: `Cuadro de Punnett: ${L}${L}, ${L}${l}, ${L}${l}, ${l}${l}. Solo ${l}${l} (1 de 4) muestra el rasgo recesivo.` };
  if (kind === 1) return { prompt: `Se cruzan dos heterocigotos ${L}${l} × ${L}${l}. ¿Cuál es la proporción fenotípica (${dom} : ${rec})?`, options: options("3 : 1", ["1 : 2 : 1", "1 : 1", "9 : 3 : 3 : 1"]), explain: `3 de cada 4 tienen al menos un ${L} (dominante): 3 : 1. La proporción genotípica es 1 : 2 : 1.` };
  if (kind === 2) return { prompt: `Se cruza un ${L}${l} con un ${l}${l}. ¿Qué porcentaje de la descendencia será ${l}${l}?`, options: options("50 %", ["25 %", "75 %", "100 %"]), explain: `${L}${l} × ${l}${l} da ${L}${l}, ${L}${l}, ${l}${l}, ${l}${l}: la mitad.` };
  return { prompt: `Se cruza un homocigoto dominante ${L}${L} con un homocigoto recesivo ${l}${l}. ¿Cómo será la primera generación (F1)?`, options: options(`100 % ${L}${l}, con ${dom}`, [`100 % ${l}${l}, con ${rec}`, `50 % ${L}${L} y 50 % ${l}${l}`, `75 % ${dom} y 25 % ${rec}`]), explain: "Primera ley de Mendel (uniformidad): todos heredan un alelo de cada padre y son heterocigotos." };
});
gen("b.dna", r => {
  const comp = { A: "T", T: "A", C: "G", G: "C" }, rna = { A: "U", T: "A", C: "G", G: "C" };
  const seq = Array.from({ length: 6 }, () => r.pick(["A", "T", "C", "G"])).join("");
  const toRna = r.chance(0.5);
  const ans = [...seq].map(b => (toRna ? rna : comp)[b]).join("");
  const wrong1 = [...seq].map(b => (toRna ? comp : rna)[b]).join("");
  const wrong2 = [...ans].reverse().join("");
  const wrong3 = seq;
  const split3 = s => s.slice(0, 3) + "-" + s.slice(3);
  return { prompt: toRna ? `¿Qué ARN mensajero se transcribe a partir de la hebra de ADN ${split3(seq)}?` : `¿Cuál es la hebra complementaria de ADN para ${split3(seq)}?`,
    options: options(split3(ans), [split3(wrong1), split3(wrong2), split3(wrong3)]),
    explain: toRna ? "En el ARN la timina se reemplaza por uracilo: A→U, T→A, C→G, G→C." : "En el ADN: A con T y C con G." };
});
bank("b.bank4", [
  { q: "En la evolución, la selección natural fue propuesta por:", o: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Jean-Baptiste Lamarck"] },
  { q: "Las leyes de la herencia fueron descubiertas por:", o: ["Gregor Mendel", "Charles Darwin", "Robert Hooke", "Watson y Crick"] },
  { q: "La estructura de doble hélice del ADN fue descrita en 1953 por:", o: ["Watson y Crick", "Mendel y Darwin", "Pasteur y Koch", "Schleiden y Schwann"] },
  { q: "Un gen es:", o: ["Un segmento de ADN que codifica una característica o proteína", "Una célula sexual", "Un tipo de proteína", "Un cromosoma completo"] },
  { q: "Un individuo con dos alelos iguales para un gen (AA o aa) es:", o: ["Homocigoto", "Heterocigoto", "Haploide", "Mutante"] },
  { q: "El fenotipo es:", o: ["La característica observable", "La combinación de alelos", "Un tipo de célula", "La secuencia del ADN"] },
  { q: "Las células somáticas humanas tienen:", o: ["46 cromosomas (23 pares)", "23 cromosomas", "92 cromosomas", "44 cromosomas"] },
  { q: "La síntesis de proteínas ocurre en los:", o: ["Ribosomas", "Lisosomas", "Centríolos", "Vacuolas"] },
  { q: "La respiración celular aerobia ocurre principalmente en:", o: ["Las mitocondrias", "Los cloroplastos", "El aparato de Golgi", "La membrana nuclear"] },
  { q: "La molécula que almacena la energía que usa la célula es el:", o: ["ATP", "ADN", "ARN", "Colesterol"] },
  { q: "Las relaciones en las que ambas especies se benefician se llaman:", o: ["Mutualismo", "Parasitismo", "Depredación", "Competencia"] },
  { q: "En un ecosistema, el nivel trófico de las plantas es el de:", o: ["Productores", "Consumidores primarios", "Consumidores secundarios", "Descomponedores"] },
  { q: "La energía que pasa de un nivel trófico al siguiente es aproximadamente el:", o: ["10 %", "50 %", "90 %", "100 %"] },
  { q: "El efecto invernadero se intensifica principalmente por el aumento de:", o: ["Dióxido de carbono en la atmósfera", "Oxígeno en el agua", "Nitrógeno en el suelo", "Ozono en la estratósfera"] },
  { q: "Los órganos homólogos (como el brazo humano y el ala del murciélago) son evidencia de:", o: ["Un ancestro común", "Que ambos vuelan", "Generación espontánea", "Evolución convergente siempre"] },
  { q: "El transporte de sustancias a través de la membrana sin gasto de energía, a favor del gradiente, es:", o: ["Transporte pasivo (difusión)", "Transporte activo", "Endocitosis", "Bomba de sodio-potasio"] },
  { q: "La ósmosis es el paso de:", o: ["Agua a través de una membrana semipermeable", "Proteínas por los poros nucleares", "Glucosa con gasto de ATP", "Iones por bombas"] },
  { q: "Un virus se diferencia de una bacteria porque:", o: ["No tiene estructura celular y necesita una célula para reproducirse", "Es más grande", "Tiene núcleo", "Hace fotosíntesis"] },
  { q: "Los antibióticos sirven para combatir:", o: ["Bacterias", "Virus", "Alergias", "Todas las enfermedades"] },
  { q: "La fase de la mitosis en la que los cromosomas se alinean en el centro de la célula es la:", o: ["Metafase", "Profase", "Anafase", "Telofase"] },
  { q: "El ciclo del carbono incluye la fotosíntesis, que:", o: ["Toma CO₂ y libera O₂", "Libera CO₂ y toma O₂", "Fija nitrógeno", "Evapora agua"] },
  { q: "Un ejemplo de especie endémica de Galápagos es:", o: ["La iguana marina", "El cóndor andino", "El oso de anteojos", "La llama"] },
]);

// ================= QUÍMICA: soluciones, pH, gases y nomenclatura =================
gen("q.molarity", r => {
  const [f, M] = r.pick([["NaCl", 58.5], ["NaOH", 40], ["KCl", 74.5], ["HCl", 36.5], ["C₆H₁₂O₆", 180]]);
  const mol = r.pick([0.25, 0.5, 1, 1.5, 2]), V = r.pick([0.25, 0.5, 1, 2]);
  const Mo = mol / V, g = mol * M;
  return { prompt: `Se disuelven ${fmt(g)} g de ${f} (masa molar ${fmt(M)} g/mol) en agua hasta completar ${fmt(V * 1000)} mL de solución. ¿Cuál es la molaridad?`,
    options: options(`${fmt(Mo)} M`, [`${fmt(mol)} M`, `${fmt(g / V)} M`, `${fmt(Mo * 2)} M`, `${fmt(Mo / 2)} M`]),
    explain: `n = ${fmt(g)} / ${fmt(M)} = ${fmt(mol)} mol; M = n / V(L) = ${fmt(mol)} / ${fmt(V)} = ${fmt(Mo)} mol/L.` };
});
gen("q.ph", r => {
  const n = r.int(1, 13), base = r.chance(0.4);
  if (base) {
    const poh = 14 - n;
    return { prompt: `Una solución tiene [OH⁻] = 1 × 10⁻${sup(poh)} M. ¿Cuál es su pH?`, options: options(String(n), [String(poh), String(14 + poh), String(Math.abs(n - 7))]),
      explain: `pOH = ${poh}; pH = 14 − pOH = ${n}. ${n > 7 ? "Es básica." : n < 7 ? "Es ácida." : "Es neutra."}` };
  }
  const kind = n < 7 ? "ácida" : n > 7 ? "básica" : "neutra";
  return { prompt: `Una solución tiene [H⁺] = 1 × 10⁻${sup(n)} M. ¿Cuál es su pH y cómo es?`, options: options(`pH ${n}, ${kind}`, [`pH ${14 - n}, ${n < 7 ? "básica" : "ácida"}`, `pH ${n}, ${n < 7 ? "básica" : "ácida"}`, `pH ${-n}, ${kind}`]),
    explain: `pH = −log[H⁺] = ${n}. Menor que 7 es ácida, 7 neutra y mayor que 7 básica.` };
});
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
function sup(n) { return String(n).split("").map(d => SUP[d]).join(""); }
gen("q.gas", r => {
  const kind = r.int(0, 2);
  if (kind === 0) {
    const P1 = r.pick([1, 2, 3, 4]), V1 = r.pick([2, 4, 6, 8, 12]), k = r.pick([2, 4]);
    const P2 = P1 * k, V2 = (P1 * V1) / P2;
    return { prompt: `Un gas ocupa ${V1} L a ${P1} atm. Si a temperatura constante la presión sube a ${P2} atm, ¿qué volumen ocupará? (ley de Boyle)`, options: options(`${fmt(V2)} L`, [`${fmt(V1 * k)} L`, `${fmt(V1 + k)} L`, `${fmt(V2 * 2)} L`]), explain: `P₁·V₁ = P₂·V₂ → V₂ = ${P1}·${V1} / ${P2} = ${fmt(V2)} L.` };
  }
  if (kind === 1) {
    const T1 = r.pick([200, 250, 300, 400]), V1 = r.pick([2, 3, 4, 5]), k = r.pick([1.5, 2]);
    const T2 = T1 * k, V2 = V1 * k;
    return { prompt: `Un gas ocupa ${V1} L a ${T1} K. Si a presión constante se calienta hasta ${T2} K, ¿qué volumen ocupará? (ley de Charles)`, options: options(`${fmt(V2)} L`, [`${fmt(V1 / k)} L`, `${fmt(V1 + k)} L`, `${fmt(V2 * 2)} L`]), explain: `V₁/T₁ = V₂/T₂ → V₂ = ${V1}·${T2} / ${T1} = ${fmt(V2)} L. Usa siempre kelvin.` };
  }
  const c = r.pick([0, 25, 27, 100, -73]);
  return { prompt: `¿Cuántos kelvin son ${c} °C?`, options: options(`${c + 273} K`, [`${c - 273} K`, `${c + 100} K`, `${c} K`]), explain: "K = °C + 273." };
});
gen("q.percent", r => {
  const solute = r.pick([5, 10, 15, 20, 25, 30]), water = r.pick([45, 70, 85, 95, 120, 170]);
  const total = solute + water, p = (solute / total) * 100;
  return { prompt: `Se disuelven ${solute} g de azúcar en ${water} g de agua. ¿Cuál es el porcentaje en masa (% m/m) de la solución?`,
    options: options(`${fmt(p)} %`, [`${fmt((solute / water) * 100)} %`, `${fmt((water / total) * 100)} %`, `${fmt(p * 2)} %`]),
    explain: `% m/m = masa de soluto / masa de solución × 100 = ${solute} / ${total} × 100 = ${fmt(p)} %.` };
});
// Número de oxidación del elemento central.
dict("q.oxid", [
  ["S en H₂SO₄", "+6"], ["N en HNO₃", "+5"], ["C en CO₂", "+4"], ["Mn en KMnO₄", "+7"], ["Cr en K₂Cr₂O₇", "+6"], ["Cl en HClO", "+1"],
  ["Cl en HClO₄", "+7"], ["P en H₃PO₄", "+5"], ["Fe en Fe₂O₃", "+3"], ["N en NH₃", "−3"], ["S en H₂S", "−2"], ["C en CH₄", "−4"],
], ([what, ok], r) => ({ prompt: `¿Cuál es el número de oxidación de ${what}?`, options: options(ok, r.shuffle(["+1", "+2", "+3", "+4", "+5", "+6", "+7", "−2", "−3", "−4"].filter(x => x !== ok))),
  explain: "Suma de números de oxidación de un compuesto neutro = 0. Toma H = +1 y O = −2 (salvo excepciones) y despeja." }));
dict("q.names", [
  ["NaOH", "Hidróxido de sodio"], ["H₂SO₄", "Ácido sulfúrico"], ["HNO₃", "Ácido nítrico"], ["CaO", "Óxido de calcio"], ["Fe₂O₃", "Óxido de hierro (III)"],
  ["KCl", "Cloruro de potasio"], ["CaCO₃", "Carbonato de calcio"], ["NH₃", "Amoníaco"], ["H₂O₂", "Peróxido de hidrógeno"], ["Mg(OH)₂", "Hidróxido de magnesio"],
  ["NaHCO₃", "Bicarbonato de sodio (hidrogenocarbonato de sodio)"], ["CO", "Monóxido de carbono"], ["SO₂", "Dióxido de azufre"], ["HCl", "Ácido clorhídrico"],
], ([f, name], r, all, idx) => ({ prompt: `¿Cuál es el nombre de ${f}?`, options: options(name, r.shuffle(all.filter((_, i) => i !== idx).map(x => x[1]))), explain: `${f}: ${name}.` }));
dict("q.balance", [
  ["_ H₂ + _ O₂ → _ H₂O", "2, 1, 2", ["1, 1, 1", "2, 2, 2", "1, 2, 1"]],
  ["_ N₂ + _ H₂ → _ NH₃", "1, 3, 2", ["1, 1, 2", "2, 3, 2", "1, 3, 3"]],
  ["_ CH₄ + _ O₂ → _ CO₂ + _ H₂O", "1, 2, 1, 2", ["1, 1, 1, 1", "2, 2, 1, 2", "1, 3, 1, 2"]],
  ["_ Fe + _ O₂ → _ Fe₂O₃", "4, 3, 2", ["2, 3, 1", "4, 2, 2", "1, 1, 1"]],
  ["_ Na + _ Cl₂ → _ NaCl", "2, 1, 2", ["1, 1, 1", "1, 2, 2", "2, 2, 1"]],
  ["_ C₃H₈ + _ O₂ → _ CO₂ + _ H₂O", "1, 5, 3, 4", ["1, 3, 3, 4", "2, 5, 3, 4", "1, 4, 3, 2"]],
  ["_ Al + _ O₂ → _ Al₂O₃", "4, 3, 2", ["2, 3, 2", "4, 2, 2", "2, 1, 1"]],
  ["_ KClO₃ → _ KCl + _ O₂", "2, 2, 3", ["1, 1, 1", "2, 2, 2", "1, 1, 3"]],
], ([eq, ok, bad]) => ({ prompt: `¿Qué coeficientes balancean la ecuación ${eq}?`, options: options(ok, bad), explain: "Cuenta los átomos de cada elemento a ambos lados: deben ser iguales." }));

// ================= LENGUA: acentuación =================
const WORDS = [
  ["café", "aguda"], ["canción", "aguda"], ["reloj", "aguda"], ["pared", "aguda"], ["sofá", "aguda"], ["jamás", "aguda"], ["ciudad", "aguda"], ["compás", "aguda"],
  ["árbol", "llana"], ["lápiz", "llana"], ["mesa", "llana"], ["examen", "llana"], ["cárcel", "llana"], ["joven", "llana"], ["fácil", "llana"], ["césped", "llana"],
  ["teléfono", "esdrújula"], ["música", "esdrújula"], ["pájaro", "esdrújula"], ["matemáticas", "esdrújula"], ["sílaba", "esdrújula"], ["público", "esdrújula"],
  ["dígaselo", "sobresdrújula"], ["llévatelo", "sobresdrújula"], ["cómpramelo", "sobresdrújula"], ["cuéntaselo", "sobresdrújula"],
];
gen("le.accent", r => {
  const [w, t] = r.pick(WORDS);
  const why = { aguda: "fuerza en la última sílaba (tilde si termina en n, s o vocal)", llana: "fuerza en la penúltima sílaba (tilde si NO termina en n, s o vocal)", esdrújula: "fuerza en la antepenúltima sílaba (siempre lleva tilde)", sobresdrújula: "fuerza antes de la antepenúltima sílaba (siempre lleva tilde)" };
  const LBL = { aguda: "Aguda", llana: "Llana (grave)", esdrújula: "Esdrújula", sobresdrújula: "Sobresdrújula" };
  return { prompt: `Según su acento, la palabra «${w}» es:`, options: options(LBL[t], Object.values(LBL).filter(x => x !== LBL[t])), keepOrder: false, explain: `«${w}» es ${t}: ${why[t]}.` };
});

// ================= CONTABILIDAD Y MATEMÁTICA FINANCIERA (primeros semestres) =================
gen("fn.simple", r => {
  const C = r.pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000]), i = r.pick([4, 5, 6, 8, 10, 12]), t = r.pick([1, 2, 3, 6, 9, 18]);
  const months = r.chance(0.5) && t % 3 === 0 && t < 12;
  const years = months ? t / 12 : t;
  const I = C * (i / 100) * years;
  return { prompt: `¿Cuánto interés simple genera un capital de ${money(C)} al ${i} % anual durante ${months ? `${t} meses` : `${t} año${t > 1 ? "s" : ""}`}?`,
    options: options(money(I), [money(C * (i / 100) * t), money(C + I), money(I * 2), money(C * i)]),
    explain: `I = C · i · t = ${money(C)} · ${i / 100} · ${fmt(years)} = ${money(I)}${months ? " (el tiempo se pasa a años: meses ÷ 12)" : ""}.` };
});
gen("fn.compound", r => {
  const C = r.pick([1000, 2000, 5000]), i = r.pick([5, 10, 20]), n = r.pick([2, 3]);
  const M = C * Math.pow(1 + i / 100, n);
  return { prompt: `Se invierten ${money(C)} al ${i} % anual con interés compuesto. ¿Cuál es el monto al cabo de ${n} años?`,
    options: options(money(M), [money(C * (1 + (i / 100) * n)), money(M - C), money(C * Math.pow(1 + i / 100, n + 1))]),
    explain: `M = C · (1 + i)ⁿ = ${money(C)} · (1 + ${i / 100})${n === 2 ? "²" : "³"} = ${money(M)}. Con interés simple sería ${money(C * (1 + (i / 100) * n))}.` };
});
gen("fn.iva", r => {
  const base = r.pick([20, 40, 80, 100, 120, 200, 350, 500, 1000]);
  const kind = r.int(0, 1);
  if (kind === 0) return { prompt: `Un producto cuesta ${money(base)} sin IVA. Con el IVA del 15 % vigente en Ecuador, ¿cuánto se paga en total?`, options: options(money(base * 1.15), [money(base * 0.15), money(base * 1.12), money(base * 0.85)]), explain: `Total = base × 1,15 = ${money(base * 1.15)}.` };
  const total = base * 1.15;
  return { prompt: `Una factura suma ${money(total)} con IVA del 15 % incluido. ¿Cuál es la base imponible (sin IVA)?`, options: options(money(base), [money(total * 0.85), money(total - 15), money(total / 1.12)]), explain: `Base = total ÷ 1,15 = ${money(base)}. Ojo: restar el 15 % del total da un valor incorrecto.` };
});
gen("fn.depr", r => {
  const cost = r.pick([6000, 10000, 12000, 15000, 24000]), res = r.pick([0, 1000, 2000]), years = r.pick([3, 5, 10]);
  const d = (cost - res) / years;
  return { prompt: `Una empresa compra un equipo en ${money(cost)} con valor residual de ${money(res)} y vida útil de ${years} años. ¿Cuál es la depreciación anual por línea recta?`,
    options: options(money(d), [money(cost / years), money((cost + res) / years), money(d * 2)]), explain: `Depreciación = (costo − valor residual) ÷ vida útil = (${money(cost)} − ${money(res)}) ÷ ${years} = ${money(d)}.` };
});
gen("fn.discount", r => {
  const p = r.pick([40, 60, 80, 120, 150, 200, 250]), d1 = r.pick([10, 20, 25, 30]), d2 = r.pick([10, 20]);
  const twice = r.chance(0.5);
  if (!twice) return { prompt: `Un artículo de ${money(p)} tiene ${d1} % de descuento. ¿Cuál es el precio final?`, options: options(money(p * (1 - d1 / 100)), [money(p * d1 / 100), money(p - d1), money(p * (1 + d1 / 100))]), explain: `Precio final = ${money(p)} × ${fmt(1 - d1 / 100)} = ${money(p * (1 - d1 / 100))}.` };
  const fin = p * (1 - d1 / 100) * (1 - d2 / 100);
  return { prompt: `A un artículo de ${money(p)} se le aplica un ${d1} % de descuento y luego otro ${d2} % sobre el nuevo precio. ¿Cuál es el precio final?`, options: options(money(fin), [money(p * (1 - (d1 + d2) / 100)), money(p * (1 - d1 / 100)), money(p - d1 - d2)]), explain: `Los descuentos sucesivos se multiplican: ${money(p)} × ${fmt(1 - d1 / 100)} × ${fmt(1 - d2 / 100)} = ${money(fin)}. No es lo mismo que un ${d1 + d2} %.` };
});
gen("fn.equation", r => {
  const A = r.pick([5000, 8000, 12000, 20000]), P = r.pick([1500, 2500, 4000]);
  const kind = r.int(0, 1);
  if (kind === 0) return { prompt: `Una empresa tiene activos por ${money(A)} y pasivos por ${money(P)}. ¿Cuál es su patrimonio?`, options: options(money(A - P), [money(A + P), money(P - A), money(A)]), explain: "Ecuación contable: Activo = Pasivo + Patrimonio → Patrimonio = Activo − Pasivo." };
  return { prompt: `Una empresa tiene un patrimonio de ${money(A - P)} y pasivos por ${money(P)}. ¿Cuál es su activo total?`, options: options(money(A), [money(A - 2 * P), money(P), money(A - P)]), explain: "Activo = Pasivo + Patrimonio." };
});
bank("ct.bank", [
  { q: "La ecuación contable fundamental es:", o: ["Activo = Pasivo + Patrimonio", "Activo = Pasivo − Patrimonio", "Pasivo = Activo + Patrimonio", "Ingresos = Activo − Gastos"] },
  { q: "El principio de partida doble establece que:", o: ["Todo débito tiene un crédito por el mismo valor", "Cada transacción se registra dos veces en el mismo lado", "Los ingresos siempre duplican a los gastos", "Se lleva doble libro de caja"] },
  { q: "Una cuenta de activo es:", o: ["Bancos", "Cuentas por pagar", "Capital social", "Ventas"] },
  { q: "Una cuenta de pasivo es:", o: ["Préstamos bancarios por pagar", "Inventario de mercaderías", "Caja", "Muebles y enseres"] },
  { q: "Las cuentas de activo aumentan por el:", o: ["Debe (débito)", "Haber (crédito)", "Patrimonio", "Balance de comprobación"] },
  { q: "Las cuentas de pasivo aumentan por el:", o: ["Haber (crédito)", "Debe (débito)", "Activo", "Libro diario"] },
  { q: "El libro donde se registran las transacciones en orden cronológico es el:", o: ["Libro diario", "Libro mayor", "Balance general", "Estado de resultados"] },
  { q: "El estado financiero que muestra ingresos, costos, gastos y la utilidad de un período es el:", o: ["Estado de resultados", "Estado de situación financiera", "Flujo de caja proyectado", "Libro mayor"] },
  { q: "El estado de situación financiera (balance general) muestra:", o: ["Activos, pasivos y patrimonio a una fecha", "Solo las ventas del mes", "Los gastos personales del dueño", "Únicamente el efectivo"] },
  { q: "En Ecuador, el organismo que administra los impuestos es el:", o: ["SRI (Servicio de Rentas Internas)", "IESS", "Banco Central", "Superintendencia de Bancos"] },
  { q: "El RUC sirve para:", o: ["Identificar a contribuyentes que realizan actividades económicas", "Afiliarse al seguro social", "Votar en elecciones", "Abrir una cuenta de ahorros"] },
  { q: "La depreciación es:", o: ["La pérdida de valor de un activo fijo por uso o paso del tiempo", "Un aumento del capital", "Un ingreso extraordinario", "El pago de intereses"] },
  { q: "Un activo corriente es aquel que:", o: ["Se convierte en efectivo en menos de un año", "Dura más de diez años", "Es un terreno", "Nunca se vende"] },
  { q: "La utilidad bruta se obtiene restando:", o: ["Ventas − costo de ventas", "Ventas − impuestos", "Activos − pasivos", "Gastos − ingresos"] },
  { q: "Las cuentas por cobrar representan:", o: ["Dinero que los clientes le deben a la empresa", "Dinero que la empresa debe a proveedores", "Impuestos pagados", "Aportes de los socios"] },
  { q: "El capital aportado por los dueños forma parte del:", o: ["Patrimonio", "Pasivo", "Activo corriente", "Gasto"] },
  { q: "Un gasto se registra porque:", o: ["Disminuye el patrimonio por el consumo de recursos para operar", "Aumenta los activos", "Aumenta el capital social", "Es un préstamo recibido"] },
  { q: "El valor del dinero en el tiempo significa que:", o: ["Un dólar hoy vale más que un dólar en el futuro", "El dinero nunca cambia de valor", "Un dólar futuro vale más que hoy", "Solo importa el interés simple"] },
]);
