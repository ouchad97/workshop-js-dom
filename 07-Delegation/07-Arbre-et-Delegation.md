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

<!-- check
const premiere = $("#taches .tache");
await click(premiere.querySelector(".texte"));
if (!premiere.classList.contains("fait")) return "Après un clic sur la première tâche, elle doit avoir la classe fait.";
if ($$("#taches .fait").length !== 1) return "Seule la tâche cliquée doit recevoir la classe fait.";
await click(premiere.querySelector(".texte"));
if (premiere.classList.contains("fait")) return "Un deuxième clic doit retirer la classe fait (toggle).";
return true;
-->

<solution>
### Étapes de résolution

1.  **Un écouteur** sur la `ul` `#taches`.
2.  **Retrouver la tâche** : `event.target.closest(".tache")` marche que l'on clique sur le `span` ou sur le `li`.
3.  **Basculer** la classe avec `classList.toggle("fait")`.

**Code :**
```javascript
const liste = document.querySelector("#taches");

liste.addEventListener("click", event => {
  const tache = event.target.closest(".tache");
  if (!tache) return;
  tache.classList.toggle("fait");
});
```
</solution>

### Challenge 3 : Supprimer une tâche

Toujours avec un seul écouteur sur `#taches` : un clic sur un bouton `.supprimer` retire **sa** tâche de la liste.

<!-- check
await click($$("#taches .supprimer")[1]);
const textes = $$("#taches .texte").map(t => text(t));
if (textes.length !== 2) return `Après un clic sur le 2e bouton ✕, il doit rester 2 tâches (il en reste ${textes.length}).`;
if (textes.includes("Faire les challenges")) return "C'est la tâche du bouton cliqué (« Faire les challenges ») qui doit disparaître.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Un écouteur** sur `#taches`.
2.  **Tester la cible** : `event.target.matches(".supprimer")`.
3.  **Remonter au li** avec `closest(".tache")` puis `remove()`.

**Code :**
```javascript
const liste = document.querySelector("#taches");

liste.addEventListener("click", event => {
  if (event.target.matches(".supprimer")) {
    event.target.closest(".tache").remove();
  }
});
```
</solution>

### Challenge 4 : Ajouter des tâches

Le bouton `#ajouter` ajoute une tâche « Nouvelle tâche » avec la même structure HTML que les autres. Son bouton ✕ doit fonctionner **sans** ajouter de nouvel écouteur : reprends ton code du challenge 3.

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

<solution>
### Étapes de résolution

1.  **Garder** l'écouteur délégué du challenge 3.
2.  **Créer** un `li.tache` qui contient un `span.texte` et un `button.supprimer`.
3.  **Rien d'autre** : le clic sur le nouveau ✕ remonte jusqu'à `#taches`, déjà écouté.

**Code :**
```javascript
const liste = document.querySelector("#taches");

liste.addEventListener("click", event => {
  if (event.target.matches(".supprimer")) {
    event.target.closest(".tache").remove();
  }
});

document.querySelector("#ajouter").addEventListener("click", () => {
  const li = document.createElement("li");
  li.classList.add("tache");

  const texte = document.createElement("span");
  texte.classList.add("texte");
  texte.textContent = "Nouvelle tâche";

  const bouton = document.createElement("button");
  bouton.classList.add("supprimer");
  bouton.textContent = "✕";

  li.append(texte, bouton);
  liste.append(li);
});
```
</solution>

### Challenge 5 : Tâches restantes

`#restantes` affiche le nombre de tâches **non faites**, par exemple `3 tâche(s) restante(s)`. Le texte est correct au chargement et se met à jour quand on coche ou supprime une tâche. Combine les challenges 2 et 3.

<!-- check
const nombre = () => (text("#restantes").match(/\d+/) || [])[0];
if (nombre() !== "3") return "Au chargement, #restantes doit afficher 3.";
await click($("#taches .texte"));
if (nombre() !== "2") return "Après avoir coché une tâche, #restantes doit afficher 2.";
await click($$("#taches .supprimer")[2]);
if (nombre() !== "1") return "Après avoir supprimé une tâche non faite, #restantes doit afficher 1.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Une fonction** `majCompteur()` qui compte les `.tache` sans la classe `fait`.
2.  **Sélecteur** : `.tache:not(.fait)`.
3.  **Appels** : au chargement, puis à la fin de l'écouteur de clic.
4.  **Attention à l'ordre** : on teste d'abord le bouton supprimer, sinon le clic sur ✕ coche aussi la tâche.

**Code :**
```javascript
const liste = document.querySelector("#taches");
const restantes = document.querySelector("#restantes");

function majCompteur() {
  const nombre = liste.querySelectorAll(".tache:not(.fait)").length;
  restantes.textContent = `${nombre} tâche(s) restante(s)`;
}

liste.addEventListener("click", event => {
  if (event.target.matches(".supprimer")) {
    event.target.closest(".tache").remove();
  } else {
    const tache = event.target.closest(".tache");
    if (tache) tache.classList.toggle("fait");
  }
  majCompteur();
});

majCompteur();
```
</solution>
