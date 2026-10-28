// Bancos para los simuladores por facultad (estructura tomada de los simuladores de curso de For Winners).
// Todas las preguntas son ORIGINALES: ninguna reproduce las del material del curso.
import { bank, dict, passages } from "../lib/sources.js";
import { options } from "../lib/rand.js";

const pairQ = (prompt, rev) => ([a, b], r, all, idx) => {
  const flip = rev && r.chance(0.5);
  const others = r.sample(all.filter((_, i) => i !== idx), 3).map(x => (flip ? x[0] : x[1]));
  return flip ? { prompt: rev(b), options: options(a, others) } : { prompt: prompt(a), options: options(b, others) };
};

// ================= LENGUAJE (formato UTN) =================
bank("ln.bank", [
  { q: "¿Qué recurso argumentativo se usa en: «El 68 % de los jóvenes encuestados lee menos de un libro al año»?", o: ["Datos estadísticos", "Analogía", "Pregunta retórica", "Cita de autoridad"] },
  { q: "¿Qué recurso argumentativo se usa en: «¿Acaso no merecemos todos una educación de calidad?»?", o: ["Pregunta retórica", "Ejemplificación", "Datos estadísticos", "Cita de autoridad"] },
  { q: "¿Qué recurso argumentativo se usa en: «Educar sin valores es como construir una casa sin cimientos»?", o: ["Analogía", "Cita de autoridad", "Datos estadísticos", "Contraargumento"] },
  { q: "¿Qué recurso argumentativo se usa en: «Como señaló Einstein, la imaginación es más importante que el conocimiento»?", o: ["Cita de autoridad", "Analogía", "Ejemplificación", "Generalización"] },
  { q: "Identifique el tipo de oración: «Llegué temprano, me cambié y salí a trotar.»", o: ["Compuesta yuxtapuesta y coordinada", "Simple", "Subordinada adverbial", "Interrogativa"] },
  { q: "Identifique el tipo de oración: «Si estudias a diario, aprobarás.»", o: ["Subordinada condicional", "Coordinada copulativa", "Yuxtapuesta", "Simple"] },
  { q: "Identifique el tipo de oración: «Quería viajar, pero no tenía dinero.»", o: ["Coordinada adversativa", "Coordinada disyuntiva", "Subordinada causal", "Yuxtapuesta"] },
  { q: "Identifique el tipo de oración: «¿Vienes o te quedas?»", o: ["Coordinada disyuntiva", "Coordinada adversativa", "Subordinada final", "Simple"] },
  { q: "La oración «El acta fue firmada por los delegados» está en voz:", o: ["Pasiva", "Activa", "Reflexiva", "Impersonal"] },
  { q: "En «Mañana visitaremos el museo», el sujeto es:", o: ["Tácito (nosotros)", "Mañana", "El museo", "Visitaremos"] },
  { q: "En «Entregué los informes a la directora», el complemento indirecto es:", o: ["a la directora", "los informes", "Entregué", "No tiene"] },
  { q: "¿Qué palabra es sobresdrújula?", o: ["Dígaselo", "Teléfono", "Árbol", "Corazón"] },
  { q: "¿Qué palabra lleva tilde por hiato?", o: ["Tío", "Camión", "Cárcel", "Lección"] },
  { q: "¿Qué palabra es grave (llana) y lleva tilde correctamente?", o: ["Azúcar", "Reloj", "Jardín", "Papel"] },
  { q: "Elija la oración con tilde diacrítica correcta:", o: ["¿Tú sabes si él vendrá?", "¿Tu sabes si el vendrá?", "¿Tú sabes si el vendrá?", "¿Tu sabes si él vendrá?"] },
  { q: "¿Cuál oración presenta queísmo?", o: ["Me di cuenta que era tarde.", "Me di cuenta de que era tarde.", "Estoy seguro de que vendrá.", "Pienso que llegará."], e: "«Darse cuenta» exige la preposición «de»." },
  { q: "¿Cuál oración NO tiene vicios de dicción?", o: ["Hace años que no lo veo.", "Hacen años que no lo veo.", "Lo vide ayer en la tienda.", "Nadies vino a la clase."] },
  { q: "Identifique la oración con redundancia (pleonasmo):", o: ["Lo vi con mis propios ojos.", "Lo vi en la plaza.", "Lo vi ayer temprano.", "Lo vi caminar."] },
  { q: "El sustantivo colectivo de «lobos» es:", o: ["Manada", "Cardumen", "Piara", "Bandada"] },
  { q: "El sustantivo colectivo de «músicos» es:", o: ["Orquesta", "Elenco", "Tripulación", "Jauría"] },
  { q: "La abreviatura correcta de «señora» es:", o: ["Sra.", "Sñra.", "Sa.", "Señ."] },
  { q: "La abreviatura correcta de «licenciado» es:", o: ["Lcdo.", "Lic", "Lcd", "Lin."] },
  { q: "¿Cuál es el significado de «efigie»?", o: ["Imagen o representación de una persona", "Documento oficial", "Enfermedad leve", "Canción popular"] },
  { q: "¿Cuál es el significado de «galimatías»?", o: ["Lenguaje confuso", "Tipo de ave", "Juego de mesa", "Plato típico"] },
  { q: "Complete con el conector adecuado: «Llovió toda la noche; ______, el partido se suspendió.»", o: ["por consiguiente", "sin embargo", "aunque", "por ejemplo"] },
  { q: "Complete con el conector adecuado: «Es un buen jugador; ______, le falta disciplina.»", o: ["no obstante", "por lo tanto", "es decir", "así que"] },
  { q: "Identifique la oración con error de concordancia:", o: ["La gente aplaudieron al final.", "La gente aplaudió al final.", "Los asistentes aplaudieron.", "El público aplaudió."] },
  { q: "¿Qué figura literaria hay en «Tus manos son seda»?", o: ["Metáfora", "Anáfora", "Hipérbaton", "Onomatopeya"] },
  { q: "¿Qué figura literaria hay en «El tic tac del reloj no me deja dormir»?", o: ["Onomatopeya", "Metáfora", "Hipérbole", "Ironía"] },
  { q: "Complete el texto: «La ______ es la idea que defiende el autor; los ______ son las razones que la sostienen.»", o: ["tesis – argumentos", "conclusión – ejemplos", "introducción – citas", "hipótesis – datos"] },
  { q: "¿Cuál de estos textos es expositivo?", o: ["Un artículo que explica cómo se forman los volcanes", "Un cuento de hadas", "Un poema de amor", "Una carta de reclamo"] },
  { q: "En el refrán «Camarón que se duerme se lo lleva la corriente», el mensaje es:", o: ["Hay que estar atento y actuar a tiempo", "Hay que dormir más", "Los ríos son peligrosos", "Hay que comer mariscos"] },
]);

