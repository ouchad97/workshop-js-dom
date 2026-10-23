# Sauvegarder avec localStorage

Quand on recharge la page, toutes les modifications du DOM disparaissent. `localStorage` permet au navigateur de **garder** des données entre deux visites.

## La notion

### Lire, écrire, supprimer

`localStorage` ne stocke que des **chaînes de caractères**, associées à une clé.

```javascript
localStorage.setItem("prenom", "Sara");     // écrire
const prenom = localStorage.getItem("prenom"); // lire → "Sara" (ou null si absente)
localStorage.removeItem("prenom");          // supprimer
```

### Les nombres

```javascript
const visites = Number(localStorage.getItem("visites")) || 0; // null → 0
localStorage.setItem("visites", visites + 1);
```

### Les tableaux et les objets : JSON

Pour stocker un tableau, on le transforme en texte JSON, et on fait l'inverse à la lecture.

```javascript
const notes = ["Acheter du pain", "Réviser"];
localStorage.setItem("notes", JSON.stringify(notes));   // tableau → texte

const sauvegarde = JSON.parse(localStorage.getItem("notes")) || []; // texte → tableau
```

> **Dans le bac à sable :** chaque clic sur **Exécuter** recharge la page. C'est exactement ce qu'il faut pour tester la persistance ! Le bouton **Vérifier** efface les clés `visites`, `mode` et `notes` avant de tester.

### Challenge 1 : Compteur de visites

À chaque chargement de la page, ajoute 1 au nombre de visites enregistré sous la clé `visites`, et affiche-le dans `#visites`. Clique plusieurs fois sur **Exécuter** pour voir le compteur monter.

<!-- check
if (text("#visites") !== "1") return `À la première visite (clé effacée), #visites doit afficher 1 (il affiche « ${text("#visites")} »).`;
await rerun();
if (text("#visites") !== "2") return "Après un rechargement, #visites doit afficher 2.";
if (localStorage.getItem("visites") !== "2") return "La clé visites doit contenir 2 dans localStorage.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Lire** la valeur avec `getItem`. La première fois elle vaut `null` : `Number(null) || 0` donne `0`.
2.  **Ajouter 1** et **enregistrer** avec `setItem`.
3.  **Afficher** dans `#visites`.

**Code :**
```javascript
const visites = (Number(localStorage.getItem("visites")) || 0) + 1;
localStorage.setItem("visites", visites);
document.querySelector("#visites").textContent = visites;
```
</solution>

### Challenge 2 : Mode sombre mémorisé

Le bouton `#mode` ajoute ou retire la classe `sombre` sur le `body`. Le choix est enregistré sous la clé `mode` (`"sombre"` ou `"clair"`) et appliqué au chargement.

<!-- check
if ($("body").classList.contains("sombre")) return "Au premier chargement (clé effacée), la page doit être claire.";
await click("#mode");
if (!$("body").classList.contains("sombre")) return "Un clic sur #mode doit ajouter la classe sombre au body.";
await rerun();
if (!$("body").classList.contains("sombre")) return "Après un rechargement, le mode sombre doit être appliqué automatiquement.";
await click("#mode");
await rerun();
if ($("body").classList.contains("sombre")) return "Après être repassé en clair puis rechargé, la page doit rester claire.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Au chargement** : si `getItem("mode")` vaut `"sombre"`, ajouter la classe.
2.  **Au clic** : `toggle` la classe, puis enregistrer l'état actuel.
3.  **État actuel** : `classList.contains("sombre")`.

**Code :**
```javascript
const body = document.body;

if (localStorage.getItem("mode") === "sombre") {
  body.classList.add("sombre");
}

document.querySelector("#mode").addEventListener("click", () => {
  body.classList.toggle("sombre");
  const mode = body.classList.contains("sombre") ? "sombre" : "clair";
  localStorage.setItem("mode", mode);
});
```
</solution>

### Challenge 3 : Enregistrer les notes

Quand on envoie le formulaire `#form-note`, la note saisie est ajoutée dans `#notes` (un `li`) **et** dans un tableau enregistré en JSON sous la clé `notes`. Le champ est vidé après l'ajout. Une note vide n'est pas ajoutée.

