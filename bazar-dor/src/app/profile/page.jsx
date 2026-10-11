"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="min-h-[60vh] flex items-center justify-center font-medium">লোড হচ্ছে...</div>;
  }

  if (!session) {
    return <div className="min-h-[60vh] flex items-center justify-center">লগইন করা নেই!</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
        <p className="text-xs text-gray-500 mt-0.5">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={session.user.image || "https://i.ibb.co.com/5G0X3Yr/avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{session.user.name}</h2>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => authClient.signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <LogOut className="w-4 h-4" /> সাইন আউট
        </button>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900">তথ্য</h3>
        <div>
          <label className="text-xs text-gray-400 block mb-1">নাম</label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800">
            {session.user.name}
          </div>
        </div>
        <div className="pt-2">
          <Link
            href="/profile/update"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition text-sm shadow-sm"
          >
            তথ্য আপডেট করুন
          </Link>
        </div>
      </div>
    </main>
  );
}