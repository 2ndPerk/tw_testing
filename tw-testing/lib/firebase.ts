import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const isLocalEnv = process.env.NODE_ENV !== 'production';
var hasConfig = false;
var app;
const localFirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id", // Falls back to mock string
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-bucket",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id",
};
if (isLocalEnv) {
    console.log('Running in local development mode');

    hasConfig = Object.values(localFirebaseConfig).every(
        (val) => val && !val.startsWith("mock-")
    );

    app = getApps().length === 0
        ? initializeApp(hasConfig ? localFirebaseConfig : { projectId: "mock-project-id" })
        : getApp();
}else{
    app = getApps().length === 0 ? initializeApp() : getApp();
}

const db = getFirestore(app);

export { db };