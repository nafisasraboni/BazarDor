'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ১. মেইন কম্পোনেন্টটিকে আলাদা করে ফেলুন
function CategoryContent() {
  const params = useParams();
  const slug = params?.slug;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        const data = await res.json();
        const allProducts = Array.isArray(data) ? data : (data?.data || data?.products || []);
        
        const filtered = allProducts.filter(p => (p.categorySlug || p.category) === slug);
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    if (slug) fetchCategoryProducts();
  }, [slug]);

  if (loading) {
    return <div className="min-h-[50vh] flex justify-center items-center font-medium text-green-600">লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 capitalize">ক্যাটাগরি: {slug}</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item, idx) => (
            <ProductCard key={idx} product={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const rawChange = product.change !== undefined ? product.change : (product.percentage || 0);
  const changeVal = Number(rawChange) || 0;
  const isUp = changeVal >= 0;

  return (
    <Link 
      href={`/product/${product.id || product.slug}`}
      className="bg-white border rounded-2xl p-5 hover:shadow-md transition flex justify-between items-center group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border">
          {product.icon || product.emoji || '🛒'}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 group-hover:text-[#107c41] transition">{product.nameBn || product.name}</h3>
          <p className="text-xs text-gray-500">প্রতি {product.unit || 'কেজি'}</p>
          <div className="mt-2">
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

// ২. ডিফল্ট এক্সপোর্টে Suspense দিয়ে র‍্যাপ করুন
export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex justify-center items-center">লোড হচ্ছে...</div>}>
      <CategoryContent />
    </Suspense>
  );
}