'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    async function fetchProducts() {
      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        const data = await res.json();
        const prodList = Array.isArray(data) ? data : (data?.data || data?.products || []);
        setProducts(prodList);
        setLoading(false);
      } catch (err) {
        console.error("Home products fetch error:", err);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen"></div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl font-medium animate-pulse text-green-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  // মূল প্রোডাক্ট লিস্ট থেকে ফিল্টার করে দাম বাড়া ও কমা পণ্যগুলো বের করা হচ্ছে
  // Safe filtering logic
  const risers = products.filter(p => {
    const val = Number(p.change || p.percentage || p.priceChange || 0);
    return val > 0;
  });

  const fallers = products.filter(p => {
    const val = Number(p.change || p.percentage || p.priceChange || 0);
    return val < 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero / Banner Section (bazar-hero.png ব্যবহার করে) */}
      <div className="bg-[#f2f7f4] border border-[#e2ede6] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-xs">
        <div className="max-w-xl space-y-4">
          <span className="inline-block bg-[#e2ede6] text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="pt-2">
            <a 
              href="#sob-ponno" 
              className="inline-block bg-[#107c41] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#0e6b37] transition shadow-xs scroll-smooth"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        {/* ডানপাশে bazar-hero.png ছবি */}
        <div className="mt-8 md:mt-0 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image 
              src="/assets/bazar-hero.png" 
              alt="Bazar Hero" 
              fill 
              className="object-contain drop-shadow-md"
              priority 
            />
          </div>
        </div>
      </div>

      {/* Section A — আজ দাম বেড়েছে */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <span className="text-red-500">▲</span> আজ দাম বেড়েছে ({risers.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risers.length > 0 ? (
            risers.map((item, idx) => <ProductCard key={idx} product={item} />)
          ) : (
            <p className="text-gray-500 text-sm">আজ কোনো পণ্যের দাম বাড়েনি।</p>
          )}
        </div>
      </div>

      {/* Section B — আজ দাম কমেছে */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <span className="text-green-500">▼</span> আজ দাম কমেছে ({fallers.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fallers.length > 0 ? (
            fallers.map((item, idx) => <ProductCard key={idx} product={item} />)
          ) : (
            <p className="text-gray-500 text-sm">আজ কোনো পণ্যের দাম কমেনি।</p>
          )}
        </div>
      </div>

      {/* Section C — সব পণ্য */}
      <div id="sob-ponno" className="space-y-4 pt-6 scroll-mt-24">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
          <p className="text-sm text-gray-500">মোট {products.length}টি পণ্য দেখানো হচ্ছে</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item, idx) => (
            <ProductCard key={idx} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const rawChange = product.change !== undefined ? product.change : (product.percentage !== undefined ? product.percentage : 0);
  const changeVal = Number(rawChange) || 0;
  const isUp = changeVal >= 0;

  return (
    <Link 
      href={`/product/${product.id || product.slug}`}
      className="bg-white border rounded-2xl p-5 hover:shadow-md transition flex justify-between items-center group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border">
          {product.icon || product.emoji || '🍚'}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 group-hover:text-[#107c41] transition">
            {product.nameBn || product.name || product.title}
          </h3>
          <p className="text-xs text-gray-500">প্রতি {product.unit || product.unitName || 'কেজি'}</p>
          <div className="mt-2">
            <span className="text-xs text-gray-400 block">আজকের দাম</span>
            <span className="text-lg font-bold text-gray-900">{product.price || product.currentPrice} টাকা</span>
          </div>
        </div>
      </div>
      <div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isUp ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
          {isUp ? `▲ ${Math.abs(changeVal)}%` : `▼ ${Math.abs(changeVal)}%`}
        </span>
      </div>
    </Link>
  );
}