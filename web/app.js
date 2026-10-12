// InsurCraft Fácil: una herramienta de PDF con botones grandes.
// Todo se procesa en el navegador; ningún archivo sale de la computadora.
import * as pdfjs from "./vendor/pdf.min.mjs";
import { PDFDocument, degrees } from "./vendor/pdf-lib.esm.min.js";
import { zipSync } from "./vendor/fflate.js";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdf.worker.min.mjs", import.meta.url).href;

// the full app ships next to this page (see .github/workflows/pages.yml)
const FULL_APP = "completa/";

// ---------------------------------------------------------------- icons
const P = {
  unir: '<rect x="3" y="3" width="8" height="11" rx="1.5"/><rect x="13" y="3" width="8" height="11" rx="1.5"/><path d="M7 17v1a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-1"/><path d="M12 21v-4"/>',
  separar: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9"/><path d="M14.5 14.5 20 20"/><path d="M8.1 8.1 12 12"/>',
  ordenar: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7"/><path d="m18 14.5 3 3-3 3"/>',
  firmar: '<path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5z"/><path d="M14 21h7"/>',
  clave: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><path d="M12 15v2"/>',
  achicar: '<path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="m14 10 7-7"/><path d="m3 21 7-7"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  upload: '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  rotate: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  move: '<path d="M5 9h14"/><path d="M5 15h14"/><path d="m9 5 3-3 3 3"/><path d="m15 19-3 3-3-3"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1"/><path d="M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  draw: '<path d="M3 17c3-6 5-6 6-3s2 4 4 0 4-6 8-2"/>',
  type: '<path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M9 19h6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  pages: '<rect x="4" y="2" width="12" height="16" rx="2"/><path d="M8 22h10a2 2 0 0 0 2-2V8"/>',
  pick: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>',
  feather: '<path d="M20 4c-8 0-14 6-14 14v2"/><path d="M6 14h7"/><path d="M9 10h8"/>',
  zip: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M10 6h1"/><path d="M10 9h1"/><path d="M10 12h1"/><rect x="9" y="14" width="3" height="4" rx="1"/>',
  unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  comment: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  redact: '<rect x="3" y="9" width="18" height="6" rx="1" fill="currentColor"/><path d="M3 5h12"/><path d="M3 19h9"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 1.5 1.5L12 8"/><path d="M14 9h2"/><path d="m8 15 1.5 1.5L12 14"/><path d="M14 15h2"/>',
  stamp: '<path d="M9 13V9a3 3 0 1 1 6 0v4"/><path d="M5 13h14v4H5z"/><path d="M4 21h16"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  warn: '<path d="M12 3 2 21h20z"/><path d="M12 10v5"/><path d="M12 18h.01"/>',
};
const icon = (name, size = 28, stroke = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

// ---------------------------------------------------------------- tools
const TOOLS = {
  unir: { name: "Unir", color: "#1D4ED8", dark: "#1E3A8A", light: "#EEF2FF", multi: true, steps: ["Agrega", "Ordena", "Guarda"], go: "UNIR" },
  separar: { name: "Separar", color: "#C2410C", dark: "#9A3412", light: "#FFF1E8", steps: ["Abre", "Elige", "Guarda"], go: "SEPARAR" },
  ordenar: { name: "Ordenar", color: "#6D28D9", dark: "#4C1D95", light: "#F3EEFF", steps: ["Abre", "Mueve y gira", "Guarda"], go: "GUARDAR" },
  firmar: { name: "Firmar", color: "#047857", dark: "#065F46", light: "#ECFDF5", steps: ["Abre", "Firma", "Guarda"], go: "LISTO" },
  clave: { name: "Poner clave", color: "#0E1530", dark: "#000000", light: "#E8EAF2", steps: ["Abre", "Escribe la clave", "Guarda"], go: "PONER CLAVE" },
  achicar: { name: "Achicar", color: "#A16207", dark: "#713F12", light: "#FEF6E0", steps: ["Abre", "Elige", "Guarda"], go: "ACHICAR" },
};
const MORE = [
  ["comment", "Comentar"], ["redact", "Tapar datos"], ["scan", "Escanear"],
  ["form", "Llenar"], ["stamp", "Sello"], ["grid", "Todo lo demás"],
];

// ---------------------------------------------------------------- state
let S = fresh();
function fresh() {
  return {
    screen: "home", tool: null, files: [], pending: [],
    // page-based tools work on files[0].pages
    splitMode: "each", picked: new Set(),
    shrinkMode: "normal",
    sig: { method: "draw", dataUrl: null, typed: "", page: 0, box: null, scale: 1 },
    pw: { a: "", b: "", show: false, remove: false },
    result: null, help: false, busy: null, error: null, ask: null,
  };
}
let nextId = 1;

const $app = document.getElementById("app");
const $input = document.getElementById("file-input");

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const hojas = (n) => plural(n, "hoja", "hojas");
const baseName = (name) => name.replace(/\.pdf$/i, "");
function size(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}
function setTheme(tool) {
  const t = TOOLS[tool];
  const r = document.documentElement.style;
  if (!t) { r.removeProperty("--tool"); r.removeProperty("--tool-dark"); r.removeProperty("--tool-light"); return; }
  r.setProperty("--tool", t.color); r.setProperty("--tool-dark", t.dark); r.setProperty("--tool-light", t.light);
}

// ---------------------------------------------------------------- render
function render() {
  setTheme(S.tool);
  let html;
  if (S.screen === "home") html = homeView();
  else if (S.screen === "done") html = doneView();
  else html = toolView();
  html += overlays();
  $app.innerHTML = html;
  afterRender();
}

function topbar() {
  return `<header class="topbar">
    <button class="brand" data-act="home" aria-label="InsurCraft Fácil, ir al inicio">
      <span class="brand-mark">${icon("doc", 26, 2.2).replace('stroke="currentColor"', 'stroke="#fff"')}</span>
      <span class="brand-name">InsurCraft</span><span class="brand-tag">Fácil</span>
    </button>
    <button class="pill" data-act="help">${icon("help", 26, 2.2)} Ayuda</button>
  </header>`;
}

function homeView() {
  const pend = S.pending.length
    ? `<div class="banner" role="status">${icon("doc", 34)}<span class="grow">Tienes <b>${esc(S.pending[0].name)}</b>. ¿Qué hacemos con él?</span>
         <button class="btn btn-line" data-act="clear-pending">Cancelar</button></div>`
    : "";
  const tiles = Object.entries(TOOLS).map(([k, t]) =>
    `<button class="tile" style="background:${t.color}" data-act="tool" data-tool="${k}">${icon(k, 72, 1.8)}<span class="tile-name">${t.name}</span></button>`).join("");
  const more = MORE.map(([ic, label]) =>
    `<a href="${FULL_APP}" target="_blank" rel="noopener">${icon(ic, 32)}${label}</a>`).join("");
  return `${topbar()}
  <main class="wrap">
    <h1 class="big">¿Qué quieres hacer?</h1>
    ${pend}
    <div class="tiles ${S.pending.length ? "pending" : ""}">${tiles}</div>
    <h2 class="sub">Más</h2>
    <p class="hint">Estas abren InsurCraft completo en otra pestaña.</p>
    <div class="more">${more}</div>
    <div class="drop small">${icon("upload", 48, 1.8)}<span class="drop-text">Suelta tu PDF aquí</span>
      <button class="btn btn-dark" data-act="pick">Buscar archivo</button></div>
    <p class="privacy">${icon("shield", 34)} Tus archivos no salen de tu computadora. Nada se sube a internet.</p>
  </main>`;
}

function stepsBar() {
  const t = TOOLS[S.tool];
  const cur = S.files.length === 0 ? 0 : 1;
  return `<ol class="steps" aria-label="Pasos">${t.steps.map((s, i) =>
    `<li class="${i === cur ? "on" : i < cur ? "done" : ""}" ${i === cur ? 'aria-current="step"' : ""}><span class="num">${i < cur ? icon("check", 26, 3) : i + 1}</span>${s}</li>`).join("")}</ol>`;
}

function toolView() {
  const t = TOOLS[S.tool];
  const body = S.files.length === 0 ? emptyDrop() : ({
    unir: unirView, separar: separarView, ordenar: ordenarView,
    firmar: firmarView, clave: claveView, achicar: achicarView,
  })[S.tool]();
  return `<header class="toolbar">
      <button class="back" data-act="home" aria-label="Volver al inicio">${icon("back", 30, 2.4)}</button>
      ${icon(S.tool, 44, 1.8)}<h1>${t.name}</h1>
    </header>
    <main class="wrap">${stepsBar()}${body}</main>`;
}

function emptyDrop() {
  const t = TOOLS[S.tool];
  return `<div class="drop">${icon("upload", 72, 1.6)}
    <span class="drop-text">${t.multi ? "Suelta tus PDF aquí" : "Suelta tu PDF aquí"}</span>
    <button class="btn btn-tool" data-act="pick">${icon("plus", 26, 2.6)} Buscar ${t.multi ? "archivos" : "archivo"}</button>
  </div>`;
}

function thumbImg(key, src) {
  return src ? `<img alt="" src="${src}" data-thumb="${key}">` : `<span class="ph" data-thumb="${key}"></span>`;
}

function fileStrip(f, extra = "") {
  return `<div class="file-strip"><span class="file-ic">${icon("doc", 30)}</span>
    <span class="grow"><b>${esc(f.name)}</b><span>${hojas(f.pageCount)} · ${size(f.bytes.length)}</span></span>
    ${extra}<button class="btn btn-line" data-act="change-file">Cambiar</button></div>`;
}

function footer(sumIcon, sum, sub, enabled) {
  const t = TOOLS[S.tool];
  return `<div class="footer-bar"><div class="footer-sum">${icon(sumIcon, 46, 1.8)}<span>${sum}${sub ? `<small>${sub}</small>` : ""}</span></div>
    <button class="btn-go" data-act="go" ${enabled ? "" : "disabled"}>${icon("check", 34, 2.8)} ${t.go}</button></div>`;
}

// --- Unir
function unirView() {
  const total = S.files.reduce((a, f) => a + f.pageCount, 0);
  const cards = S.files.map((f, i) => `<div class="card" draggable="true" data-drag="${i}">
      <span class="badge">${i + 1}</span>
      <div class="thumb">${thumbImg(`${f.id}-0`, f.pages[0].thumb)}</div>
      <span class="card-name" title="${esc(f.name)}">${esc(f.name)}</span>
      <span class="card-meta">${hojas(f.pageCount)}</span>
      <span class="card-actions">
        <button class="icon-btn" data-act="mv" data-i="${i}" data-d="-1" aria-label="Mover antes" ${i === 0 ? "disabled" : ""}>${icon("left", 24, 2.6)}</button>
        <button class="icon-btn danger" data-act="rm-file" data-i="${i}" aria-label="Quitar ${esc(f.name)}">${icon("x", 24, 2.6)}</button>
        <button class="icon-btn" data-act="mv" data-i="${i}" data-d="1" aria-label="Mover después" ${i === S.files.length - 1 ? "disabled" : ""}>${icon("right", 24, 2.6)}</button>
      </span></div>`).join("");
  return `<div class="cards">${cards}
      <button class="add-card" data-act="pick">${icon("plus", 64, 2.4)} Agregar</button></div>
    <p class="tip">${icon("move", 28)} Arrastra para cambiar el orden</p>
    ${footer("doc", S.files.length < 2 ? "Agrega otro PDF" : `${S.files.length} PDF → 1 PDF`, S.files.length < 2 ? "Necesitas 2 o más" : hojas(total), S.files.length >= 2)}`;
}

// --- Separar
function separarView() {
  const f = S.files[0];
  const each = S.splitMode === "each";
  const choices = `<div class="choices">
    <button class="choice" data-act="split-mode" data-mode="each" aria-pressed="${each}"><span class="ic">${icon("pages", 36)}</span><span><b>Todas separadas</b><span>Cada hoja en su propio PDF</span></span></button>
    <button class="choice" data-act="split-mode" data-mode="pick" aria-pressed="${!each}"><span class="ic">${icon("pick", 36)}</span><span><b>Solo algunas</b><span>Toca las hojas que quieres sacar</span></span></button>
  </div>`;
  const cards = f.pages.map((p, i) => {
    const picked = S.picked.has(i);
    return `<div class="card ${each ? "" : "selectable"} ${picked && !each ? "picked" : ""}">
      <span class="badge">${i + 1}</span>
      ${each ? "" : `<span class="check">${picked ? icon("check", 24, 3) : ""}</span>`}
      <div class="thumb" ${each ? "" : `data-act="pick-page" data-i="${i}" role="checkbox" tabindex="0" aria-checked="${picked}" aria-label="Hoja ${i + 1}"`}>${thumbImg(`${f.id}-${i}`, p.thumb)}</div>
    </div>`;
  }).join("");
  const n = S.picked.size;
  const sum = each ? `${f.pageCount} PDF` : n ? `${hojas(n)} → 1 PDF` : "Toca las hojas";
  const sub = each ? (f.pageCount > 1 ? "Se guardan juntos en un .zip" : "") : n ? "" : "Elige al menos una";
  return `${fileStrip(f)}${choices}<div class="cards">${cards}</div>
    ${footer("separar", sum, sub, each ? true : n > 0)}`;
}

// --- Ordenar
function ordenarView() {
  const f = S.files[0];
  const cards = f.pages.map((p, i) => `<div class="card" draggable="true" data-drag="${i}">
      <span class="badge">${i + 1}</span>
      <div class="thumb">${p.thumb ? `<img alt="" src="${p.thumb}" data-thumb="${f.id}-${p.src}" style="transform:rotate(${p.rot}deg)">` : `<span class="ph" data-thumb="${f.id}-${p.src}"></span>`}</div>
      <span class="card-actions">
        <button class="icon-btn" data-act="mv" data-i="${i}" data-d="-1" aria-label="Mover antes" ${i === 0 ? "disabled" : ""}>${icon("left", 24, 2.6)}</button>
        <button class="icon-btn" data-act="rot" data-i="${i}" aria-label="Girar hoja ${i + 1}">${icon("rotate", 24, 2.4)}</button>
        <button class="icon-btn danger" data-act="del-page" data-i="${i}" aria-label="Borrar hoja ${i + 1}" ${f.pages.length === 1 ? "disabled" : ""}>${icon("trash", 24, 2.2)}</button>
        <button class="icon-btn" data-act="mv" data-i="${i}" data-d="1" aria-label="Mover después" ${i === f.pages.length - 1 ? "disabled" : ""}>${icon("right", 24, 2.6)}</button>
      </span></div>`).join("");
  const removed = f.pageCount - f.pages.length;
  return `${fileStrip(f)}<div class="cards">${cards}</div>
    <p class="tip">${icon("move", 28)} Arrastra las hojas · ${icon("rotate", 26)} gira · ${icon("trash", 26)} borra</p>
    ${footer("ordenar", hojas(f.pages.length), removed ? `Quitaste ${hojas(removed)}` : "", true)}`;
}

// --- Firmar
function firmarView() {
  const f = S.files[0];
  const g = S.sig;
  const m = (k, ic, label) => `<button class="choice" data-act="sig-method" data-m="${k}" aria-pressed="${g.method === k}"><span class="ic">${icon(ic, 36)}</span><b>${label}</b></button>`;
  let panel = "";
  if (g.method === "draw") panel = `<canvas class="pad" id="pad" aria-label="Dibuja tu firma aquí"></canvas>
      <button class="btn btn-line" data-act="sig-clear">Borrar</button>`;
  else if (g.method === "type") panel = `<label class="sr-only" for="sig-text">Escribe tu nombre</label>
      <input id="sig-text" class="big-input" placeholder="Escribe tu nombre" value="${esc(g.typed)}" autocomplete="name">
      <div class="typed-preview" id="typed-preview">${esc(g.typed) || "&nbsp;"}</div>`;
  else panel = `<button class="btn btn-line" data-act="sig-image">${icon("image", 26)} Elegir foto</button>
      ${g.dataUrl ? `<div class="typed-preview"><img alt="Tu firma" src="${g.dataUrl}" style="max-height:100px;max-width:90%"></div>` : ""}`;
  const placed = g.dataUrl && g.box;
  return `${fileStrip(f)}<div class="sign">
    <div class="sign-page">
      <div class="page-stage" id="stage"><canvas id="page-canvas"></canvas>${g.box && g.dataUrl ? sigBox() : ""}</div>
      <div class="page-nav">
        <button class="icon-btn" data-act="sig-page" data-d="-1" aria-label="Hoja anterior" ${g.page === 0 ? "disabled" : ""}>${icon("left", 26, 2.6)}</button>
        Hoja ${g.page + 1} de ${f.pageCount}
        <button class="icon-btn" data-act="sig-page" data-d="1" aria-label="Hoja siguiente" ${g.page >= f.pageCount - 1 ? "disabled" : ""}>${icon("right", 26, 2.6)}</button>
      </div>
      <p class="tip" style="margin:0">${icon("firmar", 26)} ${g.dataUrl ? "Toca la hoja donde va la firma. Arrástrala para moverla." : "Primero haz tu firma →"}</p>
    </div>
    <aside class="sign-side">
      <h2>¿Cómo firmas?</h2>
      ${m("draw", "draw", "Dibujar")}${m("type", "type", "Escribir")}${m("image", "image", "Foto de firma")}
      ${panel}
      ${g.dataUrl ? `<label class="range">Tamaño <input type="range" min="0.5" max="2" step="0.05" value="${g.scale}" data-act="sig-scale" aria-label="Tamaño de la firma"></label>` : ""}
    </aside></div>
    ${footer("firmar", placed ? "Firma lista" : "Falta tu firma", placed ? `En la hoja ${g.box.page + 1}` : "Haz tu firma y ponla en la hoja", !!placed)}`;
}
function sigBox() {
  const b = S.sig.box;
  if (b.page !== S.sig.page) return "";
  return `<div class="sig-box" id="sig-box" style="left:${b.x * 100}%;top:${b.y * 100}%;width:${b.w * 100}%;height:${b.h * 100}%"><img alt="Tu firma" src="${S.sig.dataUrl}"></div>`;
}

// --- Clave
function claveView() {
  const f = S.files[0];
  const w = S.pw;
  const had = f.password != null && f.password !== "";
  const long = w.a.length >= 4, same = w.a.length > 0 && w.a === w.b;
  if (had && w.remove) {
    return `${fileStrip(f)}<div class="choices">
      <button class="choice" data-act="pw-mode" data-remove="0" aria-pressed="false"><span class="ic">${icon("clave", 36)}</span><span><b>Cambiar clave</b><span>Ponerle una clave nueva</span></span></button>
      <button class="choice" data-act="pw-mode" data-remove="1" aria-pressed="true"><span class="ic">${icon("unlock", 36)}</span><span><b>Quitar clave</b><span>Que se abra sin clave</span></span></button></div>
      ${footer("unlock", "Sin clave", "Cualquiera podrá abrirlo", true).replace(TOOLS.clave.go, "QUITAR CLAVE")}`;
  }
  const t = w.show ? "text" : "password";
  return `${fileStrip(f)}
    ${had ? `<div class="choices">
      <button class="choice" data-act="pw-mode" data-remove="0" aria-pressed="true"><span class="ic">${icon("clave", 36)}</span><span><b>Cambiar clave</b><span>Ponerle una clave nueva</span></span></button>
      <button class="choice" data-act="pw-mode" data-remove="1" aria-pressed="false"><span class="ic">${icon("unlock", 36)}</span><span><b>Quitar clave</b><span>Que se abra sin clave</span></span></button></div>` : ""}
    <div class="form">
      <div class="field"><label for="pw-a">Clave nueva</label>
        <div class="pw"><input id="pw-a" class="big-input" type="${t}" value="${esc(w.a)}" autocomplete="new-password">
        <button class="icon-btn" data-act="pw-show" aria-label="${w.show ? "Ocultar" : "Mostrar"} clave">${icon(w.show ? "eyeOff" : "eye", 24)}</button></div></div>
      <div class="field"><label for="pw-b">Repite la clave</label>
        <div class="pw"><input id="pw-b" class="big-input" type="${t}" value="${esc(w.b)}" autocomplete="new-password"></div></div>
      <p class="ok-line ${long ? "good" : ""}" id="ok-long">${icon(long ? "check" : "x", 24, 3)} Mínimo 4 letras o números</p>
      <p class="ok-line ${same ? "good" : w.b ? "bad" : ""}" id="ok-same">${icon(same ? "check" : "x", 24, 3)} Las dos son iguales</p>
    </div>
    ${footer("clave", "Con clave", "Pedirá la clave al abrirlo", long && same)}`;
}

// --- Achicar
function achicarView() {
  const f = S.files[0];
  const n = S.shrinkMode === "normal";
  return `${fileStrip(f)}<div class="choices">
    <button class="choice" data-act="shrink-mode" data-mode="normal" aria-pressed="${n}"><span class="ic">${icon("feather", 36)}</span><span><b>Normal</b><span>Se ve igual. El texto se puede copiar.</span></span></button>
    <button class="choice" data-act="shrink-mode" data-mode="strong" aria-pressed="${!n}"><span class="ic">${icon("achicar", 36)}</span><span><b>Fuerte</b><span>Mucho más pequeño. Las hojas pasan a ser fotos.</span></span></button>
  </div>
  ${footer("achicar", `Ahora: ${size(f.bytes.length)}`, n ? "Sin perder calidad" : "Ideal para mandar por correo o WhatsApp", true)}`;
}

// --- Done
function doneView() {
  const r = S.result;
  const multi = r.kind === "zip";
  return `${topbar()}<div class="finish"><main>
    <div class="done-check">${icon("check", 104, 3).replace('stroke="currentColor"', 'stroke="#fff"')}</div>
    <h1>¡Listo!</h1>
    <div class="file-strip"><span class="file-ic">${icon(multi ? "zip" : "doc", 30)}</span>
      <span class="grow"><b>${esc(r.name)}</b><span>${r.detail}</span></span></div>
    ${r.note ? `<p class="saving">${r.note}</p>` : ""}
    <div class="two">
      ${multi ? "" : `<button class="btn btn-tool" data-act="view">${icon("eye", 38, 2.4)} Ver</button>`}
      <button class="btn btn-line" data-act="download">${icon("download", 38, 2.4)} Descargar</button>
    </div>
    <p class="hint" style="margin:0">Ya se guardó en tu carpeta de Descargas.</p>
    <button class="link-home" data-act="home">${icon("home", 30, 2.2)} Hacer otra cosa</button>
  </main></div>`;
}

// --- Overlays
function overlays() {
  if (S.busy) return `<div class="overlay" role="alert" aria-busy="true"><div class="busy"><div class="spinner"></div>${S.busy}<small>Todo pasa en tu computadora</small></div></div>`;
  if (S.error) return `<div class="overlay" role="alertdialog" aria-labelledby="err-t"><div class="dialog">
      <h2 id="err-t" style="color:var(--danger)">${icon("warn", 40)} Algo salió mal</h2><p>${esc(S.error)}</p>
      <div class="row"><button class="btn btn-dark" data-act="close-error" autofocus>Entendido</button></div></div></div>`;
  if (S.ask) return `<div class="overlay" role="dialog" aria-labelledby="ask-t"><form class="dialog" id="ask-form">
      <h2 id="ask-t">${icon("clave", 40)} Este PDF tiene clave</h2>
      <p><b>${esc(S.ask.name)}</b>${S.ask.wrong ? '<br><span style="color:var(--danger);font-weight:700">Esa clave no es. Prueba otra vez.</span>' : ""}</p>
      <label class="sr-only" for="ask-pw">Clave del PDF</label>
      <input id="ask-pw" class="big-input" type="password" placeholder="Escribe la clave" autocomplete="current-password">
      <div class="row"><button type="button" class="btn btn-line" data-act="ask-cancel">Cancelar</button>
      <button type="submit" class="btn btn-dark">Abrir</button></div></form></div>`;
  if (S.help) return `<div class="overlay" role="dialog" aria-labelledby="help-t"><div class="dialog">
      <h2 id="help-t">${icon("help", 40)} ¿Cómo se usa?</h2>
      <ol class="help-steps">
        <li><span class="num">1</span> Toca lo que quieres hacer</li>
        <li><span class="num">2</span> Pon tu PDF</li>
        <li><span class="num">3</span> Toca el botón verde</li>
      </ol>
      <p class="privacy" style="margin:0">${icon("shield", 30)} Tus archivos no salen de tu computadora.</p>
      <div class="row"><button class="btn btn-dark" data-act="close-help" autofocus>Entendido</button></div></div></div>`;
  return "";
}

// ---------------------------------------------------------------- after render hooks
function afterRender() {
  const auto = $app.querySelector("[autofocus], #ask-pw");
  if (auto) auto.focus();
  if (S.screen === "tool" && S.tool === "firmar" && S.files.length) setupSign();
  if (S.screen === "tool" && S.tool === "clave") {
    for (const id of ["pw-a", "pw-b"]) {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", () => { S.pw[id === "pw-a" ? "a" : "b"] = el.value; refreshPw(); });
    }
  }
}
function refreshPw() {
  const w = S.pw, long = w.a.length >= 4, same = w.a.length > 0 && w.a === w.b;
  const l = document.getElementById("ok-long"), s = document.getElementById("ok-same"), go = $app.querySelector('[data-act="go"]');
  if (l) { l.className = `ok-line ${long ? "good" : ""}`; l.innerHTML = `${icon(long ? "check" : "x", 24, 3)} Mínimo 4 letras o números`; }
  if (s) { s.className = `ok-line ${same ? "good" : w.b ? "bad" : ""}`; s.innerHTML = `${icon(same ? "check" : "x", 24, 3)} Las dos son iguales`; }
  if (go) go.disabled = !(long && same);
}

// ---------------------------------------------------------------- loading PDFs
function askPassword(name, wrong) {
  return new Promise((resolve) => { S.ask = { name, wrong, resolve }; S.busy = null; render(); });
}

async function loadFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let password = null, wrong = false, doc;
  for (;;) {
    try {
      doc = await pdfjs.getDocument({ data: bytes.slice(), password: password ?? undefined, isEvalSupported: false }).promise;
      break;
    } catch (e) {
      if (e && e.name === "PasswordException") {
        const pw = await askPassword(file.name, wrong);
        if (pw == null) return null;
        password = pw; wrong = true;
        continue;
      }
      throw new Error(`"${file.name}" no parece un PDF que se pueda abrir.`);
    }
  }
  const f = { id: nextId++, name: file.name, bytes, password, doc, pageCount: doc.numPages, pages: [] };
  for (let i = 0; i < f.pageCount; i++) f.pages.push({ src: i, rot: 0, thumb: null });
  return f;
}

