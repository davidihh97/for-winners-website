// Fuentes de preguntas. Cada fuente sabe construir una pregunta a partir de (índice, semilla),
// así el servidor puede reconstruirla al corregir sin guardar nada del intento.
//
// Formato de una pregunta construida:
//   { prompt, options: [correcta, ...distractores], explain?, svg?, optionsSvg?, keepOrder? }
//   { prompt, type: "text", accept: ["respuesta", ...] }
//   { prompt, type: "order", answer: "frase correcta" }   (las fichas salen de la frase)
//   passage?: texto de lectura asociado

export const SOURCES = {};

function register(key, src) {
  if (SOURCES[key]) throw new Error("Fuente duplicada: " + key);
  SOURCES[key] = { key, ...src };
}

// Banco fijo. Ítem: { q, o: [correcta, ...incorrectas], e? } o { q, a: [...aceptadas] } o { s: "frase para ordenar" }
export function bank(key, items, extra = {}) {
  register(key, { kind: "bank", size: items.length, build: idx => fromItem(items[idx], extra) });
}

// Diccionario: el ítem es fijo pero los distractores se eligen con la semilla.
export function dict(key, items, fn) {
  register(key, { kind: "dict", size: items.length, build: (idx, r) => fn(items[idx], r, items, idx) });
}

// Generador paramétrico: la semilla define todo.
export function gen(key, fn) {
  register(key, { kind: "gen", build: (_, r) => fn(r) });
}

// Lecturas: cada pasaje aporta varias preguntas.
export function passages(key, list) {
  register(key, {
    kind: "passage",
    size: list.length,
    count: idx => list[idx].qs.length,
    build: (idx, _r, sub) => {
      const p = list[idx];
      return { ...fromItem(p.qs[sub]), passage: p.text, passageTitle: p.title };
    },
  });
}

function fromItem(it, extra = {}) {
  if (it.s) return { prompt: it.q || extra.orderPrompt || "Ordena las palabras para formar una oración correcta.", type: "order", answer: it.s, explain: it.e };
  if (it.a) return { prompt: it.q, type: "text", accept: it.a, explain: it.e };
  return { prompt: it.q, options: it.o, explain: it.e, keepOrder: extra.keepOrder };
}
