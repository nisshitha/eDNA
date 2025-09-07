'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // NEW: Import the Link component
import { useRouter } from 'next/navigation'; // NEW: Import the router hook
import { FaGoogle, FaApple } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // NEW: Initialize the router

  // NEW: Function to handle form submission and other navigations
  const handleNavigateToLanding = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent default form submission if it's an event
    router.push('/upload');
  };

  return (
    <main className="relative h-screen w-screen font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/sea.jpg')" }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white/20 p-8 text-gray-800 shadow-lg backdrop-blur-md">
          <h1 className="mb-8 text-center text-4xl" style={{ fontFamily: 'serif', letterSpacing: '0.2em' }}>
            POCKET PAUSE
          </h1>

          {/* CHANGED: Added onSubmit handler to the form */}
          <form onSubmit={handleNavigateToLanding}>
            <div className="mb-4">
              <label htmlFor="mobile" className="mb-1 block text-sm text-gray-700">Enter your mobile number</label>
              <div className="flex items-center rounded-md bg-gray-200/50 p-2.5">
                <span className="border-r border-gray-400 pr-3 text-gray-600">+91</span>
                <input
                  type="tel"
                  id="mobile"
                  placeholder="1712345678"
                  className="w-full bg-transparent pl-3 text-gray-800 placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="password"className="mb-1 block text-sm text-gray-700">Enter your password</label>
              <div className="relative flex items-center rounded-md bg-gray-200/50 p-2.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="**********"
                  className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <a href="#" className="block text-right text-xs text-gray-700 hover:underline">
              forgot password?
            </a>
            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-black py-3 text-lg font-semibold text-white transition hover:bg-gray-800"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-700">
            Don't have an account?{' '}
            {/* CHANGED: Replaced <a> with <Link> for client-side navigation */}
            <Link href="/signup" className="font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
          
          <div className="mt-6 space-y-3">
             {/* CHANGED: Added onClick handler to navigate */}
            <button 
              onClick={() => handleNavigateToLanding()}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white/80 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50">
              <FaGoogle /> Continue with Google
            </button>
            <button 
              onClick={() => handleNavigateToLanding()}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white/80 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50">
              <FaApple /> Continue with Apple
            </button>
          </div>
          
          <div className="my-6 text-center text-sm text-gray-600">
            or
          </div>

          {/* CHANGED: Replaced <a> with <Link> */}
          <Link href="/upload" className="block text-center text-sm font-medium text-gray-700 hover:underline">
            Continue as Guest
          </Link>
        </div>
      </div>
    </main>
  );
}