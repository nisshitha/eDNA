'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi'; // Import icons

export default function LandingPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from the file dialog
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Trigger the hidden file input when the drop zone is clicked
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file drop
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };
  
  // Handle drag over
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  // Handle drag leave
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  // Remove the selected file
  const removeFile = () => {
    setSelectedFile(null);
  };

  // Navigate to the next page
  const handleContinue = () => {
    if (selectedFile) {
      router.push('/globe');
    }
  };

  return (
    <main className="relative h-screen w-screen font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/sea.jpg')" }}
        aria-hidden="true"
      />
      
      {/* Centering Container */}
      <div className="relative z-10 flex h-full items-center justify-center p-4">
        {/* File Upload Modal */}
        <div className="w-full max-w-lg rounded-lg bg-gray-100/90 p-8 text-gray-800 shadow-2xl backdrop-blur-md">
          <h2 className="mb-4 text-xl font-bold text-gray-700">File Upload</h2>
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="*" // Accepts any file as requested
          />
          
          {/* Drop Zone */}
          <div
            onClick={handleDropZoneClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-gray-50 p-10 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            {selectedFile ? (
              // Display when a file is selected
              <div className="flex flex-col items-center text-gray-700">
                <FiFileText className="mb-2 h-10 w-10" />
                <p className="font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{selectedFile.type}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent drop zone click event
                    removeFile();
                  }}
                  className="mt-4 flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-200"
                >
                  <FiX /> Remove
                </button>
              </div>
            ) : (
              // Display when no file is selected
              <div className="flex flex-col items-center text-gray-500">
                <FiUploadCloud className="mb-2 h-10 w-10" />
                <p className="font-semibold">Click or drag a file to this area to upload</p>
                <p className="mt-2 text-xs">We accept any file type you provide.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            If you do not have a file, you can use the sample below.
            <a href="#" className="ml-2 inline-block rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300">
              Download Sample Template
            </a>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => router.back()} // Go back to the previous page
              className="rounded-md px-6 py-2 font-semibold text-gray-600 transition hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedFile}
              className="rounded-md bg-black px-6 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
