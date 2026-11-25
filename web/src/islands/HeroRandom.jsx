// Primera sección de la portada: en cada visita muestra un servicio al azar con su gancho,
// datos clave y foto (o video). Entra con un enfoque desde desenfocado (motion).
// Textos, foto/video y qué servicios salen se cambian desde el panel (window.FW_CONTENT.portada).
import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HEROES } from "./heroes.js";

const lines = v => (Array.isArray(v) ? v.map(x => String(x).trim()).filter(Boolean) : []);

/** Ganchos con los cambios del panel aplicados. */
function heroes() {
  const P = (window.FW_CONTENT || {}).portada || {};
  const list = HEROES.map(h => {
    const o = (P.services || {})[h.k] || {};
    const media = (P.media || {})[h.k];
    return {
      ...h,
      label: o.label || h.label,
      hook: o.hook || h.hook,
      lead: o.p || h.lead,
      facts: lines(o.facts).length ? lines(o.facts) : h.facts,
      cta: o.cta ? [h.cta[0], o.cta] : h.cta,
      src: media || "/" + h.img,
      video: /\.(mp4|webm|mov)(\?|$)/i.test(media || ""),
    };
  });
  const hidden = P.heroHidden || [];
  const shown = list.filter(h => !hidden.includes(h.k));
  return { list, shown: shown.length ? shown : list };
}

function pick() {
  const { list, shown } = heroes();
  // Vista previa desde el panel: muestra un servicio concreto.
  const force = new URLSearchParams(location.search).get("fw-hero");
  const f = force && list.find(h => h.k === force);
  if (f) return f;
  let last = "";
  try { last = sessionStorage.getItem("fw-hero") || ""; } catch { /* sin almacenamiento */ }
  const pool = shown.length > 1 ? shown.filter(h => h.k !== last) : shown;
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
        {h.video
          ? <video src={h.src} autoPlay muted loop playsInline aria-label={h.alt_img} />
          : <img src={h.src} alt={h.alt_img} onError={e => e.currentTarget.remove()} />}
      </motion.figure>
    </div>
  );
}
