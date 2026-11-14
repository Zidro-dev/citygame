import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Idle City Builder | Multiplayer Metropolis Strategy",
  description: "Build, automate, and link your futuristic cyber metropolis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-100 bg-[#090d16]">
        {children}
      </body>
    </html>
  );
}
