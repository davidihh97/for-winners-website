// Primera sección de la portada: en cada visita muestra un servicio al azar con su gancho,
// datos clave y foto. Entra con un enfoque desde desenfocado (motion).
import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HEROES } from "./heroes.js";

function pick() {
  let last = "";
  try { last = sessionStorage.getItem("fw-hero") || ""; } catch { /* sin almacenamiento */ }
  const pool = HEROES.filter(h => h.k !== last);
  const h = pool[Math.floor(Math.random() * pool.length)];
  try { sessionStorage.setItem("fw-hero", h.k); } catch { /* sin almacenamiento */ }
  return h;
}

export default function HeroRandom() {
  const h = useMemo(pick, []);
  const still = useReducedMotion();
  const enter = i => (still ? {} : {
    initial: { opacity: 0, filter: "blur(10px)", y: 16 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    transition: { duration: .9, delay: .08 * i, ease: [.2, .8, .2, 1] },
  });
  return (
    <div className="hero-grid">
      <div className="hero-text">
        <motion.p className="label" {...enter(0)}>{h.label}</motion.p>
        <motion.h1 {...enter(1)}>{h.hook}</motion.h1>
        <motion.p className="lead" {...enter(2)}>{h.lead}</motion.p>
        <motion.ul className="kp" {...enter(3)}>{h.facts.map(f => <li key={f}>{f}</li>)}</motion.ul>
        <motion.div className="row" {...enter(4)}>
          <a className="btn" href={h.cta[0]}>{h.cta[1]}</a>
          {h.alt ? <a className="btn o" href={h.alt[0]}>{h.alt[1]}</a> : null}
        </motion.div>
      </div>
      <motion.figure className="ph hero-ph" data-ph={h.img}
        {...(still ? {} : { initial: { opacity: 0, filter: "blur(14px)", scale: 1.04 }, animate: { opacity: 1, filter: "blur(0px)", scale: 1 }, transition: { duration: 1.2, ease: [.2, .8, .2, 1] } })}>
        <img src={"/" + h.img} alt={h.alt_img} onError={e => e.currentTarget.remove()} />
      </motion.figure>
    </div>
  );
}
