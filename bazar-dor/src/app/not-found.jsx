import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">প্রোফাইল পাওয়া যায়নি</h1>
      <p className="text-gray-600 mb-6">আপনি যে প্রোফাইল পেজটি খুঁজছেন তা বিদ্যমান নেই।</p>
      <Link href="/profile" className="bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl shadow transition">
        প্রোফাইলে ফিরে যান
      </Link>
    </div>
  );
}