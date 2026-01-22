// Coaching Prompts for Kenyan Informal Business Owners
// Seasonal patterns and advice for Kenyan informal businesses

export const SYSTEM_PROMPT = `You are a financial coach for Kenyan informal business owners.`;

export const SEASONAL_PROMPTS = [
  {
    season: 'short rains',
    period: 'March - May',
    focus: 'Cash flow management during low season',
    prompt: 'The short rains season is starting. Help businesses prepare for reduced cash flow by:\n1. Accelerating receivables from customers\n2. Offering advance payment terms to reliable suppliers\n3. Building cash reserves for emergencies\n4. Focusing on high-margin products and services\n5. Reducing unnecessary expenses'
  },
  {
    season: 'long rains',
    period: 'April - October',
    focus: 'Peak business season - maximize revenue',
    prompt: 'Long rains season is here! This is your peak revenue period. Focus on:\n1. Maximizing customer acquisition and retention\n2. Optimizing pricing for peak demand\n3. Ensuring adequate stock of popular items\n4. Extending business hours\n5. Implementing efficient inventory management\n6. Managing increased staff and cash handling'
  },
  {
    season: 'dry season',
    period: 'November - February',
    focus: 'Business planning and preparation',
    prompt: 'Dry season is approaching. Time to:\n1. Review business performance from previous year\n2. Set clear goals and targets for next year\n3. Plan marketing strategies for upcoming peak season\n4. Evaluate and upgrade equipment or facilities\n5. Train staff on new products or services\n6. Secure financing for inventory purchases'
  },
  {
    season: 'hot season',
    period: 'December - February',
    focus: 'Holiday sales and customer service',
    prompt: 'Holiday season is here! Focus on:\n1. Creating special offers and promotions\n2. Extending business hours and staffing\n3. Ensuring excellent customer service during busy periods\n4. Managing increased transactions and cash handling\n5. Maintaining adequate stock of holiday items\n6. Training temporary staff effectively'
  }
];

export const BUSINESS_TYPE_ADVICE = {
  'spaza shop': {
    focus: 'Customer retention and inventory management',
    advice: 'For Spaza shop owners, focus on:\n1. Keeping popular fast-moving items in stock\n2. Implementing a simple loyalty program\n3. Using mobile money (M-Pesa) for payments\n4. Managing cash flow carefully during busy periods\n5. Training staff on customer service and upselling'
  },
  'm-pesa agent': {
    focus: 'Transaction processing and float management',
    advice: 'For M-Pesa agents, focus on:\n1. Efficient transaction processing\n2. Maintaining adequate float for customer withdrawals\n3. Daily cash reconciliation and reporting\n4. Building trust with regular customers\n5. Using digital receipts and records'
  },
  'informal trader': {
    focus: 'Cash management and supplier relationships',
    advice: 'For informal traders, focus on:\n1. Daily cash tracking and reconciliation\n2. Building relationships with reliable suppliers\n3. Managing inventory turnover efficiently\n4. Offering credit to trusted customers\n5. Diversifying product range to reduce risk'
  },
  'service provider': {
    focus: 'Service quality and customer satisfaction',
    advice: 'For service providers, focus on:\n1. Maintaining consistent service quality\n2. Collecting and responding to customer feedback\n3. Managing appointments and schedules efficiently\n4. Building reputation through reliability\n5. Offering service packages or maintenance contracts'
  }
};

export const KENYAN_BUSINESS_TIPS = [
  'Manage mobile money transactions through M-Pesa integration',
  'Keep detailed records of all cash transactions for tax purposes',
  'Build relationships with local suppliers for better credit terms',
  'Use WhatsApp for customer communication and marketing',
  'Monitor daily cash flow and reconcile at closing time',
  'Maintain separate records for business and personal expenses',
  'Consider joining SACCOs (Savings and Credit Cooperative Organizations) for financial support',
  'Invest in secure storage solutions for cash and valuable inventory',
  'Use digital tools for accounting and inventory management',
  'Plan for major purchases and equipment upgrades during profitable periods',
  'Build emergency cash reserves equivalent to 3-6 months of operating expenses'
];
