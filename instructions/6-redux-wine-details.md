# Use redux to load wine details and handle likes and comments

this step is intentionaly minimalist so you can use everything you learned about `redux` to finish the app.

## Actions and reducers

For the wine details part, you will have to define a more complex reducer a lot of actions as you need to deal with details, likes and comments

The reducer for wine details will look like

```javascript
export const currentWine = (state = { wine: null, comments: [], liked: false }, action) => {
  switch (action.type) {
    case 'SET_CURRENT_WINE':
      return Object.assign({}, state, { wine: action.wine, liked: false });
    case 'SET_CURRENT_COMMENTS':
      return Object.assign({}, state, { comments: action.comments });
    case 'SET_CURRENT_LIKED':
      return Object.assign({}, state, { liked: action.liked });
    default:
      return state;
  }
}
```

with this final reducer, our application state will look like

```javascript
{
  regions: [ ... ],
  wines: [ ... ],
  currentWine: {
    wine: { ... },
    comments: [ ... ],
    liked: false
  },
  loading: {
    state: 'LOADED',
    error: undefined
  },
  routing: { ... }
}
```

and the actions linked to this new reducer are the following :

```javascript
export const setCurrentWine = (wine) => ???
export const fetchCurrentWine = (id) => ???
export const setCurrentWineComments = (comments) => ???
export const fetchCurrentWineComments = (id) => ???
export const setCurrentWineLiked = (liked) => ???
export const fetchCurrentWineLiked = (id) => ???
export const likeWine = (id) => ???
export const unlikeWine = (id) => ???
export const commentWine = (id, content) => ???
```

## Wine details

The `<Wine />` component is quite simple as it only need to fetch the details for the current wine

```javascript
function mapFromStoreToProps(store) {
  return {
    wine: store.currentWine ? store.currentWine.wine : null,
    comments: store.currentWine ? store.currentWine.comments : [],
    liked: store.currentWine ? store.currentWine.liked : false,
    loading: store.loading === 'HTTP_LOADING',
  };
}

exports.WinePage = connect(mapFromStoreToProps)(WinePage);
```

the only trick here is that it could be useful to instanciate `<CommentModal />` inside `<Wine />` instead of `<WineApp />` to use `comments` and `liked` props.

## Likes

the `<LikeButton />` component will be responsible for calling the following actions :

```javascript
Actions.fetchCurrentWineLiked(this.props.wine.id)
Actions.unlikeWine(this.props.wine.id)
Actions.likeWine(this.props.wine.id)
```

it will also need some data from the store :

```javascript
function mapFromStoreToProps(store) {
  return {
    liked: store.currentWine ? store.currentWine.liked : false,
    loading: store.loading === 'HTTP_LOADING',
  };
}

exports.LikeButton = connect(mapFromStoreToProps)(LikeButton);
```

## CommentList

The `<CommentList />` component is quite simple as it only need to fetch the comments for the current wine

```javascript
function mapFromStoreToProps(store) {
  return {
    comments: store.currentWine ? store.currentWine.comments : [],
    loading: store.loading === 'HTTP_LOADING',
  };
}

exports.CommentList = connect(mapFromStoreToProps)(CommentList);
```

## CommentModal

the `<CommentModal />` component will be responsible for calling the following actions :

```javascript
Actions.commentWine(this.props.wine.id, comment)
```

and won't need particular data from the store.

# What's next

Now you're a `React` ninja and you can start bragging on twitter. Congratulations ;-)
