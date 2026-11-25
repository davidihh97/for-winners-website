// Efectos de temporada: pocas partículas en un canvas que no recibe clics, una cinta fina bajo el menú
// y un saludo pequeño (una vez al día) con el botón «Quitar adornos».
// Reglas: nunca se dibuja encima de botones, campos ni del menú; se pausa con la pestaña oculta;
// con «reducir movimiento» no hay partículas; respeta el modo oscuro; el visitante puede apagarlo.

const OFF_KEY = "fw-adornos";
const COUNT = { baja: 14, media: 26, alta: 44 };
const AVOID = "a.btn, .btn, button, input, select, textarea, .wa, .site-nav, .sub, dialog[open], .fw-season, .notice, .aviso";

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
};
const dark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

const SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/></svg>';

export function mount(res, { edit = false } = {}) {
  const v = res.variant;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  root.dataset.season = res.theme.id;
  const cleanups = [() => { delete root.dataset.season; }];
  let enabled = edit || store.get(OFF_KEY) !== "off";

  // ---------- cinta bajo el menú ----------
  const nav = document.querySelector(".site-nav");
  let ribbon = null;
  if (nav && v.ribbon && v.ribbon !== "none") {
    ribbon = document.createElement("div");
    ribbon.className = `fw-ribbon fw-ribbon--${v.ribbon}`;
    ribbon.setAttribute("aria-hidden", "true");
    const cs = (dark() && v.dk) || v.c;
    cs.slice(0, 4).forEach((c, i) => ribbon.style.setProperty(`--s${i + 1}`, c));
    for (let i = cs.length; i < 4; i++) ribbon.style.setProperty(`--s${i + 1}`, cs[i % cs.length]);
    nav.appendChild(ribbon);
    cleanups.push(() => ribbon.remove());
  }

  // ---------- partículas ----------
  let canvas = null, raf = 0, running = false;
  if (!reduce) {
    canvas = document.createElement("canvas");
    canvas.className = "fw-season-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, rects = [], colors = v.c, parts = [], bursts = [], lastBurst = 0, rectsDirty = true;

    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      colors = (dark() && v.dk) || v.c;
      rectsDirty = true;
    };
    const readRects = () => {
      rects = [];
      for (const el of document.querySelectorAll(AVOID)) {
        const r = el.getBoundingClientRect();
        if (r.width && r.height && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W) rects.push([r.left - 8, r.top - 8, r.right + 8, r.bottom + 8]);
      }
      rectsDirty = false;
    };
    const blocked = (x, y) => { for (const r of rects) if (x > r[0] && x < r[2] && y > r[1] && y < r[3]) return true; return false; };

    const n = Math.round((COUNT[res.intensity] || COUNT.baja) * (innerWidth < 700 ? .6 : 1) * (v.big ? .6 : 1));
    const make = (fresh) => {
      const kind = v.mix && Math.random() < .35 ? v.mix : v.fx;
      const p = { kind, x: rnd(0, W), y: fresh ? rnd(-H, 0) : rnd(0, H), rot: rnd(0, Math.PI * 2), vr: rnd(-.02, .02), ph: rnd(0, Math.PI * 2), c: pick(colors), a: rnd(.55, .95) };
      switch (kind) {
        case "snow": p.s = v.big ? rnd(5, 9) : rnd(2, 4.2); p.vy = rnd(.35, .9); p.vx = rnd(-.2, .2); break;
        case "hearts": p.s = rnd(7, 12); p.vy = rnd(.4, .8); p.vx = rnd(-.15, .15); break;
        case "confetti": p.s = rnd(5, 9); p.vy = rnd(.6, 1.2); p.vx = rnd(-.3, .3); p.vr = rnd(-.08, .08); break;
        case "petals": case "leaves": p.s = rnd(6, 11); p.vy = rnd(.4, .9); p.vx = rnd(-.3, .3); p.vr = rnd(-.03, .03); break;
        case "sparkles": p.s = rnd(3, 7); p.vy = rnd(.05, .2); p.vx = rnd(-.1, .1); p.life = rnd(0, 1); p.y = rnd(0, H); break;
        case "bats": p.s = rnd(9, 15); p.vx = rnd(.4, 1) * (Math.random() < .5 ? -1 : 1); p.vy = 0; p.y = rnd(H * .1, H * .7); p.x = fresh ? (p.vx > 0 ? rnd(-W * .5, -20) : rnd(W + 20, W * 1.5)) : rnd(0, W); break;
        case "glyphs": p.s = rnd(13, 20); p.vy = rnd(.3, .7); p.vx = rnd(-.1, .1); p.vr = rnd(-.006, .006); p.rot = rnd(-.3, .3); p.g = pick(v.glyphs || ["★"]); p.a = rnd(.35, .6); break;
        case "balloons": case "bubbles": p.s = kind === "balloons" ? rnd(10, 15) : rnd(4, 10); p.vy = -rnd(.35, .8); p.vx = rnd(-.15, .15); p.y = fresh ? rnd(H, H * 2) : rnd(0, H); break;
        default: p.s = 3; p.vy = .5; p.vx = 0;
      }
      return p;
    };

    const heart = (s) => {
      ctx.beginPath(); ctx.moveTo(0, s * .35);
      ctx.bezierCurveTo(-s, -s * .3, -s * .45, -s, 0, -s * .45);
      ctx.bezierCurveTo(s * .45, -s, s, -s * .3, 0, s * .35); ctx.fill();
    };
    const star4 = (s) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) { const r = i % 2 ? s * .28 : s; const t = (i * Math.PI) / 4; ctx.lineTo(Math.cos(t) * r, Math.sin(t) * r); }
      ctx.closePath(); ctx.fill();
    };
    const flake = (s) => {
      ctx.lineWidth = 1.2; ctx.lineCap = "round"; ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const t = (i * Math.PI) / 3, cx = Math.cos(t), sy = Math.sin(t);
        ctx.moveTo(0, 0); ctx.lineTo(cx * s, sy * s);
        const bx = cx * s * .6, by = sy * s * .6, t1 = t + .6, t2 = t - .6;
        ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(t1) * s * .3, by + Math.sin(t1) * s * .3);
        ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(t2) * s * .3, by + Math.sin(t2) * s * .3);
      }
      ctx.stroke();
    };
    const bat = (s, t) => {
      const f = Math.sin(t) * .5;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-s * .5, -s * (.5 + f), -s, -s * f * .6);
      ctx.quadraticCurveTo(-s * .6, s * .05, -s * .35, s * .15);
      ctx.quadraticCurveTo(-s * .15, s * .05, 0, s * .3);
      ctx.quadraticCurveTo(s * .15, s * .05, s * .35, s * .15);
      ctx.quadraticCurveTo(s * .6, s * .05, s, -s * f * .6);
      ctx.quadraticCurveTo(s * .5, -s * (.5 + f), 0, 0); ctx.fill();
    };

    const draw = (p, t) => {
      if (blocked(p.x, p.y)) return;
      ctx.save(); ctx.translate(p.x, p.y); ctx.globalAlpha = p.a; ctx.fillStyle = ctx.strokeStyle = p.c;
      switch (p.kind) {
        case "snow":
          if (v.big) { ctx.rotate(p.rot); flake(p.s); } else { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 7); ctx.fill(); }
          break;
        case "hearts": ctx.rotate(Math.sin(t / 900 + p.ph) * .3); heart(p.s); break;
        case "confetti": ctx.rotate(p.rot); ctx.scale(1, Math.cos(t / 300 + p.ph)); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); break;
        case "petals": ctx.rotate(p.rot); ctx.scale(1, .55 + .45 * Math.cos(t / 500 + p.ph)); ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .5, 0, 0, 7); ctx.fill(); break;
        case "leaves":
          ctx.rotate(p.rot); ctx.beginPath(); ctx.moveTo(-p.s, 0);
          ctx.quadraticCurveTo(0, -p.s * .7, p.s, 0); ctx.quadraticCurveTo(0, p.s * .7, -p.s, 0); ctx.fill();
          break;
        case "sparkles": ctx.globalAlpha = p.a * Math.sin(p.life * Math.PI); ctx.rotate(p.rot); star4(p.s); break;
        case "bats": if (p.vx < 0) ctx.scale(-1, 1); bat(p.s, t / 90 + p.ph); break;
        case "glyphs": ctx.rotate(p.rot); ctx.font = `600 ${p.s}px Inter, system-ui, sans-serif`; ctx.textAlign = "center"; ctx.fillText(p.g, 0, 0); break;
        case "balloons":
          ctx.rotate(Math.sin(t / 1200 + p.ph) * .12); ctx.beginPath(); ctx.ellipse(0, 0, p.s * .8, p.s, 0, 0, 7); ctx.fill();
          ctx.globalAlpha = p.a * .5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, p.s); ctx.quadraticCurveTo(4, p.s * 1.8, 0, p.s * 2.6); ctx.stroke();
          break;
        case "bubbles": ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 7); ctx.stroke(); ctx.globalAlpha = p.a * .3; ctx.fill(); break;
      }
      ctx.restore();
    };

    const burst = () => {
      const x = rnd(W * .12, W * .88), y = rnd(H * .18, H * .5), c = pick(colors), k = 26;
      for (let i = 0; i < k; i++) {
        const a = (i / k) * Math.PI * 2, sp = rnd(1.2, 2.6);
        bursts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c });
      }
    };

    let last = 0;
    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(3, last ? (t - last) / 16.7 : 1);
      last = t;
      if (rectsDirty) readRects();
      ctx.clearRect(0, 0, W, H);
      if (v.fx === "fireworks") {
        const every = { baja: 2600, media: 1700, alta: 1100 }[res.intensity] || 2600;
        if (t - lastBurst > every) { burst(); lastBurst = t; }
        bursts = bursts.filter(b => b.life > 0);
        for (const b of bursts) {
          b.x += b.vx * dt; b.y += b.vy * dt; b.vy += .025 * dt; b.vx *= .985; b.life -= .011 * dt;
          if (blocked(b.x, b.y)) continue;
          ctx.globalAlpha = Math.max(0, b.life); ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(b.x, b.y, 1.8, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
        return;
      }
      for (const p of parts) {
        p.x += (p.vx + Math.sin(t / 1600 + p.ph) * (p.kind === "bats" ? 0 : .25)) * dt;
        p.y += (p.vy + (p.kind === "bats" ? Math.sin(t / 500 + p.ph) * .4 : 0)) * dt;
        p.rot += p.vr * dt;
        if (p.kind === "sparkles") { p.life += .004 * dt; if (p.life >= 1) Object.assign(p, make(false), { life: 0 }); }
        const out = p.kind === "bats" ? (p.vx > 0 ? p.x > W + 30 : p.x < -30)
          : p.vy < 0 ? p.y < -40 : p.y > H + 30 || p.x < -40 || p.x > W + 40;
        if (out) Object.assign(p, make(true));
        draw(p, t);
      }
    };

    const start = () => { if (!running && enabled && !document.hidden) { running = true; last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVis = () => (document.hidden ? stop() : start());
    const onScroll = () => { rectsDirty = true; };
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => { size(); parts.forEach(p => { p.c = pick(colors); }); };

    size();
    parts = v.fx === "fireworks" ? [] : Array.from({ length: n }, () => make(false));
    addEventListener("resize", size);
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    mq.addEventListener?.("change", onScheme);
    const ro = new ResizeObserver(onScroll); ro.observe(document.body);
    start();
    canvas._start = start; canvas._stop = stop;
    cleanups.push(() => {
      stop(); canvas.remove(); ro.disconnect();
      removeEventListener("resize", size); removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis); mq.removeEventListener?.("change", onScheme);
    });
  }

  // ---------- saludo + «Quitar adornos» ----------
  const box = document.createElement("div");
  box.className = "fw-season";
  const today = new Date().toISOString().slice(0, 10);
  const seenKey = "fw-saludo";
  const showGreet = res.greet && (edit || store.get(seenKey) !== `${res.key}|${today}`);
  box.innerHTML =
    (showGreet ? `<p class="fw-greet" role="status"><span></span><button type="button" class="fw-greet-x" aria-label="Cerrar saludo">×</button></p>` : "") +
    `<button type="button" class="fw-toggle" aria-pressed="false">${SPARK}</button>`;
  if (showGreet) box.querySelector(".fw-greet span").textContent = res.greet;
  document.body.appendChild(box);
  cleanups.push(() => box.remove());

  const toggle = box.querySelector(".fw-toggle");
  const paint = () => {
    toggle.setAttribute("aria-pressed", String(!enabled));
    toggle.setAttribute("aria-label", enabled ? "Quitar adornos de temporada" : "Mostrar adornos de temporada");
    toggle.title = enabled ? "Quitar adornos" : "Mostrar adornos";
    box.classList.toggle("is-off", !enabled);
    root.classList.toggle("fw-season-off", !enabled);
    if (canvas) { canvas.hidden = !enabled; enabled ? canvas._start() : canvas._stop(); }
  };
  toggle.addEventListener("click", () => {
    enabled = !enabled;
    if (!edit) store.set(OFF_KEY, enabled ? "on" : "off");
    paint();
  });
  paint();
  cleanups.push(() => root.classList.remove("fw-season-off"));

  if (showGreet) {
    const g = box.querySelector(".fw-greet");
    const close = () => { g.classList.add("bye"); setTimeout(() => g.remove(), 350); };
    if (!edit) store.set(seenKey, `${res.key}|${today}`);
    g.querySelector(".fw-greet-x").addEventListener("click", close);
    if (!edit) { const tm = setTimeout(close, 9000); cleanups.push(() => clearTimeout(tm)); }
  }

  return () => cleanups.forEach(f => f());
}
