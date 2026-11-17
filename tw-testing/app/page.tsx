"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";

interface TestDoc {
    id: string;
    data: DocumentData;
}

export default function Home() {
    const [docs, setDocs] = useState<TestDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Load data once when the component mounts
    useEffect(() => {
        fetchDocs();
    }, []);

    const addTestDoc = async () => {
        try {
            const docRef = await addDoc(collection(db, "testCollection"), {
                message: "Hello from my App Hosting MVP!",
                timestamp: new Date()
            });
            alert(`Document written with ID: ${docRef.id}`);
            fetchDocs(); // Refresh the list automatically
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
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
