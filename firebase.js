// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6GIaU5DUkxEBSsQrfRI9AfdZUGqGx-2E",
  authDomain: "appinstitucional-17c86.firebaseapp.com",
  projectId: "appinstitucional-17c86",
  storageBucket: "appinstitucional-17c86.firebasestorage.app",
  messagingSenderId: "884506189224",
  appId: "1:884506189224:web:c5b9ab2956589560e4d19d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
