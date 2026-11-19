// Práctica gratuita por tema: repaso corto + preguntas generadas con su respuesta y explicación.
// Solo usa GENERADORES (preguntas nuevas con números al azar), nunca los bancos escritos a mano:
// así se pueden mostrar las respuestas sin exponer el contenido protegido de los simuladores.
import { SOURCES } from "./lib/sources.js";
import { rng, randomSeed, shuffle } from "./lib/rand.js";
import "./catalog.js"; // registra todas las fuentes

// area: id del grupo · r: repaso (regla + truco) · k: generadores del tema
export const AREAS = [
  { id: "numerico", name: "Razonamiento numérico", topics: [
    { id: "series", name: "Series numéricas", k: ["rn.series"], r: "Busca qué cambia de un número al siguiente: una suma fija, una multiplicación, la suma de los dos anteriores o diferencias que crecen. Escribe las diferencias debajo de la serie: casi siempre ahí está el patrón." },
    { id: "letras", name: "Series de letras", k: ["rn.letters"], r: "Convierte cada letra en su posición en el alfabeto (con Ñ: A=1 … N=14, Ñ=15, O=16 … Z=27) y resuélvelo como una serie numérica." },
    { id: "regla-de-tres", name: "Proporciones y regla de tres", k: ["rn.prop", "rn.work"], r: "Directa: si una cantidad sube, la otra también (más cuadernos, más dinero) → multiplica en cruz. Inversa: si una sube, la otra baja (más obreros, menos días) → multiplica en línea: a · b = c · x." },
    { id: "porcentajes", name: "Porcentajes", k: ["m.percent", "rn.pchange"], r: "El x % de N es N · x / 100. Subir un 20 % es multiplicar por 1,20; bajar un 20 % es multiplicar por 0,80. Dos cambios seguidos se multiplican: no se suman ni se restan." },
    { id: "edades", name: "Problemas de edades", k: ["rn.ages"], r: "Llama x a la edad de hoy. «Hace n años» es x − n y «dentro de n años» es x + n. La diferencia de edades entre dos personas nunca cambia." },
    { id: "promedios", name: "Promedios", k: ["rn.avg", "st.mean"], r: "Promedio = suma ÷ cantidad. Si te piden la nota que falta: (promedio deseado × total de notas) − suma de las que ya tienes." },
    { id: "operadores", name: "Operadores matemáticos", k: ["rn.operator"], r: "El símbolo nuevo es solo una regla: reemplaza a y b por los números que te dan, en el mismo orden, y respeta la jerarquía de operaciones." },
    { id: "conjuntos", name: "Conjuntos (diagramas de Venn)", k: ["rn.sets"], r: "Total = solo A + solo B + ambos + ninguno. Para hallar «ambos»: (A + B) − (total − ninguno)." },
    { id: "moviles", name: "Móviles (encuentro y alcance)", k: ["rn.meet"], r: "Al encuentro, las velocidades se suman: t = distancia ÷ (v1 + v2). Uno persigue al otro: se restan: t = ventaja ÷ (v1 − v2)." },
    { id: "cuadros", name: "Cuadros numéricos", k: ["rn.grid"], r: "Mira cada fila: el tercer número suele salir de los dos primeros con la misma operación (suma, producto, doble menos…). Comprueba la regla en todas las filas antes de responder." },
  ] },
  { id: "logico", name: "Razonamiento lógico", topics: [
    { id: "ordenamiento", name: "Ordenamiento", k: ["rl.order"], r: "Dibuja una línea y coloca a cada persona según cada pista. Empieza por la pista que relaciona a más personas." },
    { id: "silogismos", name: "Silogismos", k: ["rl.syllogism"], r: "Dibuja círculos (diagramas de Venn) para cada premisa. Una conclusión solo es válida si se cumple en TODOS los dibujos posibles. «Algunos» y «algunos» no permiten concluir nada." },
    { id: "calendarios", name: "Calendarios", k: ["rl.calendar"], r: "Los días se repiten cada 7: divide los días entre 7 y avanza solo el residuo. Traduce «el ayer de mañana» paso a paso: ayer de mañana = hoy." },
    { id: "codificacion", name: "Codificación", k: ["rl.code"], r: "Compara cada letra con su código y cuenta cuántos lugares se movió en el alfabeto (con Ñ). Aplica el mismo corrimiento a la palabra nueva." },
  ] },
  { id: "abstracto", name: "Razonamiento abstracto y espacial", topics: [
    { id: "secuencias", name: "Secuencias de figuras", k: ["ra.arrow", "ra.poly", "ra.dots", "ra.grow", "ra.clock", "ra.pie"], r: "Revisa una sola cosa a la vez: posición, giro, número de lados o puntos, relleno y tamaño. Muchas veces cambian dos cosas al mismo tiempo." },
    { id: "matrices", name: "Matrices de figuras", k: ["ra.matrix", "ra.combo"], r: "Lee la matriz por filas y luego por columnas: cada fila suele tener las mismas figuras en distinto orden, o una figura que suma las otras dos." },
    { id: "diferente", name: "Figura diferente", k: ["ra.odd"], r: "Busca la regla que cumplen todas menos una: número de lados, simetría, giro o relleno." },
    { id: "cubos", name: "Conteo de cubos", k: ["re.cubes", "re.paint"], r: "Cuenta columna por columna, de atrás hacia adelante. En un cubo pintado de n×n×n: 8 cubitos con 3 caras, 12·(n−2) con 2, 6·(n−2)² con 1 y (n−2)³ sin pintar." },
    { id: "giros", name: "Giros y reflejos", k: ["re.rotate"], r: "Un giro no cambia el sentido de la figura; un reflejo sí (como en un espejo). Fíjate en una esquina o detalle y síguelo." },
    { id: "desarrollos", name: "Desarrollos de cubo", k: ["re.net"], r: "En un desarrollo en cruz, las caras opuestas están separadas por una cara en medio (en línea recta). Nunca son opuestas dos caras que se tocan." },
  ] },
  { id: "atencion", name: "Atención y concentración", topics: [
    { id: "conteo", name: "Conteo de letras y dígitos", k: ["at.letters", "at.digits"], r: "Recorre la línea una sola vez con el dedo o el cursor y marca mentalmente de 5 en 5. Cuidado con letras parecidas: b, d, p, q." },
    { id: "pares", name: "Pares iguales", k: ["at.pairs"], r: "Compara de derecha a izquierda: los errores suelen estar en las últimas cifras o en una tilde." },
  ] },
  { id: "matematica", name: "Matemática (desde cero)", topics: [
    { id: "operaciones", name: "Operaciones combinadas", k: ["m.ops", "m.problem"], r: "Orden: paréntesis, potencias y raíces, multiplicaciones y divisiones (de izquierda a derecha), sumas y restas." },
    { id: "fracciones", name: "Fracciones", k: ["m.frac"], r: "Para sumar o restar, busca un denominador común (el mcm). Para multiplicar, numerador por numerador y denominador por denominador. Para dividir, multiplica por la fracción invertida. Simplifica al final." },
    { id: "potencias", name: "Potencias", k: ["m.powers"], r: "Misma base: al multiplicar se suman los exponentes, al dividir se restan. (aⁿ)ᵐ = aⁿ·ᵐ y a⁰ = 1." },
    { id: "ecuaciones", name: "Ecuaciones de primer grado", k: ["m.eq1"], r: "Deja la x sola: lo que suma pasa restando, lo que multiplica pasa dividiendo. Comprueba reemplazando el resultado." },
    { id: "sistemas", name: "Sistemas de ecuaciones", k: ["m.system"], r: "Reducción: multiplica una ecuación para que una variable se elimine al sumarlas. Luego reemplaza para hallar la otra." },
    { id: "cuadraticas", name: "Ecuaciones cuadráticas", k: ["m.quad"], r: "Factoriza buscando dos números que multiplicados den c y sumados den b. Si no se puede: x = (−b ± √(b² − 4ac)) / 2a." },
    { id: "funciones", name: "Funciones", k: ["m.func"], r: "f(3) significa reemplazar cada x por 3. Usa paréntesis con los negativos: (−2)² = 4." },
    { id: "inecuaciones", name: "Inecuaciones", k: ["ma.ineq"], r: "Se resuelven como ecuaciones, con una regla extra: si multiplicas o divides por un número negativo, el signo de desigualdad se invierte." },
    { id: "geometria", name: "Áreas, Pitágoras y sólidos", k: ["m.area", "ma.pyth", "ma.solid"], r: "Triángulo rectángulo: hipotenusa² = cateto² + cateto². Círculo: A = π·r². Cilindro: V = π·r²·h. Cubo: V = a³." },
    { id: "recta", name: "La recta y la pendiente", k: ["ma.line"], r: "Pendiente m = (y₂ − y₁) / (x₂ − x₁). Rectas paralelas: misma pendiente. Perpendiculares: m₁ · m₂ = −1." },
    { id: "progresiones", name: "Progresiones", k: ["ma.seq"], r: "Aritmética: aₙ = a₁ + (n − 1)·d. Geométrica: aₙ = a₁·rⁿ⁻¹ y su suma Sₙ = a₁·(rⁿ − 1)/(r − 1)." },
    { id: "logaritmos", name: "Logaritmos", k: ["m.log", "ma.logeq"], r: "log_b(x) = y significa bʸ = x. log(a·b) = log a + log b. Para resolver log_b(x + c) = n: x + c = bⁿ." },
    { id: "trigonometria", name: "Trigonometría", k: ["m.trig"], r: "Memoriza 30°, 45° y 60°: sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2; el coseno va al revés; tan = sen/cos." },
    { id: "limites", name: "Límites", k: ["ma.limInf", "ma.limFactor"], r: "Si da 0/0, factoriza y simplifica. Al infinito, compara los grados: mismo grado → cociente de los coeficientes principales; mayor abajo → 0." },
    { id: "derivadas", name: "Derivadas", k: ["m.deriv", "ma.chain"], r: "(xⁿ)′ = n·xⁿ⁻¹. Regla de la cadena: (u)ⁿ → n·uⁿ⁻¹·u′." },
    { id: "integrales", name: "Integrales definidas", k: ["ma.integral"], r: "∫ xⁿ dx = xⁿ⁺¹/(n + 1). Evalúa en el límite superior y réstale el inferior." },
    { id: "determinantes", name: "Matrices y determinantes", k: ["ma.det"], r: "Determinante 2×2: [a b; c d] → a·d − b·c." },
  ] },
  { id: "fisica", name: "Física", topics: [
    { id: "mru", name: "MRU y velocidad", k: ["f.mru", "f.speed"], r: "d = v · t. Para pasar de km/h a m/s, divide para 3,6." },
    { id: "mruv", name: "MRUV, caída libre y tiro vertical", k: ["f.mruv", "f.freefall", "fx.vertical"], r: "v = v₀ + a·t; d = v₀·t + a·t²/2. Caída libre desde el reposo: d = g·t²/2. Altura máxima: h = v₀²/(2g)." },
    { id: "newton", name: "Leyes de Newton", k: ["f.newton", "f.weight", "fx.impulse"], r: "F = m·a. Peso = m·g. Impulso: F·t = m·Δv." },
    { id: "energia", name: "Trabajo, energía y potencia", k: ["f.energy", "f.potential", "fx.work", "f.power"], r: "Ec = m·v²/2. Ep = m·g·h. W = F·d·cos θ. P = W/t." },
    { id: "electricidad", name: "Ley de Ohm", k: ["f.ohm"], r: "V = I·R. Despeja según lo que te pidan: I = V/R, R = V/I." },
    { id: "unidades", name: "Unidades, densidad y notación científica", k: ["f.units", "f.density", "fx.sci"], r: "Densidad = masa ÷ volumen. En notación científica, el número va entre 1 y 10 y el exponente cuenta cuántos lugares moviste la coma." },
    { id: "circular", name: "Movimiento circular", k: ["fx.circular"], r: "Período T = tiempo ÷ vueltas. Frecuencia f = vueltas ÷ tiempo = 1/T." },
  ] },
  { id: "quimica", name: "Química", topics: [
    { id: "masa-molar", name: "Masa molar", k: ["q.molar"], r: "Suma las masas atómicas de todos los átomos de la fórmula: CO₂ = 12 + 2·16 = 44 g/mol." },
    { id: "moles", name: "Moles", k: ["q.moles"], r: "n = masa ÷ masa molar. 1 mol contiene 6,022 × 10²³ partículas." },
  ] },
  { id: "estadistica", name: "Estadística", topics: [
    { id: "tendencia", name: "Media, mediana y moda", k: ["st.mean", "st.median", "st.mode"], r: "Media: suma ÷ cantidad. Mediana: el valor del centro con los datos ORDENADOS. Moda: el que más se repite." },
    { id: "dispersion", name: "Varianza", k: ["st.var"], r: "Varianza poblacional: promedio de (dato − media)². La desviación estándar es su raíz cuadrada." },
    { id: "probabilidad", name: "Probabilidad", k: ["st.prob"], r: "P = casos favorables ÷ casos posibles. P(no A) = 1 − P(A)." },
    { id: "frecuencias", name: "Tablas de frecuencia", k: ["st.freq", "st.class"], r: "Frecuencia relativa = casos ÷ total (× 100 para porcentaje). Amplitud = rango ÷ número de intervalos. Marca de clase = punto medio del intervalo." },
  ] },
  { id: "emprendimiento", name: "Emprendimiento", topics: [
    { id: "costos", name: "Costos, utilidad y punto de equilibrio", k: ["em.calc"], r: "Utilidad = ingresos − costos. Punto de equilibrio = costos fijos ÷ (precio − costo variable). Productividad = producción ÷ recursos usados." },
  ] },
];

