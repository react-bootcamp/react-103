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

then you will need to modify the content of the main file of your app to look like the following

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
