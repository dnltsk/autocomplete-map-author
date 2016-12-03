import riot from 'riot';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import thunk from 'redux-thunk';

import './tags/AutocompleteMapAuthor.tag';

const reducer = function (state = {tasks: []}, action) {
    return state;
};

//const reduxStore = createStore(reducer);
const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)
)(createStore);

let reduxStore = createStoreWithMiddleware(reducer);

document.addEventListener('DOMContentLoaded', () => {
  riot.mount('AutocompleteMapAuthor', {store: reduxStore});
});
