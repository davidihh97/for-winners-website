import { gen, bank } from "../lib/sources.js";
import { options, fmt } from "../lib/rand.js";

const u = (v, unit) => `${fmt(v)} ${unit}`;
const alt = (v, unit, list) => list.map(x => u(x, unit));

gen("f.mru", r => {
  const kmh = r.pick([36, 54, 72, 90, 108, 18]), t = r.int(2, 30);
  const v = kmh / 3.6, d = v * t;
  return {
    prompt: `Un auto viaja a velocidad constante de ${kmh} km/h. ¿Qué distancia recorre en ${t} segundos?`,
    options: options(u(d, "m"), alt(d, "m", [kmh * t, d / 2, d + v * 2]), 4, k => u(d + k * 10, "m")),
    explain: `${kmh} km/h = ${fmt(v)} m/s. d = v·t = ${fmt(v)} × ${t} = ${fmt(d)} m.`,
  };
});

gen("f.speed", r => {
  const d = r.int(2, 30) * 10, t = r.pick([2, 4, 5, 10, 20]);
  const v = d / t;
  return {
    prompt: `Un ciclista recorre ${d} m en ${t} s con rapidez constante. ¿Cuál es su rapidez?`,
    options: options(u(v, "m/s"), alt(v, "m/s", [d * t, t / d, v * 2]), 4, k => u(v + k, "m/s")),
    explain: `v = d/t = ${d}/${t} = ${fmt(v)} m/s.`,
  };
});

gen("f.mruv", r => {
  const v0 = r.int(0, 10), a = r.int(1, 5), t = r.int(2, 8);
  const v = v0 + a * t;
  return {
    prompt: `Un móvil parte con ${v0} m/s y acelera a ${a} m/s². ¿Qué velocidad tendrá a los ${t} s?`,
    options: options(u(v, "m/s"), alt(v, "m/s", [a * t, v0 * t + a, v0 + a * t * t, v + a]), 4, k => u(v + k, "m/s")),
    explain: `v = v₀ + a·t = ${v0} + ${a}·${t} = ${v} m/s.`,
  };
});

gen("f.freefall", r => {
  const t = r.int(1, 6), h = 5 * t * t;
  return {
    prompt: `Se deja caer una piedra desde el reposo. Tomando g = 10 m/s², ¿qué distancia cae en ${t} s?`,
    options: options(u(h, "m"), alt(h, "m", [10 * t, 10 * t * t, 5 * t, h + 5]), 4, k => u(h + 5 * k, "m")),
    explain: `h = ½·g·t² = 5 × ${t}² = ${h} m.`,
  };
});

gen("f.newton", r => {
  const m = r.int(2, 50), a = r.int(1, 9);
  return {
    prompt: `¿Qué fuerza neta se necesita para que un cuerpo de ${m} kg acelere a ${a} m/s²?`,
    options: options(u(m * a, "N"), alt(m * a, "N", [m + a, m / a, m * a * 2]), 4, k => u(m * a + k * a, "N")),
    explain: `F = m·a = ${m} × ${a} = ${m * a} N.`,
  };
});

gen("f.weight", r => {
  const m = r.int(2, 90);
  return {
    prompt: `¿Cuál es el peso de una masa de ${m} kg? (usa g = 9,8 m/s²)`,
    options: options(u(m * 9.8, "N"), alt(0, "N", [m, m * 10 + 5, m / 9.8, m * 9.8 + 9.8]), 4, k => u(m * 9.8 + k * 2, "N")),
    explain: `P = m·g = ${m} × 9,8 = ${fmt(m * 9.8)} N.`,
  };
});

gen("f.energy", r => {
  const m = r.int(1, 10) * 2, v = r.int(2, 12);
  const e = 0.5 * m * v * v;
  return {
    prompt: `¿Cuál es la energía cinética de un objeto de ${m} kg que se mueve a ${v} m/s?`,
    options: options(u(e, "J"), alt(e, "J", [m * v, m * v * v, e / 2, 0.5 * m * v]), 4, k => u(e + k * 10, "J")),
    explain: `Ec = ½·m·v² = 0,5 × ${m} × ${v}² = ${fmt(e)} J.`,
  };
});

gen("f.potential", r => {
  const m = r.int(1, 20), h = r.int(2, 30);
  const e = m * 10 * h;
  return {
    prompt: `Un objeto de ${m} kg está a ${h} m de altura. Con g = 10 m/s², ¿cuál es su energía potencial?`,
    options: options(u(e, "J"), alt(e, "J", [m * h, e / 2, m * 10 + h]), 4, k => u(e + k * 10, "J")),
    explain: `Ep = m·g·h = ${m} × 10 × ${h} = ${e} J.`,
  };
});

