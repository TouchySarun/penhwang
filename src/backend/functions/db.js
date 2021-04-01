const admin = require('firebase-admin');

var firebaseConfig = {
  apiKey: "AIzaSyDXHSdq1JoWVzG24fBlr82gECDERMQjmy8",
  authDomain: "penhwang-d350c.firebaseapp.com",
  databaseURL: "https://penhwang-d350c.firebaseio.com",
  projectId: "penhwang-d350c",
  storageBucket: "penhwang-d350c.appspot.com",
  messagingSenderId: "460959132300",
  appId: "1:460959132300:web:05dc2319b735c21cf329a9",
  measurementId: "G-XRMW2G5Q00"
};

admin.initializeApp(firebaseConfig);

const firestore = admin.firestore();



module.exports = firestore;