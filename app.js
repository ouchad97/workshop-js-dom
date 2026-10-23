const lessons = [
  { id: "01", title: "Sélectionner", description: "Trouver les éléments de la page avant de pouvoir les modifier.", file: "01-Selection/01-Selection.md", scene: "scenes/bibliotheque.html", tag: "Sélection" },
  { id: "02", title: "Styles & classes", description: "Changer l'apparence des éléments avec style et classList.", file: "02-Styles/02-Styles-et-Classes.md", scene: "scenes/escalier.html", tag: "Apparence" },
  { id: "03", title: "Contenu & attributs", description: "Lire et écrire le texte, le HTML et les attributs d'un élément.", file: "03-Contenu/03-Contenu-et-Attributs.md", scene: "scenes/profil.html", tag: "Contenu" },
  { id: "04", title: "Créer & supprimer", description: "Fabriquer de nouveaux éléments, les placer, les cloner et les retirer.", file: "04-Creer/04-Creer-et-Supprimer.md", scene: "scenes/courses.html", tag: "Structure" },
  { id: "05", title: "Événements", description: "Réagir aux clics et aux saisies de l'utilisateur.", file: "05-Evenements/05-Evenements.md", scene: "scenes/escalier.html", tag: "Interaction" },
  { id: "06", title: "Formulaires", description: "Lire les saisies, valider et empêcher le rechargement de la page.", file: "06-Formulaires/06-Formulaires.md", scene: "scenes/formulaire.html", tag: "Saisie" },
  { id: "07", title: "Arbre & délégation", description: "Se déplacer entre parents et enfants, et écouter une liste entière.", file: "07-Delegation/07-Arbre-et-Delegation.md", scene: "scenes/taches.html", tag: "Navigation" },
  { id: "08", title: "Données → DOM", description: "Afficher, filtrer, rechercher et trier un tableau d'objets.", file: "08-Donnees/08-Donnees-et-DOM.md", scene: "scenes/catalogue.html", tag: "Données" },
  { id: "09", title: "localStorage", description: "Garder les données de l'utilisateur après un rechargement.", file: "09-Stockage/09-localStorage.md", scene: "scenes/notes.html", tag: "Persistance", storageKeys: ["visites", "mode", "notes"] },
  { id: "10", title: "fetch & JSON", description: "Charger des données depuis un fichier JSON et les afficher.", file: "10-Fetch/10-Fetch-et-JSON.md", scene: "scenes/annuaire.html", tag: "Asynchrone" },
  { id: "P1", title: "Mini-projet Todo", description: "Construire une application de tâches complète et persistante.", file: "11-Projets/mini-projet-todo.md", scene: "scenes/todo.html", tag: "Projet", shared: true, storageKeys: ["todos"] },
  { id: "P2", title: "Mini-projet Dashboard", description: "Charger un stock de produits, calculer des statistiques et trier un tableau.", file: "11-Projets/mini-projet-dashboard.md", scene: "scenes/dashboard.html", tag: "Projet", shared: true },
  { id: "G", title: "Glossaire DOM", description: "Retrouver rapidement les méthodes et notions du workshop.", file: "glossaire.md", tag: "Référence" }
];

const STORE = "domws:";
const store = {
  get(key) { try { return localStorage.getItem(STORE + key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(STORE + key, value); } catch {} },
  remove(key) { try { localStorage.removeItem(STORE + key); } catch {} }
};

const nav = document.querySelector("#lesson-nav");
const hero = document.querySelector("#hero");
const lessonView = document.querySelector("#lesson-view");
const readerBody = document.querySelector("#reader-body");
const readerTitle = document.querySelector("#reader-title");
const readerStep = document.querySelector("#reader-step");
const readerDescription = document.querySelector("#reader-description");

/* ── Modal Elements ── */
const modal = document.querySelector("#solution-modal");
const modalBody = document.querySelector("#modal-body");
const closeModal = document.querySelector("#close-modal");

/* ── Sandbox Elements ── */
const sandbox = document.querySelector("#sandbox");
const frame = document.querySelector("#sb-frame");
const editor = document.querySelector("#sb-code");
const logBox = document.querySelector("#sb-log");
const resultBox = document.querySelector("#sb-result");
const sbTitle = document.querySelector("#sb-title");
const htmlView = document.querySelector("#sb-html");
const verifyButton = document.querySelector("#sb-verify");
const importButton = document.querySelector("#sb-import");

/* ── Theme ── */
const themeToggle = document.querySelector("#theme-toggle");

if (store.get("theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  if (dark) document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", "dark");
  store.set("theme", dark ? "light" : "dark");
  themeToggle.textContent = dark ? "🌙" : "☀️";
});

