"use client";
export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
    const addTestDoc = async () => {
        try {
            const docRef = await addDoc(collection(db, "testCollection"), {
                message: "Hello from my App Hosting MVP!",
                timestamp: new Date()
            });
            alert(`Document written with ID: ${docRef.id}`);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
            <h1>🚀 Connect to Firestore Database</h1>
            <button onClick={addTestDoc} style={{ padding: "10px 20px", fontSize: "1rem" }}>
                Write Test Document
            </button>
        </main>
    );
}
