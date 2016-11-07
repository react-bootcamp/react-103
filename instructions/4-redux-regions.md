# Use redux to manage wine regions

first you need to define redux actions to interact with regions.

The first action we need is an actions to `set` the value of the `regions` array.

```javascript
export const setRegions = (regions) => {
  return {
    type: 'SET_REGIONS',
    regions
  };
}
```

and then, we will need another action that will be responsible to fetch `regions` from the REST API and set the `regions` array in the redux store. The action will use redux thunk to dispatch multiples actions like emptying the current value of `regions`, setting that an HTTP request is currently loading some data, etc ...

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
