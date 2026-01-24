import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkSync",
  description: "Find the Golden Hour for your global team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
