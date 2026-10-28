// Series gráficas y razonamiento espacial (figuras SVG generadas: cada intento es distinto).
import { gen } from "../lib/sources.js";
import { options } from "../lib/rand.js";

const svg = (inner, w = 64, h = 64) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${inner}</svg>`;
const frame = '<rect x="2" y="2" width="60" height="60" rx="8" stroke-width="1.2" opacity=".35"/>';
const SEQ = "¿Qué figura continúa la serie?";

// ---------- figuras básicas ----------
function shapeAt(kind, cx, cy, r, fillMode) {
  const f = fillMode === "solid" ? 'fill="currentColor"' : fillMode === "half" ? 'fill="currentColor" fill-opacity=".35"' : "";
  if (kind === "circle") return `<circle cx="${cx}" cy="${cy}" r="${r}" ${f}/>`;
  if (kind === "square") return `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" ${f}/>`;
  if (kind === "triangle") return `<polygon points="${cx},${cy - r} ${cx + r},${cy + r * 0.85} ${cx - r},${cy + r * 0.85}" ${f}/>`;
  if (kind === "diamond") return `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" ${f}/>`;
  return `<path d="M${cx - r} ${cy}h${2 * r}M${cx} ${cy - r}v${2 * r}" stroke-width="3.5"/>`; // cruz
}
const SHAPES = ["circle", "square", "triangle", "diamond", "cross"];
const POS = { 1: [[32, 32]], 2: [[21, 32], [43, 32]], 3: [[32, 18], [20, 42], [44, 42]], 4: [[21, 21], [43, 21], [21, 43], [43, 43]] };
const groupFig = (kind, n, fillMode = "none") => svg(frame + POS[n].map(([x, y]) => shapeAt(kind, x, y, n === 1 ? 13 : 8, fillMode)).join(""));

// ---------- 1. Matriz 3 × 3 (tipo Raven) ----------
gen("ra.matrix", r => {
  const shapes = r.sample(SHAPES.slice(0, 4), 3);
  const variant = r.pick(["count", "fill"]);
  const counts = r.chance(0.5) ? [1, 2, 3] : [2, 3, 4];
  const fills = r.shuffle(["none", "half", "solid"]);
  const cell = (row, col) => (variant === "count" ? groupFig(shapes[row], counts[col], fills[0]) : groupFig(shapes[row], 1, fills[col]));
  const C = 66;
  let inner = "";
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    const x = col * C, y = row * C;
    inner += row === 2 && col === 2
      ? `<g transform="translate(${x} ${y})"><rect x="2" y="2" width="60" height="60" rx="8" stroke-dasharray="4 4" opacity=".6"/><text x="32" y="42" font-size="28" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif" font-weight="700">?</text></g>`
      : `<g transform="translate(${x} ${y})">${cell(row, col).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`;
  }
  const figure = svg(inner, 3 * C, 3 * C);
  const ans = cell(2, 2);
  const wrong = variant === "count"
    ? [cell(2, 1), cell(1, 2), groupFig(shapes[2], counts[2], fills[1]), groupFig(shapes[0], counts[2], fills[0])]
    : [cell(2, 1), cell(1, 2), cell(2, 0), groupFig(shapes[0], 1, fills[2]), groupFig(shapes[2], 2, fills[2])];
  return { prompt: "¿Qué figura completa la matriz?", figure, optionsSvg: true, options: options(ans, wrong), explain: variant === "count" ? "En cada fila se repite la figura; en cada columna cambia la cantidad." : "En cada fila se repite la figura; en cada columna cambia el relleno." };
});

// ---------- 2. Sectores de un círculo ----------
const pie = (k, start) => {
  const seg = i => { const a0 = ((i - 2) * Math.PI) / 4, a1 = ((i - 1) * Math.PI) / 4; return `<path d="M32 32L${(32 + 24 * Math.cos(a0)).toFixed(1)} ${(32 + 24 * Math.sin(a0)).toFixed(1)}A24 24 0 0 1 ${(32 + 24 * Math.cos(a1)).toFixed(1)} ${(32 + 24 * Math.sin(a1)).toFixed(1)}Z" fill="currentColor" stroke="none"/>`; };
  let inner = '<circle cx="32" cy="32" r="24"/>';
  for (let j = 0; j < k; j++) inner += seg((start + j) % 8);
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 4; inner += `<line x1="${(32 - 24 * Math.cos(a)).toFixed(1)}" y1="${(32 - 24 * Math.sin(a)).toFixed(1)}" x2="${(32 + 24 * Math.cos(a)).toFixed(1)}" y2="${(32 + 24 * Math.sin(a)).toFixed(1)}" stroke-width="1.2" opacity=".5"/>`; }
  return svg(inner);
};
gen("ra.pie", r => {
  const rot = r.pick([0, 1, 2]), k0 = r.int(1, 2), s0 = r.int(0, 7);
  const seq = [0, 1, 2, 3].map(i => pie(k0 + i, s0 + rot * i));
  const k = k0 + 4, s = s0 + rot * 4;
  return { prompt: SEQ, svg: seq, optionsSvg: true, options: options(pie(k, s), [pie(k - 1, s), pie(k, s + 1), pie(k + 1, s), pie(k, s + 2)]), explain: rot ? `Se pinta un sector más en cada paso y el conjunto gira ${rot * 45}°.` : "Se pinta un sector más en cada paso." };
});

