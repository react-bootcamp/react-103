# Redux

In this step, you will add [Redux](http://redux.js.org/index.html) to your magnificent application

[Redux](http://redux.js.org/index.html) a predictable state container for JavaScript apps. [Redux](http://redux.js.org/index.html) can be use in any Javascript environment and doesn't depends on `react` at all. [Redux](http://redux.js.org/index.html) has some really insteresting properties in terms of consistency, predicatbility, and developer experience.

[Redux](http://redux.js.org/index.html) can be seen as an implementation of the [Flux pattern](https://facebook.github.io/flux/docs/overview.html) with some variations, especially in terms of the setup complexity, which is much less complicated thatn Flux. Redux is also inspired by the Elm language webapp architecture.

Redux provides a concept of `store`, that will unique be for the current application (singleton), to which our components will subscribe. It is then possible for the dispatch `actions` to the `store` that will trigger a mutation of the state wrapped in `store`. Once the mutation is complete, the `store` will notify all subscribers that the state has changed. The nice thing with such pattern becomes evident when application grows and that several `react` components require the same data source. It is then easier to manage the **business** application state outside components and just subscribe to it.

To operate Redux uses a concept of `reducer` which works exactly the same way than a reduction function on a collection or a stream. If you visualize the application state as a collections of user events that can mutate the current state, then the `reducer` is simply the function that takes as parameters the previous state of the app. and the current user event, and returns the next. A `reducer` therefore is a pure function with the following signature` (state, action) => state` that describes how an action transforms the current state into a new state.

<img src='https://github.com/react-bootcamp/react-103/raw/master/instructions/img/redux.jpg' width='100%' alt='Reducers'>

let's take a simple example :

```javascript
const {createStore} = require('redux');

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
// will display 1 in the console
```

It is possible to split the reducer in multiple reducers so one reducer will only handle a part of the global state.
If you want to know more about Redux, you can read the [library documentation](http://redux.js.org/index.html) which is really great

## Try it out

First, you have to install `redux` in your project  but it should be already done if you have cloned the `react-103` repository and installed its dependencies.

```
npm install --save redux
```

or

```
yarn add redux
```

then you can create a `tryoutredux.js` file at the root of the project, add the previous example and run it using

```
node tryoutredux.js
```

# What's next

Now you're ready to use `react-redux`. Go to the [next step](./1-react-redux.md) to learn how to do that.
