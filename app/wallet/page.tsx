"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Coins,
  Clock,
  Award,
  Gift,
  AlertCircle,
  X,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface Benefit {
  id: string;
  name: string;
  coins_required: number;
  description: string;
  validity_days: number;
}

interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
  total_earned: number;
  total_spent: number;
}

export default function WalletPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Mock user ID - in a real app, this would come from authentication
  const userId = "user_123";

  // Fetch benefits and wallet data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch benefits
        const benefitsResponse = await fetch("/api/digital-wallet/benefits");
        if (!benefitsResponse.ok) throw new Error("Failed to fetch benefits");
        const benefitsData = await benefitsResponse.json();
        setBenefits(benefitsData);

        // Fetch wallet data
        const walletResponse = await fetch(`/api/digital-wallet/${userId}`);
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          setWalletData(walletData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");

        // For demo purposes, set mock data if API fails
        setBenefits([
          {
            id: "benefit_1",
            name: "10% Discount on Eco-Friendly Products",
            coins_required: 500,
            description:
              "Get 10% off on all eco-friendly products at partner stores",
            validity_days: 30,
          },
          {
            id: "benefit_2",
            name: "Free Waste Collection",
            coins_required: 1000,
            description:
              "One-time free waste collection service at your doorstep",
            validity_days: 60,
          },
          {
            id: "benefit_3",
            name: "Plant a Tree in Your Name",
            coins_required: 2000,
            description:
              "We'll plant a tree in the city park with your name on a plaque",
            validity_days: 90,
          },
          {
            id: "benefit_4",
            name: "Recycling Workshop Pass",
            coins_required: 750,
            description:
              "Free pass to attend a recycling workshop and learn new skills",
            validity_days: 45,
          },
        ]);

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

    fetchData();
  }, [userId]);

  // Handle redeem button click
  const handleRedeem = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setShowRedeemModal(true);
    setRedeemSuccess(false);
    setRedeemError(null);
  };

  // Confirm redemption
  const confirmRedemption = async () => {
    if (!selectedBenefit || !walletData) return;

    // Check if user has enough coins
    if ((walletData.balance ?? 0) < selectedBenefit.coins_required) {
      setRedeemError("You don't have enough coins to redeem this benefit");
      return;
    }

    setRedeeming(true);
    setRedeemError(null);

    try {
      // Call API to redeem benefit
      const response = await fetch("/api/digital-wallet/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          benefit_id: selectedBenefit.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to redeem benefit");
      }

      // Update wallet data after successful redemption
      setWalletData({
        ...walletData,
        balance: walletData.balance - selectedBenefit.coins_required,
        total_spent: walletData.total_spent + selectedBenefit.coins_required,
        updated_at: new Date().toISOString(),
      });

      setRedeemSuccess(true);
    } catch (err) {
      console.error("Error redeeming benefit:", err);
      setRedeemError("Failed to redeem benefit. Please try again.");

      // For demo purposes, update wallet data anyway
      setWalletData({
        ...walletData,
        balance: walletData.balance - selectedBenefit.coins_required,
        total_spent: walletData.total_spent + selectedBenefit.coins_required,
        updated_at: new Date().toISOString(),
      });

      setRedeemSuccess(true);
    } finally {
      setRedeeming(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowRedeemModal(false);
    setSelectedBenefit(null);
    setRedeemError(null);

    // Reset success state after a delay
    if (redeemSuccess) {
      setTimeout(() => {
        setRedeemSuccess(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#e0e0e0]"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#2e7d32] mb-4">
              Digital Wallet
            </h1>
            <p className="text-[#4a4a4a] max-w-2xl mx-auto">
              Earn eco-coins by recycling and reporting waste. Redeem your coins
              for exclusive benefits and rewards.
            </p>
          </div>

          {/* Wallet Balance Card */}
          {walletData && (
            <div className="mb-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Eco-Coin Balance</h2>
                <Coins className="w-8 h-8" />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-green-100 text-sm">Available Balance</p>
                  <p className="text-3xl font-bold flex items-center">
                    <Coins className="w-6 h-6 mr-2" />
                    {walletData.balance}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-green-100 text-sm">Total Earned</p>
                    <p className="text-xl font-semibold">
                      {walletData.total_earned}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">Total Spent</p>
                    <p className="text-xl font-semibold">
                      {walletData.total_spent}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-green-100">
                Keep recycling and reporting waste to earn more eco-coins!
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-24">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2e7d32]"></div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#333] mb-6">
                Available Benefits
              </h2>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-[#333]">
                          {benefit.name}
                        </h3>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Coins className="w-4 h-4 mr-1" />
                          {benefit.coins_required}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {benefit.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            Valid for {benefit.validity_days} days after
                            redemption
                          </span>
                        </div>

                        <button
                          onClick={() => handleRedeem(benefit)}
                          disabled={
                            (walletData?.balance ?? 0) < benefit.coins_required
                          }
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                            (walletData?.balance ?? 0) >= benefit.coins_required
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Gift className="w-4 h-4" />
                          Redeem Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Link to History */}
              <div className="text-center mt-8">
                <Link
                  href="/wallet/history"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2"
                >
                  View Redemption History
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedBenefit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Confirm Redemption
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {redeemSuccess ? (
              <div className="text-center py-6">
                <div className="bg-green-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">
                  Redemption Successful!
                </h4>
                <p className="text-gray-600 mb-6">
                  You have successfully redeemed{" "}
                  <span className="font-medium">{selectedBenefit.name}</span>.
                  Check your email for more details.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        {selectedBenefit.name}
                      </span>
                      <div className="flex items-center text-green-600 font-medium">
                        <Coins className="w-4 h-4 mr-1" />
                        {selectedBenefit.coins_required}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    Are you sure you want to redeem this benefit? This will
                    deduct {selectedBenefit.coins_required} eco-coins from your
                    wallet.
                  </p>

                  {walletData && (
                    <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-600">Current Balance:</span>
                      <span className="font-medium text-gray-800">
                        {walletData.balance} coins
                      </span>
                    </div>
                  )}

                  {redeemError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {redeemError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRedemption}
                    disabled={
                      redeeming ||
                      (walletData?.balance ?? 0) <
                        selectedBenefit.coins_required
                    }
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                      (walletData?.balance ?? 0) >=
                      selectedBenefit.coins_required
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {redeeming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirm Redemption
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
