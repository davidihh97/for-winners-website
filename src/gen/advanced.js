// Generadores para los simuladores por facultad: estadística, matemática superior, física,
// emprendimiento, atención y concentración, módulo Yachay y razonamiento espacial.
import { gen } from "../lib/sources.js";
import { options, gcd, fmt } from "../lib/rand.js";

const near = (x, step = 1) => k => x + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step;
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const sum = a => a.reduce((x, y) => x + y, 0);
const sup = n => String(n).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).replace("-", "⁻");

// ================= ESTADÍSTICA =================
gen("st.mean", r => {
  const n = r.int(4, 7), m = r.int(5, 30);
  const vals = Array.from({ length: n - 1 }, () => m + r.int(-6, 6));
  vals.push(m * n - sum(vals));
  const ctx = r.pick(["las notas de un estudiante", "los minutos que tarda un bus en llegar", "las ventas diarias de una tienda (en dólares)", "las edades de un grupo"]);
  return { prompt: `Calcula la media aritmética de ${ctx}: ${r.shuffle(vals).join(", ")}`, options: options(m, [m + 1, m - 1, Math.max(...vals) - Math.min(...vals)], 4, near(m)), explain: `Suma ${m * n} ÷ ${n} datos = ${m}.` };
});
gen("st.median", r => {
  const n = r.pick([5, 6, 7, 8]);
  const vals = Array.from({ length: n }, () => r.int(1, 40));
  const s = vals.slice().sort((a, b) => a - b);
  const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const mean = sum(vals) / n;
  return { prompt: `Halla la mediana de los datos: ${vals.join(", ")}`, options: options(fmt(med), [fmt(mean), fmt(s[Math.floor(n / 2)] + 1), fmt(vals[Math.floor(n / 2)])], 4, k => fmt(med + k)), explain: `Ordenados: ${s.join(", ")}. ${n % 2 ? "El dato central" : "Promedio de los dos centrales"}: ${fmt(med)}.` };
});
gen("st.mode", r => {
  const m = r.int(2, 20);
  const others = r.sample([...Array(25).keys()].map(x => x + 1).filter(x => x !== m), 5);
  const vals = r.shuffle([m, m, m, others[0], others[0], others[1], others[2], others[3]]);
  return { prompt: `¿Cuál es la moda de los datos: ${vals.join(", ")}?`, options: options(m, [others[0], others[1], Math.round(sum(vals) / vals.length)]), explain: `${m} es el valor que más se repite (3 veces).` };
});
gen("st.var", r => {
  const [dev, v] = r.pick([[[-1, 1], 1], [[-3, 3], 9], [[-2, -2, 2, 2], 4], [[-4, -2, 2, 4], 10], [[-6, -2, 2, 6], 20], [[-5, -3, 3, 5], 17], [[-5, -1, 1, 5], 13], [[-2, 0, 2], 8 / 3]]);
  const m = r.int(4, 15);
  const data = dev.map(d => m + d);
  return { prompt: `Calcula la varianza poblacional de los datos: ${data.join(", ")}`, options: options(fmt(v), [fmt(Math.sqrt(v)), fmt((v * dev.length) / (dev.length - 1)), fmt(m)], 4, k => fmt(v + k)), explain: `Media ${m}; promedio de los cuadrados de las desviaciones = ${fmt(v)}.` };
});
gen("st.prob", r => {
  const kind = r.pick(["dado", "urna", "monedas"]);
  if (kind === "dado") {
    const [desc, fav] = r.pick([["un número primo", [2, 3, 5]], ["un múltiplo de 3", [3, 6]], ["un número menor que 3", [1, 2]], ["un número impar mayor que 1", [3, 5]], ["un número mayor que 4", [5, 6]]]);
    return { prompt: `Se lanza un dado de seis caras. ¿Cuál es la probabilidad de obtener ${desc}?`, options: options(frac(fav.length, 6), [frac(fav.length + 1, 6), frac(1, 6), frac(fav.length, 12)].filter(x => x !== frac(fav.length, 6)), 4, k => frac(k, 7)), explain: `Casos favorables: ${fav.join(", ")} → ${fav.length}/6.` };
  }
  if (kind === "urna") {
    const a = r.int(2, 8), b = r.int(2, 8), c = r.int(1, 6), tot = a + b + c;
    return { prompt: `Una urna tiene ${a} bolas rojas, ${b} azules y ${c} verdes. Si se saca una al azar, ¿cuál es la probabilidad de que NO sea azul?`, options: options(frac(a + c, tot), [frac(b, tot), frac(a, tot), frac(a + c, tot + 1)], 4, k => frac(a + c + k, tot)), explain: `No azul: ${a + c} de ${tot}.` };
  }
  const n = r.pick([2, 3]);
  return { prompt: `Se lanzan ${n} monedas. ¿Cuál es la probabilidad de obtener exactamente una cara?`, options: options(frac(n, 2 ** n), [frac(1, 2), frac(1, 2 ** n), frac(2 ** n - 1, 2 ** n)].filter(x => x !== frac(n, 2 ** n)), 4, k => frac(k, 8)), explain: `Hay ${2 ** n} resultados posibles y ${n} con una sola cara.` };
});
gen("st.freq", r => {
  const tot = r.pick([20, 25, 40, 50]), k = r.int(2, tot / 2);
  const p = (k / tot) * 100;
  const ctx = r.pick(["prefieren el fútbol", "llegan en bus", "aprobaron con más de 8", "tienen mascota"]);
  return { prompt: `En un grupo de ${tot} estudiantes, ${k} ${ctx}. ¿Qué porcentaje representan?`, options: options(`${fmt(p)} %`, [`${k} %`, `${fmt(100 - p)} %`, `${fmt(p / 2)} %`], 4, j => `${fmt(p + j * 5)} %`), explain: `${k}/${tot} × 100 = ${fmt(p)} %.` };
});
gen("st.class", r => {
  const kind = r.chance(0.5);
  if (kind) { const a = r.int(1, 12) * 5, w = a === 20 ? r.pick([4, 6, 20]) : r.pick([4, 6, 10, 20]); return { prompt: `En una tabla de frecuencias, ¿cuál es la marca de clase del intervalo [${a} ; ${a + w}[?`, options: options(a + w / 2, [a, a + w, w], 4, near(a + w / 2)), explain: `(${a} + ${a + w}) / 2 = ${a + w / 2}.` }; }
  const k = r.pick([5, 6, 7, 8]), w = r.pick([3, 4, 5, 6, 10]), mn = r.int(10, 40), mx = mn + k * w;
  return { prompt: `Los datos van de ${mn} a ${mx}. Si se agrupan en ${k} intervalos de igual amplitud, ¿cuál es la amplitud?`, options: options(w, [w + 1, mx - mn, k], 4, near(w)), explain: `Rango ${mx - mn} ÷ ${k} = ${w}.` };
});