async function addFiles(list) {
  const pdfs = [...list].filter((f) => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name));
  if (!pdfs.length) { S.error = "Eso no es un PDF. Elige un archivo que termine en .pdf"; render(); return; }
  const multi = TOOLS[S.tool].multi;
  const take = multi ? pdfs : pdfs.slice(0, 1);
  S.busy = take.length > 1 ? "Abriendo tus PDF…" : "Abriendo tu PDF…"; render();
  try {
    for (const file of take) {
      const f = await loadFile(file);
      if (!f) continue;
      if (multi) S.files.push(f); else { S.files = [f]; resetToolState(); }
    }
  } catch (e) {
    S.error = e.message || String(e);
  }
  S.busy = null;
  render();
  makeThumbs();
}

function resetToolState() {
  S.picked = new Set(); S.splitMode = "each"; S.shrinkMode = "normal";
  S.sig = { method: S.sig.method, dataUrl: S.sig.dataUrl, typed: S.sig.typed, page: 0, box: null, scale: S.sig.scale };
  S.pw = { a: "", b: "", show: false, remove: false };
}

let thumbRun = 0;
async function makeThumbs() {
  const run = ++thumbRun;
  const all = S.tool === "unir" ? S.files.map((f) => [f, f.pages[0]]) : S.files.flatMap((f) => f.pages.map((p) => [f, p]));
  for (const [f, p] of all) {
    if (run !== thumbRun) return;
    if (p.thumb) continue;
    try {
      const page = await f.doc.getPage(p.src + 1);
      const vp0 = page.getViewport({ scale: 1 });
      const scale = Math.min(180 / vp0.width, 232 / vp0.height) * 2;
      const vp = page.getViewport({ scale });
      const c = document.createElement("canvas");
      c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
      p.thumb = c.toDataURL("image/jpeg", 0.8);
      // the same source page can appear once per file; update every placeholder for it
      for (const el of $app.querySelectorAll(`[data-thumb="${f.id}-${p.src}"]`)) {
        if (el.tagName === "IMG") { el.src = p.thumb; continue; }
        const img = document.createElement("img");
        img.alt = ""; img.src = p.thumb; img.dataset.thumb = `${f.id}-${p.src}`;
        if (p.rot) img.style.transform = `rotate(${p.rot}deg)`;
        el.replaceWith(img);
      }
    } catch { /* a page that fails to render keeps its placeholder */ }
  }
}

