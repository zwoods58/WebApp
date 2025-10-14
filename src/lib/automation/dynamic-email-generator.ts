// Dynamic Email Generation Algorithm
// Creates unique, valuable emails based on lead data and company expertise

interface LeadData {
  firstName: string
  lastName: string
  email: string
  company?: string
  website?: string
  industry?: string
  source?: string
  score?: number
  createdAt: string
  updatedAt: string
  status: string
  notes?: string
}

interface EmailTemplate {
  subject: string
  html: string
  type: 'welcome' | 'followup' | 'nurture' | 'reengagement'
}

// Business owner insights and real-world perspectives
const BUSINESS_INSIGHTS = {
  welcomeConsultativeInsights: [
    'the technology landscape is evolving faster than most business owners realize',
    'customers today expect seamless digital experiences, and businesses that don\'t adapt are quietly losing ground',
    'the gap between businesses that embrace technology and those that don\'t is widening every day',
    'most successful businesses aren\'t just keeping up with technology - they\'re using it to create competitive advantages',
    'the businesses that thrive in the next decade will be those that see technology as a strategic partner, not just a tool',
    'customers are becoming more sophisticated in their expectations, and businesses need to evolve to meet them',
    'the companies that will dominate their industries are already thinking about how technology can transform their customer experience',
    'business owners who view technology as an investment in their future are the ones who will stay ahead of the curve',
    'the digital transformation isn\'t coming - it\'s already here, and businesses need to decide if they\'ll lead or follow',
    'the most successful entrepreneurs I know are those who see technology as a way to scale their vision, not just their operations'
  ],
  commonStruggles: [
    'juggling daily operations while trying to plan for growth',
    'feeling like you\'re always putting out fires instead of building something lasting',
    'watching competitors get ahead while you\'re stuck in the weeds',
    'knowing you could reach more customers but not having the time or know-how',
    'losing potential business because people can\'t find you online',
    'spending too much time on repetitive tasks that could be automated',
    'feeling like you\'re working IN your business instead of ON your business',
    'worrying about what happens when you\'re not available to answer questions',
    'knowing you have something valuable to offer but struggling to communicate it',
    'feeling overwhelmed by all the "shoulds" and "musts" of running a business'
  ],
  growthRealities: [
    'most successful businesses have one thing in common - they make it easy for customers to find and work with them',
    'the businesses that scale sustainably are the ones that build systems, not just hustle harder',
    'your biggest competitor isn\'t other businesses - it\'s the status quo that keeps you stuck',
    'the best time to build your digital presence was yesterday, the second best time is now',
    'every hour you spend on tasks that could be automated is an hour you can\'t spend growing',
    'customers expect to find you online - if they can\'t, they\'ll find someone else',
    'the businesses that thrive are the ones that make it effortless for customers to say yes',
    'you don\'t have to be everywhere, but you do need to be somewhere your customers can find you',
    'the most successful entrepreneurs I know all have one thing in common - they built systems that work without them',
    'your business is only as strong as its weakest link - and for most businesses, that\'s their digital presence'
  ],
  realWorldExamples: [
    'I worked with a local restaurant owner who was spending 3 hours every morning just answering phone calls about hours and menu items. After we built them a simple website, those calls dropped by 80% and they could focus on what they do best - cooking amazing food.',
    'There\'s a fitness trainer I know who was turning away clients because she could only handle so many in-person sessions. We built her a simple booking system, and now she\'s serving 3x more clients without working more hours.',
    'I helped a consultant who was losing potential clients because they couldn\'t easily see what he offered or how to work with him. After we built his web presence, his inquiries increased by 200% and he could be more selective about which projects to take.',
    'A local service business owner told me they were getting calls at all hours asking basic questions. We built them a simple FAQ page, and now they sleep better knowing customers can find answers without calling.',
    'There\'s a small manufacturer who was struggling to compete with bigger companies. We built them a professional web presence, and suddenly they were getting inquiries from customers who would have never found them otherwise.',
    'I worked with a professional who was doing everything manually - scheduling, invoicing, follow-ups. We automated their processes, and they went from working 60 hours a week to 40 while serving more clients.'
  ],
  businessOwnerWisdom: [
    'from one business owner to another',
    'I\'ve been where you are',
    'here\'s what I\'ve learned',
    'most people don\'t realize',
    'here\'s the thing',
    'I\'ll be honest with you',
    'this is something I wish I knew earlier',
    'having been in your shoes',
    'I\'ve seen this pattern before',
    'let me share something that might help'
  ]
}

// Email tone and personality variations
const TONE_VARIATIONS = [
  'professional yet approachable',
  'conversational and helpful',
  'expert but not condescending',
  'friendly and knowledgeable',
  'confident and solution-focused'
]

