import Rebase from 're-base';
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCQDw7PVaZntzi_TueW0ZiyaJGoqAC0U9g",
    authDomain: "kiosk-f1a66.firebaseapp.com",
    databaseURL: "https://kiosk-f1a66.firebaseio.com",
    projectId: "kiosk-f1a66",
    storageBucket: "kiosk-f1a66.appspot.com",
    messagingSenderId: "537264723987"
};

const app = firebase.initializeApp(config);
const base = Rebase.createClass(app.database());

export { base }