async function libDoc(f) {
  if (f.password != null) return PDFDocument.load(f.bytes, { password: f.password });
  try { return await PDFDocument.load(f.bytes); }
  catch (e) {
    if (/encrypt/i.test(String(e && e.message))) return PDFDocument.load(f.bytes, { password: "" });
    throw e;
  }
}

// ---------------------------------------------------------------- doing the work
async function run() {
  const work = { unir: doUnir, separar: doSeparar, ordenar: doOrdenar, firmar: doFirmar, clave: doClave, achicar: doAchicar }[S.tool];
  S.busy = "Trabajando…"; render();
  try {
    const r = await work();
    S.result = r; S.screen = "done"; S.busy = null;
    render();
    download();
  } catch (e) {
    console.error(e);
    S.busy = null;
    S.error = "No se pudo terminar. Puede que el PDF esté dañado. Prueba con otro archivo.";
    render();
  }
}
const pdfResult = (bytes, name, detail, note) => ({ kind: "pdf", blob: new Blob([bytes], { type: "application/pdf" }), name, detail: detail ?? `${size(bytes.length)}`, note });

async function doUnir() {
  const out = await PDFDocument.create();
  for (const f of S.files) {
    const src = await libDoc(f);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  const bytes = await out.save();
  return pdfResult(bytes, "unido.pdf", `${hojas(out.getPageCount())} · ${size(bytes.length)}`);
}

async function doSeparar() {
  const f = S.files[0];
  const src = await libDoc(f);
  const b = baseName(f.name);
  if (S.splitMode === "pick") {
    const idx = [...S.picked].sort((a, c) => a - c);
    const out = await PDFDocument.create();
    (await out.copyPages(src, idx)).forEach((p) => out.addPage(p));
    const bytes = await out.save();
    return pdfResult(bytes, `${b}-hojas-elegidas.pdf`, `${hojas(idx.length)} · ${size(bytes.length)}`);
  }
  if (f.pageCount === 1) {
    const bytes = await src.save();
    return pdfResult(bytes, `${b}-hoja-1.pdf`, `1 hoja · ${size(bytes.length)}`, "Este PDF ya tenía una sola hoja.");
  }
  const files = {};
  const pad = String(f.pageCount).length;
  for (let i = 0; i < f.pageCount; i++) {
    const out = await PDFDocument.create();
    const [p] = await out.copyPages(src, [i]);
    out.addPage(p);
    files[`${b}-hoja-${String(i + 1).padStart(pad, "0")}.pdf`] = await out.save();
  }
  const zip = zipSync(files, { level: 0 });
  return { kind: "zip", blob: new Blob([zip], { type: "application/zip" }), name: `${b}-hojas.zip`, detail: `${f.pageCount} PDF · ${size(zip.length)}` };
}

async function doOrdenar() {
  const f = S.files[0];
  const src = await libDoc(f);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, f.pages.map((p) => p.src));
  pages.forEach((p, i) => {
    const extra = f.pages[i].rot;
    if (extra) p.setRotation(degrees((p.getRotation().angle + extra) % 360));
    out.addPage(p);
  });
  const bytes = await out.save();
  return pdfResult(bytes, `${baseName(f.name)}-ordenado.pdf`, `${hojas(out.getPageCount())} · ${size(bytes.length)}`);
}

