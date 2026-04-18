"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Shield, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    label: 'Know your money 💰',
    desc: 'Write down every sale and spend — even when there\'s no internet.',
  },
  {
    icon: Shield,
    label: 'Your info is safe 🔒',
    desc: 'We keep your numbers safe and backed up, always.',
  },
  {
    icon: Sparkles,
    label: 'See how you\'re doing 📊',
    desc: 'Quick summaries that help you spot what\'s working.',
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
  const { isAuthenticated, user, loading } = useUnifiedAuth();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // Handle dashboard redirect
  const goToDashboard = () => {
    if (user) {
      const country = user.country?.toLowerCase() || 'kenya';
      const industry = user.industry?.toLowerCase() || 'retail';
      router.push(`/Beezee-App/app/${country}/${industry}`);
    }
  };

  return (
    // Outer scroll container — overrides the globals.css height:100% body constraint
    <div
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        background: 'radial-gradient(circle at top right, #EEF5FB 0%, #FFFFFF 40%, #F5F9FF 100%)',
        position: 'relative',
      }}
    >
      {/* Decorative Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ overflow: 'hidden' }}
        aria-hidden="true"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      {/* Page content — natural block flow, no justify-between */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-16">

        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center mb-10"
        >
          <div className="relative mb-5">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-full bg-blue-500/10 blur-xl"
            />
            <Image
              src="/beezee-icon-192x192.png"
              alt="BeeZee Logo"
              width={88}
              height={88}
              priority
              className="rounded-[22px] shadow-2xl relative border-4 border-white/50"
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
          className="w-full max-w-[420px] flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.div variants={itemVariants} className="mb-8 px-2">
            <h2 className="text-[2rem] font-black text-[#1A2332] leading-[1.15] tracking-tight mb-4">
              Run your business <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4A8DB8] to-[#7AAECE]">
                without the stress
              </span>
            </h2>
            <p className="text-base text-[#4A5F78] leading-relaxed">
              BeeZee is like your notebook — but smarter. Write down your sales, track what you spend, and always know where your money is going. No accounting skills needed.
            </p>
          </motion.div>

          {/* App Preview */}
          <motion.div
            variants={itemVariants}
            className="relative w-full mb-8"
            style={{
              aspectRatio: '4/3',
              overflow: 'hidden',
              borderRadius: 32,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '4px solid rgba(255,255,255,0.8)',
              background: 'linear-gradient(135deg, #F0F7FF 0%, #FFFFFF 100%)',
            }}
          >
            <Image
              src="/images/mockup.png"
              alt="BeeZee App Preview"
              fill
              className="object-cover hover:scale-105 transition-transform duration-[2s] ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Feature Pills */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-2.5 w-full mb-8">
            {features.map(({ icon: Icon, label }) => (
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

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="w-full flex flex-col gap-4 mb-10">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={goToDashboard}
                  className="group flex items-center justify-center gap-3 w-full bg-[#1A2332] text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-xl active:scale-[0.98] transition-all hover:bg-black"
                >
                  <LayoutDashboard size={22} />
                  Continue to Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex flex-col gap-3 mt-2">
                  <p className="text-xs text-[#7A8FA5] font-semibold uppercase tracking-wider">Account Options</p>
                  <div className="flex gap-3">
                    <Link
                      href="/Beezee-App/auth/login"
                      className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#1A2332] font-bold py-3 px-4 rounded-xl text-xs uppercase"
                    >
                      <LogIn size={16} />
                      Switch Account
                    </Link>
                    <Link
                      href="/Beezee-App/auth/signup"
                      className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#1A2332] font-bold py-3 px-4 rounded-xl text-xs uppercase"
                    >
                      <UserPlus size={16} />
                      New Business
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/Beezee-App/auth/signup"
                  id="signup-button"
                  className="group flex items-center justify-center gap-3 w-full bg-[#1A2332] text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-xl active:scale-[0.98] transition-all hover:bg-black"
                >
                  <UserPlus size={22} />
                  Get Started — It&apos;s Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/Beezee-App/auth/login"
                  id="login-button"
                  className="flex items-center justify-center gap-3 w-full bg-white border-2 border-[#1A2332]/5 text-[#1A2332] font-bold py-5 px-8 rounded-2xl shadow-sm active:scale-[0.98] transition-all hover:bg-gray-50 tracking-wide text-sm uppercase"
                >
                  <LogIn size={20} />
                  I already have an account
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-[0.8rem] text-[#A8B8C8] tracking-tight">
            Loved by <span className="text-[#4A8DB8] font-bold">10,000+</span> business owners
          </p>
          <div className="h-[1px] w-12 bg-[#D4E4F7]" />
          <p className="text-[0.7rem] text-[#A8B8C8] font-medium opacity-60">
            Powered by AtarWebb
          </p>
        </motion.div>

      </div>
    </div>
  );
}
