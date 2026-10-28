import { gen, bank } from "../lib/sources.js";
import { options, gcd, fmt } from "../lib/rand.js";

const near = (x, spread = 5) => k => x + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * Math.max(1, Math.round(spread / 3));
const frac = (n, d) => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  return d === 1 ? String(n) : `${n}/${d}`;
};

// ---------- Escuela (EGB) ----------
gen("m.ops", r => {
  const a = r.int(2, 30), b = r.int(2, 9), c = r.int(2, 9), d = r.int(1, 20);
  const ans = a + b * c - d;
  return {
    prompt: `Calcula: ${a} + ${b} × ${c} − ${d}`,
    options: options(ans, [(a + b) * c - d, a + b * c + d, a + b + c - d], 4, near(ans)),
    explain: `Primero la multiplicación: ${b} × ${c} = ${b * c}. Luego ${a} + ${b * c} − ${d} = ${ans}.`,
  };
});

gen("m.frac", r => {
  const d1 = r.pick([2, 3, 4, 5, 6, 8]), d2 = r.pick([2, 3, 4, 5, 6, 8].filter(x => x !== d1));
  const n1 = r.int(1, d1 - 1) || 1, n2 = r.int(1, d2 - 1) || 1;
  const sub = r.chance(0.35);
  const num = sub ? n1 * d2 - n2 * d1 : n1 * d2 + n2 * d1, den = d1 * d2;
  const ans = frac(num, den);
  return {
    prompt: `Resuelve: ${n1}/${d1} ${sub ? "−" : "+"} ${n2}/${d2}`,
    options: options(ans, [frac(sub ? n1 - n2 : n1 + n2, d1 + d2), frac(sub ? n1 - n2 : n1 + n2, d1 * d2), frac(num + d1, den), frac(num, den + d2)], 4, k => frac(num + k, den)),
    explain: `Común denominador ${den}: (${n1 * d2} ${sub ? "−" : "+"} ${n2 * d1})/${den} = ${ans}.`,
  };
});

gen("m.percent", r => {
  const p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 75]);
  const base = r.int(2, 40) * 20;
  const ans = (p * base) / 100;
  return {
    prompt: `¿Cuál es el ${p} % de ${base}?`,
    options: options(fmt(ans), [fmt(ans * 2), fmt(ans / 2), fmt(base - ans), fmt(ans + 10)], 4, k => fmt(ans + k * 5)),
    explain: `${p} % de ${base} = ${base} × ${p}/100 = ${fmt(ans)}.`,
  };
});

gen("m.area", r => {
  const kind = r.pick(["rect", "tri", "square"]);
  if (kind === "rect") {
    const a = r.int(3, 20), b = r.int(2, 15);
    return { prompt: `Un terreno rectangular mide ${a} m de largo y ${b} m de ancho. ¿Cuál es su área?`, options: options(`${a * b} m²`, [`${2 * (a + b)} m²`, `${a + b} m²`, `${a * b * 2} m²`]), explain: `Área = largo × ancho = ${a} × ${b} = ${a * b} m².` };
  }
  if (kind === "tri") {
    const b = r.int(2, 12) * 2, h = r.int(3, 15);
    return { prompt: `Un triángulo tiene base ${b} cm y altura ${h} cm. ¿Cuál es su área?`, options: options(`${(b * h) / 2} cm²`, [`${b * h} cm²`, `${b + h} cm²`, `${(b * h) / 2 + h} cm²`]), explain: `Área = (base × altura)/2 = (${b} × ${h})/2 = ${(b * h) / 2} cm².` };
  }
  const l = r.int(3, 25);
  return { prompt: `El perímetro de un cuadrado es ${4 * l} cm. ¿Cuál es su área?`, options: options(`${l * l} cm²`, [`${4 * l} cm²`, `${l * 2} cm²`, `${(4 * l) ** 2} cm²`]), explain: `Lado = ${4 * l}/4 = ${l} cm; área = ${l}² = ${l * l} cm².` };
});

