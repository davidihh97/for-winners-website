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
    {"s": "EPN", "n": "Escuela Politécnica Nacional", "t": "Competencias y Capacidades", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.epn.edu.ec/", "tem": "https://www.epn.edu.ec/wp-content/uploads/2026/05/guia_estudio_2026-1.pdf", "x": "Ingeniería, Ciencias y Tecnología: 90 preguntas de Matemática, Física, Química y Lenguaje. Hasta 210 minutos: 90 para Matemática y 120 para las otras tres asignaturas.", "c": "Quito"},
    {"s": "ESPAM MFL", "n": "Escuela Superior Politécnica Agropecuaria de Manabí «Manuel Félix López»", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://espam.edu.ec/", "tem": "https://www.espam.edu.ec/recursos/sitio/informativo/archivos/resoluciones/consejo/2023824112734333.pdf", "x": "80 preguntas en 2 horas", "c": "Calceta (Manabí)"},
    {"s": "ESPE", "n": "Universidad de las Fuerzas Armadas (ESPE)", "t": "Conocimientos", "m": "Presencial y Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.espe.edu.ec/", "tem": "https://drive.google.com/drive/folders/1VY_lTPJ0DhS9K5R72b9m9ywK7XjeLm8f", "x": "30 preguntas en 90 minutos", "c": "Sangolquí", "med": 1, "calc": "Calculadora básica no graficadora para los grupos 1, 3 y 4; no permitida en los grupos 2 y 5 (proceso SII-2026)."},
    {"s": "ESPOCH", "n": "Escuela Superior Politécnica de Chimborazo", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.espoch.edu.ec/", "tem": "https://polijovenes.espoch.edu.ec/dashpublic/simulador", "c": "Riobamba", "med": 1, "calc": "Calculadora básica tipo Casio FX-350MS o de menor categoría (proceso 2026-1S)."},
    {"s": "ESPOL", "n": "Escuela Superior Politécnica del Litoral", "t": "Conocimientos", "m": "Presencial", "i": "15 al 26 ene 2027", "e": "15 al 25 feb 2027", "web": "http://www.espol.edu.ec", "c": "Guayaquil", "calc": "Calculadora científica básica solo en Física, Química y Ciencias para Arte; prohibida en las demás materias y sin graficadoras (proceso 2P-2026)."},
    {"s": "IKIAM", "n": "Universidad Regional Amazónica Ikiam", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.ikiam.edu.ec/", "tem": "https://www.ikiam.edu.ec/index.php/admisiones/", "c": "Tena"},
    {"s": "INSTITUTOS", "n": "Institutos Públicos", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "c": "Varias ciudades"},
    {"s": "UAE", "n": "Universidad Agraria del Ecuador", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uagraria.edu.ec/", "tem": "https://admision.uagraria.edu.ec/documentos/INSTRUCTIVO_ETAPA_3.pdf", "c": "Guayaquil"},
    {"s": "UARTES", "n": "Universidad de las Artes", "t": "Competencias", "m": "Presencial y Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uartes.edu.ec/", "x": "Dos etapas sobre 1000 puntos: suficiencia y evaluación de competencias. Se requieren al menos 700 puntos en suficiencia para avanzar. Pruebas y modalidad según la carrera.", "c": "Guayaquil"},
    {"s": "UCE", "n": "Universidad Central del Ecuador", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uce.edu.ec/", "c": "Quito", "med": 1},
    {"s": "UCUENCA", "n": "Universidad de Cuenca", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.ucuenca.edu.ec/", "c": "Cuenca", "med": 1},
    {"s": "UEA", "n": "Universidad Estatal Amazónica", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.uea.edu.ec", "c": "Puyo"},
    {"s": "UEB", "n": "Universidad Estatal de Bolívar", "t": "Competencias y Capacidades", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.ueb.edu.ec/sitio/", "tem": "https://rdigital.ueb.edu.ec/bitstreams/77022368-ddc9-4927-bb64-d0dc27f49230/download", "x": "100 preguntas en 120 minutos. Examen general en línea para la oferta indicada en la guía. Enfermería, Terapia Física y Psicología: examen específico presencial en Guaranda.", "c": "Guaranda"},
    {"s": "UG", "n": "Universidad de Guayaquil", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.ug.edu.ec/", "c": "Guayaquil", "med": 1},
    {"s": "UINPIAW", "n": "Universidad Intercultural de las Nacionalidades y Pueblos Indígenas Amawtay Wasi", "t": "Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "c": "Quito"},
    {"s": "YACHAY", "n": "Universidad Yachay Tech", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.yachaytech.edu.ec/", "tem": "https://yachaytech.edu.ec/admisiones/", "x": "80 preguntas en 90 minutos", "c": "Urcuquí (Imbabura)"},
    {"s": "ULEAM", "n": "Universidad Laica \"Eloy Alfaro\" de Manabí", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uleam.edu.ec/", "tem": "https://admision.uleam.edu.ec/wp-content/uploads/2026/01/Instructivo_para_la_evaluacion_de_Ingreso_a_la_Uleam_2026-1.pdf", "c": "Manta", "med": 1},
    {"s": "UNACH", "n": "Universidad Nacional de Chimborazo", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.unach.edu.ec/", "x": "80 preguntas en 1 hora y 30 minutos", "c": "Riobamba", "med": 1},
    {"s": "UNAE", "n": "Universidad Nacional de Educación", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.unae.edu.ec/", "tem": "https://admisiones.unae.edu.ec/media/publicsite/botones/Temario_para_la_evaluacion_IIS-2026_22.06.2026_SIekBkp.pdf", "x": "2 horas para 50 preguntas", "c": "Azogues"},
    {"s": "UNEMI", "n": "Universidad Estatal de Milagro", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.unemi.edu.ec/", "tem": "https://admisiongrado.unemi.edu.ec/files/Manual_Admisi%C3%B3n_1S2026_2.pdf", "c": "Milagro", "med": 1},
    {"s": "UNESUM", "n": "Universidad Estatal del Sur de Manabí", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://unesum.edu.ec/", "c": "Jipijapa"},
    {"s": "UNL", "n": "Universidad Nacional de Loja", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://unl.edu.ec/", "tem": "https://www.unl.edu.ec/admisiones/temario", "c": "Loja", "med": 1, "calc": "Calculadora con funciones científicas básicas cuando el temario lo requiere; no se acepta la del celular (primer proceso 2026)."},
    {"s": "UPEC", "n": "Universidad Politécnica Estatal del Carchi", "t": "Razonamientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.upec.edu.ec/", "c": "Tulcán"},
    {"s": "UPSDT", "n": "Universidad Pública de Santo Domingo de los Tsáchilas", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "tem": "https://drive.google.com/drive/folders/12faZlGSRwqYBwYPZbQ8uled0w90a5zhT", "x": "30 preguntas en 60 minutos", "c": "Santo Domingo"},
    {"s": "UPSE", "n": "Universidad Estatal Península de Santa Elena", "t": "Razonamientos", "m": "Presencial y Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.upse.edu.ec/", "tem": "https://www.upse.edu.ec/nivelacion-admision/images/2026-1/manualSimulador.pdf", "c": "La Libertad (Santa Elena)"},
    {"s": "USECIPOL", "n": "Universidad de Seguridad Ciudadana y Ciencias Policiales", "t": "Competencias y Capacidades", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "c": "Quito"},
    {"s": "UTA", "n": "Universidad Técnica de Ambato", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.uta.edu.ec/", "x": "50 preguntas en 90 minutos.", "c": "Ambato", "med": 1},
    {"s": "UTB", "n": "Universidad Técnica de Babahoyo", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utb.edu.ec/", "c": "Babahoyo"},
    {"s": "UTC", "n": "Universidad Técnica de Cotopaxi", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.utc.edu.ec/", "tem": "https://drive.google.com/file/d/1Zo0VKKjA4ARMGo5V-lqGjDOprs9NBPuJ/view", "c": "Latacunga"},
    {"s": "UTELVT", "n": "Universidad Técnica \"Luis Vargas Torres\" de Esmeraldas", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "http://utelvt.edu.ec/", "c": "Esmeraldas"},
    {"s": "UTEQ", "n": "Universidad Técnica Estatal de Quevedo", "t": "Razonamientos y Conocimientos", "m": "Virtual", "i": "Por confirmar", "e": "Por confirmar", "web": "http://www.uteq.edu.ec/", "tem": "https://www.uteq.edu.ec/admision/evaluacion-por-competencias-generales-especificas", "x": "Duración: 100 minutos (1 hora y 40 minutos)", "c": "Quevedo"},
    {"s": "UTM", "n": "Universidad Técnica de Manabí", "t": "Razonamientos y Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utm.edu.ec/", "tem": "https://utm.edu.ec/images/sliders/2023/content/TEMARIO.pdf", "c": "Portoviejo", "med": 1},
    {"s": "UTMACH", "n": "Universidad Técnica de Machala", "t": "Razonamientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utmachala.edu.ec/", "x": "50 preguntas en 50 minutos", "c": "Machala", "med": 1},
    {"s": "UTN", "n": "Universidad Técnica del Norte", "t": "Conocimientos", "m": "Presencial", "i": "Por confirmar", "e": "Por confirmar", "web": "https://www.utn.edu.ec/", "c": "Ibarra", "med": 1}
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
      s: "YACHAY", sim: "yachay", nota: "80 preguntas en 90 minutos, de razonamiento con una base fuerte de matemática.",
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
      <div class="row" style="justify-content:flex-start"><a class="btn" href="simuladores.html?u=${f.sim}#elegir">Probar el simulador</a><a class="btn o" target="_blank" rel="noopener" href="${avisoUrl(u.s)}">Avísame las fechas</a><button type="button" class="linkbtn" onclick="FWCrono.abrir('${u.s}')">Temario completo ›</button>${u.web ? `<a class="linkbtn" href="${esc(u.web)}" target="_blank" rel="noopener">Sitio oficial ›</a>` : ""}${u.tem ? `<a class="linkbtn" href="${esc(u.tem)}" target="_blank" rel="noopener">Temario oficial ›</a>` : ""}</div>
    </div>`;
  }

  function mountUni(el, k) { el.innerHTML = uniCard(k); }

  /* ===== CURSOS =====
     Presencial en Ibarra solo para estas cuatro; todas las demás, virtual por módulos.
     Cuando haya precio, fecha de inicio u horario, escríbelos aquí (vacío = «Consultar por WhatsApp»). */
  const CURSOS = {
    presencial: { unis: ["UTN", "UCE", "UPEC", "YACHAY"], lugar: "Ibarra", precio: "", inicio: "", horario: "" },
    virtual: { precio: "", inicio: "", horario: "", porModulo: "" },
  };
  const esPresencial = s => CURSOS.presencial.unis.includes(s);

  // Módulos del curso virtual: se detectan en el temario de cada universidad.
  const MODULOS = [
    ["Razonamiento verbal", /verbal|lectora|lectura|sin[oó]nim|analog|comprensi[oó]n de textos/i, "verbal"],
    ["Razonamiento numérico", /num[eé]ric|aritm[eé]tic|cuantitativ/i, "numerico"],
    ["Razonamiento lógico", /l[oó]gic|deducci|silogism/i, "logico"],
    ["Razonamiento abstracto y espacial", /abstract|espacial|figura/i, "abstracto"],
    ["Atención y concentración", /atenci[oó]n|concentraci|percepci/i, "atencion"],
    ["Matemática", /matem|[aá]lgebra|geometr|c[aá]lculo|trigonom/i, "matematica"],
    ["Física", /f[ií]sica/i, "fisica"],
    ["Química", /qu[ií]mica/i, "quimica"],
    ["Biología", /biolog/i, null],
    ["Anatomía", /anatom/i, null],
    ["Lenguaje y redacción", /lengua|literatura|redacci|comunicaci[oó]n escrita|gram[aá]tica/i, null],
    ["Estadística", /estad[ií]stic|probabilid/i, "estadistica"],
    ["Emprendimiento y economía", /emprend|econom|administraci|negocio|contab/i, "emprendimiento"],
    ["Historia, sociales y cultura general", /histor|social|c[ií]vica|ciudadan|cultura general|geograf/i, null],
    ["Inglés", /ingl[eé]s|english/i, null],
  ];
  const BASE = { Razonamientos: ["Razonamiento verbal", "Razonamiento numérico", "Razonamiento lógico", "Razonamiento abstracto y espacial"] };
  function modulos(u, tem) {
    // Solo títulos de materia: se descartan los nombres de grupos, facultades y carreras.
    const GRUPO = /grupo|facultad|ciencias (de|econ|human|soc|admin|agro|exac|natur|vida|apli)|ingenier[ií]as?\b|carreras|·/i;
    const heads = (tem || []).filter(([k, t]) => (k === "h" || (k === "t" && t.length < 45)) && !GRUPO.test(t)).map(([, t]) => t).join(" | ");
    let found = MODULOS.filter(([, re]) => re.test(heads));
    if (found.length < 2 && /Razonamiento/.test(u.t)) found = MODULOS.filter(([n]) => BASE.Razonamientos.includes(n)).concat(found);
    return [...new Map(found.map(m => [m[0], m])).values()];
  }

  // Aviso de fechas: canal de WhatsApp si existe (CANAL_WA en main.js); si no, mensaje directo.
  const avisoUrl = s => (window.CANAL_WA ? window.CANAL_WA : wa(`Hola For Winners, quiero recibir los avisos de fechas de admisión de la ${s}.`));

  let TEMARIOS = null;
  const cargarTemarios = () => TEMARIOS || (TEMARIOS = fetch("data/temarios.json").then(r => { if (!r.ok) throw new Error(); return r.json(); }).catch(e => { TEMARIOS = null; throw e; }));

  function renderTemario(seq) {
    // h = materia o grupo · c = carrera · m = dato del examen · i = tema · t = texto
    let html = "", list = [], chips = [];
    const flush = () => {
      if (list.length) html += `<ul class="tm-list">${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
      if (chips.length) html += `<div class="topics tm-car">${chips.map(x => `<span>${esc(x)}</span>`).join("")}</div>`;
      list = []; chips = [];
    };
    seq.forEach(([k, t], i) => {
      if (k === "i") { if (chips.length) flush(); list.push(t); return; }
      if (k === "c") { if (list.length) flush(); chips.push(t); return; }
      flush();
      const next = seq[i + 1] && seq[i + 1][0];
      if (k === "h") html += `<h4 class="tm-h">${esc(t)}</h4>`;
      else if (k === "m") html += `<p class="tm-m">${esc(t)}</p>`;
      else if (t.length < 60 && next === "i") html += `<h5 class="tm-sub">${esc(t)}</h5>`;
      else if (t.length < 70 && next === "t" && seq[i + 1][1].length < 70) list.push(t);
      else html += `<p class="tm-t">${esc(t)}</p>`;
    });
    flush();
    return html;
  }

  function sheet() {
    let d = document.getElementById("uni-sheet");
    if (d) return d;
    d = document.createElement("dialog");
    d.className = "sheet uni-sheet"; d.id = "uni-sheet"; d.setAttribute("aria-labelledby", "uni-sheet-t");
    d.innerHTML = '<button type="button" class="sheet-x" aria-label="Cerrar">✕</button><div class="us-body"></div>';
    d.querySelector(".sheet-x").onclick = () => d.close();
    d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
    d.addEventListener("close", () => { if (location.hash.startsWith("#u-")) history.replaceState(null, "", location.pathname + location.search + "#cronogramas"); });
    document.body.append(d);
    return d;
  }

  function abrir(sig) {
    const u = UNIS.find(x => x.s === sig);
    if (!u) return;
    const d = sheet(), body = d.querySelector(".us-body"), pres = esPresencial(u.s), slug = u.s.toLowerCase().replace(/\s+/g, "-");
    const fecha = v => `<b class="${/confirmar/i.test(v) ? "tbd" : ""}">${esc(v)}</b>`;
    const cv = pres ? CURSOS.presencial : CURSOS.virtual;
    const precio = cv.precio ? `<div><span>Precio</span><b>${esc(cv.precio)}</b></div>` : "";
    const inicio = cv.inicio ? `<div><span>Inicio</span><b>${esc(cv.inicio)}</b></div>` : "";
    const horario = cv.horario ? `<div><span>Horario</span><b>${esc(cv.horario)}</b></div>` : "";
    body.innerHTML = `
      <p class="us-sig">${esc(u.s)} · ${esc(u.c)}${u.med ? " · tiene Medicina" : ""}</p>
      <h3 id="uni-sheet-t">${esc(u.n)}</h3>
      <div class="fw-facts us-facts"><div><span>Inscripción</span>${fecha(u.i)}</div><div><span>Examen</span>${fecha(u.e)}</div><div><span>Tipo de examen</span><b>${esc(u.t)}</b></div><div><span>Modalidad del examen</span><b>${esc(u.m)}</b></div></div>
      ${u.x ? `<p class="us-x"><b>Formato:</b> ${esc(u.x)}</p>` : ""}
      ${u.calc ? `<p class="us-x"><b>Calculadora:</b> ${esc(u.calc)}</p>` : ""}
      <div class="us-course ${pres ? "pres" : "virt"}">
        <span class="us-badge">${pres ? "Curso presencial en Ibarra" : "Curso virtual por módulos"}</span>
        <h4>${pres ? `Prepárate en clase, en Ibarra` : `Prepárate desde casa, solo con lo que necesitas`}</h4>
        <p>${pres ? "Grupos reducidos, simulacros con el formato de tu examen y revisión de errores. También puedes combinarlo con módulos virtuales." : "Clases en línea con el temario de tu universidad. Eliges los módulos que te hacen falta y avanzas a tu ritmo, con simulacros y tutor."}</p>
        <div class="fw-facts">${precio}${inicio}${horario}</div>
        <p class="pv-h" style="margin-top:14px">Módulos para este examen</p>
        <div class="us-mods" data-mods><span class="rn-small">Cargando…</span></div>
        <div class="row" style="justify-content:flex-start">
          <a class="btn" target="_blank" rel="noopener" href="${wa(`Hola For Winners, quiero el curso ${pres ? "presencial" : "virtual"} para el examen de la ${u.s}. ¿Precio, horarios y fecha de inicio?`)}">${pres ? "Reservar mi cupo" : "Quiero el curso virtual"}</a>
          <a class="btn o" target="_blank" rel="noopener" href="${avisoUrl(u.s)}">Avísame las fechas</a>
        </div>
      </div>
      <p class="pv-h" style="margin-top:26px">Qué evalúa su examen</p>
      <div class="tm" data-tm><p class="rn-small">Cargando el temario…</p></div>
      <div class="us-links">${u.web ? `<a href="${esc(u.web)}" target="_blank" rel="noopener">Sitio oficial ›</a>` : ""}${u.tem ? `<a href="${esc(u.tem)}" target="_blank" rel="noopener">Temario o guía oficial ›</a>` : ""}<a href="guias.html">Guías de admisión ›</a></div>
      <p class="rn-small us-note">Resumen del temario publicado por la universidad para su último proceso. Confírmalo en su sitio oficial: puede cambiar en la convocatoria 2027.</p>`;
    cargarTemarios().then(all => {
      const seq = all[u.s] || [];
      body.querySelector("[data-tm]").innerHTML = seq.length ? renderTemario(seq) : '<p class="rn-small">La universidad aún no publica el temario de este periodo. Te avisamos cuando salga.</p>';
      const mods = modulos(u, seq);
      body.querySelector("[data-mods]").innerHTML = mods.length ? mods.map(([n, , area]) => area ? `<a class="mod" href="practica.html?area=${area}">${n}<small>Practicar gratis ›</small></a>` : `<span class="mod">${n}</span>`).join("") : '<span class="rn-small">Según el temario de tu carrera. Escríbenos y armamos tu plan.</span>';
    }).catch(() => {
      body.querySelector("[data-tm]").innerHTML = '<p class="rn-small">No se pudo cargar el temario. Revisa tu conexión y vuelve a abrir esta ficha.</p>';
      body.querySelector("[data-mods]").innerHTML = "";
    });
    history.replaceState(null, "", location.pathname + location.search + "#u-" + slug);
    if (!d.open) d.showModal ? d.showModal() : d.setAttribute("open", "");
    d.scrollTop = 0;
  }

  function mountTabla(root) {
    const q = root.querySelector("[data-q]"), tipo = root.querySelector("[data-tipo]"), list = root.querySelector("[data-list]"), count = root.querySelector("[data-count]");
    const more = root.querySelector("[data-more]"), flags = [...root.querySelectorAll("[data-flag]")], SHOW = 8;
    const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    // Primero las presenciales en Ibarra y las que ya tienen fechas; se muestran 8 hasta que la persona busca o pide verlas todas.
    const conFecha = u => !/confirmar/i.test(u.i + u.e);
    const ORDEN = [...UNIS].sort((a, b) => esPresencial(b.s) - esPresencial(a.s) || conFecha(b) - conFecha(a) || a.s.localeCompare(b.s));
    let all = false;
    more.onclick = () => { all = true; draw(); };
    flags.forEach(b => b.onclick = () => { b.classList.toggle("on"); b.setAttribute("aria-pressed", b.classList.contains("on")); draw(); });
    const draw = () => {
      const term = norm(q.value.trim()), t = tipo.value, on = flags.filter(b => b.classList.contains("on")).map(b => b.dataset.flag);
      const found = ORDEN.filter(u => (!term || norm(`${u.s} ${u.n} ${u.c}`).includes(term)) && (!t || u.t.includes(t))
        && (!on.includes("med") || u.med) && (!on.includes("pres") || esPresencial(u.s)) && (!on.includes("fecha") || conFecha(u)));
      const filtered = term || t || on.length;
      const rows = all || filtered ? found : found.slice(0, SHOW);
      count.textContent = rows.length < found.length ? `Mostrando ${rows.length} de ${found.length} instituciones` : `${found.length} de ${UNIS.length} instituciones`;
      more.hidden = rows.length >= found.length;
      more.textContent = `Ver las ${found.length} instituciones`;
      list.innerHTML = rows.length ? rows.map(u => `<li class="cr-row">
          <div class="cr-name"><b>${esc(u.s)} <span class="cr-tag ${esPresencial(u.s) ? "pres" : "virt"}">${esPresencial(u.s) ? "Presencial en Ibarra" : "Virtual"}</span></b><span>${esc(u.n)}</span><span class="cr-x">${esc(u.c)}${u.med ? " · Medicina" : ""}</span></div>
          <div class="cr-meta"><span>${esc(u.t)}</span><span>${esc(u.m)}</span></div>
          <div class="cr-dates"><span>Inscripción <b class="${/confirmar/i.test(u.i) ? "tbd" : ""}">${esc(u.i)}</b></span><span>Examen <b class="${/confirmar/i.test(u.e) ? "tbd" : ""}">${esc(u.e)}</b></span></div>
          <div class="cr-links"><button type="button" class="btn o cr-open" data-u="${esc(u.s)}">Examen y temario</button></div>
        </li>`).join("") : `<li class="cr-empty">No encontramos esa universidad. Prueba con sus siglas (por ejemplo, ESPE), con la ciudad o quita los filtros.</li>`;
    };
    list.addEventListener("click", e => { const b = e.target.closest("[data-u]"); if (b) abrir(b.dataset.u); });
    q.addEventListener("input", draw); tipo.addEventListener("change", draw);
    draw();
    // Enlace directo a una universidad: preuniversitario.html#u-espe
    const h = decodeURIComponent(location.hash);
    if (h.startsWith("#u-")) { const u = UNIS.find(x => x.s.toLowerCase().replace(/\s+/g, "-") === h.slice(3).toLowerCase()); if (u) abrir(u.s); }
  }

  // Formulario de avisos de fechas (canal o mensaje de WhatsApp).
  function mountAvisos(form) {
    const sel = form.querySelector("select");
    sel.innerHTML = '<option value="">Elige tu universidad</option>' + [...UNIS].sort((a, b) => a.s.localeCompare(b.s)).map(u => `<option value="${esc(u.s)}">${esc(u.s)} · ${esc(u.n)}</option>`).join("");
    const btn = form.querySelector("button");
    if (window.CANAL_WA) btn.textContent = "Unirme al canal de avisos";
    form.onsubmit = e => {
      e.preventDefault();
      const s = sel.value;
      const url = window.CANAL_WA || wa(`Hola For Winners, quiero recibir gratis los avisos de fechas de admisión${s ? " de la " + s : ""}.`);
      window.open(url, "_blank", "noopener");
    };
  }

  return { REVISADO, REGISTRO, UNIS, FW, CURSOS, registro, mountRegistro, mountPasos, mountUni, mountTabla, mountAvisos, abrir };
})();
