'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [pathname, setPathname] = useState('');
  const rawPathname = usePathname();
  
  const { data: session } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tickerProducts, setTickerProducts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPathname(rawPathname);

    async function fetchNavData() {
      try {
        const catRes = await fetch("https://openapi.programming-hero.com/api/bazardor/categories");
        const catData = await catRes.json();
        const catList = Array.isArray(catData) ? catData : (catData?.data || catData?.categories || []);
        setCategories(catList);

        const prodRes = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        const prodData = await prodRes.json();
        const prodList = Array.isArray(prodData) ? prodData : (prodData?.data || prodData?.products || []);
        setTickerProducts(prodList);
      } catch (err) {
        console.log("Error:", err);
      }
    }

    fetchNavData();
  }, [rawPathname]);

  const categoryIcons = {
    'chal': '🍚',
    'dal': '🫘',
    'oil': '🫙',
    'vegetables': '🥬',
    'fish': '🐟',
    'meat': '🍗',
    'egg-milk': '🥛',
    'spices': '🌶️',
  };

  if (!isMounted) {
    return <header className="bg-white shadow-xs border-b h-16"></header>;
  }

  return (
    <header className="bg-white shadow-xs border-b sticky top-0 z-50">
      {/* ১ম রো: লোগো ও অথ */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#107c41] text-white p-2.5 rounded-2xl text-xl shadow-xs">🛒</div>
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">বাজার দর</Link>
            <p className="text-xs text-gray-500 font-medium">মঙ্গলবার, ৬ অক্টোবর, ২০২৬</p>
          </div>
        </div>

        <div>
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 border px-3 py-1.5 rounded-full hover:bg-gray-50 transition cursor-pointer"
              >
                <img 
                  src={session.user.image || "https://picsum.photos/30"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border" 
                />
                <span className="text-sm font-semibold text-gray-800">{session.user.name}</span>
                <span className="text-gray-500 text-xs">▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b mb-1">
                    <p className="font-bold text-sm text-gray-800">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl font-medium">
                    👤 আমার প্রোফাইল
                  </Link>
                  <button 
                    onClick={async () => {
                      await authClient.signOut();
                      toast.success("সফলভাবে সাইন আউট করা হয়েছে");
                      window.location.href = "/signin";
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium cursor-pointer mt-1"
                  >
                    ↩️ সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin" className="px-4 py-2 text-sm font-medium border rounded-xl hover:bg-gray-50 text-gray-700">সাইন ইন</Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-[#107c41] text-white rounded-xl hover:bg-[#0e6b37]">সাইন আপ</Link>
            </div>
          )}
        </div>
      </div>

      {/* ২য় রো: ক্যাটাগরি */}
      <div className="border-t bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex gap-6 overflow-x-auto text-sm items-center">
          {categories.map((cat, idx) => {
            const catSlug = cat.slug || '';
            const catName = cat.nameBn || cat.name || '';
            const catIcon = cat.icon || '🛒';
            const isActive = pathname === `/category/${catSlug}`;
            
            return (
              <Link 
                key={idx} 
                href={`/category/${catSlug}`} 
                className={`flex items-center gap-1.5 whitespace-nowrap font-medium px-3 py-1.5 rounded-xl transition ${
                  isActive ? 'bg-[#107c41] text-white shadow-xs' : 'text-gray-600 hover:text-[#107c41] hover:bg-gray-100'
                }`}
              >
                <span>{catIcon}</span>
                <span>{catName}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* প্রাইস টিকার */}
      <div className="bg-[#f4f7f5] border-t overflow-hidden py-2 text-xs text-gray-700 flex whitespace-nowrap relative">
        <div className="flex gap-6 animate-marquee items-center">
          {tickerProducts.length > 0 ? (
            tickerProducts.concat(tickerProducts).map((item, idx) => {
              const itemName = item.nameBn || item.name || item.title || 'পণ্য';
              const itemPrice = item.price || item.currentPrice || item.todayPrice || '০';
              const itemUnit = item.unit || item.unitName || 'কেজি';
              const itemEmoji = item.icon || item.emoji || '🍚';
              
              const rawChange = item.change !== undefined ? item.change : (item.percentage !== undefined ? item.percentage : 0);
              const changeVal = Number(rawChange) || 0;
              const isUp = changeVal >= 0;

              return (
                <span key={idx} className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border shadow-2xs font-medium">
                  <span>{itemEmoji}</span>
                  <span className="text-gray-800">{itemName}</span>
                  <span className="text-gray-500">{itemPrice} টাকা/{itemUnit}</span>
                  <span className={`font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {isUp ? `▲ ${Math.abs(changeVal)}%` : `▼ ${Math.abs(changeVal)}%`}
                  </span>
                </span>
              );
            })
          ) : (
            <span className="px-4 text-gray-500">মূল্য তালিকা লোড হচ্ছে...</span>
          )}
        </div>
      </div>
    </header>
  );
}