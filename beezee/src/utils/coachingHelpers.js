// Coaching Helper Functions
// Context building and conversation management

import { supabase } from './supabase';
import { format, subDays, startOfMonth } from 'date-fns';

/**
 * Get user's business context for coaching
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User context
 */
export async function getCoachingContext(userId) {
  try {
    // Get user info
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // Get all transactions
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!allTransactions || allTransactions.length === 0) {
      return {
        user_name: userData?.phone_number || 'there',
        transaction_count: 0,
        avg_daily_income: 0,
        avg_daily_expenses: 0,
        top_expense_category: 'None yet',
        top_income_category: 'None yet',
        trend: 'No data',
        current_month_profit: 0,
        recent_transactions: [],
      };
    }

    // Calculate metrics
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculate daily averages (last 30 days)
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const recentTransactions = allTransactions.filter(
      t => t.date >= thirtyDaysAgo
    );

    const daysWithData = new Set(recentTransactions.map(t => t.date)).size || 1;

    const avgDailyIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) / daysWithData;

    const avgDailyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) / daysWithData;

    // Find top categories
    const expensesByCategory = {};
    const incomeByCategory = {};

    allTransactions.forEach(t => {
      if (t.type === 'expense') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + parseFloat(t.amount);
      } else {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

    const topIncomeCategory = Object.entries(incomeByCategory)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

    // Calculate trend (last 7 days vs previous 7 days)
    const last7Days = allTransactions.filter(
      t => t.date >= format(subDays(new Date(), 7), 'yyyy-MM-dd')
    );
    const previous7Days = allTransactions.filter(
      t => t.date >= format(subDays(new Date(), 14), 'yyyy-MM-dd') &&
           t.date < format(subDays(new Date(), 7), 'yyyy-MM-dd')
    );

    const last7Profit = last7Days
      .reduce((sum, t) => sum + (t.type === 'income' ? 1 : -1) * parseFloat(t.amount), 0);

    const previous7Profit = previous7Days
      .reduce((sum, t) => sum + (t.type === 'income' ? 1 : -1) * parseFloat(t.amount), 0);

    let trend = 'stable';
    if (last7Profit > previous7Profit * 1.1) trend = 'growing';
    if (last7Profit < previous7Profit * 0.9) trend = 'declining';

    // Current month profit
    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const monthTransactions = allTransactions.filter(t => t.date >= monthStart);
    
    const currentMonthProfit = monthTransactions.reduce(
      (sum, t) => sum + (t.type === 'income' ? 1 : -1) * parseFloat(t.amount),
      0
    );

    // Format recent transactions
    const recentFormatted = allTransactions.slice(0, 10).map(t => ({
      date: t.date,
      type: t.type,
      amount: parseFloat(t.amount),
      category: t.category,
      description: t.description,
    }));

    return {
      user_name: userData?.phone_number?.slice(-4) || 'there',
      transaction_count: allTransactions.length,
      avg_daily_income: avgDailyIncome,
      avg_daily_expenses: avgDailyExpenses,
      top_expense_category: topExpenseCategory,
      top_income_category: topIncomeCategory,
      trend,
      current_month_profit: currentMonthProfit,
      recent_transactions: recentFormatted,
      total_income: totalIncome,
      total_expenses: totalExpenses,
    };
  } catch (error) {
    console.error('Error getting coaching context:', error);
    return null;
  }
}

/**
 * Save coaching conversation
 * @param {string} userId - User ID
 * @param {string} question - User question
 * @param {string} answer - Coach answer
 * @param {Object} context - User context
 */
export async function saveConversation(userId, question, answer, context) {
  try {
    await supabase.from('coaching_sessions').insert({
      user_id: userId,
      question,
      answer,
      context,
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

/**
 * Clear conversation history
 * @param {string} userId - User ID
 */
export async function clearConversationHistory(userId) {
  try {
    await supabase
      .from('coaching_sessions')
      .delete()
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error clearing conversation:', error);
    throw error;
  }
}

/**
 * Check if user should receive proactive insight
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Insight or null
 */
export async function checkForProactiveInsights(userId) {
  try {
    const context = await getCoachingContext(userId);
    if (!context) return null;

    const insights = [];

    // Weekly summary (every Monday)
    const today = new Date();
    if (today.getDay() === 1) { // Monday
      insights.push({
        type: 'weekly_summary',
        message: `Your week in numbers: R${context.current_month_profit.toFixed(0)} profit this month from ${context.transaction_count} transactions. ${
          context.trend === 'growing' ? 'Things are looking up! 📈' : 
          context.trend === 'declining' ? 'Let\'s talk about turning things around.' :
          'Keep up the good work! 💪'
        }`,
      });
    }

    // Milestone: 100 transactions
    if (context.transaction_count === 100) {
      insights.push({
        type: 'milestone',
        message: '🎉 Congrats! You\'ve recorded 100 transactions! You\'re building great financial habits.',
      });
    }

    // Warning: Expenses higher than income
    if (context.current_month_profit < 0) {
      insights.push({
        type: 'warning',
        message: `⚠️ Your expenses (R${context.total_expenses.toFixed(0)}) were higher than your income (R${context.total_income.toFixed(0)}) this month. Want to look at where the money went?`,
      });
    }

    // Pattern: Declining trend
    if (context.trend === 'declining') {
      insights.push({
        type: 'pattern',
        message: `I noticed your sales have been declining lately. Let's talk about what might be causing this and how to turn it around.`,
      });
    }

    return insights[0] || null;
  } catch (error) {
    console.error('Error checking for insights:', error);
    return null;
  }
}

/**
 * Get conversation history for context
 * @param {string} userId - User ID
 * @param {number} limit - Number of recent messages
 * @returns {Promise<Array>} Recent conversations
 */
export async function getConversationHistory(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .select('question, answer')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting conversation history:', error);
    return [];
  }
}

/**
 * Format context for Gemini prompt
 * @param {Object} context - User context
 * @param {Array} history - Conversation history
 * @returns {string} Formatted context
 */
export function formatContextForPrompt(context, history = []) {
  if (!context) {
    return 'No transaction data available yet. Encourage the user to start recording transactions.';
  }

  const historyText = history.length > 0
    ? `\n\nRecent conversation:\n${history.map(h => `User: ${h.question}\nYou: ${h.answer}`).join('\n\n')}`
    : '';

  const recentTxText = context.recent_transactions.slice(0, 5)
    .map(t => `${t.date}: ${t.type === 'income' ? '+' : '-'}R${t.amount} (${t.category}) - ${t.description}`)
    .join('\n');

  return `User's Business Summary:
- Total transactions: ${context.transaction_count}
- Average daily income: R${context.avg_daily_income.toFixed(2)}
- Average daily expenses: R${context.avg_daily_expenses.toFixed(2)}
- Most common expense: ${context.top_expense_category}
- Most common income source: ${context.top_income_category}
- Recent trend: ${context.trend}
- Current month profit: R${context.current_month_profit.toFixed(2)}

Recent Transactions:
${recentTxText}${historyText}`;
}


