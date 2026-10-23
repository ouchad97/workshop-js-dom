# Workshop JavaScript DOM

Bienvenue dans le workshop JavaScript DOM !
Ce parcours t'apprend à manipuler une page web avec JavaScript : du premier `querySelector` jusqu'à l'affichage de données chargées avec `fetch`. Chaque étape propose une page de travail et des challenges que tu codes et vérifies directement dans le navigateur.

## Lancer la plateforme

Installe [Node.js](https://nodejs.org/), puis ouvre un terminal dans le dossier du projet :

```bash
npx serve .
```

Ouvre ensuite l'adresse indiquée dans le terminal (par exemple `http://localhost:3000`).

> La plateforme ne fonctionne pas en ouvrant `index.html` directement (`file://`) : le navigateur bloque le chargement des fiches.

## Comment ça marche ?

1. Lis la notion, puis l'onglet **HTML** du bac à sable pour connaître la page de travail.
2. Clique sur **Coder ici** sous un challenge et écris ton JavaScript dans l'éditeur.
3. **Exécuter** (ou `Ctrl + Entrée`) lance ton code sur une page neuve. La console affiche tes `console.log` et tes erreurs avec leur numéro de ligne.
4. **Vérifier** teste ton code automatiquement.

Ton code et ta progression sont enregistrés dans ton navigateur.

## Objectifs du Workshop

| Étape | Objectifs | Fiche |
|-------|-----------|-------|
| **01** | Sélectionner : `getElementById`, `querySelector`, `querySelectorAll` | [Sélectionner](./01-Selection/01-Selection.md) |
| **02** | Modifier le style et les classes : `style`, `classList` | [Styles & classes](./02-Styles/02-Styles-et-Classes.md) |
| **03** | Contenu et attributs : `textContent`, `innerHTML`, `setAttribute`, `dataset` | [Contenu & attributs](./03-Contenu/03-Contenu-et-Attributs.md) |
| **04** | Créer, ajouter, cloner et supprimer des éléments | [Créer & supprimer](./04-Creer/04-Creer-et-Supprimer.md) |
| **05** | Événements : `addEventListener`, `click`, l'objet `event` | [Événements](./05-Evenements/05-Evenements.md) |
| **06** | Formulaires : `value`, `submit`, `preventDefault`, validation | [Formulaires](./06-Formulaires/06-Formulaires.md) |
| **07** | Parcourir l'arbre et délégation d'événements | [Arbre & délégation](./07-Delegation/07-Arbre-et-Delegation.md) |
| **08** | Données → DOM : afficher, filtrer, rechercher, trier | [Données → DOM](./08-Donnees/08-Donnees-et-DOM.md) |
| **09** | Sauvegarder avec `localStorage` et `JSON` | [localStorage](./09-Stockage/09-localStorage.md) |
| **10** | Charger des données avec `fetch`, `async` / `await` | [fetch & JSON](./10-Fetch/10-Fetch-et-JSON.md) |
| **P1** | Mini-projet : todo list persistante | [Todo](./11-Projets/mini-projet-todo.md) |
| **P2** | Mini-projet : dashboard de stock | [Dashboard](./11-Projets/mini-projet-dashboard.md) |

Le [glossaire DOM](./glossaire.md) regroupe les méthodes et notions du workshop.

## Ajouter un challenge

Chaque fiche est un fichier Markdown. Un challenge commence par `### Challenge N : Titre` (ou `### Étape N : Titre`) et peut contenir :

- `<!-- starter ... -->` : le code de départ de l'éditeur ;
- `<!-- check ... -->` : le test automatique. Il renvoie `true` si c'est réussi, sinon un message d'aide. Outils disponibles : `$`, `$$`, `text`, `css`, `logs`, `logged`, `errors`, `click`, `type`, `choose`, `submit`, `wait`, `rerun`, `doc`, `win` ;
- `<solution> ... </solution>` : la solution guidée.

La page de travail de chaque étape est dans `scenes/`, et la liste des étapes en haut de `app.js`.

## Ressources recommandées

- **Documentation :** [MDN - Introduction au DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model/Introduction)
- **Cours :** [javascript.info - Document](https://javascript.info/document)
- **Documentation :** [MDN - Utiliser fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch)
- **Outil :** [Chrome DevTools - DOM](https://developer.chrome.com/docs/devtools/dom)

---

**Best of luck!** 🚀
