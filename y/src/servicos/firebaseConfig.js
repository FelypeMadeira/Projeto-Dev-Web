import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Importe TODAS as funções do Realtime Database que você usará
// e que precisam ser re-exportadas para outros módulos.
import { getDatabase, ref, set, get, update, remove, push, onValue } from "firebase/database";

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
const auth = getAuth(app); // Inicializa o Auth
const database = getDatabase(app); // Inicializa o Realtime Database

// Agora, exportamos a instância do database, a instância do auth,
// E TODAS as funções do Realtime Database que você usa no Reserva.jsx
// ou em qualquer outro lugar do seu aplicativo.
export {
  database, // Exporta a instância do Realtime Database
  auth,     // Exporta a instância do Auth
  ref,      // Exporta a função ref para criar referências
  set,      // Exporta a função set para gravar dados
  get,      // Exporta a função get para ler dados uma vez
  update,   // Exporta a função update para atualizar dados
  remove,   // Exporta a função remove para remover dados
  push,     // Exporta a função push para adicionar dados com uma nova chave
  onValue,  // Exporta a função onValue para ouvir mudanças em tempo real
};
