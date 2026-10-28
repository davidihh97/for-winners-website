import { gen, bank } from "../lib/sources.js";
import { options, fmt } from "../lib/rand.js";

const near = x => k => x + (k % 2 ? 1 : -1) * Math.ceil(k / 2);
const NAMES = ["Ana", "Luis", "Carla", "Pedro", "Sofía", "Diego", "Valeria", "Mateo", "Camila", "Jorge", "Paula", "Andrés", "Lucía", "Tomás", "Daniela", "Martín"];
const ABC = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

// ================= RAZONAMIENTO NUMÉRICO =================
gen("rn.series", r => {
  const kind = r.pick(["arit", "geo", "alt", "sq", "fib", "diff"]);
  let s, next, why;
  if (kind === "arit") {
    const a = r.int(-10, 30), d = r.pick([-7, -5, -3, 3, 4, 5, 6, 7, 9, 11]);
    s = [0, 1, 2, 3, 4].map(i => a + d * i); next = a + d * 5; why = `Se suma ${d} cada vez.`;
  } else if (kind === "geo") {
    const a = r.int(1, 5), q = r.pick([2, 3]);
    s = [0, 1, 2, 3, 4].map(i => a * q ** i); next = a * q ** 5; why = `Cada término se multiplica por ${q}.`;
  } else if (kind === "alt") {
    const a = r.int(1, 10), m = r.pick([2, 3]), p = r.int(1, 5);
    s = [a]; for (let i = 0; i < 4; i++) s.push(i % 2 ? s[i] + p : s[i] * m);
    next = s[4] * m; why = `Se alterna ×${m} y +${p}.`;
  } else if (kind === "sq") {
    const k = r.int(-3, 5), o = r.int(1, 4);
    s = [0, 1, 2, 3, 4].map(i => (i + o) ** 2 + k); next = (5 + o) ** 2 + k; why = `Son cuadrados perfectos${k ? (k > 0 ? " más " : " menos ") + Math.abs(k) : ""}.`;
  } else if (kind === "fib") {
    const a = r.int(1, 5), b = r.int(1, 6);
    s = [a, b]; for (let i = 0; i < 3; i++) s.push(s[i] + s[i + 1]);
    next = s[3] + s[4]; why = "Cada término es la suma de los dos anteriores.";
  } else {
    const a = r.int(1, 20), d = r.int(1, 4), e = r.int(1, 3);
    s = [a]; for (let i = 0; i < 4; i++) s.push(s[i] + d + e * i);
    next = s[4] + d + e * 4; why = `Las diferencias aumentan de ${e} en ${e}: ${d}, ${d + e}, ${d + 2 * e}…`;
  }
  return { prompt: `¿Qué número continúa la serie?  ${s.join(", ")}, …`, options: options(next, [next + 1, next - 2, s[4] * 2 - s[3] + 3, next + (s[4] - s[3])], 4, near(next)), explain: why };
});

gen("rn.letters", r => {
  const step = r.pick([2, 3, 4, 5]), start = r.int(0, 8);
  const s = [0, 1, 2, 3].map(i => ABC[(start + step * i) % 27]);
  const ans = ABC[(start + step * 4) % 27];
  const wrong = [1, -1, 2].map(k => ABC[(start + step * 4 + k + 27) % 27]);
  return { prompt: `¿Qué letra continúa?  ${s.join(", ")}, …  (alfabeto con Ñ)`, options: options(ans, wrong), explain: `Se avanza de ${step} en ${step} letras.` };
});

gen("rn.ages", r => {
  const b = r.int(5, 20), diff = r.int(3, 25), a = b + diff, k = r.int(2, 10);
  const kind = r.pick(["sum", "double"]);
  if (kind === "sum") {
    const S = a + b + 2 * k;
    return {
      prompt: `${r.pick(NAMES)} tiene ${diff} años más que su hermano. Dentro de ${k} años, la suma de sus edades será ${S}. ¿Cuántos años tiene hoy el hermano?`,
      options: options(b, [a, b + k, (S - diff) / 2, b - 1], 4, near(b)),
      explain: `Hoy: x y x+${diff}. Dentro de ${k}: (x+${k}) + (x+${diff}+${k}) = ${S} → 2x = ${S - diff - 2 * k} → x = ${b}.`,
    };
  }
  const son = r.int(4, 15), father = son * 2 + r.int(0, 0), y = r.int(3, 10);
  const fNow = father + y, sNow = son + y;
  return {
    prompt: `Hace ${y} años, la edad de un padre era el doble de la de su hijo. Si hoy el hijo tiene ${sNow} años, ¿cuántos años tiene el padre?`,
    options: options(fNow, [sNow * 2, father, fNow + y, sNow * 2 - y], 4, near(fNow)),
    explain: `Hace ${y} años el hijo tenía ${son}; el padre ${father}. Hoy el padre tiene ${father} + ${y} = ${fNow}.`,
  };
});

