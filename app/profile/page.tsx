"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  Shield,
  Leaf,
  Recycle,
  MapPin,
  Activity,
  Calendar,
} from "lucide-react";

interface UserData {
  email: string;
  name: string;
  picture: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("login_message");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2e7d32]"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#e0e0e0]"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#2e7d32] to-[#1b5e20] p-8 text-center relative">
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-white/80 animate-pulse" />
                <Recycle className="w-4 h-4 text-white/80 animate-spin-slow" />
              </div>
            </div>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={user.picture}
                alt={user.name}
                className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-white/80">{user.email}</p>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#f8f8f8] rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-[#2e7d32] mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-[#2e7d32] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-[#2e7d32] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="text-gray-800">Google Account</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#f8f8f8] rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-[#2e7d32] mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => router.push("/report")}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Activity className="w-5 h-5 text-[#2e7d32] mr-3" />
                    <span className="text-[#2e7d32]">Report Waste</span>
                  </button>
                  <button
                    onClick={() => router.push("/waste-deposits")}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <MapPin className="w-5 h-5 text-[#2e7d32] mr-3" />
                    <span className="text-[#2e7d32]">View Waste Deposits</span>
                  </button>
                  {/* Authority Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-[#2e7d32] mb-3">
                      Authority Actions
                    </h3>
                    <button
                      onClick={() => router.push("/authority/pickups")}
                      className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Calendar className="w-5 h-5 text-[#2e7d32] mr-3" />
                      <span className="text-[#2e7d32]">
                        Manage Waste Pickups
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
