// Guía gratuita (imán de contactos) que se envía por correo desde la página de Asesoría académica.
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const STEPS = [
  ["Delimita el tema", "Pasa de un tema amplio («la contaminación») a una pregunta concreta, medible y con contexto («¿Cómo influye el tráfico vehicular en la calidad del aire del centro de Ibarra?»)."],
  ["Revisa antecedentes antes de escribir", "Lee al menos 10–15 fuentes académicas recientes (Google Académico, Scielo, Redalyc, repositorios universitarios) y anota qué dicen y qué falta por investigar."],
  ["Construye objetivos con verbos medibles", "Un objetivo general y 3 específicos. Usa verbos como analizar, determinar, comparar, diseñar. Evita «conocer» o «entender»."],
  ["Arma el esquema antes del borrador", "Introducción, marco teórico, metodología, resultados, discusión y conclusiones. Cada capítulo debe responder a un objetivo."],
  ["Cita mientras escribes (APA 7)", "Autor y año en el texto: (Pérez, 2023). Guarda cada referencia en un gestor como Zotero o Mendeley desde el primer día."],
  ["Escribe párrafos con una sola idea", "Oración temática + desarrollo con evidencia + cierre que conecte con la siguiente idea. Entre 5 y 8 líneas por párrafo."],
];

export const ACADEMIC_GUIDE_HTML = (name, waUrl) => `<!doctype html><html><body style="margin:0;background:#F5F5F7;padding:24px 12px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden">
<tr><td style="background:#0B2A5B;padding:24px 28px;color:#fff;font:700 20px Arial,sans-serif">For <span style="color:#F5B921">Winners</span><div style="font:400 14px Arial,sans-serif;color:#D6E2FA;margin-top:6px">Guía rápida de redacción académica</div></td></tr>
<tr><td style="padding:28px;font:15px/1.6 Arial,sans-serif;color:#1D1D1F">
<p style="font-size:18px;margin-top:0">Hola ${esc(String(name).split(" ")[0])}, aquí tienes tus 6 pasos para empezar con buen pie:</p>
${STEPS.map(([t, d], i) => `<div style="margin:14px 0"><b style="color:#0B2A5B">${i + 1}. ${t}</b><br><span style="color:#444">${d}</span></div>`).join("")}
<div style="border:2px dashed #F5B921;border-radius:12px;padding:16px;margin:20px 0;text-align:center">🔒 La guía completa (estructura por capítulos, plantillas de marco teórico, metodología y matriz de consistencia) la trabajamos contigo en la <b>asesoría personalizada</b>.</div>
<div style="text-align:center"><a href="${esc(waUrl)}" style="display:inline-block;background:#F5B921;color:#2B2000;font:700 16px Arial,sans-serif;padding:14px 28px;border-radius:40px;text-decoration:none">Agendar mi asesoría</a></div>
</td></tr>
<tr><td style="background:#F5F5F7;padding:16px 28px;font:12px Arial,sans-serif;color:#6E6E73">For Winners · Ibarra, Ecuador</td></tr>
</table></body></html>`;
