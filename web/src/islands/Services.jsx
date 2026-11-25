// Índice de servicios de la portada.
// Al pasar el mouse: el servicio activo queda nítido y los demás se atenúan, sus palabras clave se deslizan
// y una foto sigue al cursor con un fundido suave (motion). En pantallas táctiles no hay foto flotante:
// un toque abre el servicio. Textos, orden, ocultos y fotos se cambian desde el panel (FW_CONTENT.portada).
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const BASE = [
  { k: "pre", link: "preuniversitario.html", text: "Preuniversitario", d: "Cursos · Simuladores · Test vocacional · Guías", img: "media/preuniversitario.jpg" },
  { k: "niv", link: "nivelacion.html", text: "Nivelación", d: "Clases · Diagnóstico · Práctica · Tareas", img: "media/nivelacion.jpg" },
  { k: "eng", link: "ingles.html", text: "Inglés", d: "A1–C1 · Cambridge · Práctica gratis", img: "media/ingles.jpg" },
  { k: "ase", link: "asesoria.html", text: "Asesoría académica", d: "Tesis · APA 7 · Defensa", img: "media/asesoria.jpg" },
  { k: "comp", link: "computacion.html", text: "Computación e IA", d: "Office · Google · IA", img: "media/computacion.jpg" },
];

function services() {
  const P = (window.FW_CONTENT || {}).portada || {};
  let list = BASE.map(s => {
    const o = (P.services || {})[s.k] || {};
    const m = (P.media || {})[s.k];
    return { ...s, text: o.t || s.text, d: o.d || s.d, img: m && !/\.(mp4|webm|mov)$/i.test(m) ? m : s.img };
  });
  if (P.order && P.order.length) list.sort((a, b) => ((P.order.indexOf(a.k) + 99) % 99) - ((P.order.indexOf(b.k) + 99) % 99));
  if (P.hidden && P.hidden.length) list = list.filter(s => !P.hidden.includes(s.k));
  return list;
}

const src = img => (/^(https?:|\/)/.test(img) ? img : "/" + img);

export default function Services() {
  const list = services();
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState(false);
  const still = useReducedMotion();
  const box = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 24, mass: .6 }), sy = useSpring(y, { stiffness: 180, damping: 24, mass: .6 });

  // Solo con mouse (no en pantallas táctiles) aparece la foto flotante.
  useEffect(() => { setHover(matchMedia("(hover: hover) and (pointer: fine)").matches); }, []);
  // Precarga de las fotos para que el cambio sea instantáneo.
  useEffect(() => { list.forEach(s => { const i = new Image(); i.src = src(s.img); }); }, []);

  const move = e => {
    const r = box.current.getBoundingClientRect();
    x.set(e.clientX - r.left); y.set(e.clientY - r.top);
  };

  return (
    <div className={"svc" + (active >= 0 ? " is-active" : "")} ref={box} onPointerMove={hover ? move : undefined} onPointerLeave={() => setActive(-1)}>
      <ul className="svc-list">
        {list.map((s, i) => (
          <li key={s.k} className={i === active ? "on" : ""}>
            <a href={s.link} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(-1)}>
              <span className="svc-name">{s.text}</span>
              <span className="svc-kw">{s.d}</span>
              <svg className="svc-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
          </li>
        ))}
      </ul>
      {hover && (
        <motion.div className="svc-float" aria-hidden="true" style={{ x: sx, y: sy }}
          animate={{ opacity: active >= 0 ? 1 : 0, scale: active >= 0 ? 1 : .9 }} transition={{ duration: .3, ease: [.2, .8, .2, 1] }}>
          <AnimatePresence initial={false}>
            {active >= 0 && (
              <motion.img key={list[active].k} src={src(list[active].img)} alt=""
                initial={still ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", scale: 1.06 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={still ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: .35, ease: [.2, .8, .2, 1] }} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
