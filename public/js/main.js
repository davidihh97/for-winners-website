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
["¿Puedo probar antes de inscribirme?","Sí. Haz el diagnóstico gratis en la página de inicio o escríbenos para una primera orientación."],
["¿Cómo pago?","Te enviamos los datos por WhatsApp. Pregunta por las opciones de pago disponibles."]];
const TESTI=[]; // agrega testimonios reales: {n:"Nombre",c:"Carrera/Universidad",t:"Mensaje"}
const QS=[["¿Cuánto es 3/4 + 1/6?",["5/6","11/12","4/10"],1],["¿Cuál es el 15 % de 240?",["24","48","36"],2],["Resuelve: 2x + 6 = 20",["x = 5","x = 13","x = 7"],2]];

/* ===== UTILIDADES ===== */
// Si un elemento no existe en la página actual, devuelve un div vacío para no romper el script
const $=(s,r=document)=>r.querySelector(s)||document.createElement("div");
const wa=m=>`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m||WA_MSG)}`;
document.querySelectorAll(".wal").forEach(a=>{a.href=wa();a.target="_blank";a.rel="noopener"});

/* ===== PREUNIVERSITARIO ===== */
const chips=$("#chips"),panel=$("#panel");
function showUni(k){
  chips.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c.textContent===k));
  const u=UNIS[k];
  panel.innerHTML=`<h3>${u.t}</h3><ul>${u.d.map(x=>`<li>${x}</li>`).join("")}</ul><div style="margin-top:22px"><a class="btn" target="_blank" rel="noopener" href="${wa("Hola, quiero información del preuniversitario para "+k+".")}">Consultar precio y horario</a></div>`;
}
Object.keys(UNIS).forEach(k=>{const b=document.createElement("button");b.className="chip";b.textContent=k;b.onclick=()=>showUni(k);chips.append(b)});
showUni("UTN");

/* ===== NIVELACIÓN ===== */
$("#nivel-plans").innerHTML=NIVELACION.map(([n,p],i)=>`<div class="card plan ${i==1?"hot":""}">${i==1?'<span class="tag">Más elegido</span>':""}<h3>${n}</h3><div class="px">$${p}<small> / hora</small></div><ul><li>Matemáticas, Física e Inglés</li><li>Atención personalizada</li><li>Opción de paquetes de horas</li></ul><a class="btn ${i==1?"":"o"}" target="_blank" rel="noopener" href="${wa("Hola, quiero nivelación para "+n+".")}">Reservar</a></div>`).join("");

/* ===== FAQ ===== */
$("#faq-pre").innerHTML=FAQ.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("");

/* ===== TESTIMONIOS (solo se muestran si agregas alguno) ===== */
if(TESTI.length){$("#resultados").hidden=false;$("#testi").innerHTML=TESTI.map(t=>`<div class="card"><p style="color:var(--fg)">“${t.t}”</p><b>${t.n}</b><p>${t.c}</p></div>`).join("")}

/* ===== DIAGNÓSTICO ===== */
const quiz=$("#quiz");let qi=0,score=0;
function renderQ(){
  if(qi>=QS.length){
    const msg=score==3?"Excelente base. Te conviene practicar con simulacros tipo examen.":score==2?"Buen nivel. Con un poco de refuerzo llegas muy lejos.":"Tienes oportunidad de mejora. Una nivelación te dará una base sólida.";
    quiz.innerHTML=`<div class="bar"><i style="width:100%"></i></div><div class="q">Acertaste ${score} de ${QS.length}.</div><p style="color:#A1A1A6;margin-top:10px">${msg}</p><div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn" target="_blank" rel="noopener" href="${wa("Hola, hice el diagnóstico y acerté "+score+" de "+QS.length+". Quiero orientación.")}">Recibir orientación</a><button class="btn o" id="rs" style="color:#fff;box-shadow:inset 0 0 0 1.5px #fff">Repetir</button></div>`;
    $("#rs").onclick=()=>{qi=0;score=0;renderQ()};return;
  }
  const [q,o,a]=QS[qi];
  quiz.innerHTML=`<div class="bar"><i style="width:${qi/QS.length*100}%"></i></div><div class="q">${q}</div>`+o.map((x,i)=>`<button class="opt" data-i="${i}">${x}</button>`).join("");
  quiz.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i;if(i==a)score++;
    quiz.querySelectorAll(".opt").forEach((x,j)=>{x.disabled=true;if(j==a)x.classList.add("ok");else if(j==i)x.classList.add("no")});
    setTimeout(()=>{qi++;renderQ()},800);
  });
}
renderQ();
$("#burger").onclick=()=>$("#links").classList.toggle("open");
