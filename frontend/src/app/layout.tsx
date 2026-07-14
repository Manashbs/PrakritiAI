import type { Metadata } from "next";
import { ModeProvider } from "@/context/ModeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrakritiAI - Ayurvedic Wellness",
  description: "AI-powered Ayurvedic diagnosis and teleconsultation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ModeProvider>
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