// Subject line generators - conversational and human
function generateSubject(lead: LeadData, type: string): string {
  const subjects = {
    welcome: [
      `Quick thought about ${lead.company || 'your business'}...`,
      `Something I've been thinking about...`,
      `A perspective on ${lead.industry || 'your industry'}...`,
      `From one business owner to another...`,
      `Something that might help...`
    ],
    followup: [
      `How's everything going?`,
      `Quick check-in...`,
      `Something I wanted to share...`,
      `Hope this finds you well...`,
      `A quick thought...`
    ],
    nurture: [
      `Something that might be useful...`,
      `A quick insight...`,
      `Thought you'd find this interesting...`,
      `Something I learned recently...`,
      `A perspective that might help...`
    ],
    reengagement: [
      `Haven't talked in a while...`,
      `Hope you're doing well...`,
      `Something I wanted to share...`,
      `Quick check-in...`,
      `Hope this finds you well...`
    ]
  }
  
  const typeSubjects = subjects[type as keyof typeof subjects] || subjects.welcome
  return typeSubjects[Math.floor(Math.random() * typeSubjects.length)]
}

// Generate personalized opening - conversational and human (no name to avoid mistakes)
function generateOpening(lead: LeadData): string {
  const openings = [
    `Hi there,`,
    `Hello,`,
    `Hey,`
  ]
  
  return openings[Math.floor(Math.random() * openings.length)]
}

// Generate consultative welcome insight about technology landscape
function generateConsultativeWelcomeInsight(lead: LeadData): string {
  const insight = BUSINESS_INSIGHTS.welcomeConsultativeInsights[Math.floor(Math.random() * BUSINESS_INSIGHTS.welcomeConsultativeInsights.length)]
  const industry = lead.industry || 'business'
  
  const perspectives = [
    `Here's something I've been thinking about - ${insight}`,
    `I've been reflecting on how ${insight}`,
    `Something that's been on my mind lately - ${insight}`,
    `Having worked with ${industry} businesses, I've noticed that ${insight}`,
    `From my experience, ${insight}`
  ]
  
  return perspectives[Math.floor(Math.random() * perspectives.length)]
}

// Generate empathetic connection based on business struggles
function generateEmpatheticConnection(lead: LeadData): string {
  const struggle = BUSINESS_INSIGHTS.commonStruggles[Math.floor(Math.random() * BUSINESS_INSIGHTS.commonStruggles.length)]
  const wisdom = BUSINESS_INSIGHTS.businessOwnerWisdom[Math.floor(Math.random() * BUSINESS_INSIGHTS.businessOwnerWisdom.length)]
  
  return `${wisdom} - I know how challenging it can be ${struggle}.`
}

// Generate growth perspective - why web presence matters
function generateGrowthPerspective(lead: LeadData): string {
  const reality = BUSINESS_INSIGHTS.growthRealities[Math.floor(Math.random() * BUSINESS_INSIGHTS.growthRealities.length)]
  const industry = lead.industry || 'business'
  
  const perspectives = [
    `Here's the thing - ${reality}`,
    `Most people don't realize that ${reality}`,
    `I've learned that ${reality}`,
    `Having worked with ${industry} businesses, I've seen that ${reality}`,
    `From my experience, ${reality}`
  ]
  
  return perspectives[Math.floor(Math.random() * perspectives.length)]
}

// Generate real-world example that shows the value
function generateRealWorldExample(lead: LeadData): string {
  const example = BUSINESS_INSIGHTS.realWorldExamples[Math.floor(Math.random() * BUSINESS_INSIGHTS.realWorldExamples.length)]
  return example
}

// Generate benefits focused on their world
function generateBusinessBenefits(lead: LeadData): string {
  const industry = lead.industry || 'business'
  
  const benefits = [
    `For a ${industry} business like yours, this means reaching more customers who are actively looking for what you offer, being discoverable 24/7 even when you're focused on other things, and building credibility that helps you attract better opportunities.`,
    `The businesses I work with in ${industry} tell me the biggest game-changer is being able to automate the basic inquiries and questions, so they can focus on the work that actually grows their business.`,
    `What I've seen with ${industry} businesses is that having a strong web presence doesn't just bring in more customers - it brings in the RIGHT customers who are ready to work with you.`,
    `Most ${industry} business owners I know are surprised by how much time they get back when customers can find basic information online instead of calling or emailing.`,
    `The ${industry} businesses that really thrive are the ones that make it effortless for potential customers to understand what they offer and how to get started.`
  ]
  
  return benefits[Math.floor(Math.random() * benefits.length)]
}

