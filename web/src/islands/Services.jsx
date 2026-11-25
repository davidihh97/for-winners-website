// Índice de servicios de la portada (React Bits · FlowingMenu): al pasar el mouse,
// una franja muestra la foto y el nombre del servicio. Textos, orden, ocultos y fotos
// se pueden cambiar desde el panel (window.FW_CONTENT.portada).
import FlowingMenu from "../reactbits/FlowingMenu.jsx";

const BASE = [
  { k: "pre", link: "preuniversitario.html", text: "Preuniversitario", d: "UTN · Central · UPEC · Yachay", img: "media/preuniversitario.jpg" },
  { k: "sim", link: "simuladores.html", text: "Simuladores", d: "Gratis", img: "media/simuladores.jpg" },
  { k: "voc", link: "test-vocacional.html", text: "Test vocacional", d: "86 carreras", img: "media/test-vocacional.jpg" },
  { k: "diag", link: "diagnostico.html", text: "Diagnóstico", d: "Gratis", img: "media/diagnostico.jpg" },
  { k: "eng", link: "ingles.html", text: "Inglés", d: "A1 a C1", img: "media/ingles.jpg" },
  { k: "niv", link: "nivelacion.html", text: "Nivelación", d: "Desde $6 la hora", img: "media/nivelacion.jpg" },
  { k: "ase", link: "asesoria.html", text: "Asesoría de tesis", d: "Del tema a la defensa", img: "media/asesoria.jpg" },
  { k: "comp", link: "computacion.html", text: "Computación e IA", d: "Office · IA", img: "media/computacion.jpg" },
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
  return (
    <div className="services" style={{ "--rows": list.length }}>
      <FlowingMenu
        items={list.map(s => ({ link: s.link, text: s.text, image: s.img, meta: s.d }))}
        textColor="#0d1b2e"
        bgColor="#ffffff"
        marqueeBgColor="#0d1b2e"
        marqueeTextColor="#ffffff"
        borderColor="#e5e7eb"
        align="left"
        showArrow
        imageShape="rounded"
        speed={50}
        ariaLabel="Servicios de For Winners"
      />
    </div>
  );
}