gen("m.problem", r => {
  const item = r.pick(["cuadernos", "lápices", "panes", "boletos"]);
  const n = r.int(3, 9), price = r.int(2, 9) * 0.25, pay = Math.ceil((n * price) / 5) * 5 + r.pick([0, 5]);
  const total = n * price, change = pay - total;
  return {
    prompt: `Compras ${n} ${item} a $${fmt(price)} cada uno y pagas con $${pay}. ¿Cuánto te dan de vuelto?`,
    options: options(`$${fmt(change)}`, [`$${fmt(total)}`, `$${fmt(change + price)}`, `$${fmt(change - price)}`], 4, k => `$${fmt(change + k * 0.5)}`),
    explain: `Gasto: ${n} × $${fmt(price)} = $${fmt(total)}. Vuelto: $${pay} − $${fmt(total)} = $${fmt(change)}.`,
  };
});

// ---------- Bachillerato ----------
gen("m.eq1", r => {
  const x = r.int(-9, 12), a = r.pick([2, 3, 4, 5, 6, 7]), b = r.int(-15, 20);
  const c = a * x + b;
  const bs = b < 0 ? `− ${-b}` : `+ ${b}`;
  return {
    prompt: `Resuelve la ecuación: ${a}x ${bs} = ${c}`,
    options: options(`x = ${x}`, [`x = ${-x}`, `x = ${x + 1}`, `x = ${fmt((c + b) / a)}`, `x = ${c - b}`], 4, k => `x = ${x + k + 1}`),
    explain: `${a}x = ${c} ${b < 0 ? "+ " + -b : "− " + b} = ${c - b}; x = ${c - b}/${a} = ${x}.`,
  };
});

gen("m.powers", r => {
  const base = r.pick([2, 3, 5, 10, "a", "x"]), m = r.int(2, 9), n = r.int(2, 9), p = r.int(1, 6);
  const k = m + n - p;
  return {
    prompt: `Simplifica: (${base}^${m} · ${base}^${n}) ÷ ${base}^${p}`,
    options: options(`${base}^${k}`, [`${base}^${m * n - p}`, `${base}^${m + n + p}`, `${base}^${(m * n) / p | 0 || 1}`, `${base}^${m - n + p}`], 4, j => `${base}^${k + j}`),
    explain: `Producto de igual base: se suman exponentes (${m}+${n}); cociente: se restan (−${p}). Resultado ${base}^${k}.`,
  };
});

gen("m.func", r => {
  const a = r.int(1, 4), b = r.int(-6, 6), c = r.int(-9, 9), x = r.int(-4, 4);
  const v = a * x * x + b * x + c;
  const term = (k, s) => (k === 0 ? "" : `${k < 0 ? " − " : " + "}${Math.abs(k) === 1 && s ? "" : Math.abs(k)}${s}`);
  return {
    prompt: `Si f(x) = ${a === 1 ? "" : a}x²${term(b, "x")}${term(c, "")}, ¿cuánto vale f(${x})?`,
    options: options(v, [a * x * x - b * x + c, -a * x * x + b * x + c, a * x * 2 + b * x + c], 4, near(v, 4)),
    explain: `f(${x}) = ${a}(${x})² + (${b})(${x}) + (${c}) = ${v}.`,
  };
});

gen("m.system", r => {
  const x = r.int(-5, 8), y = r.int(-5, 8);
  const a = r.int(1, 4), b = r.int(1, 4), c = r.int(1, 4), d = -r.int(1, 4);
  const e = a * x + b * y, f = c * x + d * y;
  const t = (k, s, first) => `${k < 0 ? (first ? "−" : " − ") : first ? "" : " + "}${Math.abs(k) === 1 ? "" : Math.abs(k)}${s}`;
  return {
    prompt: `Resuelve el sistema:  ${t(a, "x", 1)}${t(b, "y")} = ${e}  ;  ${t(c, "x", 1)}${t(d, "y")} = ${f}`,
    options: options(`x = ${x}, y = ${y}`, [`x = ${y}, y = ${x}`, `x = ${-x}, y = ${y}`, `x = ${x + 1}, y = ${y - 1}`, `x = ${x}, y = ${-y}`], 4, k => `x = ${x + k}, y = ${y + k}`),
    explain: `Sustituyendo x = ${x}, y = ${y} se cumplen ambas ecuaciones.`,
  };
});

