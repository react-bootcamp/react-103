## react-redux

Now that you know how to use redux, you have to learn how to use it with `react`. Connect a `react` component to a redux store is pretty easy.
You just have to subscribe to the store mutations once mounted into the DOM (do not forget to unsubscribe before unmounting the component from the DOM) and update the view whenever you receive a notification from the store.

Let's try to write a naïve implementation :

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
    // When the component is mounted into the DOM, we subscribe to store notifications.
    this.unsubscribe = this.props.store.subscribe(this.updateViewFromRedux);
  },
  componentWillUnmount() {
    // When the component is unmounted, we unsubscribe to avoid updating a no longer existant component instance
    this.unsubscribe();
  },
  updateViewFromRedux() {
    const { counter } = this.props.store.getState(); // we fetch the complete updated state from the store
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

However all that boilerplate can be tedious and daunting to write at length.
To avoid this unnecessary code, the `react-redux` library allows to provide a redux store to a `react` components tree and connect a `react` component to that store, and even automatically map of parts from the `store` on the component properties.

The first thing to do here is to install `react-redux`, but it should be already done if you have cloned the `react-103` repository and installed its dependencies.

```
npm install --save react-redux
```

or

```
yarn add react-redux
```

Then we need to provide the `store` to our components tree. We will use a `<Provider store = {...} />` component provided by `react-redux` at the root of the application in the` src/index.js`. `<Provider store = {...} />` is use to "inject" the store in the component to make it available to all the components owned by the components tree.


```javascript
import 'es6-shim'; // yeah, polyfill all the things !!!
import 'whatwg-fetch'; // yeah, polyfill all the things !!!
import Symbol from 'es-symbol';
if (!window.Symbol) {
  window.Symbol = Symbol; // yeah, polyfill all the things !!!
}
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { WineApp, RegionsPage, WineListPage, WinePage, NotFound } from './components';

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

const store = createStore(counter);

const RoutedApp = React.createClass({
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
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

ReactDOM.render(<RoutedApp />, document.getElementById('root'));
```
Provider will simply feed the `react` context with a `store` field. (for more details about the `react` context, go to [https://facebook.github.io/react/docs/context.html](https://facebook.github.io/react/docs/context.html))

Now you need to be able to get the store from inside a component instance to be able to

* dispatch actions
* fetch the state from the store

to do that, `redux` provide a function called `connect` that allow you to create some sort of wrapper (Higher Order Component) that will link your wrapped component to the `redux` store available in the `react` context. For example, if you want to dispatch an action from a simple component :

```javascript
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const SimpleComponent = React.createClass({
  propTypes: {
    dispatch: PropTypes.func
  },
  handleButtonClick() {
    this.props.dispatch({ type: 'INCREMENT' });
  },
  render() {
    ...
  }
});

export const ConnectedToStoreComponent = connect()(SimpleComponent);
```

here, when you call `connect` with the original component as a parameter, it will return a new component class that will handle the subscription and update logic to make your component work with redux.
When you call connect without a first parameter, the wrapped component will only have one property added called `dispatch`. This property is a function that you can use to dispatch any action to the current `redux` store.

However, when you use `connect()(YourComponent)`, it is not possible to access the current state of the store. If you want to do that, you'll have to pass a mapping function as the first parameter of `connect(mapStateToProps)(YourComponent)` with the following signature `(storeState: Any) => propertiesPassedToYourComponent: Object`

```javascript
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const SimpleComponent = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    counter: PropTypes.number
  },
  handleButtonIncrement() {
    this.props.dispatch({ type: 'INCREMENT' });
  },
  handleButtonDecrement() {
    this.props.dispatch({ type: 'DECREMENT' });
  },
  render() {
    return (
      <div>
        <span>Clicked : {this.props.counter}  </span>
        <button type="button" onClick={this.handleButtonDecrement}>-1</button>
        <button type="button" onClick={this.handleButtonIncrement}>+1</button>
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    counter: state
  };
};

export const ConnectedToStoreComponent = connect(mapStateToProps)(SimpleComponent);
```

In the end, the effective component tree when your using this kind of component will be the following :

```javascript
const store = ...
const mapStateToProps = (state) => ({ simpleCounter: state.counter });
...
<Provider store={store}>
  // ConnectorOfSimpleComponent is created when you call `connect()` on the wrapped component `SimpleComponent`
  <ConnectorOfSimpleComponent mapStateToProps={mapStateToProps}>
    <SimpleComponent
      dispatch={Provider.store.dispatch} // dispatch is fetched from the Provider context
      // props are fetch from the function mapStateToProps of ConnectorOfSimpleComponent called with the state of the store as parameter
      { ...Connector.mapStateToProps(Provider.store.getState()) } />
  </ConnectorOfSimpleComponent>
</Provider>
```

## Try it out

To try out `react-redux`, just create a new `react` component similar to `SimpleComponent` and mount it from inside the `WineApp` so it can be visible from any page.

# What's next

Now you're ready to use `redux-thunk`. Go to the [next step](./2-redux-thunk.md) to learn how to do that.
