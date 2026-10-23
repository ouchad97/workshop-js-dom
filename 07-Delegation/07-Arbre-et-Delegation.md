# Parcourir l'arbre et délégation d'événements

Le DOM est un **arbre** : chaque élément a un parent, des enfants et des frères. Savoir s'y déplacer permet, par exemple, de retrouver la tâche qui contient le bouton cliqué. La **délégation** permet d'écouter toute une liste avec un seul écouteur, même les éléments ajoutés plus tard.

## La notion

### Se déplacer dans l'arbre

```javascript
const liste = document.querySelector("#taches");

liste.children;            // les éléments enfants (HTMLCollection)
liste.children.length;     // combien d'enfants
liste.firstElementChild;   // le premier enfant
liste.lastElementChild;    // le dernier enfant

const bouton = document.querySelector(".supprimer");
bouton.parentElement;              // le parent direct (le li)
bouton.closest(".tache");          // le plus proche ancêtre qui correspond au sélecteur
bouton.previousElementSibling;     // le frère juste avant (le span)
```

### Le problème : un écouteur par élément

Si on met un écouteur sur chaque `li`, les tâches ajoutées **après** n'en ont pas.

### La solution : la délégation

Les événements **remontent** : un clic sur un bouton est aussi un clic sur son `li`, puis sur la `ul`. On écoute donc le parent une seule fois, et on regarde **qui** a été cliqué avec `event.target`.

```javascript
liste.addEventListener("click", event => {
  if (event.target.matches(".supprimer")) {
    // clic sur un bouton supprimer
  }
  const tache = event.target.closest(".tache");
  // tache = le li cliqué (ou null si on a cliqué à côté)
});
```

### Challenge 1 : Explorer la liste

Sans utiliser `querySelectorAll`, affiche dans la console :

1. le nombre d'enfants de `#taches` ;
2. le texte de la **dernière** tâche (son `.texte`).

<!-- check
if (!logs().some(line => /(^|[\s:=])3$/.test(line.trim()))) return "Affiche le nombre d'enfants de #taches (children.length).";
if (!logs().some(line => line.trim() === "Pousser sur GitHub")) return "Affiche le texte de la dernière tâche : « Pousser sur GitHub » (sans le ✕).";
if (/querySelectorAll/.test(code())) return "Sans querySelectorAll : utilise children et lastElementChild.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Enfants** : `children.length`.
2.  **Dernier enfant** : `lastElementChild` donne le `li`.
3.  **Le texte seul** : dans ce `li`, on cherche le `.texte` (sinon on aurait aussi le ✕ du bouton).

**Code :**
```javascript
const liste = document.querySelector("#taches");

console.log(liste.children.length);

const derniere = liste.lastElementChild;
console.log(derniere.querySelector(".texte").textContent);
```
</solution>

### Challenge 2 : Cocher une tâche

Avec **un seul** écouteur sur `#taches` : quand on clique sur une tâche, elle reçoit la classe `fait` (barrée). Un deuxième clic retire la classe.

<!-- hint
Mets l'écouteur sur la `ul` `#taches`, pas sur chaque `li`.
-->

<!-- hint
`event.target.closest(".tache")` retrouve le `li` cliqué, même si on clique sur le texte.
-->

<!-- check
const premiere = $("#taches .tache");
await click(premiere.querySelector(".texte"));
if (!premiere.classList.contains("fait")) return "Après un clic sur la première tâche, elle doit avoir la classe fait.";
if ($$("#taches .fait").length !== 1) return "Seule la tâche cliquée doit recevoir la classe fait.";
await click(premiere.querySelector(".texte"));
if (premiere.classList.contains("fait")) return "Un deuxième clic doit retirer la classe fait (toggle).";
const nouvelle = doc().createElement("li");
nouvelle.className = "tache";
nouvelle.innerHTML = '<span class="texte">Ajoutée après</span><button class="supprimer">✕</button>';
$("#taches").append(nouvelle);
await click(nouvelle.querySelector(".texte"));
if (!nouvelle.classList.contains("fait")) return "Une tâche ajoutée plus tard doit aussi se cocher : mets un seul écouteur sur #taches (délégation).";
return true;
-->

### Challenge 3 : Supprimer une tâche

