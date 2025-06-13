// defaultProgress.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const defaultProgress = {
  hunger: 50,
  money: 100,
  stamina: 100,
  happy: 50,
  spiritual: 0,
  currentLocation: "Home", // Default location
  inventory: [] // Inventory kosong awal
};

// Fungsi untuk menyimpan progress ke localStorage
const saveProgress = (progress) => {
  // Simpan data ke localStorage
  localStorage.setItem("playerProgress", JSON.stringify(progress));
  console.log("Progress disimpan ke localStorage:", progress);
};

const clampStat = (val) => Math.max(0, Math.min(100, val));

// Fungsi untuk memuat progress dari localStorage, atau return defaultProgress jika tidak ada
const loadProgress = () => {
  const savedProgress = localStorage.getItem("playerProgress");
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    // Clamp all stats except money to 0-100
    return {
      ...progress,
      hunger: clampStat(progress.hunger ?? 50),
      money: progress.money ?? 100, // money tidak dibatasi
      stamina: clampStat(progress.stamina ?? 100),
      happy: clampStat(progress.happy ?? 50),
      spiritual: clampStat(progress.spiritual ?? 0),
    };
  } else {
    return defaultProgress;
  }
};

const saveOnSleep = (stat, currentLocation, inventory, gameTime) => {
  const progress = {
    hunger: clampStat(stat.hunger),
    money: stat.money, // money tidak dibatasi
    stamina: clampStat(stat.stamina),
    happy: clampStat(stat.happy),
    spiritual: clampStat(stat.spiritual),
    currentLocation: currentLocation,
    inventory: inventory,
    ...gameTime,
    realDate: new Date().toISOString(),
  };

  saveProgress(progress);

  const savedProgress = JSON.parse(localStorage.getItem("playerProgress"));
  console.log("Data yang disimpan di localStorage: ", savedProgress);

  const userId = localStorage.getItem("userId");
  if (userId) {
    saveToFirebase(userId, progress);
  } else {
    console.error("userId tidak ditemukan di localStorage");
  }
};

const saveToFirebase = async (userId, progress) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, progress, { merge: true });
    console.log("Data berhasil disimpan ke Firebase:", progress);
  } catch (error) {
    console.error("Error menyimpan data ke Firebase:", error);
  }
};

export { saveOnSleep, loadProgress, saveProgress, saveToFirebase };
export {defaultProgress};