import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // নেভবার ইমপোর্ট করুন
//import Footer from "./components/Footer"; // ফুটারও ইমপোর্ট করতে পারেন
import { Toaster } from "react-hot-toast";

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
        
        {/* Navbar এখানে রেন্ডার হবে যাতে সব পেজে দেখা যায় */}
        <Navbar></Navbar>

        <main className="flex-grow">
          {children}
        </main>

        {/* <Footer /> */}
      </body>
    </html>
  );
}