Toujours avec un seul écouteur sur `#taches` : un clic sur un bouton `.supprimer` retire **sa** tâche de la liste.

<!-- hint
`event.target.matches(".supprimer")` te dit si on a cliqué sur un bouton ✕.
-->

<!-- hint
Depuis le bouton, remonte au `li` avec `closest(".tache")`, puis `remove()`.
-->

<!-- check
await click($$("#taches .supprimer")[1]);
const textes = $$("#taches .texte").map(t => text(t));
if (textes.length !== 2) return `Après un clic sur le 2e bouton ✕, il doit rester 2 tâches (il en reste ${textes.length}).`;
if (textes.includes("Faire les challenges")) return "C'est la tâche du bouton cliqué (« Faire les challenges ») qui doit disparaître.";
const nouvelle = doc().createElement("li");
nouvelle.className = "tache";
nouvelle.innerHTML = '<span class="texte">Ajoutée après</span><button class="supprimer">✕</button>';
$("#taches").append(nouvelle);
await click(nouvelle.querySelector(".supprimer"));
if (nouvelle.isConnected) return "Le ✕ d'une tâche ajoutée plus tard doit aussi marcher : mets un seul écouteur sur #taches (délégation).";
return true;
-->

### Challenge 4 : Ajouter des tâches

Le bouton `#ajouter` ajoute une tâche « Nouvelle tâche » avec la même structure HTML que les autres. Son bouton ✕ doit fonctionner **sans** ajouter de nouvel écouteur : reprends ton code du challenge 3.

<!-- hint
Garde l'écouteur du challenge 3 tel quel.
-->

<!-- hint
Construis un `li.tache` avec un `span.texte` et un `button.supprimer`, comme dans le HTML de la page.
-->

<!-- check
await click("#ajouter");
let taches = $$("#taches .tache");
if (taches.length !== 4) return "Après un clic sur #ajouter, il doit y avoir 4 tâches.";
const nouvelle = taches[3];
if (!nouvelle.querySelector(".texte") || !nouvelle.querySelector(".supprimer")) return "La nouvelle tâche doit contenir un span.texte et un button.supprimer, comme les autres.";
await click(nouvelle.querySelector(".supprimer"));
if ($$("#taches .tache").length !== 3) return "Le bouton ✕ de la nouvelle tâche doit la supprimer : utilise la délégation sur #taches.";
return true;
-->

### Challenge 5 : Tâches restantes

`#restantes` affiche le nombre de tâches **non faites**, par exemple `3 tâche(s) restante(s)`. Le texte est correct au chargement et se met à jour quand on coche ou supprime une tâche. Combine les challenges 2 et 3.

<!-- hint
Écris une fonction `majCompteur()` qui compte les `.tache:not(.fait)`.
-->

<!-- hint
Appelle-la au chargement et à la fin de ton écouteur de clic.
-->

<!-- check
const nombre = () => (text("#restantes").match(/\d+/) || [])[0];
if (nombre() !== "3") return "Au chargement, #restantes doit afficher 3.";
await click($("#taches .texte"));
if (nombre() !== "2") return "Après avoir coché une tâche, #restantes doit afficher 2.";
await click($$("#taches .supprimer")[2]);
if (nombre() !== "1") return "Après avoir supprimé une tâche non faite, #restantes doit afficher 1.";
return true;
-->

### Challenge 6 : Bonus · Priorité

Un **double-clic** sur une tâche la déplace tout en haut de la liste (événement `dblclick`, toujours avec un seul écouteur sur `#taches`).

<!-- hint
L'événement s'appelle `dblclick`.
-->

<!-- hint
`liste.prepend(tache)` déplace une tâche existante au début.
-->

<!-- check
await fire($$("#taches .texte")[2], "dblclick");
const textes = $$("#taches .texte").map(t => text(t));
if (textes[0] !== "Pousser sur GitHub") return "Après un double-clic sur « Pousser sur GitHub », elle doit être la première tâche.";
if (textes.length !== 3) return "Le double-clic doit déplacer la tâche, pas la dupliquer ni la supprimer.";
await fire($$("#taches .texte")[2], "dblclick");
if (text($$("#taches .texte")[0]) !== "Faire les challenges") return "Le double-clic doit marcher sur n'importe quelle tâche.";
return true;
-->
