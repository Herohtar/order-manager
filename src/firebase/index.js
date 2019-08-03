import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

const prodConfig = {
  apiKey: "AIzaSyCxUoHGPg83Kir_wzzCe4XPFuPYk7U71Hk",
  authDomain: "orders.herohtar.com",
  databaseURL: "https://grammys-gluten-free-goodies.firebaseio.com",
  projectId: "grammys-gluten-free-goodies",
  storageBucket: "grammys-gluten-free-goodies.appspot.com",
  messagingSenderId: "509212001531",
  appId: "1:509212001531:web:3c1ee198caa56030"
}

const devConfig = {
  apiKey: "AIzaSyCxUoHGPg83Kir_wzzCe4XPFuPYk7U71Hk",
  authDomain: "orders.herohtar.com",
  databaseURL: "https://grammys-gluten-free-goodies.firebaseio.com",
  projectId: "grammys-gluten-free-goodies",
  storageBucket: "grammys-gluten-free-goodies.appspot.com",
  messagingSenderId: "509212001531",
  appId: "1:509212001531:web:3c1ee198caa56030"
}

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const firestore = firebase.firestore()
const auth = firebase.auth()

export {
  firebase,
  firestore,
  auth,
}
