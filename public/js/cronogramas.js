/* ===== FECHAS Y TEMARIOS DE ADMISIÓN =====
   Datos del proceso de admisión a la educación superior pública del Ecuador.
   ACTUALIZAR AQUÍ cuando cada universidad publique sus fechas:
   - REVISADO: fecha de la última revisión (se muestra en la página).
   - REGISTRO: fechas del Registro Nacional (obligatorio para todas las universidades públicas).
   - UNIS: una fila por institución. i = inscripción, e = evaluación ("Por confirmar" si aún no hay fecha),
     t = tipo de examen, m = modalidad, web = sitio oficial, tem = temario o guía oficial, x = formato del examen.
   - FW: universidades que prepara For Winners, con el detalle de lo que evalúan. */
window.FWCrono = (function () {
  const REVISADO = "19 de noviembre de 2026";
  const REGISTRO = {
    desde: "2026-11-24", hasta: "2026-11-28", periodo: "Primer periodo 2027",
    portal: "https://admision.educacion.gob.ec/",
    fuente: "Fechas anunciadas por la Universidad de Guayaquil (admision.ug.edu.ec). Confírmalas en el portal oficial antes de empezar.",
  };
  const UNIS = [
  {"s": "EPN", "n": "Escuela Politécnica Nacional", "t": "Competencias y Capacidades", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.epn.edu.ec/", "tem": "https://www.epn.edu.ec/wp-content/uploads/2026/05/guia_estudio_2026-1.pdf", "x": "Ingeniería, Ciencias y Tecnología: 90 preguntas de Matemática, Física, Química y Lenguaje. Hasta 210 minutos: 90 para Matemática y 120 para las otras tres asignaturas."},
  {"s": "ESPAM MFL", "n": "Escuela Superior Politécnica Agropecuaria de Manabí «Manuel Félix López»", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://espam.edu.ec/", "tem": "https://www.espam.edu.ec/recursos/sitio/informativo/archivos/resoluciones/consejo/2023824112734333.pdf", "x": "80 preguntas en 2 horas"},
  {"s": "ESPE", "n": "Universidad de las Fuerzas Armadas (ESPE)", "t": "Conocimientos", "m": "Presencial y Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.espe.edu.ec/", "tem": "https://drive.google.com/drive/folders/1VY_lTPJ0DhS9K5R72b9m9ywK7XjeLm8f", "x": "30 preguntas en 90 minutos"},
  {"s": "ESPOCH", "n": "Escuela Superior Politécnica de Chimborazo", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.espoch.edu.ec/", "tem": "https://polijovenes.espoch.edu.ec/dashpublic/simulador"},
  {"s": "ESPOL", "n": "Escuela Superior Politécnica del Litoral", "t": "Conocimientos", "m": "Presencial", "i": "15 al 26 ene 2027", "e": "15 al 25 feb 2027", "web": "http://www.espol.edu.ec"},
  {"s": "IKIAM", "n": "Universidad Regional Amazónica Ikiam", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.ikiam.edu.ec/", "tem": "https://www.ikiam.edu.ec/index.php/admisiones/"},
  {"s": "INSTITUTOS", "n": "Institutos Públicos", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar"},
  {"s": "UAE", "n": "Universidad Agraria del Ecuador", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uagraria.edu.ec/", "tem": "https://admision.uagraria.edu.ec/documentos/INSTRUCTIVO_ETAPA_3.pdf"},
  {"s": "UARTES", "n": "Universidad de las Artes", "t": "Competencias", "m": "Presencial y Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uartes.edu.ec/", "x": "Dos etapas sobre 1000 puntos: suficiencia y evaluación de competencias. Se requieren al menos 700 puntos en suficiencia para avanzar. Pruebas y modalidad según la carrera."},
  {"s": "UCE", "n": "Universidad Central del Ecuador", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uce.edu.ec/"},
  {"s": "UCUENCA", "n": "Universidad de Cuenca", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.ucuenca.edu.ec/"},
  {"s": "UEA", "n": "Universidad Estatal Amazónica", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.uea.edu.ec"},
  {"s": "UEB", "n": "Universidad Estatal de Bolívar", "t": "Competencias y Capacidades", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.ueb.edu.ec/sitio/", "tem": "https://rdigital.ueb.edu.ec/bitstreams/77022368-ddc9-4927-bb64-d0dc27f49230/download", "x": "100 preguntas en 120 minutos. Examen general en línea para la oferta indicada en la guía. Enfermería, Terapia Física y Psicología: examen específico presencial en Guaranda."},
  {"s": "UG", "n": "Universidad de Guayaquil", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.ug.edu.ec/"},
  {"s": "UINPIAW", "n": "Universidad Intercultural de las Nacionalidades y Pueblos Indígenas Amawtay Wasi", "t": "Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar"},
  {"s": "UITEY", "n": "Universidad de Investigación de Tecnología Experimental Yachay", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.yachaytech.edu.ec/", "tem": "https://yachaytech.edu.ec/admisiones/", "x": "80 preguntas en 90 minutos"},
  {"s": "ULEAM", "n": "Universidad Laica \"Eloy Alfaro\" de Manabí", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uleam.edu.ec/", "tem": "https://admision.uleam.edu.ec/wp-content/uploads/2026/01/Instructivo_para_la_evaluacion_de_Ingreso_a_la_Uleam_2026-1.pdf"},
  {"s": "UNACH", "n": "Universidad Nacional de Chimborazo", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.unach.edu.ec/", "x": "80 preguntas en 1 hora y 30 minutos"},
  {"s": "UNAE", "n": "Universidad Nacional de Educación", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.unae.edu.ec/", "tem": "https://admisiones.unae.edu.ec/media/publicsite/botones/Temario_para_la_evaluacion_IIS-2026_22.06.2026_SIekBkp.pdf", "x": "2 horas para 50 preguntas"},
  {"s": "UNEMI", "n": "Universidad Estatal de Milagro", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.unemi.edu.ec/", "tem": "https://admisiongrado.unemi.edu.ec/files/Manual_Admisi%C3%B3n_1S2026_2.pdf"},
  {"s": "UNESUM", "n": "Universidad Estatal del Sur de Manabí", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://unesum.edu.ec/"},
  {"s": "UNL", "n": "Universidad Nacional de Loja", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://unl.edu.ec/", "tem": "https://www.unl.edu.ec/admisiones/temario"},
  {"s": "UPEC", "n": "Universidad Politécnica Estatal del Carchi", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.upec.edu.ec/"},
  {"s": "UPSDT", "n": "Universidad Pública de Santo Domingo de los Tsáchilas", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "tem": "https://drive.google.com/drive/folders/12faZlGSRwqYBwYPZbQ8uled0w90a5zhT", "x": "30 preguntas en 60 minutos"},
  {"s": "UPSE", "n": "Universidad Estatal Península de Santa Elena", "t": "Razonamientos", "m": "Presencial y Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.upse.edu.ec/", "tem": "https://www.upse.edu.ec/nivelacion-admision/images/2026-1/manualSimulador.pdf"},
  {"s": "USECIPOL", "n": "Universidad de Seguridad Ciudadana y Ciencias Policiales", "t": "Competencias y Capacidades", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar"},
  {"s": "UTA", "n": "Universidad Técnica de Ambato", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.uta.edu.ec/", "x": "50 preguntas en 90 minutos."},
  {"s": "UTB", "n": "Universidad Técnica de Babahoyo", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utb.edu.ec/"},
  {"s": "UTC", "n": "Universidad Técnica de Cotopaxi", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.utc.edu.ec/", "tem": "https://drive.google.com/file/d/1Zo0VKKjA4ARMGo5V-lqGjDOprs9NBPuJ/view"},
  {"s": "UTELVT", "n": "Universidad Técnica \"Luis Vargas Torres\" de Esmeraldas", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://utelvt.edu.ec/"},
  {"s": "UTEQ", "n": "Universidad Técnica Estatal de Quevedo", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uteq.edu.ec/", "tem": "https://www.uteq.edu.ec/admision/evaluacion-por-competencias-generales-especificas", "x": "Duración: 100 minutos (1 hora y 40 minutos)"},
  {"s": "UTM", "n": "Universidad Técnica de Manabí", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utm.edu.ec/", "tem": "https://utm.edu.ec/images/sliders/2023/content/TEMARIO.pdf"},
  {"s": "UTMACH", "n": "Universidad Técnica de Machala", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utmachala.edu.ec/", "x": "50 preguntas en 50 minutos"},
  {"s": "UTN", "n": "Universidad Técnica del Norte", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utn.edu.ec/"}
  ];

  // Universidades que prepara For Winners: qué evalúa cada examen (resumen del temario oficial).
  const FW = {
    utn: {
      s: "UTN", sim: "utn", nota: "El examen es de conocimientos y cambia según la facultad.",
      partes: [
        { t: "FICA · Ingenierías en Ciencias Aplicadas", c: "Software, Electricidad, Mecatrónica, Automotriz, Industrial, Telecomunicaciones, Textiles, Ciencia de Datos e IA", m: ["Matemática", "Física", "Química", "Lenguaje", "Estadística"] },
        { t: "FICAYA · Ciencias Agropecuarias y Ambientales", c: "Agroindustria, Agropecuaria, Biotecnología, Ambiental, Energías Renovables, Medicina Veterinaria", m: ["Matemática", "Física", "Química", "Biología", "Lenguaje", "Estadística"] },
        { t: "FECYT · FACAE · Educación y Administración", c: "Educación, Psicología, Comunicación, Derecho, Administración, Contabilidad, Gastronomía, Mercadotecnia y más", m: ["Matemática", "Lenguaje", "Emprendimiento", "Estadística"] },
        { t: "Ciencias de la Salud", c: "Medicina, Enfermería, Nutrición y Dietética, Fisioterapia", m: ["Biología", "Anatomía", "Química", "Lenguaje", "Estadística"] },
      ],
    },
    uce: {
      s: "UCE", sim: "uce", nota: "El examen es de razonamiento: no evalúa materias del colegio.",
      partes: [
        { t: "Razonamiento verbal", c: "Sinónimos, antónimos, analogías, oraciones incompletas, término excluido, refranes, palabras homófonas y parónimas, comprensión lectora." },
        { t: "Razonamiento lógico y abstracto", c: "Series numéricas y de letras, giros y transformaciones de figuras, proyecciones, secuencias y matrices gráficas, dominós, ordenamiento y relaciones." },
        { t: "Razonamiento numérico", c: "Operaciones y jerarquía, MCD y MCM, lógica proposicional, regla de tres, porcentajes, proporciones, ecuaciones y problemas de edades." },
      ],
    },
    upec: {
      s: "UPEC", sim: "upec", nota: "Razonamiento y una parte de atención y concentración.",
      partes: [
        { t: "Razonamiento verbal", c: "Idea principal e inferencias en textos, sinónimos, antónimos, analogías y elección de conclusiones." },
        { t: "Razonamiento numérico", c: "Enteros, fracciones y decimales, proporciones, porcentajes, ecuaciones sencillas y lectura de tablas." },
        { t: "Razonamiento lógico y abstracto", c: "Series numéricas, de letras y gráficas, semejanzas y diferencias, ordenamiento y deducción." },
        { t: "Atención y concentración", c: "Comparar letras, números, símbolos y códigos con precisión y rapidez." },
      ],
    },
    yachay: {
      s: "UITEY", sim: "yachay", nota: "80 preguntas en 90 minutos, de razonamiento con una base fuerte de matemática.",
      partes: [
        { t: "Razonamiento verbal", c: "Analogías, orden de oraciones, sinónimos y antónimos en contexto, lectura comprensiva." },
        { t: "Razonamiento lógico-numérico", c: "Sucesiones, regla de tres, ecuaciones de 1.er y 2.º grado, sistemas, porcentajes, exponentes y radicales, geometría y trigonometría, conjuntos y conectores lógicos." },
        { t: "Razonamiento abstracto", c: "Analogías y secuencias de figuras, razonamiento espacial, vistas y proyecciones, giros y dominós." },
      ],
    },
  };

  const PASOS = [
    ["Registro Nacional", "Obligatorio y gratuito, en el portal del Gobierno. Sin él no puedes seguir."],
    ["Inscripción en tu universidad", "Cada universidad abre su propia inscripción y publica sus fechas."],
    ["Examen de admisión", "Razonamiento, conocimientos o competencias, según la universidad."],
    ["Postulación y asignación de cupos", "Eliges tus carreras y se asignan los cupos según tu puntaje."],
    ["Aceptación y matrícula", "Aceptas el cupo dentro del plazo y te matriculas."],
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const DAY = 864e5;
  const day = iso => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmt = iso => day(iso).toLocaleDateString("es-EC", { day: "numeric", month: "long" });
  const rango = (a, b) => {
    const A = day(a), B = day(b), mes = d => d.toLocaleDateString("es-EC", { month: "long" });
    return A.getMonth() === B.getMonth() ? `del ${A.getDate()} al ${B.getDate()} de ${mes(B)} de ${B.getFullYear()}` : `del ${fmt(a)} al ${fmt(b)} de ${B.getFullYear()}`;
  };

  // Estado del Registro Nacional según la fecha de hoy.
  function registro(now = new Date()) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const a = day(REGISTRO.desde), b = day(REGISTRO.hasta);
    const diasPara = Math.round((a - today) / DAY), diasQuedan = Math.round((b - today) / DAY);
    if (diasPara > 0) return { estado: "pronto", txt: diasPara === 1 ? "Empieza mañana" : `Empieza en ${diasPara} días` };
    if (diasQuedan >= 0) return { estado: "abierto", txt: diasQuedan === 0 ? "Abierto: hoy es el último día" : `Abierto: quedan ${diasQuedan + 1} días` };
    return { estado: "cerrado", txt: "Cerrado para este periodo" };
  }

  function mountRegistro(el) {
    const r = registro();
    el.innerHTML = `
      <div class="reg-top"><span class="reg-state ${r.estado}">${r.txt}</span><span class="rn-small">${REGISTRO.periodo}</span></div>
      <h3>Registro Nacional: ${rango(REGISTRO.desde, REGISTRO.hasta)}</h3>
      <p>Es el primer paso para entrar a cualquier universidad, escuela politécnica o instituto público. Es <b>gratuito</b> y se hace en línea. Registrarte no te da un cupo: después debes cumplir el proceso de tu universidad.</p>
      <div class="reg-grid">
        <div><p class="pv-h">Cómo hacerlo</p><ol class="reg-steps"><li>Entra al portal oficial y elige «Registro Nacional».</li><li>Inicia sesión o crea tu cuenta (si olvidaste la clave, recupérala).</li><li>Llena tus datos personales, de residencia y de contacto, y revísalos.</li><li>Finaliza y guarda tu comprobante. Crear la cuenta no completa el trámite.</li></ol></div>
        <div><p class="pv-h">Ten listo</p><ul class="reg-list"><li>Tu cédula vigente</li><li>Un correo personal que puedas abrir</li><li>Tu usuario y clave, si ya participaste antes</li><li>Un celular o computadora con buena conexión</li></ul>
          <p class="rn-small" style="margin-top:10px">Pueden participar quienes cursan 3.º de bachillerato o ya tienen el título de bachiller.</p></div>
      </div>
      <div class="row" style="justify-content:flex-start"><a class="btn" href="${REGISTRO.portal}" target="_blank" rel="noopener">Ir al portal oficial</a><a class="btn o" target="_blank" rel="noopener" href="${wa("Hola For Winners, necesito ayuda con mi Registro Nacional.")}">Te ayudamos por WhatsApp</a></div>
      <p class="rn-small reg-src">${esc(REGISTRO.fuente)}</p>`;
  }

  function mountPasos(el) {
    el.innerHTML = PASOS.map(([t, d], i) => `<li${i === 0 ? ' class="now"' : ""}><b>${t}</b><span>${d}</span></li>`).join("");
  }

  function uniCard(k) {
    const f = FW[k], u = UNIS.find(x => x.s === f.s);
    const fecha = v => `<b class="${/confirmar/i.test(v) ? "tbd" : ""}">${esc(v)}</b>`;
    return `<div class="fw-uni">
      <p class="pv-h">Admisión 2027</p><p class="rn-small">${esc(f.nota)}</p>
      <div class="fw-facts"><div><span>Inscripción</span>${fecha(u.i)}</div><div><span>Examen</span>${fecha(u.e)}</div><div><span>Tipo</span><b>${esc(u.t)}</b></div><div><span>Modalidad</span><b>${esc(u.m)}</b></div></div>
      <p class="pv-h" style="margin-top:22px">Qué evalúa</p>
      <div class="fw-parts">${f.partes.map(p => `<div><b>${esc(p.t)}</b>${p.m ? `<div class="topics">${p.m.map(x => `<span>${x}</span>`).join("")}</div><p class="rn-small">${esc(p.c)}</p>` : `<p class="rn-small">${esc(p.c)}</p>`}</div>`).join("")}</div>
      <div class="row" style="justify-content:flex-start"><a class="btn" href="simuladores.html?u=${f.sim}#elegir">Probar el simulador</a><a class="btn o" target="_blank" rel="noopener" href="${wa(`Hola For Winners, quiero que me avisen las fechas de admisión de la ${u.s} y saber del preuniversitario.`)}">Avísame las fechas</a>${u.web ? `<a class="linkbtn" href="${esc(u.web)}" target="_blank" rel="noopener">Sitio oficial ›</a>` : ""}${u.tem ? `<a class="linkbtn" href="${esc(u.tem)}" target="_blank" rel="noopener">Temario oficial ›</a>` : ""}</div>
    </div>`;
  }

  function mountUni(el, k) { el.innerHTML = uniCard(k); }

  function mountTabla(root) {
    const q = root.querySelector("[data-q]"), tipo = root.querySelector("[data-tipo]"), list = root.querySelector("[data-list]"), count = root.querySelector("[data-count]");
    const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // Primero las que ya tienen fechas; se muestran 8 hasta que la persona busca o pide verlas todas.
    const more = root.querySelector("[data-more]"), SHOW = 8;
    const conFecha = u => !/confirmar/i.test(u.i + u.e);
    const ORDEN = [...UNIS].sort((a, b) => conFecha(b) - conFecha(a) || a.s.localeCompare(b.s));
    let all = false;
    more.onclick = () => { all = true; draw(); };
    const draw = () => {
      const term = norm(q.value.trim()), t = tipo.value;
      const found = ORDEN.filter(u => (!term || norm(u.s + " " + u.n).includes(term)) && (!t || u.t.includes(t)));
      const rows = all || term || t ? found : found.slice(0, SHOW);
      count.textContent = rows.length < found.length ? `Mostrando ${rows.length} de ${found.length} instituciones (primero las que ya tienen fechas)` : `${found.length} de ${UNIS.length} instituciones`;
      more.hidden = rows.length >= found.length;
      more.textContent = `Ver las ${found.length} instituciones`;
      list.innerHTML = rows.length ? rows.map(u => `<li class="cr-row">
          <div class="cr-name"><b>${esc(u.s)}</b><span>${esc(u.n)}</span>${u.x ? `<span class="cr-x">${esc(u.x)}</span>` : ""}</div>
          <div class="cr-meta"><span>${esc(u.t)}</span><span>${esc(u.m)}</span></div>
          <div class="cr-dates"><span>Inscripción <b class="${/confirmar/i.test(u.i) ? "tbd" : ""}">${esc(u.i)}</b></span><span>Examen <b class="${/confirmar/i.test(u.e) ? "tbd" : ""}">${esc(u.e)}</b></span></div>
          <div class="cr-links">${u.web ? `<a href="${esc(u.web)}" target="_blank" rel="noopener">Sitio oficial</a>` : ""}${u.tem ? `<a href="${esc(u.tem)}" target="_blank" rel="noopener">Temario</a>` : ""}</div>
        </li>`).join("") : `<li class="cr-empty">No encontramos esa universidad. Prueba con sus siglas (por ejemplo, ESPE) o con una palabra del nombre.</li>`;
    };
    q.addEventListener("input", draw); tipo.addEventListener("change", draw);
    draw();
  }

  return { REVISADO, REGISTRO, UNIS, FW, registro, mountRegistro, mountPasos, mountUni, mountTabla };
})();
