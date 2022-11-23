importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBWRjEizc3808R8nBBxUahG3Q2W4VspqwY",
  authDomain: "zaalvoetbalbazen.firebaseapp.com",
  projectId: "zaalvoetbalbazen",
  storageBucket: "zaalvoetbalbazen.appspot.com",
  messagingSenderId: "46423819566",
  appId: "1:46423819566:web:4e362613ad9457b954a6bf",
});

const messaging = firebase.messaging();