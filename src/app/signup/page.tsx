"use client";

import Link from 'next/link';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';

export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#111827]"> {/* Dark background */}
      {/* Left side: Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/three.jpg')" }}
      >
        {/* Back Arrow to Home */}
        <Link href="/" legacyBehavior>
          <a className="absolute top-8 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75">
            <FiArrowLeft size={20} />
          </a>
        </Link>
      </div>

      {/* Right side: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo at the top */}
          <div className="mb-10 text-center text-white">
            <h1 className="text-5xl font-bold">DeepSeq</h1>
          </div>

          {/* Form container */}
          <div className="rounded-lg bg-[#1F2937] p-8 shadow-2xl">
            <h2 className="mb-2 text-2xl font-semibold text-white">Create your account</h2>
            
            <form className="mt-6 space-y-4">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Choose a username"
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    required
                    placeholder="Create a password"
                    className="block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {passwordVisible ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    className="block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {confirmPasswordVisible ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Already Have An Account?{' '}
              <Link href="/login" legacyBehavior>
                <a className="font-medium text-blue-400 hover:text-blue-300">Login</a>
              </Link>
            </p>
          </div>
          
          {/* Logo at the bottom */}
          <div className="mt-8 flex justify-end">
             <svg className="h-6 w-6 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1M12 8c-.112 0-.224.016-.335.035M2.004 15.197a4.5 4.5 0 011.026-.06C6.11 14.885 8.761 14 12 14c3.239 0 5.89.884 8.97.944a4.5 4.5 0 011.026.06l-.412 1.633a9.75 9.75 0 01-18.128 0l-.412-1.633zM12 21c-3.132 0-6.104-.633-8.875-1.761M12 21c3.132 0 6.104-.633 8.875-1.761M12 21v-3"></path></svg>
             <span className="text-md font-bold text-gray-400">DEEPSEQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}