# Mini-projet : Dashboard de stock

Le magasin veut un tableau de bord pour suivre son stock. Les données sont dans `data/stock.json` (12 produits, même format qu'à l'étape 08). Comme pour la todo list, le code est **partagé** entre les étapes.

## Le cahier des charges

- Charger les produits avec `fetch` et les afficher dans un tableau HTML.
- Signaler les produits presque épuisés.
- Calculer des statistiques : nombre de produits, ruptures, valeur du stock.
- Filtrer par catégorie (les catégories viennent des données).
- Trier en cliquant sur les en-têtes de colonnes.

## Conseil d'architecture

```javascript
let produits = [];   // rempli après le fetch

function afficher() {
  // 1. calculer la liste à afficher (filtre + tri)
  // 2. remplir le tableau
  // 3. mettre à jour les statistiques
}
```

Un tableau HTML se construit comme une liste : un `tr` par produit, un `td` par colonne.

```javascript
const tr = document.createElement("tr");
const td = document.createElement("td");
td.textContent = produit.nom;
tr.append(td);
```

### Étape 1 : Charger et afficher

Charge `data/stock.json` et ajoute dans `#corps` une ligne `tr` par produit, avec 4 cellules : nom, catégorie, prix (`450 DH`) et stock.

<!-- check
await wait(900);
const lignes = $$("#corps tr");
if (lignes.length !== 12) return `#corps doit contenir 12 lignes (il en a ${lignes.length}).`;
const cellules = lignes[0].querySelectorAll("td");
if (cellules.length !== 4) return "Chaque ligne doit avoir 4 cellules td.";
if (text(cellules[0]) !== "Clavier mécanique" || !text(cellules[2]).includes("450")) return "La première ligne doit afficher Clavier mécanique, informatique, 450 DH, 12.";
return true;
-->

<solution>
### Étapes de résolution

1.  **fetch** dans une fonction `async`, le résultat dans `produits`.
2.  **afficher()** : vider `#corps`, puis une ligne par produit.
3.  **Les cellules** : un petit tableau des 4 valeurs, parcouru avec `forEach`.

**Code :**
```javascript
const corps = document.querySelector("#corps");
let produits = [];

function afficher() {
  corps.innerHTML = "";
  produits.forEach(p => {
    const tr = document.createElement("tr");
    [p.nom, p.categorie, `${p.prix} DH`, p.stock].forEach(valeur => {
      const td = document.createElement("td");
      td.textContent = valeur;
      tr.append(td);
    });
    corps.append(tr);
  });
}

async function charger() {
  const reponse = await fetch("data/stock.json");
  produits = await reponse.json();
  afficher();
}

charger();
```
</solution>

### Étape 2 : Stock faible

Les lignes des produits dont le stock est **inférieur à 3** reçoivent la classe `alerte` (en rouge).

<!-- hint
Dans la boucle, teste `p.stock < 3`.
-->

<!-- hint
Si c'est vrai : `tr.classList.add("alerte")`.
-->

<!-- check
await wait(900);
const alertes = $$("#corps tr.alerte").map(tr => text(tr.querySelector("td"))).sort();
if (alertes.join(",") !== "Chaise ergonomique,Micro USB,Souris sans fil,Tapis de souris") return `4 produits ont un stock inférieur à 3 : Chaise ergonomique, Micro USB, Souris sans fil, Tapis de souris (tu en signales ${alertes.length}).`;
return true;
-->

### Étape 3 : Les statistiques

Remplis les trois cartes : `#nb-produits` (nombre de produits), `#nb-rupture` (produits avec un stock de 0) et `#valeur-stock` (somme de `prix × stock`, en DH).

<!-- hint
Ruptures : `filter(p => p.stock === 0).length`.
-->

<!-- hint
Valeur : `reduce((total, p) => total + p.prix * p.stock, 0)`.
-->

<!-- check
await wait(900);
if (text("#nb-produits") !== "12") return `#nb-produits doit afficher 12 (il affiche « ${text("#nb-produits")} »).`;
if (text("#nb-rupture") !== "3") return `#nb-rupture doit afficher 3 (il affiche « ${text("#nb-rupture")} »).`;
if (text("#valeur-stock").replace(/\D/g, "") !== "22350") return `#valeur-stock doit afficher 22350 DH (il affiche « ${text("#valeur-stock")} »).`;
return true;
-->

### Étape 4 : Filtrer par catégorie

Après le chargement, remplis `#categorie` avec une option par catégorie présente dans les données, **sans doublon**. Quand on choisit une catégorie, le tableau **et** les statistiques ne concernent plus que cette catégorie.

<!-- hint
`new Set(produits.map(p => p.categorie))` garde chaque catégorie une seule fois.
-->

<!-- hint
Calcule la liste filtrée dans `afficher()` et utilise-la pour le tableau ET les stats.
-->

<!-- check
await wait(900);
const options = $$("#categorie option").map(o => o.value);
if (options.length !== 4 || !["tous", "informatique", "audio", "maison"].every(v => options.includes(v))) return `#categorie doit contenir 4 options : tous, informatique, audio, maison (il en a ${options.length}).`;
await choose("#categorie", "audio");
const noms = $$("#corps tr").map(tr => text(tr.querySelector("td"))).sort();
if (noms.join(",") !== "Casque audio,Enceinte Bluetooth,Micro USB,Écouteurs") return `Avec « audio », le tableau doit afficher 4 produits (il en affiche ${noms.length}).`;
if (text("#nb-produits") !== "4" || text("#nb-rupture") !== "1" || text("#valeur-stock").replace(/\D/g, "") !== "5750") return "Avec « audio », les statistiques doivent afficher 4 produits, 1 rupture et 5750 DH.";
await choose("#categorie", "tous");
if ($$("#corps tr").length !== 12) return "Avec « tous », les 12 produits doivent revenir.";
return true;
-->

### Étape 5 : Trier les colonnes

Un clic sur un en-tête `th[data-tri]` trie le tableau selon cette colonne, en ordre **croissant**. Un deuxième clic sur le **même** en-tête inverse l'ordre. Le tri fonctionne aussi avec le filtre.

<!-- hint
Garde la colonne triée et le sens (`croissant`) dans des variables.
-->

<!-- hint
Nombres : `a - b`. Textes : `a.localeCompare(b)`. Inverse le résultat si le sens est décroissant.
-->

<!-- check
await wait(900);
const prix = () => $$("#corps tr").map(tr => parseInt(text(tr.querySelectorAll("td")[2])));
await click('th[data-tri="prix"]');
let p = prix();
if (p.some((v, i) => i > 0 && v < p[i - 1])) return `Après un clic sur Prix, les prix doivent être croissants : ${p.join(", ")}.`;
await click('th[data-tri="prix"]');
p = prix();
if (p.some((v, i) => i > 0 && v > p[i - 1])) return `Après un deuxième clic sur Prix, les prix doivent être décroissants : ${p.join(", ")}.`;
await click('th[data-tri="nom"]');
const noms = $$("#corps tr").map(tr => text(tr.querySelector("td")));
const attendus = [...noms].sort((a, b) => a.localeCompare(b, "fr"));
if (noms.join(",") !== attendus.join(",")) return "Après un clic sur Nom, les noms doivent être dans l'ordre alphabétique (utilise localeCompare pour les textes).";
await choose("#categorie", "maison");
if ($$("#corps tr").length !== 3) return "Le filtre par catégorie doit toujours fonctionner avec le tri.";
return true;
-->