gen("rn.work", r => {
  const w1 = r.pick([2, 3, 4, 5, 6, 8, 10, 12]), d1 = r.pick([3, 4, 5, 6, 8, 10, 12, 15]);
  const total = w1 * d1;
  const opts = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30].filter(x => x !== w1 && total % x === 0);
  const w2 = r.pick(opts.length ? opts : [1]);
  const d2 = total / w2;
  return {
    prompt: `${w1} obreros construyen un muro en ${d1} días. Trabajando al mismo ritmo, ¿cuántos días tardarán ${w2} obreros?`,
    options: options(d2, [(d1 * w2) / w1 | 0 || d1 + 1, d1 + (w1 - w2), total, d2 + 2], 4, near(d2)),
    explain: `Proporción inversa: ${w1} × ${d1} = ${w2} × x → x = ${total}/${w2} = ${d2} días.`,
  };
});

gen("rn.prop", r => {
  const item = r.pick(["cuadernos", "libras de arroz", "metros de tela", "entradas"]);
  const n1 = r.int(2, 6), unit = r.int(2, 12) * 0.25, n2 = r.int(7, 15);
  return {
    prompt: `Si ${n1} ${item} cuestan $${fmt(n1 * unit)}, ¿cuánto costarán ${n2}?`,
    options: options(`$${fmt(n2 * unit)}`, [`$${fmt(n2 * unit + unit)}`, `$${fmt(n1 * unit * n2)}`, `$${fmt((n2 - n1) * unit)}`], 4, k => `$${fmt(n2 * unit + k * 0.5)}`),
    explain: `Precio unitario: $${fmt(unit)}. ${n2} × $${fmt(unit)} = $${fmt(n2 * unit)}.`,
  };
});

gen("rn.pchange", r => {
  const p = r.pick([10, 20, 25, 50]), q = r.pick([10, 20, 25, 50]), P = r.int(2, 20) * 20;
  const final = (P * (100 + p) * (100 - q)) / 10000;
  return {
    prompt: `Un artículo cuesta $${P}. Primero sube un ${p} % y luego baja un ${q} %. ¿Cuál es su precio final?`,
    options: options(`$${fmt(final)}`, [`$${fmt(P * (1 + (p - q) / 100))}`, `$${P}`, `$${fmt(P * (1 + p / 100))}`, `$${fmt(final + 5)}`], 4, k => `$${fmt(final + k * 2)}`),
    explain: `$${P} × ${fmt(1 + p / 100)} × ${fmt(1 - q / 100)} = $${fmt(final)}. Los porcentajes sucesivos no se restan directamente.`,
  };
});

gen("rn.avg", r => {
  const n = r.int(3, 5), target = r.int(12, 18);
  const vals = Array.from({ length: n }, () => r.int(target - 5, target + 4));
  const missing = target * (n + 1) - vals.reduce((a, b) => a + b, 0);
  if (missing < 0 || missing > 20) return { prompt: `El promedio de ${vals.join(", ")} es:`, options: options(fmt(vals.reduce((a, b) => a + b, 0) / n), [fmt(target), fmt(target + 1), fmt(target - 1)], 4, k => fmt(target + k + 1)), explain: "Promedio = suma / cantidad." };
  return {
    prompt: `Un estudiante obtuvo ${vals.join(", ")} en ${n} pruebas (sobre 20). ¿Qué nota necesita en la siguiente para que su promedio sea ${target}?`,
    options: options(missing, [target, missing + 2, missing - 1, 20], 4, near(missing)),
    explain: `Necesita sumar ${target} × ${n + 1} = ${target * (n + 1)}. Lleva ${target * (n + 1) - missing}; le faltan ${missing}.`,
  };
});

