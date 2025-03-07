import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHSJQOHon0qdKxppYfpGPZa3Xy2eGGhIs",
  authDomain: "projeto-dev-web-c0083.firebaseapp.com",
  projectId: "projeto-dev-web-c0083",
  storageBucket: "projeto-dev-web-c0083.firebasestorage.app",
  messagingSenderId: "23017317075",
  appId: "1:23017317075:web:2882579f72b8502ec96a26"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);