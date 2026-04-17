"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function AuthGateway() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[var(--powder-dark)]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-[var(--powder-dark)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
            Welcome to BeeZee
          </h1>
          <p className="text-[var(--text-3)] text-sm">
            Manage your business with ease
          </p>
        </div>

        {/* Auth Options */}
        <div className="space-y-4">
          {/* Login Button */}
          <Link
            href="/Beezee-App/auth/login"
            className="block w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-4 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium text-sm flex items-center justify-center gap-3 group"
          >
            <Lock size={20} />
            Sign In to Your Account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Signup Button */}
          <Link
            href="/Beezee-App/auth/signup"
            className="block w-full bg-[var(--glass-bg)] border border-[var(--border)] text-[var(--text-1)] py-4 px-6 rounded-xl hover:bg-[var(--glass-bg)]/80 hover:border-[var(--powder-mid)] transition-all font-medium text-sm flex items-center justify-center gap-3 group"
          >
            <Mail size={20} />
            Create Your Business Account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-[var(--text-3)] text-xs">
            Join thousands of African entrepreneurs growing their business with BeeZee
          </p>
        </div>
      </motion.div>
    </div>
  );
}
