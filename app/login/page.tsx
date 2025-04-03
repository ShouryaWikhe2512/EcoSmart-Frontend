"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Leaf,
  Recycle,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

interface UserData {
  email: string;
  name: string;
  picture: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    if (error) setError(error);
    if (success) setSuccess("Login successful!");
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);

    // Redirect to backend authentication endpoint
    window.location.href = "http://localhost:8000/auth/google/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#e0e0e0]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Leaf className="w-12 h-12 text-[#2e7d32] animate-pulse" />
                <Recycle className="w-8 h-8 text-[#2e7d32] absolute -bottom-2 -right-2 animate-spin-slow" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#2e7d32] mb-2">
              Sustainable Waste Management
            </h1>
            <p className="text-gray-600">
              Join us in creating a cleaner, greener future
            </p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </motion.div>
          )}

          {/* User Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-[#f8f8f8] rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-[#4a4a4a]">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#f8f8f8] p-4 rounded-lg text-center"
            >
              <Recycle className="w-6 h-6 text-[#2e7d32] mx-auto mb-2" />
              <p className="text-sm text-[#4a4a4a]">Track Waste</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#f8f8f8] p-4 rounded-lg text-center"
            >
              <Shield className="w-6 h-6 text-[#2e7d32] mx-auto mb-2" />
              <p className="text-sm text-[#4a4a4a]">Secure Access</p>
            </motion.div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-[#2e7d32] animate-spin" />
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our</p>
            <p className="mt-1">
              <a href="#" className="text-[#2e7d32] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#2e7d32] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
