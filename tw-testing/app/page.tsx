"use client";

import { useEffect, useState } from "react";
import { db, subscribeToAuthState, signInWithGoogle, logout } from "@/lib/firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

interface TestDoc {
    id: string;
    data: DocumentData;
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [docs, setDocs] = useState<TestDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Handle data loading and auth subscription on mount
    useEffect(() => {
        // 1. Subscribe to auth changes and save clean-up function
        const unsubscribe = subscribeToAuthState((currentUser) => {
            setUser(currentUser);
        });

        fetchDocs();

        // 2. Clean up subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    // Fetch documents from Firestore
    const fetchDocs = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "testCollection"));
            const documents: TestDoc[] = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, data: doc.data() });
            });
            setDocs(documents);
            setError(null);
        } catch (err) {
            console.error("Error reading testCollection: ", err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const addTestDoc = async () => {
        try {
            const docRef = await addDoc(collection(db, "testCollection"), {
                message: "Hello from my App Hosting MVP!",
                timestamp: new Date()
            });
            alert(`Document written with ID: ${docRef.id}`);
            fetchDocs();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
            {/* Auth Section at the top */}
            <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #eaeaea" }}>
                {user ? (
                    <div>
                        <p>Logged in as: <strong>{user.displayName || user.email}</strong></p>
                        <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer" }}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>Please sign in to access more features.</p>
                        <button onClick={signInWithGoogle} style={{ padding: "10px 20px", background: "#4285f4", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                            Sign in with Google
                        </button>
                    </div>
                )}
            </div>

            <h1>🚀 Connect to Firestore Database</h1>
            <button onClick={addTestDoc} style={{ padding: "10px 20px", fontSize: "1rem", marginBottom: "1.5rem" }}>
                Test Document
            </button>

            <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
                {loading && <p>Loading data...</p>}
                {error && <p style={{ color: "red" }}>Error loading data: {error}</p>}
                {!loading && !error && docs.length === 0 && (
                    <p>No documents found in testCollection.</p>
                )}
                {!loading && !error && docs.length > 0 && (
                    <ul>
                        {docs.map((doc) => (
                            <li key={doc.id} style={{ marginBottom: "1rem" }}>
                                <strong>Document ID:</strong> {doc.id}
                                <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px", overflowX: "auto" }}>
                                    {JSON.stringify(doc.data, null, 2)}
                                </pre>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
