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

Agrandis **toutes** les marches de l'escalier (plus larges ou plus hautes), avec une boucle.

<!-- hint
Il faut modifier chaque marche : sélectionne-les toutes, puis fais une boucle.
-->

<!-- hint
Dans la boucle : `marche.style.width = "80px"` (n'oublie pas l'unité).
-->

<!-- check
const steps = $$(".step");
const petite = steps.find(s => s.offsetWidth <= 60 && s.offsetHeight <= 34);
if (petite) return `La marche ${petite.textContent} n'a pas été agrandie : change width ou height de chaque marche.`;
if (!/forEach|for\s*\(|while\s*\(/.test(code())) return "Utilise une boucle (forEach, for…) au lieu de répéter le code.";
return true;
-->

### Challenge 3 : Les marches impaires

Change uniquement la couleur des marches impaires : les marches **1, 3 et 5**.

<!-- hint
Utilise le deuxième paramètre de `forEach` : l'index.
-->

<!-- hint
Les marches 1, 3 et 5 sont aux index 0, 2 et 4 : `index % 2 === 0`.
-->

<!-- check
const steps = $$(".step");
const impaires = [0, 2, 4], paires = [1, 3];
if (impaires.some(i => css(steps[i], "backgroundColor") === "rgb(90, 98, 104)")) return "Les marches 1, 3 et 5 doivent toutes changer de couleur.";
if (paires.some(i => css(steps[i], "backgroundColor") !== "rgb(108, 117, 125)")) return "Les marches 2 et 4 ne doivent pas changer.";
return true;
-->

### Challenge 4 : Un texte sur la dernière marche

Ajoute un texte personnalisé sur la **dernière** marche (par exemple « Top ! »).

<!-- hint
La dernière marche est à l'index `marches.length - 1`.
-->

<!-- hint
Change son texte avec `textContent`.
-->

<!-- check
const steps = $$(".step");
const derniere = steps[steps.length - 1];
if (!derniere.textContent.trim() || derniere.textContent.trim() === "5") return "La dernière marche affiche toujours « 5 » : change son textContent.";
if (steps.slice(0, -1).some((s, i) => s.textContent.trim() !== String(i + 1))) return "Seule la dernière marche doit changer de texte.";
return true;
-->

### Challenge 5 : Une classe sur la troisième marche

Ajoute une nouvelle classe à la **troisième** marche. Tu peux utiliser la classe `active` déjà prévue dans le CSS.

<!-- hint
La troisième marche a l'id `step3`.
-->

<!-- hint
`classList.add("active")` ajoute une classe sans enlever `step`.
-->

<!-- check
const troisieme = $$(".step")[2];
if (troisieme.classList.length < 2) return "La troisième marche n'a toujours que la classe step : utilise classList.add().";
if ($$(".step").some((s, i) => i !== 2 && s.classList.length > 1)) return "Seule la troisième marche doit recevoir la classe.";
return true;
-->

### Challenge 6 : Bonus · Un dégradé

Donne une couleur **différente** à chaque marche, de plus en plus claire en montant. Astuce : calcule la couleur à partir de l'index, par exemple avec `hsl(160, 50%, ${20 + index * 12}%)`.

<!-- hint
Dans `forEach((marche, index) => ...)`, l'index va de 0 à 4.
-->

<!-- hint
Construis la couleur avec un template literal : `hsl(160, 50%, ${20 + index * 12}%)`.
-->

<!-- check
const couleurs = $$(".step").map(s => css(s, "backgroundColor"));
if (new Set(couleurs).size !== couleurs.length) return "Chaque marche doit avoir une couleur différente.";
const clarte = c => { const [r, g, b] = c.match(/\d+/g).map(Number); return r + g + b; };
if (couleurs.some((c, i) => i > 0 && clarte(c) <= clarte(couleurs[i - 1]))) return "Les couleurs doivent devenir de plus en plus claires de la marche 1 à la marche 5.";
if (!/forEach|for\s*\(|while\s*\(/.test(code())) return "Utilise une boucle (forEach, for…) au lieu de répéter le code.";
return true;
-->
