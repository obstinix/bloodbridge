import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatbotWidget from "./components/ChatbotWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloodBridge - Healthcare & Blood Bank Management",
  description: "Real-time, modern healthcare platform for blood donations, demand forecasting, and inventory matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}

