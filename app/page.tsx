"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Features from "@/components/Features";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with paper texture */}
        <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-10" />

        {/* Watercolor eco-themed background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] opacity-90" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-[#2e7d32] mb-6">
              Empowering India with AI-Driven Sustainability
            </h1>
            <p className="text-xl md:text-2xl text-[#4a4a4a] mb-8 max-w-3xl mx-auto">
              Join us in revolutionizing waste management with AI-driven
              insights and community-powered solutions. Let's build a cleaner,
              greener India together.
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2e7d32] text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#EFF4EF] text-[#4a4a4a] px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                See How It Works
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Floating eco elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4"
        >
          <Image src="/leaf1.png" alt="Leaf" width={50} height={50} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Features Section */}
      <Features />

      {/* Final CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/india-map.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2e7d32] mb-6">
              स्वच्छ भारत - AI के साथ
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-[#2e7d32] mb-8">
              Towards a Cleaner Future
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2e7d32] text-white px-8 py-4 rounded-full text-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Join the Movement
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
