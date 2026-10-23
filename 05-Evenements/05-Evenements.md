# Les événements

Niveau 2 de l'escalier : dynamique et interactions. Un **événement** est quelque chose qui se passe dans la page : un clic, une touche, une saisie… Avec `addEventListener`, on demande au navigateur d'exécuter une fonction quand l'événement arrive.

## La notion

### Écouter un événement

```javascript
const bouton = document.querySelector("#mon-bouton");

bouton.addEventListener("click", () => {
  console.log("Clic !");
});
```

Le code dans la fonction ne s'exécute **pas** tout de suite : il s'exécute à **chaque** clic.

### Créer un bouton puis l'écouter

La page de l'escalier n'a pas de boutons : tu vas les créer (étape 04), les placer dans `#controls`, puis les écouter.

```javascript
const controls = document.querySelector("#controls");

const bouton = document.createElement("button");
bouton.id = "btn-exemple";
bouton.textContent = "Clique-moi";
controls.append(bouton);

bouton.addEventListener("click", () => {
  bouton.textContent = "Merci !";
});
```

### Les événements courants

| Événement | Quand ? |
|-----------|---------|
| `click` | clic sur l'élément |
| `input` | la valeur d'un champ change (à chaque frappe) |
| `change` | la valeur est validée (select, checkbox…) |
| `keydown` | une touche est enfoncée |
| `mouseover` | la souris entre sur l'élément |
| `submit` | un formulaire est envoyé |

### L'objet `event`

La fonction reçoit un objet qui décrit l'événement : `event.target` est l'élément touché, `event.key` la touche pressée.

```javascript
document.addEventListener("keydown", event => {
  console.log(event.key);
});
```

> **Important :** chaque challenge vérifie tes boutons par leur **id**. Respecte bien les id demandés.

### Challenge 1 : Changer toutes les couleurs

Crée un bouton avec l'id `btn-couleur` qui change la couleur de **toutes** les marches au clic.

<!-- check
if (!$("#btn-couleur")) return "Aucun bouton #btn-couleur dans la page : crée-le avec createElement et place-le dans #controls.";
const avant = $$(".step").map(s => css(s, "backgroundColor"));
await click("#btn-couleur");
const apres = $$(".step").map(s => css(s, "backgroundColor"));
const pareille = apres.findIndex((c, i) => c === avant[i]);
if (pareille !== -1) return `Après le clic, la marche ${pareille + 1} a gardé sa couleur.`;
return true;
-->

<solution>
### Étapes de résolution

1.  **Créer le bouton** avec l'id `btn-couleur` et le placer dans `#controls`.
2.  **Écouter le clic** avec `addEventListener("click", ...)`.
3.  **Dans l'écouteur** : boucle sur toutes les marches et change `style.backgroundColor`.

**Code :**
```javascript
const controls = document.querySelector("#controls");
const marches = document.querySelectorAll(".step");

const btnCouleur = document.createElement("button");
btnCouleur.id = "btn-couleur";
btnCouleur.textContent = "Couleur";
controls.append(btnCouleur);

btnCouleur.addEventListener("click", () => {
  marches.forEach(marche => {
    marche.style.backgroundColor = "#1d6b59";
  });
});
```
</solution>

### Challenge 2 : Inverser l'escalier

Crée un bouton `btn-inverser` qui inverse le sens de l'escalier au clic (de haut en bas → de bas en haut). Un deuxième clic le remet dans le sens d'origine.

<!-- hint
L'escalier `#staircase` est un conteneur flex.
-->

<!-- hint
`flex-direction: row-reverse` inverse l'ordre ; teste la valeur actuelle pour choisir le sens.
-->

<!-- check
if (!$("#btn-inverser")) return "Aucun bouton #btn-inverser dans la page.";
const pos = () => { const s = $$(".step"); return s[0].getBoundingClientRect().left - s[s.length - 1].getBoundingClientRect().left; };
const sens = Math.sign(pos());
await click("#btn-inverser");
await wait(400);
if (Math.sign(pos()) === sens) return "Après un clic, la marche 1 doit passer de l'autre côté de l'escalier.";
await click("#btn-inverser");
await wait(400);
if (Math.sign(pos()) !== sens) return "Un deuxième clic doit remettre l'escalier dans son sens d'origine.";
return true;
-->

### Challenge 3 : Ajouter une marche

Crée un bouton `btn-plus` (texte « + ») qui ajoute une nouvelle marche à la fin de l'escalier à **chaque** clic. La nouvelle marche a la classe `step` et affiche son numéro.

