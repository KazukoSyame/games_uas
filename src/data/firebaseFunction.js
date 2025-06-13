// firebaseFunctions.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Pastikan file firebase.js sudah terkonfigurasi dengan benar

// Fungsi untuk menyimpan progress pemain ke Firebase
const saveToFirebase = async (userId, progress) => {
    try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, progress, { merge: true });
        console.log("Data berhasil disimpan ke Firebase:", progress);
    } catch (error) {
        console.error("Error menyimpan data ke Firebase:", error);
    }
};

export { saveToFirebase };
