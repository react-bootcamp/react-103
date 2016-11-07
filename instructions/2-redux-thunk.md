## redux-thunk and async HTTP calls

Now that you know everything you have to know on `redux` and `react-redux`, we are going to spend a little amount of time to talk about `redux-thunk`.

It is quite obvious now that some actions in the app will have to trigger HTTP calls and then dispatch the result of the call as an action. We will have to be able to dispatch multiple times during the same action to be able to put all the logic inside actions. This kind of behaviour is not the default in `redux` and we will have to add a [`redux middleware`](http://redux.js.org/docs/advanced/Middleware.html) to handle this use case.

We are going to use [`redux-thunk`](https://github.com/gaearon/redux-thunk) that aims to provide Inversion Of Control (the action is responsible for dispatch instead of being dispatched) at `redux` actions level.

for example, a classic action can be define this way

```javascript
export function setTitle(title) {
  return {
    type: 'SET_TITLE',
    title
  };
}
```

if we want to use this action the async way, we have to chain dispatch ourselves externally to the action.

```javascript
this.props.dispatch(setTitle('Loading ...'));
fetch('/title.json')
  .then(r => r.json())
  .then(data => this.props.dispatch(setTitle(data.title)));
```

Here, the problem is that it can be complicated to co-localise all async action stuff at scale. With `redux-thunk`, the action can be written in the following way

```javascript
export function setTitle(title) {
  return {
    type: 'SET_TITLE',
    title
  };
}

// Yes it's an action, but with IoC as it returns a function with `dispatch` as first parameter
export function fetchTitle() {
  return (dispatch, state) => {
    // here we can access the current global state using the state function
    dispatch(setTitle(`Loading ${state().nextTarget} ...`));
    fetch('/title.json')
      .then(r => r.json())
      .then(data => dispatch(setTitle(data.title)));
  };
}

...

this.props.dispatch(fetchTitle());
```

With `redux-thunk` it's quite easy to write actions that can dispatch other action, so, it is pretty simple to co-localize any aysnc logic inside the actions.

Don't forget to install `react-redux`, but it should be already done if you have cloned the `react-103` repository and installed its dependencies.

```
npm install --save redux-thunk
```

or

```
yarn add redux-thunk
```

# What's next

Now you're ready to use actually use `redux` in the Wine App. Go to the [next step](./3-include-redux.md) to learn how to do that.
