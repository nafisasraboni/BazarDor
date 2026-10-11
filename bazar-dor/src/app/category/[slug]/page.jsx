"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data || []);
        if (list.length === 0) {
          setNotFound(true);
        } else {
          setProducts(list);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

    fetch(`https://openapi.programming-hero.com/api/bazardor/categories/${slug}`)
      .then((res) => res.json())
      .then((data) => setCategoryInfo(data.data || data))
      .catch(() => {});
  }, [slug]);

  // Bengali numeric sorting handler
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.today || a.price || 0;
    const priceB = b.today || b.price || 0;
    if (sortOrder === "low-high") return priceA - priceB;
    if (sortOrder === "high-low") return priceB - priceA;
    return 0;
  });

  if (notFound) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - পাওয়া যায়নি</h1>
        <p className="text-gray-600 mb-6">এই ক্যাটাগরি বা পেজটি খুঁজে পাওয়া যায়নি।</p>
        <Link href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6 w-full">
      {/* Category Header Banner */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{categoryInfo?.icon || categoryInfo?.categoryIcon || "📦"}</span> 
            <span>{categoryInfo?.nameBn || categoryInfo?.name || slug}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">এই পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl">
          <span className="text-sm text-gray-600">সাজান:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-800 outline-none cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 bg-gray-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((item) => {
            const priceVal = item.today || item.price || 0;
            const isUp = item.change?.dir === "up" || item.change >= 0;
            const changePct = item.change?.pct || Math.abs(item.change || 0);

            return (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                    {item.image || item.categoryIcon || "📦"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition">
                      {item.nameBn || item.name}
                    </h3>
                    <p className="text-xs text-gray-500">প্রতি {item.unit || "কেজি"}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-xs text-gray-400 block">আজকের দাম</span>
                    <span className="font-bold text-gray-900 text-lg">{priceVal} টাকা</span>
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
          })}
        </div>
      )}
    </main>
  );
}