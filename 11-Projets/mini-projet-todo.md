# Mini-projet : Todo list

Tu vas construire une vraie todo list, étape par étape, **dans un seul fichier** : le code est partagé entre les étapes, chaque étape ajoute une fonctionnalité. À la fin, ton application garde les tâches même après un rechargement.

## Le cahier des charges

- Ajouter une tâche avec le formulaire.
- Cocher / décocher une tâche, la supprimer.
- Afficher le nombre de tâches restantes.
- Filtrer : toutes, actives, faites.
- Sauvegarder dans `localStorage`.

## Conseil d'architecture

Garde les tâches dans un **tableau d'objets** (l'état), et écris une fonction `afficher()` qui reconstruit la liste à partir de ce tableau. Chaque action modifie le tableau, puis appelle `afficher()`. C'est la méthode de l'étape 08.

```javascript
let todos = [
  { id: "1", texte: "Réviser le DOM", fait: false }
];
```

> **Vérifier** efface la clé `todos` avant de tester. Chaque étape teste aussi que les précédentes marchent toujours.

### Étape 1 : Ajouter une tâche

À l'envoi du formulaire `#form`, ajoute dans `#liste` un `li` avec la classe `tache` qui contient un `span.texte` (le texte saisi dans `#saisie`) et un `button.supprimer` (✕). Le champ est vidé. Une saisie vide n'ajoute rien.

<!-- check
await type("#saisie", "Acheter du pain");
await submit("#form");
const lis = $$("#liste .tache");
if (lis.length !== 1) return `Après un envoi, #liste doit contenir 1 li.tache (il en a ${lis.length}).`;
if (text(lis[0].querySelector(".texte")) !== "Acheter du pain") return "Le li doit contenir un span.texte avec le texte saisi.";
if (!lis[0].querySelector(".supprimer")) return "Le li doit contenir un button.supprimer.";
if ($("#saisie").value !== "") return "Le champ #saisie doit être vidé après l'ajout.";
await type("#saisie", "   ");
await submit("#form");
if ($$("#liste .tache").length !== 1) return "Une saisie vide ne doit rien ajouter.";
return true;
-->

<solution>
### Étapes de résolution

1.  **État** : un tableau `todos`.
2.  **submit** : `preventDefault`, lire et nettoyer la saisie, ajouter un objet au tableau.
3.  **afficher()** : vider `#liste` et créer un `li` par tâche.

**Code :**
```javascript
const form = document.querySelector("#form");
const saisie = document.querySelector("#saisie");
const liste = document.querySelector("#liste");
let todos = [];

function afficher() {
  liste.innerHTML = "";
  todos.forEach(todo => {
    const li = document.createElement("li");
    li.classList.add("tache");
    li.dataset.id = todo.id;

    const texte = document.createElement("span");
    texte.classList.add("texte");
    texte.textContent = todo.texte;

    const bouton = document.createElement("button");
    bouton.classList.add("supprimer");
    bouton.textContent = "✕";

    li.append(texte, bouton);
    liste.append(li);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const texte = saisie.value.trim();
  if (texte === "") return;

  todos.push({ id: String(Date.now()) + todos.length, texte, fait: false });
  saisie.value = "";
  afficher();
});
```
</solution>

### Étape 2 : Cocher et supprimer

Avec un seul écouteur sur `#liste` : un clic sur une tâche bascule la classe `fait`, un clic sur ✕ la supprime.

<!-- check
await type("#saisie", "Tâche A");
await submit("#form");
await type("#saisie", "Tâche B");
await submit("#form");
await click($$("#liste .tache .texte")[0]);
if (!$$("#liste .tache")[0].classList.contains("fait")) return "Un clic sur une tâche doit lui ajouter la classe fait.";
if ($$("#liste .tache")[1].classList.contains("fait")) return "Seule la tâche cliquée doit être cochée.";
await click($$("#liste .tache .texte")[0]);
if ($$("#liste .tache")[0].classList.contains("fait")) return "Un deuxième clic doit décocher la tâche.";
await click($$("#liste .supprimer")[0]);
const restent = $$("#liste .texte").map(t => text(t));
if (restent.join(",") !== "Tâche B") return "Un clic sur ✕ doit supprimer sa tâche (il doit rester « Tâche B »).";
return true;
-->

