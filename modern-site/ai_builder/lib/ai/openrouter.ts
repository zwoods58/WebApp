/**
 * OpenRouter API Service
 * 
 * Handles communication with OpenRouter API for image analysis using Gemini
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

if (!OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY not set. Image analysis will fail.')
}

export interface ImageAnalysisResult {
  description: string
  suggestedImages: string[]
  colorPalette: string[]
  styleRecommendations: string
}

/**
 * Analyze an uploaded image using Gemini
 */
export async function analyzeUploadedImage(imageUrl: string, businessContext: {
  businessName: string
  businessType: string
  businessDescription: string
}): Promise<ImageAnalysisResult> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured')
  }

  const prompt = `You are analyzing an image uploaded by a business owner for their website.

Business Context:
- Name: ${businessContext.businessName}
- Industry: ${businessContext.businessType}
- Description: ${businessContext.businessDescription}

Analyze this image and provide:
1. Detailed description of the image content
2. How this image relates to their business
3. Recommended placement on the website (hero, about, services, etc.)
4. Color palette extracted from the image (hex codes)
5. Design style recommendations based on the image aesthetic

Return a JSON object with this structure:
{
  "description": "detailed description",
  "suggestedImages": ["hero", "about", "services"],
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "styleRecommendations": "design style suggestions"
}

Return ONLY the JSON object, no markdown, no explanations.`

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://atarwebb.com',
        'X-Title': 'AtarWebb AI Website Builder',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const textContent = data.choices?.[0]?.message?.content || ''

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('No JSON found in image analysis response')
      return {
        description: 'Professional business image',
        suggestedImages: ['hero'],
        colorPalette: ['#2563eb', '#1e40af', '#1e3a8a'],
        styleRecommendations: 'Modern and professional'
      }
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw error
  }
}

/**
 * Generate image suggestions using Gemini (when no image uploaded)
 */
export async function generateImageSuggestions(businessContext: {
  businessName: string
  businessType: string
  businessDescription: string
  aestheticStyle: string
  preferredColors: string
}): Promise<{
  heroImage: string
  aboutImage: string
  serviceImages: string[]
  imageDescriptions: string[]
}> {
  if (!OPENROUTER_API_KEY) {
    // Fallback to generic Unsplash images
    return generateFallbackImages(businessContext.businessType)
  }

  const prompt = `You are an expert web designer selecting the perfect images for a website.

Business Context:
- Name: ${businessContext.businessName}
- Industry: ${businessContext.businessType}
- Description: ${businessContext.businessDescription}
- Aesthetic Style: ${businessContext.aestheticStyle}
- Preferred Colors: ${businessContext.preferredColors}

Task: Recommend specific Unsplash image IDs that would be perfect for this website.

For each section, provide:
1. A specific Unsplash photo ID (the part after "photo-" in the URL)
2. A brief description of why this image fits

Sections needed:
- Hero background (full-width, impactful)
- About section image (professional, relevant)
- 3-4 Service/feature card images (diverse, relevant)

Return a JSON object with this structure:
{
  "heroImage": "unsplash-photo-id",
  "aboutImage": "unsplash-photo-id",
  "serviceImages": ["id1", "id2", "id3", "id4"],
  "imageDescriptions": ["Hero: description", "About: description", "Service 1: description", ...]
}

Use real Unsplash photo IDs that match the business type. For example:
- Technology: 1518770660439-4636190af475, 1461749280689-9cc2c0c0f5b8
- Fashion: 1441986300917-64674bd600d8, 1490482649376-0a5e9f5b0b0a
- Food: 1555939596-4b03f3b8c8b0, 1504674900247-0877df9cc836
- Real Estate: 1560518883-ce09059eeffa, 1568605114967-8130f3a23494

Return ONLY the JSON object, no markdown, no explanations.`

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://atarwebb.com',
        'X-Title': 'AtarWebb AI Website Builder',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      return generateFallbackImages(businessContext.businessType)
    }

    const data = await response.json()
    const textContent = data.choices?.[0]?.message?.content || ''

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('No JSON found in image suggestion response')
      return generateFallbackImages(businessContext.businessType)
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error generating image suggestions:', error)
    return generateFallbackImages(businessContext.businessType)
  }
}

/**
 * Fallback image selection based on business type
 */
function generateFallbackImages(businessType: string): {
  heroImage: string
  aboutImage: string
  serviceImages: string[]
  imageDescriptions: string[]
} {
  const imageMap: { [key: string]: { hero: string, about: string, services: string[] } } = {
    'technology-saas': {
      hero: '1518770660439-4636190af475',
      about: '1461749280689-9cc2c0c0f5b8',
      services: ['1551434678-e076c223a692', '1460925895917-afdab827c52f', '1504868584819-f8e8b4b6d7e3', '1519389950473-47ba0277781c']
    },
    'clothing-fashion': {
      hero: '1441986300917-64674bd600d8',
      about: '1490482649376-0a5e9f5b0b0a',
      services: ['1483985988355-763743e7a870', '1515372039744-b8f02a3ae446', '1490481651871-ab68de25d43d', '1509319117032-6f20f2f76e88']
    },
    'food-beverage': {
      hero: '1555939596-4b03f3b8c8b0',
      about: '1504674900247-0877df9cc836',
      services: ['1556910096-6f5e5b160d33', '1493770348161-369560ae357d', '1543362906-acfc16c67564', '1565958011703-44f9829ba187']
    },
    'real-estate': {
      hero: '1560518883-ce09059eeffa',
      about: '1568605114967-8130f3a23494',
      services: ['1564013799919-ab6080273ca4', '1560184897-5c9e5e2c2e9f', '1512917774080-9991f1c4c750', '1560184897-abe73c49c7c5']
    },
    'healthcare': {
      hero: '1576091160391-481585b42331',
      about: '1576091160550-2173dba999a8',
      services: ['1559757148-5c63bea19094', '1584515933487-779a11a3f3c6', '1505751172876-fa1195b76ce2', '1579684385127-1ef15d508d6b']
    },
    'finance': {
      hero: '1551288049-beb62ce59672',
      about: '1554224154-26032a4c5c5b',
      services: ['1554224155-8d04cb21cdc0', '1554224154-82aee05c7c8e', '1559757175-0eb30cd8c063', '1579621970563-ebec7560ff3e']
    }
  }

  const defaults = {
    hero: '1551434678-e076c223a692',
    about: '1522071820081-009f0129c71c',
    services: ['1460925895917-afdab827c52f', '1504868584819-f8e8b4b6d7e3', '1519389950473-47ba0277781c', '1522071820081-009f0129c71c']
  }

  const images = imageMap[businessType] || defaults

  return {
    heroImage: images.hero,
    aboutImage: images.about,
    serviceImages: images.services,
    imageDescriptions: [
      'Hero: Professional background image',
      'About: Relevant business image',
      'Service 1: Feature illustration',
      'Service 2: Feature illustration',
      'Service 3: Feature illustration',
      'Service 4: Feature illustration'
    ]
  }
}

