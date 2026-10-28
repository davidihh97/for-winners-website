import { bank, dict, gen } from "../lib/sources.js";
import { options, fmt } from "../lib/rand.js";

// ================= LENGUA Y LITERATURA =================
// Palabra correcta + variantes con errores frecuentes (b/v, h, c/s/z, g/j, ll/y, tildes).
const SPELL = [
  ["hierba", "yerva", "hierva", "ierba"], ["exhibir", "exibir", "exhivir", "ecshibir"], ["vaso", "baso", "bazo", "vazo"],
  ["llover", "yover", "llober", "yober"], ["hacer", "aser", "hacér", "azer"], ["cerveza", "cerbeza", "serveza", "cervesa"],
  ["haber", "aver", "haver", "aber"], ["bienvenido", "vienvenido", "bienbenido", "vienbenido"], ["jirafa", "girafa", "jiraffa", "girrafa"],
  ["ahorro", "aorro", "ahorrho", "ahoro"], ["excelente", "exelente", "ecselente", "excelénte"], ["vegetal", "bejetal", "vejetal", "begetal"],
  ["prohibir", "proibir", "prohivir", "proivir"], ["desarrollo", "desarroyo", "desarollo", "dezarrollo"], ["conciencia", "consiencia", "conciensia", "concienzia"],
  ["absorber", "absorver", "avsorber", "azorber"], ["exhausto", "exausto", "exhaústo", "ecxausto"], ["cocción", "coción", "cocsión", "cosción"],
  ["generación", "jeneración", "generasión", "generacion"], ["envidia", "embidia", "envídia", "enbidia"], ["hallazgo", "hayazgo", "allazgo", "hallasgo"],
  ["adolescente", "adolecente", "adolesente", "adolezcente"], ["dirección", "direción", "dirrección", "direcsión"], ["vaivén", "baibén", "vaiven", "vaibén"],
  ["examen", "exámen", "eksamen", "exsamen"], ["lápiz", "lapiz", "lápis", "lapíz"], ["árbol", "arbol", "árvol", "arból"],
  ["canción", "cancion", "cansión", "canzión"], ["jóvenes", "jovenes", "jóvenés", "jovénes"], ["útil", "util", "utíl", "hútil"],
  ["después", "despues", "despúes", "déspues"], ["mamá", "mama", "mamà", "máma"], ["fácil", "facil", "fasil", "facíl"],
  ["volumen", "volúmen", "bolumen", "volumén"], ["crimen", "crímen", "krimen", "crimén"], ["héroe", "heroe", "éroe", "heróe"],
];
dict("le.spell", SPELL, ([ok, ...bad]) => ({ prompt: "¿Cuál palabra está escrita correctamente?", options: options(ok, bad) }));

