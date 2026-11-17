export default function Home() {
  return (
      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem"
      }}>
        <h1 style={{ color: "#ffcb2b" }}>🔥 Gemini in Firebase</h1>
        <h2>Next.js MVP App</h2>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Your backend <strong>tw-testapp-firebasehost</strong> is ready to host this site.
        </p>

        <div style={{
          marginTop: "2rem",
          padding: "1.5rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Deployment Checklist:</h3>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: "1.6" }}>
            <li>TypeScript & React config active</li>
            <li>Ensure you generate a package lock file locally</li>
            <li>Push these changes to your main branch</li>
          </ul>
        </div>
      </main>
  );
}