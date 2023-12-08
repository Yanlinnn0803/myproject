import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAbRfk-CztrUEfIGFtgPNRa3CRm-QiQdFk",
    authDomain: "gt-db-b8189.firebaseapp.com",
    databaseURL: "https://gt-db-b8189-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gt-db-b8189",
    storageBucket: "gt-db-b8189.appspot.com",
    messagingSenderId: "672106984955",
    appId: "1:672106984955:web:f548bfa7b1e24dfbe7475e",
    measurementId: "G-XWGQ99Y61W"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
const analytics = firebase.analytics();
const db = firebase.firestore();
const auth=firebase.auth();
export {db,analytics,auth,firebaseConfig }