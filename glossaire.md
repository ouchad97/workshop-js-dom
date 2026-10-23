# Glossaire DOM

Cette fiche rassemble les méthodes et notions essentielles rencontrées dans le workshop.

## Notions

### DOM
Document Object Model : la représentation de la page HTML sous forme d'un arbre d'objets, que JavaScript peut lire et modifier.

### Nœud et élément
Tout ce qui est dans l'arbre est un **nœud** (balises, textes, commentaires). Un **élément** est un nœud qui correspond à une balise HTML.

### NodeList
La liste renvoyée par `querySelectorAll`. Elle a une `length`, des index et `forEach`, mais pas `map` ni `filter` : utilise `Array.from(liste)` ou `[...liste]` pour en faire un vrai tableau.

### Événement
Quelque chose qui se passe dans la page (clic, saisie, envoi…) et que l'on peut écouter avec `addEventListener`.

### Propagation (bubbling)
Un événement part de l'élément touché puis **remonte** vers ses parents. C'est ce qui rend la délégation possible.

### Délégation
Écouter un parent plutôt que chacun de ses enfants, et utiliser `event.target` pour savoir quel enfant a été touché.

### Promesse
Un objet qui représente un résultat qui arrivera plus tard (par exemple la réponse d'un `fetch`). On l'attend avec `await`.

### JSON
Un format texte pour échanger des données. `JSON.stringify` transforme un objet en texte, `JSON.parse` fait l'inverse.

## Sélectionner

| Méthode | Retourne |
|---------|----------|
| `document.getElementById("id")` | l'élément ou `null` |
| `document.querySelector("sélecteur")` | le premier élément trouvé ou `null` |
| `document.querySelectorAll("sélecteur")` | une NodeList (éventuellement vide) |
| `element.closest("sélecteur")` | le plus proche ancêtre qui correspond (ou lui-même) |
| `element.matches("sélecteur")` | `true` ou `false` |

## Se déplacer

| Propriété | Donne |
|-----------|-------|
| `parentElement` | le parent |
| `children` | les enfants (HTMLCollection) |
| `firstElementChild` / `lastElementChild` | le premier / dernier enfant |
| `previousElementSibling` / `nextElementSibling` | le frère précédent / suivant |

## Modifier

| Propriété / méthode | Rôle |
|---------------------|------|
| `textContent` | lire ou remplacer le texte |
| `innerHTML` | lire ou remplacer le HTML (attention à la sécurité) |
| `style.propriete` | modifier un style en ligne (`style.backgroundColor`) |
| `classList.add / remove / toggle / contains` | gérer les classes |
| `getAttribute / setAttribute / removeAttribute` | gérer les attributs |
| `dataset.nom` | lire ou écrire un attribut `data-nom` |
| `value` | la valeur d'un champ de formulaire |
| `checked` | l'état d'une case à cocher |
| `disabled` / `hidden` | désactiver / cacher un élément |

## Créer et supprimer

| Méthode | Rôle |
|---------|------|
| `document.createElement("li")` | créer un élément (pas encore affiché) |
| `parent.append(el)` / `parent.prepend(el)` | ajouter à la fin / au début |
| `el.before(autre)` / `el.after(autre)` | placer juste avant / après |
| `el.remove()` | retirer de la page |
| `el.cloneNode(true)` | copier avec tout le contenu |

## Événements

| Code | Rôle |
|------|------|
| `el.addEventListener("click", fonction)` | exécuter la fonction à chaque clic |
| `event.target` | l'élément réellement touché |
| `event.preventDefault()` | annuler le comportement par défaut (envoi de formulaire, lien) |
| `event.key` | la touche pressée (`keydown`) |

Événements courants : `click`, `input`, `change`, `submit`, `keydown`, `mouseover`, `DOMContentLoaded`.

## Données

| Code | Rôle |
|------|------|
| `localStorage.setItem("cle", "valeur")` | enregistrer une chaîne |
| `localStorage.getItem("cle")` | lire (ou `null`) |
| `localStorage.removeItem("cle")` | supprimer |
| `JSON.stringify(objet)` / `JSON.parse(texte)` | objet ↔ texte |
| `await fetch(url)` | envoyer une requête, obtenir une réponse |
| `reponse.ok` / `reponse.status` | la requête a-t-elle réussi ? |
| `await reponse.json()` | lire le contenu JSON de la réponse |
