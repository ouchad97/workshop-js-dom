# Sauvegarder avec localStorage

Quand on recharge la page, toutes les modifications du DOM disparaissent. `localStorage` permet au navigateur de **garder** des données entre deux visites.

## La notion

### Lire, écrire, supprimer

`localStorage` ne stocke que des **chaînes de caractères**, associées à une clé.

```javascript
localStorage.setItem("prenom", "Sara");     // écrire
const prenom = localStorage.getItem("prenom"); // lire → "Sara" (ou null si absente)
localStorage.removeItem("prenom");          // supprimer
```

### Les nombres

```javascript
const visites = Number(localStorage.getItem("visites")) || 0; // null → 0
localStorage.setItem("visites", visites + 1);
```

### Les tableaux et les objets : JSON

Pour stocker un tableau, on le transforme en texte JSON, et on fait l'inverse à la lecture.

```javascript
const notes = ["Acheter du pain", "Réviser"];
localStorage.setItem("notes", JSON.stringify(notes));   // tableau → texte

const sauvegarde = JSON.parse(localStorage.getItem("notes")) || []; // texte → tableau
```

> **Dans le bac à sable :** chaque clic sur **Exécuter** recharge la page. C'est exactement ce qu'il faut pour tester la persistance ! Le bouton **Vérifier** efface les clés `visites`, `mode` et `notes` avant de tester.

### Challenge 1 : Compteur de visites

À chaque chargement de la page, ajoute 1 au nombre de visites enregistré sous la clé `visites`, et affiche-le dans `#visites`. Clique plusieurs fois sur **Exécuter** pour voir le compteur monter.

<!-- check
if (text("#visites") !== "1") return `À la première visite (clé effacée), #visites doit afficher 1 (il affiche « ${text("#visites")} »).`;
await rerun();
if (text("#visites") !== "2") return "Après un rechargement, #visites doit afficher 2.";
if (localStorage.getItem("visites") !== "2") return "La clé visites doit contenir 2 dans localStorage.";
return true;
-->

<solution>
### Étapes de résolution

1.  **Lire** la valeur avec `getItem`. La première fois elle vaut `null` : `Number(null) || 0` donne `0`.
2.  **Ajouter 1** et **enregistrer** avec `setItem`.
3.  **Afficher** dans `#visites`.

**Code :**
```javascript
const visites = (Number(localStorage.getItem("visites")) || 0) + 1;
localStorage.setItem("visites", visites);
document.querySelector("#visites").textContent = visites;
```
</solution>

### Challenge 2 : Mode sombre mémorisé

Le bouton `#mode` ajoute ou retire la classe `sombre` sur le `body`. Le choix est enregistré sous la clé `mode` (`"sombre"` ou `"clair"`) et appliqué au chargement.

<!-- hint
Au chargement : si `localStorage.getItem("mode")` vaut `"sombre"`, ajoute la classe au `body`.
-->

<!-- hint
Au clic : `toggle` la classe, puis enregistre `"sombre"` ou `"clair"` selon `classList.contains("sombre")`.
-->

<!-- check
if ($("body").classList.contains("sombre")) return "Au premier chargement (clé effacée), la page doit être claire.";
await click("#mode");
if (!$("body").classList.contains("sombre")) return "Un clic sur #mode doit ajouter la classe sombre au body.";
await rerun();
if (!$("body").classList.contains("sombre")) return "Après un rechargement, le mode sombre doit être appliqué automatiquement.";
await click("#mode");
await rerun();
if ($("body").classList.contains("sombre")) return "Après être repassé en clair puis rechargé, la page doit rester claire.";
return true;
-->

### Challenge 3 : Enregistrer les notes

Quand on envoie le formulaire `#form-note`, la note saisie est ajoutée dans `#notes` (un `li`) **et** dans un tableau enregistré en JSON sous la clé `notes`. Le champ est vidé après l'ajout. Une note vide n'est pas ajoutée.

<!-- hint
Garde un tableau `notes` et ajoute chaque nouvelle note avec `push`.
-->

