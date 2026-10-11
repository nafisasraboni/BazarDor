"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রোডাক্ট বিস্তারিত দেখতে হলে সাইন ইন করতে হবে!");
      router.push("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetch(`https://openapi.programming-hero.com/api/bazardor/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (isPending || loading) {
    return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
        <Link href="/" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">হোম পেজে যান</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-600">হোম</Link> / 
          <span>{product.category || "ক্যাটাগরি"}</span> / 
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {/* Top Product Summary Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              {product.icon || "📦"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{product.unit} · {product.category}</p>
              <p className="text-xs text-gray-600 mt-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full inline-block">
                গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-center min-w-[160px]">
            <span className="text-xs text-gray-400 block">আজকের দাম</span>
            <span className="text-2xl font-bold text-gray-900">{product.price}</span>
            <span className="text-xs text-gray-500 block">টাকা / {product.unit}</span>
            <span className="text-xs font-semibold text-red-600 mt-1 block">▲ ৩.১%</span>
          </div>
        </div>

        {/* Price Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-xs text-gray-400">সর্বনিম্ন দাম</span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">৫১ টাকা</h3>
            <p className="text-xs text-gray-500 mt-2">সবচেয়ে কম দামের বাজার</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-xs text-gray-400">সর্বাধিক দাম</span>
            <h3 className="text-2xl font-bold text-red-600 mt-1">৭৩ টাকা</h3>
            <p className="text-xs text-gray-500 mt-2">সবচেয়ে বেশি দামের বাজার</p>
          </div>
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-xs text-gray-400">গড় দাম</span>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">৬৬ টাকা</h3>
            <p className="text-xs text-gray-500 mt-2">প্রতি কেজি-এর হিসাবে</p>
          </div>
        </div>

        {/* Bazar Based Table */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase">
                  <th className="py-3 px-4">বাজার</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4">সর্বনিম্ন</th>
                  <th className="py-3 px-4">সর্বাধিক</th>
                  <th className="py-3 px-4">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {[
                  { name: "মাট বাজার", div: "ময়মনসিংহ", min: "৫৯ টাকা", max: "৬২ টাকা", avg: "৬২ টাকা" },
                  { name: "সদর বাজার", div: "রাজশাহী", min: "৬০ টাকা", max: "৬৬ টাকা", avg: "৬৩ টাকা" },
                  { name: "বাজারঘাট", div: "খুলনা", min: "৬০ টাকা", max: "৬৭ টাকা", avg: "৬৩.৫০ টাকা" },
                  { name: "কাওরান বাজার", div: "ঢাকা", min: "৬২ টাকা", max: "৭৩ টাকা", avg: "৬৯ টাকা" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-medium text-gray-900">{row.name}</td>
                    <td className="py-3.5 px-4 text-gray-500">{row.div}</td>
                    <td className="py-3.5 px-4">{row.min}</td>
                    <td className="py-3.5 px-4">{row.max}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}