gen("f.ohm", r => {
  const i = r.pick([0.5, 1, 1.5, 2, 3, 4]), R = r.int(2, 30) * 5;
  const kind = r.pick(["V", "I"]);
  if (kind === "V") return {
    prompt: `Por una resistencia de ${R} Ω circula una corriente de ${fmt(i)} A. ¿Cuál es el voltaje?`,
    options: options(u(i * R, "V"), alt(0, "V", [R / i, R + i, i * R * 2]), 4, k => u(i * R + k * 5, "V")),
    explain: `V = I·R = ${fmt(i)} × ${R} = ${fmt(i * R)} V.`,
  };
  const V = i * R;
  return {
    prompt: `Una resistencia de ${R} Ω se conecta a ${fmt(V)} V. ¿Qué corriente circula?`,
    options: options(u(i, "A"), alt(0, "A", [V * R, R / V, i * 2]), 4, k => u(i + k * 0.5, "A")),
    explain: `I = V/R = ${fmt(V)}/${R} = ${fmt(i)} A.`,
  };
});

gen("f.density", r => {
  const V = r.int(2, 20) * 10, rho = r.pick([0.8, 1, 2.7, 7.8, 11.3, 13.6]);
  const m = Math.round(rho * V * 10) / 10;
  return {
    prompt: `Un cuerpo de ${fmt(m)} g ocupa ${V} cm³. ¿Cuál es su densidad?`,
    options: options(u(rho, "g/cm³"), alt(0, "g/cm³", [V / m, m * V, rho * 10]), 4, k => u(rho + k * 0.5, "g/cm³")),
    explain: `ρ = m/V = ${fmt(m)}/${V} = ${fmt(rho)} g/cm³.`,
  };
});

gen("f.power", r => {
  const W = r.int(2, 40) * 100, t = r.pick([2, 4, 5, 10, 20]);
  return {
    prompt: `Una máquina realiza un trabajo de ${W} J en ${t} s. ¿Cuál es su potencia?`,
    options: options(u(W / t, "W"), alt(0, "W", [W * t, t / W, W / t / 2]), 4, k => u(W / t + k * 10, "W")),
    explain: `P = W/t = ${W}/${t} = ${fmt(W / t)} W.`,
  };
});

gen("f.units", r => {
  const kind = r.pick(["km", "h", "cm", "kg"]);
  if (kind === "km") { const v = r.int(2, 90) / 2; return { prompt: `¿Cuántos metros hay en ${fmt(v)} km?`, options: options(`${fmt(v * 1000)} m`, [`${fmt(v * 100)} m`, `${fmt(v * 10)} m`, `${fmt(v * 10000)} m`]), explain: "1 km = 1000 m." }; }
  if (kind === "h") { const v = r.int(1, 5); return { prompt: `¿Cuántos segundos hay en ${v} hora${v > 1 ? "s" : ""}?`, options: options(`${v * 3600} s`, [`${v * 60} s`, `${v * 360} s`, `${v * 6000} s`]), explain: "1 h = 60 min = 3600 s." }; }
  if (kind === "cm") { const v = r.int(1, 80) * 5; return { prompt: `${v} cm equivalen a:`, options: options(`${fmt(v / 100)} m`, [`${fmt(v / 10)} m`, `${fmt(v / 1000)} m`, `${fmt(v * 10)} m`]), explain: "1 m = 100 cm." }; }
  const v = r.int(1, 40) * 250; return { prompt: `${v} g equivalen a:`, options: options(`${fmt(v / 1000)} kg`, [`${fmt(v / 100)} kg`, `${fmt(v / 10)} kg`, `${fmt(v * 10)} kg`]), explain: "1 kg = 1000 g." };
});

bank("f.concepts", [
  { q: "La unidad de la fuerza en el Sistema Internacional es el:", o: ["Newton", "Joule", "Watt", "Pascal"] },
  { q: "La primera ley de Newton también se conoce como ley de:", o: ["Inercia", "Acción y reacción", "Gravitación", "Conservación de la energía"] },
  { q: "¿Qué magnitud es vectorial?", o: ["Velocidad", "Masa", "Temperatura", "Tiempo"] },
  { q: "La energía que posee un cuerpo por su movimiento se llama:", o: ["Cinética", "Potencial", "Térmica", "Química"] },
  { q: "Si la velocidad de un móvil es constante, su aceleración es:", o: ["Cero", "Constante y positiva", "Negativa", "Igual a la gravedad"] },
  { q: "La presión se define como:", o: ["Fuerza por unidad de área", "Masa por unidad de volumen", "Trabajo por unidad de tiempo", "Fuerza por distancia"] },
  { q: "En el vacío, una pluma y un martillo soltados a la vez:", o: ["Caen al mismo tiempo", "Cae primero el martillo", "Cae primero la pluma", "No caen"] },
  { q: "La unidad de la potencia es el:", o: ["Watt", "Newton", "Joule", "Ohmio"] },
  { q: "El sonido no se propaga en:", o: ["El vacío", "El agua", "El aire", "Los metales"] },
  { q: "Un material que conduce bien la electricidad es:", o: ["El cobre", "La madera", "El plástico", "El vidrio"] },
]);
