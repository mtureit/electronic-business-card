import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google";
import "./globals.css";

const kosugiMaru = Kosugi_Maru({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "electronic-business-card",
  description: "電子名刺のデザインです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head></head>
      <body className={kosugiMaru.className}>{children}</body>
    </html>
  );
}
