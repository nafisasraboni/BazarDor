"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";

// Category Links Component wrapped with usePathname
function CategoryLinks() {
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        const catList = Array.isArray(data) ? data : (data.data || []);
        setCategories(catList);
      })
      .catch((err) => console.error("Categories Fetch Error:", err));
  }, []);

  return (
    <div className="bg-gray-50 border-t border-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = pathname === `/category/${cat.slug}`;
          return (
            <Link
              key={cat.id || cat.slug}
              href={`/category/${cat.slug}`}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              <span>{cat.icon || cat.categoryIcon || "📦"}</span>
              <span>{cat.nameBn || cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [tickerItems, setTickerItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const prodList = Array.isArray(data) ? data : (data.data || []);
        setTickerItems(prodList);
      })
      .catch((err) => console.error("Products Fetch Error:", err));
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-600 text-white p-2 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-900">বাজার দর</span>
            <p className="text-xs text-gray-500">মঙ্গলবার, ৬ অক্টোবর, ২০২৬</p>
          </div>
        </Link>

        {/* Right Auth Section */}
        <div>
          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition"
              >
                <img
                  src={session.user.image || "https://i.ibb.co.com/5G0X3Yr/avatar.png"}
                  alt="User"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 text-emerald-600" /> আমার প্রোফাইল
                  </Link>
                  <button
                    onClick={() => authClient.signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" /> সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation Links Row wrapped with Suspense */}
      <Suspense fallback={<div className="h-10 bg-gray-50"></div>}>
        <CategoryLinks />
      </Suspense>

      {/* Price Ticker (Marquee) */}
      <div className="bg-emerald-50/50 border-t border-emerald-100 py-2 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-8 text-xs font-medium text-gray-700">
          {tickerItems.map((item, idx) => {
            const priceVal = item.today || item.price || 0;
            const isUp = item.change?.dir === "up" || item.change >= 0;
            const changePct = item.change?.pct || Math.abs(item.change || 0);

            return (
              <div key={idx} className="flex items-center gap-2">
                <span>{item.image || item.categoryIcon || "📦"}</span>
                <span>{item.nameBn || item.name}</span>
                <span className="text-emerald-700 font-bold">{priceVal} টাকা/{item.unit || "কেজি"}</span>
                <span className={isUp ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
                  {isUp ? "▲" : "▼"} {changePct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}