// ---------- Universidad ----------
gen("m.quad", r => {
  const r1 = r.int(-7, 7), r2 = r.int(-7, 7);
  const s = r1 + r2, p = r1 * r2;
  const bs = s === 0 ? "" : ` ${-s < 0 ? "−" : "+"} ${Math.abs(s) === 1 ? "" : Math.abs(s)}x`;
  const cs = p === 0 ? "" : ` ${p < 0 ? "−" : "+"} ${Math.abs(p)}`;
  const fmtR = (u, v) => (u === v ? `x = ${u} (doble)` : `x₁ = ${Math.min(u, v)}, x₂ = ${Math.max(u, v)}`);
  return {
    prompt: `Encuentra las raíces de: x²${bs}${cs} = 0`,
    options: options(fmtR(r1, r2), [fmtR(-r1, -r2), fmtR(r1, -r2), fmtR(r1 + 1, r2 - 1), fmtR(-r1, r2)], 4, k => fmtR(r1 + k, r2 + k)),
    explain: `Buscamos dos números que sumen ${s} y multipliquen ${p}: ${r1} y ${r2}.`,
  };
});

gen("m.deriv", r => {
  const a = r.int(1, 6), n = r.int(2, 5), b = r.int(1, 9), x = r.int(1, 3);
  const v = a * n * x ** (n - 1) + b;
  return {
    prompt: `Si f(x) = ${a === 1 ? "" : a}x^${n} + ${b}x, ¿cuánto vale f′(${x})?`,
    options: options(v, [a * x ** n + b * x, a * n * x ** n + b, a * (n - 1) * x ** (n - 1) + b], 4, near(v, 6)),
    explain: `f′(x) = ${a * n}x^${n - 1} + ${b}; f′(${x}) = ${v}.`,
  };
});

gen("m.log", r => {
  const b = r.pick([2, 3, 5, 10]), m = r.int(1, 4), n = r.int(1, 3);
  const ans = m + n;
  return {
    prompt: `Calcula: log${sub(b)}(${b ** m}) + log${sub(b)}(${b ** n})`,
    options: options(ans, [m * n, b ** m + b ** n, ans + 1, Math.abs(m - n)], 4, near(ans)),
    explain: `log${sub(b)}(${b ** m}) = ${m} y log${sub(b)}(${b ** n}) = ${n}; la suma es ${ans}.`,
  };
});
function sub(n) { return String(n).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[d]); }

gen("m.trig", r => {
  const [ang, s, c, t] = r.pick([[30, "1/2", "√3/2", "√3/3"], [45, "√2/2", "√2/2", "1"], [60, "√3/2", "1/2", "√3"]]);
  const f = r.pick(["sen", "cos", "tan"]);
  const ans = { sen: s, cos: c, tan: t }[f];
  return { prompt: `¿Cuál es el valor de ${f}(${ang}°)?`, options: options(ans, ["1/2", "√3/2", "√2/2", "√3", "1", "0"].filter(x => x !== ans), 4), explain: `Valor notable: ${f}(${ang}°) = ${ans}.` };
});

bank("m.concepts", [
  { q: "¿Cuál de estos números es primo?", o: ["29", "21", "27", "33"] },
  { q: "El mínimo común múltiplo de 4 y 6 es:", o: ["12", "24", "2", "10"] },
  { q: "¿Cuántos grados suman los ángulos internos de un triángulo?", o: ["180°", "360°", "90°", "270°"] },
  { q: "La pendiente de la recta y = −3x + 5 es:", o: ["−3", "5", "3", "−5"] },
  { q: "¿Cuál es el valor de 0,25 expresado como fracción?", o: ["1/4", "1/25", "2/5", "25/10"] },
  { q: "La raíz cuadrada de 144 es:", o: ["12", "14", "72", "16"] },
  { q: "Un ángulo de 90° se llama:", o: ["Recto", "Agudo", "Obtuso", "Llano"] },
  { q: "¿Cuál es el resultado de (−2)³?", o: ["−8", "8", "−6", "6"] },
  { q: "El volumen de un cubo de arista 3 cm es:", o: ["27 cm³", "9 cm³", "18 cm³", "12 cm³"] },
  { q: "Si a = 3 y b = −2, el valor de a² − b² es:", o: ["5", "13", "1", "−5"] },
]);