// ---------- 3. Reloj ----------
const clock = (h, m) => {
  const ha = ((h % 12) + m / 60) * 30 * (Math.PI / 180) - Math.PI / 2, ma = m * 6 * (Math.PI / 180) - Math.PI / 2;
  let ticks = "";
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; ticks += `<line x1="${(32 + 21 * Math.cos(a)).toFixed(1)}" y1="${(32 + 21 * Math.sin(a)).toFixed(1)}" x2="${(32 + 24 * Math.cos(a)).toFixed(1)}" y2="${(32 + 24 * Math.sin(a)).toFixed(1)}" stroke-width="1.5"/>`; }
  return svg(`<circle cx="32" cy="32" r="26"/>${ticks}<line x1="32" y1="32" x2="${(32 + 12 * Math.cos(ha)).toFixed(1)}" y2="${(32 + 12 * Math.sin(ha)).toFixed(1)}" stroke-width="3.5"/><line x1="32" y1="32" x2="${(32 + 19 * Math.cos(ma)).toFixed(1)}" y2="${(32 + 19 * Math.sin(ma)).toFixed(1)}" stroke-width="2"/><circle cx="32" cy="32" r="2" fill="currentColor"/>`);
};
gen("ra.clock", r => {
  const step = r.pick([15, 30, 45, 90, 105, 135]), h0 = r.int(1, 11), m0 = r.pick([0, 15, 30, 45]);
  const at = i => { const t = h0 * 60 + m0 + step * i; return [Math.floor(t / 60) % 12, t % 60]; };
  const seq = [0, 1, 2, 3].map(i => clock(...at(i)));
  const [h, m] = at(4);
  return { prompt: SEQ, svg: seq, optionsSvg: true, options: options(clock(h, m), [clock(h, (m + 15) % 60), clock((h + 1) % 12, m), clock(...at(3)), clock((h + 11) % 12, (m + 30) % 60)]), explain: `El reloj avanza ${step} minutos en cada paso.` };
});

// ---------- 4. Dos cambios a la vez ----------
gen("ra.combo", r => {
  const shapesAlt = r.sample(SHAPES.slice(0, 4), 2), dir = r.pick([1, 3]);
  const corners = [[16, 16], [48, 16], [48, 48], [16, 48]];
  const fig = (i, o = {}) => {
    const kind = o.kind ?? shapesAlt[i % 2], corner = corners[(o.corner ?? i * dir) % 4], fillMode = o.fill ?? (i % 2 ? "solid" : "none");
    return svg(frame + shapeAt(kind, 32, 32, 12, fillMode) + `<circle cx="${corner[0]}" cy="${corner[1]}" r="4.5" fill="currentColor" stroke="none"/>`);
  };
  const seq = [0, 1, 2, 3].map(i => fig(i));
  return { prompt: SEQ, svg: seq, optionsSvg: true, options: options(fig(4), [fig(4, { corner: 4 * dir + 1 }), fig(4, { kind: shapesAlt[1] }), fig(4, { fill: "solid" }), fig(4, { corner: 4 * dir + 2, kind: shapesAlt[1] })]), explain: "La figura central y su relleno se alternan, y el punto avanza una esquina en cada paso." };
});

// ---------- 5. Figura que gira con elemento que crece ----------
gen("ra.grow", r => {
  const step = r.pick([45, 90]), n0 = r.int(1, 2), kind = r.pick(["triangle", "square", "diamond"]);
  const fig = (i, o = {}) => {
    const n = o.n ?? n0 + i, ang = o.ang ?? step * i;
    const dots = Array.from({ length: Math.min(n, 6) }, (_, k) => `<circle cx="${10 + k * 8.8}" cy="57" r="2.6" fill="currentColor" stroke="none"/>`).join("");
    return svg(`<g transform="rotate(${ang} 32 28)">${shapeAt(kind, 32, 28, 15, "none")}<circle cx="32" cy="14" r="3" fill="currentColor" stroke="none"/></g>${dots}`);
  };
  const seq = [0, 1, 2, 3].map(i => fig(i));
  return { prompt: SEQ, svg: seq, optionsSvg: true, options: options(fig(4), [fig(4, { n: n0 + 3 }), fig(4, { ang: step * 3 }), fig(4, { ang: step * 5 }), fig(4, { n: n0 + 5 })]), explain: `La figura gira ${step}° y se agrega un punto abajo en cada paso.` };
});