const TOPICS = new Map(AREAS.flatMap(a => a.topics.map(t => [t.id, { ...t, area: a.id }])));

export function practiceCatalog() {
  return AREAS.map(a => ({ id: a.id, name: a.name, topics: a.topics.map(t => ({ id: t.id, name: t.name, r: t.r })) }));
}

export function practiceSet(topicId, n = 5) {
  const t = TOPICS.get(String(topicId));
  if (!t) return null;
  const keys = t.k.filter(k => SOURCES[k] && SOURCES[k].kind === "gen");
  const out = [], seen = new Set();
  for (let tries = 0; out.length < n && tries < n * 12; tries++) {
    const key = keys[tries % keys.length];
    const q = SOURCES[key].build(null, rng(randomSeed()));
    const sig = q.prompt + (q.svg ? q.svg.join("") : "") + (q.figure || "") + (q.optionsSvg ? q.options.join("") : "");
    if (seen.has(sig) || (q.type && q.type !== "mc")) continue;
    seen.add(sig);
    const opts = q.keepOrder ? q.options.slice() : shuffle(q.options);
    out.push({ prompt: q.prompt, svg: q.svg, figure: q.figure, optionsSvg: !!q.optionsSvg, options: opts, answer: opts.indexOf(q.options[0]), explain: q.explain || "" });
  }
  return { topic: t.id, name: t.name, area: t.area, review: t.r, questions: out };
}
