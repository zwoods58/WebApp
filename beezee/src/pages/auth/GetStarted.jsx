import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Get Started / Welcome Screen
 * First screen users see - matches design spec
 */
export default function GetStarted() {
  const navigate = useNavigate();

  const features = [
    'Record sales by voice',
    'Scan receipts instantly',
    'Get business insights',
    'Never lose a transaction',
  ];

  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="auth-logo-container">
        <div className="auth-logo">💰</div>
        <h1 className="auth-app-name">FinanceTracker</h1>
      </div>

      {/* Headline */}
      <h2 className="auth-headline">Track your business simply</h2>

      {/* Feature List */}
      <div className="auth-feature-list">
        {features.map((feature, index) => (
          <div key={index} className="auth-feature-item">
            <div className="auth-feature-bullet" />
            <p className="auth-feature-text">{feature}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className="auth-cta-button"
        onClick={() => navigate('/onboarding')}
        aria-label="Get Started Free"
      >
        Get Started Free
        <ArrowRight size={20} />
      </button>

      {/* Sign In Link */}
      <a
        href="/login"
        className="auth-sign-in-link"
        onClick={(e) => {
          e.preventDefault();
          navigate('/login');
        }}
      >
        Already have an account? Sign In
      </a>
    </div>
  );
}




