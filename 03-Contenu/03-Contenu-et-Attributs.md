# Contenu et attributs

Un élément HTML a un **contenu** (son texte, ses balises enfants) et des **attributs** (`src`, `href`, `alt`, `data-*`…). JavaScript peut lire et modifier les deux.

## La notion

### `textContent` ou `innerHTML` ?

```javascript
const bio = document.querySelector("#bio");

bio.textContent = "J'aime le <b>code</b>";  // affiche les balises comme du texte
bio.innerHTML = "J'aime le <b>code</b>";    // interprète les balises : « code » en gras
```

> **Sécurité :** n'utilise jamais `innerHTML` avec un texte saisi par l'utilisateur. Pour du texte simple, préfère toujours `textContent`.

### Lire et écrire un attribut

```javascript
const image = document.querySelector("#avatar");

console.log(image.getAttribute("src"));   // lire
image.setAttribute("alt", "Photo de profil"); // écrire

// Les attributs courants existent aussi comme propriétés :
image.src = "img/avatar-2.svg";
image.alt = "Photo de profil";
```

### Les attributs `data-*` et `dataset`

Les attributs qui commencent par `data-` servent à stocker tes propres informations dans le HTML.

```javascript
// <span id="statut" data-statut="hors-ligne">
const statut = document.querySelector("#statut");
console.log(statut.dataset.statut);  // "hors-ligne"
statut.dataset.statut = "en-ligne";  // modifie l'attribut data-statut
```

### Challenge 1 : Ton nom

Remplace « Prénom Nom » par ton prénom et ton nom.

<!-- check
const nom = text("#nom");
if (!nom || nom === "Prénom Nom") return "Le titre #nom affiche toujours « Prénom Nom ».";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `#nom`.
2.  **Texte** : `textContent` suffit, il n'y a pas de balise à créer.

**Code :**
```javascript
const nom = document.querySelector("#nom");
nom.textContent = "Salma Idrissi";
```
</solution>

### Challenge 2 : Une bio avec du gras

Remplace la bio par une phrase qui contient un mot **en gras** (une balise `<strong>`).

<!-- hint
`textContent` affiche les balises comme du texte : il faut une autre propriété.
-->

<!-- hint
Avec `innerHTML`, la balise `<strong>` est interprétée.
-->

<!-- check
if (!$("#bio strong")) return "La bio doit contenir une balise <strong> : utilise innerHTML.";
if (text("#bio").includes("Bio à compléter")) return "Remplace tout le texte de la bio.";
return true;
-->

### Challenge 3 : Changer la photo

Change l'image de profil : sa source doit devenir `img/avatar-2.svg` et son texte alternatif `Ma photo`.

<!-- hint
Les attributs se modifient avec `setAttribute(nom, valeur)`.
-->

<!-- hint
Il y a deux attributs à changer : `src` et `alt`.
-->

<!-- check
const img = $("#avatar");
if (!img.getAttribute("src").includes("avatar-2.svg")) return "L'attribut src doit être img/avatar-2.svg.";
if (img.getAttribute("alt") !== "Ma photo") return "L'attribut alt doit être exactement « Ma photo ».";
return true;
-->

### Challenge 4 : Le lien du portfolio

Le lien « Mon portfolio » doit pointer vers `https://github.com` et s'ouvrir dans un **nouvel onglet**.

<!-- hint
Le lien se trouve avec `#site` ; sa destination est l'attribut `href`.
-->

<!-- hint
Pour un nouvel onglet : l'attribut `target` avec la valeur `_blank`.
-->

<!-- check
const lien = $("#site");
if (!(lien.getAttribute("href") || "").startsWith("https://github.com")) return "L'attribut href doit être https://github.com.";
if (lien.getAttribute("target") !== "_blank") return "Pour ouvrir dans un nouvel onglet, l'attribut target doit valoir _blank.";
return true;
-->

### Challenge 5 : En ligne

1. Affiche dans la console la valeur actuelle de `data-statut` du badge `#statut`.
2. Passe ensuite ce statut à `en-ligne` et change le texte du badge en « En ligne » (le badge devient vert).

<!-- hint
`data-statut` se lit et s'écrit avec `dataset.statut`.
-->

<!-- hint
Fais le `console.log` AVANT de changer la valeur.
-->

<!-- check
if (!logged("hors-ligne")) return "Affiche d'abord la valeur actuelle de data-statut dans la console.";
const statut = $("#statut");
if (statut.dataset.statut !== "en-ligne") return "data-statut doit valoir en-ligne : utilise dataset.";
if (text(statut) !== "En ligne") return "Le texte du badge doit être « En ligne ».";
return true;
-->

### Challenge 6 : Bonus · Des infobulles

Ajoute à `#nom`, `#metier` et `#bio` un attribut `title` qui contient leur propre texte (l'infobulle qui apparaît au survol). Utilise une boucle.

<!-- hint
Mets les trois sélecteurs dans un tableau et fais une boucle dessus.
-->

<!-- hint
Dans la boucle : `element.title = element.textContent`.
-->

<!-- check
const manque = ["#nom", "#metier", "#bio"].find(sel => $(sel).getAttribute("title") !== $(sel).textContent);
if (manque) return `L'attribut title de ${manque} doit contenir exactement son texte.`;
if (!/forEach|for\s*\(|while\s*\(/.test(code())) return "Utilise une boucle (forEach, for…) au lieu de répéter le code.";
return true;
-->
