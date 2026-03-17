"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  FileText, 
  Users, 
  LogOut, 
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/LanguageContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { useRouter } from 'next/navigation';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { useAuth } from '@/hooks/useAuth';

export default function MorePage() {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const router = useRouter();

  // Use Supabase hook for user data instead of mock data
  const { business, loading } = useBusiness();
  const { profile } = useBusinessProfile();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('🔓 Signing out...');
      await signOut();
      // Redirect to login page after successful signout
      router.push('/Beezee-App/auth/login');
    } catch (error) {
      console.error('❌ Signout error:', error);
      // Still redirect even if there's an error
      router.push('/Beezee-App/auth/login');
    }
  };

  const handleShareApp = () => {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://beezee.app';
    const shareMessage = t('more.share_app_message', 'Check out BeeZee - the amazing business management app that helps me track sales, inventory, appointments, and more! 🐝\n\nDownload it here: {url}').replace('{url}', appUrl);
    
    // Create WhatsApp share URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const menuSections = [
    {
      title: t('more.business_tools', 'Business Tools'),
      items: [
        {
          icon: FileText,
          label: t('more.reports', 'Reports'),
          description: t('more.reports_description', 'View business reports and analytics'),
          href: `/Beezee-App/app/${country}/${industry}/reports`,
          color: 'text-blue-600 bg-blue-50'
        },
        {
          icon: Settings,
          label: t('more.settings', 'Settings'),
          description: t('more.settings_description', 'Manage your business settings'),
          href: `/Beezee-App/app/${country}/${industry}/settings?from=more`,
          color: 'text-gray-600 bg-gray-50'
        }
      ]
    },
    {
      title: t('more.community_support', 'Community & Support'),
      items: [
        {
          icon: Users,
          label: t('more.beehive_community', 'BeeHive Community'),
          description: t('more.beehive_description', 'Connect with other business owners'),
          href: `/Beezee-App/app/${country}/${industry}/beehive`,
          color: 'text-purple-600 bg-purple-50'
        }
      ]
    }
  ];

  // Debug logging
  useEffect(() => {
    console.log('🔍 More Page Debug:', {
      urlIndustry: industry,
      urlCountry: country,
      businessIndustry: business?.industry,
      businessCountry: business?.country
    });
  }, [industry, country, business]);

  return (
    <div className="scroll-container bg-[var(--bg)]">
      {/* Header */}
      <Header industry={industry} country={country} />

      {/* Main Content - Scrollable */}
      <main className="scroll-content">
        <div className="p-5 max-w-md mx-auto pb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[var(--text-1)] mb-6"
        >
          {t('nav.more', 'More')}
        </motion.h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 border border-[var(--border)] mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-[var(--powder)]/20 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1">
                <div className="font-bold text-[var(--text-1)] text-lg">
                  {profile?.businessName || business?.businessName || 'Business Name'}
                </div>
                <div className="text-sm text-[var(--text-2)] mt-0.5">
                  {'email@example.com'}
                </div>
                <div className="text-sm text-[var(--text-2)]">
                  {profile?.phoneNumber || business?.phone || '+254 700 000 000'}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-[var(--powder)]/20 text-[var(--powder-dark)] font-bold px-2.5 py-1 rounded-lg">
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </span>
                  <span className="text-xs bg-[var(--bg2)] text-[var(--text-2)] font-bold px-2.5 py-1 rounded-lg">
                    {country.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Share App Button */}
            <button
              onClick={handleShareApp}
              className="p-2 rounded-xl bg-[var(--powder)]/10 hover:bg-[var(--powder)]/20 transition-colors group"
              title={t('more.share_app', 'Share App')}
            >
              <Share2 size={18} className="text-[var(--powder-dark)] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            className="mb-6"
          >
            <h2 className="text-sm font-bold text-[var(--text-3)] uppercase tracking-wider mb-3">
              {section.title}
            </h2>
            
            <div className="glass-card rounded-2xl border border-[var(--border)] divide-y divide-[var(--border-soft)]">
              {section.items.map((item, itemIndex) => {
                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                        <item.icon size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--text-1)]">{item.label}</div>
                        <div className="text-sm text-[var(--text-3)]">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-[var(--text-3)]" />
                  </>
                );

                return (item as any).isButton ? (
                  <button
                    key={item.label}
                    onClick={(item as any).onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg2)] transition-colors text-left"
                  >
                    {content}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-[var(--bg2)] transition-colors"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5 rounded-2xl border border-[var(--border)] mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[var(--text-1)]">{t('app.name', 'BeeZee App')}</h3>
            <span className="text-xs bg-[var(--color-success-light)] text-[var(--color-success)] font-bold px-2.5 py-1 rounded-lg">v2.1.0</span>
          </div>
          <div className="space-y-2 text-sm text-[var(--text-2)]">
            <div className="flex items-center gap-2">
              <Building size={16} />
              <span>{t('common.industry', 'Industry')}: {industry.charAt(0).toUpperCase() + industry.slice(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span>{t('common.country', 'Country')}: {country.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{t('more.member_since', 'Member since')}: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </motion.div>

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 border-2 border-[var(--color-danger)]/30 text-[var(--color-danger)] rounded-xl font-bold hover:bg-[var(--color-danger-light)] transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} strokeWidth={2.5} />
            {t('auth.sign_out', 'Sign Out')}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-6 text-sm text-[var(--text-3)]"
        >
          <div className="mb-2">© 2026 {t('app.name', 'BeeZee App')}</div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--powder-dark)] font-medium">{t('footer.privacy', 'Privacy')}</Link>
            <Link href="/terms" className="hover:text-[var(--powder-dark)] font-medium">{t('footer.terms', 'Terms')}</Link>
            <Link href="/help" className="hover:text-[var(--powder-dark)] font-medium">{t('footer.help', 'Help')}</Link>
          </div>
        </motion.div>
          </div>
        </main>

        {/* Bottom Navigation - Fixed */}
        <BottomNav industry={industry} country={country} />
      </div>
  );
}
