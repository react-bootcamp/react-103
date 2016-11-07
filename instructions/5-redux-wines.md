# Use redux to manage wines from a region

this part is quite simple as it is similar to the previous one, so it's up to you ;-)

## Actions

```javascript
export const setWines = (wines) => ???
export const fetchWinesFrom = (region) => ???
```

## Reducer

```javascript
export const wines = (state = [], action) => ???
```

## Component props

```javascript
function mapFromStoreToProps(store) {
  return {
    wines: store.wines,
    loading: store.loading === 'HTTP_LOADING',
  };
}

exports.WineListPage = connect(mapFromStoreToProps)(WineListPage);
```

# What's next

Now you're ready to use `redux` to load some wine details. Go to the [next step](./6-redux-wine-details.md) to learn how to do that.
