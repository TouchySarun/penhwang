const admin = require('firebase-admin');

var firebaseConfig = {
  apiKey: "**********",
  authDomain: "**********",
  databaseURL: "**********",
  projectId: "**********",
  storageBucket: "**********",
  messagingSenderId: "**********",
  appId: "**********",
  measurementId: "**********"
};

admin.initializeApp(firebaseConfig);

const firestore = admin.firestore();



module.exports = firestore;
