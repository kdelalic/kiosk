import { createStore, combineReducers } from 'redux';

//actions

export const setUser = user => ({
    type: 'SET_USER',
    user
})

export const setBookmarkIDs = bookmarkIDs => ({
    type: 'SET_BOOKMARK_IDS',
    bookmarkIDs
})

export const addBookmarkID = bookmarkID => ({
    type: 'ADD_BOOKMARK_ID',
    bookmarkID
})

export const removeBookmarkID = bookmarkID => ({
    type: 'REMOVE_BOOKMARK_ID',
    bookmarkID
})

export const setBookmarks = bookmark => ({
    type: 'SET_BOOKMARKS',
    bookmarks
})

export const addBookmark = (key, bookmark) => ({
    type: 'ADD_BOOKMARK',
    key,
    bookmark
})

export const removeBookmark = key => ({
    type: 'REMOVE_BOOKMARK',
    key
})

export const setSources = sources => ({
    type: 'SET_SOURCES',
    sources
})

export const addSource = (key, source) => ({
    type: 'ADD_SOURCE',
    key,
    source
})

export const setBookmarksLoaded = bookmarksLoaded => ({
    type: 'SET_BOOKMARKS_LOADED',
    bookmarksLoaded
})

export const setUserLoading = userLoading => ({
    type: 'SET_USER_LOADING',
    userLoading
})

export const setCoins = coins => ({
    type: 'SET_COINS',
    coins
})

export const addCoin = (key, coin) => ({
    type: 'ADD_COIN',
    key,
    coin
})

export const toggleInvestmentProgress = () => ({
    type: 'TOGGLE_INVESTMENT_PROGRESS'
})

export const setCoinsLoaded = coinsLoaded => ({
    type: 'SET_COINS_LOADED',
    coinsLoaded
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

export const bookmarkIDs = (state = {}, action) => {
    switch (action.type) {
        case 'SET_BOOKMARK_IDS':
            return action.bookmarkIDs
        case 'ADD_BOOKMARK_ID':
            return {
                ...state,
                [action.bookmarkID]: true
            }
        case 'REMOVE_BOOKMARK_ID':
            return {
                ...state,
                [action.bookmarkID]: false
            }
        default:
            return state
    }
}

export const bookmarks = (state = {}, action) => {
    switch (action.type) {
        case 'SET_BOOKMARK':
            return action.bookmarks
        case 'ADD_BOOKMARK':
            return {
                ...state,
                [action.key]: action.bookmark
            }
        case 'REMOVE_BOOKMARK':
            return {
                ...state,
                [action.key]: null
            }
        default:
            return state
    }
}

export const sources = (state = {}, action) => {
    switch (action.type) {
        case 'SET_SOURCES':
            return action.sources
        case 'ADD_SOURCE':
        return {
            ...state,
            [action.key]: action.source
        }
        default:
            return state
    }
}

export const bookmarksLoaded = (state = {}, action) => {
    switch (action.type) {
        case 'SET_BOOKMARKS_LOADED':
            return !state
        default:
            return state
    }
}

export const userLoading = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_LOADING':
            return action.userLoading
        default:
            return state
    }
}

export const coins = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_COIN':
            return {
                ...this.state,
                [action.key]: action.coin
            }
        case 'SET_COINS':
            return action.coins
        default: 
            return state
    }
}

export const investmentProgressVisible = (state = {}, action) => {
    switch (action.type) {
        case 'TOGGLE_INVESTMENT_PROGRESS':
            return !state
        default:
            return state
    }
}

export const coinsLoaded = (state = {}, action) => {
    switch (action.type) {
        case 'SET_COINS_LOADED':
            return action.coinsLoaded
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user,
    bookmarkIDs,
    bookmarks,
    sources,
    bookmarksLoaded,
    userLoading,
    coins,
    investmentProgressVisible,
    coinsLoaded
});

export default rootReducer

export function configureStore(initialState = {user: null, bookmarkIDs: {}, bookmarks: {}, sources: {}, bookmarksLoaded: false, userLoading: false, coins: {}, investmentProgressVisible: true, coinsLoaded: false}) {
    const store = createStore(rootReducer, initialState);
    return store;
}

export const store = configureStore();