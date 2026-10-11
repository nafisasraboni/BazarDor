"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            toast.success("সফলভাবে লগইন হয়েছে!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "লগইন ব্যর্থ হয়েছে!");
          },
        },
      );
    } catch (err) {
      toast.error("কিছু সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    try {
      await signIn.social({
        provider: providerName,
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Social login error:", err);
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900">সাইন ইন</h2>
        <p className="text-sm text-gray-600 mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-4" onSubmit={handleSignIn}>
            
            <input
              type="text"
              name="fake-username"
              style={{ display: "none" }}
            />
            <input
              type="password"
              name="fake-password"
              style={{ display: "none" }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ইমেইল
              </label>
              <input
                type="email"
                required
                name="real-email-input"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* পাসওয়ার্ড ফিল্ড */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                পাসওয়ার্ড
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="real-password-input"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">অথবা</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                Google দিয়ে চালিয়ে যান
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                GitHub দিয়ে চালিয়ে যান
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">অ্যাকাউন্ট নেই? </span>
            <Link
              href="/signup"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              সাইন আপ করুন
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:underline">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
