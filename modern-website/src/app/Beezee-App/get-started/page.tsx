"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, TrendingUp, LogIn, UserPlus } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const features = [
  { 
    icon: TrendingUp, 
    label: 'Track Sales & Expenses',
    desc: 'Record every transaction on the go, even offline.'
  },
  { 
    icon: Shield, 
    label: 'Secure Cloud Sync',
    desc: 'Your data is encrypted and synced across all devices.'
  },
  { 
    icon: Sparkles, 
    label: 'Business Insights',
    desc: 'Smart reports to help you grow your business faster.'
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function GetStartedPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-between"
      style={{
        background: 'radial-gradient(circle at top right, #EEF5FB 0%, #FFFFFF 40%, #F5F9FF 100%)',
        padding: 'env(safe-area-inset-top, 40px) 24px env(safe-area-inset-bottom, 32px)',
      }}
    >
      {/* ── Decorative Background Elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(74,141,184,0.03)_0%,transparent_70%)]" />
      </div>

      {/* ── Header / Logo Section ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center z-10"
      >
        <div className="relative mb-6">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-full bg-blue-500/10 blur-xl"
          />
          <Image
            src="/beezee-icon-192x192.png"
            alt="BeeZee Logo"
            width={96}
            height={96}
            priority
            className="rounded-[24px] shadow-2xl relative border-4 border-white/50"
          />
        </div>
        <h1 className="text-3xl font-black text-[#1A2332] tracking-tight leading-none text-center">
          BeeZee
        </h1>
        <p className="text-sm font-medium text-[#7A8FA5] mt-2 uppercase tracking-widest text-center">
          Your Digital Black Book
        </p>
      </motion.div>

      {/* ── Main Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-[420px] flex flex-col items-center text-center z-10"
      >
        <motion.div variants={itemVariants} className="mb-8 px-4">
          <h2 className="text-[2.2rem] font-black text-[#1A2332] leading-[1.1] tracking-tight mb-4">
            Manage your business <br/>
            <span className="text-[#4A8DB8] bg-clip-text text-transparent bg-gradient-to-r from-[#4A8DB8] to-[#7AAECE]">with ease</span>
          </h2>
          <p className="text-base text-[#4A5F78] leading-relaxed">
            Join thousands of African entrepreneurs taking control of their finances with BeeZee. Simple, fast, and reliable.
          </p>
        </motion.div>

        {/* ── App Mockup / Visual ── */}
        <motion.div 
          variants={itemVariants} 
          className="relative w-full aspect-[4/3] mb-10 overflow-hidden rounded-[32px] shadow-2xl border-4 border-white/80"
          style={{
            background: 'linear-gradient(135deg, #F0F7FF 0%, #FFFFFF 100%)',
          }}
        >
          <Image
            src="/images/mockup.png"
            alt="BeeZee App Mockup"
            fill
            className="object-cover hover:scale-105 transition-transform duration-[2s] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Feature Pills (Side by side scroll or grid) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-2.5 w-full mb-10">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A8DB8] to-[#7AAECE] flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                <Icon size={18} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-[#1A2332]">{label}</h3>
              </div>
              <ArrowRight size={14} className="ml-auto text-[#7A8FA5] opacity-40" />
            </div>
          ))}
        </motion.div>

        {/* ── Call to Actions ── */}
        <motion.div variants={itemVariants} className="w-full flex flex-col gap-4">
          <Link
            href="/Beezee-App/auth/signup"
            id="signup-button"
            className="group flex items-center justify-center gap-3 w-full bg-[#1A2332] text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-xl active:scale-[0.98] transition-all hover:bg-black"
          >
            <UserPlus size={22} />
            Create Free Account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/Beezee-App/auth/login"
            id="login-button"
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#1A2332]/5 text-[#1A2332] font-bold text-lg py-5 px-8 rounded-2xl shadow-sm active:scale-[0.98] transition-all hover:bg-gray-50 uppercase tracking-wide text-sm"
          >
            <LogIn size={20} />
            Log In
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex flex-col items-center gap-4 z-10"
      >
        <p className="text-[0.8rem] text-[#A8B8C8] tracking-tight">
          Already trusted by <span className="text-[#4A8DB8] font-bold">10,000+</span> businesses
        </p>
        <div className="h-[1px] w-12 bg-[#D4E4F7]" />
        <p className="text-[0.7rem] text-[#A8B8C8] font-medium opacity-60">
          Powered by AtarWebb
        </p>
      </motion.div>
    </div>
  );
}
