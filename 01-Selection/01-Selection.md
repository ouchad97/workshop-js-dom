# Sélectionner des éléments

Avant de modifier une page, il faut **trouver** l'élément à modifier. Le navigateur transforme le HTML en un arbre d'objets : le **DOM**. L'objet `document` est la racine de cet arbre.

## La notion

### Les méthodes de sélection

```javascript
// Par id : un seul élément (ou null)
const titre = document.getElementById("titre");

// Par sélecteur CSS : le PREMIER élément qui correspond (ou null)
const premierLivre = document.querySelector(".livre");
const lienActif = document.querySelector("nav a.actif");

// Par sélecteur CSS : TOUS les éléments (une NodeList)
const livres = document.querySelectorAll(".livre");
console.log(livres.length); // nombre d'éléments trouvés
console.log(livres[0]);     // le premier, comme dans un tableau
```

### Lire le texte d'un élément

```javascript
console.log(titre.textContent);
```

### Parcourir une NodeList

```javascript
livres.forEach(livre => {
  console.log(livre.textContent);
});
```

> **Astuce :** ouvre l'onglet **HTML** du bac à sable pour voir les id et les classes de la page. Les sélecteurs de `querySelector` sont les mêmes qu'en CSS : `#id`, `.classe`, `balise`, `parent enfant`.

### Challenge 1 : Le titre de la page

Affiche dans la console le texte du titre de la page (l'élément qui a l'id `titre`).

<!-- check
if (!logged("Bibliothèque du quartier")) return "La console doit afficher le texte du titre : sélectionne #titre puis utilise textContent.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : `document.getElementById("titre")` retourne l'élément.
2.  **Lecture** : la propriété `textContent` contient son texte.
3.  **Affichage** : `console.log()`.

**Code :**
```javascript
const titre = document.getElementById("titre");
console.log(titre.textContent);
```
</solution>

### Challenge 2 : Compter les livres

Affiche dans la console le **nombre** de livres de la liste (les éléments qui ont la classe `livre`).

<!-- hint
`querySelectorAll` retourne tous les éléments qui correspondent au sélecteur.
-->

<!-- hint
Une NodeList a une propriété `length`, comme un tableau.
-->

<!-- check
if (!logs().some(line => /(^|[\s:=])4$/.test(line.trim()))) return "La console doit afficher le nombre 4 : utilise querySelectorAll puis length.";
return true;
-->

### Challenge 3 : Le troisième livre

Affiche dans la console le texte du **troisième** livre de la liste.

<!-- hint
Récupère tous les livres, puis prends le bon index.
-->

<!-- hint
Le premier élément est à l'index `0`, donc le troisième est à l'index `2`.
-->

<!-- check
if (!logged("L'Étranger")) return "La console doit afficher « L'Étranger ». Attention : le premier élément est à l'index 0.";
return true;
-->

### Challenge 4 : Le lien actif

Dans le menu, un seul lien a la classe `actif`. Affiche son texte dans la console.

<!-- hint
Un sélecteur peut combiner une balise et une classe : `a.actif`.
-->

<!-- hint
`querySelector` suffit : il n'y a qu'un seul lien actif.
-->

<!-- check
if (!logs().some(line => line.trim() === "Contact" || line.includes("Contact"))) return "La console doit afficher le texte du lien qui a la classe actif.";
return true;
-->

### Challenge 5 : Tous les livres

Affiche dans la console le texte de **chaque** livre, un par ligne, avec une boucle.

<!-- hint
Commence par sélectionner tous les livres avec `querySelectorAll`.
-->

<!-- hint
Utilise `forEach` sur la NodeList, avec un `console.log` du `textContent` à chaque tour.
-->

<!-- check
const titres = ["Le Petit Prince", "Astérix le Gaulois", "L'Étranger", "Une brève histoire du temps"];
const manque = titres.find(t => !logs().some(line => line.trim() === t));
if (manque) return `Il manque « ${manque} » dans la console (un console.log par livre).`;
if (!/forEach|for\s*\(|while\s*\(/.test(code())) return "Utilise une boucle (forEach, for…) au lieu de répéter le code.";
return true;
-->

### Challenge 6 : Bonus · Les genres

Pour chaque livre, affiche dans la console son titre et son genre (l'attribut `data-genre`), sous la forme `Le Petit Prince : roman`.

<!-- hint
L'attribut `data-genre` se lit avec `element.dataset.genre`.
-->

<!-- hint
Dans ta boucle, construis le texte avec un template literal : `${titre} : ${genre}`.
-->

<!-- check
const attendus = ["Le Petit Prince : roman", "Astérix le Gaulois : bd", "L'Étranger : roman", "Une brève histoire du temps : science"];
const manque = attendus.find(t => !logs().some(line => line.trim() === t));
if (manque) return `Il manque « ${manque} » dans la console.`;
if (!/forEach|for\s*\(|while\s*\(/.test(code())) return "Utilise une boucle (forEach, for…) au lieu de répéter le code.";
return true;
-->
