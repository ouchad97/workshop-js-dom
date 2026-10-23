# Créer et supprimer des éléments

Jusqu'ici, on modifiait des éléments qui existaient déjà. Maintenant, on va en **fabriquer** de nouveaux, les placer dans la page, les copier et les retirer.

## La notion

### Créer puis placer

Créer un élément ne l'affiche pas : il faut ensuite l'**ajouter** dans un parent.

```javascript
const liste = document.querySelector("#liste");

const li = document.createElement("li"); // 1. créer
li.textContent = "Fromage";              // 2. remplir
li.classList.add("article");
liste.append(li);                        // 3. placer à la fin
```

### Où placer ?

```javascript
parent.append(element);   // à la fin du parent
parent.prepend(element);  // au début du parent
element.before(autre);    // juste avant element
element.after(autre);     // juste après element
```

### Supprimer et cloner

```javascript
element.remove();                     // retire l'élément de la page
const copie = element.cloneNode(true); // copie avec tout son contenu (true)
```

### Challenge 1 : Ajouter un article

Ajoute « Fromage » à la **fin** de la liste de courses. Le nouveau `li` doit avoir la classe `article`, comme les autres.

<!-- check
const items = $$("#liste li");
if (items.length !== 4) return `La liste doit contenir 4 articles (elle en a ${items.length}).`;
const dernier = items[3];
if (text(dernier) !== "Fromage") return "Le dernier article doit être « Fromage ».";
if (!dernier.classList.contains("article")) return "Le nouveau li doit avoir la classe article.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Créer** : `document.createElement("li")`.
2.  **Remplir** : `textContent` et `classList.add("article")`.
3.  **Placer** : `append` sur la liste `#liste`.

**Code :**
```javascript
const liste = document.querySelector("#liste");

const li = document.createElement("li");
li.textContent = "Fromage";
li.classList.add("article");

liste.append(li);
```
</solution>

### Challenge 2 : Au début de la liste

Ajoute « Café » au **début** de la liste, avec la classe `article`.

<!-- check
const items = $$("#liste li");
if (text(items[0]) !== "Café") return "Le premier article doit être « Café » : utilise prepend.";
if (items.length !== 4) return "La liste doit contenir 4 articles.";
if (!items[0].classList.contains("article")) return "Le nouveau li doit avoir la classe article.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Créer et remplir** le `li` comme au challenge 1.
2.  **Placer au début** : `prepend` au lieu de `append`.

**Code :**
```javascript
const liste = document.querySelector("#liste");

const li = document.createElement("li");
li.textContent = "Café";
li.classList.add("article");

liste.prepend(li);
```
</solution>

### Challenge 3 : Ajouter depuis un tableau

Ajoute à la fin de la liste tous les articles du tableau `aAjouter`, avec une boucle.

<!-- starter
const aAjouter = ["Riz", "Tomates", "Huile"];

// Ton code ici
-->

<!-- check
const textes = $$("#liste li").map(li => text(li));
if (textes.length !== 6) return `La liste doit contenir 6 articles (elle en a ${textes.length}).`;
if (textes.slice(3).join(",") !== "Riz,Tomates,Huile") return "Les 3 derniers articles doivent être Riz, Tomates, Huile, dans cet ordre.";
if ($$("#liste li").some(li => !li.classList.contains("article"))) return "Chaque nouveau li doit avoir la classe article.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Boucle** : `forEach` sur le tableau `aAjouter`.
2.  **Dans la boucle** : créer, remplir et ajouter un `li` pour chaque texte.

**Code :**
```javascript
const aAjouter = ["Riz", "Tomates", "Huile"];
const liste = document.querySelector("#liste");

aAjouter.forEach(texte => {
  const li = document.createElement("li");
  li.textContent = texte;
  li.classList.add("article");
  liste.append(li);
});
```
</solution>

### Challenge 4 : Supprimer le lait

Retire « Lait » de la liste.

<!-- check
const textes = $$("#liste li").map(li => text(li));
if (textes.includes("Lait")) return "« Lait » est toujours dans la liste : sélectionne-le puis utilise remove().";
if (textes.join(",") !== "Pain,Œufs") return "Seul « Lait » doit être retiré.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Sélection** : « Lait » est le deuxième `li` (index `1`), ou `li:nth-child(2)`.
2.  **Suppression** : `remove()`.

**Code :**
```javascript
const articles = document.querySelectorAll("#liste li");
articles[1].remove();

// Plus robuste : chercher par texte
// articles.forEach(li => {
//   if (li.textContent === "Lait") li.remove();
// });
```
</solution>

### Challenge 5 : Cloner une carte

Duplique la carte produit « Pomme ». Dans la copie, le nom devient « Banane » et le prix « 1 DH ». La copie doit apparaître après la carte d'origine.

<!-- check
const cartes = $$(".carte-produit");
if (cartes.length !== 2) return `Il doit y avoir 2 cartes produit (il y en a ${cartes.length}).`;
if (text(cartes[0].querySelector("h3")) !== "Pomme") return "La première carte doit rester « Pomme ».";
if (text(cartes[1].querySelector("h3")) !== "Banane") return "La copie doit s'appeler « Banane ».";
if (text(cartes[1].querySelector(".prix")) !== "1 DH") return "Le prix de la copie doit être « 1 DH ».";
return true;
-->

<solution>
### Étapes de résolution

1.  **Cloner** : `cloneNode(true)` copie la carte avec son `h3` et son prix.
2.  **Modifier la copie** : on cherche dans la copie avec `copie.querySelector(...)`.
3.  **Placer** : `append` dans `#cartes`.

**Code :**
```javascript
const carte = document.querySelector(".carte-produit");
const copie = carte.cloneNode(true);

copie.querySelector("h3").textContent = "Banane";
copie.querySelector(".prix").textContent = "1 DH";

document.querySelector("#cartes").append(copie);
```
</solution>
