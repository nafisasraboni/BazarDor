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
  const toastShown = useRef(false); // একবার টোস্ট দেখানোর জন্য রেফারেন্স

  useEffect(() => {
    if (!isPending && !session && !toastShown.current) {
      toastShown.current = true;
      
      // ২ সেকেন্ডের জন্য টোস্ট দেখাবে এবং নিজে থেকেই চলে যাবে
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
  const isUp = product.change?.dir === "up";
  const changePct = product.change?.pct || 0;

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
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-600">হোম</Link> / 
        <span>{product.categoryNameBn || product.category || "ক্যাটাগরি"}</span> / 
        <span className="text-gray-800 font-medium">{product.nameBn || product.name}</span>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
            {product.image || product.categoryIcon || "📦"}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.nameBn || product.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">প্রতি {product.unit || "কেজি"} · {product.categoryNameBn || product.category}</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-center min-w-[160px]">
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <span className="text-2xl font-bold text-gray-900">{priceVal}</span>
          <span className="text-xs text-gray-500 block">টাকা / {product.unit || "কেজি"}</span>
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