/* ── Helpers ── */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const esc = text => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ── Progress ── */
function doneCount(lessonId) {
  const total = Number(store.get(`total:${lessonId}`)) || 0;
  let done = 0;
  for (let i = 1; i <= total; i++) if (store.get(`done:${lessonId}:c${i}`)) done++;
  return { done, total };
}

function renderProgress() {
  let all = 0;
  lessons.forEach(lesson => {
    const { done, total } = doneCount(lesson.id);
    all += done;
    const badge = nav.querySelector(`[data-id="${lesson.id}"] .lesson-progress`);
    if (!badge) return;
    badge.textContent = total ? (done === total ? "✓" : `${done}/${total}`) : "";
    badge.classList.toggle("complete", total > 0 && done === total);
  });
  document.querySelector("#global-progress").textContent = `${all} challenge${all > 1 ? "s" : ""} réussi${all > 1 ? "s" : ""}`;
}

/* ── Sidebar navigation ── */
function renderNav() {
  nav.innerHTML = lessons.map((lesson, index) => `
    <button class="lesson-link" type="button" data-id="${lesson.id}">
      <span class="lesson-number">${lesson.id.startsWith("P") ? "⚑" : lesson.id === "G" ? "Aa" : String(index + 1).padStart(2, "0")}</span>
      <span class="lesson-name">${lesson.title}</span>
      <span class="lesson-progress"></span>
    </button>`).join("");
  renderProgress();
}