// ================= ESTADÍSTICA (conceptos) =================
bank("st.bank", [
  { q: "La variable «color de ojos» es:", o: ["Cualitativa nominal", "Cualitativa ordinal", "Cuantitativa discreta", "Cuantitativa continua"] },
  { q: "La variable «estatura de un estudiante» es:", o: ["Cuantitativa continua", "Cuantitativa discreta", "Cualitativa nominal", "Cualitativa ordinal"] },
  { q: "La variable «nivel de estudios (primaria, secundaria, superior)» es:", o: ["Cualitativa ordinal", "Cualitativa nominal", "Cuantitativa discreta", "Cuantitativa continua"] },
  { q: "La variable «número de goles en un partido» es:", o: ["Cuantitativa discreta", "Cuantitativa continua", "Cualitativa ordinal", "Cualitativa nominal"] },
  { q: "Un valor calculado a partir de los datos de una muestra se llama:", o: ["Estadístico", "Parámetro", "Población", "Frecuencia"] },
  { q: "La escala de medición del peso en kilogramos (con cero absoluto) es:", o: ["De razón", "De intervalo", "Ordinal", "Nominal"] },
  { q: "En el muestreo estratificado:", o: ["La población se divide en grupos y se toma una muestra de cada uno", "Se eligen los más fáciles de encontrar", "Cada participante recluta a otro", "Se encuesta a toda la población"] },
  { q: "El gráfico más adecuado para mostrar la evolución de las ventas mes a mes es:", o: ["Gráfico de líneas", "Gráfico circular", "Pictograma", "Diagrama de Venn"] },
  { q: "El histograma se usa para representar:", o: ["Datos cuantitativos agrupados en intervalos", "Partes de un todo", "Relaciones entre conjuntos", "Datos nominales"] },
  { q: "La medida que indica cuánto se dispersan los datos respecto a la media es:", o: ["La desviación estándar", "La moda", "La mediana", "El rango intercuartílico solamente"] },
  { q: "La moda de un conjunto de datos es:", o: ["El valor que más se repite", "El valor central", "El promedio", "La diferencia entre máximo y mínimo"] },
  { q: "Si una distribución es simétrica, se cumple que:", o: ["Media, mediana y moda son aproximadamente iguales", "La media es mayor que la moda", "La mediana es cero", "No tiene moda"] },
  { q: "La frecuencia relativa se obtiene:", o: ["Dividiendo la frecuencia absoluta para el total de datos", "Sumando las frecuencias", "Multiplicando la frecuencia por 100", "Restando el mínimo al máximo"] },
  { q: "El rango (recorrido) de un conjunto de datos es:", o: ["Máximo menos mínimo", "La suma de los datos", "El dato central", "El promedio de los extremos"] },
  { q: "La probabilidad de un suceso imposible es:", o: ["0", "1", "0,5", "−1"] },
  { q: "El percentil 50 coincide con:", o: ["La mediana", "La media", "La moda", "El primer cuartil"] },
]);

