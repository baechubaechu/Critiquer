import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRITIQUER",
  description:
    "An architectural critique tool for reading student projects through structured critical lenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
