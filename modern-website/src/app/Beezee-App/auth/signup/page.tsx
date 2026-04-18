"use client";

import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Briefcase, Globe, Target, Building, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { industries } from '@/data/industries';

const countries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'CI', name: "Cote d'Ivoire", flag: '🇨🇮' }
];

export default function Signup() {
  const { signUp } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    industry: '',
    country: '',
    dailyTarget: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        businessName: formData.businessName,
        country: formData.country,
        industry: formData.industry,
        dailyTarget: formData.dailyTarget ? Number(formData.dailyTarget) : undefined
      });

      if (result.error) {
        showError(result.error.message || "Signup failed");
      } else {
        showSuccess('Account created successfully! Welcome to BeeZee.');
        
        // Store user data in case it's needed for caching or context
        const userData = {
          country: formData.country,
          industry: formData.industry,
          businessName: formData.businessName,
          firstName: formData.firstName,
        };
        localStorage.setItem('beezee_user_data', JSON.stringify(userData));
        
        // Route them directly to the home page dashboard
        const c = formData.country.toLowerCase() || 'kenya';
        const i = formData.industry.toLowerCase() || 'retail';
        router.push(`/Beezee-App/app/${c}/${i}`);
      }
    } catch (error) {
      showError('An unexpected error occurred during signup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[var(--bg)] px-4 py-8 sm:px-6 pb-20">
      <div className="w-full max-w-md mx-auto mt-4 sm:mt-10">
        <div className="text-center mb-6 fade-in">
          <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Create an Account</h1>
          <p className="text-[var(--text-3)] text-xs">Join BeeZee to manage your business</p>
        </div>

        <div className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><User size={14} /> First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="John" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><User size={14} /> Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Phone size={14} /> Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="+254712345678" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Mail size={14} /> Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="john@example.com" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Lock size={14} /> Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2.5 pr-10 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Lock size={14} /> Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-3 py-2.5 pr-10 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Building size={14} /> Business Name</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="Your Business Ltd." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Globe size={14} /> Country</label>
                <select name="country" value={formData.country} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all appearance-none">
                  <option value="">Select country...</option>
                  {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
                <div className="absolute right-3 top-9 pointer-events-none text-[var(--text-3)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div className="relative">
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Briefcase size={14} /> Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all appearance-none">
                  <option value="">Select industry...</option>
                  {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <div className="absolute right-3 top-9 pointer-events-none text-[var(--text-3)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5"><Target size={14} /> Daily Target (Optional)</label>
              <input type="number" name="dailyTarget" value={formData.dailyTarget} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg text-[var(--text-1)] placeholder-[var(--text-3)] text-sm focus:ring-2 focus:ring-[var(--powder-dark)] outline-none transition-all" placeholder="e.g. 500" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium disabled:opacity-50 text-sm mt-6">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Sign Up'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