// ================= ANATOMÍA Y FISIOLOGÍA =================
bank("an.bank", [
  { q: "¿Cuántos huesos tiene aproximadamente el esqueleto de un adulto?", o: ["206", "180", "256", "300"] },
  { q: "El hueso que protege el encéfalo es:", o: ["El cráneo", "El esternón", "La pelvis", "La escápula"] },
  { q: "El hueso del brazo (entre hombro y codo) es el:", o: ["Húmero", "Cúbito", "Radio", "Fémur"] },
  { q: "La rótula (patela) se encuentra en:", o: ["La rodilla", "El codo", "El tobillo", "La cadera"] },
  { q: "¿Cuántas vértebras cervicales tiene el ser humano?", o: ["7", "12", "5", "4"] },
  { q: "¿Cuántos pares de costillas tiene normalmente el ser humano?", o: ["12", "10", "14", "7"] },
  { q: "El músculo principal de la respiración es:", o: ["El diafragma", "El bíceps", "El trapecio", "El deltoides"] },
  { q: "El tendón de Aquiles une el músculo de la pantorrilla con el:", o: ["Calcáneo", "Fémur", "Peroné", "Astrágalo"] },
  { q: "El músculo que permite extender el codo es el:", o: ["Tríceps braquial", "Bíceps braquial", "Pectoral mayor", "Dorsal ancho"] },
  { q: "Las células que forman nuevo tejido óseo son los:", o: ["Osteoblastos", "Osteoclastos", "Condrocitos", "Fibroblastos"] },
  { q: "La cavidad del corazón que bombea sangre hacia todo el cuerpo es:", o: ["El ventrículo izquierdo", "La aurícula derecha", "El ventrículo derecho", "La aurícula izquierda"] },
  { q: "¿Cuántas cavidades tiene el corazón humano?", o: ["4", "2", "3", "6"] },
  { q: "La arteria más grande del cuerpo es la:", o: ["Aorta", "Carótida", "Femoral", "Pulmonar"] },
  { q: "La vena cava superior desemboca en:", o: ["La aurícula derecha", "El ventrículo izquierdo", "La aurícula izquierda", "La aorta"] },
  { q: "Los vasos donde ocurre el intercambio de sustancias con los tejidos son los:", o: ["Capilares", "Arterias", "Venas", "Linfáticos mayores"] },
  { q: "La presión arterial considerada normal en un adulto es cercana a:", o: ["120/80 mmHg", "180/110 mmHg", "80/40 mmHg", "200/120 mmHg"] },
  { q: "La parte del encéfalo que regula la temperatura corporal, el hambre y la sed es el:", o: ["Hipotálamo", "Cerebelo", "Bulbo raquídeo", "Lóbulo occipital"] },
  { q: "El lóbulo cerebral relacionado principalmente con la visión es el:", o: ["Occipital", "Frontal", "Temporal", "Parietal"] },
  { q: "El bulbo raquídeo controla funciones como:", o: ["La respiración y el ritmo cardíaco", "La visión", "El lenguaje escrito", "La memoria a largo plazo"] },
  { q: "La unidad básica del sistema nervioso es la:", o: ["Neurona", "Nefrona", "Alveolo", "Sarcómera"] },
  { q: "El nervio que transmite los impulsos visuales al cerebro es el:", o: ["Óptico", "Olfatorio", "Vago", "Facial"] },
  { q: "El sistema nervioso simpático, ante una situación de peligro:", o: ["Acelera el corazón y dilata las pupilas", "Favorece la digestión", "Disminuye la glucosa", "Contrae los bronquios"] },
  { q: "La glándula conocida como «glándula maestra» por regular a otras es la:", o: ["Hipófisis", "Tiroides", "Suprarrenal", "Paratiroides"] },
  { q: "La hormona que regula el calcio elevando su nivel en sangre es la:", o: ["Parathormona", "Insulina", "Adrenalina", "Melatonina"] },
  { q: "La hormona que regula el ciclo de sueño es la:", o: ["Melatonina", "Tiroxina", "Insulina", "Oxitocina"] },
  { q: "La bilis se almacena en:", o: ["La vesícula biliar", "El páncreas", "El estómago", "El bazo"] },
  { q: "La digestión química del almidón comienza en:", o: ["La boca, con la amilasa salival", "El estómago", "El intestino grueso", "El esófago"] },
  { q: "Los movimientos que impulsan el alimento por el tubo digestivo se llaman:", o: ["Peristálticos", "Reflejos", "Voluntarios", "Sinápticos"] },
  { q: "Las vellosidades intestinales sirven para:", o: ["Aumentar la superficie de absorción", "Producir bilis", "Triturar el alimento", "Producir insulina"] },
  { q: "El órgano donde se almacena la orina es:", o: ["La vejiga", "El uréter", "La uretra", "El riñón"] },
  { q: "Los conductos que llevan la orina del riñón a la vejiga son los:", o: ["Uréteres", "Uretras", "Túbulos colectores", "Vasos deferentes"] },
  { q: "Los alvéolos pulmonares están rodeados de:", o: ["Capilares sanguíneos", "Cartílago", "Músculo esquelético", "Hueso"] },
  { q: "La laringe contiene:", o: ["Las cuerdas vocales", "Los alvéolos", "Las amígdalas palatinas", "El diafragma"] },
  { q: "El tejido que recubre las superficies del cuerpo y órganos es el:", o: ["Epitelial", "Muscular", "Nervioso", "Óseo"] },
  { q: "La capa más externa de la piel es la:", o: ["Epidermis", "Dermis", "Hipodermis", "Fascia"] },
  { q: "La parte del ojo que regula la entrada de luz es:", o: ["El iris", "La retina", "El cristalino", "La córnea"] },
  { q: "Las células de la retina que permiten ver los colores son los:", o: ["Conos", "Bastones", "Melanocitos", "Neuroglías"] },
  { q: "El órgano del oído interno relacionado con el equilibrio es:", o: ["El aparato vestibular", "El yunque", "El tímpano", "La trompa de Eustaquio"] },
  { q: "Paciente con dolor en la fosa ilíaca derecha, fiebre y náuseas. ¿Qué órgano se sospecha inflamado?", o: ["El apéndice", "El bazo", "El páncreas", "El esófago"] },
  { q: "Un adulto mayor tiene huesos frágiles que se fracturan con facilidad por pérdida de masa ósea. Esto se llama:", o: ["Osteoporosis", "Artritis", "Escoliosis", "Osteomielitis"] },
  { q: "Paciente con piel y ojos amarillos y orina oscura. ¿Qué órgano está probablemente afectado?", o: ["El hígado", "El riñón", "El pulmón", "La tiroides"] },
  { q: "Tras un golpe fuerte en la parte posterior de la cabeza, una persona pierde parcialmente la visión aunque sus ojos están sanos. ¿Qué lóbulo pudo afectarse?", o: ["El occipital", "El frontal", "El temporal", "El parietal"] },
  { q: "La anemia ferropénica se debe principalmente a la falta de:", o: ["Hierro", "Calcio", "Vitamina C", "Yodo"] },
  { q: "El bocio (aumento de la tiroides) se asocia con la deficiencia de:", o: ["Yodo", "Hierro", "Sodio", "Potasio"] },
  { q: "La articulación del hombro es de tipo:", o: ["Esferoidea (enartrosis)", "Bisagra (troclear)", "Pivote", "Sutura"] },
]);

