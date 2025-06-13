import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Tambahkan ini

const firebaseConfig = {
  apiKey: "AIzaSyCbJ0Rh3Ks_NlW5QGN2ziHeQuwlFH_W9fo",
  authDomain: "bijisalak-survival-3ae3c.firebaseapp.com",
  projectId: "bijisalak-survival-3ae3c",
  storageBucket: "bijisalak-survival-3ae3c.appspot.com", // ✅ perbaiki ini juga, "firebasestorage.app" salah
  messagingSenderId: "542847519746",
  appId: "1:542847519746:web:f5156c04f7caa988bf2b1b",
  measurementId: "G-LT3YM6DNZX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Tambahkan ini agar bisa digunakan di HomePage.jsx dan LoginPage.jsx
export const auth = getAuth(app);
export const db = getFirestore(app);