gen("rn.operator", r => {
  const forms = [
    [(a, b) => 2 * a + b * b, "a ⊕ b = 2a + b²"],
    [(a, b) => a * b - a, "a ⊕ b = ab − a"],
    [(a, b) => a * a - 3 * b, "a ⊕ b = a² − 3b"],
    [(a, b) => (a + b) * (a - b), "a ⊕ b = (a + b)(a − b)"],
    [(a, b) => 3 * a - 2 * b + 1, "a ⊕ b = 3a − 2b + 1"],
  ];
  const [f, def] = r.pick(forms);
  const x = r.int(1, 7), y = r.int(1, 6);
  const ans = f(x, y);
  return { prompt: `Si se define ${def}, calcula ${x} ⊕ ${y}.`, options: options(ans, [f(y, x), ans + 2, ans - 3], 4, near(ans)), explain: `Reemplaza a = ${x} y b = ${y}: resultado ${ans}.` };
});

gen("rn.grid", r => {
  const kind = r.pick(["sum", "prod", "diff"]);
  const rows = [0, 1, 2].map(() => [r.int(2, 9), r.int(2, 9)]);
  const op = { sum: (a, b) => a + b, prod: (a, b) => a * b, diff: (a, b) => a * 2 - b }[kind];
  const txt = rows.map(([a, b], i) => `${a}   ${b}   ${i === 2 ? "?" : op(a, b)}`).join("  |  ");
  const ans = op(...rows[2]);
  return { prompt: `Observa cada fila y halla el número que falta:   ${txt}`, options: options(ans, [rows[2][0] + rows[2][1] + 1, rows[2][0] * rows[2][1] - 1, ans + 2], 4, near(ans)), explain: { sum: "El tercero es la suma de los dos primeros.", prod: "El tercero es el producto de los dos primeros.", diff: "El tercero es el doble del primero menos el segundo." }[kind] };
});

gen("rn.sets", r => {
  const both = r.int(3, 15), a = both + r.int(5, 25), b = both + r.int(5, 25), none = r.int(0, 10);
  const total = a + b - both + none;
  const subj = r.pick([["fútbol", "básquet"], ["inglés", "francés"], ["café", "té"], ["Matemática", "Física"]]);
  return {
    prompt: `En un grupo de ${total} personas, ${a} prefieren ${subj[0]}, ${b} prefieren ${subj[1]} y ${none} ninguno de los dos. ¿Cuántas prefieren ambos?`,
    options: options(both, [a + b - total, total - a, both + none, both + 2], 4, near(both)),
    explain: `${a} + ${b} − x + ${none} = ${total} → x = ${both}.`,
  };
});

gen("rn.meet", r => {
  const v1 = r.int(4, 12) * 10, v2 = r.int(3, 10) * 10, t = r.pick([1, 2, 3, 0.5, 1.5]);
  const d = (v1 + v2) * t;
  return {
    prompt: `Dos autos parten al mismo tiempo desde ciudades separadas ${fmt(d)} km, uno hacia el otro, a ${v1} km/h y ${v2} km/h. ¿En cuánto tiempo se encuentran?`,
    options: options(`${fmt(t)} h`, [`${fmt(d / v1)} h`, `${fmt(t + 1)} h`, `${fmt(t + 0.5)} h`, `${fmt(t * 2)} h`], 4, k => `${fmt(t + k)} h`),
    explain: `Se acercan a ${v1 + v2} km/h: t = ${fmt(d)}/${v1 + v2} = ${fmt(t)} h.`,
  };
});

// ================= RAZONAMIENTO LÓGICO =================
gen("rl.order", r => {
  const ppl = r.sample(NAMES, r.int(4, 5));
  const [adj, adjLow] = r.pick([["más alto", "más bajo"], ["mayor", "menor"], ["más rápido", "más lento"]]);
  const facts = r.shuffle(ppl.slice(0, -1).map((p, i) => `${p} es ${adj} que ${ppl[i + 1]}`));
  const askTop = r.chance(0.5), second = r.chance(0.3);
  let ans, q;
  if (second) { ans = ppl[1]; q = `¿Quién es el segundo ${adj}?`; }
  else if (askTop) { ans = ppl[0]; q = `¿Quién es el ${adj}?`; }
  else { ans = ppl[ppl.length - 1]; q = `¿Quién es el ${adjLow}?`; }
  return { prompt: `${facts.join(". ")}. ${q}`, options: options(ans, ppl.filter(p => p !== ans)), explain: `Ordenando de mayor a menor: ${ppl.join(" > ")}.` };
});