bank("le.grammar", [
  { q: "En la oración «La vieja casona de mis abuelos amaneció cubierta de neblina», el núcleo del sujeto es:", o: ["casona", "abuelos", "vieja", "neblina"] },
  { q: "En «María compró flores para su madre», el complemento directo es:", o: ["flores", "María", "para su madre", "compró"] },
  { q: "¿Qué clase de palabra es «rápidamente»?", o: ["Adverbio", "Adjetivo", "Verbo", "Sustantivo"] },
  { q: "¿Cuál de estas palabras es aguda?", o: ["Sofá", "Fácil", "Mármol", "Cráter"] },
  { q: "¿Cuál es una palabra esdrújula?", o: ["Murciélago", "Camión", "Cárcel", "Mesa"] },
  { q: "La palabra «casa» se clasifica según su acento como:", o: ["Llana o grave", "Aguda", "Esdrújula", "Sobresdrújula"] },
  { q: "¿Cuál oración tiene el verbo en pretérito perfecto simple?", o: ["Ayer llovió en Quito", "Mañana lloverá", "Está lloviendo", "Llueve mucho"] },
  { q: "Elige la oración correctamente escrita:", o: ["Habrá varias funciones de cine el sábado", "Habrán varias funciones de cine el sábado", "Hubieron varias funciones de cine el sábado", "Habían varias funciones de cine el sábado"], e: "El verbo «haber» impersonal no se pluraliza." },
  { q: "¿Qué oración usa correctamente «porque»?", o: ["No vino porque estaba enfermo", "¿Porque no viniste?", "No sé el porque de su enojo", "Lo hizo porqué quiso"] },
  { q: "El plural de «el análisis» es:", o: ["Los análisis", "Los análisises", "Los análisis's", "Los analisis"] },
  { q: "En «El perro de mi vecino ladra fuerte», el predicado es:", o: ["ladra fuerte", "El perro", "de mi vecino", "El perro de mi vecino"] },
  { q: "¿Cuál es un sustantivo abstracto?", o: ["Libertad", "Mesa", "Montaña", "Perro"] },
  { q: "¿Qué signo se usa para encerrar una aclaración dentro de una oración?", o: ["Paréntesis", "Punto y coma", "Dos puntos", "Signo de admiración"] },
  { q: "¿Cuál oración está correctamente puntuada?", o: ["Quito, la capital, amaneció soleada.", "Quito la capital, amaneció soleada.", "Quito, la capital amaneció, soleada.", "Quito: la capital, amaneció soleada."] },
  { q: "«Sus ojos eran dos luceros» es un ejemplo de:", o: ["Metáfora", "Hipérbole", "Onomatopeya", "Personificación"] },
  { q: "«El viento susurraba entre los árboles» es un ejemplo de:", o: ["Personificación", "Metáfora", "Hipérbaton", "Anáfora"] },
  { q: "«Te lo he dicho un millón de veces» es un ejemplo de:", o: ["Hipérbole", "Símil", "Metáfora", "Antítesis"] },
  { q: "¿Quién escribió «Cien años de soledad»?", o: ["Gabriel García Márquez", "Mario Vargas Llosa", "Jorge Icaza", "Pablo Neruda"] },
  { q: "¿A qué generación literaria ecuatoriana perteneció Medardo Ángel Silva?", o: ["Generación decapitada", "Grupo de Guayaquil", "Tzántzicos", "Generación del 98"] },
  { q: "«Cumandá» es una novela de:", o: ["Juan León Mera", "Jorge Icaza", "Juan Montalvo", "Pablo Palacio"] },
  { q: "Un texto que explica paso a paso cómo armar un mueble es:", o: ["Instructivo", "Narrativo", "Lírico", "Argumentativo"] },
  { q: "La palabra que significa lo mismo que «comenzar» es:", o: ["Iniciar", "Terminar", "Detener", "Olvidar"] },
  { q: "¿Qué conector expresa oposición?", o: ["Sin embargo", "Además", "Por lo tanto", "Por ejemplo"] },
  { q: "¿Qué conector expresa consecuencia?", o: ["Por lo tanto", "Aunque", "Asimismo", "Es decir"] },
  { q: "Elige la oración con concordancia correcta:", o: ["La mayoría de los alumnos aprobó el examen", "La mayoría de los alumno aprobaron el examen", "Las mayoría de alumnos aprobó", "La mayoría de los alumnos aprobamos ellos"] },
]);

// ================= QUÍMICA =================
const COMPOUNDS = [["H₂O", 18], ["CO₂", 44], ["NaCl", 58.5], ["CH₄", 16], ["NH₃", 17], ["O₂", 32], ["HCl", 36.5], ["CaCO₃", 100], ["NaOH", 40], ["C₆H₁₂O₆", 180]];
gen("q.moles", r => {
  const [f, M] = r.pick(COMPOUNDS), n = r.pick([0.5, 1, 2, 3, 4, 5, 0.25]);
  const m = M * n;
  return {
    prompt: `¿Cuántos moles hay en ${fmt(m)} g de ${f}? (masa molar ${fmt(M)} g/mol)`,
    options: options(`${fmt(n)} mol`, [`${fmt(m * M)} mol`, `${fmt(n * 2)} mol`, `${fmt(M / m)} mol`, `${fmt(n + 1)} mol`], 4, k => `${fmt(n + k)} mol`),
    explain: `n = m/M = ${fmt(m)}/${fmt(M)} = ${fmt(n)} mol.`,
  };
});
gen("q.molar", r => {
  const [f, M] = r.pick(COMPOUNDS.filter(([, m]) => Number.isInteger(m) && m < 120));
  return { prompt: `Con H = 1, C = 12, N = 14, O = 16, Na = 23, Ca = 40 y S = 32, ¿cuál es la masa molar de ${f}?`, options: options(`${M} g/mol`, [`${M + 2} g/mol`, `${M - 1} g/mol`, `${M * 2} g/mol`, `${M + 16} g/mol`]), explain: "Suma las masas atómicas de todos los átomos de la fórmula." };
});

