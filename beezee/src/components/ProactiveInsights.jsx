import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { checkForProactiveInsights } from '../utils/coachingHelpers';
import { Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProactiveInsights() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadProactiveInsight();
  }, [user]);

  const loadProactiveInsight = async () => {
    try {
      // Check if already dismissed today
      const dismissedToday = localStorage.getItem(`insight_dismissed_${new Date().toISOString().split('T')[0]}`);
      if (dismissedToday) {
        return;
      }

      const proactiveInsight = await checkForProactiveInsights(user.id);
      
      if (proactiveInsight) {
        setInsight(proactiveInsight);
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