// ================= MATEMÁTICA SUPERIOR =================
gen("ma.limInf", r => {
  const kind = r.pick(["same", "same", "lower", "higher"]);
  const n = r.int(2, 4), a = r.int(1, 9), b = r.int(1, 9), c = r.int(1, 9);
  if (kind === "same") return { prompt: `Calcula: lím (x→∞) (${a}x${sup(n)} − ${c}x) / (${b}x${sup(n)} + ${c})`, options: options(frac(a, b), [frac(b, a), "0", "∞", frac(a + c, b)].filter(x => x !== frac(a, b))), explain: `Mismo grado: cociente de coeficientes principales ${a}/${b}.` };
  if (kind === "lower") return { prompt: `Calcula: lím (x→∞) (${a}x${sup(n - 1)} + ${c}) / (${b}x${sup(n)} − 1)`, options: options("0", [frac(a, b), "∞", "1"].filter(x => x !== "0")), explain: "El grado del denominador es mayor: el límite es 0." };
  return { prompt: `Calcula: lím (x→∞) (${a}x${sup(n + 1)} − 1) / (${b}x${sup(n)} + ${c})`, options: options("∞", [frac(a, b), "0", "1"]), explain: "El grado del numerador es mayor: el límite tiende a infinito." };
});
gen("ma.limFactor", r => {
  const p = r.int(-6, 6);
  let q = r.int(-6, 6);
  if (q === p || (p === -2 && q === 2)) q = p + 3;
  const b = -(p + q), c = p * q;
  const poly = `x²${b ? (b > 0 ? ` + ${b}x` : ` − ${-b}x`) : ""}${c ? (c > 0 ? ` + ${c}` : ` − ${-c}`) : ""}`;
  const den = p >= 0 ? `x − ${p}` : `x + ${-p}`;
  return { prompt: `Calcula: lím (x→${p}) (${poly}) / (${den})`, options: options(p - q, [q - p, 0, "No existe", p + q], 4, near(p - q)), explain: `Factoriza: (x − ${p})(x − ${q}); simplifica y evalúa: ${p} − ${q} = ${p - q}.`.replace(/− -/g, "+ ") };
});
gen("ma.chain", r => {
  const a = r.int(2, 5), b = r.int(-4, 4) || 1, n = r.int(2, 4), x = r.int(0, 2);
  const inner = a * x + b, val = n * a * inner ** (n - 1);
  return { prompt: `Si f(x) = (${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})${sup(n)}, ¿cuánto vale f′(${x})?`, options: options(val, [n * inner ** (n - 1), a * inner ** n, n * a * inner ** n], 4, near(val, Math.max(1, Math.abs(a)))), explain: `Regla de la cadena: f′(x) = ${n}·${a}·(${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})${sup(n - 1)} → f′(${x}) = ${val}.` };
});
gen("ma.integral", r => {
  const n = r.int(1, 3), k = r.int(1, 3), a = (n + 1) * r.int(1, 3);
  const val = (a / (n + 1)) * k ** (n + 1);
  return { prompt: `Calcula la integral definida: ∫ de 0 a ${k} de ${a}x${n > 1 ? sup(n) : ""} dx`, options: options(fmt(val), [fmt(a * k ** n), fmt(a * n * k ** (n - 1)), fmt(val * 2)], 4, j => fmt(val + j)), explain: `Primitiva: ${frac(a, n + 1)}x${sup(n + 1)}. Evaluada de 0 a ${k}: ${fmt(val)}.` };
});
gen("ma.det", r => {
  const [a, b, c, d] = [r.int(-5, 6), r.int(-5, 6), r.int(-5, 6), r.int(-5, 6)];
  const v = a * d - b * c;
  return { prompt: `Calcula el determinante de la matriz  [ ${a}  ${b} ; ${c}  ${d} ]`, options: options(v, [a * d + b * c, b * c - a * d, a * b - c * d], 4, near(v)), explain: `det = (${a})(${d}) − (${b})(${c}) = ${v}.` };
});
gen("ma.line", r => {
  const x1 = r.int(-5, 3), y1 = r.int(-5, 5), dx = r.pick([1, 2, 3, 4]), m = r.pick([-3, -2, -1, 1, 2, 3]);
  const x2 = x1 + dx, y2 = y1 + m * dx;
  if (r.chance(0.5)) return { prompt: `¿Cuál es la pendiente de la recta que pasa por (${x1}, ${y1}) y (${x2}, ${y2})?`, options: options(m, [-m, frac(1, m), frac(-1, m)].filter(x => String(x) !== String(m)), 4, near(m)), explain: `m = (${y2} − ${y1}) / (${x2} − ${x1}) = ${m}.` };
  const mp = r.pick([-4, -3, -2, 2, 3, 4]);
  return { prompt: `Una recta tiene pendiente ${mp}. ¿Cuál es la pendiente de una recta perpendicular a ella?`, options: options(frac(-1, mp), [frac(1, mp), String(-mp), String(mp)]), explain: `Rectas perpendiculares: m₁ · m₂ = −1 → m₂ = ${frac(-1, mp)}.` };
});
gen("ma.logeq", r => {
  const b = r.pick([2, 3, 5]), k = r.int(1, 4), a = r.int(-3, 6);
  const x = b ** k - a;
  return { prompt: `Resuelve: log${String(b).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[d])}(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) = ${k}`, options: options(`x = ${x}`, [`x = ${b * k - a}`, `x = ${b ** k + a}`, `x = ${k - a}`], 4, j => `x = ${x + j}`), explain: `x ${a < 0 ? "−" : "+"} ${Math.abs(a)} = ${b}${sup(k)} = ${b ** k} → x = ${x}.` };
});
gen("ma.ineq", r => {
  const a = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]), x0 = r.int(1, 6) * r.pick([1, -1]), b = r.int(-9, 9);
  const c = a * x0 + b, ge = r.chance(0.5);
  const sol = (a > 0) === ge ? `x ≥ ${x0}` : `x ≤ ${x0}`;
  const flip = sol.includes("≥") ? sol.replace("≥", "≤") : sol.replace("≤", "≥");
  return { prompt: `Resuelve la inecuación: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} ${ge ? "≥" : "≤"} ${c}`, options: options(sol, [flip, sol.replace(String(x0), String(-x0)), flip.replace(String(x0), String(-x0))]), explain: `Despeja x${a < 0 ? "; al dividir para un número negativo, el sentido de la desigualdad se invierte" : ""}: ${sol}.` };
});
gen("ma.pyth", r => {
  const [p, q, h] = r.pick([[3, 4, 5], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);
  const ctx = r.pick(["Una escalera", "Un cable tensor", "Una rampa"]);
  return { prompt: `${ctx} de ${h} m une el suelo con una pared. Si su base está a ${p} m de la pared, ¿a qué altura toca la pared?`, options: options(`${q} m`, [`${h - p} m`, `${h + p} m`, `${fmt(Math.sqrt(h * h + p * p))} m`]), explain: `√(${h}² − ${p}²) = √${h * h - p * p} = ${q} m.` };
});
gen("ma.seq", r => {
  if (r.chance(0.5)) {
    const a = r.int(-5, 12), d = a === 7 ? r.pick([2, 3, 5, 6, -3]) : r.pick([2, 3, 4, 5, 6, -3]), n = r.int(10, 30);
    const v = a + (n - 1) * d;
    return { prompt: `En la progresión aritmética ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, …, ¿cuál es el término ${n}?`, options: options(v, [a + n * d, v - d, n * d], 4, near(v, Math.abs(d))), explain: `aₙ = a₁ + (n − 1)d = ${a} + ${n - 1}·${d} = ${v}.` };
  }
  const a = r.int(1, 5), q = r.pick([2, 3]), n = a === 3 && q === 2 ? 5 : r.int(4, 6);
  const S = (a * (q ** n - 1)) / (q - 1);
  return { prompt: `¿Cuál es la suma de los ${n} primeros términos de la progresión ${a}, ${a * q}, ${a * q * q}, …?`, options: options(S, [a * q ** (n - 1), a * q ** n, S - a], 4, near(S, a)), explain: `Sₙ = a₁(qⁿ − 1)/(q − 1) = ${S}.` };
});
gen("ma.sets", r => {
  if (r.chance(0.5)) {
    const n = r.pick([3, 5, 6]), letters = "abcdefgh".slice(0, n).split("").join(", ");
    return { prompt: `¿Cuántos subconjuntos tiene el conjunto {${letters}}?`, options: options(2 ** n, [n * 2, n ** 2, 2 ** n - 1]), explain: `Un conjunto de ${n} elementos tiene 2${sup(n)} = ${2 ** n} subconjuntos.` };
  }
  const [p, q] = r.pick([["llueve", "el suelo se moja"], ["practico", "gano"], ["entreno", "mejoro"], ["ahorro", "viajo"]]);
  return { prompt: `¿Cuál es la contrarrecíproca de «Si ${p}, entonces ${q}»?`, options: options(`Si no ${q}, entonces no ${p}`, [`Si ${q}, entonces ${p}`, `Si no ${p}, entonces no ${q}`, `${p[0].toUpperCase() + p.slice(1)} y no ${q}`]), explain: "La contrarrecíproca de p → q es ¬q → ¬p, y es equivalente a la original." };
});
gen("ma.solid", r => {
  const kind = r.pick(["cyl", "cube", "circle"]);
  if (kind === "cyl") { const rad = r.int(1, 5), h = r.int(2, 10); return { prompt: `¿Cuál es el volumen de un cilindro de radio ${rad} cm y altura ${h} cm?`, options: options(`${rad * rad * h}π cm³`, [`${2 * rad * h}π cm³`, `${rad * h}π cm³`, `${rad * rad * h * 2}π cm³`]), explain: `V = πr²h = π·${rad}²·${h} = ${rad * rad * h}π cm³.` }; }
  if (kind === "cube") { const k = r.pick([3, 4]); return { prompt: `Si la arista de un cubo se multiplica por ${k}, su volumen queda multiplicado por:`, options: options(k ** 3, [k, k * k, 3 * k]), explain: `El volumen depende del cubo de la arista: ${k}³ = ${k ** 3}.` }; }
  const d = r.int(2, 10) * 2; return { prompt: `¿Cuál es el área de un círculo de ${d} cm de diámetro?`, options: options(`${(d / 2) ** 2}π cm²`, [`${d * d}π cm²`, `${d}π cm²`, `${d / 2}π cm²`]), explain: `r = ${d / 2}; A = πr² = ${(d / 2) ** 2}π cm².` };
});

// ================= FÍSICA (complementos) =================
gen("fx.vertical", r => {
  const v = r.pick([10, 20, 40, 50, 60]);
  if (r.chance(0.5)) return { prompt: `Se lanza un objeto verticalmente hacia arriba a ${v} m/s. Con g = 10 m/s², ¿cuánto tiempo tarda en llegar a su altura máxima?`, options: options(`${v / 10} s`, [`${v / 5} s`, `${v} s`, `${v / 20} s`]), explain: `t = v₀/g = ${v}/10 = ${v / 10} s.` };
  return { prompt: `Se lanza un objeto verticalmente hacia arriba a ${v} m/s. Con g = 10 m/s², ¿qué altura máxima alcanza?`, options: options(`${(v * v) / 20} m`, [`${(v * v) / 10} m`, `${v * 2} m`, `${v} m`]), explain: `h = v₀²/(2g) = ${v * v}/20 = ${(v * v) / 20} m.` };
});
gen("fx.circular", r => {
  const n = r.pick([10, 20, 30, 60, 120, 240]), t = r.pick([2, 5, 10, 20, 30, 60]);
  if (r.chance(0.5)) return { prompt: `Una rueda da ${n} vueltas en ${t} s. ¿Cuál es su frecuencia?`, options: options(`${fmt(n / t)} Hz`, [`${fmt(t / n)} Hz`, `${n * t} Hz`, `${fmt(n / t / 2)} Hz`]), explain: `f = vueltas/tiempo = ${n}/${t} = ${fmt(n / t)} Hz.` };
  return { prompt: `Una rueda da ${n} vueltas en ${t} s. ¿Cuál es su período?`, options: options(`${fmt(t / n)} s`, [`${fmt(n / t)} s`, `${n * t} s`, `${fmt((t / n) * 2)} s`]), explain: `T = tiempo/vueltas = ${t}/${n} = ${fmt(t / n)} s.` };
});
gen("fx.sci", r => {
  const m = r.int(11, 99) / 10, e = r.pick([-6, -5, -4, -3, 3, 4, 5, 6]);
  const s = e < 0 ? "0," + "0".repeat(-e - 1) + String(m).replace(".", "") : String(Math.round(m * 10 ** e));
  const f = x => `${fmt(m)} × 10${sup(x)}`;
  return { prompt: `Expresa en notación científica: ${s.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}${e < 0 ? " m" : " m"}`, options: options(f(e) + " m", [f(-e) + " m", f(e + 1) + " m", f(e - 1) + " m"]), explain: `Se recorre la coma ${Math.abs(e)} lugares: ${f(e)} m.` };
});
gen("fx.work", r => {
  const F = r.int(2, 20) * 10, d = r.int(2, 12), ang = r.pick([0, 60, 90]);
  const c = { 0: 1, 60: 0.5, 90: 0 }[ang];
  return { prompt: `Una fuerza de ${F} N forma un ángulo de ${ang}° con el desplazamiento y mueve un cuerpo ${d} m. ¿Qué trabajo realiza? (cos 60° = 0,5)`, options: options(`${fmt(F * d * c)} J`, [`${F * d} J`, `${fmt(F * d * 0.5)} J`, `${F + d} J`, "0 J"]), explain: `W = F·d·cos θ = ${F}·${d}·${c} = ${fmt(F * d * c)} J.` };
});
gen("fx.impulse", r => {
  const m = r.int(2, 20) * 100, v = r.pick([10, 20, 30]), t = r.pick([2, 4, 5, 10]);
  const F = (m * v) / t;
  return { prompt: `Un vehículo de ${m} kg que va a ${v} m/s frena hasta detenerse en ${t} s. ¿Qué fuerza promedio actúa sobre él?`, options: options(`${fmt(F)} N`, [`${m * v * t} N`, `${fmt((m * t) / v)} N`, `${fmt(F / 2)} N`]), explain: `F = m·Δv/t = ${m}·${v}/${t} = ${fmt(F)} N.` };
});

// ================= EMPRENDIMIENTO (cálculos) =================
const BIZ = ["una pastelería", "un taller de bicicletas", "una tienda de artesanías", "un emprendimiento de jugos", "una imprenta pequeña"];
gen("em.calc", r => {
  const kind = r.pick(["eq", "profit", "markup", "prod", "prime"]);
  const biz = r.pick(BIZ);
  if (kind === "eq") { const P = r.int(8, 30), cv = r.int(2, P - 3), q = (P === 15 && cv === 9 ? r.int(5, 15) : r.int(5, 40)) * 5, CF = q * (P - cv); return { prompt: `En ${biz}, los costos fijos son $${CF} al mes; cada producto se vende a $${P} y su costo variable es $${cv}. ¿Cuántas unidades debe vender para alcanzar el punto de equilibrio?`, options: options(q, [Math.round(CF / P), Math.round(CF / cv), q + 10], 4, near(q, 5)), explain: `Q = CF / (P − CVu) = ${CF} / ${P - cv} = ${q}.` }; }
  if (kind === "profit") { const n = r.int(50, 400), p = r.int(2, 15), c = r.int(1000, 3000) + (r.int(0, 1) ? 3 : 7); const u = n * p - c; return { prompt: `${biz[0].toUpperCase() + biz.slice(1)} vendió ${n} unidades a $${p} y sus costos totales fueron $${c}. ¿Cuál fue su utilidad?`, options: options(`$${u}`, [`$${n * p}`, `$${c - n}`, `$${u + p}`], 4, k => `$${u + k * 10}`), explain: `Ingresos ${n}·${p} = $${n * p}; utilidad = $${n * p} − $${c} = $${u}.` }; }
  if (kind === "markup") { const cost = r.int(4, 40), pct = cost === 8 ? r.pick([10, 20, 40, 50]) : r.pick([10, 20, 25, 40, 50]); const price = cost * (1 + pct / 100); return { prompt: `El costo unitario de un producto es $${cost} y se quiere ganar un ${pct} % sobre el costo. ¿Cuál debe ser el precio de venta?`, options: options(`$${fmt(price)}`, [`$${cost + pct}`, `$${fmt(cost * pct / 100)}`, `$${fmt(cost / (1 - pct / 100))}`], 4, k => `$${fmt(price + k)}`), explain: `Precio = ${cost} × ${fmt(1 + pct / 100)} = $${fmt(price)}.` }; }
  if (kind === "prod") { const w = r.pick([2, 3, 4, 5]), h = r.pick([4, 5, 6, 8]), per = r.int(2, 9); const units = w * h * per; return { prompt: `En ${biz}, ${w} trabajadores producen ${units} unidades en una jornada de ${h} horas. ¿Cuál es la productividad por hora-trabajador?`, options: options(`${per} unidades`, [`${units / w} unidades`, `${units / h} unidades`, `${units} unidades`]), explain: `${units} / (${w} × ${h}) = ${per} unidades.` }; }
  const mp = r.int(5, 30) * 10 + 5, mod = r.int(3, 20) * 10, cif = r.int(2, 10) * 10;
  return { prompt: `Para fabricar un lote, ${biz} gasta $${mp} en materia prima, $${mod} en mano de obra directa y $${cif} en costos indirectos. ¿Cuál es el costo de producción total?`, options: options(`$${mp + mod + cif}`, [`$${mp + mod}`, `$${mp + cif}`, `$${mod + cif}`]), explain: `MP + MOD + CIF = $${mp + mod + cif}.` };
});

// ================= ATENCIÓN Y CONCENTRACIÓN =================
gen("at.letters", r => {
  const [t, alts] = r.pick([["b", ["d", "p", "q"]], ["m", ["n", "w", "u"]], ["p", ["q", "b", "d"]], ["e", ["c", "o", "a"]]]);
  const n = r.int(22, 30), k = r.int(7, 15);
  const arr = r.shuffle([...Array(k).fill(t), ...Array.from({ length: n - k }, () => r.pick(alts))]);
  return { prompt: `¿Cuántas veces aparece la letra «${t}»?\n${arr.join(" ")}`, options: options(k, [k + 1, k - 1, k + 2], 4, near(k)), explain: `Aparece ${k} veces.` };
});
gen("at.digits", r => {
  const d = r.int(1, 9), confuse = { 1: 7, 6: 9, 9: 6, 3: 8, 8: 3, 5: 6, 2: 5, 4: 9, 7: 1 }[d];
  const groups = Array.from({ length: 7 }, () => Array.from({ length: 4 }, () => (r.chance(0.4) ? d : r.chance(0.5) ? confuse : r.int(0, 9))).join(""));
  const k = groups.join("").split("").filter(c => +c === d).length;
  return { prompt: `¿Cuántas veces aparece el dígito ${d}?\n${groups.join("  ")}`, options: options(k, [k + 1, k - 1, k + 2], 4, near(k)), explain: `El dígito ${d} aparece ${k} veces.` };
});
const SURN = ["Benavides", "Cevallos", "Guerrón", "Imbaquingo", "Montalvo", "Narváez", "Paredes", "Pozo", "Rosero", "Vinueza", "Yépez", "Chalá", "Andrango", "Cuasapaz"];
gen("at.pairs", r => {
  const nums = r.chance(0.5);
  const rows = [], n = 7;
  let same = 0;
  for (let i = 0; i < n; i++) {
    const a = nums ? String(r.int(10000, 999999)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : `${r.pick(SURN)} ${r.pick(SURN)}`;
    let b = a;
    if (r.chance(0.45)) {
      const s = a.split("");
      const idx = s.map((c, j) => (/[0-9a-záéíóú]/i.test(c) ? j : -1)).filter(j => j > 0);
      const j = r.pick(idx);
      if (nums) { const k = idx[idx.indexOf(j) + 1] ?? idx[idx.indexOf(j) - 1]; [s[j], s[k]] = [s[k], s[j]]; }
      else { const map = { á: "a", é: "e", í: "i", ó: "o", ú: "u", a: "e", e: "a", o: "u", i: "y", n: "m", r: "rr" }; s[j] = map[s[j]] || s[j] + s[j]; }
      b = s.join("");
    }
    if (a === b) same++;
    rows.push(`${a}  |  ${b}`);
  }
  return { prompt: `¿Cuántos pares son EXACTAMENTE iguales${nums ? "" : " (incluidas las tildes)"}?\n${rows.join("\n")}`, options: options(same, [same + 1, same - 1 < 0 ? same + 2 : same - 1, same + 2], 4, near(same)), explain: `Hay ${same} pares idénticos.` };
});

// ================= RAZONAMIENTO ESPACIAL =================
gen("re.paint", r => {
  const n = r.pick([3, 5, 6]), kind = r.pick([3, 2, 1, 0]);
  const val = { 3: 8, 2: 12 * (n - 2), 1: 6 * (n - 2) ** 2, 0: (n - 2) ** 3 }[kind];
  const txt = { 3: "exactamente tres caras pintadas", 2: "exactamente dos caras pintadas", 1: "exactamente una cara pintada", 0: "ninguna cara pintada" }[kind];
  return { prompt: `Un cubo de ${n} × ${n} × ${n} formado por cubitos iguales se pinta por fuera. ¿Cuántos cubitos tienen ${txt}?`, options: options(val, [8, 12 * (n - 2), 6 * (n - 2) ** 2, (n - 2) ** 3, n ** 3].filter(x => x !== val), 4, near(val)), explain: { 3: "Solo los 8 vértices tienen tres caras pintadas.", 2: `Las aristas sin vértices: 12 × (${n} − 2) = ${val}.`, 1: `El centro de cada cara: 6 × (${n} − 2)² = ${val}.`, 0: `El interior: (${n} − 2)³ = ${val}.` }[kind] };
});

const SYM = {
  "Círculo": '<circle cx="0" cy="0" r="11" fill="currentColor"/>',
  "Cuadrado": '<rect x="-10" y="-10" width="20" height="20" fill="currentColor"/>',
  "Triángulo": '<polygon points="0,-12 11,9 -11,9" fill="currentColor"/>',
  "Estrella": '<polygon points="0,-12 3,-4 12,-4 5,2 7,11 0,6 -7,11 -5,2 -12,-4 -3,-4" fill="currentColor"/>',
  "Cruz": '<path d="M-4,-12h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="currentColor"/>',
  "Rombo": '<polygon points="0,-13 10,0 0,13 -10,0" fill="currentColor"/>',
};
gen("re.net", r => {
  // Tira de 4 caras + una arriba (columna a) + una abajo (columna b): forma siempre un cubo.
  let a = r.int(0, 3), b = r.int(0, 3);
  const vertical = r.chance(0.5);
  if (!vertical && ((a === 1 && b === 1) || (a === 0 && b === 3))) b = 2; // distinto a los desarrollos del material de curso
  const cells = [[a, 0], [0, 1], [1, 1], [2, 1], [3, 1], [b, 2]];
  const names = r.shuffle(Object.keys(SYM));
  const opp = [[1, 3], [2, 4], [0, 5]];
  const q = r.int(0, 5);
  const pair = opp.find(p => p.includes(q));
  const ans = names[pair[0] === q ? pair[1] : pair[0]];
  const C = 34;
  const body = cells.map(([x, y], i) => { const [cx, cy] = vertical ? [y, x] : [x, y]; return `<g transform="translate(${cx * C} ${cy * C})"><rect width="${C}" height="${C}" fill="none" stroke="currentColor" stroke-width="1.5"/><g transform="translate(${C / 2} ${C / 2})">${SYM[names[i]]}</g></g>`; }).join("");
  const [w, h] = vertical ? [3 * C, 4 * C] : [4 * C, 3 * C];
  const figure = `<svg viewBox="-2 -2 ${w + 4} ${h + 4}" width="${w + 4}" height="${h + 4}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  return { prompt: `Al armar un cubo con este desarrollo, ¿qué figura queda en la cara opuesta a: ${names[q].toLowerCase()}?`, figure, options: options(ans, names.filter(n => n !== ans && n !== names[q])), explain: "En una tira de cuatro caras, las caras alternas quedan opuestas; la cara de arriba es opuesta a la de abajo." };
});

// ================= NÚMEROS ROMANOS (verbal FECYT) =================
const toRoman = n => [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].reduce((s, [v, l]) => { while (n >= v) { s += l; n -= v; } return s; }, "");
gen("vb.roman", r => {
  let n = r.chance(0.5) ? r.int(40, 999) : r.int(1500, 2100);
  if (n === 444 || n === 1999) n += 3;
  const R = toRoman(n);
  const wrong = [n + 10, n - 1, n + 100, n + 4, n - 40].filter(x => x > 0 && toRoman(x) !== R);
  if (r.chance(0.5)) return { prompt: `¿Qué número representa ${R}?`, options: options(n, wrong.slice(0, 3)), explain: `${R} = ${n}.` };
  return { prompt: `¿Cómo se escribe ${n} en números romanos?`, options: options(R, wrong.map(toRoman).slice(0, 3)), explain: `${n} = ${R}.` };
});
