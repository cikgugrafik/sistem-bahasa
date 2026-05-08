import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwKc-Dl0OUjluqA8M0Ur3p9XHVVOpONEI",
  authDomain: "sistembahasabypaan.firebaseapp.com",
  projectId: "sistembahasabypaan",
  storageBucket: "sistembahasabypaan.firebasestorage.app",
  messagingSenderId: "895254115821",
  appId: "1:895254115821:web:c3611f5607799985af23e4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);