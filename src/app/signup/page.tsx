'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { FiEye, FiFiEyeOff } from 'react-icons/fi'; // Corrected import for FiEyeOff

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // NEW: State for confirm password
  const [userType, setUserType] = useState(''); // NEW: State for user type selection
  const router = useRouter();

  // Function to handle sign up (for now, just navigates to landing)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle user registration here.
    // For now, let's navigate to the landing page.
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
            JOIN POCKET PAUSE
          </h1>

          <form onSubmit={handleSignUp}>
            {/* Mobile Number Field (Same as Login) */}
            <div className="mb-4">
              <label htmlFor="mobile" className="mb-1 block text-sm text-gray-700">Enter your mobile number</label>
              <div className="flex items-center rounded-md bg-gray-200/50 p-2.5">
                <span className="border-r border-gray-400 pr-3 text-gray-600">+91</span>
                <input
                  type="tel"
                  id="mobile"
                  placeholder="1712345678"
                  className="w-full bg-transparent pl-3 text-gray-800 placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field (Same as Login) */}
            <div className="mb-4"> {/* Changed from mb-2 to mb-4 for spacing */}
              <label htmlFor="password" className="mb-1 block text-sm text-gray-700">Create Password</label>
              <div className="relative flex items-center rounded-md bg-gray-200/50 p-2.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="**********"
                  className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                  required
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

            {/* NEW: Confirm Password Field */}
            <div className="mb-6"> {/* Increased margin bottom */}
              <label htmlFor="confirmPassword" className="mb-1 block text-sm text-gray-700">Confirm Password</label>
              <div className="relative flex items-center rounded-md bg-gray-200/50 p-2.5">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="**********"
                  className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* NEW: User Type Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-700">Describe yourself as:</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={userType === 'student'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="form-radio h-4 w-4 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-gray-700">Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="professional"
                    checked={userType === 'professional'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="form-radio h-4 w-4 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-gray-700">Professional</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-black py-3 text-lg font-semibold text-white transition hover:bg-gray-800"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{' '}
            <Link href="/" className="font-semibold hover:underline">
              Sign In
            </Link>
          </p>
          
          <div className="my-6 text-center text-sm text-gray-600">
            or
          </div>

          <div className="space-y-3">
             {/* Social logins for consistency, though usually not on signup forms as primary action */}
            <button
              onClick={() => router.push('/upload')}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white/80 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50">
              <FaGoogle /> Sign Up with Google
            </button>
            <button
              onClick={() => router.push('/upload')}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white/80 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50">
              <FaApple /> Sign Up with Apple
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}