const BONES = [["Clavícula", "Cintura escapular"], ["Fémur", "Muslo"], ["Tibia", "Pierna"], ["Cúbito", "Antebrazo"], ["Esternón", "Tórax"], ["Escápula", "Espalda superior"], ["Mandíbula", "Cara"], ["Calcáneo", "Pie"], ["Sacro", "Pelvis"], ["Atlas", "Columna cervical"], ["Falanges", "Dedos"], ["Ilion", "Cadera"]];
dict("an.bones", BONES, pairQ(a => `¿En qué región del cuerpo se encuentra el hueso «${a}»?`, b => `¿Qué hueso se encuentra en la región: ${b.toLowerCase()}?`));
const GLANDS = [["Páncreas", "Insulina"], ["Tiroides", "Tiroxina"], ["Hipófisis", "Hormona del crecimiento"], ["Glándula pineal", "Melatonina"], ["Médula suprarrenal", "Adrenalina"], ["Ovarios", "Estrógenos"], ["Testículos", "Testosterona"], ["Paratiroides", "Parathormona"], ["Corteza suprarrenal", "Cortisol"]];
dict("an.glands", GLANDS, pairQ(a => `¿Qué hormona produce principalmente la glándula: ${a.toLowerCase()}?`, b => `¿Qué glándula produce: ${b.toLowerCase()}?`));

