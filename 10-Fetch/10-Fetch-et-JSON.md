# Charger des données avec fetch

Jusqu'ici, les données étaient écrites dans le code. Dans la réalité, elles viennent d'un **fichier** ou d'un **serveur** (une API). `fetch` va les chercher, et `async` / `await` permet d'attendre la réponse sans bloquer la page.

## La notion

### Une requête prend du temps

`fetch` ne renvoie pas les données tout de suite : il renvoie une **promesse**. Avec `await`, on attend le résultat. `await` s'utilise dans une fonction `async`.

```javascript
async function charger() {
  const reponse = await fetch("data/membres.json"); // 1. la réponse HTTP
  const membres = await reponse.json();             // 2. le contenu, converti en tableau
  console.log(membres);
}

charger();
console.log("Ce message s'affiche AVANT les membres !");
```

### Le fichier de cette étape

`data/membres.json` contient un tableau d'objets :

```javascript
[
  { "id": 1, "nom": "Salma Idrissi", "ville": "Safi", "role": "apprenante", "email": "salma.idrissi@exemple.ma" },
  ...
]
```

Tu peux l'ouvrir directement dans le navigateur : [data/membres.json](data/membres.json).

### Gérer les erreurs

Une requête peut échouer : fichier introuvable (erreur 404), pas de réseau… On vérifie `reponse.ok` et on entoure le tout d'un `try / catch`.

```javascript
async function charger(url) {
  try {
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error("Erreur " + reponse.status);
    }
    const donnees = await reponse.json();
    // afficher les données
  } catch (erreur) {
    // afficher un message à l'utilisateur
  }
}
```

> **Attention :** `fetch` ne fonctionne pas si la page est ouverte avec `file://`. Il faut un serveur (`npx serve .`). Dans le bac à sable, chaque `fetch` est ralenti de 0,3 seconde pour simuler un vrai réseau.

### Challenge 1 : Combien de membres ?

Charge `data/membres.json` avec `fetch` et affiche dans la console le **nombre** de membres.

<!-- check
await wait(900);
if (!logs().some(line => /(^|[\s:=])10$/.test(line.trim()))) return "La console doit afficher 10 : charge le fichier, convertis-le avec .json() puis affiche length.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Fonction** `async`.
2.  **Charger** avec `await fetch(...)`, puis **convertir** avec `await reponse.json()`.
3.  **Afficher** `membres.length`.
4.  **Appeler** la fonction.

**Code :**
```javascript
async function charger() {
  const reponse = await fetch("data/membres.json");
  const membres = await reponse.json();
  console.log(membres.length);
}

charger();
```
</solution>

### Challenge 2 : Afficher l'annuaire

Affiche chaque membre dans `#annuaire` : un `li` par membre, sous la forme `Salma Idrissi — Safi`.

<!-- check
await wait(900);
const items = $$("#annuaire li");
if (items.length !== 10) return `#annuaire doit contenir 10 li (il en a ${items.length}).`;
if (!text(items[0]).includes("Salma Idrissi") || !text(items[0]).includes("Safi")) return "Le premier li doit contenir le nom et la ville : « Salma Idrissi — Safi ».";
return true;
-->

<solution>
### Étapes de résolution

1.  **Charger** les données comme au challenge 1.
2.  **Boucle** : un `li` par membre, avec un template literal.
3.  **Placer** dans `#annuaire`.

**Code :**
```javascript
const annuaire = document.querySelector("#annuaire");

async function charger() {
  const reponse = await fetch("data/membres.json");
  const membres = await reponse.json();

  membres.forEach(membre => {
    const li = document.createElement("li");
    li.textContent = `${membre.nom} — ${membre.ville}`;
    annuaire.append(li);
  });
}

charger();
```
</solution>

### Challenge 3 : Message de chargement

