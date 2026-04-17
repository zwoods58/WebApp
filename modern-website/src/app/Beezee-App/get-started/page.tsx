"use client";

import React from 'react';
import { ArrowRight, UserPlus, LogIn, TrendingUp, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GetStarted() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[var(--glass-bg)] to-[var(--bg)] text-[var(--text-1)]">
      {/* Header */}
      <div className="container mx-auto px-6 pt-8 pb-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--powder-light)]/20 px-4 py-2 rounded-full mb-6">
            <TrendingUp size={16} className="text-[var(--powder-dark)]" />
            <span className="text-sm font-medium text-[var(--powder-dark)]">BeeZee Finance</span>
          </div>
          
          <h1 className="text-4xl font-bold text-[var(--text-1)] mb-4">
            Welcome to BeeZee
          </h1>
          
          <p className="text-xl text-[var(--text-2)] mb-8 max-w-2xl mx-auto">
            The simple way for African entrepreneurs to manage their business finances
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[var(--powder-light)]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe size={24} className="text-[var(--powder-dark)]" />
            </div>
            <h3 className="font-semibold text-[var(--text-1)] mb-2">Multi-Country</h3>
            <p className="text-sm text-[var(--text-2)]">Support for Kenya, Nigeria, Ghana, South Africa and more</p>
          </div>
          
          <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[var(--powder-light)]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-[var(--powder-dark)]" />
            </div>
            <h3 className="font-semibold text-[var(--text-1)] mb-2">Secure</h3>
            <p className="text-sm text-[var(--text-2)]">Bank-level security for your business data</p>
          </div>
          
          <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[var(--powder-light)]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-[var(--powder-dark)]" />
            </div>
            <h3 className="font-semibold text-[var(--text-1)] mb-2">Growth Focused</h3>
            <p className="text-sm text-[var(--text-2)]">Tools to help you track and grow your business</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--text-1)] text-center mb-8">
            How would you like to get started?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Account Card */}
            <Link 
              href="/Beezee-App/auth/signup"
              className="group bg-gradient-to-br from-[var(--powder-light)]/20 to-[var(--powder-mid)]/20 border border-[var(--powder-mid)]/30 rounded-2xl p-8 hover:shadow-xl hover:shadow-[var(--powder-mid)]/20 transition-all duration-300 hover:scale-[1.02] block"
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 bg-[var(--powder-dark)]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--powder-dark)]/30 transition-colors">
                  <UserPlus size={32} className="text-[var(--powder-dark)]" />
                </div>
                
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-3">
                  Create New Account
                </h3>
                
                <p className="text-[var(--text-2)] mb-6 flex-1">
                  Join thousands of African entrepreneurs and start managing your business finances today.
                </p>
                
                <div className="flex items-center gap-2 text-[var(--powder-dark)] font-semibold group-hover:gap-3 transition-all">
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Login Card */}
            <Link 
              href="/Beezee-App/auth/login"
              className="group bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-8 hover:shadow-xl hover:shadow-[var(--border)]/20 transition-all duration-300 hover:scale-[1.02] block"
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--powder-light)]/10 transition-colors">
                  <LogIn size={32} className="text-[var(--text-1)]" />
                </div>
                
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-3">
                  Sign In
                </h3>
                
                <p className="text-[var(--text-2)] mb-6 flex-1">
                  Welcome back! Sign in to your existing BeeZee account to continue managing your business.
                </p>
                
                <div className="flex items-center gap-2 text-[var(--text-1)] font-semibold group-hover:gap-3 transition-all">
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--text-3)] text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
