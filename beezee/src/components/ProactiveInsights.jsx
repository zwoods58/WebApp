import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProactiveInsights({ currentIncome = 0, currentExpenses = 0, currentProfit = 0 }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadProactiveInsight();
  }, [user, currentIncome, currentExpenses, currentProfit]);

  const loadProactiveInsight = () => {
    try {
      // Check if already dismissed today
      const dismissedToday = localStorage.getItem(`insight_dismissed_${new Date().toISOString().split('T')[0]}`);
      if (dismissedToday) {
        return;
      }

      // Generate insight based on current dashboard stats
      const insights = [];

      // Warning: Expenses higher than income
      if (currentProfit < 0 && currentExpenses > 0 && currentIncome > 0) {
        insights.push({
          type: 'warning',
          message: `⚠️ Your expenses (R${currentExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}) were higher than your income (R${currentIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}) this month. Want to look at where the money went?`,
        });
      }

      // Positive: Good profit
      if (currentProfit > 0 && currentIncome > 0) {
        const profitMargin = ((currentProfit / currentIncome) * 100).toFixed(0);
        if (profitMargin > 20) {
          insights.push({
            type: 'milestone',
            message: `🎉 Great work! You're making a ${profitMargin}% profit margin this month. That's excellent! Keep it up! 💪`,
          });
        }
      }

      // Set the first relevant insight
      if (insights.length > 0) {
        setInsight(insights[0]);
      }
    } catch (error) {
      console.error('Error loading proactive insight:', error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Mark as dismissed for today
    localStorage.setItem(
      `insight_dismissed_${new Date().toISOString().split('T')[0]}`,
      'true'
    );
  };

  const handleViewCoach = () => {
    navigate('/dashboard/coach');
  };

  if (!insight || dismissed) {
    return null;
  }

  const typeStyles = {
    weekly_summary: 'bg-primary-50 border-primary-300',
    milestone: 'bg-green-50 border-green-300',
    warning: 'bg-yellow-50 border-yellow-300',
    pattern: 'bg-blue-50 border-blue-300',
  };

  const style = typeStyles[insight.type] || 'bg-gray-50 border-gray-300';

  return (
    <div className={`card ${style} border-2 relative animate-slideIn`}>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-white" size={20} />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Your Coach Says:
          </p>
          <p className="text-gray-800 whitespace-pre-wrap mb-3">
            {insight.message}
          </p>
          
          <button
            onClick={handleViewCoach}
            className="text-primary-600 text-sm font-medium hover:text-primary-700"
          >
            Chat with your coach →
          </button>
        </div>
      </div>
    </div>
  );
}


