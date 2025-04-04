"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Settings,
  LogOut,
  Coins,
  Recycle,
  Award,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
  total_earned: number;
  total_spent: number;
}

export default function ProfilePage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - in a real app, this would come from authentication
  const userId = "user_123";

  // Mock user data - in a real app, this would come from the user profile API
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2023",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Passionate about environmental sustainability and waste management. Active participant in community recycling initiatives.",
    stats: {
      reportsSubmitted: 27,
      wasteReported: "156 kg",
      recyclingRate: "78%",
    },
  };

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/digital-wallet/${userId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch wallet data: ${response.status}`);
        }

        const data = await response.json();
        setWalletData(data);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("Failed to load wallet data. Please try again later.");

        // For demo purposes, set mock data if API fails
        setWalletData({
          id: "wallet_123",
          user_id: userId,
          balance: 1500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_earned: 2500,
          total_spent: 1000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#e0e0e0]"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
            <div className="relative">
              <Image
                src={userData.avatar}
                alt={userData.name}
                width={150}
                height={150}
                className="rounded-full border-4 border-white shadow-md"
              />
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {userData.name}
              </h1>
              <p className="text-gray-600 mb-4">{userData.bio}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Email</span>
                  </div>
                  <span className="text-gray-800 font-medium">
                    {userData.email}
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined</span>
                  </div>
                  <span className="text-gray-800 font-medium">
                    {userData.joinDate}
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Location</span>
                  </div>
                  <span className="text-gray-800 font-medium">
                    {userData.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>

              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800 mb-1">
                {userData.stats.reportsSubmitted}
              </span>
              <span className="text-gray-600">Reports Submitted</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800 mb-1">
                {userData.stats.wasteReported}
              </span>
              <span className="text-gray-600">Waste Reported</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800 mb-1">
                {userData.stats.recyclingRate}
              </span>
              <span className="text-gray-600">Recycling Rate</span>
            </div>
          </div>

          {/* Digital Wallet Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Coins className="w-6 h-6 mr-2 text-green-500" />
              Digital Wallet
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              </div>
            ) : walletData ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Eco-Coin Balance</h3>
                    <Coins className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {walletData.balance}
                  </div>
                  <div className="text-green-100">Available Coins</div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-gray-500 text-sm mb-1">
                        Total Earned
                      </div>
                      <div className="flex items-center">
                        <Coins className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-xl font-semibold text-gray-800">
                          {walletData.total_earned}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-gray-500 text-sm mb-1">
                        Total Spent
                      </div>
                      <div className="flex items-center">
                        <Coins className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-xl font-semibold text-gray-800">
                          {walletData.total_spent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Wallet ID: {walletData.id}</span>
                    <span>
                      Last Updated:{" "}
                      {new Date(walletData.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    href="/wallet"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                  >
                    <Coins className="w-4 h-4" />
                    Manage Wallet
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-4">No wallet data found</div>
                <Link
                  href="/wallet/create"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  Create Wallet
                </Link>
              </div>
            )}
          </div>

          {/* Log Out Button */}
          <div className="text-center mt-10">
            <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mx-auto">
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
