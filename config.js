import * as firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyDs4KlrrxESuOYR3EUw1aYB_eHsG0iz5BE",
    authDomain: "wili-library.firebaseapp.com",
    projectId: "wili-library",
    storageBucket: "wili-library.appspot.com",
    messagingSenderId: "663633400453",
    appId: "1:663633400453:web:02cd2626b3a48a161c0fec"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();
