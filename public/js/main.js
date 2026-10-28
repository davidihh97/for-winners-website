const WA_NUMBER="593999769785"; // ← pon aquí el WhatsApp de For Winners (código de país + número)
const WA_MSG="Hola For Winners, quiero información.";
const NIVELACION=[["Primaria",6],["Bachillerato",7],["Universidad",8]];
const UNIS={
 "UTN":{t:"Universidad Técnica del Norte",d:["Un curso por facultad: FICAYA, FICA, FECYT-FACAE y Ciencias de la Salud.","Modalidad intensiva o regular, según el tiempo que tengas.","Temario y simulacros según tu carrera."]},
 "Central":{t:"Universidad Central del Ecuador",d:["Curso conjunto con UPEC y Yachay: comparten razonamiento verbal, lógico, numérico y abstracto.","Clases en bloques de fin de semana, mañana o tarde.","Simulacros cronometrados del formato UCE."]},
 "UPEC":{t:"Universidad Politécnica Estatal del Carchi",d:["Curso conjunto con Central y Yachay.","Práctica de razonamiento con el formato de tu prueba.","Grupos reducidos y seguimiento semanal."]},
 "Yachay":{t:"Universidad Yachay Tech",d:["Curso conjunto con Central y UPEC.","Enfoque en razonamiento lógico y numérico.","Simulacros y revisión personalizada de errores."]}
};
const FAQ=[["¿Cuándo empiezan los cursos?","Abrimos grupos nuevos según la demanda. Escríbenos por WhatsApp y te confirmamos la próxima fecha."],
["¿Cuántos estudiantes hay por grupo?","Trabajamos con grupos pequeños para que el profesor pueda resolver las dudas de cada uno."],
["¿Puedo probar antes de inscribirme?","Sí. Haz un simulador gratis de tu universidad o el test vocacional, y escríbenos para una primera orientación."],
["¿Cómo pago?","Te enviamos los datos por WhatsApp. Pregunta por las opciones de pago disponibles."]];
const TESTI=[]; // agrega testimonios reales: {n:"Nombre",c:"Carrera/Universidad",t:"Mensaje"}

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
  panel.innerHTML=`<h3>${u.t}</h3><ul>${u.d.map(x=>`<li>${x}</li>`).join("")}</ul><div style="margin-top:22px"><a class="btn" target="_blank" rel="noopener" href="${wa("Hola, quiero información del preuniversitario para "+k+".")}">Consultar precio y horario</a> <a class="btn o" href="simuladores.html?u=${SIM[k]}">Probar simulador gratis</a></div>`;
}
Object.keys(UNIS).forEach(k=>{const b=document.createElement("button");b.className="chip";b.textContent=k;b.onclick=()=>showUni(k);chips.append(b)});
if(chips.isConnected)showUni("UTN");

/* ===== NIVELACIÓN ===== */
$("#nivel-plans").innerHTML=NIVELACION.map(([n,p],i)=>`<div class="card plan ${i==1?"hot":""}">${i==1?'<span class="tag">Más elegido</span>':""}<h3>${n}</h3><div class="px">$${p}<small> / hora</small></div><ul><li>Matemáticas, Física e Inglés</li><li>Atención personalizada</li><li>Opción de paquetes de horas</li></ul><a class="btn ${i==1?"":"o"}" target="_blank" rel="noopener" href="${wa("Hola, quiero nivelación para "+n+".")}">Reservar</a></div>`).join("");

/* ===== FAQ ===== */
$("#faq-pre").innerHTML=FAQ.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("");

/* ===== TESTIMONIOS (solo se muestran si agregas alguno) ===== */
if(TESTI.length){$("#resultados").hidden=false;$("#testi").innerHTML=TESTI.map(t=>`<div class="card"><p style="color:var(--fg)">“${t.t}”</p><b>${t.n}</b><p>${t.c}</p></div>`).join("")}

$("#burger").onclick=()=>$("#links").classList.toggle("open");
