// Sitio web de For Winners: páginas HTML (una por ruta) + islas de React.
// - web/*.html: cada página. <!--@nav--> y <!--@footer--> se reemplazan por web/partials/*.html.
// - public/: se copia tal cual (motor de simuladores, PDF, datos, imágenes, fw-content.js del panel).
// - dist/: lo que publica Cloudflare (wrangler.jsonc → assets.directory).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, basename } from "node:path";

const WEB = resolve(__dirname, "web");
const pages = readdirSync(WEB).filter(f => f.endsWith(".html"));

function partials() {
  const read = n => readFileSync(resolve(WEB, "partials", n + ".html"), "utf8");
  return {
    name: "fw-partials",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const page = basename(ctx.filename);
        const mark = s => s.replace(new RegExp(`href="${page.replace(".", "\\.")}"`, "g"), `href="${page}" aria-current="page"`);
        return html.replace("<!--@nav-->", mark(read("nav"))).replace("<!--@footer-->", mark(read("footer")));
      },
    },
  };
}

export default defineConfig({
  root: WEB,
  publicDir: resolve(__dirname, "public"),
  plugins: [partials(), react()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: { input: Object.fromEntries(pages.map(p => [p.replace(".html", ""), resolve(WEB, p)])) },
  },
  server: { proxy: { "/api": "http://localhost:8787" } },
});
