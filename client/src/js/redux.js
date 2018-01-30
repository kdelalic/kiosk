import { createStore, combineReducers } from 'redux';

//actions

export const setUser = user => ({
    type: 'SET_USER',
    user
})

export const setBookmarks = bookmarks => ({
    type: 'SET_BOOKMARKS',
    bookmarks
})

export const addBookmark = bookmark => ({
    type: 'ADD_BOOKMARK',
    bookmark
})

export const removeBookmark = bookmark => ({
    type: 'REMOVE_BOOKMARK',
    bookmark
})

//reducers

export const user = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user
        default:
            return state
    }
}

export const bookmarks = (state = [], action) => {
    switch (action.type) {
        case 'SET_BOOKMARKS':
            return action.bookmarks
        case 'ADD_BOOKMARK':
            return [...state, action.bookmark]
        case 'REMOVE_BOOKMARK':
            return [...state.slice(0, state.indexOf(action.bookmark)),
                ...state.slice(state.indexOf(action.bookmark) + 1)
                ]
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user,
    bookmarks
});

export default rootReducer

export function configureStore(initialState = {user: null, bookmarks: []}) {
    const store = createStore(rootReducer, initialState);
    return store;
}

export const store = configureStore();