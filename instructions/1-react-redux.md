## react-redux

Connecter un composant react à notre store est finalement très simple. Il suffit simplement d'abonner le composant au store une fois monté dans le DOM, le désabonner lors de sa disparition du DOM et mettre a jour son état a chaque notification du store. Par exemple, pour un composant lambda :

```javascript
const Component = React.createClass({
  propTypes: {
    store: PropTypes.shape({
      subscribe: PropTypes.func,
      getState: PropTypes.func
    })
  },
  getInitialState() {
    return {
      counter: 0
    };
  },
  componentDidMount() {
    // lorsque l'on monte le composant dans le DOM, on souscrit aux notification du store
    // afin de savoir lorsque celui-ci est mis à jour
    this.unsubscribe = this.props.store.subscribe(this.updateViewFromRedux);
  },
  componentWillUnmount() {
    // lorsqu'on démonte le composant du DOM, on annule la souscription aux notifications
    // pour ne pas mettre à jour un composant qui n'existe plus
    this.unsubscribe();
  },
  updateViewFromRedux() {
    const { counter } = this.props.store.getState(); // on récupère l'état complet du store
    this.setState({ counter });
  },
  render() {
    return (
      <div>
        <span>counter : {this.state.counter}</span>
      </div>
    );
  }
});
```

Cependant tout ce boilerplate peut se réveler fastidieux et rébarbatif à écrire à la longue.
Pour éviter tout ce code inutile, la librairie `react-redux` permet de fournir un store a un arbre de composants `react` et de connecter un composant `react` a ce store, voire même de mapper automatiquement des propriétés de l'état du `store` sur des propriétés du composant.

La première chose à faire est de fournir le store a notre arbre de composants. Nous allons utiliser un composant `<Provider store={...} />` fourni par `react-redux` que nous allons placer à la racine de l'application dans le fichier `src/app.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import WineApp from './components/wine-app';
import { RegionsPage } from './components/regions';
import { WineListPage } from './components/wine-list';
import { WinePage } from './components/wine';
import { NotFound } from './components/not-found';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import app from './reducers';

const store = createStore(app);

...

export const App = React.createClass({
  propTypes: {
    history: PropTypes.object
  },
  render() {
    const history = this.props.history || browserHistory;
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={WineApp}>
            <IndexRoute component={RegionsPage} />
            <Route path="regions/:regionId" component={WineListPage} />
            <Route path="regions/:regionId/wines/:wineId" component={WinePage} />
            <Route path="*" component={NotFound} />
          </Route>
        </Router>
      </Provider>
    );
  }
});
```

Provider va simplement alimenter le context `react` avec un champ `store`. (pour plus de détails sur le contexte `react`, voir [https://facebook.github.io/react/docs/context.html](https://facebook.github.io/react/docs/context.html))

Il faut maintenant être capable de récupérer le store dans un composant afin de pouvoir

* dispatcher des actions
* récupérer l'état du store

Pour celà, `redux` propose une fonction `connect` permettant de créer un composant wrapper (Higher Order Component) qui fera le lien entre le store présent dans le contexte `react` et le componsant wrappé. Par exemple, si dans un composant quelconque (le composant ci-dessous est fourni à titre d'exemple) nous voulons dispatcher une action `react` :

```javascript
import { incrementCounter } from '../actions';
import { connect } from 'react-redux';

const SimpleComponent = React.createClass({
  propTypes: {
    dispatch: PropTypes.func
  },
  handleButtonClick() {
    dispatch(incrementCounter(42));
  },
  render() {
    ...
  }
});

export const ConnectedToStoreComponent = connect()(SimpleComponent);
```

ici le fait d'appeler `connect` avec le composant original en paramètre créé une nouvelle classe de composant comportant la logique d'abonnement et mise a jour du composant nécessaire à `redux`. Lorsque `connect` est appelé sans premier argument, le composant wrappé se voit ajouter une propriété `dispatch` permettant de dispatcher une action sur le store. Dans le cas de notre application, les deux composant qui auraient besoin d'accéder seulement au `dispatch` du store sont bien évidemment, les composants `WinePage` (pour gérer le like) et `Comments` (pour gérer l'ajout de commentaires).

Cependant en utilisant seulement `connect()(Composant)`, il n'est pas possible de récupérer l'état courant du store. Pour ce faire, il est nécessaire de spécifier une fonction de mapping (`connect(mapStateToProps)(Composant`) permettant d'extraire un ensemble de propriétés depuis l'état du store `redux` pour qu'elles soient ajoutées aux propriétés du composant wrappé (ici encore, le composant suivant est fourni à titre d'exemple) :

```javascript
import { incrementCounter } from '../actions';
import { connect } from 'react-redux';

const SimpleComponent = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    simpleCounter: PropTypes.number
  },
  handleButtonClick() {
    this.props.dispatch(incrementCounter(42));
  },
  render() {
    return (
      <div>
        <span>Clicked : {this.props.counter}  </span>
        <button type="button" onClick={this.handleButtonClick}>+1</button>
      </div>
    );
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    simpleCounter: state.counter
  }
};

export const ConnectedToStoreComponent = connect(mapStateToProps)(SimpleComponent);
```

Il ne nous reste donc plus qu'a émettre les différentes actions au bon moment pour muter l'état de notre `store` (ajout de commentaire, ajout de like, retrait de like) et de rajouter un composant global (`<GlobalStats>` dans `<WineApp>` par exemple) affichant le nombre global de likes et de commentaires dans l'application. C'est ce composant qui aura besoin d'une fonction type `mapStateToProps` afin de récupérer les données nécessaire depuis le `store`.

Au final, l'arbre de composants effectifs pour ce genre d'application sera le suivant :

```javascript
const store = ...
const mapStateToProps = (state) => ({ simpleCounter: state.counter });
...
<Provider store={store}>
  // Connector est créé via l'appel à connect() sur le composant wrappe (SimpleComponent)
  <Connector mapStateToProps={mapStateToProps}>
    <SimpleComponent
      dispatch={Provider.store.dispatch} // dispatch est récupéré depuis le Provider
      // simpleCounter est récupéré la fonction mapStateToProps du Connector
      // appelé sur le store récupéré depuis le Provider
      simpleCounter={Connector.mapStateToProps(Provider.store.getState()).simpleCounter} />
  </Connector>
</Provider>
```
