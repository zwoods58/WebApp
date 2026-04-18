"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const features = [
  { icon: TrendingUp, label: 'Track every sale & expense' },
  { icon: Shield, label: 'Secure cloud backup' },
  { icon: Sparkles, label: 'Smart business insights' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] } },
};

export default function GetStartedPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 24px 36px',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #EEF5FB 0%, #FFFFFF 55%, #EAF2FF 100%)',
      }}
    >
      {/* ── Decorative glow blobs ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '-100px', right: '-80px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,141,184,0.16) 0%, transparent 68%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,141,184,0.11) 0%, transparent 68%)',
        }} />
        {/* Centre accent */}
        <div style={{
          position: 'absolute', top: '38%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,141,184,0.05) 0%, transparent 65%)',
        }} />
      </div>

      {/* ── Logo + brand ── */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}
      >
        {/* Pulsing halo behind icon */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <div style={{
            position: 'absolute', inset: '-16px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,141,184,0.22) 0%, transparent 70%)',
            animation: 'ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
          }} />
          <Image
            src="/beezee-icon-192x192.png"
            alt="BeeZee Logo"
            width={88}
            height={88}
            priority
            style={{
              borderRadius: '22px',
              boxShadow: '0 8px 28px rgba(74,141,184,0.25)',
              position: 'relative',
            }}
          />
        </div>

        <h1 style={{
          fontSize: '1.85rem', fontWeight: 800,
          color: 'var(--text-1, #1A2332)',
          letterSpacing: '-0.03em', lineHeight: 1.1,
          textAlign: 'center', margin: 0,
        }}>
          BeeZee
        </h1>
        <p style={{
          fontSize: '0.875rem', color: 'var(--text-3, #7A8FA5)',
          marginTop: '5px', textAlign: 'center',
        }}>
          Your digital black book
        </p>
      </motion.div>

      {/* ── Middle content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          width: '100%', maxWidth: '360px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Headline */}
        <motion.h2
          variants={itemVariants}
          style={{
            fontSize: '1.65rem', fontWeight: 800,
            color: 'var(--text-1, #1A2332)',
            letterSpacing: '-0.03em', lineHeight: 1.2,
            marginBottom: '10px',
          }}
        >
          Manage your business{' '}
          <span style={{ color: 'var(--powder-dark, #4A8DB8)' }}>with ease</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '0.875rem', color: 'var(--text-2, #4A5F78)',
            lineHeight: 1.65, marginBottom: '26px',
          }}
        >
          Join thousands of African entrepreneurs tracking sales,
          expenses &amp; growth — all in one place.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginBottom: '28px' }}
        >
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.80)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(74,141,184,0.18)',
                borderRadius: '14px',
                padding: '11px 16px',
                boxShadow: '0 2px 8px rgba(74,141,184,0.06)',
              }}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--powder-dark, #4A8DB8), var(--powder-mid, #7AAECE))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color="white" />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-1, #1A2332)', textAlign: 'left' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── PRIMARY CTA: Get Started ── */}
        <motion.div variants={itemVariants} style={{ width: '100%' }}>
          <Link
            href="/Beezee-App/auth/signup"
            id="get-started-btn"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', width: '100%',
              background: 'linear-gradient(135deg, var(--powder-dark, #4A8DB8) 0%, var(--powder-mid, #7AAECE) 100%)',
              color: '#ffffff', fontWeight: 700, fontSize: '1.05rem',
              padding: '17px 24px', borderRadius: '18px',
              boxShadow: '0 8px 26px rgba(74,141,184,0.38)',
              textDecoration: 'none', letterSpacing: '-0.01em',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(74,141,184,0.46)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 26px rgba(74,141,184,0.38)';
            }}
          >
            Get Started
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        {/* ── SECONDARY: Already have an account ── */}
        <motion.div variants={itemVariants} style={{ marginTop: '18px' }}>
          <Link
            href="/Beezee-App/auth/login"
            id="login-link"
            style={{
              display: 'inline-block',
              fontSize: '0.85rem',
              color: 'var(--text-3, #7A8FA5)',
              textDecoration: 'none',
              transition: 'color 0.18s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--powder-dark, #4A8DB8)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-3, #7A8FA5)';
            }}
          >
            Already have an account?{' '}
            <span style={{
              color: 'var(--powder-dark, #4A8DB8)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}>
              Login
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{
          fontSize: '0.72rem', color: 'var(--text-4, #A8B8C8)',
          textAlign: 'center', zIndex: 1,
        }}
      >
        Powered by AtarWebb · Free to get started
      </motion.p>
    </div>
  );
}
