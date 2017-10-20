import 'es6-shim'; // yeah, polyfill all the things !!!
import 'whatwg-fetch'; // yeah, polyfill all the things !!!
import Symbol from 'es-symbol';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { WineApp, RegionsPage, WineListPage, WinePage, NotFound } from './components';
import './index.css';

if (!window.Symbol) {
  window.Symbol = Symbol; // yeah, polyfill all the things !!!
}

class RoutedApp extends Component {
  render() {
    const root =
      window.location.hostname === 'react-bootcamp.github.io' ? '/react-wines-102/' : '/';
    return (
      <Router history={browserHistory}>
        <Route path={root} component={WineApp}>
          <IndexRoute component={RegionsPage} />
          <Route path="regions/:regionId" component={WineListPage} />
          <Route path="regions/:regionId/wines/:wineId" component={WinePage} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<RoutedApp />, document.getElementById('root'));
