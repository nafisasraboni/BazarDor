"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.data || [];
        setProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  const risers = products.slice(0, 6);
  const fallers = products.slice(6, 12);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-10 w-full">
      {/* Hero Banner Section */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div>
            <a
              href="#all-products"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>
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

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium">
          লোড হচ্ছে...
        </div>
      ) : (
        <>
          {/* Section A — Top Risers */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <span>▲</span> আজ দাম বেড়েছে
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {risers.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>

          {/* Section B — Top Fallers */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
              <span>▼</span> আজ দাম কমেছে
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallers.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>

          {/* Section C — All Products */}
          <div id="all-products" className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
              <p className="text-sm text-gray-500">
                মোট {products.length}টি পণ্য দেখানো হচ্ছে
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function ProductCard({ product }) {
  const priceVal = product.today || product.price || 0;
  const isUp = product.change?.dir === "up" || product.change >= 0;
  const changePct = product.change?.pct || Math.abs(product.change || 0);

  // ক্যাটাগরি বা নাম অনুযায়ী ফলব্যাক ইমোজি ম্যাপিং
  const getFallbackEmoji = (prod) => {
    if (prod.image && prod.image.length <= 4) return prod.image;
    if (prod.categoryIcon) return prod.categoryIcon;

    const cat = prod.category || "";
    if (cat === "chal" || prod.nameBn?.includes("চাল")) return "🍚";
    if (cat === "dal" || prod.nameBn?.includes("ডাল")) return "📦";
    if (cat === "tel" || prod.nameBn?.includes("তেল")) return "🛢️";
    if (
      cat === "sobji" ||
      prod.nameBn?.includes("আলু") ||
      prod.nameBn?.includes("পেঁয়াজ")
    )
      return "🥔";
    if (cat === "mach" || prod.nameBn?.includes("মাছ")) return "🐟";
    if (cat === "mangsho" || prod.nameBn?.includes("মাংস")) return "🍗";
    if (
      cat === "dim-dui" ||
      prod.nameBn?.includes("ডিম") ||
      prod.nameBn?.includes("দুধ")
    )
      return "🥚";
    if (
      cat === "mosla" ||
      prod.nameBn?.includes("আদা") ||
      prod.nameBn?.includes("রসুন")
    )
      return "🧄";

    return "📦";
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition">
          {getFallbackEmoji(product)}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition">
            {product.nameBn || product.name}
          </h3>
          <p className="text-xs text-gray-500">
            প্রতি {product.unit || "কেজি"}
          </p>
        </div>
      </div>
      <div className="flex items-end justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <span className="font-bold text-gray-900 text-lg">
            {priceVal} টাকা
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isUp ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isUp ? "▲" : "▼"} {changePct}%
        </span>
      </div>
    </Link>
  );
}
