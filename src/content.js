// Contenido editable desde el panel (admin.forwinnersec.com).
// El panel guarda en D1 (tabla content, clave 'site_published') y aquí se inyecta en cada página.

const TTL = 30_000; // ms: lo publicado tarda como máximo esto en verse en cada servidor
let cache = { at: 0, value: null, json: "null" };

// Solo el panel puede mostrar la web dentro de un marco (modo edición). Evita que otros sitios la incrusten.
const FRAME_ANCESTORS = "frame-ancestors 'self' https://admin.forwinnersec.com http://localhost:5173 http://localhost:8788 http://localhost:4173";

export async function published(env) {
  if (Date.now() - cache.at < TTL) return cache;
  let value = null;
  try {
    const row = env.DB && (await env.DB.prepare("SELECT value FROM content WHERE key = 'site_published'").first());
    value = row ? JSON.parse(row.value) : null;
  } catch (e) {
    // Si la tabla aún no existe (migración 0004 sin aplicar), la web sigue igual que siempre.
    if (!/no such table/i.test(String(e))) console.error("content", e);
  }
  // Las secciones y cambios del panel van al navegador; el JSON se escapa para poder ir dentro de <script>.
  const json = JSON.stringify(value).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, " ");
  cache = { at: Date.now(), value, json };
  return cache;
}

/** WhatsApp configurado en el panel (si ya se leyó lo publicado). */
export const publishedWa = () => String(cache.value?.config?.whatsapp || "").replace(/\D/g, "");

const pageOf = pathname => {
  const last = pathname.split("/").pop() || "index.html";
  return last.includes(".") ? last : `${last}.html`;
};

/** Agrega window.FW_CONTENT y el título/descripción de Google a cada página HTML. */
export async function withContent(response, env, url) {
  const type = response.headers.get("Content-Type") || "";
  if (!type.includes("text/html")) return response;
  const { value, json } = await published(env);
  const seo = value?.seo?.[pageOf(url.pathname)] || {};
  let rw = new HTMLRewriter().on("head", {
    element(el) {
      el.append(`<script>window.FW_CONTENT=${json};</script>`, { html: true });
    },
  });
  if (seo.title) rw = rw.on("title", { element(el) { el.setInnerContent(seo.title); } })
    .on('meta[property="og:title"]', { element(el) { el.setAttribute("content", seo.title); } });
  if (seo.description) rw = rw.on('meta[name="description"]', { element(el) { el.setAttribute("content", seo.description); } })
    .on('meta[property="og:description"]', { element(el) { el.setAttribute("content", seo.description); } });
  const out = rw.transform(response);
  const res = new Response(out.body, out);
  res.headers.set("Content-Security-Policy", FRAME_ANCESTORS);
  res.headers.set("Cache-Control", "no-cache");
  return res;
}

/** Imágenes subidas desde el panel: /m/<id> */
export async function media(env, id) {
  if (!env.DB || !/^[a-z0-9-]{8,64}$/i.test(id)) return new Response("No encontrado", { status: 404 });
  try {
    const row = await env.DB.prepare("SELECT mime, data FROM media WHERE id = ?").bind(id).first();
    if (!row) return new Response("No encontrado", { status: 404 });
    return new Response(new Uint8Array(row.data), {
      headers: { "Content-Type": row.mime, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch (e) {
    console.error("media", e);
    return new Response("No encontrado", { status: 404 });
  }
}