// ---------- 6. Contar cubos (vista isométrica) ----------
// Alturas no crecientes hacia el frente: todas las caras superiores quedan a la vista y el conteo no es ambiguo.
function stack(r) {
  for (let t = 0; t < 30; t++) {
    const h = [];
    for (let x = 0; x < 3; x++) {
      h.push([]);
      for (let y = 0; y < 3; y++) {
        const lim = x === 0 && y === 0 ? 3 : Math.min(x ? h[x - 1][y] : 3, y ? h[x][y - 1] : 3);
        h[x].push(Math.max(0, lim - (r.chance(0.35) ? 1 : 0) - (r.chance(0.15) ? 1 : 0)));
      }
    }
    const total = h.flat().reduce((a, b) => a + b, 0);
    if (total >= 8 && total <= 20) return h;
  }
  return [[3, 2, 1], [2, 2, 1], [1, 1, 0]];
}
function isoSvg(h) {
  const a = 18, ox = 100, oy = 62;
  const P = (x, y, z) => [ox + (x - y) * a * 0.866, oy + (x + y) * a * 0.5 - z * a];
  const poly = (pts, fill) => `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ")}" fill="${fill}" stroke="currentColor" stroke-width="1.3"/>`;
  const cubes = [];
  h.forEach((row, x) => row.forEach((hh, y) => { for (let z = 0; z < hh; z++) cubes.push([x, y, z]); }));
  cubes.sort((p, q) => p[0] + p[1] - (q[0] + q[1]) || p[2] - q[2]);
  const body = cubes.map(([x, y, z]) =>
    poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], "#E9CF83") +
    poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], "#2E6BD1") +
    poly([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], "#123F86")).join("");
  return svg(body, 200, 170);
}
gen("re.cubes", r => {
  const h = stack(r);
  const total = h.flat().reduce((x, y) => x + y, 0);
  const visibleTops = h.flat().filter(v => v > 0).length;
  if (r.chance(0.5)) return { prompt: "¿Cuántos cubos forman esta figura? (los cubos ocultos están apoyados sobre otros)", figure: isoSvg(h), options: options(total, [visibleTops, total + 2, total - 2, total + 1]), explain: `Suma los cubos de cada columna: ${h.flat().filter(Boolean).join(" + ")} = ${total}.` };
  const tallest = Math.max(...h.flat());
  return { prompt: "Si retiras por completo la columna más alta, ¿cuántos cubos quedan?", figure: isoSvg(h), options: options(total - tallest, [total, total - 1, total - tallest + 1, visibleTops]), explain: `La figura tiene ${total} cubos y la columna más alta, ${tallest}: quedan ${total - tallest}.` };
});

// ---------- 7. Giro y reflejo de figuras ----------
const POLY = [[[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]], [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]], [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3]], [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]]];
const norm = cells => { const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1])); return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
const rot = cells => norm(cells.map(([x, y]) => [-y, x]));
const flip = cells => norm(cells.map(([x, y]) => [-x, y]));
const key = cells => JSON.stringify(norm(cells));
const polySvg = cells => {
  const c = norm(cells), w = Math.max(...c.map(p => p[0])) + 1, hh = Math.max(...c.map(p => p[1])) + 1, sz = Math.floor(52 / Math.max(w, hh));
  const ox = 32 - (w * sz) / 2, oy = 32 - (hh * sz) / 2;
  return svg(c.map(([x, y]) => `<rect x="${(ox + x * sz).toFixed(1)}" y="${(oy + y * sz).toFixed(1)}" width="${sz}" height="${sz}" fill="currentColor" fill-opacity=".22"/>`).join(""));
};
gen("re.rotate", r => {
  let base = norm(r.pick(POLY));
  if (r.chance(0.5)) base = flip(base);
  const rots = [base, rot(base), rot(rot(base)), rot(rot(rot(base)))];
  const mirrors = rots.map(flip);
  const isChiral = !rots.some(x => key(x) === key(flip(base)));
  const k = r.int(1, 3);
  if (!isChiral) return { prompt: "¿Cuántos cuadrados forman esta figura?", figure: polySvg(base), options: options(base.length, [base.length + 1, base.length - 1, base.length + 2]), explain: "Cuenta los cuadrados." };
  const mirror = r.chance(0.5);
  if (mirror) return { prompt: "¿Cuál opción es el REFLEJO de la figura en un espejo vertical?", figure: polySvg(base), optionsSvg: true, options: options(polySvg(flip(base)), [polySvg(rots[k]), polySvg(rots[(k % 3) + 1]), polySvg(mirrors[k])].filter(x => x !== polySvg(flip(base)))), explain: "En un espejo vertical, la izquierda y la derecha se invierten; no es lo mismo que girar." };
  return { prompt: "¿Cuál opción es la MISMA figura girada (sin voltearla)?", figure: polySvg(base), optionsSvg: true, options: options(polySvg(rots[k]), [polySvg(mirrors[0]), polySvg(mirrors[k]), polySvg(mirrors[(k % 3) + 1])]), explain: "Las otras opciones son la figura volteada (en espejo): por más que se giren, no coinciden." };
});