// ================= EMPRENDIMIENTO Y ADMINISTRACIÓN (FECYT-FACAE) =================
bank("em.bank", [
  { q: "La etapa del proceso administrativo en la que se fijan objetivos y se decide qué hacer es la:", o: ["Planeación", "Dirección", "Control", "Organización"] },
  { q: "La etapa del proceso administrativo que compara lo logrado con lo planificado es el:", o: ["Control", "Planeación", "Organización", "Reclutamiento"] },
  { q: "Un costo que cambia según la cantidad producida es:", o: ["Costo variable", "Costo fijo", "Costo hundido", "Gasto financiero"] },
  { q: "En una heladería, ¿cuál es un costo fijo?", o: ["El arriendo del local", "La leche", "Los conos", "Los sabores"] },
  { q: "En una sastrería, ¿cuál es materia prima?", o: ["La tela", "El sueldo del sastre", "La luz del taller", "El arriendo"] },
  { q: "La utilidad bruta se obtiene restando a las ventas:", o: ["El costo de ventas", "Los impuestos", "Los dividendos", "Los activos"] },
  { q: "En el análisis FODA, una nueva ley que favorece a tu sector es:", o: ["Una oportunidad", "Una fortaleza", "Una debilidad", "Una amenaza"] },
  { q: "En el análisis FODA, tener personal poco capacitado es:", o: ["Una debilidad", "Una amenaza", "Una oportunidad", "Una fortaleza"] },
  { q: "En el marketing mix, decidir en qué tiendas se venderá el producto corresponde a:", o: ["Plaza (distribución)", "Precio", "Producto", "Promoción"] },
  { q: "Segmentar el mercado por estilo de vida y valores es segmentación:", o: ["Psicográfica", "Geográfica", "Demográfica", "Conductual"] },
  { q: "Según la ley de la oferta, si el precio de un bien sube:", o: ["La cantidad ofrecida aumenta", "La cantidad ofrecida disminuye", "La demanda aumenta", "No cambia nada"] },
  { q: "La inflación es:", o: ["El aumento generalizado y sostenido de los precios", "La disminución de los impuestos", "El aumento del empleo", "La caída de las exportaciones"] },
  { q: "En la etapa de madurez del ciclo de vida del producto:", o: ["Las ventas se estabilizan en su nivel más alto", "El producto recién se lanza", "Las ventas caen fuertemente", "No hay competencia"] },
  { q: "En la pirámide de Maslow, las necesidades de pertenencia y amistad son:", o: ["Sociales (afiliación)", "Fisiológicas", "De seguridad", "De autorrealización"] },
  { q: "Una distribuidora que adquiere cuadernos a las fábricas y los vende a papelerías es una empresa:", o: ["Comercial", "Industrial", "De servicios", "Extractiva"] },
  { q: "Una empresa que extrae petróleo es del sector:", o: ["Primario (extractivo)", "Terciario", "Cuaternario", "De servicios"] },
  { q: "En Ecuador, la institución que regula a las compañías es la:", o: ["Superintendencia de Compañías", "Superintendencia de Bancos", "Contraloría", "CNE"] },
  { q: "En Ecuador, la afiliación de los trabajadores a la seguridad social se realiza en el:", o: ["IESS", "SRI", "Municipio", "Registro Civil"] },
  { q: "En Ecuador, el impuesto que grava la venta de la mayoría de bienes y servicios es el:", o: ["IVA", "ICE", "Impuesto predial", "Impuesto a la herencia"] },
  { q: "La técnica de investigación que consiste en conversar a profundidad con una persona es:", o: ["La entrevista", "La encuesta", "La observación", "El experimento"] },
  { q: "En el modelo Canvas, el bloque «segmentos de clientes» describe:", o: ["A quiénes se dirige el negocio", "Cuánto cuesta producir", "Quiénes son los socios", "Los canales de pago"] },
  { q: "Crear un producto totalmente nuevo que cambia un mercado es innovación:", o: ["Disruptiva (radical)", "Incremental", "De proceso menor", "Imitativa"] },
  { q: "Un activo fijo de una panadería es:", o: ["El horno", "La harina", "El dinero en caja", "Las cuentas por cobrar"] },
  { q: "El punto de equilibrio es el nivel de ventas en el que:", o: ["Los ingresos totales igualan a los costos totales", "La utilidad es máxima", "No hay costos fijos", "Se pagan dividendos"] },
  { q: "La TIR (tasa interna de retorno) de un proyecto es la tasa que hace que:", o: ["El VAN sea igual a cero", "Las ventas se dupliquen", "Los costos sean cero", "La inflación baje"] },
  { q: "El organigrama de una empresa representa:", o: ["Su estructura jerárquica", "Su flujo de caja", "Sus ventas mensuales", "Su inventario"] },
  { q: "La misión de una empresa expresa:", o: ["Su razón de ser actual", "Lo que quiere ser en el futuro", "Sus estados financieros", "Su lista de precios"] },
  { q: "La persona o empresa que compra los productos o servicios de un negocio es el:", o: ["Cliente", "Proveedor", "Competidor", "Accionista"] },
  { q: "El liderazgo en el que el jefe consulta y toma en cuenta la opinión del equipo es:", o: ["Democrático (participativo)", "Autocrático", "Laissez-faire", "Burocrático"] },
  { q: "La depreciación de la maquinaria de producción forma parte de los:", o: ["Costos indirectos de fabricación", "Gastos de ventas", "Ingresos no operacionales", "Pasivos corrientes"] },
]);

