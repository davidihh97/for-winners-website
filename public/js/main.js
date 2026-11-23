/* Estos son los valores por defecto. Desde el panel (admin.forwinnersec.com) se pueden cambiar sin tocar
   el código: el servidor los entrega en window.FW_CONTENT y aquí reemplazan a los de abajo. */
const FWC=window.FW_CONTENT||{},FWCFG=FWC.config||{};
const fwEsc=window.FW?FW.esc:(s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]));
const WA_NUMBER=String(FWCFG.whatsapp||"593999769785").replace(/\D/g,""); // ← WhatsApp de For Winners (código de país + número)
const WA_MSG=FWCFG.waMsg||"Hola For Winners, quiero información.";
// Canal de WhatsApp con avisos de fechas de admisión (gratis). Pega aquí el enlace del canal cuando lo crees,
// por ejemplo "https://whatsapp.com/channel/XXXX". Vacío: los botones «Avísame las fechas» abren un chat normal.
window.CANAL_WA=FWCFG.canalWa||"";
const NIVELACION=(FWC.nivelacion&&FWC.nivelacion.length)?FWC.nivelacion.map(x=>[x.n,x.p,x.li]):[["Primaria",6],["Bachillerato",7],["Universidad",8]];
const UNIS={
 "UTN":{t:"Universidad Técnica del Norte",d:["Un curso por facultad: FICA-FICAYA (Ingenierías), FECYT-FACAE y Ciencias de la Salud.","Modalidad intensiva o regular, según el tiempo que tengas.","Temario y simulacros según tu carrera."]},
 "Central":{t:"Universidad Central del Ecuador",d:["Curso conjunto con UPEC y Yachay: comparten razonamiento verbal, lógico, numérico y abstracto.","Clases en bloques de fin de semana, mañana o tarde.","Simulacros cronometrados del formato UCE."]},
 "UPEC":{t:"Universidad Politécnica Estatal del Carchi",d:["Curso conjunto con Central y Yachay.","Práctica de razonamiento con el formato de tu prueba.","Grupos reducidos y seguimiento semanal."]},
 "Yachay":{t:"Universidad Yachay Tech",d:["Curso conjunto con Central y UPEC.","Enfoque en razonamiento lógico y numérico.","Simulacros y revisión personalizada de errores."]}
};
if(FWC.unis)for(const k in FWC.unis){const u=FWC.unis[k];if(UNIS[k]&&u){if(u.t)UNIS[k].t=u.t;if(u.d&&u.d.filter(Boolean).length)UNIS[k].d=u.d.filter(Boolean)}}
const FAQ=[["¿Cuándo empiezan los cursos?","Abrimos grupos nuevos según la demanda. Escríbenos por WhatsApp y te confirmamos la próxima fecha."],
["¿Cuántos estudiantes hay por grupo?","Trabajamos con grupos pequeños para que el profesor pueda resolver las dudas de cada uno."],
["¿Puedo probar antes de inscribirme?","Sí. Haz un simulador gratis de tu universidad o el test vocacional, y escríbenos para una primera orientación."],
["¿Cómo pago?","Te enviamos los datos por WhatsApp. Pregunta por las opciones de pago disponibles."]];
if(FWC.faq&&FWC.faq.length)FAQ.splice(0,FAQ.length,...FWC.faq.map(x=>[x.q,x.a]));
const TESTI=(FWC.testimonios||[]).filter(t=>t&&t.t); // testimonios reales: {n:"Nombre",c:"Carrera/Universidad",t:"Mensaje"} (se editan en el panel)

/* ===== UTILIDADES ===== */
// Si un elemento no existe en la página actual, devuelve un div vacío para no romper el script
const $=(s,r=document)=>r.querySelector(s)||document.createElement("div");
const wa=m=>`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m||WA_MSG)}`;
document.querySelectorAll(".wal").forEach(a=>{a.href=wa();a.target="_blank";a.rel="noopener"});

/* ===== PREUNIVERSITARIO ===== */
const chips=$("#chips"),panel=$("#panel"),SIM={UTN:"utn",Central:"uce",UPEC:"upec",Yachay:"yachay"};
function showUni(k){
  chips.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c.textContent===k));
  const u=UNIS[k];
  panel.innerHTML=`<h3>${fwEsc(u.t)}</h3><p class="pv-h" style="margin-top:16px">Tu curso en For Winners</p><ul>${u.d.map(x=>`<li>${fwEsc(x)}</li>`).join("")}</ul><div class="row" style="justify-content:flex-start;margin-top:18px"><a class="btn" target="_blank" rel="noopener" href="${wa("Hola, quiero información del preuniversitario para "+k+".")}">Consultar precio y horario</a></div>`;
  if(window.FWCrono){const d=document.createElement("div");panel.append(d);FWCrono.mountUni(d,SIM[k])}
}
Object.keys(UNIS).forEach(k=>{const b=document.createElement("button");b.className="chip";b.textContent=k;b.onclick=()=>showUni(k);chips.append(b)});
if(chips.isConnected)showUni("UTN");

