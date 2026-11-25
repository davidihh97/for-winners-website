// Índice de servicios de la portada (React Bits · FlowingMenu): al pasar el mouse,
// una franja muestra la foto y el nombre del servicio. Textos, orden, ocultos y fotos
// se pueden cambiar desde el panel (window.FW_CONTENT.portada).
import { useEffect, useState } from "react";
import FlowingMenu from "../reactbits/FlowingMenu.jsx";

// Colores tomados de las variables del tema (claro u oscuro, según el ajuste del sistema).
function palette() {
  const css = getComputedStyle(document.documentElement), v = n => css.getPropertyValue(n).trim();
  return { ink: v("--ink"), paper: v("--paper"), line: v("--line") };
}
function usePalette() {
  const [p, setP] = useState(palette);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => setP(palette());
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return p;
}

const BASE = [
  { k: "pre", link: "preuniversitario.html", text: "Preuniversitario", d: "UTN · Central · UPEC · Yachay · Virtual", img: "media/preuniversitario.jpg" },
  { k: "sim", link: "simuladores.html", text: "Simuladores", d: "Gratis · Cronometrado · PDF", img: "media/simuladores.jpg" },
  { k: "voc", link: "test-vocacional.html", text: "Test vocacional", d: "86 carreras · 10 minutos", img: "media/test-vocacional.jpg" },
  { k: "diag", link: "diagnostico.html", text: "Diagnóstico", d: "Matemática · Física · Química · Lengua", img: "media/diagnostico.jpg" },
  { k: "prac", link: "practica.html", text: "Práctica", d: "53 temas · Sin registro", img: "media/simuladores.jpg" },
  { k: "eng", link: "ingles.html", text: "Inglés", d: "A1–C1 · Cambridge", img: "media/ingles.jpg" },
  { k: "niv", link: "nivelacion.html", text: "Nivelación", d: "Primaria · Colegio · Universidad", img: "media/nivelacion.jpg" },
  { k: "ase", link: "asesoria.html", text: "Asesoría de tesis", d: "Tesis · APA 7 · Defensa", img: "media/asesoria.jpg" },
  { k: "comp", link: "computacion.html", text: "Computación e IA", d: "Office · Google · IA", img: "media/computacion.jpg" },
];

function services() {
  const P = (window.FW_CONTENT || {}).portada || {};
  let list = BASE.map(s => {
    const o = (P.services || {})[s.k] || {};
    return { ...s, text: o.t || s.text, d: o.d || s.d, img: (P.media || {})[s.k] && !/\.(mp4|webm|mov)$/i.test(P.media[s.k]) ? P.media[s.k] : s.img };
  });
  if (P.order && P.order.length) list.sort((a, b) => ((P.order.indexOf(a.k) + 99) % 99) - ((P.order.indexOf(b.k) + 99) % 99));
  if (P.hidden && P.hidden.length) list = list.filter(s => !P.hidden.includes(s.k));
  return list;
}

export default function Services() {
  const list = services();
  const c = usePalette();
  return (
    <div className="services" style={{ "--rows": list.length }}>
      <FlowingMenu
        items={list.map(s => ({ link: s.link, text: s.text, image: s.img, meta: s.d }))}
        textColor={c.ink}
        bgColor={c.paper}
        marqueeBgColor={c.ink}
        marqueeTextColor={c.paper}
        borderColor={c.line}
        align="left"
        showArrow
        imageShape="rounded"
        speed={50}
        ariaLabel="Servicios de For Winners"
      />
    </div>
  );
}
