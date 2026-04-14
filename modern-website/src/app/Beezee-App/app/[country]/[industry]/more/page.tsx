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
  Crown,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { formatCurrency } from '@/utils/currency';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import SubscriptionModal from '@/components/universal/SubscriptionModal';
import SubscriptionDashboard from '@/components/kyshi/SubscriptionDashboard';
import CountryPaymentProviders from '@/components/kyshi/CountryPaymentProviders';
import { useLanguage } from '@/hooks/LanguageContext';
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
  const [showSubscriptionDashboard, setShowSubscriptionDashboard] = useState(false);
  
  // Payment verification states
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  // Check for payment callback on page load
  useEffect(() => {
    const reference = searchParams.get('trxref') || searchParams.get('reference');
    const paymentStatus = searchParams.get('payment');
    
    console.log('=== PAYMENT CALLBACK DETECTED ===');
    console.log('URL params:', { reference, paymentStatus, verifying });
    console.log('Full URL:', window.location.href);
    
    if (reference && paymentStatus === 'success' && !verifying) {
      console.log('=== STARTING PAYMENT VERIFICATION ===');
      setVerifying(true);
      setVerificationStatus('loading');
      
      const verifyPayment = async (retryCount = 0) => {
        try {
          console.log(`Verification attempt ${retryCount + 1} for reference: ${reference}`);
          
          const response = await fetch('/api/kyshi/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference })
          });
          
          console.log('Verification response status:', response.status);
          const data = await response.json();
          console.log('Verification response data:', data);
          
          if (data.success) {
            console.log('=== PAYMENT VERIFICATION SUCCESS ===');
            setVerificationStatus('success');
            // Remove query params from URL after successful verification
            router.replace(window.location.pathname, { scroll: false });
            
            // Show success message briefly, then refresh to show updated subscription
            setTimeout(() => {
              setVerificationStatus(null);
              console.log('Refreshing page to show updated subscription status...');
              window.location.reload();
            }, 2000);
          } else if (data.requiresRetry && retryCount < 3) {
            console.log('Payment still pending, retrying in 2 seconds...');
            setTimeout(() => verifyPayment(retryCount + 1), 2000);
          } else {
            console.error('=== PAYMENT VERIFICATION FAILED ===', data.message);
            setVerificationStatus('error');
            setTimeout(() => setVerificationStatus(null), 5000);
          }
        } catch (error) {
          console.error('=== VERIFICATION REQUEST FAILED ===', error);
          if (retryCount < 2) {
            console.log('Retrying verification in 2 seconds...');
            setTimeout(() => verifyPayment(retryCount + 1), 2000);
          } else {
            setVerificationStatus('error');
            setTimeout(() => setVerificationStatus(null), 5000);
          }
        }
      };
      
      // Start verification
      verifyPayment();
    }
  }, [searchParams, router, verifying]);

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
        country.toLowerCase() !== 'za' ? {
          icon: Crown,
          label: t('more.subscription', 'Subscription'),
          description: t('more.subscription_description', 'Upgrade to premium features'),
          onClick: () => setShowSubscriptionModal(true),
          color: 'text-teal-600 bg-teal-50'
        } as ButtonMenuItem : null,
        // Add subscription management for mobile money countries
        ['ke', 'gh', 'ci'].includes(country.toLowerCase()) ? {
          icon: Settings,
          label: t('more.manage_subscription', 'Manage Subscription'),
          description: t('more.manage_subscription_description', 'View and manage your mobile money subscription'),
          onClick: () => setShowSubscriptionDashboard(true),
          color: 'text-blue-600 bg-blue-50'
        } as ButtonMenuItem : null
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
    console.log('More Page Debug:', {
      urlIndustry: industry,
      urlCountry: country,
      businessIndustry: business?.industry,
      businessCountry: business?.country,
      businessName: business?.business_name,
      userName: business?.settings?.user_name,
      businessEmail: business?.email,
      businessPhone: business?.phone_number,
      profileName: profile?.businessName,
      profilePhone: profile?.phoneNumber
    });
  }, [industry, country, business, profile]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <Header industry={industry} country={country} />

      {/* Main Content - Dynamic scrolling */}
      <main className="flex-1">
        <div className="p-5 max-w-md mx-auto pb-32">

        {/* Profile Card */}
        <div className="fade-in mt-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-[var(--powder)]/20 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1">
                <div className="font-bold text-[var(--text-1)] text-lg">
                  {business?.settings?.user_name || profile?.businessName || business?.business_name || 'Business Name'}
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--text-2)] mt-0.5">
                  <Mail size={12} />
                  {business?.email || 'email@example.com'}
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--text-2)]">
                  <Phone size={12} />
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
              {section.items.filter(item => item !== null).map((item, itemIndex) => {
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

                // Skip null items (for hidden subscription button)
                if (!item) return null;
                
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
      
      {/* Subscription Modal - Only for Kenya, Ghana, Côte d'Ivoire, and Nigeria */}
      {country.toLowerCase() !== 'za' && (
        <SubscriptionModal 
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          businessEmail="user@example.com"
          onSubscribe={async (identifier: string, paymentMethod: string, country: string, frequency: string, amount: number, provider?: string) => {
            console.log('Subscription initiated:', { identifier, paymentMethod, country, frequency, amount, provider });
            
            try {
              // Map country to plan ID
              const planIdMap: Record<string, string> = {
                'ke': 'plan_ke_weekly',
                'ng': 'plan_ng_weekly', 
                'za': 'plan_za_weekly',
                'gh': 'plan_gh_weekly',
                'ci': 'plan_ci_weekly',
                'ug': 'plan_ug_weekly',
                'rw': 'plan_rw_weekly',
                'tz': 'plan_tz_weekly'
              };
              
              const planId = planIdMap[country.toLowerCase()];
              if (!planId) {
                throw new Error(`No plan found for country: ${country}`);
              }
              
              // Get business email for customer identification
              const businessEmail = 'user@example.com'; // Simplified for now - will be enhanced with real user data
              
              // Call Kyshi API to create subscription
              const response = await fetch('/api/kyshi/subscriptions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  customerEmail: businessEmail,
                  planId: planId,
                  country: country,
                  industry: industry
                })
              });
              
              const result = await response.json();
              
              if (!result.success) {
                throw new Error(result.message || 'Subscription creation failed');
              }
              
              console.log('Kyshi subscription created:', result.subscription);
              
              // If there's an authorization URL, redirect to it for payment
              if (result.subscription?.authorizationUrl) {
                console.log('Redirecting to payment URL:', result.subscription.authorizationUrl);
                window.location.href = result.subscription.authorizationUrl;
              } else {
                console.log('Subscription activated without payment redirect');
                // Close modal and refresh
                setShowSubscriptionModal(false);
              }
              
            } catch (error) {
              console.error('Subscription creation failed:', error);
              throw error;
            }
          }}
        />
      )}
      
      {/* Subscription Dashboard Modal */}
      {showSubscriptionDashboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Subscription Management</h2>
                  <p className="text-blue-100 mt-1">Manage your mobile money subscriptions</p>
                </div>
                <button
                  onClick={() => setShowSubscriptionDashboard(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <SubscriptionDashboard
                userEmail={business?.email || ''}
                countryCode={country.toUpperCase()}
              />
              
              {/* Country Payment Providers */}
              <div className="mt-8">
                <CountryPaymentProviders
                  countryCode={country.toUpperCase()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Verification Status Overlay */}
      {verificationStatus !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            {verificationStatus === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-[var(--powder-dark)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Verifying Payment...</h3>
                <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your subscription.</p>
              </>
            )}
            
            {verificationStatus === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Successful!</h3>
                <p className="text-sm text-gray-500 mt-2">Your subscription is now active.</p>
                <p className="text-xs text-gray-400 mt-3">Refreshing your dashboard...</p>
              </>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Verification Failed</h3>
                <p className="text-sm text-gray-500 mt-2">Unable to verify payment. Please try again or contact support if you were charged.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-[var(--powder-dark)] text-white rounded-lg text-sm font-medium hover:bg-[var(--powder-dark)]/90 transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}