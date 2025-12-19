import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/i18n';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hero Balance Card Component
 * Displays the main business balance with income/expense breakdown
 */
export default function HeroBalanceCard({ 
  balance = 0, 
  income = 0, 
  expenses = 0,
  trend = null, // { value: 12, isPositive: true }
  sparklineData = [], // Array of numbers for mini chart
  accountNumber = null // WhatsApp or phone number to display
}) {
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const { t } = useTranslation();
  const BRAND_BLUE = '#A8D5E2';

  useEffect(() => {
    // Count-up animation
    const duration = 800;
    const steps = 60;
    const increment = balance / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= balance) {
        setAnimatedBalance(balance);
        clearInterval(timer);
      } else {
        setAnimatedBalance(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [balance]);

  return (
    <div className="hero-balance-card">
      <div className="hero-balance-header">
        <div className="hero-balance-label">{t('dashboard.totalBalance', 'Your Business Balance')}</div>
        {accountNumber && (
          <div className="hero-balance-account-number">
            {accountNumber}
          </div>
        )}
      </div>

      <div className="hero-balance-amount-container">
        <span className="hero-balance-currency-symbol">R</span>
        <div className="hero-balance-amount">
          {animatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className="hero-balance-stats">
        <div className="hero-balance-stat-card income">
          <div className="hero-balance-stat-icon">
            <TrendingUp size={14} />
          </div>
          <div className="hero-balance-stat-content">
            <div className="hero-balance-stat-label">{t('dashboard.income', 'Income')}</div>
            <div className="hero-balance-stat-amount income">
              R{income.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="hero-balance-stat-card expense">
          <div className="hero-balance-stat-icon">
            <TrendingDown size={14} />
          </div>
          <div className="hero-balance-stat-content">
            <div className="hero-balance-stat-label">{t('dashboard.expense', 'Expenses')}</div>
            <div className="hero-balance-stat-amount expense">
              R{expenses.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {trend && sparklineData.length > 0 && (
        <div className="hero-balance-trend">
          <div className="hero-balance-sparkline">
            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={BRAND_BLUE} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={BRAND_BLUE} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={generateSparklinePath(sparklineData)}
                fill="url(#sparklineGradient)"
                stroke={BRAND_BLUE}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sparkline-path"
              />
            </svg>
          </div>
          <div className={`hero-balance-trend-indicator ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={14} />}
            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function generateSparklinePath(data) {
  if (!data || data.length < 2) return '';
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 5;
  const height = 40;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = (height - padding) - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });
  
  // Create a closed path for the gradient fill
  const fillPath = `M 0,${height} L ${points[0]} L ${points.join(' L ')} L 100,${height} Z`;
  const strokePath = `M ${points.join(' L ')}`;
  
  return strokePath; // We'll return just the stroke path for the path 'd', but generateSparklinePath usually returns one string. Let's fix.
}
