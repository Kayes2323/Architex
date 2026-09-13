import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqo0w2mlhquZpfpqXwB3K4ckN9i2TznGI",
  authDomain: "nazir-ahmed-agro-farm.firebaseapp.com",
  projectId: "nazir-ahmed-agro-farm",
  storageBucket: "nazir-ahmed-agro-farm.firebasestorage.app",
  messagingSenderId: "656483119058",
  appId: "1:656483119058:web:ec36605a45c3053c04220b",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