Reprends le challenge 2. Pendant le chargement, le paragraphe `#chargement` est **visible** (il a l'attribut `hidden` au départ). Quand les membres sont affichés, il est à nouveau caché.

<!-- check
if ($("#chargement").hidden) return "Juste après le lancement, pendant que fetch attend, #chargement doit être visible : passe hidden à false avant le fetch.";
await wait(900);
if (!$("#chargement").hidden) return "Une fois les membres affichés, #chargement doit être caché (hidden = true).";
if ($$("#annuaire li").length !== 10) return "Les 10 membres doivent être affichés dans #annuaire.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Avant** le `fetch` : `chargement.hidden = false`.
2.  **Après** l'affichage : `chargement.hidden = true`.
3.  **Pourquoi ça marche** : tout le code avant le premier `await` s'exécute tout de suite ; la suite attend la réponse.

**Code :**
```javascript
const annuaire = document.querySelector("#annuaire");
const chargement = document.querySelector("#chargement");

async function charger() {
  chargement.hidden = false;

  const reponse = await fetch("data/membres.json");
  const membres = await reponse.json();

  membres.forEach(membre => {
    const li = document.createElement("li");
    li.textContent = `${membre.nom} — ${membre.ville}`;
    annuaire.append(li);
  });

  chargement.hidden = true;
}

charger();
```
</solution>

### Challenge 4 : Gérer une erreur

Écris une fonction `charger(url)` qui charge et affiche les membres de `url`. Si la réponse n'est pas correcte (`reponse.ok` faux) ou si la requête échoue, `#erreur` affiche `Impossible de charger les données` et `#chargement` est caché. Termine par l'appel `charger("data/membres.json")`.

<!-- check
await wait(900);
if ($$("#annuaire li").length !== 10) return "charger(\"data/membres.json\") doit toujours afficher les 10 membres.";
if (typeof win().charger !== "function") return "Déclare une fonction nommée charger(url) avec le mot-clé function.";
win().charger("data/introuvable.json");
await wait(900);
if (!/impossible/i.test(text("#erreur"))) return "Avec une adresse qui n'existe pas, #erreur doit afficher « Impossible de charger les données ».";
if (!$("#chargement").hidden) return "Après une erreur, #chargement doit être caché.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Paramètre** `url` au lieu d'une adresse écrite en dur.
2.  **Tester** `reponse.ok` : une erreur 404 ne déclenche pas le `catch` toute seule, il faut lancer l'erreur avec `throw`.
3.  **catch** : afficher le message.
4.  **finally** : cacher le chargement dans tous les cas.

**Code :**
```javascript
const annuaire = document.querySelector("#annuaire");
const chargement = document.querySelector("#chargement");
const erreur = document.querySelector("#erreur");

async function charger(url) {
  chargement.hidden = false;
  erreur.textContent = "";

  try {
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error("Erreur " + reponse.status);
    }
    const membres = await reponse.json();

    membres.forEach(membre => {
      const li = document.createElement("li");
      li.textContent = `${membre.nom} — ${membre.ville}`;
      annuaire.append(li);
    });
  } catch (e) {
    erreur.textContent = "Impossible de charger les données";
  } finally {
    chargement.hidden = true;
  }
}

charger("data/membres.json");
```
</solution>

### Challenge 5 : Filtrer par ville

Charge les membres **une seule fois** et garde-les dans une variable. Pendant la saisie dans `#filtre`, n'affiche que les membres dont la ville commence par le texte tapé (sans tenir compte des majuscules). `#total` affiche le nombre de membres affichés, par exemple `3 membre(s)`.

<!-- check
await wait(900);
if ($$("#annuaire li").length !== 10) return "Au départ, les 10 membres doivent être affichés.";
if (!text("#total").includes("10")) return "Au départ, #total doit afficher 10.";
await type("#filtre", "safi");
let items = $$("#annuaire li");
if (items.length !== 3 || items.some(li => !text(li).includes("Safi"))) return `En tapant « safi », il doit rester les 3 membres de Safi (il en reste ${items.length}).`;
if (!text("#total").includes("3")) return "#total doit afficher 3 avec le filtre « safi ».";
await type("#filtre", "");
if ($$("#annuaire li").length !== 10) return "Quand le filtre est vide, les 10 membres doivent revenir.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Variable** `membres` déclarée en dehors de la fonction, remplie après le `fetch`.
2.  **Fonction** `afficher(liste)` qui vide `#annuaire`, crée les `li` et met à jour `#total`.
3.  **Filtre** : `filter` avec `toLowerCase().startsWith(...)`, puis `afficher`.
4.  **Pas de nouveau fetch** : on filtre les données déjà chargées.

**Code :**
```javascript
const annuaire = document.querySelector("#annuaire");
const total = document.querySelector("#total");
const filtre = document.querySelector("#filtre");
let membres = [];

function afficher(liste) {
  annuaire.innerHTML = "";
  liste.forEach(membre => {
    const li = document.createElement("li");
    li.textContent = `${membre.nom} — ${membre.ville}`;
    annuaire.append(li);
  });
  total.textContent = `${liste.length} membre(s)`;
}

async function charger() {
  const reponse = await fetch("data/membres.json");
  membres = await reponse.json();
  afficher(membres);
}

filtre.addEventListener("input", () => {
  const texte = filtre.value.toLowerCase();
  afficher(membres.filter(m => m.ville.toLowerCase().startsWith(texte)));
});

charger();
```
</solution>