<!-- hint
`localStorage` ne garde que du texte : `JSON.stringify(notes)` avant `setItem`.
-->

<!-- check
await type("#note", "Acheter du pain");
await submit("#form-note");
if (text("#notes li") !== "Acheter du pain") return "Après l'envoi, la note doit apparaître dans un li de #notes.";
if ($("#note").value !== "") return "Le champ #note doit être vidé après l'ajout.";
let saved;
try { saved = JSON.parse(localStorage.getItem("notes")); } catch (e) { return "La clé notes doit contenir un tableau en JSON (JSON.stringify)."; }
if (!Array.isArray(saved) || !saved.includes("Acheter du pain")) return "La clé notes doit contenir le tableau des notes en JSON.";
await type("#note", "   ");
await submit("#form-note");
if ($$("#notes li").length !== 1) return "Une note vide ne doit pas être ajoutée.";
return true;
-->

### Challenge 4 : Retrouver les notes

Reprends le challenge 3. Au chargement, les notes enregistrées sont relues et affichées. Les nouvelles notes s'ajoutent aux anciennes.

<!-- hint
Au chargement : `JSON.parse(localStorage.getItem("notes")) || []`.
-->

<!-- hint
Affiche chaque note de ce tableau avec la même fonction que pour une nouvelle note.
-->

<!-- check
await type("#note", "Première");
await submit("#form-note");
await type("#note", "Deuxième");
await submit("#form-note");
await rerun();
let textes = $$("#notes li").map(li => text(li));
if (textes.join(",") !== "Première,Deuxième") return `Après un rechargement, #notes doit afficher Première et Deuxième (il affiche ${textes.length} note(s)).`;
await type("#note", "Troisième");
await submit("#form-note");
await rerun();
textes = $$("#notes li").map(li => text(li));
if (textes.length !== 3) return "Une note ajoutée après un rechargement doit s'ajouter aux anciennes, pas les remplacer.";
return true;
-->

### Challenge 5 : Tout effacer

Reprends le challenge 4. Le bouton `#vider` supprime toutes les notes : de la page **et** du localStorage.

<!-- hint
Il faut vider trois choses : le tableau, le localStorage et la liste affichée.
-->

<!-- hint
`localStorage.removeItem("notes")` et `liste.innerHTML = ""`.
-->

<!-- check
await type("#note", "À effacer");
await submit("#form-note");
await click("#vider");
if ($$("#notes li").length) return "Après un clic sur #vider, #notes doit être vide.";
const reste = localStorage.getItem("notes");
if (reste && reste !== "[]") return "Après un clic sur #vider, la clé notes doit être supprimée (removeItem).";
await rerun();
if ($$("#notes li").length) return "Après #vider puis un rechargement, aucune note ne doit revenir.";
await type("#note", "Nouvelle");
await submit("#form-note");
if ($$("#notes li").length !== 1) return "Après #vider, on doit pouvoir ajouter de nouvelles notes.";
return true;
-->

### Challenge 6 : Bonus · Supprimer une note

Reprends le challenge 5. Chaque note a un bouton `✕` (classe `supprimer`) qui la retire de la page **et** du localStorage.

<!-- hint
Crée le bouton ✕ dans chaque `li`, avec un écouteur qui sait quelle note supprimer.
-->

<!-- hint
Retire la note du tableau (`filter` ou `splice`), enregistre, puis réaffiche.
-->

<!-- check
await type("#note", "Un");
await submit("#form-note");
await type("#note", "Deux");
await submit("#form-note");
const bouton = $("#notes li .supprimer");
if (!bouton) return "Chaque li de #notes doit contenir un bouton avec la classe supprimer.";
await click(bouton);
const textes = () => $$("#notes li").map(li => li.firstChild.textContent.trim());
if ($$("#notes li").length !== 1) return "Après un clic sur ✕, la note doit disparaître de la page.";
await rerun();
if ($$("#notes li").length !== 1 || !text($("#notes li")).includes("Deux")) return "Après un rechargement, seule la note « Deux » doit revenir : mets à jour le localStorage.";
return true;
-->
