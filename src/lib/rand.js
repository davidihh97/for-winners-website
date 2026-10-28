// PRNG con semilla: permite regenerar una pregunta generada a partir de su id para corregirla.
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.int = (min, max) => min + Math.floor(next() * (max - min + 1));
  next.pick = arr => arr[Math.floor(next() * arr.length)];
  next.shuffle = arr => shuffle(arr, next);
  next.sample = (arr, n) => shuffle(arr, next).slice(0, n);
  next.chance = p => next() < p;
  return next;
}

export function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

export function shuffle(arr, r = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Construye opciones únicas: la respuesta correcta + distractores sin repetirse.
export function options(answer, distractors, n = 4, fill) {
  const out = [String(answer)];
  for (const d of distractors) {
    const s = String(d);
    if (out.length >= n) break;
    if (!out.includes(s)) out.push(s);
  }
  let k = 1;
  while (fill && out.length < n && k < 50) {
    const s = String(fill(k++));
    if (!out.includes(s)) out.push(s);
  }
  return out;
}

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fmt = n => (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100).replace(".", ","));
