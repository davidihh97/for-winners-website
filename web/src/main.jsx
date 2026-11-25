/* Islas de React: cada elemento con data-island="Nombre" (y data-props con JSON opcional)
   se reemplaza por el componente. El resto de la página es HTML (editable desde el panel). */
import "./styles/site.css";
import { createRoot } from "react-dom/client";
import { createElement, lazy, Suspense } from "react";
import { initFocus, initScrollLinks } from "./focus.js";
import { initNav } from "./nav.js";

const ISLANDS = {
  Services: lazy(() => import("./islands/Services.jsx")),
  Count: lazy(() => import("./islands/Count.jsx")),
  HeroRandom: lazy(() => import("./islands/HeroRandom.jsx")),
};

for (const el of document.querySelectorAll("[data-island]")) {
  const C = ISLANDS[el.dataset.island];
  if (!C) continue;
  let props = {};
  try { props = el.dataset.props ? JSON.parse(el.dataset.props) : {}; } catch { /* props inválidos */ }
  props.fallback = el.innerHTML;
  // El contenido HTML original se queda visible hasta que React lo reemplaza (y para Google).
  createRoot(el).render(createElement(Suspense, { fallback: createElement("span", { dangerouslySetInnerHTML: { __html: props.fallback } }) }, createElement(C, props)));
}

initNav();
initScrollLinks();
initFocus();
