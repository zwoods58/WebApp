"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function AuthGateway() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to BeeZee
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your business with ease
          </p>
        </div>

        {/* Auth Options */}
        <div className="space-y-4">
          {/* Login Button */}
          <Link
            href="/Beezee-App/auth/login"
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all font-medium text-sm flex items-center justify-center gap-3 group"
          >
            <Lock size={20} />
            Sign In to Your Account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Signup Button */}
          <Link
            href="/Beezee-App/auth/signup"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-4 px-6 rounded-xl hover:bg-gray-200 hover:border-blue-400 transition-all font-medium text-sm flex items-center justify-center gap-3 group"
          >
            <Mail size={20} />
            Create Your Business Account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Join thousands of African entrepreneurs growing their business with BeeZee
          </p>
        </div>
      </motion.div>
    </div>
  );
}
