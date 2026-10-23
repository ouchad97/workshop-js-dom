# Modifier le style et les classes

Niveau 1 de l'escalier : découverte du DOM. Une fois un élément sélectionné, on peut changer son apparence de deux façons : directement avec `style`, ou en ajoutant des **classes** CSS avec `classList`.

## La notion

### La propriété `style`

```javascript
const marche = document.querySelector(".step");

marche.style.backgroundColor = "tomato";   // background-color devient backgroundColor
marche.style.width = "100px";              // toujours avec l'unité !
marche.style.borderRadius = "50%";
```

En CSS on écrit `background-color`, en JavaScript on écrit `backgroundColor` (camelCase).

### La propriété `classList`

```javascript
marche.classList.add("active");      // ajoute une classe
marche.classList.remove("active");   // retire une classe
marche.classList.toggle("active");   // ajoute si absente, retire si présente
marche.classList.contains("active"); // true ou false
```

> **Bonne pratique :** pour plusieurs changements de style, prépare une classe dans le CSS et ajoute-la avec `classList`. La page de l'escalier contient déjà une classe `active` (orange).

### Modifier plusieurs éléments

`querySelectorAll` retourne une liste : il faut une boucle pour modifier chaque élément.

```javascript
const marches = document.querySelectorAll(".step");
marches.forEach((marche, index) => {
  marche.style.height = "50px";
});
```

### Challenge 1 : La première marche

Change la couleur de fond de la **première** marche (et seulement elle).

<!-- check
const steps = $$(".step");
if (css(steps[0], "backgroundColor") === "rgb(90, 98, 104)") return "La première marche a toujours sa couleur d'origine.";
if (steps.slice(1).some(s => s.style.backgroundColor || s.classList.length > 1)) return "Seule la première marche doit changer.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `querySelector(".step")` retourne la première marche.
2.  **Style** : modifier `style.backgroundColor`.

**Code :**
```javascript
const premiere = document.querySelector(".step");
premiere.style.backgroundColor = "crimson";
```
</solution>

### Challenge 2 : Agrandir l'escalier

Agrandis **toutes** les marches de l'escalier (plus larges ou plus hautes).

<!-- check
const steps = $$(".step");
const petite = steps.find(s => s.offsetWidth <= 60 && s.offsetHeight <= 34);
if (petite) return `La marche ${petite.textContent} n'a pas été agrandie : change width ou height de chaque marche.`;
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection multiple** : `querySelectorAll(".step")`.
2.  **Boucle** : `forEach` sur chaque marche.
3.  **Style** : modifier `width` et `height` (avec l'unité `px`).

**Code :**
```javascript
const marches = document.querySelectorAll(".step");

marches.forEach(marche => {
  marche.style.width = "80px";
  marche.style.height = "45px";
});
```
</solution>

### Challenge 3 : Les marches impaires

Change uniquement la couleur des marches impaires : les marches **1, 3 et 5**.

<!-- check
const steps = $$(".step");
const impaires = [0, 2, 4], paires = [1, 3];
if (impaires.some(i => css(steps[i], "backgroundColor") === "rgb(90, 98, 104)")) return "Les marches 1, 3 et 5 doivent toutes changer de couleur.";
if (paires.some(i => css(steps[i], "backgroundColor") !== "rgb(108, 117, 125)")) return "Les marches 2 et 4 ne doivent pas changer.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Boucle avec index** : `forEach((marche, index) => ...)`.
2.  **Condition** : la marche 1 est à l'index 0, la marche 3 à l'index 2… donc les index **pairs** (`index % 2 === 0`).

**Code :**
```javascript
const marches = document.querySelectorAll(".step");

marches.forEach((marche, index) => {
  if (index % 2 === 0) {
    marche.style.backgroundColor = "teal";
  }
});

// Autre méthode avec un sélecteur CSS :
// document.querySelectorAll(".step:nth-child(odd)")
```
</solution>

### Challenge 4 : Un texte sur la dernière marche

Ajoute un texte personnalisé sur la **dernière** marche (par exemple « Top ! »).

<!-- check
const steps = $$(".step");
const derniere = steps[steps.length - 1];
if (!derniere.textContent.trim() || derniere.textContent.trim() === "5") return "La dernière marche affiche toujours « 5 » : change son textContent.";
if (steps.slice(0, -1).some((s, i) => s.textContent.trim() !== String(i + 1))) return "Seule la dernière marche doit changer de texte.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : la dernière marche est à l'index `length - 1`, ou `#step5`.
2.  **Texte** : modifier `textContent`.

**Code :**
```javascript
const marches = document.querySelectorAll(".step");
const derniere = marches[marches.length - 1];
derniere.textContent = "Top !";
```
</solution>

### Challenge 5 : Une classe sur la troisième marche

Ajoute une nouvelle classe à la **troisième** marche. Tu peux utiliser la classe `active` déjà prévue dans le CSS.

<!-- check
const troisieme = $$(".step")[2];
if (troisieme.classList.length < 2) return "La troisième marche n'a toujours que la classe step : utilise classList.add().";
if ($$(".step").some((s, i) => i !== 2 && s.classList.length > 1)) return "Seule la troisième marche doit recevoir la classe.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `#step3` ou l'index `2`.
2.  **Classe** : `classList.add("active")` garde la classe `step` et ajoute `active`.

**Code :**
```javascript
const troisieme = document.querySelector("#step3");
troisieme.classList.add("active");
```

À éviter : `troisieme.className = "active"` remplace **toutes** les classes (la marche perd `step`).
</solution>