<!-- hint
À chaque clic, crée une `div` avec la classe `step`.
-->

<!-- hint
Le numéro de la nouvelle marche : nombre de marches actuel + 1 (recompte-les dans l'écouteur).
-->

<!-- check
if (!$("#btn-plus")) return "Aucun bouton #btn-plus dans la page.";
await click("#btn-plus");
await click("#btn-plus");
const steps = $$("#staircase .step");
if (steps.length !== 7) return `Après 2 clics, l'escalier doit avoir 7 marches (il en a ${steps.length}).`;
if (text(steps[5]) !== "6" || text(steps[6]) !== "7") return "Les nouvelles marches doivent afficher leur numéro (6 puis 7).";
return true;
-->

### Challenge 4 : Retirer une marche

Crée un bouton `btn-moins` (texte « − ») qui supprime la **dernière** marche à chaque clic.

<!-- hint
La dernière marche est `escalier.lastElementChild`.
-->

<!-- hint
Quand il n'y a plus de marche, `lastElementChild` vaut `null` : vérifie avant `remove()`.
-->

<!-- check
if (!$("#btn-moins")) return "Aucun bouton #btn-moins dans la page.";
await click("#btn-moins");
let steps = $$("#staircase .step");
if (steps.length !== 4) return `Après 1 clic, il doit rester 4 marches (il en reste ${steps.length}).`;
if (text(steps[3]) !== "4") return "C'est la dernière marche (la 5) qui doit disparaître.";
await click("#btn-moins");
await click("#btn-moins");
await click("#btn-moins");
await click("#btn-moins");
await click("#btn-moins");
if (errors().length) return "Ton code plante quand il n'y a plus de marche : vérifie que la marche existe avant de la supprimer.";
return true;
-->

### Challenge 5 : Chercher une marche

Crée un champ de saisie avec l'id `numero` et un bouton `btn-valider`. Quand on tape un numéro de marche puis qu'on clique sur le bouton, **cette** marche change de couleur. Si la marche n'existe pas, affiche un message dans la console.

<!-- hint
Crée un `input` (id `numero`) et un bouton (id `btn-valider`), puis lis `champ.value` au clic.
-->

<!-- hint
La marche numéro N est à l'index `N - 1`. Si elle n'existe pas, affiche un message au lieu de la modifier.
-->

<!-- check
if (!$("#numero")) return "Aucun champ #numero dans la page : crée un input.";
if (!$("#btn-valider")) return "Aucun bouton #btn-valider dans la page.";
const couleurs = () => $$(".step").map(s => css(s, "backgroundColor"));
const avant = couleurs();
await type("#numero", "3");
await click("#btn-valider");
const apres = couleurs();
if (apres[2] === avant[2]) return "Après avoir saisi 3 et validé, la marche 3 doit changer de couleur.";
if ([0, 1, 3, 4].some(i => apres[i] !== avant[i])) return "Seule la marche demandée doit changer de couleur.";
await type("#numero", "42");
await click("#btn-valider");
if (errors().length) return "Avec un numéro qui n'existe pas (42), ton code plante : vérifie que la marche existe.";
return true;
-->

### Challenge 6 : Bonus · Au clavier

Sans bouton : la flèche **droite** du clavier (`ArrowRight`) ajoute une marche, la flèche **gauche** (`ArrowLeft`) retire la dernière. Écoute l'événement `keydown` sur `document`.

<!-- hint
Écoute `keydown` sur `document` et regarde `event.key`.
-->

<!-- hint
`"ArrowRight"` : même code que le bouton +. `"ArrowLeft"` : même code que le bouton −.
-->

<!-- check
await fire(doc(), "keydown", { key: "ArrowRight" });
if ($$("#staircase .step").length !== 6) return "Après ArrowRight, l'escalier doit avoir 6 marches.";
if (text($$("#staircase .step")[5]) !== "6") return "La nouvelle marche doit afficher son numéro (6).";
await fire(doc(), "keydown", { key: "ArrowLeft" });
await fire(doc(), "keydown", { key: "ArrowLeft" });
if ($$("#staircase .step").length !== 4) return "Après 2 × ArrowLeft, il doit rester 4 marches.";
await fire(doc(), "keydown", { key: "a" });
if ($$("#staircase .step").length !== 4) return "Les autres touches ne doivent rien changer : teste event.key.";
return true;
-->
