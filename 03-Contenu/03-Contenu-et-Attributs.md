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

<!-- check
if (!$("#bio strong")) return "La bio doit contenir une balise <strong> : utilise innerHTML.";
if (text("#bio").includes("Bio à compléter")) return "Remplace tout le texte de la bio.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `#bio`.
2.  **HTML** : `innerHTML` interprète la balise `<strong>`, contrairement à `textContent`.

**Code :**
```javascript
const bio = document.querySelector("#bio");
bio.innerHTML = "Passionnée par le <strong>JavaScript</strong> et le design.";
```
</solution>

### Challenge 3 : Changer la photo

Change l'image de profil : sa source doit devenir `img/avatar-2.svg` et son texte alternatif `Ma photo`.

<!-- check
const img = $("#avatar");
if (!img.getAttribute("src").includes("avatar-2.svg")) return "L'attribut src doit être img/avatar-2.svg.";
if (img.getAttribute("alt") !== "Ma photo") return "L'attribut alt doit être exactement « Ma photo ».";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `#avatar`.
2.  **Attributs** : `setAttribute(nom, valeur)` ou les propriétés `src` et `alt`.

**Code :**
```javascript
const avatar = document.querySelector("#avatar");
avatar.setAttribute("src", "img/avatar-2.svg");
avatar.setAttribute("alt", "Ma photo");
```
</solution>

### Challenge 4 : Le lien du portfolio

Le lien « Mon portfolio » doit pointer vers `https://github.com` et s'ouvrir dans un **nouvel onglet**.

<!-- check
const lien = $("#site");
if (!(lien.getAttribute("href") || "").startsWith("https://github.com")) return "L'attribut href doit être https://github.com.";
if (lien.getAttribute("target") !== "_blank") return "Pour ouvrir dans un nouvel onglet, l'attribut target doit valoir _blank.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `#site`.
2.  **Lien** : l'attribut `href`.
3.  **Nouvel onglet** : l'attribut `target="_blank"`.

**Code :**
```javascript
const lien = document.querySelector("#site");
lien.href = "https://github.com";
lien.target = "_blank";
```
</solution>

### Challenge 5 : En ligne

1. Affiche dans la console la valeur actuelle de `data-statut` du badge `#statut`.
2. Passe ensuite ce statut à `en-ligne` et change le texte du badge en « En ligne » (le badge devient vert).

<!-- check
if (!logged("hors-ligne")) return "Affiche d'abord la valeur actuelle de data-statut dans la console.";
const statut = $("#statut");
if (statut.dataset.statut !== "en-ligne") return "data-statut doit valoir en-ligne : utilise dataset.";
if (text(statut) !== "En ligne") return "Le texte du badge doit être « En ligne ».";
return true;
-->

<solution>
### Étapes de résolution

1.  **Lecture** : `dataset.statut` lit l'attribut `data-statut`.
2.  **Écriture** : on affecte une nouvelle valeur à `dataset.statut`.
3.  **Texte** : `textContent`.

**Code :**
```javascript
const statut = document.querySelector("#statut");
console.log(statut.dataset.statut);

statut.dataset.statut = "en-ligne";
statut.textContent = "En ligne";
```
</solution>