// ================= LECTURA CIENTÍFICA (módulo Yachay) =================
passages("yc.read", [
  { title: "El colibrí y su metabolismo", text: "Los colibríes tienen uno de los metabolismos más acelerados del reino animal: su corazón puede latir más de 1 000 veces por minuto durante el vuelo. Para obtener tanta energía, consumen néctar varias veces por hora. Durante las noches frías de los Andes, muchos colibríes entran en un estado llamado torpor: reducen su temperatura corporal y su ritmo cardíaco hasta en un 90 %, lo que les permite ahorrar la energía que de otra forma perderían antes del amanecer.",
    qs: [
      { q: "¿Para qué sirve el torpor a los colibríes?", o: ["Para ahorrar energía en la noche", "Para volar más rápido", "Para buscar néctar de noche", "Para aumentar su temperatura"] },
      { q: "Si una noche fuera inusualmente cálida, lo más probable es que el colibrí:", o: ["Necesite reducir menos su metabolismo", "Entre en un torpor más profundo", "Deje de comer al día siguiente", "Aumente su ritmo cardíaco a 2 000"] },
      { q: "En el texto, «acelerado» significa:", o: ["Muy rápido", "Muy débil", "Interrumpido", "Desordenado"] },
    ] },
  { title: "Baterías de litio", text: "Las baterías de iones de litio funcionan gracias al movimiento de iones entre dos electrodos. Al cargar, los iones viajan del cátodo al ánodo, donde quedan almacenados; al usar el dispositivo, regresan al cátodo y liberan energía eléctrica. Con cada ciclo, pequeñas reacciones secundarias forman capas que atrapan parte de los iones. Por eso, con los años, la batería conserva menos carga. Las altas temperaturas aceleran estas reacciones.",
    qs: [
      { q: "¿Por qué una batería pierde capacidad con el tiempo?", o: ["Porque reacciones secundarias atrapan iones", "Porque el litio se evapora", "Porque el cátodo desaparece", "Porque los electrones se agotan para siempre"] },
      { q: "Según el texto, dejar el celular al sol mientras se carga:", o: ["Puede acelerar su desgaste", "Mejora la batería", "No tiene ningún efecto", "Detiene las reacciones secundarias"] },
      { q: "Durante el uso del dispositivo, los iones se mueven:", o: ["Del ánodo al cátodo", "Del cátodo al ánodo", "Fuera de la batería", "No se mueven"] },
    ] },
  { title: "Manglares y carbono", text: "Los manglares de la costa ecuatoriana almacenan, por hectárea, varias veces más carbono que muchos bosques tropicales de tierra firme. Gran parte de ese carbono no está en los árboles sino en el suelo fangoso, donde la falta de oxígeno retrasa la descomposición de la materia orgánica. Cuando un manglar se tala para construir piscinas camaroneras, ese suelo queda expuesto al aire y el carbono acumulado durante siglos se libera como dióxido de carbono.",
    qs: [
      { q: "¿Dónde se almacena la mayor parte del carbono del manglar?", o: ["En el suelo fangoso", "En las hojas", "En el agua de mar", "En los camarones"] },
      { q: "¿Por qué la materia orgánica se descompone lentamente en ese suelo?", o: ["Por la falta de oxígeno", "Por el exceso de luz", "Por la salinidad del aire", "Por la presencia de camarones"] },
      { q: "Del texto se puede concluir que talar un manglar:", o: ["Contribuye al aumento de CO₂ en la atmósfera", "Reduce el CO₂ atmosférico", "No afecta el clima", "Aumenta el carbono del suelo"] },
    ] },
]);
