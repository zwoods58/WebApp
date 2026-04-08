"use client";

import React, { useState, useEffect } from 'react';
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
  Share2,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import SubscriptionModal from '@/components/universal/SubscriptionModal';
import { useLanguage } from '@/hooks/LanguageContext';
import { useRouter } from 'next/navigation';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useServiceWorkerVersion } from '@/hooks/useServiceWorkerVersion';

// Type definitions for menu items
interface BaseMenuItem {
  icon: any;
  label: string;
  description: string;
  color: string;
}

interface LinkMenuItem extends BaseMenuItem {
  href: string;
  isButton?: false;
}

interface ButtonMenuItem extends BaseMenuItem {
  onClick: () => void;
  isButton: true;
}

type MenuItem = LinkMenuItem | ButtonMenuItem;

export default function MorePage() {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const router = useRouter();

  const { business, loading, signOut } = useUnifiedAuth();
  const { profile } = useBusinessProfile();
  const { version, isLoading: versionLoading } = useServiceWorkerVersion();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleSignOut = async () => {
    try {
      console.log('🔓 Signing out...');
      await signOut();
      // Redirect to login page after successful signout
      if (navigator.onLine) {
        router.push('/Beezee-App/auth/login');
      } else {
        console.log('🔌 Offline - signout successful but staying on page');
      }
    } catch (error) {
      console.error('❌ Signout error:', error);
      // Still redirect even if there's an error
      if (navigator.onLine) {
        router.push('/Beezee-App/auth/login');
      }
    }
  };

  const handleShareApp = async () => {
    const appUrl = 'https://atarwebb.com/Beezee-App/auth/signup';
    const shareMessage = t('more.share_app_message', '🐝 Check out BeeZee - The amazing business management app!\n\n📊 Track sales & inventory\n📅 Manage appointments\n💰 Monitor finances\n📈 Business analytics\n\n👉 Download here: {url}\n\nTransform your business today! 🚀').replace('{url}', appUrl);
    
    // Try native Web Share API first (for mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BeeZee - Business Management App',
          text: shareMessage,
          url: appUrl
        });
        return;
      } catch (error) {
        console.log('Native share failed, falling back to WhatsApp');
      }
    }
    
    // Fallback to WhatsApp
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
        } as LinkMenuItem,
        {
          icon: Settings,
          label: t('more.settings', 'Settings'),
          description: t('more.settings_description', 'Manage your business settings'),
          href: `/Beezee-App/app/${country}/${industry}/settings?from=more`,
          color: 'text-gray-600 bg-gray-50'
        } as LinkMenuItem,
        {
          icon: Crown,
          label: t('more.subscription', 'Subscription'),
          description: t('more.subscription_description', 'Upgrade to premium features'),
          onClick: () => setShowSubscriptionModal(true),
          color: 'text-teal-600 bg-teal-50'
        } as ButtonMenuItem
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
        } as LinkMenuItem
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
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <Header industry={industry} country={country} />

      {/* Main Content - Dynamic scrolling */}
      <main className="flex-1">
        <div className="p-5 max-w-md mx-auto pb-32">
        <h1 className="text-2xl font-bold text-[var(--text-1)] mb-6 spring-enter">
          {t('nav.more', 'More')}
        </h1>

        {/* Profile Card */}
        <div className="fade-in mt-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-[var(--powder)]/20 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1">
                <div className="font-bold text-[var(--text-1)] text-lg">
                  {profile?.businessName || business?.business_name || 'Business Name'}
                </div>
                <div className="text-sm text-[var(--text-2)] mt-0.5">
                  {'email@example.com'}
                </div>
                <div className="text-sm text-[var(--text-2)]">
                  {profile?.phoneNumber || business?.phone_number || '+254 700 000 000'}
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
        </div>

        {/* Menu Sections */}
        <div className="mt-8">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="fade-in mb-6">
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

                // Render based on menu item type
                if ('href' in item) {
                  // LinkMenuItem
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between p-4 hover:bg-[var(--bg2)] transition-colors"
                    >
                      {content}
                    </Link>
                  );
                } else {
                  // ButtonMenuItem
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="flex items-center justify-between p-4 hover:bg-[var(--bg2)] transition-colors w-full text-left"
                    >
                      {content}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        ))}
        </div>

        {/* App Info */}
        <div className="fade-in mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[var(--text-1)]">{t('app.name', 'BeeZee App')}</h3>
            <span className="text-xs bg-[var(--color-success-light)] text-[var(--color-success)] font-bold px-2.5 py-1 rounded-lg">
              {versionLoading ? 'Loading...' : version}
            </span>
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
        </div>

        {/* Sign Out Button */}
        <div className="fade-in mt-8">
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 border-2 border-[var(--color-danger)]/30 text-[var(--color-danger)] rounded-xl font-bold hover:bg-[var(--color-danger-light)] transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} strokeWidth={2.5} />
            {t('auth.sign_out', 'Sign Out')}
          </button>
        </div>

        {/* Footer */}
        <div className="fade-in mt-8">
          <div className="mb-2">© 2026 {t('app.name', 'BeeZee App')}</div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--powder-dark)] font-medium">{t('footer.privacy', 'Privacy')}</Link>
            <Link href="/terms" className="hover:text-[var(--powder-dark)] font-medium">{t('footer.terms', 'Terms')}</Link>
            <Link href="/help" className="hover:text-[var(--powder-dark)] font-medium">{t('footer.help', 'Help')}</Link>
          </div>
        </div>
        </div>
      </main>

      {/* Bottom Navigation - Fixed */}
      <BottomNav industry={industry} country={country} />
      
      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        businessEmail="user@example.com"
      />
    </div>
  );
}