const NONSENSE = ["trelos", "bimbos", "zarcos", "plifos", "murtos", "gelones", "dranos", "quilos", "fernos", "lopitos", "sarvos", "nubertos"];
gen("rl.syllogism", r => {
  const [A, B, C] = r.sample(NONSENSE, 3);
  const forms = [
    { p: `Todos los ${A} son ${B}. Todos los ${B} son ${C}.`, a: `Todos los ${A} son ${C}.`, w: [`Todos los ${C} son ${A}.`, `Ningún ${A} es ${C}.`, "No se puede concluir nada."] },
    { p: `Todos los ${A} son ${B}. Algunos ${C} son ${A}.`, a: `Algunos ${C} son ${B}.`, w: [`Todos los ${C} son ${B}.`, `Ningún ${C} es ${B}.`, `Todos los ${B} son ${C}.`] },
    { p: `Ningún ${A} es ${B}. Todos los ${C} son ${A}.`, a: `Ningún ${C} es ${B}.`, w: [`Algunos ${C} son ${B}.`, `Todos los ${B} son ${C}.`, "No se puede concluir nada."] },
    { p: `Todos los ${A} son ${B}. Ningún ${B} es ${C}.`, a: `Ningún ${A} es ${C}.`, w: [`Algunos ${A} son ${C}.`, `Todos los ${C} son ${A}.`, `Todos los ${C} son ${B}.`] },
    { p: `Algunos ${A} son ${B}. Algunos ${B} son ${C}.`, a: "No se puede concluir nada.", w: [`Algunos ${A} son ${C}.`, `Todos los ${A} son ${C}.`, `Ningún ${A} es ${C}.`] },
    { p: `Todos los ${A} son ${B}. Todos los ${C} son ${B}.`, a: "No se puede concluir nada.", w: [`Todos los ${A} son ${C}.`, `Algunos ${A} son ${C}.`, `Todos los ${B} son ${A}.`] },
  ];
  const f = r.pick(forms);
  return { prompt: `${f.p} ¿Qué conclusión es válida?`, options: options(f.a, f.w), explain: "Dibuja los conjuntos: solo es válida la conclusión que se cumple en todos los casos posibles." };
});

const DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
gen("rl.calendar", r => {
  const kind = r.pick(["ahead", "anteayer", "pasado"]);
  const d = r.int(0, 6);
  if (kind === "ahead") {
    const n = r.int(8, 100);
    return { prompt: `Si hoy es ${DAYS[d]}, ¿qué día será dentro de ${n} días?`, options: options(DAYS[(d + n) % 7], [DAYS[(d + n + 1) % 7], DAYS[(d + n + 6) % 7], DAYS[(d + n + 2) % 7]]), explain: `${n} = 7 × ${Math.floor(n / 7)} + ${n % 7}; avanza ${n % 7} día(s).` };
  }
  if (kind === "anteayer") {
    return { prompt: `Si anteayer fue ${DAYS[d]}, ¿qué día será pasado mañana?`, options: options(DAYS[(d + 4) % 7], [DAYS[(d + 3) % 7], DAYS[(d + 2) % 7], DAYS[(d + 5) % 7]]), explain: `Anteayer → hoy son 2 días; hoy → pasado mañana, 2 más: total 4 días después de ${DAYS[d]}.` };
  }
  return { prompt: `Si el ayer de mañana es ${DAYS[d]}, ¿qué día fue ayer?`, options: options(DAYS[(d + 6) % 7], [DAYS[d], DAYS[(d + 1) % 7], DAYS[(d + 5) % 7]]), explain: `"El ayer de mañana" es hoy (${DAYS[d]}); ayer fue ${DAYS[(d + 6) % 7]}.` };
});

const WORDS = ["CASA", "LIBRO", "MESA", "PERRO", "GATO", "SOL", "LUNA", "ÁRBOL", "PLAYA", "TREN", "NUBE", "FLOR", "VERDE", "LAPIZ"].map(w => w.replace("Á", "A"));
gen("rl.code", r => {
  const k = r.pick([1, 2, 3, -1]);
  const enc = w => [...w].map(c => ABC[(ABC.indexOf(c) + k + 27) % 27]).join("");
  const [w1, w2] = r.sample(WORDS, 2);
  const ans = enc(w2);
  const alt = j => [...w2].map(c => ABC[(ABC.indexOf(c) + j + 27) % 27]).join("");
  return { prompt: `Si ${w1} se escribe ${enc(w1)}, ¿cómo se escribe ${w2}? (alfabeto con Ñ)`, options: options(ans, [alt(k + 1), alt(-k), alt(k - 1 || 2), [...ans].reverse().join("")]), explain: `Cada letra se desplaza ${k > 0 ? k : -k} posición(es) hacia ${k > 0 ? "adelante" : "atrás"}.` };
});

