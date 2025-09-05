"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/upload");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <button
        onClick={handleGetStarted}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
}