/* ── Markdown → HTML ── */
function inline(text) {
  return text.split(/(`[^`]+`)/).map(part => {
    if (/^`[^`]+`$/.test(part)) return `<code>${esc(part.slice(1, -1))}</code>`;
    return esc(part)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }).join("");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let para = [];
  let list = null;

  const flushPara = () => { if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`); para = []; };
  const flushList = () => { if (list) out.push(`<${list.type}>${list.items.map(item => `<li>${inline(item)}</li>`).join("")}</${list.type}>`); list = null; };
  const flush = () => { flushPara(); flushList(); };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    let match;

    if (/^```/.test(trimmed)) {
      flush();
      const code = [];
      while (++i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i]);
      out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
    } else if ((match = line.match(/^(#{1,4})\s+(.*)$/))) {
      flush();
      out.push(`<h${match[1].length}>${inline(match[2])}</h${match[1].length}>`);
    } else if (trimmed === "<solution>") {
      flush();
      out.push('<div class="solution-data" hidden>');
    } else if (trimmed === "</solution>") {
      flush();
      out.push('</div><button class="solution-btn" type="button">💡 Voir la solution guidée</button>');
    } else if ((match = line.match(/^\s*[-*]\s+(.*)$/)) || (match = line.match(/^\s*\d+\.\s+(.*)$/))) {
      const type = /^\s*\d+\./.test(line) ? "ol" : "ul";
      flushPara();
      if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
      list.items.push(match[1]);
    } else if ((match = line.match(/^>\s?(.*)$/))) {
      flush();
      const quote = [match[1]];
      while (i + 1 < lines.length && /^>/.test(lines[i + 1])) quote.push(lines[++i].replace(/^>\s?/, ""));
      out.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
    } else if (/^\|/.test(trimmed)) {
      flush();
      const rows = [trimmed];
      while (i + 1 < lines.length && /^\|/.test(lines[i + 1].trim())) rows.push(lines[++i].trim());
      const cells = row => row.replace(/^\||\|$/g, "").split("|").map(cell => inline(cell.trim()));
      const body = rows.slice(2).map(row => `<tr>${cells(row).map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
      out.push(`<div class="table-wrapper"><table><thead><tr>${cells(rows[0]).map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`);
    } else if (!trimmed) {
      flush();
    } else if (list) {
      list.items[list.items.length - 1] += " " + trimmed;
    } else {
      para.push(trimmed);
    }
  }
  flush();
  return out.join("\n");
}

/* ── Lesson parsing: sections starting with "### Challenge N" or "### Étape N" are challenges ── */
function takeBlock(text, name) {
  const match = text.match(new RegExp(`<!--\\s*${name}\\s*\\n([\\s\\S]*?)-->`));
  return match ? match[1].replace(/\s+$/, "") : null;
}

function parseLesson(markdown) {
  return markdown.split(/^(?=### (?:Challenge|Étape) \d)/m).map(part => {
    const isChallenge = /^### (Challenge|Étape) \d/.test(part);
    const check = takeBlock(part, "check");
    const starter = takeBlock(part, "starter");
    const clean = part.replace(/<!--\s*(check|starter)\s*\n[\s\S]*?-->\s*\n?/g, "");
    if (!isChallenge) return { html: markdownToHtml(clean) };
    const [heading, ...rest] = clean.split("\n");
    return { challenge: true, title: heading.replace(/^###\s+/, "").trim(), html: markdownToHtml(rest.join("\n")), check, starter };
  });
}

/* ── State ── */
const current = { lesson: null, scene: "", challenges: [], active: -1, offset: 0 };

function codeKey(index) {
  return current.lesson.shared ? `code:${current.lesson.id}:shared` : `code:${current.lesson.id}:c${index + 1}`;
}

function defaultCode(index) {
  const challenge = current.challenges[index];
  if (challenge && challenge.starter) return challenge.starter + "\n";
  return "// Écris ton code ici\n";
}

function isDone(index) {
  return Boolean(store.get(`done:${current.lesson.id}:c${index + 1}`));
}

/* ── Show home (hero) ── */
function showHome() {
  hero.hidden = false;
  lessonView.hidden = true;
  current.lesson = null;
  frame.srcdoc = "";
  document.querySelectorAll(".lesson-link").forEach(el => el.classList.remove("active"));
  history.pushState({}, "", window.location.pathname);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Open a lesson ── */
async function openLesson(id, challengeNumber) {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) return;
  saveCode();

  readerTitle.textContent = lesson.title;
  readerStep.textContent = lesson.id.startsWith("P") ? "Mini-projet" : lesson.id === "G" ? "Référence" : `Étape ${lesson.id}`;
  readerDescription.textContent = lesson.description;
  readerBody.innerHTML = '<div class="loader">Chargement de la fiche<span>...</span></div>';

  hero.hidden = true;
  lessonView.hidden = false;
  lessonView.classList.toggle("with-sandbox", Boolean(lesson.scene));
  sandbox.hidden = !lesson.scene;
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!history.state || history.state.lesson !== id) history.pushState({ lesson: id }, "", `#lesson-${id}`);

  document.querySelectorAll(".lesson-link").forEach(el => el.classList.toggle("active", el.dataset.id === id));
  document.querySelector("#sidebar").classList.remove("open");

  current.lesson = lesson;
  current.challenges = [];
  current.active = -1;

  try {
    const load = url => fetch(url, { cache: "no-cache" }).then(response => { if (!response.ok) throw new Error(); return response.text(); });
    const [markdown, scene] = await Promise.all([load(lesson.file), lesson.scene ? load(lesson.scene) : ""]);
    if (current.lesson !== lesson) return;
    current.scene = scene;
    renderLesson(parseLesson(markdown));
  } catch (error) {
    sandbox.hidden = true;
    lessonView.classList.remove("with-sandbox");
    readerBody.innerHTML = `<p>La fiche existe, mais le navigateur bloque son chargement lorsque la page est ouverte directement avec <code>file://</code>.</p><p>Lance l'interface depuis le dossier du projet avec :</p><pre><code>npx serve .</code></pre><p>Puis ouvre l'adresse indiquée dans le terminal.</p>`;
    return;
  }

  if (!lesson.scene) return;
  showSceneHtml();
  const firstTodo = current.challenges.findIndex((_, index) => !isDone(index));
  const start = challengeNumber ? challengeNumber - 1 : (firstTodo === -1 ? 0 : firstTodo);
  activate(Math.min(start, current.challenges.length - 1), false);
}

function renderLesson(sections) {
  let number = 0;
  readerBody.innerHTML = sections.map(section => {
    if (!section.challenge) return section.html;
    const index = number++;
    current.challenges.push(section);
    return `
      <article class="challenge" data-index="${index}">
        <div class="challenge-head">
          <h3>${inline(section.title)}</h3>
          <span class="challenge-status"></span>
        </div>
        ${section.html}
        <div class="challenge-actions">
          ${current.lesson.scene ? '<button class="code-btn" type="button">▶ Coder ici</button>' : ""}
        </div>
      </article>`;
  }).join("");

  // Move each solution button next to "Coder ici"
  readerBody.querySelectorAll(".challenge").forEach(card => {
    const button = card.querySelector(".solution-btn");
    if (button) card.querySelector(".challenge-actions").append(button);
  });

  if (current.challenges.length) store.set(`total:${current.lesson.id}`, current.challenges.length);
  updateCards();
  renderProgress();
}

function updateCards() {
  readerBody.querySelectorAll(".challenge").forEach(card => {
    const index = Number(card.dataset.index);
    const done = isDone(index);
    card.classList.toggle("done", done);
    card.classList.toggle("active", index === current.active);
    card.querySelector(".challenge-status").textContent = done ? "Réussi ✓" : "À faire";
  });
}

/* ── Sandbox ── */
function showSceneHtml() {
  const body = current.scene.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const source = (body ? body[1] : current.scene).replace(/^\n+|\s+$/g, "");
  const indent = Math.min(...source.split("\n").filter(line => line.trim()).map(line => line.match(/^ */)[0].length));
  htmlView.querySelector("code").textContent = source.split("\n").map(line => line.slice(indent)).join("\n");
}

function activate(index, scroll = true) {
  if (index < 0 || index >= current.challenges.length) return;
  saveCode();
  current.active = index;
  const challenge = current.challenges[index];
  sbTitle.textContent = challenge.title;
  editor.value = store.get(codeKey(index)) ?? defaultCode(index);
  importButton.hidden = current.lesson.shared || index === 0;
  resultBox.hidden = true;
  updateCards();
  run();
  if (scroll && window.matchMedia("(max-width: 1300px)").matches) sandbox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveCode() {
  if (!current.lesson || current.active < 0) return;
  store.set(codeKey(current.active), editor.value);
}

// Runs inside the iframe, before the scene and the learner's code.
function boot() {
  window.__logs = [];
  window.__errors = [];
  const describe = value => {
    if (typeof value === "string") return value;
    if (value === undefined) return "undefined";
    if (value instanceof Element) {
      const classes = typeof value.className === "string" && value.className.trim() ? "." + value.className.trim().split(/\s+/).join(".") : "";
      return `<${value.tagName.toLowerCase()}${value.id ? "#" + value.id : ""}${classes}>`;
    }
    if (value instanceof NodeList || value instanceof HTMLCollection) return `${value.constructor.name}(${value.length}) [${Array.from(value).map(describe).join(", ")}]`;
    if (typeof value === "function") return `ƒ ${value.name || "anonyme"}()`;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    try { return JSON.stringify(value); } catch (error) { return String(value); }
  };
  const send = (type, args, line) => {
    const text = args.map(describe).join(" ");
    (type === "error" ? window.__errors : window.__logs).push(text);
    parent.postMessage({ __domws: true, type, text, line }, "*");
  };
  ["log", "info", "warn", "error", "table"].forEach(type => {
    const original = console[type];
    console[type] = (...args) => { send(type === "table" ? "log" : type, args); original.apply(console, args); };
  });
  // Simulated network latency, so loading states can be seen (and checked)
  const realFetch = window.fetch.bind(window);
  window.fetch = (...args) => new Promise(resolve => setTimeout(resolve, 300)).then(() => realFetch(...args));
  window.addEventListener("error", event => send("error", [event.message], event.lineno));
  window.addEventListener("unhandledrejection", event => send("error", ["Promesse rejetée : " + (event.reason && event.reason.message || event.reason)]));
}

let runCount = 0;

function buildDocument(scene, code) {
  const bootTag = `<script>(${boot.toString()})();<\/script>`;
  let html = /<head[^>]*>/i.test(scene) ? scene.replace(/<head[^>]*>/i, match => match + bootTag) : bootTag + scene;
  const marker = "<!--learner-code-->";
  html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, () => marker + "</body>") : html + marker;
  const position = html.indexOf(marker);
  const before = html.slice(0, position) + "<script>\n";
  const safeCode = code.replace(/<\/script/gi, "<\\/script");
  return {
    html: `${before}${safeCode}\n<\/script><!--run ${++runCount}-->${html.slice(position + marker.length)}`,
    offset: before.split("\n").length - 1
  };
}

function run() {
  if (!current.lesson || !current.lesson.scene) return Promise.resolve();
  saveCode();
  logBox.innerHTML = "";
  const { html, offset } = buildDocument(current.scene, editor.value);
  current.offset = offset;
  return new Promise(resolve => {
    frame.onload = () => { frame.onload = null; resolve(); };
    frame.srcdoc = html;
  });
}

function printLog(type, text, line) {
  const row = document.createElement("div");
  row.className = `log log-${type}`;
  row.textContent = text;
  const codeLine = line ? line - current.offset : 0;
  if (codeLine > 0) {
    const where = document.createElement("span");
    where.className = "log-line";
    where.textContent = `ligne ${codeLine}`;
    row.append(where);
  }
  logBox.append(row);
  logBox.scrollTop = logBox.scrollHeight;
}

window.addEventListener("message", event => {
  if (event.source !== frame.contentWindow || !event.data || !event.data.__domws) return;
  printLog(event.data.type, event.data.text, event.data.line);
});

/* ── Verification ── */
function need(target) {
  const element = typeof target === "string" ? frame.contentDocument.querySelector(target) : target;
  if (!element) throw new Error(`Élément introuvable : ${target}`);
  return element;
}

// During a check, CSS transitions would make computed styles lag behind
function freezeTransitions() {
  const style = frame.contentDocument.createElement("style");
  style.textContent = "*, *::before, *::after { transition: none !important; animation: none !important; }";
  frame.contentDocument.head.append(style);
}

const checkHelpers = {
  doc: () => frame.contentDocument,
  win: () => frame.contentWindow,
  $: selector => frame.contentDocument.querySelector(selector),
  $$: selector => Array.from(frame.contentDocument.querySelectorAll(selector)),
  css: (target, property) => frame.contentWindow.getComputedStyle(need(target))[property],
  text: target => { const element = typeof target === "string" ? frame.contentDocument.querySelector(target) : target; return element ? element.textContent.trim() : ""; },
  logs: () => frame.contentWindow.__logs || [],
  logged: value => (frame.contentWindow.__logs || []).some(line => line.includes(value)),
  errors: () => frame.contentWindow.__errors || [],
  wait,
  async rerun() { await run(); freezeTransitions(); await wait(60); },
  async click(target) { need(target).click(); await wait(40); },
  async type(target, value) {
    const element = need(target);
    const win = frame.contentWindow;
    element.focus();
    element.value = value;
    element.dispatchEvent(new win.Event("input", { bubbles: true }));
    element.dispatchEvent(new win.KeyboardEvent("keyup", { bubbles: true, key: value.slice(-1) || "Backspace" }));
    element.dispatchEvent(new win.Event("change", { bubbles: true }));
    await wait(40);
  },
  async choose(target, value) {
    const element = need(target);
    element.value = value;
    element.dispatchEvent(new frame.contentWindow.Event("input", { bubbles: true }));
    element.dispatchEvent(new frame.contentWindow.Event("change", { bubbles: true }));
    await wait(40);
  },
  async submit(target) {
    const element = need(target);
    const form = element.tagName === "FORM" ? element : element.form || element.closest("form");
    if (!form) throw new Error(`Aucun formulaire trouvé pour ${target}`);
    const before = frame.contentDocument;
    form.requestSubmit();
    await wait(150);
    if (frame.contentDocument !== before || !frame.contentDocument.body.children.length) {
      throw new Error("La page s'est rechargée à l'envoi du formulaire : utilise event.preventDefault() dans ton écouteur submit.");
    }
  }
};

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function showResult(kind, message) {
  resultBox.hidden = false;
  resultBox.className = `sb-result ${kind}`;
  resultBox.innerHTML = message;
}

async function verify() {
  const index = current.active;
  const challenge = current.challenges[index];
  if (!challenge) return;
  if (!challenge.check) {
    showResult("info", "Pas de vérification automatique pour cette étape : compare ton résultat avec l'énoncé.");
    return;
  }
  verifyButton.disabled = true;
  showResult("pending", "Vérification en cours…");
  (current.lesson.storageKeys || []).forEach(key => { try { localStorage.removeItem(key); } catch {} });

  let outcome;
  try {
    await run();
    freezeTransitions();
    await wait(60);
    const names = Object.keys(checkHelpers);
    const test = new AsyncFunction("h", `const { ${names.join(", ")} } = h;\n${challenge.check}`);
    outcome = await test(checkHelpers);
  } catch (error) {
    outcome = error.message;
  }
  verifyButton.disabled = false;
  if (current.active !== index) return;

  if (outcome === true) {
    store.set(`done:${current.lesson.id}:c${index + 1}`, "1");
    updateCards();
    renderProgress();
    const next = index + 1 < current.challenges.length ? '<button class="sb-link" type="button" data-next>Challenge suivant →</button>' : "";
    showResult("success", `<strong>Bravo, challenge réussi !</strong> ${next}`);
  } else {
    const errors = checkHelpers.errors();
    const hint = typeof outcome === "string" && outcome ? outcome : "Le résultat ne correspond pas encore à l'énoncé.";
    showResult("fail", `${errors.length ? `<strong>Ton code a une erreur :</strong> ${esc(errors[0])}<br>` : ""}<strong>Pas encore.</strong> ${esc(hint)}`);
  }
}

/* ── Sandbox events ── */
document.querySelector("#sb-run").addEventListener("click", () => { resultBox.hidden = true; run(); });
verifyButton.addEventListener("click", verify);
document.querySelector("#sb-clear").addEventListener("click", () => { logBox.innerHTML = ""; });

document.querySelector("#sb-reset").addEventListener("click", () => {
  if (!confirm("Remettre le code de départ ? Ton code actuel sera effacé.")) return;
  editor.value = defaultCode(current.active);
  run();
});

importButton.addEventListener("click", () => {
  const previous = store.get(`code:${current.lesson.id}:c${current.active}`);
  if (!previous) { showResult("info", "Le challenge précédent n'a pas encore de code."); return; }
  if (editor.value.trim() !== defaultCode(current.active).trim() && !confirm("Remplacer ton code actuel par celui du challenge précédent ?")) return;
  editor.value = previous;
  run();
});

resultBox.addEventListener("click", event => {
  if (event.target.matches("[data-next]")) {
    activate(current.active + 1);
    const card = readerBody.querySelector(`.challenge[data-index="${current.active}"]`);
    if (card && !window.matchMedia("(max-width: 1300px)").matches) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.querySelectorAll(".sb-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".sb-tab").forEach(other => other.classList.toggle("active", other === tab));
  const html = tab.dataset.tab === "html";
  htmlView.hidden = !html;
  frame.hidden = html;
}));

let saveTimer;
editor.addEventListener("input", () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveCode, 400); });

editor.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    resultBox.hidden = true;
    run();
  } else if (event.key === "Tab" && !event.shiftKey) {
    event.preventDefault();
    editor.setRangeText("  ", editor.selectionStart, editor.selectionEnd, "end");
  }
});

readerBody.addEventListener("click", event => {
  const card = event.target.closest(".challenge");
  if (event.target.closest(".code-btn") && card) activate(Number(card.dataset.index));
  const solution = event.target.closest(".solution-btn");
  if (solution) {
    const data = (card || readerBody).querySelector(".solution-data");
    if (data) {
      modalBody.innerHTML = data.innerHTML;
      modal.hidden = false;
    }
  }
});

window.addEventListener("beforeunload", saveCode);

/* ── Init ── */
renderNav();

nav.addEventListener("click", event => {
  const target = event.target.closest("[data-id]");
  if (target) openLesson(target.dataset.id);
});

document.querySelector("#start-button").addEventListener("click", () => openLesson("01"));

document.querySelector(".brand").addEventListener("click", event => {
  event.preventDefault();
  saveCode();
  showHome();
});

document.querySelector("#menu-toggle").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.toggle("open");
});

// Close the menu when clicking outside it or pressing Escape
document.addEventListener("click", event => {
  if (!event.target.closest("#sidebar, #menu-toggle")) document.querySelector("#sidebar").classList.remove("open");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") document.querySelector("#sidebar").classList.remove("open");
});

window.addEventListener("popstate", event => {
  if (event.state && event.state.lesson) openLesson(event.state.lesson);
  else { saveCode(); hero.hidden = false; lessonView.hidden = true; current.lesson = null; }
});

(function handleInitialHash() {
  const hash = window.location.hash;
  if (hash.startsWith("#lesson-")) {
    const id = hash.replace("#lesson-", "");
    history.replaceState({ lesson: id }, "", hash);
    openLesson(id);
  }
})();

/* ── Modal (Solutions) ── */
function hideModal() {
  modal.hidden = true;
  modalBody.innerHTML = "";
}
closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", event => { if (event.target === modal) hideModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) hideModal(); });