bank("rl.bank", [
  { q: "La hermana del padre de mi primo, que no es mi tía, es:", o: ["Mi madre", "Mi abuela", "Mi hermana", "Mi sobrina"], e: "Si es tía de mi primo por parte de padre y no es mi tía, solo puede ser mi madre." },
  { q: "¿Qué parentesco tiene conmigo el único nieto del abuelo de mi padre?", o: ["Mi padre", "Mi primo", "Mi tío", "Yo mismo"], e: "El abuelo de mi padre tiene un único nieto: mi padre." },
  { q: "Si algunos estudiantes son deportistas y todos los deportistas son disciplinados, entonces:", o: ["Algunos estudiantes son disciplinados", "Todos los estudiantes son disciplinados", "Ningún estudiante es disciplinado", "Todos los disciplinados son estudiantes"] },
  { q: "En una carrera, si adelantas al segundo, ¿en qué puesto quedas?", o: ["Segundo", "Primero", "Tercero", "Último"] },
  { q: "Un reloj marca las 3:00. ¿Qué ángulo forman sus agujas?", o: ["90°", "45°", "180°", "120°"] },
  { q: "Si todos los M son N y Pablo no es N, entonces:", o: ["Pablo no es M", "Pablo es M", "Pablo es N", "No se puede saber"] },
  { q: "¿Cuántos cuadrados hay en un tablero de 2 × 2 casillas (contando todos los tamaños)?", o: ["5", "4", "6", "8"], e: "4 pequeños + 1 grande." },
  { q: "Si 5 máquinas hacen 5 piezas en 5 minutos, ¿cuánto tardan 100 máquinas en hacer 100 piezas?", o: ["5 minutos", "100 minutos", "20 minutos", "1 minuto"], e: "Cada máquina hace una pieza en 5 minutos." },
  { q: "Negar la frase «Todos los alumnos aprobaron» equivale a:", o: ["Al menos un alumno no aprobó", "Ningún alumno aprobó", "Todos reprobaron", "Algunos alumnos aprobaron"] },
  { q: "Si llueve, el piso se moja. El piso está seco. Por lo tanto:", o: ["No llovió", "Llovió", "Va a llover", "No se puede saber"] },
  { q: "En una fila, Ana está delante de Luis y Luis delante de Marta. ¿Quién está al final?", o: ["Marta", "Ana", "Luis", "No se puede saber"] },
  { q: "Un caracol sube 3 m de día y resbala 2 m de noche en un pozo de 10 m. ¿En cuántos días sale?", o: ["8", "10", "7", "9"], e: "Tras 7 días está a 7 m; el día 8 sube 3 m y sale." },
]);