async function doFirmar() {
  const f = S.files[0];
  const g = S.sig, b = g.box;
  const doc = await libDoc(f);
  const png = await doc.embedPng(g.dataUrl);
  const jsPage = await f.doc.getPage(b.page + 1);
  const vp = jsPage.getViewport({ scale: 1 });
  const [x1, y1] = vp.convertToPdfPoint(b.x * vp.width, b.y * vp.height);
  const [x2, y2] = vp.convertToPdfPoint((b.x + b.w) * vp.width, (b.y + b.h) * vp.height);
  const page = doc.getPage(b.page);
  const rot = ((page.getRotation().angle % 360) + 360) % 360;
  const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  // On a rotated page the box's sides swap; draw the image turned with the page so it reads upright.
  if (rot === 0) page.drawImage(png, { x, y, width: w, height: h });
  else if (rot === 90) page.drawImage(png, { x: x + w, y, width: h, height: w, rotate: degrees(90) });
  else if (rot === 180) page.drawImage(png, { x: x + w, y: y + h, width: w, height: h, rotate: degrees(180) });
  else page.drawImage(png, { x, y: y + h, width: h, height: w, rotate: degrees(270) });
  const bytes = await doc.save();
  return pdfResult(bytes, `${baseName(f.name)}-firmado.pdf`, `${hojas(doc.getPageCount())} · ${size(bytes.length)}`);
}