/* ===== NIVELACIÓN ===== */
$("#nivel-plans").innerHTML=NIVELACION.map(([n,p,li],i)=>`<div class="card plan ${i==1?"hot":""}">${i==1?'<span class="tag">Más elegido</span>':""}<h3>${fwEsc(n)}</h3><div class="px">$${fwEsc(p)}<small> / hora</small></div><ul>${(li&&li.length?li:["Matemáticas, Física e Inglés","Atención personalizada","Opción de paquetes de horas"]).map(x=>`<li>${fwEsc(x)}</li>`).join("")}</ul><a class="btn ${i==1?"":"o"}" target="_blank" rel="noopener" href="${wa("Hola, quiero nivelación para "+n+".")}">Reservar</a></div>`).join("");

/* ===== FAQ ===== */
$("#faq-pre").innerHTML=FAQ.map(([q,a])=>`<details><summary>${fwEsc(q)}</summary><p>${fwEsc(a)}</p></details>`).join("");

/* ===== TESTIMONIOS (solo se muestran si agregas alguno) ===== */
if(TESTI.length){$("#resultados").hidden=false;$("#testi").innerHTML=TESTI.map(t=>`<div class="card"><p style="color:var(--fg)">“${fwEsc(t.t)}”</p><b>${fwEsc(t.n)}</b><p>${fwEsc(t.c)}</p></div>`).join("")}

/* ===== MENÚ MÓVIL ===== */
(function(){
  const btn=document.getElementById("burger"),links=document.getElementById("links");
  if(!btn||!links)return;
  btn.setAttribute("aria-controls","links");btn.setAttribute("aria-expanded","false");
  const use=btn.querySelector("use");
  const set=open=>{
    // El menú ocupa solo el alto visible bajo la barra y se desplaza si no cabe (11 opciones en celulares pequeños).
    if(open){const nav=btn.closest("nav");links.style.maxHeight=Math.max(200,innerHeight-(nav?nav.getBoundingClientRect().bottom:64))+"px";links.scrollTop=0}
    links.classList.toggle("open",open);document.body.classList.toggle("menu-open",open);
    btn.setAttribute("aria-expanded",open);btn.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");
    if(use)use.setAttribute("href","img/icons.svg#"+(open?"x":"menu"));
  };
  btn.onclick=()=>set(!links.classList.contains("open"));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&links.classList.contains("open")){set(false);btn.focus()}});
  document.addEventListener("click",e=>{if(links.classList.contains("open")&&!links.contains(e.target)&&!btn.contains(e.target))set(false)});
  links.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
  matchMedia("(min-width:761px)").addEventListener("change",e=>{if(e.matches)set(false)});
})();

/* ===== BOTÓN DE WHATSAPP =====
   En celular se oculta mientras un simulador o un formulario está en pantalla, para no tapar sus botones. */
(function(){
  const runners=document.querySelectorAll("#runner, .runner");
  if(!runners.length||!("IntersectionObserver" in window))return;
  const seen=new Set();
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));
    document.body.classList.toggle("wa-off",seen.size>0);
  },{rootMargin:"0px 0px -80px 0px"});
  runners.forEach(r=>io.observe(r));
})();

/* ===== AVISO DEL REGISTRO NACIONAL =====
   Barra superior en todas las páginas (menos la portada) hasta que cierre el Registro Nacional.
   Al cambiar las fechas, actualiza también REGISTRO en js/cronogramas.js. */
let AVISO={hasta:new Date(2026,10,28,23,59),texto:"Registro Nacional 2027: del 24 al 28 de noviembre. Es gratis y obligatorio.",link:"preuniversitario.html#fechas",linkLabel:"Ver fechas y cómo hacerlo",id:"aviso-rn-2027"};
if(FWC.aviso){const a=FWC.aviso;AVISO=a.enabled&&a.texto?{hasta:a.hasta?new Date(a.hasta+"T23:59:59"):new Date(8.64e15),texto:a.texto,link:a.link||"",linkLabel:a.linkLabel||"Ver más",id:"aviso-"+(a.id||"panel")}:null}
(function(){
  const nav=document.querySelector("body>nav");
  if(!AVISO)return;
  let off=false;try{off=localStorage.getItem(AVISO.id)==="1"}catch{}
  if(!nav||off||new Date()>AVISO.hasta)return;
  const bar=document.createElement("div");bar.className="notice";bar.setAttribute("role","note");
  bar.innerHTML=`<div class="wrap"><span>${fwEsc(AVISO.texto)}</span>${AVISO.link?`<a href="${fwEsc(AVISO.link)}">${fwEsc(AVISO.linkLabel)}</a>`:""}<button type="button" aria-label="Cerrar aviso">✕</button></div>`;
  bar.querySelector("button").onclick=()=>{bar.remove();try{localStorage.setItem(AVISO.id,"1")}catch{}};
  nav.before(bar);
})();
