'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';

// ── Inner component uses useSearchParams — must be inside <Suspense> ──
function ConfirmEmailContent() {
  const params             = useSearchParams();
  const email              = params.get('email') || '';
  const { resendConfirmation } = useSupabaseAuth();
  const { showSuccess, showError } = useToast();
  const [resending, setResending] = useState(false);
  const [resent,    setResent]    = useState(false);

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    const { error } = await resendConfirmation(email);
    if (error) {
      showError('Failed to resend confirmation email. Please try again.');
    } else {
      showSuccess('Confirmation email resent!');
      setResent(true);
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--glass-bg)] border border-[var(--border)] rounded-2xl p-8 text-center shadow-sm">

        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h1 className="text-xl font-bold text-[var(--text-1)] mb-2">Check your email</h1>
        <p className="text-sm text-[var(--text-3)] mb-1">We sent a confirmation link to</p>
        <p className="text-sm font-semibold text-[var(--text-1)] mb-6 break-all">{email}</p>

        <p className="text-xs text-[var(--text-3)] mb-8 leading-relaxed">
          Click the link in that email to activate your account.
          Once confirmed, return here and sign in.
        </p>

        <Link
          href="/Beezee-App/auth/login"
          className="block w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 rounded-xl font-medium text-sm mb-4 text-center"
        >
          Go to Sign In
        </Link>

        <button
          onClick={handleResend}
          disabled={resending || resent}
          className="text-xs text-[var(--text-3)] hover:text-[var(--text-1)] disabled:opacity-50 transition-colors"
        >
          {resent
            ? '✓ Email resent'
            : resending
            ? 'Resending...'
            : "Didn't receive it? Resend email"}
        </button>
      </div>
    </div>
  );
}

// ── Suspense fallback shown while ConfirmEmailContent loads ──
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// ── Default export MUST be the Suspense wrapper ───────────────
// useSearchParams() is inside ConfirmEmailContent which is a child of Suspense.
// This satisfies Next.js 14's static rendering requirement.
export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
