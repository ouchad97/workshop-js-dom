# Les formulaires

Les formulaires sont la principale façon de récupérer des informations de l'utilisateur. Avec JavaScript, on lit les saisies, on les **valide** et on affiche une réponse, sans recharger la page.

## La notion

### Lire la valeur d'un champ

```javascript
const champNom = document.querySelector("#nom");
console.log(champNom.value);        // le texte saisi (toujours une chaîne)

const caseCgu = document.querySelector("#cgu");
console.log(caseCgu.checked);       // true ou false pour une checkbox
```

### Réagir pendant la saisie

```javascript
champNom.addEventListener("input", () => {
  console.log(champNom.value.length);
});
```

### L'événement `submit` et `preventDefault`

Par défaut, envoyer un formulaire **recharge la page**. On l'empêche avec `event.preventDefault()`.

```javascript
const form = document.querySelector("#inscription");

form.addEventListener("submit", event => {
  event.preventDefault();  // la page ne se recharge pas
  // ici : lire, valider, afficher
});
```

> **Astuce :** écoute `submit` sur le **formulaire**, pas `click` sur le bouton : le formulaire est aussi envoyé avec la touche Entrée.

### Valider

```javascript
const nom = champNom.value.trim();  // trim() enlève les espaces au début et à la fin
if (nom === "") {
  erreur.textContent = "Le nom est obligatoire";
  return;  // on arrête là
}
erreur.textContent = "";  // on efface l'ancienne erreur
```

### Challenge 1 : Compteur de caractères

Pendant que l'utilisateur écrit dans `#message`, `#compteur` affiche le nombre de caractères sous la forme `7 / 100`.

<!-- check
await type("#message", "Bonjour");
if (text("#compteur") !== "7 / 100") return `Après avoir tapé « Bonjour », le compteur doit afficher « 7 / 100 » (il affiche « ${text("#compteur")} »).`;
await type("#message", "");
if (text("#compteur") !== "0 / 100") return "Quand le message est vide, le compteur doit revenir à « 0 / 100 ».";
return true;
-->

<solution>
### Étapes de résolution

1.  **Écouter** l'événement `input` du textarea : il se déclenche à chaque frappe.
2.  **Compter** : `value.length`.
3.  **Afficher** dans `#compteur` avec un template literal.

**Code :**
```javascript
const message = document.querySelector("#message");
const compteur = document.querySelector("#compteur");

message.addEventListener("input", () => {
  compteur.textContent = `${message.value.length} / 100`;
});
```
</solution>

### Challenge 2 : Bienvenue

À l'envoi du formulaire, empêche le rechargement de la page et affiche `Bonjour <nom> !` dans `#resultat`.

<!-- check
await type("#nom", "Sara");
await submit("#inscription");
if (!text("#resultat").includes("Bonjour Sara")) return `Après l'envoi avec le nom « Sara », #resultat doit afficher « Bonjour Sara ! » (il affiche « ${text("#resultat")} »).`;
return true;
-->

### Challenge 3 : Nom obligatoire

Reprends le challenge 2 (bouton « Reprendre le précédent »). Si le nom est vide (ou ne contient que des espaces), affiche `Le nom est obligatoire` dans `#erreur` et **pas** de message de bienvenue. Quand le nom est correct, l'erreur disparaît.

<!-- check
await type("#nom", "   ");
await submit("#inscription");
if (!text("#erreur")) return "Avec un nom vide, #erreur doit afficher un message.";
if (text("#resultat").includes("Bonjour")) return "Avec un nom vide, il ne doit pas y avoir de message de bienvenue.";
await type("#nom", "Sara");
await submit("#inscription");
if (text("#erreur")) return "Quand le nom est correct, l'erreur doit disparaître.";
if (!text("#resultat").includes("Bonjour Sara")) return "Quand le nom est correct, #resultat doit afficher « Bonjour Sara ! ».";
return true;
-->

### Challenge 4 : Email valide

Ajoute une deuxième règle : l'email doit contenir un `@` et un `.`. Sinon, `#erreur` affiche `Email invalide` et il n'y a pas de message de bienvenue.

<!-- check
await type("#nom", "Sara");
await type("#email", "sara");
await submit("#inscription");
if (!/invalide/i.test(text("#erreur"))) return "Avec l'email « sara », #erreur doit afficher « Email invalide ».";
if (text("#resultat").includes("Bonjour")) return "Avec un email invalide, il ne doit pas y avoir de message de bienvenue.";
await type("#email", "sara@mail.com");
await submit("#inscription");
if (text("#erreur")) return "Avec un email correct, l'erreur doit disparaître.";
if (!text("#resultat").includes("Bonjour Sara")) return "Avec un nom et un email corrects, #resultat doit afficher « Bonjour Sara ! ».";
await type("#nom", "");
await submit("#inscription");
if (!text("#erreur")) return "La règle du nom obligatoire doit toujours fonctionner.";
return true;
-->

### Challenge 5 : Accepter le règlement

Le bouton `#envoyer` est **désactivé** tant que la case `#cgu` n'est pas cochée. Il s'active quand on coche, et se désactive à nouveau si on décoche.

<!-- check
if (!$("#envoyer").disabled) return "Au chargement, le bouton #envoyer doit être désactivé (propriété disabled).";
await click("#cgu");
if ($("#envoyer").disabled) return "Quand on coche #cgu, le bouton doit s'activer.";
await click("#cgu");
if (!$("#envoyer").disabled) return "Quand on décoche #cgu, le bouton doit se désactiver à nouveau.";
return true;
-->

