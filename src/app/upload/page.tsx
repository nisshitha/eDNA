"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import { 
  FiUploadCloud, 
  FiFileText, 
  FiX, 
  FiArrowLeft,
  FiHome,        // Import nav icons
  FiInfo, 
  FiHelpCircle,
  FiLoader
} from 'react-icons/fi';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleDropZoneClick = () => { fileInputRef.current?.click(); };
  
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation(); setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
      setError(null);
    }
  };
  
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); setIsDragging(false); };
  const removeFile = () => { setSelectedFile(null); };

  const handleContinue = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    localStorage.removeItem('analysisResult'); // Clear old data
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'An unknown error occurred.');
      localStorage.setItem('analysisResult', JSON.stringify(result));
      router.push('/globe');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/one.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> 
      </div>

      {/* --- MODIFIED: Header with correct links --- */}
      <header className="relative z-10 bg-blue-900/80 backdrop-blur-sm shadow-lg">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1M12 8c-.112 0-.224.016-.335.035M2.004 15.197a4.5 4.5 0 011.026-.06C6.11 14.885 8.761 14 12 14c3.239 0 5.89.884 8.97.944a4.5 4.5 0 011.026.06l-.412 1.633a9.75 9.75 0 01-18.128 0l-.412-1.633zM12 21c-3.132 0-6.104-.633-8.875-1.761M12 21c3.132 0 6.104-.633 8.875-1.761M12 21v-3"></path></svg>
            <span className="text-xl font-bold">DEEPSEQ</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/" className="flex items-center hover:text-blue-200">
                <FiHome className="mr-1"/>Home
            </Link>
            <Link href="/about" className="flex items-center hover:text-blue-200">
                <FiInfo className="mr-1"/>About us
            </Link>
            <Link href="/help" className="flex items-center hover:text-blue-200">
                <FiHelpCircle className="mr-1"/>Help
            </Link>
          </div>
        </nav>
      </header>

      {/* Back Arrow */}
      <button onClick={() => router.back()} className="absolute top-24 left-8 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75">
          <FiArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-xl rounded-lg bg-blue-900/80 p-8 text-white shadow-2xl backdrop-blur-md">
          <h2 className="mb-6 text-xl font-bold text-center">File Upload</h2>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".fasta,.fastq,.fa,.fna" />
          
          <div
            onClick={handleDropZoneClick} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-white/10 p-10 text-center transition-colors cursor-pointer ${
              isDragging ? 'border-blue-300 bg-white/20' : 'border-gray-400'
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center text-white">
                <FiFileText className="mb-2 h-10 w-10" />
                <p className="font-semibold">{selectedFile.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="mt-4 flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-30 sermibold text-red-300 hover:bg-red-500/40"
                > <FiX /> Remove </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-300">
                <FiUploadCloud className="mb-2 h-10 w-10" />
                <p className="font-semibold">Click or drag file to this area to upload</p>
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-gray-300">
            <p>Formats accepted are .fasta and .fastq</p>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-300">
            If you do not have a file you can use the sample below:
            <a href="/sample.fasta" download className="ml-2 inline-block rounded-md bg-gray-600/50 px-3 py-1 font-semibold text-white hover:bg-gray-500/50">
              Download Sample Template
            </a>
          </div>

          {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={() => router.back()} className="rounded-md bg-gray-600/50 px-6 py-2 font-semibold transition hover:bg-gray-500/50">
              Cancel
            </button>
            <button
              onClick={handleContinue} disabled={!selectedFile || isLoading}
              className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isLoading && <FiLoader className="animate-spin mr-2" />}
              {isLoading ? 'Analyzing...' : 'Continue'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}