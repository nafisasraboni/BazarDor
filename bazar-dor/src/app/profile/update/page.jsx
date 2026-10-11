"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const router = useRouter();

  const handleUpdate = async (e) => {
    e.preventDefault();
    await authClient.updateUser(
      { name },
      {
        onSuccess: () => {
          toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
          router.push("/profile");
        },
        onError: () => {
          toast.error("আপডেট ব্যর্থ হয়েছে!");
        }
      }
    );
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-12 w-full">
      <div className="bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">প্রোফাইল আপডেট করুন</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 block mb-1">নাম</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition shadow-sm"
          >
            আপডেট
          </button>
        </form>
      </div>
    </main>
  );
}