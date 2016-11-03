## appels asynchrones et `redux-thunk`

Il est évident que certaines actions vont avoir besoin de déclencher des appels HTTP et de dispatcher un résultat en conséquence. Il va donc falloir être capable de dispatcher plusieurs messages dans une même action afin que la logique métier soit localisée dans les actions.
Ce genre de fonctionnement n'est pas supporté par défaut dans `redux`. Il va falloir ajouter un [`middleware redux`](http://redux.js.org/docs/advanced/Middleware.html) afin de gérer ce cas.

Nous allons utiliser [`redux-thunk`](https://github.com/gaearon/redux-thunk) qui permet de faire de l'inversion de contrôle au niveau des actions `redux` et d'avoir connaissance sur state courant et du dispatcher dans l'action.

par exemple une action classique se défini de la façon suivante

```javascript
export function setTitle(title) {
  return {
    type: 'SET_TITLE',
    title
  };
}
```

si on souhaite utiliser cette action de manière asynchrone, nous devons enchainer les dispatchs de façon externe à l'action

```javascript
this.props.dispatch(setTitle('Loading ...'));
fetch('/title.json')
  .then(r => r.json())
  .then(data => this.props.dispatch(setTitle(data.title)));
```

Le problème ici est qu'il peut être compliqué de mettre en commun les actions asynchrones. Avec `redux-thunk`, l'action s'écrirai de la façon suivante

```javascript
export function setTitle(title) {
  return {
    type: 'SET_TITLE',
    title
  };
}

export function fetchTitle() {
  return (dispatch, state) => {
    // ici on peut accéder au state global avec la fonction state
    dispatch(setTitle(`Loading ${state().nextTarget} ...`));
    fetch('/title.json')
      .then(r => r.json())
      .then(data => dispatch(setTitle(data.title)));
  };
}

...

this.props.dispatch(fetchTitle());
```

Avec `redux-thunk` il est donc facile d'écrire des actions qui dispatcheront d'autre actions, et donc il est simple de mettre en commun toute la logique de chargement de données via HTTP dans les actions.

Il pourrait également être opportun d'afficher en haut de l'application l'activité réseau (`Loading ...`, `Erreur : ...`)

Pour installer les `redux-thunk`, ajoutez les lignes suivantes dans votre fichier `package.json` puis lancez `npm install`

```json
"dependencies": {
    ...
    "redux-thunk": "2.0.1",
    ...
}
```

ou alors via la ligne de commande

```
npm install --save redux-thunk@2.0.1
```

il vous faudra ensuite modifier la création de votre `store` redux pour prendre en compte ce `middleware`

```javascript
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import app from './reducers';

const store = createStore(app, applyMiddleware(thunk));

store.dispatch(fetchLikesCount());
store.dispatch(fetchCommentsCount());
```
