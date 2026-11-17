import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize the app once (prevents duplicate instance errors on hot reloads)
const app = getApps().length === 0 ? initializeApp() : getApp();
const db = getFirestore(app);

export { db };
