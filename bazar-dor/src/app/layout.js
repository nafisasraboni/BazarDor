import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react"; // ১. Suspense ইমপোর্ট করুন

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "বাজার দর / BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${inter.className} bg-[#f9fafb] text-gray-900 min-h-screen flex flex-col justify-between`}>
        <Toaster position="top-right" />
        
        {/* ২. Navbar কে Suspense দিয়ে র‍্যাপ করুন */}
        <Suspense fallback={<header className="bg-white h-16 border-b"></header>}>
          <Navbar />
        </Suspense>

        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}