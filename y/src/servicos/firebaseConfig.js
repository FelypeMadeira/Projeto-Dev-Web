import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDHSJQOHon0qdKxppYfpGPZa3Xy2eGGhIs",
  authDomain: "projeto-dev-web-c0083.firebaseapp.com",
  databaseURL: "https://projeto-dev-web-c0083-default-rtdb.firebaseio.com",
  projectId: "projeto-dev-web-c0083",
  storageBucket: "projeto-dev-web-c0083.firebasestorage.app",
  messagingSenderId: "23017317075",
  appId: "1:23017317075:web:2882579f72b8502ec96a26"
};

const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
const database = getDatabase(app);
export { database, auth };