async function doClave() {
  const f = S.files[0];
  const doc = await libDoc(f);
  if (S.pw.remove) {
    const bytes = await doc.save();
    return pdfResult(bytes, `${baseName(f.name)}-sin-clave.pdf`, `${hojas(doc.getPageCount())} · ${size(bytes.length)}`, "Ahora se abre sin clave.");
  }
  doc.encrypt({ userPassword: S.pw.a, ownerPassword: S.pw.a, permissions: { printing: "highResolution", copying: true, modifying: true, annotating: true, fillingForms: true, contentAccessibility: true, documentAssembly: true } });
  const bytes = await doc.save();
  return pdfResult(bytes, `${baseName(f.name)}-con-clave.pdf`, `${hojas(doc.getPageCount())} · ${size(bytes.length)}`, "Guarda la clave en un lugar seguro: sin ella no se puede abrir.");
}

async function doAchicar() {
  const f = S.files[0];
  const before = f.bytes.length;
  let bytes;
  if (S.shrinkMode === "normal") {
    const doc = await libDoc(f);
    bytes = await doc.save({ useObjectStreams: true });
  } else {
    const out = await PDFDocument.create();
    for (let i = 1; i <= f.pageCount; i++) {
      S.busy = `Achicando hoja ${i} de ${f.pageCount}…`;
      const msg = $app.querySelector(".busy");
      if (msg) msg.firstChild.nextSibling.textContent = S.busy;
      const page = await f.doc.getPage(i);
      const vp1 = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale: 110 / 72 });
      const c = document.createElement("canvas");
      c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const jpg = await new Promise((res) => c.toBlob(res, "image/jpeg", 0.6));
      const img = await out.embedJpg(new Uint8Array(await jpg.arrayBuffer()));
      const p = out.addPage([vp1.width, vp1.height]);
      p.drawImage(img, { x: 0, y: 0, width: vp1.width, height: vp1.height });
    }
    bytes = await out.save({ useObjectStreams: true });
  }
  const b = baseName(f.name);
  if (bytes.length >= before) {
    return pdfResult(f.bytes, `${b}-pequeño.pdf`, `${hojas(f.pageCount)} · ${size(before)}`, S.shrinkMode === "normal" ? "Ya estaba lo más pequeño posible. Prueba con «Fuerte»." : "Ya estaba lo más pequeño posible.");
  }
  const pct = Math.round((1 - bytes.length / before) * 100);
  return pdfResult(bytes, `${b}-pequeño.pdf`, `${hojas(f.pageCount)} · antes ${size(before)}`, `Ahora pesa ${size(bytes.length)}: ${pct}% menos`);
}

