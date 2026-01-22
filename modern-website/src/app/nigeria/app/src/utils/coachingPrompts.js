// Coaching Prompts and Templates
// Suggested questions and quick tips

export const SUGGESTED_QUESTIONS = [
  "How is my business doing?",
  "Where is my money going?",
  "How can I make more profit?",
  "Should I increase my prices?",
  "How can I save money?",
  "What should I focus on this week?",
  "Is my spending normal?",
  "How do I grow my business?",
  "What are my best-selling items?",
  "Am I spending too much on transport?",
];

export const QUICK_TIPS = [
  "Record every sale immediately - small amounts add up!",
  "Check your reports weekly to spot trends early.",
  "Keep receipts and scan them for accurate records.",
  "Compare your monthly profits to see growth over time.",
  "Ask about specific categories to get detailed advice.",
  "Your top expense category might have cost-saving opportunities.",
  "Consistent daily income is better than big, irregular sales.",
  "Build an emergency fund with 10% of your profits.",
  "Review your prices regularly - don't undersell yourself!",
  "Track seasonal patterns to prepare for slow months.",
];

export const SYSTEM_PROMPT = `You are a financial coach for South African informal business owners.

Your role:
- Give practical, specific advice based on THEIR actual transaction data
- Use simple, conversational South African English
- Be encouraging and supportive like a mentor
- Suggest realistic actions they can take this week
- Flag concerning patterns gently
- Celebrate improvements enthusiastically
- Reference their actual numbers and categories

Language guidelines:
- Say "money you made" not "revenue"
- Say "money you spent" not "expenditure"
- Say "profit" not "net income"
- Use "R" for Rand amounts
- Be conversational: "Well done!", "Let's look at...", "I noticed..."
- Use emojis sparingly but appropriately (👍 😊 💰 📈 ⚠️)

Response format:
- Keep responses under 100 words unless complex explanation needed
- Start with a direct answer to their question
- Reference their actual data with specific numbers
- Give 1-2 actionable suggestions
- End with encouragement

Safety:
- Never give specific investment advice
- Don't comment on politics or macroeconomic policy
- For tax, legal, or debt issues, suggest professional help
- Don't make promises or guarantees

Cultural awareness:
- Understand cash-based informal economy
- Recognize seasonal income fluctuations
- Be sensitive to economic challenges in SA
- Celebrate small wins - every rand counts`;

export const PROACTIVE_INSIGHT_TEMPLATES = {
  weekly_summary: (context) => `
Your week in numbers:
💰 Made: R${context.total_income.toFixed(0)}
💸 Spent: R${context.total_expenses.toFixed(0)}
${context.current_month_profit >= 0 ? '✅' : '⚠️'} Profit: R${Math.abs(context.current_month_profit).toFixed(0)}

${context.trend === 'growing' ? 'Things are looking up! 📈' : 
  context.trend === 'declining' ? 'Let\'s work on turning things around.' :
  'Keep up the good work! 💪'}
  `.trim(),

  milestone_100: () => `
🎉 Congrats! You've recorded 100 transactions!

You're building great financial habits. Businesses that track their numbers grow faster.

Keep it up! Want to see how you're doing overall?
  `.trim(),

  milestone_1000: () => `
🏆 WOW! 1,000 transactions recorded!

You're serious about your business. That's the mindset of successful entrepreneurs.

Let's make sure all this hard work is paying off - want me to analyze your profits?
  `.trim(),

  expense_warning: (context) => `
⚠️ Heads up:

Your expenses (R${context.total_expenses.toFixed(0)}) were higher than your income (R${context.total_income.toFixed(0)}) this month.

Let's look at where the money went and find areas to cut back. Want to discuss?
  `.trim(),

  declining_trend: (context) => `
I noticed your sales have been declining lately.

Common causes: seasonal changes, competition, or pricing issues.

Let's figure out what's happening and create a plan to turn it around. Ready?
  `.trim(),

  transport_spike: (amount) => `
💡 I noticed your transport costs jumped by R${amount.toFixed(0)} this week.

Questions to consider:
- Can you combine trips?
- Is there a closer supplier?
- Can you negotiate better rates?

Small savings on regular expenses add up fast!
  `.trim(),

  stock_opportunity: (context) => `
💡 Quick insight:

Your ${context.top_income_category} sales are doing well! 

Consider:
- Buying that stock in bulk for better prices
- Promoting it more - it's clearly popular
- Raising the price slightly (people will still buy)

Want to discuss your pricing strategy?
  `.trim(),

  goal_near: (remaining) => `
🎯 You're close!

Just R${remaining.toFixed(0)} away from your monthly target!

You've got this! What's your plan to close the gap?
  `.trim(),
};

export const SAFETY_FILTERS = {
  investment_keywords: [
    'bitcoin', 'crypto', 'stocks', 'shares', 'invest', 'trading', 'forex'
  ],
  sensitive_topics: [
    'political', 'president', 'government policy', 'tax evasion', 'illegal'
  ],
  out_of_scope: [
    'medical advice', 'legal advice', 'relationship advice', 'mental health'
  ],
};

export const SAFETY_RESPONSES = {
  investment: "I can't give investment advice - that's too risky without knowing your full situation. Stick to what you know: growing your current business! Want help with that?",
  
  tax_legal: "That's a question for a professional accountant or lawyer. I'm here to help you understand your business numbers, not replace professional advice. Want to talk about your profits instead?",
  
  out_of_scope: "That's outside my area! I'm here to help with your business finances. Got any questions about your money, sales, or expenses?",
  
  political: "I stay out of politics! Let's focus on what you can control: your business. How can I help you today?",
};

export function detectSensitiveTopic(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (SAFETY_FILTERS.investment_keywords.some(kw => lowerQuestion.includes(kw))) {
    return 'investment';
  }
  
  if (lowerQuestion.includes('tax') || lowerQuestion.includes('legal')) {
    return 'tax_legal';
  }
  
  if (SAFETY_FILTERS.sensitive_topics.some(kw => lowerQuestion.includes(kw))) {
    return 'political';
  }
  
  if (SAFETY_FILTERS.out_of_scope.some(kw => lowerQuestion.includes(kw))) {
    return 'out_of_scope';
  }
  
  return null;
}


