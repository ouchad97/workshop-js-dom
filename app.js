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

/* ── Code editor: CodeMirror when the CDN is reachable, plain textarea otherwise ── */
const runFromEditor = () => { resultBox.hidden = true; run(); };

const codeMirror = window.CodeMirror ? CodeMirror.fromTextArea(editor, {
  mode: "javascript",
  lineNumbers: true,
  tabSize: 2,
  indentUnit: 2,
  matchBrackets: true,
  autoCloseBrackets: true,
  extraKeys: {
    "Ctrl-Enter": runFromEditor,
    "Cmd-Enter": runFromEditor,
    Tab: cm => cm.somethingSelected() ? cm.indentSelection("add") : cm.execCommand("insertSoftTab")
  }
}) : null;

function getCode() {
  return codeMirror ? codeMirror.getValue() : editor.value;
}

function setCode(value) {
  if (!codeMirror) { editor.value = value; return; }
  codeMirror.setValue(value);
  codeMirror.clearHistory();
  codeMirror.refresh();
}

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

/* ── Locks: a step opens when the previous one is finished, a challenge when the previous ones are passed.
   Bonus challenges (always last) never lock anything. localStorage "domws:unlock" = "1" opens everything. ── */
const unlocked = () => store.get("unlock") === "1";
const stepLessons = lessons.filter(lesson => lesson.scene);

// A step is finished when its required (non-bonus) challenges are all passed
function lessonDone(lessonId) {
  const required = Number(store.get(`req:${lessonId}`)) || 0;
  if (!required) return false;
  for (let i = 1; i <= required; i++) if (!store.get(`done:${lessonId}:c${i}`)) return false;
  return true;
}

// The step that must be finished first, or null when this one is open
function lockedBy(lesson) {
  const position = stepLessons.indexOf(lesson);
  if (unlocked() || position <= 0) return null;
  const previous = stepLessons[position - 1];
  return lessonDone(previous.id) ? null : previous;
}

