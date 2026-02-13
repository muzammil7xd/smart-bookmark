import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmarks",
  description: "Save and organize your favorite links with real-time sync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
