# Redux

In this step, you will add [Redux](http://redux.js.org/index.html) to your magnificent application

[Redux](http://redux.js.org/index.html) a predictable state container for JavaScript apps. [Redux](http://redux.js.org/index.html) can be use in any Javascript environment and doesn't depends on `React` at all. [Redux](http://redux.js.org/index.html) has some really insteresting properties in terms of consistency, predicatbility, and developer experience.

[Redux](http://redux.js.org/index.html) can be seen as an implementation of the [Flux pattern](https://facebook.github.io/flux/docs/overview.html) with some variations, especially in terms of the setup complexity, which is much less complicated thatn Flux. Redux is also inspired by the Elm language webapp architecture.

Redux provides a concept of `store`, that will unique be for the current application (singleton), to which our components will subscribe. It is then possible for the dispatch `actions` to the `store` that will trigger a mutation of the state wrapped in `store`. Once the mutation is complete, the `store` will notify all subscribers that the state has changed. The nice thing with such pattern becomes evident when application grows and that several `react` components require the same data source. It is then easier to manage the **business** application state outside components and just subscribe to it.

To operate Redux uses a concept of `reducer` which works exactly the same way than a reduction function on a collection or a stream. If you visualize the application state as a collections of user events that can mutate the current state, then the `reducer` is simply the function that takes as parameters the previous state of the app. and the current user event, and returns the next. A `reducer` therefore is a pure function with the following signature` (state, action) => state` that describes how an action transforms the current state into a new state.

<img src='https://github.com/react-bootcamp/react-103/raw/master/instructions/img/redux.jpg' width='800' alt='Reducers'>

let's take a simple example :

```javascript
import { createStore } from 'redux'

/**
 * Here we have a unique reducer to handle a state of type `number`
 * You can notice that the initial test is supplied using ES6 default parameter values
 * We will use a switch case structure to deal with multiple action types
 * but it's not mandatory, you can use whatever you want.
 * WARNING: it is mandatory to return a new instance of the state when you mutate it,
 * do not mutate the previous state.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

/**
 * here, we create a store for our application
 * using the `counter` reducer
 * the API of the store is the following { subscribe, dispatch, getState }.
 */
let store = createStore(counter)

/**
 * Now we can subscribe to the store and listen to state mutations.
 * A typical use case could be a React component that
 * displays the counter state.
 * You can notice that the new value of the state
 * is not passed in the notification event, you have to fetch
 * the new state from the store.
 */
store.subscribe(() =>
  console.log(store.getState())
)

// now the only way to mutate the internal state of the store
// is to dispatch an action
store.dispatch({ type: 'INCREMENT' })
// will display 1 in the console
store.dispatch({ type: 'INCREMENT' })
// will display 2 in the console
store.dispatch({ type: 'DECREMENT' })
// will display 3 in the console
```

It is possible to split the reducer in multiple reducers so one reducer will only handle a part of the global state.
If you want to know more about Redux, you can read the [library documentation](http://redux.js.org/index.html) which is really great

## Try it out

Commencez par installer `redux` et `react-redux`. Dans le fichier `package.json` ajoutez les dépendances suivantes :

```json
"dependencies": {
    ...
    "react-redux": "4.4.1",
    "redux": "3.3.1",
    ...
}
```

ou via la ligne de commande

```
npm install --save redux@3.3.1 react-redux@4.4.1
```

Dans le cadre de notre application, nous allons afficher des informations statistiques globales concernant notre application. A savoir le nombre global de likes et le nombre global de commentaires. Ces données seront mises a jour en temps réel.

![View 1](https://raw.githubusercontent.com/mathieuancelin/react-workshop/master/step-5/view1.png)

L'état de notre application contenu dans un store `redux` sera le suivant

```json
{
  "comments": 42,
  "likes": 42
}
```

Nous allons donc avoir besoin de deux reducers, chacun gérant respectivement le compteur de commentaires et le compteur de likes.

Nous allons également avoir besoin d'actions permettant de muter notre état applicatif.

Globalement, pour chacun des compteurs nous avons besoin d'une action initiale qui sera lancée après un appel HTTP et qui changera l'état pour lui donner une valeur initiale prevenant du serveur. Ensuite nous aurons besoin d'une action permettant d'incrémenter le compteur et d'une action permettant de décrémenter le compteur.

Vous pouvez maintenant implémenter toutes vos actions dans un fichier `src/actions/index.js` tel que suivant (ici, pour un exemple de compteur classique)

```javascript
export const incrementCounter = () => {
  return {
    type: 'INCREMENT_COUNTER',
    incrementValue: 2
  };
}

export const decrementCounter = () => {
  return {
    type: 'DECREMENT_COUNTER',
    decrementValue: 1
  };
}
```

puis vous pouvez créer vos reducers dans des fichiers respectivement nommés `src/reducers/comments.js` et `src/reducers/likes.js`. Chaque `reducer` gèrera un compteur avec une valeur initiale à 0.

Il s'agit maintenant de créer un `reducer` global, pour cela commencez par créer un fichier `src/reducers/index.js` avec le contenu suivant :

```javascript
import { combineReducers } from 'redux';
import comments from './comments';
import likes from './likes';

const reducer = combineReducers({
  comments: comments,
  likes: likes
});

export default reducer;
```

ici la fonction `combineReducers` permet de créer un reducer global à partir de différent reducers responsables de différentes parties de l'état global, dans notre cas `comments` et `likes`. N'oubliez pas de créer vos fichiers `src/reducers/likes` et `src/reducers/comments` contenant respectivement des `reducers` publiques (exportés) nommés `likes` et `comments`.

Il ne nous reste plus qu'à créer le store de notre application, par exemple dans le fichier `src/app.js`.

```javascript
import { createStore } from 'redux';
import app from './reducers';

const store = createStore(app);
```

il ne reste plus qu'a faire deux appels HTTP aux apis

* `/api/likes`
* `/api/comments`

afin d'initialiser le store avec les bonnes valeurs.


```javascript
import { createStore } from 'redux';
import app from './reducers';
import { setCounterValue } from './actions';

const store = createStore(app);

fetch(`/api/count`)
  .then(r => r.json())
  .then(r => store.dispatch(setCounterValue(r.count)));
```

Nous avons maintenant un état global correctement alimenté. Cependant lors qu'il est nécessaire de faire beaucoup d'asynchrone avec `redux`, il devient utile d'utiliser [`redux-thunk`](https://github.com/gaearon/redux-thunk) permettant de faire de l'inversion de contrôle au niveau des actions dispatchées au `store` et donc de dispatcher plusieurs fois ou de manière conditionnelle pour une meme action.

Maintenant, il ne nous reste qu'à le connecter à l'UI