function renderProgress() {
  let all = 0;
  lessons.forEach(lesson => {
    const { done, total } = doneCount(lesson.id);
    all += done;
    const link = nav.querySelector(`[data-id="${lesson.id}"]`);
    if (!link) return;
    const badge = link.querySelector(".lesson-progress");
    const locked = Boolean(lockedBy(lesson));
    link.classList.toggle("locked", locked);
    badge.textContent = locked ? "🔒" : total ? (done === total ? "✓" : `${done}/${total}`) : "";
    badge.classList.toggle("complete", !locked && total > 0 && done === total);
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
    const hints = [...part.matchAll(/<!--\s*hint\s*\n([\s\S]*?)-->/g)].map(match => match[1].trim());
    const clean = part.replace(/<!--\s*(check|starter|hint)\s*\n[\s\S]*?-->\s*\n?/g, "");
    if (!isChallenge) return { html: markdownToHtml(clean) };
    const [heading, ...rest] = clean.split("\n");
    const title = heading.replace(/^###\s+/, "").trim();
    return { challenge: true, title, bonus: /bonus/i.test(title), html: markdownToHtml(rest.join("\n")), check, starter, hints };
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

// A challenge is locked while a previous required (non-bonus) challenge is not passed
function isLocked(index) {
  if (unlocked() || current.challenges[index].bonus) return false;
  return current.challenges.slice(0, index).some((challenge, i) => !challenge.bonus && !isDone(i));
}

const hintKey = index => `hint:${current.lesson.id}:c${index + 1}`;

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

  await totalsReady;
  if (current.lesson !== lesson) return;
  const previous = lockedBy(lesson);
  if (previous) {
    sandbox.hidden = true;
    lessonView.classList.remove("with-sandbox");
    const { done } = doneCount(previous.id);
    const required = Number(store.get(`req:${previous.id}`)) || 0;
    readerBody.innerHTML = `
      <div class="locked-step">
        <span class="locked-icon">🔒</span>
        <h2>Étape verrouillée</h2>
        <p>Termine d'abord « ${esc(previous.title)} » : ${Math.min(done, required)} / ${required} challenges obligatoires réussis. Les challenges bonus ne sont pas obligatoires.</p>
        <button class="code-btn" type="button" data-open="${previous.id}">Aller à « ${esc(previous.title)} » →</button>
      </div>`;
    return;
  }

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
  const firstTodo = current.challenges.findIndex((_, index) => !isDone(index) && !isLocked(index));
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
      <article class="challenge${/bonus/i.test(section.title) ? " bonus" : ""}" data-index="${index}">
        <div class="challenge-head">
          <h3>${inline(section.title)}</h3>
          <span class="challenge-status"></span>
        </div>
        ${section.html}
        <div class="hints"></div>
        <div class="challenge-actions">
          ${current.lesson.scene ? '<button class="code-btn" type="button">▶ Coder ici</button>' : ""}
          ${section.hints.length ? '<button class="hint-btn" type="button"></button>' : ""}
        </div>
      </article>`;
  }).join("");

  // Move each solution button next to "Coder ici"
  readerBody.querySelectorAll(".challenge").forEach(card => {
    const button = card.querySelector(".solution-btn");
    if (button) card.querySelector(".challenge-actions").append(button);
  });

  if (current.challenges.length) {
    store.set(`total:${current.lesson.id}`, current.challenges.length);
    store.set(`req:${current.lesson.id}`, current.challenges.filter(challenge => !challenge.bonus).length);
  }
  updateCards();
  renderProgress();
}

function updateCards() {
  readerBody.querySelectorAll(".challenge").forEach(card => {
    const index = Number(card.dataset.index);
    const done = isDone(index);
    const locked = isLocked(index);
    card.classList.toggle("done", done);
    card.classList.toggle("locked", locked);
    card.classList.toggle("active", index === current.active);
    card.querySelector(".challenge-status").textContent = done ? "Réussi ✓" : locked ? "🔒 Verrouillé" : "À faire";
    const codeButton = card.querySelector(".code-btn");
    if (codeButton) codeButton.disabled = locked;
    renderHints(card, index);
  });
}

// Shows the hints already opened, and the button for the next one
function renderHints(card, index) {
  const hints = current.challenges[index].hints;
  const shown = Math.min(Number(store.get(hintKey(index))) || 0, hints.length);
  card.querySelector(".hints").innerHTML = hints.slice(0, shown)
    .map((hint, i) => `<p class="hint"><strong>Indice ${i + 1} :</strong> ${inline(hint)}</p>`).join("");
  const button = card.querySelector(".hint-btn");
  if (!button) return;
  button.hidden = shown >= hints.length || isLocked(index);
  button.textContent = `💡 Indice ${shown + 1} / ${hints.length}`;
}

/* ── Sandbox ── */
function showSceneHtml() {
  const body = current.scene.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const source = (body ? body[1] : current.scene).replace(/^\n+|\s+$/g, "");
  const indent = Math.min(...source.split("\n").filter(line => line.trim()).map(line => line.match(/^ */)[0].length));
  htmlView.querySelector("code").textContent = source.split("\n").map(line => line.slice(indent)).join("\n");
}

function activate(index, scroll = true) {
  if (index < 0 || index >= current.challenges.length || isLocked(index)) return;
  saveCode();
  current.active = index;
  const challenge = current.challenges[index];
  sbTitle.textContent = challenge.title;
  setCode(store.get(codeKey(index)) ?? defaultCode(index));
  importButton.hidden = current.lesson.shared || index === 0;
  resultBox.hidden = true;
  updateCards();
  run();
  if (scroll && window.matchMedia("(max-width: 1300px)").matches) sandbox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveCode() {
  if (!current.lesson || current.active < 0) return;
  store.set(codeKey(current.active), getCode());
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
  // A loop full of console.log would flood the page: the console stops after 500 messages
  let sent = 0;
  const send = (type, args, line) => {
    if (type !== "error" && ++sent > 500) {
      if (sent === 501) parent.postMessage({ __domws: true, type: "warn", text: "Console limitée à 500 messages : les suivants ne sont pas affichés." }, "*");
      return;
    }
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
  window.__fetchCount = 0;
  window.fetch = (...args) => {
    window.__fetchCount++;
    return new Promise(resolve => setTimeout(resolve, 300)).then(() => realFetch(...args));
  };
  // Called at the start of every loop body: stops a loop that runs for more than 2 seconds without a pause
  let turns = 0;
  let started = 0;
  window.__loopGuard = () => {
    if (turns++ === 0) { started = performance.now(); setTimeout(() => { turns = 0; }); }
    if (turns % 10000 === 0 && performance.now() - started > 2000) {
      turns = 0;
      throw new Error("Boucle infinie arrêtée (plus de 2 secondes) : vérifie la condition de ta boucle.");
    }
  };
  window.addEventListener("error", event => send("error", [event.message], event.lineno));
  window.addEventListener("unhandledrejection", event => send("error", ["Promesse rejetée : " + (event.reason && event.reason.message || event.reason)]));
}

// Adds __loopGuard() at the start of every for / while / do body, so an infinite
// loop throws an error instead of freezing the tab. No newline is added: line numbers stay the same.
function guardLoops(code) {
  const length = code.length;
  const isWord = char => /[\w$]/.test(char || "");
  const skipSpaces = index => { while (index < length && /\s/.test(code[index])) index++; return index; };

  // Index just after a string / comment starting at index, or -1 if there is none
  const skipLiteral = index => {
    const char = code[index];
    if (char === "/" && code[index + 1] === "/") { const end = code.indexOf("\n", index); return end === -1 ? length : end; }
    if (char === "/" && code[index + 1] === "*") { const end = code.indexOf("*/", index + 2); return end === -1 ? length : end + 2; }
    if (char === '"' || char === "'" || char === "`") {
      let i = index + 1;
      while (i < length && code[i] !== char) i += code[i] === "\\" ? 2 : 1;
      return i + 1;
    }
    return -1;
  };

  const closingParen = open => {
    let depth = 0;
    for (let i = open; i < length; i++) {
      const end = skipLiteral(i);
      if (end !== -1) { i = end - 1; continue; }
      if (code[i] === "(") depth++;
      if (code[i] === ")" && --depth === 0) return i;
    }
    return -1;
  };

  let out = "";
  let i = 0;
  while (i < length) {
    const end = skipLiteral(i);
    if (end !== -1) { out += code.slice(i, end); i = end; continue; }
    if (!isWord(code[i]) || isWord(code[i - 1])) { out += code[i++]; continue; }

    let j = i;
    while (isWord(code[j])) j++;
    const word = code.slice(i, j);
    let brace = -1;
    if (word === "for" || word === "while") {
      const open = skipSpaces(j);
      const close = code[open] === "(" ? closingParen(open) : -1;
      if (close !== -1 && code[skipSpaces(close + 1)] === "{") brace = skipSpaces(close + 1);
    } else if (word === "do" && code[skipSpaces(j)] === "{") {
      brace = skipSpaces(j);
    }
    if (brace !== -1) { out += code.slice(i, brace + 1) + "__loopGuard();"; i = brace + 1; }
    else { out += word; i = j; }
  }
  return out;
}

let runCount = 0;

function buildDocument(scene, code) {
  const bootTag = `<script>(${boot.toString()})();<\/script>`;
  let html = /<head[^>]*>/i.test(scene) ? scene.replace(/<head[^>]*>/i, match => match + bootTag) : bootTag + scene;
  const marker = "<!--learner-code-->";
  html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, () => marker + "</body>") : html + marker;
  const position = html.indexOf(marker);
  const before = html.slice(0, position) + "<script>\n";
  const safeCode = guardLoops(code).replace(/<\/script/gi, "<\\/script");
  return {
    html: `${before}${safeCode}\n<\/script><!--run ${++runCount}-->${html.slice(position + marker.length)}`,
    offset: before.split("\n").length - 1
  };
}

