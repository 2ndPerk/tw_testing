import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const localFirebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id", // Falls back to mock string
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-bucket",
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender",
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id",
// };
//
// // Check if we have valid environment configurations
// const hasConfig = Object.values(localFirebaseConfig).every(
//     (val) => val && !val.startsWith("mock-")
// );
//
// // If no keys are loaded yet (at build-time), initialize with a mock projectId to bypass the check
// const app = getApps().length === 0
//     ? initializeApp(hasConfig ? localFirebaseConfig : { projectId: "mock-project-id" })
//     : getApp();
//
// const db = getFirestore(app);
//
// export { db };

// App Hosting automatically populates the configuration!
const app = getApps().length === 0 ? initializeApp() : getApp();
export const db = getFirestore(app);
