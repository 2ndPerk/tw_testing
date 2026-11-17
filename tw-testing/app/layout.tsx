import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minimal Next.js MVP",
  description: "Ready for Firebase App Hosting",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#f9f9f9", color: "#333" }}>
      {children}
      </body>
      </html>
  );
}