<!-- check
await type("#note", "Acheter du pain");
await submit("#form-note");
if (text("#notes li") !== "Acheter du pain") return "Après l'envoi, la note doit apparaître dans un li de #notes.";
if ($("#note").value !== "") return "Le champ #note doit être vidé après l'ajout.";
let saved;
try { saved = JSON.parse(localStorage.getItem("notes")); } catch (e) { return "La clé notes doit contenir un tableau en JSON (JSON.stringify)."; }
if (!Array.isArray(saved) || !saved.includes("Acheter du pain")) return "La clé notes doit contenir le tableau des notes en JSON.";
await type("#note", "   ");
await submit("#form-note");
if ($$("#notes li").length !== 1) return "Une note vide ne doit pas être ajoutée.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Un tableau** `notes` en mémoire.
2.  **Au submit** : `preventDefault`, lire et nettoyer la saisie, ignorer si vide.
3.  **Ajouter** au tableau, **enregistrer** avec `JSON.stringify`, **afficher** un `li`.
4.  **Vider** le champ.

**Code :**
```javascript
const form = document.querySelector("#form-note");
const champ = document.querySelector("#note");
const liste = document.querySelector("#notes");
const notes = [];

function ajouterLi(texte) {
  const li = document.createElement("li");
  li.textContent = texte;
  liste.append(li);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const texte = champ.value.trim();
  if (texte === "") return;

  notes.push(texte);
  localStorage.setItem("notes", JSON.stringify(notes));
  ajouterLi(texte);
  champ.value = "";
});
```
</solution>

### Challenge 4 : Retrouver les notes

Reprends le challenge 3. Au chargement, les notes enregistrées sont relues et affichées. Les nouvelles notes s'ajoutent aux anciennes.

<!-- check
await type("#note", "Première");
await submit("#form-note");
await type("#note", "Deuxième");
await submit("#form-note");
await rerun();
let textes = $$("#notes li").map(li => text(li));
if (textes.join(",") !== "Première,Deuxième") return `Après un rechargement, #notes doit afficher Première et Deuxième (il affiche ${textes.length} note(s)).`;
await type("#note", "Troisième");
await submit("#form-note");
await rerun();
textes = $$("#notes li").map(li => text(li));
if (textes.length !== 3) return "Une note ajoutée après un rechargement doit s'ajouter aux anciennes, pas les remplacer.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Initialiser** le tableau avec ce qui est enregistré : `JSON.parse(getItem("notes")) || []`.
2.  **Afficher** chaque note du tableau au chargement.
3.  **Le reste** ne change pas : on ajoute au tableau, qui contient déjà les anciennes notes.

**Code :**
```javascript
const form = document.querySelector("#form-note");
const champ = document.querySelector("#note");
const liste = document.querySelector("#notes");
const notes = JSON.parse(localStorage.getItem("notes")) || [];

function ajouterLi(texte) {
  const li = document.createElement("li");
  li.textContent = texte;
  liste.append(li);
}

notes.forEach(ajouterLi);

form.addEventListener("submit", event => {
  event.preventDefault();
  const texte = champ.value.trim();
  if (texte === "") return;

  notes.push(texte);
  localStorage.setItem("notes", JSON.stringify(notes));
  ajouterLi(texte);
  champ.value = "";
});
```
</solution>

### Challenge 5 : Tout effacer

Reprends le challenge 4. Le bouton `#vider` supprime toutes les notes : de la page **et** du localStorage.

<!-- check
await type("#note", "À effacer");
await submit("#form-note");
await click("#vider");
if ($$("#notes li").length) return "Après un clic sur #vider, #notes doit être vide.";
const reste = localStorage.getItem("notes");
if (reste && reste !== "[]") return "Après un clic sur #vider, la clé notes doit être supprimée (removeItem).";
await rerun();
if ($$("#notes li").length) return "Après #vider puis un rechargement, aucune note ne doit revenir.";
await type("#note", "Nouvelle");
await submit("#form-note");
if ($$("#notes li").length !== 1) return "Après #vider, on doit pouvoir ajouter de nouvelles notes.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Vider le tableau** : `notes.length = 0` (le tableau est en `const`, on ne peut pas le réaffecter).
2.  **Supprimer la clé** avec `removeItem`.
3.  **Vider la liste** : `innerHTML = ""`.

**Code :**
```javascript
const form = document.querySelector("#form-note");
const champ = document.querySelector("#note");
const liste = document.querySelector("#notes");
const notes = JSON.parse(localStorage.getItem("notes")) || [];

function ajouterLi(texte) {
  const li = document.createElement("li");
  li.textContent = texte;
  liste.append(li);
}

notes.forEach(ajouterLi);

form.addEventListener("submit", event => {
  event.preventDefault();
  const texte = champ.value.trim();
  if (texte === "") return;

  notes.push(texte);
  localStorage.setItem("notes", JSON.stringify(notes));
  ajouterLi(texte);
  champ.value = "";
});

document.querySelector("#vider").addEventListener("click", () => {
  notes.length = 0;
  localStorage.removeItem("notes");
  liste.innerHTML = "";
});
```
</solution>
