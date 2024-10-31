import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUx1TE66DucXlfcRHodgIsAjUiXWri-5s",
  authDomain: "swapflex-server.firebaseapp.com",
  projectId: "swapflex-server",
  storageBucket: "swapflex-server.appspot.com",
  messagingSenderId: "686221471680",
  appId: "1:686221471680:web:91c06de84a87c6e2702225",
  measurementId: "G-V85TP80YN9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;
