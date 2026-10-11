import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Navbar from "./components/Navbar"; // apnar folder structure onujayi
import Footer from "./components/Footer"; // apnar folder structure onujayi

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "বাজার দর - BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <Navbar />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}