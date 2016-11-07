# Add Redux to the Wine App

## Add some folders and files

Your src folder should look something like the following file tree.

<img src='https://github.com/react-bootcamp/react-103/raw/master/instructions/img/files.png' width='400' alt='Your src folder'>

you have to create an `actions` folder with an emtpy `index.js` file, this file will contains any actions needed by your application

then you have to create an `reducers` folder with an `index.js` file containing the following code

```javascript
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// here combineReducers is use to split the main reducer into smaller ones
export const reducer = combineReducers({
  // this one is a special reducer to sync the router with the redux store
  routing: routerReducer
});
```

## Handle HTTP loading globally

One thing we want to do is to add a common logic in the app to handle data loading. To do that, we will create a special reducer that can handle such thing. Create a `src/reducers/http.js` file with the following code

```javascript
export const loading = (state = { state: 'LOADED', error: undefined }, action) => {
  switch (action.type) {
    case 'HTTP_LOADING':
      return Object.assign({}, state, { state: 'HTTP_LOADING', error: undefined });
    case 'HTTP_LOADED':
      return Object.assign({}, state, { state: 'HTTP_LOADED', error: undefined });
    case 'HTTP_ERROR':
      return Object.assign({}, state, { state: 'HTTP_ERROR', error: action.error });
    default:
      return state;
  }
};
```

now you need to add this reducer to the global reducer used with the store. Modify the `src/reducers/index.js` file like

```javascript
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { loading } from './http';

// here combineReducers is use to split the main reducer into smaller ones
export const reducer = combineReducers({
  loading,
  // this one is a special reducer to sync the router with the redux store
  routing: routerReducer
});
```

and then you need to define some actions to mutate the `loading` part of the state. To do that, edit the `src/actions/index.js` file


```javascript
export const setHttpLoading = () => {
  return {
    type: 'HTTP_LOADING',
  };
}

export const setHttpLoaded = () => {
  return {
    type: 'HTTP_LOADED',
  };
}

export const setHttpError = (error) => {
  return {
    type: 'HTTP_ERROR',
    error
  };
}
```

and now you're ready to load some HTTP data ;-)

## The main entry point

The last thing to do here is to modify the content of the main file of your app to look like the following

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
// import redux-thunk
import thunk from 'redux-thunk';
// import react-redux
import { Provider } from 'react-redux';
// import the previously created reducer
import { reducer } from './reducers';
// import stuff from redux
import { createStore, applyMiddleware } from 'redux';
// import some stuff to sync the react-router with redux
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { WineApp, RegionsPage, WineListPage, WinePage, NotFound } from './components';

// here we create de redux store while applying the `redux-thunk` middleware
const store = createStore(reducer, applyMiddleware(thunk));
// here we create an history that will be syncrhonized with the redux store
const history = syncHistoryWithStore(browserHistory, store);

const RoutedApp = React.createClass({
  render() {
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

ReactDOM.render(<RoutedApp />, document.getElementById('root'));
```

And now your app should be working again. Don't forget to remove all the test code you made to try redux before you continue.

# What's next

Now you're ready to implement your first feature using `redux`. Go to the [next step](./4-redux-regions.md) to learn how to do that.
