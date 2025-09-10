"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import the router hook
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState, FormEvent } from 'react'; // Import FormEvent

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter(); // Initialize the router

  // --- NEW: Function to handle login and redirect ---
  const handleLogin = (event: FormEvent) => {
    event.preventDefault(); // Prevents the form from reloading the page
    
    // In a real application, you would add your authentication logic here.
    // For this MVP, we will simply redirect to the upload page.
    router.push('/upload'); 
  };

  return (
    <div className="flex h-screen w-screen bg-[#111827]">
      {/* Left side: Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/two.jpg')" }}
      ></div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo at the top */}
          <div className="mb-10 text-center text-white">
            <h1 className="text-5xl font-bold">DeepSeq</h1>
          </div>

          {/* Form container */}
          <div className="rounded-lg bg-[#1F2937] p-8 shadow-2xl">
            <h2 className="mb-2 text-2xl font-semibold text-white">Login to your account</h2>
            
            {/* --- MODIFIED: Added onSubmit handler to the form --- */}
            <form className="mt-6 space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="balanika@gmail.com"
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                  <Link href="/forgot-password" legacyBehavior>
                    <a className="text-sm text-blue-400 hover:text-blue-300">Forgot?</a>
                  </Link>
                </div>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {passwordVisible ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit" // This will now trigger the handleLogin function
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Login now
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Don't Have An Account?{' '}
              <Link href="/signup" legacyBehavior>
                <a className="font-medium text-blue-400 hover:text-blue-300">Sign Up</a>
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