// ================= RAZONAMIENTO ABSTRACTO (figuras SVG) =================
const S = 64;
const svg = inner => `<svg viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">${inner}</svg>`;
const arrow = deg => svg(`<rect x="2" y="2" width="60" height="60" rx="8" stroke-width="1.5" opacity=".35"/><g transform="rotate(${deg} 32 32)"><line x1="32" y1="50" x2="32" y2="14"/><polyline points="22,24 32,14 42,24"/></g>`);
const poly = n => {
  const pts = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return `${(32 + 24 * Math.cos(a)).toFixed(1)},${(32 + 24 * Math.sin(a)).toFixed(1)}`; }).join(" ");
  return svg(`<polygon points="${pts}"/>`);
};
const dots = n => {
  const pos = [[16, 16], [48, 16], [32, 32], [16, 48], [48, 48], [32, 14], [14, 32], [50, 32], [32, 50]];
  return svg(`<rect x="2" y="2" width="60" height="60" rx="8" stroke-width="1.5" opacity=".35"/>` + pos.slice(0, n).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="currentColor" stroke="none"/>`).join(""));
};
const quad = (k, extra = -1) => {
  const cells = [[4, 4], [32, 4], [32, 32], [4, 32]];
  return svg(cells.map(([x, y], i) => `<rect x="${x}" y="${y}" width="28" height="28" ${i === k % 4 ? 'fill="currentColor"' : ""} ${i === extra ? 'fill="currentColor" opacity=".45"' : ""}/>`).join(""));
};
const dotInCircle = k => {
  const a = -Math.PI / 2 + (k % 8) * (Math.PI / 4);
  return svg(`<circle cx="32" cy="32" r="26"/><circle cx="${(32 + 18 * Math.cos(a)).toFixed(1)}" cy="${(32 + 18 * Math.sin(a)).toFixed(1)}" r="6" fill="currentColor" stroke="none"/>`);
};

const ABS_PROMPT = "¿Qué figura continúa la secuencia?";
gen("ra.arrow", r => {
  const step = r.pick([45, 90, 135, -45, -90]), a0 = r.pick([0, 45, 90, 180]);
  const seq = [0, 1, 2, 3].map(i => arrow(a0 + step * i));
  const ang = a => ((a % 360) + 360) % 360;
  return { prompt: ABS_PROMPT, svg: seq, optionsSvg: true, options: options(arrow(ang(a0 + step * 4)), [45, 90, 180, 270, 135].map(d => arrow(ang(a0 + step * 4 + d)))), explain: `La flecha gira ${Math.abs(step)}° en sentido ${step > 0 ? "horario" : "antihorario"} en cada paso.` };
});
gen("ra.poly", r => {
  // Polígonos de 3 a 6 lados (más lados no se distinguen a tamaño pequeño). Variante: relleno alternado.
  const alt = r.chance(0.5), f0 = r.chance(0.5);
  const fig = (n, fill) => poly(n).replace("<polygon", fill ? '<polygon fill="currentColor"' : "<polygon");
  const seq = [3, 4, 5].map((n, i) => fig(n, alt && (i % 2 === 0) === f0));
  const fillAns = alt && f0 === false;
  const ans = fig(6, fillAns);
  return { prompt: ABS_PROMPT, svg: seq, optionsSvg: true, options: options(ans, [fig(6, !fillAns), fig(5, fillAns), fig(4, fillAns), fig(3, !fillAns)]), explain: alt ? "Cada figura tiene un lado más y el relleno se alterna." : "Cada figura tiene un lado más que la anterior." };
});
gen("ra.dots", r => {
  const step = r.pick([1, 2]), n0 = step === 2 ? 1 : r.int(1, 3);
  const seq = [0, 1, 2].map(i => dots(n0 + step * i));
  const ans = n0 + step * 3;
  if (ans > 9) return { prompt: ABS_PROMPT, svg: [1, 2, 3].map(dots), optionsSvg: true, options: options(dots(4), [dots(5), dots(3), dots(6)]), explain: "Se agrega un punto en cada paso." };
  return { prompt: ABS_PROMPT, svg: seq, optionsSvg: true, options: options(dots(ans), [ans - 1, ans + 1, ans - step - 1, ans + 2].filter(x => x >= 1 && x <= 9).map(dots)), explain: `Se agregan ${step} punto(s) en cada paso.` };
});
gen("ra.quad", r => {
  const k0 = r.int(0, 3), dir = r.pick([1, 3]);
  const seq = [0, 1, 2, 3].map(i => quad(k0 + dir * i));
  return { prompt: ABS_PROMPT, svg: seq, optionsSvg: true, options: options(quad(k0 + dir * 4), [quad(k0 + dir * 4 + 1), quad(k0 + dir * 4 + 2), quad(k0 + dir * 4 + 3)]), explain: `El cuadro sombreado avanza en sentido ${dir === 1 ? "horario" : "antihorario"}.` };
});
gen("ra.orbit", r => {
  const step = r.pick([1, 2, 3]), k0 = r.int(0, 7);
  const seq = [0, 1, 2, 3].map(i => dotInCircle(k0 + step * i));
  const a = k0 + step * 4;
  return { prompt: ABS_PROMPT, svg: seq, optionsSvg: true, options: options(dotInCircle(a), [dotInCircle(a + 1), dotInCircle(a - 1 + 8), dotInCircle(a + 4), dotInCircle(a + 2)]), explain: `El punto avanza ${step * 45}° en sentido horario en cada paso.` };
});
gen("ra.odd", r => {
  const n = r.int(3, 6);
  const odd = r.pick([n + 1, n - 1 < 3 ? n + 2 : n - 1]);
  const figs = [poly(odd), poly(n), poly(n), poly(n)];
  return { prompt: "¿Cuál figura es diferente a las demás?", optionsSvg: true, options: options(figs[0], [], 1).concat(figs.slice(1).map((f, i) => f.replace("<svg", `<svg data-k="${i}"`))), explain: `Tres figuras tienen ${n} lados; la diferente tiene ${odd}.` };
});
