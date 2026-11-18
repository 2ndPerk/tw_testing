import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';





const isLocalEnv = process.env.NODE_ENV !== 'production';
var hasConfig = false;
var app;
const localFirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDV884tQRFy1BOeI33Erc1Dvo_pvzGIaog",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tw-initial-testing.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tw-initial-testing", // Falls back to mock string
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tw-initial-testing.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "454485604363",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:454485604363:web:235f19deddbc5983a1af0e",
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


export const auth = getAuth(app);

// 1. Google Sign-In with Popup
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user; // Authenticated user object
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
    }
};

// 2. Email/Password Account Creation (Sign Up)
export const signUpWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Sign Up Error:", error);
        throw error;
    }
};

// 3. Email/Password Login
export const loginWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

// 4. Sign Out
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign Out Error:", error);
    }
};

// 5. Auth State Listener
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