// Generate strategic business direction insight
function generateStrategicDirectionInsight(lead: LeadData): string {
  const industry = lead.industry || 'business'
  
  const strategicInsights = [
    `The most successful ${industry} businesses I work with are those that see technology not as a cost, but as a strategic investment in their future growth. They understand that every dollar spent on the right technology today can multiply their reach and efficiency tomorrow.`,
    `What I've observed is that ${industry} businesses that thrive are the ones that don't just react to technology changes - they anticipate them. They're always thinking about how to position themselves to take advantage of what's coming next.`,
    `The ${industry} business owners who stay ahead are those who view technology as a way to amplify their unique strengths, not replace them. They use it to reach more people, serve them better, and build stronger relationships.`,
    `I've noticed that the most successful ${industry} businesses are the ones that approach technology strategically. They don't just adopt the latest trends - they carefully consider how each tool or platform can help them achieve their specific business goals.`,
    `The ${industry} businesses that really excel are those that see technology as a competitive advantage. They understand that in today's market, being technologically savvy isn't optional - it's essential for staying relevant and reaching your full potential.`
  ]
  
  return strategicInsights[Math.floor(Math.random() * strategicInsights.length)]
}

// Generate warm, encouraging closing with consultation link
function generateWarmClosing(lead: LeadData): string {
  const closings = [
    `If you're interested in pursuing this further, I'd love to offer you a free consultation to explore what this could look like for your business. You can schedule it at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'm always happy to share more insights about how other ${lead.industry || 'business'} owners are growing their businesses. If you'd like to explore this further, feel free to book a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `If you'd like to chat about what this could mean for your business, I'd love to offer you a free consultation. You can schedule it at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'm here if you want to talk through any of this - sometimes it helps to bounce ideas off someone who's been there. If you're interested, I'd be happy to offer a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `If you're curious about how this could work for your business, I'd be happy to share more details in a free consultation. You can book it at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'd be happy to discuss how this could work for your business. Feel free to schedule a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `If this resonates with you, I'd love to explore how we can apply these insights to your business. Book a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'm here to help if you want to explore this further. Schedule a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a> to discuss your specific situation`
  ]
  
  const selectedClosing = closings[Math.floor(Math.random() * closings.length)]
  
  // Add unsubscribe link
  const unsubscribeLink = `https://atarwebb.com/unsubscribe?email=${encodeURIComponent(lead.email || '')}`
  
  return `${selectedClosing}<br><br><hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"><p style="font-size: 12px; color: #6b7280; text-align: center;">If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}" style="color: #6b7280;">unsubscribe here</a>.</p>`
}

// Main email generation function - authentic business owner to business owner
export function generateDynamicEmail(lead: LeadData, type: 'welcome' | 'followup' | 'nurture' | 'reengagement' = 'welcome'): EmailTemplate {
  const subject = generateSubject(lead, type)
  const opening = generateOpening(lead)
  
  // Build email body - conversational, empathetic, and valuable
  let body = opening
  
  if (type === 'welcome') {
    body += `\n\n`
    body += generateConsultativeWelcomeInsight(lead)
    body += `\n\n`
    body += generateStrategicDirectionInsight(lead)
    body += `\n\n`
    body += generateRealWorldExample(lead)
    body += `\n\n`
    body += generateWarmClosing(lead)
  } else if (type === 'followup') {
    body += `\n\n`
    body += `I wanted to follow up on our previous conversation. `
    body += generateGrowthPerspective(lead)
    body += `\n\n`
    body += generateRealWorldExample(lead)
    body += `\n\n`
    body += generateWarmClosing(lead)
  } else if (type === 'nurture') {
    body += `\n\n`
    body += generateEmpatheticConnection(lead)
    body += `\n\n`
    body += generateRealWorldExample(lead)
    body += `\n\n`
    body += generateWarmClosing(lead)
  } else if (type === 'reengagement') {
    body += `\n\n`
    body += `I haven't heard from you in a while, and I wanted to check in. `
    body += generateEmpatheticConnection(lead)
    body += `\n\n`
    body += generateGrowthPerspective(lead)
    body += `\n\n`
    body += generateWarmClosing(lead)
  }
  
  // Add signature - simple and personal, alternating between Juan and AtarWebb Team
  const signatures = [
    `Juan\nAtarWebb\nsales@atarwebb.com`,
    `AtarWebb Team\nsales@atarwebb.com`
  ]
  
  body += `\n\n`
  body += signatures[Math.floor(Math.random() * signatures.length)]
  
  return {
    subject,
    html: body.replace(/\n/g, '<br>'),
    type
  }
}

// Email type selector based on lead data and timing
export function selectEmailType(lead: LeadData): 'welcome' | 'followup' | 'nurture' | 'reengagement' {
  const daysSinceCreated = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceUpdated = Math.floor((Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceCreated === 0) {
    return 'welcome'
  } else if (daysSinceUpdated >= 7) {
    return 'reengagement'
  } else if (daysSinceUpdated >= 3) {
    return 'followup'
  } else {
    return 'nurture'
  }
}

// Generate multiple email variations for A/B testing
export function generateEmailVariations(lead: LeadData, type: 'welcome' | 'followup' | 'nurture' | 'reengagement', count: number = 3): EmailTemplate[] {
  const variations: EmailTemplate[] = []
  
  for (let i = 0; i < count; i++) {
    variations.push(generateDynamicEmail(lead, type))
  }
  
  return variations
}
