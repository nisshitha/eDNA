"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);

    // Simulate upload + prediction delay
    setTimeout(() => {
      router.push("/globe");
    }, 2000); // 2 seconds mock prediction
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      {!loading ? (
        <>
          <h1 className="mb-4 text-2xl font-semibold">Upload your eDNA file</h1>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
            className="px-4 py-2 border rounded"
          />
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="loader mb-4"></div>
          <p>Processing predictions...</p>
        </div>
      )}

      <style jsx>{`
        .loader {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
