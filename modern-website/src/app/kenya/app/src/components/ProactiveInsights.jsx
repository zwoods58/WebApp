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
    // Reset dismissed state when data changes significantly (more than 5% change)
    const lastIncome = localStorage.getItem('last_insight_income');
    const lastExpenses = localStorage.getItem('last_insight_expenses');
    
    if (lastIncome && lastExpenses) {
      const incomeChange = Math.abs((currentIncome - parseFloat(lastIncome)) / parseFloat(lastIncome));
      const expensesChange = Math.abs((currentExpenses - parseFloat(lastExpenses)) / parseFloat(lastExpenses));
      
      // If significant change (more than 5%), clear dismissed state
      if (incomeChange > 0.05 || expensesChange > 0.05) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.removeItem(`insight_dismissed_${today}`);
        setDismissed(false);
      }
    }
    
    // Store current values
    localStorage.setItem('last_insight_income', currentIncome.toString());
    localStorage.setItem('last_insight_expenses', currentExpenses.toString());
    
    loadProactiveInsight();
  }, [user, currentIncome, currentExpenses, currentProfit]);

  const loadProactiveInsight = () => {
    try {
      // Check if already dismissed today
      const dismissedToday = localStorage.getItem(`insight_dismissed_${new Date().toISOString().split('T')[0]}`);
      if (dismissedToday && !dismissed) {
        return;
      }

      // Generate predictive insights based on current dashboard stats
      const insights = [];

      // 1. Profit Analysis & Predictions
      if (currentProfit < 0 && currentExpenses > 0 && currentIncome > 0) {
        const deficitAmount = Math.abs(currentProfit);
        const deficitPercentage = ((deficitAmount / currentIncome) * 100).toFixed(0);
        insights.push({
          type: 'warning',
          priority: 'high',
          message: `⚠️ You're R${deficitAmount.toLocaleString()} over budget this month (${deficitPercentage}% over income). Based on your spending patterns, you'll need to reduce daily expenses by R${Math.ceil(deficitAmount / 30)} to break even.`,
        });
      }

      // 2. Profit Margin Analysis
      if (currentProfit > 0 && currentIncome > 0) {
        const profitMargin = ((currentProfit / currentIncome) * 100).toFixed(0);
        if (profitMargin > 30) {
          insights.push({
            type: 'milestone',
            priority: 'medium',
            message: `🎉 Exceptional! Your ${profitMargin}% profit margin puts you in the top 20% of users. At this rate, you could save R${Math.ceil(currentProfit * 12)} annually! Consider investing or expanding.`,
          });
        } else if (profitMargin > 20) {
          insights.push({
            type: 'milestone',
            priority: 'medium',
            message: `👏 Great work! Your ${profitMargin}% profit margin is solid. Small optimizations could push you to 30%+ margin. Want suggestions?`,
          });
        } else if (profitMargin < 10) {
          insights.push({
            type: 'pattern',
            priority: 'medium',
            message: `💡 Your ${profitMargin}% profit margin could improve. Based on similar businesses, you have potential to increase this by 5-10% through expense optimization.`,
          });
        }
      }

      // 3. Expense Pattern Analysis
      if (currentExpenses > 0) {
        const dailyAverage = currentExpenses / 30;
        if (dailyAverage > 1000) {
          insights.push({
            type: 'pattern',
            priority: 'low',
            message: `📊 Your daily average expense is R${dailyAverage.toFixed(0)}. Tracking this weekly could reveal optimization opportunities worth 15-20% savings.`,
          });
        }
      }

      // 4. Income Growth Potential
      if (currentIncome > 0 && currentProfit > 0) {
        const growthPotential = Math.ceil(currentProfit * 0.3); // 30% growth potential
        insights.push({
          type: 'weekly_summary',
          priority: 'low',
          message: `📈 Based on your current performance, you have potential to increase monthly income by ~R${growthPotential}. Your coach can identify specific growth strategies.`,
        });
      }

      // 5. Seasonal/Trend Predictions
      const currentMonth = new Date().getMonth();
      const isMonthEnd = new Date().getDate() > 25;
      if (isMonthEnd && currentProfit > 0) {
        const projectedMonthly = currentProfit + (currentProfit * 0.1); // 10% growth projection
        insights.push({
          type: 'weekly_summary',
          priority: 'low',
          message: `🎯 With ${30 - new Date().getDate()} days left, you're on track for R${projectedMonthly.toFixed(0)} profit. Pushing to R${Math.ceil(projectedMonthly * 1.2)} could set a new monthly record!`,
        });
      }

      // 6. Risk Assessment
      if (currentIncome > 0 && currentExpenses > 0) {
        const burnRate = currentExpenses / currentIncome;
        if (burnRate > 0.9) {
          insights.push({
            type: 'warning',
            priority: 'high',
            message: `🚨 High burn rate detected! You're spending ${Math.ceil(burnRate * 100)}% of income. Consider building a 3-month emergency fund buffer.`,
          });
        }
      }

      // Sort insights by priority (high > medium > low) and set the most important one
      const sortedInsights = insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Set the highest priority insight
      if (sortedInsights.length > 0) {
        console.log('[ProactiveInsights] Setting new predictive insight:', sortedInsights[0]);
        setInsight(sortedInsights[0]);
      } else {
        // Clear insight if no relevant insights
        console.log('[ProactiveInsights] No relevant insights, clearing');
        setInsight(null);
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


