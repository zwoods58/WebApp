// Email Generator for Businesses with Existing Websites
// Focuses on optimization, improvement, and maximizing current web presence

interface ExistingWebsiteLeadData {
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

// Insights for businesses with existing websites
const WEBSITE_OPTIMIZATION_INSIGHTS = {
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
  commonChallenges: [
    'having a website that looks good but doesn\'t actually bring in customers',
    'getting traffic to your site but not seeing it convert into leads or sales',
    'watching competitors rank higher in search results even though your content is better',
    'having a site that works on desktop but is frustrating to use on mobile',
    'spending money on ads but not seeing the return because your site doesn\'t convert well',
    'having a beautiful site that loads too slowly and loses visitors',
    'getting visitors to your homepage but they leave without taking any action',
    'having all the right information on your site but it\'s hard for visitors to find',
    'watching potential customers visit your site but then go to competitors instead',
    'having a site that worked great when you built it but now feels outdated'
  ],
  optimizationRealities: [
    'most businesses with websites are only using about 20% of their site\'s potential',
    'small changes to your existing site can often double or triple your results',
    'the difference between a good website and a great one isn\'t the design - it\'s the strategy behind it',
    'most business owners don\'t realize their site is actually working against them in ways they can\'t see',
    'the best websites aren\'t the prettiest ones - they\'re the ones that make it effortless for customers to say yes',
    'your website should work like your best salesperson, even when you\'re not there',
    'most businesses focus on getting more traffic when they should focus on converting the traffic they already have',
    'the biggest opportunity for most businesses isn\'t building something new - it\'s optimizing what they already have',
    'your website is either working for you 24/7 or it\'s costing you opportunities every day',
    'the businesses that really succeed online are the ones that continuously improve what they already have'
  ],
  specificImprovements: [
    'I\'ve seen businesses increase their conversion rates by 40% just by changing the color and placement of their call-to-action buttons',
    'One client was getting good traffic but no leads - we added a simple contact form in the right place and they started getting 3-5 qualified leads per week',
    'A local business owner thought their site was fine until we showed them it was taking 8 seconds to load on mobile - after we optimized it, their bounce rate dropped by 60%',
    'Most people don\'t realize that just changing the headline on their homepage can increase conversions by 25-30%',
    'I worked with a service business that was getting calls but not the right kind - we restructured their services page and suddenly they were attracting higher-value clients',
    'One business owner was frustrated that visitors weren\'t reading their content - we broke it into smaller sections with better headings and their time on site increased by 200%',
    'A client was getting traffic from Google but not converting - we added customer testimonials and case studies, and their conversion rate went from 2% to 8%',
    'Most businesses don\'t realize that the order of information on their site matters more than the information itself',
    'I\'ve seen businesses double their leads just by adding a simple "What happens next?" section to their contact page',
    'One client was losing customers at checkout - we simplified the process and their completion rate went from 45% to 78%'
  ],
  conversationStarters: [
    'from what I\'ve seen',
    'most businesses don\'t realize',
    'you might already be doing this but',
    'one quick win I\'ve seen',
    'here\'s something interesting',
    'I\'ve noticed that',
    'what I\'ve learned is',
    'most business owners are surprised to learn',
    'here\'s what I\'ve observed',
    'one thing I\'ve discovered'
  ]
}

// Subject line generators for existing website owners
function generateExistingWebsiteSubject(lead: ExistingWebsiteLeadData, type: string): string {
  const subjects = {
    welcome: [
      `Quick thought about ${lead.company || 'your website'}...`,
      `Something I noticed about your site...`,
      `A perspective on ${lead.industry || 'your industry'} websites...`,
      `From one business owner to another...`,
      `Something that might help your site...`
    ],
    followup: [
      `How's your website performing?`,
      `Quick check-in about your site...`,
      `Something I wanted to share...`,
      `Hope your site is working well...`,
      `A quick thought about optimization...`
    ],
    nurture: [
      `Something that might improve your site...`,
      `A quick optimization insight...`,
      `Thought you'd find this interesting...`,
      `Something I learned about websites...`,
      `A perspective that might help...`
    ],
    reengagement: [
      `Haven't talked about your site in a while...`,
      `Hope your website is doing well...`,
      `Something I wanted to share...`,
      `Quick check-in about optimization...`,
      `Hope this finds you well...`
    ]
  }
  
  const typeSubjects = subjects[type as keyof typeof subjects] || subjects.welcome
  return typeSubjects[Math.floor(Math.random() * typeSubjects.length)]
}

// Generate opening - conversational and acknowledging their existing site
function generateExistingWebsiteOpening(lead: ExistingWebsiteLeadData): string {
  const openings = [
    `Hi there,`,
    `Hello,`,
    `Hey,`
  ]
  
  return openings[Math.floor(Math.random() * openings.length)]
}

// Generate acknowledgment of their existing website
function generateWebsiteAcknowledgment(lead: ExistingWebsiteLeadData): string {
  const website = lead.website || 'your website'
  const company = lead.company || 'your business'
  
  const acknowledgments = [
    `I took a look at ${website} and I can see you've put real thought into building something that represents ${company} well.`,
    `I checked out ${website} and it's clear you've invested in creating a professional presence for ${company}.`,
    `I had a chance to look at ${website} and I can see the effort you've put into making ${company} look professional online.`,
    `I visited ${website} and it's obvious you've taken the time to create something that properly represents ${company}.`,
    `I took a quick look at ${website} and I can see you've built something solid for ${company}.`
  ]
  
  return acknowledgments[Math.floor(Math.random() * acknowledgments.length)]
}

// Generate consultative welcome insight about technology landscape
function generateConsultativeWelcomeInsight(lead: ExistingWebsiteLeadData): string {
  const insight = WEBSITE_OPTIMIZATION_INSIGHTS.welcomeConsultativeInsights[Math.floor(Math.random() * WEBSITE_OPTIMIZATION_INSIGHTS.welcomeConsultativeInsights.length)]
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

// Generate empathetic connection about website challenges
function generateWebsiteChallengeConnection(lead: ExistingWebsiteLeadData): string {
  const challenge = WEBSITE_OPTIMIZATION_INSIGHTS.commonChallenges[Math.floor(Math.random() * WEBSITE_OPTIMIZATION_INSIGHTS.commonChallenges.length)]
  const starter = WEBSITE_OPTIMIZATION_INSIGHTS.conversationStarters[Math.floor(Math.random() * WEBSITE_OPTIMIZATION_INSIGHTS.conversationStarters.length)]
  
  return `${starter}, many business owners I work with struggle with ${challenge}.`
}

// Generate optimization reality/insight
function generateOptimizationReality(lead: ExistingWebsiteLeadData): string {
  const reality = WEBSITE_OPTIMIZATION_INSIGHTS.optimizationRealities[Math.floor(Math.random() * WEBSITE_OPTIMIZATION_INSIGHTS.optimizationRealities.length)]
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

// Generate strategic business direction insight for existing website owners
function generateStrategicDirectionInsight(lead: ExistingWebsiteLeadData): string {
  const industry = lead.industry || 'business'
  
  const strategicInsights = [
    `The most successful ${industry} businesses I work with are those that see their existing website not as a finished product, but as a foundation they can continuously build upon. They understand that every optimization is an investment in their competitive advantage.`,
    `What I've observed is that ${industry} businesses that thrive are the ones that don't just maintain their website - they strategically evolve it. They're always thinking about how to make their digital presence work harder for their business goals.`,
    `The ${industry} business owners who stay ahead are those who view their website as a strategic asset that can be optimized to reach more people, serve them better, and build stronger relationships.`,
    `I've noticed that the most successful ${industry} businesses are the ones that approach website optimization strategically. They don't just make random changes - they carefully consider how each improvement can help them achieve their specific business objectives.`,
    `The ${industry} businesses that really excel are those that see their website as a competitive advantage that can be continuously improved. They understand that in today's market, having a website isn't enough - you need one that actively works to grow your business.`
  ]
  
  return strategicInsights[Math.floor(Math.random() * strategicInsights.length)]
}

// Generate specific improvement example
function generateSpecificImprovement(lead: ExistingWebsiteLeadData): string {
  const improvement = WEBSITE_OPTIMIZATION_INSIGHTS.specificImprovements[Math.floor(Math.random() * WEBSITE_OPTIMIZATION_INSIGHTS.specificImprovements.length)]
  return improvement
}

// Generate warm, helpful closing with consultation link
function generateOptimizationClosing(lead: ExistingWebsiteLeadData): string {
  const closings = [
    `If you ever want a fresh set of eyes on your site or to talk through small improvements, I'd be glad to help. Schedule a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'm always happy to share more insights about how other ${lead.industry || 'business'} owners are optimizing their sites. Book a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `If you'd like to chat about what small changes could mean for your site's performance, I'd love to offer a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'm here if you want to talk through any of this - sometimes it helps to get an outside perspective on what you've built. Schedule a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `If you're curious about how this could work for your site, I'd be happy to share more details in a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'd be happy to discuss how we can optimize your site for better results. Book a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `If this resonates with you, I'd love to explore how we can improve your site's performance. Schedule a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a>`,
    `I'm here to help if you want to explore this further. Book a free consultation at <a href="https://atarwebb.com/contact">atarwebb.com/contact</a> to discuss your specific needs`
  ]
  
  const selectedClosing = closings[Math.floor(Math.random() * closings.length)]
  
  // Add unsubscribe link
  const unsubscribeLink = `https://atarwebb.com/unsubscribe?email=${encodeURIComponent(lead.email || '')}`
  
  return `${selectedClosing}<br><br><hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"><p style="font-size: 12px; color: #6b7280; text-align: center;">If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}" style="color: #6b7280;">unsubscribe here</a>.</p>`
}

// Main email generation function for existing website owners
export function generateExistingWebsiteEmail(lead: ExistingWebsiteLeadData, type: 'welcome' | 'followup' | 'nurture' | 'reengagement' = 'welcome'): EmailTemplate {
  const subject = generateExistingWebsiteSubject(lead, type)
  const opening = generateExistingWebsiteOpening(lead)
  
  // Build email body - focused on optimization and improvement
  let body = opening
  
  if (type === 'welcome') {
    body += `\n\n`
    body += generateWebsiteAcknowledgment(lead)
    body += `\n\n`
    body += generateConsultativeWelcomeInsight(lead)
    body += `\n\n`
    body += generateStrategicDirectionInsight(lead)
    body += `\n\n`
    body += generateSpecificImprovement(lead)
    body += `\n\n`
    body += generateOptimizationClosing(lead)
  } else if (type === 'followup') {
    body += `\n\n`
    body += `I wanted to follow up on our previous conversation about your website. `
    body += generateOptimizationReality(lead)
    body += `\n\n`
    body += generateSpecificImprovement(lead)
    body += `\n\n`
    body += generateOptimizationClosing(lead)
  } else if (type === 'nurture') {
    body += `\n\n`
    body += generateWebsiteChallengeConnection(lead)
    body += `\n\n`
    body += generateSpecificImprovement(lead)
    body += `\n\n`
    body += generateOptimizationClosing(lead)
  } else if (type === 'reengagement') {
    body += `\n\n`
    body += `I haven't heard from you in a while, and I wanted to check in about your website. `
    body += generateWebsiteChallengeConnection(lead)
    body += `\n\n`
    body += generateOptimizationReality(lead)
    body += `\n\n`
    body += generateOptimizationClosing(lead)
  }
  
  // Add signature - alternating between Juan and AtarWebb Team
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

// Email type selector for existing website owners
export function selectExistingWebsiteEmailType(lead: ExistingWebsiteLeadData): 'welcome' | 'followup' | 'nurture' | 'reengagement' {
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