### Étape 3 : Tâches restantes

`#compteur` affiche le nombre de tâches **non faites**, par exemple `2 tâche(s) restante(s)`, et se met à jour après chaque action.

<!-- check
const nombre = () => (text("#compteur").match(/\d+/) || [])[0];
await type("#saisie", "Tâche A");
await submit("#form");
await type("#saisie", "Tâche B");
await submit("#form");
if (nombre() !== "2") return `Avec 2 tâches, #compteur doit afficher 2 (il affiche « ${text("#compteur")} »).`;
await click($$("#liste .tache .texte")[0]);
if (nombre() !== "1") return "Après avoir coché une tâche, #compteur doit afficher 1.";
await click($$("#liste .supprimer")[1]);
if (nombre() !== "0") return "Après avoir supprimé la tâche restante, #compteur doit afficher 0.";
return true;
-->

### Étape 4 : Les filtres

Les boutons `[data-filtre]` n'affichent que les tâches `toutes`, `actives` (non faites) ou `faites`. Le bouton du filtre choisi a la classe `actif`. Le compteur compte toujours **toutes** les tâches non faites.

<!-- check
for (const t of ["Un", "Deux", "Trois"]) { await type("#saisie", t); await submit("#form"); }
await click($$("#liste .tache .texte")[0]);
const visibles = () => $$("#liste .tache").filter(li => li.offsetParent !== null);
await click('[data-filtre="actives"]');
if (visibles().length !== 2 || visibles().some(li => li.classList.contains("fait"))) return "Avec le filtre actives, seules les 2 tâches non faites doivent être visibles.";
if (!$('[data-filtre="actives"]').classList.contains("actif") || $('[data-filtre="toutes"]').classList.contains("actif")) return "Le bouton du filtre choisi (et lui seul) doit avoir la classe actif.";
await click('[data-filtre="faites"]');
if (visibles().length !== 1 || text(visibles()[0].querySelector(".texte")) !== "Un") return "Avec le filtre faites, seule la tâche « Un » doit être visible.";
if ((text("#compteur").match(/\d+/) || [])[0] !== "2") return "Le compteur doit toujours afficher 2, quel que soit le filtre.";
await click('[data-filtre="toutes"]');
if (visibles().length !== 3) return "Avec le filtre toutes, les 3 tâches doivent être visibles.";
return true;
-->

### Étape 5 : Sauvegarder

Les tâches sont enregistrées en JSON sous la clé `todos` après chaque action, et relues au chargement (avec leur état coché).

<!-- check
await type("#saisie", "Garder");
await submit("#form");
await type("#saisie", "Moi aussi");
await submit("#form");
await click($$("#liste .tache .texte")[0]);
let saved;
try { saved = JSON.parse(localStorage.getItem("todos")); } catch (e) { return "La clé todos doit contenir le tableau des tâches en JSON."; }
if (!Array.isArray(saved) || saved.length !== 2) return "La clé todos doit contenir un tableau de 2 tâches.";
await rerun();
const lis = $$("#liste .tache");
if (lis.length !== 2) return "Après un rechargement, les 2 tâches doivent être réaffichées.";
if (!lis[0].classList.contains("fait") || lis[1].classList.contains("fait")) return "Après un rechargement, la tâche cochée doit rester cochée.";
await click($$("#liste .supprimer")[1]);
await rerun();
if ($$("#liste .tache").length !== 1) return "Une tâche supprimée ne doit pas revenir après un rechargement.";
return true;
-->