function run() {
  if (!current.lesson || !current.lesson.scene) return Promise.resolve();
  saveCode();
  logBox.innerHTML = "";
  const { html, offset } = buildDocument(current.scene, getCode());
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
  // Spaces are not checked: console.log("a", "b") adds its own space between values
  logs: () => (frame.contentWindow.__logs || []).map(line => line.replace(/\s+/g, " ").trim()),
  logged: value => checkHelpers.logs().some(line => line.includes(value.replace(/\s+/g, " ").trim())),
  errors: () => frame.contentWindow.__errors || [],
  code: () => getCode().replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, ""),
  fetches: () => frame.contentWindow.__fetchCount || 0,
  wait,
  async fire(target, type, options = {}) {
    const win = frame.contentWindow;
    const Type = /^key/.test(type) ? win.KeyboardEvent : /click|mouse/.test(type) ? win.MouseEvent : win.Event;
    need(target).dispatchEvent(new Type(type, { bubbles: true, cancelable: true, ...options }));
    await wait(40);
  },
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
  setCode(defaultCode(current.active));
  run();
});

importButton.addEventListener("click", () => {
  const previous = store.get(`code:${current.lesson.id}:c${current.active}`);
  if (!previous) { showResult("info", "Le challenge précédent n'a pas encore de code."); return; }
  if (getCode().trim() !== defaultCode(current.active).trim() && !confirm("Remplacer ton code actuel par celui du challenge précédent ?")) return;
  setCode(previous);
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
const scheduleSave = () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveCode, 400); };

