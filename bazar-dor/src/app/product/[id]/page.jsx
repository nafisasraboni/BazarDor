"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";

function ProductDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastShown = useRef(false);

  useEffect(() => {
    if (!isPending && !session && !toastShown.current) {
      toastShown.current = true;
      toast.error("প্রোডাক্ট বিস্তারিত দেখতে হলে সাইন ইন করতে হবে!", {
        duration: 2000,
        position: 'top-center',
      });
      router.push("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (id) {
      fetch(`https://openapi.programming-hero.com/api/bazardor/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.data || data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (isPending || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-medium">লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
        <Link href="/" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">হোম পেজে যান</Link>
      </div>
    );
  }

  const priceVal = product.today || product.price || 0;
  const isUp = product.change?.dir === "up" || product.change >= 0;
  const changePct = product.change?.pct || Math.abs(product.change || 0);

  // Calculate min, max, avg from markets if available
  const markets = product.markets || [];
  let minPrice = 0, maxPrice = 0, avgPrice = 0;
  if (markets.length > 0) {
    const mins = markets.map(m => m.min);
    const maxs = markets.map(m => m.max);
    minPrice = Math.min(...mins);
    maxPrice = Math.max(...maxs);
    const totalAvg = markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0);
    avgPrice = (totalAvg / markets.length).toFixed(1);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-600">হোম</Link> / 
        <span>{product.categoryNameBn || product.category || "ক্যাটাগরি"}</span> / 
        <span className="text-gray-800 font-medium">{product.nameBn || product.name}</span>
      </div>

      {/* Top — Summary */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
            {product.image || product.categoryIcon || "📦"}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.nameBn || product.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">প্রতি {product.unit || "কেজি"} · {product.categoryNameBn || product.category}</p>
            <p className="text-xs text-gray-600 mt-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full inline-block">
              গতকালের তুলনায় আজ দাম {isUp ? "বেড়েছে" : "কমেছে"} · {changePct}%
            </p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-center min-w-[160px]">
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <span className="text-2xl font-bold text-gray-900">{priceVal}</span>
          <span className="text-xs text-gray-500 block">টাকা / {product.unit || "কেজি"}</span>
          <span className={`text-xs font-semibold mt-1 block ${isUp ? "text-red-600" : "text-emerald-600"}`}>
            {isUp ? "▲" : "▼"} {changePct}%
          </span>
        </div>
      </div>

      {/* Price - Summary (Min, Max, Avg Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
          <span className="text-xs text-gray-400">সর্বনিম্ন দাম</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{minPrice || product.yesterday || 0} টাকা</h3>
          <p className="text-xs text-gray-500 mt-2">সবচেয়ে কম দামের বাজার</p>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
          <span className="text-xs text-gray-400">সর্বাধিক দাম</span>
          <h3 className="text-2xl font-bold text-red-600 mt-1">{maxPrice || priceVal} টাকা</h3>
          <p className="text-xs text-gray-500 mt-2">সবচেয়ে বেশি দামের বাজার</p>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
          <span className="text-xs text-gray-400">গড় দাম</span>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{avgPrice || priceVal} টাকা</h3>
          <p className="text-xs text-gray-500 mt-2">প্রতি কেজি-এর হিসাবে</p>
        </div>
      </div>

      {/* বাজারভিত্তিক আজকের দাম (Bazar Breakdown Table) */}
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
              {markets.length > 0 ? (
                markets.map((m, idx) => {
                  const avg = ((m.min + m.max) / 2).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-4 font-medium text-gray-900">{m.market}</td>
                      <td className="py-3.5 px-4 text-gray-500">{m.division}</td>
                      <td className="py-3.5 px-4">{m.min} টাকা</td>
                      <td className="py-3.5 px-4">{m.max} টাকা</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{avg} টাকা</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">বাজারের তথ্য পাওয়া যায়নি।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-medium">লোড হচ্ছে...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}