function download() {
  const r = S.result;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(r.blob);
  a.download = r.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
}

// ---------------------------------------------------------------- signing
let pageScale = 1;
async function setupSign() {
  const f = S.files[0];
  const g = S.sig;
  const canvas = document.getElementById("page-canvas");
  const stage = document.getElementById("stage");
  if (!canvas) return;
  const page = await f.doc.getPage(g.page + 1);
  const vp1 = page.getViewport({ scale: 1 });
  const maxW = Math.min(stage.parentElement.clientWidth, 640);
  pageScale = Math.min(maxW / vp1.width, 760 / vp1.height);
  const ratio = window.devicePixelRatio || 1;
  const vp = page.getViewport({ scale: pageScale * ratio });
  canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
  canvas.style.width = `${Math.ceil(vp.width / ratio)}px`;
  await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
  // the screen may have been redrawn while the page rendered; the newer pass owns it
  if (!canvas.isConnected) return;

  // a fresh signature lands near the bottom of the page so nobody has to guess where to tap
  if (g.dataUrl && !g.box) { placeSig(0.3, 0.85, stage.getBoundingClientRect()); return; }

  // place or move the signature
  stage.onpointerdown = (e) => {
    if (!g.dataUrl) return;
    const r = stage.getBoundingClientRect();
    const box = document.getElementById("sig-box");
    if (box && box.contains(e.target)) {
      const b = g.box, sx = e.clientX, sy = e.clientY, ox = b.x, oy = b.y;
      box.setPointerCapture(e.pointerId);
      box.onpointermove = (m) => {
        b.x = Math.max(0, Math.min(1 - b.w, ox + (m.clientX - sx) / r.width));
        b.y = Math.max(0, Math.min(1 - b.h, oy + (m.clientY - sy) / r.height));
        box.style.left = `${b.x * 100}%`; box.style.top = `${b.y * 100}%`;
      };
      box.onpointerup = () => { box.onpointermove = null; };
      return;
    }
    placeSig((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, r);
  };

  if (g.method === "draw") setupPad();
  if (g.method === "type") {
    const input = document.getElementById("sig-text");
    const prev = document.getElementById("typed-preview");
    if (!input || !prev) return;
    let t;
    input.oninput = () => {
      g.typed = input.value;
      prev.textContent = input.value || " ";
      clearTimeout(t);
      t = setTimeout(async () => { await typedToImage(); render(); const i = document.getElementById("sig-text"); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 600);
    };
  }
}

function placeSig(cx, cy, rect) {
  const g = S.sig;
  const img = new Image();
  img.onload = () => {
    const aspect = img.width / img.height;
    const wPx = Math.min(rect.width * 0.38 * g.scale, rect.width * 0.95);
    const w = wPx / rect.width, h = wPx / aspect / rect.height;
    g.box = { page: g.page, w, h, x: Math.max(0, Math.min(1 - w, cx - w / 2)), y: Math.max(0, Math.min(1 - h, cy - h / 2)) };
    render();
  };
  img.src = g.dataUrl;
}

function setupPad() {
  const pad = document.getElementById("pad");
  if (!pad) return;
  const ratio = window.devicePixelRatio || 1;
  pad.width = pad.clientWidth * ratio; pad.height = pad.clientHeight * ratio;
  const ctx = pad.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#0E1530";
  if (S.sig.method === "draw" && S.sig.dataUrl && S.sig.padUrl) {
    const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, pad.clientWidth, pad.clientHeight); im.src = S.sig.padUrl;
  }
  let drawing = false, dirty = false;
  pad.onpointerdown = (e) => { drawing = true; pad.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
  pad.onpointermove = (e) => { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); dirty = true; };
  pad.onpointerup = () => {
    drawing = false;
    if (!dirty) return;
    S.sig.padUrl = pad.toDataURL("image/png");
    S.sig.dataUrl = trimCanvas(pad);
    refitBox();
    render();
  };
}

// crop the transparent margin so the signature box hugs the ink
function trimCanvas(src) {
  const ctx = src.getContext("2d");
  const { width, height } = src;
  const d = ctx.getImageData(0, 0, width, height).data;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (d[(y * width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return null;
  const m = 6;
  x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(width - 1, x1 + m); y1 = Math.min(height - 1, y1 + m);
  const out = document.createElement("canvas");
  out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
  out.getContext("2d").drawImage(src, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}

async function typedToImage() {
  const g = S.sig;
  if (!g.typed.trim()) { g.dataUrl = null; return; }
  await document.fonts.load('600 120px "Caveat"');
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.font = '600 120px "Caveat"';
  const w = Math.ceil(ctx.measureText(g.typed).width) + 40;
  c.width = w; c.height = 170;
  ctx.font = '600 120px "Caveat"'; ctx.fillStyle = "#0E1530"; ctx.textBaseline = "middle";
  ctx.fillText(g.typed, 20, 88);
  g.dataUrl = trimCanvas(c);
  refitBox();
}

function refitBox() {
  // keep the box where it is but match the new signature's shape
  const g = S.sig;
  if (!g.box || !g.dataUrl) return;
  const img = new Image();
  img.onload = () => {
    const stage = document.getElementById("stage");
    const r = stage ? stage.getBoundingClientRect() : { width: 600, height: 800 };
    const wPx = Math.min(r.width * 0.38 * g.scale, r.width * 0.95);
    g.box.w = wPx / r.width; g.box.h = wPx / (img.width / img.height) / r.height;
    g.box.x = Math.min(g.box.x, 1 - g.box.w); g.box.y = Math.min(g.box.y, 1 - g.box.h);
    render();
  };
  img.src = g.dataUrl;
}

function pickSigImage() {
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "image/png,image/jpeg";
  inp.onchange = () => {
    const file = inp.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const k = Math.min(1, 1200 / img.width);
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, c.width, c.height);
      // make a white paper background transparent so the signature sits on the page
      const data = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < data.data.length; i += 4) {
        const [r, gg, b] = [data.data[i], data.data[i + 1], data.data[i + 2]];
        if (r > 225 && gg > 225 && b > 225) data.data[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      S.sig.dataUrl = trimCanvas(c) || c.toDataURL("image/png");
      URL.revokeObjectURL(img.src);
      refitBox();
      render();
    };
    img.onerror = () => { S.error = "No se pudo abrir esa foto. Prueba con una imagen JPG o PNG."; render(); };
    img.src = URL.createObjectURL(file);
  };
  inp.click();
}

// ---------------------------------------------------------------- events
function openTool(tool) {
  S.screen = "tool"; S.tool = tool; S.files = []; resetToolState();
  S.sig = { method: "draw", dataUrl: null, typed: "", page: 0, box: null, scale: 1 };
  const pend = S.pending; S.pending = [];
  render();
  window.scrollTo(0, 0);
  if (pend.length) addFiles(pend);
}
function pickFiles() {
  $input.multiple = S.screen === "tool" && !!TOOLS[S.tool].multi;
  $input.value = "";
  $input.click();
}
$input.addEventListener("change", () => {
  const files = [...$input.files];
  if (!files.length) return;
  if (S.screen === "home") onHomeFiles(files); else addFiles(files);
});
function onHomeFiles(files) {
  const pdfs = files.filter((f) => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name));
  if (!pdfs.length) { S.error = "Eso no es un PDF. Elige un archivo que termine en .pdf"; render(); return; }
  if (pdfs.length > 1) { S.pending = pdfs; openTool("unir"); return; }
  S.pending = pdfs; render();
}

function move(list, i, j) {
  if (j < 0 || j >= list.length || i === j) return;
  const [x] = list.splice(i, 1); list.splice(j, 0, x);
}

$app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const a = el.dataset.act;
  const f = S.files[0];
  switch (a) {
    case "home": S = { ...fresh(), help: false }; thumbRun++; render(); window.scrollTo(0, 0); break;
    case "help": S.help = true; render(); break;
    case "close-help": S.help = false; render(); break;
    case "close-error": S.error = null; render(); break;
    case "tool": openTool(el.dataset.tool); break;
    case "pick": pickFiles(); break;
    case "clear-pending": S.pending = []; render(); break;
    case "change-file": S.files = []; resetToolState(); render(); pickFiles(); break;
    case "rm-file": S.files.splice(+el.dataset.i, 1); render(); break;
    case "mv": {
      const i = +el.dataset.i, d = +el.dataset.d;
      move(S.tool === "unir" ? S.files : f.pages, i, i + d); render(); break;
    }
    case "rot": f.pages[+el.dataset.i].rot = (f.pages[+el.dataset.i].rot + 90) % 360; render(); break;
    case "del-page": f.pages.splice(+el.dataset.i, 1); render(); break;
    case "split-mode": S.splitMode = el.dataset.mode; render(); break;
    case "pick-page": { const i = +el.dataset.i; S.picked.has(i) ? S.picked.delete(i) : S.picked.add(i); render(); break; }
    case "shrink-mode": S.shrinkMode = el.dataset.mode; render(); break;
    case "pw-show": S.pw.show = !S.pw.show; render(); break;
    case "pw-mode": S.pw.remove = el.dataset.remove === "1"; render(); break;
    case "sig-method": S.sig.method = el.dataset.m; S.sig.dataUrl = null; S.sig.padUrl = null; if (el.dataset.m === "type" && S.sig.typed) { typedToImage().then(render); } render(); break;
    case "sig-clear": S.sig.dataUrl = null; S.sig.padUrl = null; S.sig.box = null; render(); break;
    case "sig-image": pickSigImage(); break;
    case "sig-page": S.sig.page = Math.max(0, Math.min(f.pageCount - 1, S.sig.page + +el.dataset.d)); render(); break;
    case "go": run(); break;
    case "download": download(); break;
    case "view": window.open(URL.createObjectURL(S.result.blob), "_blank", "noopener"); break;
    case "ask-cancel": { const r = S.ask.resolve; S.ask = null; render(); r(null); break; }
  }
});
$app.addEventListener("keydown", (e) => {
  const el = e.target.closest('[role="checkbox"][data-act]');
  if (el && (e.key === " " || e.key === "Enter")) { e.preventDefault(); el.click(); }
});
$app.addEventListener("input", (e) => {
  if (e.target.dataset.act === "sig-scale") {
    S.sig.scale = +e.target.value;
    const box = document.getElementById("sig-box");
    if (box && S.sig.box) {
      const stage = document.getElementById("stage").getBoundingClientRect();
      const b = S.sig.box, aspect = (b.w * stage.width) / (b.h * stage.height);
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      b.w = Math.min(0.95, 0.38 * S.sig.scale); b.h = (b.w * stage.width) / aspect / stage.height;
      b.x = Math.max(0, Math.min(1 - b.w, cx - b.w / 2)); b.y = Math.max(0, Math.min(1 - b.h, cy - b.h / 2));
      Object.assign(box.style, { left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` });
    }
  }
});
$app.addEventListener("submit", (e) => {
  if (e.target.id !== "ask-form") return;
  e.preventDefault();
  const pw = document.getElementById("ask-pw").value;
  const r = S.ask.resolve; S.ask = null; S.busy = "Abriendo tu PDF…"; render(); r(pw);
});

// drag to reorder cards
let dragFrom = null;
$app.addEventListener("dragstart", (e) => {
  const c = e.target.closest("[data-drag]");
  if (!c) return;
  dragFrom = +c.dataset.drag; c.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", String(dragFrom));
});
$app.addEventListener("dragend", () => { dragFrom = null; $app.querySelectorAll(".dragging,.over").forEach((x) => x.classList.remove("dragging", "over")); });
$app.addEventListener("dragover", (e) => {
  const c = e.target.closest("[data-drag]");
  if (dragFrom == null || !c) return;
  e.preventDefault();
  $app.querySelectorAll(".over").forEach((x) => x !== c && x.classList.remove("over"));
  c.classList.add("over");
});
$app.addEventListener("drop", (e) => {
  const c = e.target.closest("[data-drag]");
  if (dragFrom == null || !c) return;
  e.preventDefault();
  move(S.tool === "unir" ? S.files : S.files[0].pages, dragFrom, +c.dataset.drag);
  dragFrom = null; render();
});

// drop files anywhere
let dragDepth = 0;
const hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types].includes("Files");
window.addEventListener("dragenter", (e) => { if (!hasFiles(e)) return; dragDepth++; document.body.classList.add("dragging"); });
window.addEventListener("dragleave", (e) => { if (!hasFiles(e)) return; if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove("dragging"); } });
window.addEventListener("dragover", (e) => { if (hasFiles(e)) e.preventDefault(); });
window.addEventListener("drop", (e) => {
  if (!hasFiles(e)) return;
  e.preventDefault(); dragDepth = 0; document.body.classList.remove("dragging");
  const files = [...e.dataTransfer.files];
  if (S.screen === "home") onHomeFiles(files);
  else if (S.screen === "tool") addFiles(files);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (S.help) { S.help = false; render(); }
  else if (S.error) { S.error = null; render(); }
});

// tool tiles also take a pending file from the home drop zone; openTool handles it
render();
