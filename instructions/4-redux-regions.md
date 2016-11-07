# Use redux to manage wine regions

first you need to define redux actions and reducer to interact with regions.

## Actions and reducer

The first action we need is an actions to `set` the value of the `regions` array. To do that, add the following code to the `src/actions/index.js` file

```javascript
export const setRegions = (regions) => {
  return {
    type: 'SET_REGIONS',
    regions
  };
}
```

and then, we will need another action that will be responsible to fetch `regions` from the REST API and set the `regions` array in the redux store. The action will use `redux-thunk` to dispatch multiples actions like emptying the current value of `regions`, setting that an HTTP request is currently loading some data, etc ...

```javascript  
import * as WinesService from '../services/Wines';

export const fetchRegions = () => {
  return dispatch => {
    dispatch(setRegions([]));
    dispatch(setHttpLoading());
    return WinesService.fetchRegions().then(data => {
      dispatch(setHttpLoaded());
      dispatch(setRegions(data));
      return data;
    }, err => {
      dispatch(setHttpError(`error while fetching regions : ${err.message}`));
    });
  };
}
```

now you just have to create a reducer to handle `regions`. Create a new `src/reducers/regions.js` file that will look like

```javascript
export const regions = (state = [], action) => {
  switch (action.type) {
    case 'SET_REGIONS':
      return [ ...action.regions ];
    default:
      return state;
  }
}
```

and add it to the global reducer


```javascript
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { loading } from './http';
import { regions } from './regions';

export const reducer = combineReducers({
  regions,
  loading,
  routing: routerReducer
});
```

## Wire the components

now the last thing we need to do is to wire the `RegionsPage` component with the store and remove all of its internal state

to do that, you will need to connect the `RegionsPage` component to the store using the `react-redux connect()` function and map some part of the state to the component props.

```javascript
function mapFromStoreToProps(store) {
  return {
    regions: store.regions,
    loading: store.loading === 'HTTP_LOADING',
  };
}

exports.RegionsPage = connect(mapFromStoreToProps)(RegionsPage);
```

now you can rewrite the rest of the `RegionsPage` component to use the new props coming from the `redux` store. That will include replacing mention of `state` to `props` and dispatching the `fetchRegions` action in the `componentDidMount` phase of the component.

# What's next

Now you're ready to use `redux` to load some wines. Go to the [next step](./5-redux-wines.md) to learn how to do that.
