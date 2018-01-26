import { createStore } from 'redux';

export const setUser = user => ({
    type: 'SET_USER',
    user
})

export const user = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER':
            return [
                ...state,
                {
                    user: action.user
                }
            ]
        default:
            return state
    }
}

export default user

export function configureStore(initialState = {}) {
    const store = createStore(user, initialState);
    return store;
}

export const store = configureStore();