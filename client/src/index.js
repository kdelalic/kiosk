import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css'
import { store } from './js/redux.js'
import {Provider} from 'react-redux'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
