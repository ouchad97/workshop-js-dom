# Données → DOM

Dans une vraie application, le HTML n'est pas écrit à la main : il est **généré** à partir de données (un tableau d'objets). C'est ici que tes connaissances sur les tableaux, les objets et les fonctions rencontrent le DOM.

## La notion

### Les données

La page contient déjà un tableau `produits` (onglet **HTML**, en bas). Chaque produit ressemble à :

```javascript
{ id: 1, nom: "Clavier mécanique", categorie: "informatique", prix: 450, stock: 12 }
```

### Une fonction d'affichage

L'idée clé : **une seule** fonction `afficher(liste)` qui vide la grille puis crée une carte par produit. Filtrer, chercher ou trier revient ensuite à appeler `afficher` avec une autre liste.

```javascript
const grille = document.querySelector("#grille");

function afficher(liste) {
  grille.innerHTML = "";              // 1. vider
  liste.forEach(produit => {          // 2. une carte par produit
    const carte = document.createElement("div");
    carte.classList.add("carte");
    const titre = document.createElement("h3");
    titre.textContent = produit.nom;
    carte.append(titre);
    grille.append(carte);
  });
}

afficher(produits);
```

### Les méthodes de tableau utiles

```javascript
produits.filter(p => p.stock > 0);                 // nouveau tableau : ceux qui passent le test
produits.map(p => p.nom);                          // nouveau tableau : transformé
[...produits].sort((a, b) => a.prix - b.prix);     // copie triée par prix croissant
produits.reduce((total, p) => total + p.prix, 0);  // une seule valeur : la somme
```

> **Astuce :** `sort` modifie le tableau d'origine. `[...produits]` crée une copie avant de trier.

### Challenge 1 : Afficher le catalogue

Affiche tous les produits dans `#grille`. Chaque produit est une `div` avec la classe `carte` qui contient un `h3` (le nom) et un `p` avec la classe `prix` (par exemple `450 DH`).

<!-- check
const cartes = $$("#grille .carte");
if (cartes.length !== 8) return `#grille doit contenir 8 cartes (elle en a ${cartes.length}).`;
if (text(cartes[0].querySelector("h3")) !== "Clavier mécanique") return "Le h3 de la première carte doit être « Clavier mécanique ».";
const prix = cartes[0].querySelector(".prix");
if (!prix || !text(prix).includes("450")) return "Chaque carte doit avoir un élément .prix qui affiche le prix (450 DH pour la première).";
return true;
-->

<solution>
### Étapes de résolution

1.  **Fonction** `afficher(liste)` qui vide `#grille`.
2.  **Boucle** sur la liste : créer la `div.carte`, le `h3` et le `p.prix`.
3.  **Appel** : `afficher(produits)`.

**Code :**
```javascript
const grille = document.querySelector("#grille");

function afficher(liste) {
  grille.innerHTML = "";
  liste.forEach(produit => {
    const carte = document.createElement("div");
    carte.classList.add("carte");

    const titre = document.createElement("h3");
    titre.textContent = produit.nom;

    const prix = document.createElement("p");
    prix.classList.add("prix");
    prix.textContent = `${produit.prix} DH`;

    carte.append(titre, prix);
    grille.append(carte);
  });
}

afficher(produits);
```
</solution>

### Challenge 2 : Les ruptures de stock

Reprends le challenge 1. Les cartes des produits dont le `stock` vaut `0` reçoivent en plus la classe `rupture`.

<!-- check
const cartes = $$("#grille .carte");
if (cartes.length !== 8) return "#grille doit contenir les 8 cartes du challenge 1.";
const enRupture = cartes.filter(c => c.classList.contains("rupture")).map(c => text(c.querySelector("h3")));
if (enRupture.sort().join(",") !== "Micro USB,Souris sans fil") return "Seules « Souris sans fil » et « Micro USB » (stock 0) doivent avoir la classe rupture.";
return true;
-->

### Challenge 3 : Filtrer par catégorie

Quand on choisit une catégorie dans `#categorie`, seules les cartes de cette catégorie sont affichées. L'option `tous` réaffiche tout.

<!-- check
await choose("#categorie", "audio");
const noms = $$("#grille .carte h3").map(h => text(h)).sort();
if (noms.join(",") !== "Casque audio,Enceinte Bluetooth,Micro USB") return `Avec « audio », il faut 3 cartes : Casque audio, Enceinte Bluetooth, Micro USB (il y en a ${noms.length}).`;
await choose("#categorie", "tous");
if ($$("#grille .carte").length !== 8) return "Avec « tous », les 8 produits doivent revenir.";
return true;
-->

### Challenge 4 : Rechercher

Pendant la saisie dans `#recherche`, n'affiche que les produits dont le nom **contient** le texte tapé, sans tenir compte des majuscules.

<!-- check
await type("#recherche", "SOURIS");
let noms = $$("#grille .carte h3").map(h => text(h));
if (noms.join(",") !== "Souris sans fil") return `En tapant « SOURIS », seule « Souris sans fil » doit rester (il reste ${noms.length} carte(s)).`;
await type("#recherche", "ca");
noms = $$("#grille .carte h3").map(h => text(h)).sort();
if (noms.join(",") !== "Casque audio,Clavier mécanique") return "En tapant « ca », il doit rester Casque audio et Clavier mécanique.";
await type("#recherche", "");
if ($$("#grille .carte").length !== 8) return "Quand la recherche est vide, les 8 produits doivent revenir.";
return true;
-->

### Challenge 5 : Trier par prix

Le bouton `#trier` affiche les produits du **moins cher au plus cher**.

<!-- check
await click("#trier");
const prix = $$("#grille .carte .prix").map(p => parseInt(text(p)));
if (prix.length !== 8) return "Après le tri, les 8 produits doivent être affichés.";
if (prix.some((p, i) => i > 0 && p < prix[i - 1])) return `Les prix ne sont pas dans l'ordre croissant : ${prix.join(", ")}.`;
return true;
-->

### Challenge 6 : Les statistiques

`#stats` affiche le nombre de produits affichés et leur prix moyen arrondi, par exemple `8 produits · prix moyen : 536 DH`. Les statistiques se mettent à jour avec le filtre par catégorie (challenge 3).

<!-- check
const chiffres = () => (text("#stats").match(/\d+/g) || []);
if (!chiffres().includes("8") || !chiffres().includes("536")) return `Au chargement, #stats doit afficher 8 produits et un prix moyen de 536 DH (il affiche « ${text("#stats")} »).`;
await choose("#categorie", "audio");
if (!chiffres().includes("3") || !chiffres().includes("310")) return `Avec la catégorie audio, #stats doit afficher 3 produits et 310 DH (il affiche « ${text("#stats")} »).`;
return true;
-->

