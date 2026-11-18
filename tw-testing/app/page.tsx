"use client";

import React, { useEffect, useState } from "react";
import { db, auth, subscribeToAuthState, signInWithGoogle, logout } from "@/lib/firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";

interface TestDoc {
    id: string;
    data: DocumentData;
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [docs, setDocs] = useState<TestDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login & Sign-up
    const [authError, setAuthError] = useState<string | null>(null);

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

    // Update the event parameter to use React.SubmitEvent
    const handleEmailAuth = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthError(null);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error("Auth Error:", err);
            setAuthError((err as Error).message);
        }
    };

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
    {/* Auth Card Container */}
    <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #eaeaea", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
        {user ? (
            <div>
                <p>Logged in as: <strong>{user.email}</strong></p>
                <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer" }}>
                    Sign Out
                </button>
            </div>
        ) : (
            <div>
                <h3>{isSignUp ? "Create Account" : "Sign In"}</h3>
                <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: "8px" }}
                    />
                    <button type="submit" style={{ padding: "10px", background: "#00c853", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                        {isSignUp ? "Sign Up" : "Log In"}
                    </button>
                </form>

                {authError && <p style={{ color: "red", fontSize: "0.9rem", marginTop: "10px" }}>{authError}</p>}

                <p style={{ fontSize: "0.9rem", margin: "15px 0 10px 0" }}>
                    {isSignUp ? "Already have an account?" : "New here?"}{" "}
                    <button onClick={() => { setIsSignUp(!isSignUp); setAuthError(null); }} style={{ background: "none", border: "none", color: "#4285f4", cursor: "pointer", textDecoration: "underline" }}>
                        {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                </p>

                <div style={{ margin: "15px 0" }}>— or —</div>

                <button onClick={signInWithGoogle} style={{ padding: "10px 20px", background: "#4285f4", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
                    Sign in with Google
                </button>
            </div>
        )}
    </div>

            <h1>Connect to Firestore Database</h1>
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