bank("q.bank", [
  { q: "El símbolo químico del sodio es:", o: ["Na", "So", "S", "Sd"] },
  { q: "El símbolo químico del hierro es:", o: ["Fe", "Hi", "Ir", "F"] },
  { q: "El símbolo químico del potasio es:", o: ["K", "P", "Po", "Pt"] },
  { q: "Una solución con pH = 3 es:", o: ["Ácida", "Básica", "Neutra", "Salina"] },
  { q: "El pH del agua pura a 25 °C es:", o: ["7", "0", "14", "1"] },
  { q: "La partícula con carga negativa del átomo es el:", o: ["Electrón", "Protón", "Neutrón", "Núcleo"] },
  { q: "El número atómico indica la cantidad de:", o: ["Protones", "Neutrones", "Moléculas", "Isótopos"] },
  { q: "El enlace en el NaCl es principalmente:", o: ["Iónico", "Covalente apolar", "Metálico", "Puente de hidrógeno"] },
  { q: "Los gases nobles se ubican en el grupo:", o: ["18 (VIIIA)", "1 (IA)", "17 (VIIA)", "2 (IIA)"] },
  { q: "El cambio de estado de sólido a gas sin pasar por líquido se llama:", o: ["Sublimación", "Fusión", "Evaporación", "Condensación"] },
  { q: "¿Qué método permite separar una mezcla de agua y aceite?", o: ["Decantación", "Destilación", "Imantación", "Tamizado"] },
  { q: "La fórmula del ácido clorhídrico es:", o: ["HCl", "HClO", "NaCl", "Cl₂"] },
  { q: "Un mol de cualquier sustancia contiene aproximadamente:", o: ["6,022 × 10²³ partículas", "1000 partículas", "22,4 partículas", "6,022 × 10⁻²³ partículas"] },
  { q: "¿Qué gas se libera en la fotosíntesis?", o: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"] },
  { q: "Un catalizador:", o: ["Acelera una reacción sin consumirse", "Detiene la reacción", "Es siempre un reactivo", "Aumenta la masa total"] },
  { q: "Los isótopos de un elemento tienen distinto número de:", o: ["Neutrones", "Protones", "Electrones de valencia", "Número atómico"] },
  { q: "La reacción de un ácido con una base produce:", o: ["Sal y agua", "Solo gas", "Un metal", "Oxígeno"] },
  { q: "El compuesto CH₄ se llama:", o: ["Metano", "Etano", "Metanol", "Ácido metanoico"] },
  { q: "¿Cuántos átomos de oxígeno hay en una molécula de H₂SO₄?", o: ["4", "2", "1", "6"] },
  { q: "Una reacción que libera calor es:", o: ["Exotérmica", "Endotérmica", "Neutra", "Reversible siempre"] },
]);

// ================= BIOLOGÍA =================
bank("b.bank", [
  { q: "La unidad básica de la vida es:", o: ["La célula", "El tejido", "El átomo", "El órgano"] },
  { q: "El organelo que contiene enzimas digestivas y degrada sustancias dentro de la célula es:", o: ["El lisosoma", "El cloroplasto", "El ribosoma", "La pared celular"] },
  { q: "La fotosíntesis ocurre en:", o: ["Los cloroplastos", "Las mitocondrias", "El núcleo", "Los lisosomas"] },
  { q: "La molécula que contiene la información genética es:", o: ["ADN", "ATP", "Glucosa", "Colesterol"] },
  { q: "Las células procariotas se caracterizan por:", o: ["No tener núcleo definido", "Tener muchos núcleos", "Ser siempre vegetales", "Tener cloroplastos"] },
  { q: "Los centríolos participan principalmente en:", o: ["La división celular", "La fotosíntesis", "El almacenamiento de agua", "La síntesis de lípidos"] },
  { q: "El órgano que bombea la sangre es:", o: ["El corazón", "El hígado", "El pulmón", "El riñón"] },
  { q: "Las plaquetas intervienen principalmente en:", o: ["La coagulación de la sangre", "El transporte de oxígeno", "La producción de anticuerpos", "La digestión"] },
  { q: "La insulina es producida por:", o: ["El páncreas", "El hígado", "La tiroides", "El estómago"] },
  { q: "El sistema que defiende al cuerpo de infecciones es el:", o: ["Inmunológico", "Digestivo", "Óseo", "Endocrino"] },
  { q: "La división celular que produce gametos es la:", o: ["Meiosis", "Mitosis", "Fisión binaria", "Gemación"] },
  { q: "En las bases del ADN, la adenina se empareja con:", o: ["Timina", "Guanina", "Citosina", "Uracilo"] },
  { q: "Un organismo que produce su propio alimento es:", o: ["Autótrofo", "Heterótrofo", "Parásito", "Descomponedor"] },
  { q: "En una cadena alimenticia, los hongos y bacterias que degradan materia muerta son:", o: ["Descomponedores", "Productores", "Consumidores primarios", "Depredadores"] },
  { q: "El intercambio de gases en los pulmones ocurre en:", o: ["Los alvéolos", "La tráquea", "Los bronquios", "La laringe"] },
  { q: "La parte de la neurona que recibe impulsos es:", o: ["Las dendritas", "El axón", "La mielina", "La sinapsis"] },
  { q: "La hemoglobina contiene principalmente:", o: ["Hierro", "Calcio", "Sodio", "Yodo"] },
  { q: "¿Qué vitamina se produce en la piel con la luz solar?", o: ["Vitamina D", "Vitamina C", "Vitamina A", "Vitamina B12"] },
  { q: "Las Islas Galápagos son famosas por inspirar la teoría de:", o: ["La evolución por selección natural", "La generación espontánea", "La deriva continental", "La relatividad"] },
  { q: "El hueso más largo del cuerpo humano es el:", o: ["Fémur", "Húmero", "Tibia", "Radio"] },
  { q: "Un ecosistema andino de alta montaña que regula el agua es:", o: ["El páramo", "El manglar", "El desierto", "La sabana"] },
  { q: "Los virus se caracterizan por:", o: ["Necesitar una célula huésped para reproducirse", "Ser células procariotas", "Hacer fotosíntesis", "Tener mitocondrias"] },
  { q: "La función principal del riñón es:", o: ["Filtrar la sangre y producir orina", "Producir bilis", "Digerir proteínas", "Bombear sangre"] },
  { q: "El genotipo «Aa» se denomina:", o: ["Heterocigoto", "Homocigoto dominante", "Homocigoto recesivo", "Fenotipo"] },
]);

// ================= ESTUDIOS SOCIALES / HISTORIA DEL ECUADOR =================
bank("s.bank", [
  { q: "El Primer Grito de Independencia en Quito ocurrió el:", o: ["10 de agosto de 1809", "24 de mayo de 1822", "9 de octubre de 1820", "13 de mayo de 1830"] },
  { q: "La Batalla de Pichincha se libró el:", o: ["24 de mayo de 1822", "10 de agosto de 1809", "6 de marzo de 1845", "5 de junio de 1895"] },
  { q: "Ecuador se separó de la Gran Colombia en el año:", o: ["1830", "1822", "1809", "1895"] },
  { q: "La Revolución Liberal de 1895 fue liderada por:", o: ["Eloy Alfaro", "Gabriel García Moreno", "Juan José Flores", "Vicente Rocafuerte"] },
  { q: "El primer presidente del Ecuador fue:", o: ["Juan José Flores", "Vicente Rocafuerte", "Eloy Alfaro", "Simón Bolívar"] },
  { q: "La Constitución vigente del Ecuador fue aprobada en:", o: ["2008", "1998", "1979", "2017"] },
  { q: "El Ecuador adoptó el dólar como moneda oficial en el año:", o: ["2000", "1995", "2008", "1990"] },
  { q: "¿Cuántas provincias tiene el Ecuador?", o: ["24", "22", "20", "26"] },
  { q: "La capital de la provincia de Imbabura es:", o: ["Ibarra", "Otavalo", "Tulcán", "Cotacachi"] },
  { q: "La capital de la provincia del Carchi es:", o: ["Tulcán", "Ibarra", "Montúfar", "Bolívar"] },
  { q: "Las cuatro regiones naturales del Ecuador son:", o: ["Costa, Sierra, Amazonía e Insular", "Norte, Sur, Este y Oeste", "Costa, Sierra, Páramo y Selva", "Sierra, Valle, Costa y Galápagos continental"] },
  { q: "Ecuador debe su nombre a:", o: ["La línea equinoccial", "El río Guayas", "El volcán Chimborazo", "Un presidente"] },
  { q: "El volcán Chimborazo es conocido por ser:", o: ["El punto de la superficie terrestre más alejado del centro de la Tierra", "El volcán más activo del mundo", "La montaña más alta de América", "El único volcán de la Costa"] },
  { q: "El poeta guayaquileño autor de «La victoria de Junín. Canto a Bolívar» es:", o: ["José Joaquín de Olmedo", "Juan Montalvo", "Juan León Mera", "Eugenio Espejo"] },
  { q: "El autor de la letra del Himno Nacional del Ecuador es:", o: ["Juan León Mera", "Antonio Neumane", "Juan Montalvo", "Olmedo"] },
  { q: "La cultura precolombina conocida por sus figuras de cerámica «Venus» es:", o: ["Valdivia", "Inca", "Cañari", "Quitu-Cara"] },
  { q: "El océano que baña las costas del Ecuador es el:", o: ["Pacífico", "Atlántico", "Índico", "Ártico"] },
  { q: "Las funciones del Estado ecuatoriano según la Constitución son:", o: ["Cinco: Ejecutiva, Legislativa, Judicial, Electoral y de Transparencia y Control Social", "Tres: Ejecutiva, Legislativa y Judicial", "Dos: Ejecutiva y Legislativa", "Cuatro: Ejecutiva, Legislativa, Judicial y Militar"] },
  { q: "La Revolución Francesa comenzó en el año:", o: ["1789", "1492", "1810", "1914"] },
  { q: "Cristóbal Colón llegó a América en:", o: ["1492", "1534", "1500", "1600"] },
  { q: "La ciudad de Ibarra fue fundada en el año:", o: ["1606", "1534", "1809", "1700"] },
  { q: "La Primera Guerra Mundial comenzó en:", o: ["1914", "1939", "1898", "1945"] },
  { q: "Un derecho fundamental reconocido en la Constitución ecuatoriana para la naturaleza es:", o: ["Que se respete integralmente su existencia", "Que pueda votar", "Que pague impuestos", "Ninguno: la naturaleza no tiene derechos"] },
]);

// ---------- Diccionarios: cada par genera preguntas en ambos sentidos con distractores variables ----------
const pairQ = (prompt, rev) => ([a, b], r, all, idx) => {
  const flip = rev && r.chance(0.5);
  const others = r.sample(all.filter((_, i) => i !== idx), 3).map(x => (flip ? x[0] : x[1]));
  return flip ? { prompt: rev(b), options: options(a, others) } : { prompt: prompt(a), options: options(b, others) };
};

const ELEMENTS = [["Hidrógeno", "H"], ["Helio", "He"], ["Litio", "Li"], ["Carbono", "C"], ["Nitrógeno", "N"], ["Oxígeno", "O"], ["Flúor", "F"], ["Neón", "Ne"], ["Sodio", "Na"], ["Magnesio", "Mg"], ["Aluminio", "Al"], ["Silicio", "Si"], ["Fósforo", "P"], ["Azufre", "S"], ["Cloro", "Cl"], ["Potasio", "K"], ["Calcio", "Ca"], ["Hierro", "Fe"], ["Cobre", "Cu"], ["Zinc", "Zn"], ["Plata", "Ag"], ["Oro", "Au"], ["Mercurio", "Hg"], ["Plomo", "Pb"], ["Yodo", "I"], ["Estaño", "Sn"], ["Manganeso", "Mn"], ["Níquel", "Ni"], ["Bromo", "Br"], ["Uranio", "U"]];
dict("q.symbols", ELEMENTS, pairQ(a => `¿Cuál es el símbolo químico del ${a.toLowerCase()}?`, b => `¿A qué elemento corresponde el símbolo «${b}»?`));

const ORGANELLES = [["Núcleo", "Contener el material genético (ADN)"], ["Mitocondria", "Producir energía (ATP) mediante la respiración celular"], ["Cloroplasto", "Realizar la fotosíntesis"], ["Ribosoma", "Sintetizar proteínas"], ["Aparato de Golgi", "Modificar, empaquetar y distribuir proteínas"], ["Lisosoma", "Digerir sustancias con enzimas"], ["Membrana plasmática", "Regular la entrada y salida de sustancias"], ["Pared celular", "Dar rigidez y protección a la célula vegetal"], ["Retículo endoplasmático rugoso", "Sintetizar y transportar proteínas"], ["Vacuola", "Almacenar agua y sustancias"]];
dict("b.organelles", ORGANELLES, pairQ(a => `¿Cuál es la función principal de: ${a}?`, b => `¿Qué estructura celular se encarga de: ${b.toLowerCase()}?`));

const ORGANS = [["Corazón", "Bombear la sangre"], ["Pulmones", "Realizar el intercambio de gases"], ["Hígado", "Producir bilis y metabolizar sustancias"], ["Riñones", "Filtrar la sangre y formar la orina"], ["Estómago", "Iniciar la digestión de proteínas con ácido y enzimas"], ["Intestino delgado", "Absorber los nutrientes"], ["Páncreas", "Producir insulina y enzimas digestivas"], ["Piel", "Proteger el cuerpo y regular la temperatura"], ["Cerebro", "Coordinar las funciones del sistema nervioso"], ["Glándula tiroides", "Regular el metabolismo mediante hormonas"], ["Intestino grueso", "Absorber agua y formar las heces"], ["Médula ósea", "Producir células sanguíneas"]];
dict("b.organs", ORGANS, pairQ(a => `La función principal de: ${a.toLowerCase()} es…`, b => `¿Qué órgano se encarga de: ${b.toLowerCase()}?`));

bank("b.bank2", [
  { q: "El proceso por el cual el agua pasa de las raíces a las hojas y se evapora se llama:", o: ["Transpiración", "Fotosíntesis", "Respiración", "Germinación"] },
  { q: "Los seres vivos se clasifican en cinco reinos: Monera, Protista, Fungi, Plantae y:", o: ["Animalia", "Virus", "Bacteria", "Minerales"] },
  { q: "La glucosa es un:", o: ["Carbohidrato", "Lípido", "Ácido nucleico", "Mineral"] },
  { q: "Las enzimas son, en su mayoría:", o: ["Proteínas", "Lípidos", "Carbohidratos", "Vitaminas"] },
  { q: "El tipo de sangre considerado donante universal es:", o: ["O negativo", "AB positivo", "A positivo", "B negativo"] },
  { q: "Un ejemplo de animal invertebrado es:", o: ["La araña", "El cóndor", "La rana", "La tortuga"] },
  { q: "La relación entre una abeja y una flor que poliniza es de:", o: ["Mutualismo", "Parasitismo", "Depredación", "Competencia"] },
  { q: "El nivel de organización formado por células similares que cumplen una función es el:", o: ["Tejido", "Órgano", "Sistema", "Organismo"] },
  { q: "En la mitosis se obtienen:", o: ["Dos células hijas idénticas", "Cuatro gametos", "Una célula con el doble de cromosomas", "Células sin núcleo"] },
  { q: "El ser humano normalmente tiene:", o: ["46 cromosomas", "23 cromosomas", "48 cromosomas", "44 cromosomas"] },
  { q: "El sistema endocrino actúa mediante:", o: ["Hormonas", "Impulsos eléctricos únicamente", "Anticuerpos", "Enzimas digestivas"] },
  { q: "Las vacunas generan inmunidad porque:", o: ["Estimulan la producción de anticuerpos", "Matan todas las bacterias", "Sustituyen a los glóbulos rojos", "Son antibióticos"] },
  { q: "Los antibióticos sirven para tratar infecciones causadas por:", o: ["Bacterias", "Virus", "Hongos y virus por igual", "Alergias"] },
  { q: "La bilis ayuda a digerir:", o: ["Las grasas", "Las proteínas", "El almidón", "Las vitaminas"] },
  { q: "Un ecosistema costero del Ecuador formado por árboles que crecen en agua salobre es el:", o: ["Manglar", "Páramo", "Bosque nublado", "Desierto"] },
  { q: "El ARN se diferencia del ADN porque contiene:", o: ["Uracilo en lugar de timina", "Timina en lugar de uracilo", "Doble hélice siempre", "Desoxirribosa"] },
  { q: "En la ecuación de la fotosíntesis, las plantas absorben:", o: ["Dióxido de carbono y agua", "Oxígeno y glucosa", "Nitrógeno y oxígeno", "Solo luz"] },
  { q: "Los glóbulos blancos se encargan de:", o: ["Defender al organismo", "Transportar oxígeno", "Coagular la sangre", "Producir hormonas"] },
]);

bank("q.bank2", [
  { q: "¿Cuál ecuación está correctamente balanceada?", o: ["2H₂ + O₂ → 2H₂O", "H₂ + O₂ → H₂O", "H₂ + 2O₂ → 2H₂O", "2H₂ + 2O₂ → H₂O"] },
  { q: "¿Cuál ecuación está correctamente balanceada?", o: ["CH₄ + 2O₂ → CO₂ + 2H₂O", "CH₄ + O₂ → CO₂ + H₂O", "CH₄ + 2O₂ → 2CO₂ + H₂O", "2CH₄ + O₂ → CO₂ + 2H₂O"] },
  { q: "¿Cuál ecuación está correctamente balanceada?", o: ["N₂ + 3H₂ → 2NH₃", "N₂ + H₂ → NH₃", "N₂ + 2H₂ → 2NH₃", "2N₂ + 3H₂ → NH₃"] },
  { q: "La reacción HCl + NaOH → NaCl + H₂O es de tipo:", o: ["Neutralización", "Combustión", "Síntesis", "Descomposición"] },
  { q: "La reacción Zn + 2HCl → ZnCl₂ + H₂ es de tipo:", o: ["Sustitución simple", "Síntesis", "Descomposición", "Combustión"] },
  { q: "La configuración electrónica del sodio (Z = 11) termina en:", o: ["3s¹", "2p⁶", "3p¹", "4s¹"] },
  { q: "El número de oxidación de cualquier elemento en estado libre (por ejemplo, el Fe metálico) es:", o: ["0", "+1", "+2", "−1"] },
  { q: "Un elemento con 8 protones y 10 neutrones tiene número másico:", o: ["18", "8", "10", "2"] },
  { q: "El NaOH se clasifica como:", o: ["Hidróxido (base)", "Ácido", "Óxido", "Sal"] },
  { q: "El CO₂ es un:", o: ["Óxido no metálico", "Hidróxido", "Hidruro", "Ácido oxácido"] },
  { q: "La ley de conservación de la masa fue formulada por:", o: ["Lavoisier", "Dalton", "Mendeléyev", "Bohr"] },
  { q: "En la tabla periódica, los elementos de un mismo grupo tienen igual número de:", o: ["Electrones de valencia", "Neutrones", "Protones", "Niveles de energía"] },
  { q: "Una solución que contiene la máxima cantidad de soluto disuelto es:", o: ["Saturada", "Diluida", "Insaturada", "Coloidal"] },
  { q: "¿Cuál es un hidrocarburo con triple enlace?", o: ["Alquino", "Alcano", "Alqueno", "Alcohol"] },
  { q: "El grupo funcional –OH caracteriza a los:", o: ["Alcoholes", "Aldehídos", "Ácidos carboxílicos", "Éteres"] },
]);

const PROVINCES = [["Imbabura", "Ibarra"], ["Carchi", "Tulcán"], ["Pichincha", "Quito"], ["Guayas", "Guayaquil"], ["Azuay", "Cuenca"], ["Tungurahua", "Ambato"], ["Chimborazo", "Riobamba"], ["Cotopaxi", "Latacunga"], ["Loja", "Loja"], ["Manabí", "Portoviejo"], ["Esmeraldas", "Esmeraldas"], ["El Oro", "Machala"], ["Los Ríos", "Babahoyo"], ["Bolívar", "Guaranda"], ["Cañar", "Azogues"], ["Napo", "Tena"], ["Pastaza", "Puyo"], ["Morona Santiago", "Macas"], ["Zamora Chinchipe", "Zamora"], ["Sucumbíos", "Nueva Loja"], ["Orellana", "Puerto Francisco de Orellana"], ["Galápagos", "Puerto Baquerizo Moreno"], ["Santa Elena", "Santa Elena"], ["Santo Domingo de los Tsáchilas", "Santo Domingo"]];
dict("s.capitals", PROVINCES, pairQ(a => `¿Cuál es la capital de la provincia de ${a}?`, b => `¿De qué provincia es capital ${b}?`));