if (codeMirror) {
  codeMirror.on("change", scheduleSave);
} else {
  editor.addEventListener("input", scheduleSave);
  editor.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      runFromEditor();
    } else if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      editor.setRangeText("  ", editor.selectionStart, editor.selectionEnd, "end");
    }
  });
}

readerBody.addEventListener("click", event => {
  const card = event.target.closest(".challenge");
  if (event.target.closest(".code-btn") && card) activate(Number(card.dataset.index));
  if (event.target.closest(".hint-btn") && card) {
    const index = Number(card.dataset.index);
    store.set(hintKey(index), (Number(store.get(hintKey(index))) || 0) + 1);
    renderHints(card, index);
  }
  const open = event.target.closest("[data-open]");
  if (open) openLesson(open.dataset.open);
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
const totalsReady = loadTotals();
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

/* ── Challenge totals: counted from every lesson file, so the progress is right before a lesson is opened ── */
async function loadTotals() {
  await Promise.all(lessons.filter(lesson => lesson.scene).map(async lesson => {
    try {
      const response = await fetch(lesson.file, { cache: "no-cache" });
      if (!response.ok) return;
      const titles = (await response.text()).match(/^### (?:Challenge|Étape) \d.*$/gm) || [];
      store.set(`total:${lesson.id}`, titles.length);
      store.set(`req:${lesson.id}`, titles.filter(title => !/bonus/i.test(title)).length);
    } catch {}
  }));
  renderProgress();
}


/* ── My work: summary, export and import ── */
const workModal = document.querySelector("#work-modal");
const workName = document.querySelector("#work-name");
const workNote = document.querySelector("#work-note");

function progressLines() {
  return lessons.filter(lesson => lesson.scene).map(lesson => {
    const { done, total } = doneCount(lesson.id);
    return { lesson, done, total };
  });
}

function summaryText() {
  const lines = progressLines();
  const done = lines.reduce((sum, line) => sum + line.done, 0);
  const total = lines.reduce((sum, line) => sum + line.total, 0);
  return [
    `Workshop JavaScript DOM — ${workName.value.trim() || "(nom non renseigné)"}`,
    `Progression : ${done} / ${total} challenges`,
    ...lines.map(({ lesson, done, total }) => `${lesson.id} ${lesson.title} : ${done}/${total}${total && done === total ? " ✓" : ""}`)
  ].join("\n");
}

function renderSummary() {
  document.querySelector("#work-summary").innerHTML = progressLines().map(({ lesson, done, total }) => `
    <div class="work-row${total && done === total ? " complete" : ""}">
      <span>${lesson.id}</span><strong>${esc(lesson.title)}</strong><em>${done}/${total}</em>
      <i style="--ratio:${total ? done / total : 0}"></i>
    </div>`).join("");
}

function openWork() {
  saveCode();
  workName.value = store.get("name") || "";
  workNote.textContent = "Ton travail est enregistré dans ce navigateur uniquement. Exporte-le pour le garder, le retrouver sur un autre ordinateur ou l'envoyer à ton formateur.";
  renderSummary();
  workModal.hidden = false;
}

function slug(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function exportWork() {
  saveCode();
  const data = {};
  try {
    Object.keys(localStorage).filter(key => key.startsWith(STORE) && key !== STORE + "theme").forEach(key => {
      data[key.slice(STORE.length)] = localStorage.getItem(key);
    });
  } catch {}
  const name = workName.value.trim();
  const file = {
    app: "workshop-js-dom",
    version: 1,
    name,
    exportedAt: new Date().toISOString(),
    summary: summaryText(),
    data
  };
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `workshop-dom-${slug(name) || "travail"}-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  workNote.textContent = "Fichier téléchargé. Garde-le précieusement ou envoie-le à ton formateur.";
}

async function importWork(file) {
  let content;
  try {
    content = JSON.parse(await file.text());
  } catch {
    workNote.textContent = "Ce fichier n'est pas un export valide.";
    return;
  }
  if (!content || content.app !== "workshop-js-dom" || typeof content.data !== "object") {
    workNote.textContent = "Ce fichier n'est pas un export du Workshop JavaScript DOM.";
    return;
  }
  if (!confirm(`Importer le travail de ${content.name || "ce fichier"} ? Le travail actuel de ce navigateur sera remplacé.`)) return;
  try {
    Object.keys(localStorage).filter(key => key.startsWith(STORE) && key !== STORE + "theme").forEach(key => localStorage.removeItem(key));
  } catch {}
  Object.entries(content.data)
    .filter(([key, value]) => /^(code|done|total):|^name$/.test(key) && typeof value === "string")
    .forEach(([key, value]) => store.set(key, value));
  location.reload();
}

document.querySelector("#work-button").addEventListener("click", openWork);
document.querySelector("#close-work").addEventListener("click", () => { workModal.hidden = true; });
workModal.addEventListener("click", event => { if (event.target === workModal) workModal.hidden = true; });
document.addEventListener("keydown", event => { if (event.key === "Escape") workModal.hidden = true; });
workName.addEventListener("input", () => store.set("name", workName.value.trim()));
document.querySelector("#work-export").addEventListener("click", exportWork);
document.querySelector("#work-import").addEventListener("click", () => document.querySelector("#work-file").click());
document.querySelector("#work-file").addEventListener("change", event => {
  if (event.target.files[0]) importWork(event.target.files[0]);
  event.target.value = "";
});
document.querySelector("#work-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(summaryText());
    workNote.textContent = "Résumé copié : colle-le où ton formateur te le demande.";
  } catch {
    workNote.textContent = summaryText();
  }
});

/* ── New version: tabs left open check every 5 minutes and offer to reload ── */
if (window.assetVersion) {
  const loadedVersion = window.assetVersion();
  let seen = null;
  setInterval(async () => {
    if (document.querySelector(".update-banner")) return;
    const loaded = await loadedVersion;
    const latest = await window.assetVersion();
    // Shown only when the same new version is found twice in a row (no false alarm on a network glitch)
    const isNew = Boolean(loaded && latest && latest !== loaded);
    const confirmed = isNew && latest === seen;
    seen = isNew ? latest : null;
    if (!confirmed) return;
    const banner = document.createElement("div");
    banner.className = "update-banner";
    banner.innerHTML = '<span>Une nouvelle version du workshop est disponible. Ton code est sauvegardé.</span><button type="button">Recharger</button>';
    banner.querySelector("button").addEventListener("click", () => { saveCode(); location.reload(); });
    document.body.append(banner);
  }, 5 * 60 * 1000);
}
