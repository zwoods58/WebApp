import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { analyzeUploadedImage, generateImageSuggestions } from '../../../../ai_builder/lib/ai/openrouter'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Anthropic API configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY // Support both for backward compatibility
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_MODEL = 'claude-opus-4-5' // Claude Opus 4.5

// Debug: Verify key is loaded
if (!ANTHROPIC_API_KEY) {
  console.warn('âš ï¸ ANTHROPIC_API_KEY not set. AI generation will fail.')
} else {
  console.log('âœ… ANTHROPIC_API_KEY found:', ANTHROPIC_API_KEY.substring(0, 10) + '...')
}

interface StreamChunk {
  type: 'step' | 'preview' | 'complete' | 'error'
  stepIndex?: number
  status?: 'pending' | 'in_progress' | 'completed' | 'error'
  message?: string
  url?: string
  previewUrl?: string
  error?: string
  progress?: {
    current: number
    total: number
    percentage: number
  }
}

function sendStreamChunk(chunk: StreamChunk) {
  return `data: ${JSON.stringify(chunk)}\n\n`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { draftId } = await request.json()

    if (!draftId) {
      return NextResponse.json({ error: 'Draft ID required' }, { status: 400 })
    }

    // Get draft project data
    const { data: draft, error: draftError } = await supabase
      .from('draft_projects')
      .select('*')
      .eq('id', draftId)
      .single()

    if (draftError || !draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    // Check user's account tier and regeneration limits
    const { data: account } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', draft.user_id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 })
    }

    // Check regeneration limit
    const maxGenerations = account.account_tier === 'pro_subscription' ? 10 : 3
    if ((draft.generation_count || 0) >= maxGenerations) {
      return NextResponse.json({ 
        error: `You've reached your generation limit (${maxGenerations}). Upgrade to Pro for more.` 
      }, { status: 403 })
    }

    // Parse user prompt if it exists in metadata
    const userPrompt = draft.metadata?.user_prompt
    let parsedData = draft
    
    if (userPrompt) {
      // Extract structured data from prompt using AI
      parsedData = await parseUserPrompt(userPrompt, draft)
    }

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          // Step 0.5: Image Analysis (if image uploaded or generate AI images)
          let imageAnalysis = null
          let aiGeneratedImages = null
          
          const uploadedImageUrl = parsedData.metadata?.uploaded_image_url || parsedData.logo_url
          
          if (uploadedImageUrl) {
            // Analyze uploaded image with Gemini
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 0,
              status: 'in_progress',
              message: 'Analyzing your uploaded image with AI...'
            })))
            
            try {
              imageAnalysis = await analyzeUploadedImage(uploadedImageUrl, {
                businessName: parsedData.business_name || draft.business_name,
                businessType: parsedData.business_type || draft.business_type || 'other',
                businessDescription: parsedData.business_description || draft.business_description || ''
              })
              console.log('âœ… Image analysis complete:', imageAnalysis)
            } catch (error) {
              console.error('âŒ Image analysis failed:', error)
              // Continue without image analysis
            }
            
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            controller.enqueue(encoder.encode(sendStreamChunk({
              type: 'step',
              stepIndex: 0,
              status: 'completed'
            })))
          } else {
            // No image uploaded - generate AI image suggestions with Gemini
            controller.enqueue(encoder.encode(sendStreamChunk({
              type: 'step',
              stepIndex: 0,
              status: 'in_progress',
              message: 'Generating perfect images for your website with AI...'
            })))
            
            try {
              aiGeneratedImages = await generateImageSuggestions({
                businessName: parsedData.business_name || draft.business_name,
                businessType: parsedData.business_type || draft.business_type || 'other',
                businessDescription: parsedData.business_description || draft.business_description || '',
                aestheticStyle: parsedData.aesthetic_style || draft.aesthetic_style || 'Modern and clean',
                preferredColors: parsedData.preferred_colors || draft.preferred_colors || 'Professional blue and white'
              })
              console.log('âœ… AI image suggestions complete:', aiGeneratedImages)
            } catch (error) {
              console.error('âŒ AI image generation failed:', error)
              // Fallback handled in the function
            }
            
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            controller.enqueue(encoder.encode(sendStreamChunk({
              type: 'step',
              stepIndex: 0,
              status: 'completed'
            })))
          }

          // Initialize reactComponentCode variable
          let reactComponentCode = ''
          
          // Step 0.5: Try Agentic Architecture (Cursor-style) first
          const useAgenticArchitecture = true // Feature flag
          let agenticSuccess = false
          
          if (useAgenticArchitecture) {
            try {
              controller.enqueue(encoder.encode(sendStreamChunk({
                type: 'step',
                stepIndex: 0,
                status: 'in_progress',
                message: 'Using agentic architecture to build project structure...'
              })))
              
              const { generateWithAgenticArchitecture } = await import('../../../../ai_builder/lib/agentic/agentic-generator')
              const { writeVFSToDatabase, getMainComponentFromTree } = await import('../../../../ai_builder/lib/agentic/file-writer')
              const { VirtualFileSystem } = await import('../../../../ai_builder/lib/agentic/virtual-filesystem')
              
              // P1 Feature 9: Progress callback to stream updates to client with percentage
              const progressCallback = (message: string, iteration?: number, totalIterations?: number) => {
                try {
                  if (iteration !== undefined && totalIterations !== undefined) {
                    const percentage = Math.round((iteration / totalIterations) * 100)
                    
                    controller.enqueue(encoder.encode(sendStreamChunk({
                      type: 'step',
                      stepIndex: 0,
                      status: 'in_progress',
                      message: `${message} (${iteration}/${totalIterations} - ${percentage}%)`,
                      progress: {
                        current: iteration,
                        total: totalIterations,
                        percentage: percentage
                      }
                    })))
                  } else {
                    controller.enqueue(encoder.encode(sendStreamChunk({
                      type: 'step',
                      stepIndex: 0,
                      status: 'in_progress',
                      message: message
                    })))
                  }
                } catch (e) {
                  // Ignore if stream is closed
                }
              }
              
              const agenticResult = await generateWithAgenticArchitecture(
                userPrompt || `Create a professional website for ${draft.business_name}`,
                {
                  businessName: parsedData.business_name || draft.business_name,
                  businessType: parsedData.business_type || draft.business_type,
                  businessDescription: parsedData.business_description || draft.business_description,
                  mustHavePages: parsedData.must_have_pages || draft.must_have_pages,
                  preferredColors: parsedData.preferred_colors || draft.preferred_colors
                },
                [],
                3,
                progressCallback
              )
              
              // Report compilation errors if any
              if (agenticResult.compilationErrors && agenticResult.compilationErrors.length > 0) {
                const errorCount = agenticResult.compilationErrors.length
                controller.enqueue(encoder.encode(sendStreamChunk({
                  type: 'step',
                  stepIndex: 0,
                  status: 'error',
                  message: `⚠️ ${errorCount} compilation error(s) found. Attempting to fix...`
                })))
              }
              
              if (agenticResult.success && Object.keys(agenticResult.fileTree).length > 0) {
                // Write files to database
                const vfs = new VirtualFileSystem()
                Object.entries(agenticResult.fileTree).forEach(([path, content]) => {
                  vfs.writeFile(path, content)
                })
                
                const writeResult = await writeVFSToDatabase(vfs, supabase, draftId)
                
                if (writeResult.success) {
                  reactComponentCode = getMainComponentFromTree(agenticResult.fileTree)
                  agenticSuccess = true
                  
                  const fileCount = Object.keys(agenticResult.fileTree).length
                  const iterationInfo = agenticResult.compilationIterations 
                    ? ` (${agenticResult.compilationIterations} fix iterations)`
                    : ''
                  
                  controller.enqueue(encoder.encode(sendStreamChunk({
                    type: 'step',
                    stepIndex: 0,
                    status: 'completed',
                    message: `Generated ${fileCount} files${iterationInfo}`
                  })))
                  
                  // Skip to preview
                  const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/preview/${draftId}`
                  
                  controller.enqueue(encoder.encode(sendStreamChunk({
                    type: 'preview',
                    url: previewUrl
                  })))
                  
                  await supabase
                    .from('draft_projects')
                    .update({
                      draft_url: previewUrl,
                      generation_count: (draft.generation_count || 0) + 1,
                      generated_at: new Date().toISOString(),
                      status: 'generated',
                      preview_expires_at: account.account_tier === 'default_draft' 
                        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                        : null
                    })
                    .eq('id', draftId)
                  
                  controller.enqueue(encoder.encode(sendStreamChunk({
                    type: 'complete'
                  })))
                  
                  controller.close()
                  return
                }
              }
            } catch (agenticError: any) {
              console.error('âŒ Agentic architecture error:', agenticError)
              // Continue with legacy method
            }
          }
          
          // Step 1: Analyzing requirements (legacy method)
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 1,
            status: 'in_progress',
            message: userPrompt ? 'Analyzing your prompt...' : 'Processing your business information...'
          })))

          await new Promise(resolve => setTimeout(resolve, 1000))

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 1,
            status: 'completed'
          })))

          // Step 2: Designing structure
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 2,
            status: 'in_progress',
            message: 'Creating page layout and navigation...'
          })))

          await new Promise(resolve => setTimeout(resolve, 1500))

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 2,
            status: 'completed'
          })))

          // Step 3: Generating Structure (Structural Lead - Claude Opus 4.5)
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 3,
            status: 'in_progress',
            message: 'Claude Opus 4.5 is designing the structure...'
          })))

          // Generate multi-page structure if enabled
          const { generateDefaultPages, generateNavigation } = await import('../../../../ai_builder/lib/ai/multi-page-generator')
          const businessType = parsedData.business_type || draft.business_type || 'default'
          const businessName = parsedData.business_name || draft.business_name
          const pages = generateDefaultPages(businessType, businessName)
          const navigation = generateNavigation(pages)

          // Build structure prompt for Claude Opus 4.5 (use parsed data + image context)
          const structurePrompt = buildStructurePrompt(parsedData, pages, navigation, imageAnalysis, aiGeneratedImages)

          // Call Anthropic Claude Opus 4.5 API for structure
          if (!ANTHROPIC_API_KEY) {
            controller.enqueue(encoder.encode(sendStreamChunk({
              type: 'error',
              error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file. Get your key from https://console.anthropic.com/settings/keys'
            })))
            controller.close()
            return
          }

          console.log('ðŸš€ Structural Lead: Claude Opus 4.5 generating project structure...')
          console.log('ðŸ“‹ Model:', CLAUDE_MODEL)
          
          // Create AbortController for timeout
          const abortController = new AbortController()
          const timeoutId = setTimeout(() => abortController.abort(), 120000) // 2 minute timeout
          
          let claudeResponse
          try {
            claudeResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: CLAUDE_MODEL,
                max_tokens: 4096, // Reduced from 8192 for faster response
              messages: [{
                role: 'user',
                content: structurePrompt
              }]
              }),
              signal: abortController.signal
            })
            
            clearTimeout(timeoutId)
          } catch (error: any) {
            clearTimeout(timeoutId)
            if (error.name === 'AbortError') {
              controller.enqueue(encoder.encode(sendStreamChunk({
                type: 'error',
                error: 'Request timeout: The structure generation took too long (2 minutes). Please try again with a shorter prompt or check your connection.'
              })))
              controller.close()
              return
            }
            throw error
          }

          console.log('Claude Opus 4.5 structure response status:', claudeResponse.status)

          if (!claudeResponse.ok) {
            const errorText = await claudeResponse.text()
            console.error('âŒ Claude Opus 4.5 API error:', errorText)
            
            // Better error handling for authentication errors
            if (claudeResponse.status === 401) {
              let errorMessage = 'Invalid Anthropic API key. '
              try {
                const errorData = JSON.parse(errorText)
                if (errorData.error?.message) {
                  errorMessage += errorData.error.message
                }
              } catch (e) {
                errorMessage += 'Please check your ANTHROPIC_API_KEY in .env.local'
              }
              
              if (!ANTHROPIC_API_KEY) {
                errorMessage = 'ANTHROPIC_API_KEY is not set. Please add it to your .env.local file. Get your key from https://console.anthropic.com/settings/keys'
              } else if (!ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
                errorMessage = 'Invalid API key format. Anthropic API keys should start with "sk-ant-". Please check your ANTHROPIC_API_KEY in .env.local'
              }
              
              controller.enqueue(encoder.encode(sendStreamChunk({
                type: 'error',
                error: errorMessage
              })))
              controller.close()
              return
            }
            
            throw new Error(`Claude Opus 4.5 API error: ${claudeResponse.status} - ${errorText}`)
          }

          const claudeData = await claudeResponse.json()
          const structureCode = claudeData.content?.[0]?.text || ''
          
          if (!structureCode) {
            throw new Error('No structure code generated from Claude Opus 4.5')
          }

          console.log('âœ… Claude Opus 4.5 structure received, content length:', structureCode.length)

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 3,
            status: 'completed',
            message: 'Structure complete'
          })))

          // Step 3.5: Polishing (Claude Opus 4.5 continues refinement)
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 3,
            status: 'in_progress',
            message: 'Claude Opus 4.5 is polishing the design...'
          })))

          // Build polish prompt for Claude Opus 4.5 (use parsed data + image context)
          // Pass structureCode (React component code) to polish prompt
          const polishPrompt = buildPolishPrompt(parsedData, structureCode, imageAnalysis, aiGeneratedImages, uploadedImageUrl)

          console.log('ðŸš€ Calling Anthropic Claude Opus 4.5 for polish...')
          console.log('ðŸ“‹ Model:', CLAUDE_MODEL)
          let polishedCode = ''

          if (!ANTHROPIC_API_KEY) {
            controller.enqueue(encoder.encode(sendStreamChunk({
              type: 'error',
              error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file. Get your key from https://console.anthropic.com/settings/keys'
            })))
            controller.close()
            return
          }

          // Create AbortController for timeout
          const polishAbortController = new AbortController()
          const polishTimeoutId = setTimeout(() => polishAbortController.abort(), 120000) // 2 minute timeout
          
          try {
            const claudeResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: CLAUDE_MODEL,
                max_tokens: 4096, // Reduced from 8192 for faster response
              messages: [{
                role: 'user',
                content: polishPrompt
              }]
              }),
              signal: polishAbortController.signal
            })
            
            clearTimeout(polishTimeoutId)

            console.log('Claude Opus 4.5 polish response status:', claudeResponse.status)

            if (claudeResponse.ok) {
              const claudeData = await claudeResponse.json()
              polishedCode = claudeData.content?.[0]?.text || ''
              
              if (polishedCode) {
                console.log('âœ… Claude Opus 4.5 polish response received, content length:', polishedCode.length)
            } else {
                console.warn('âš ï¸ Claude Opus 4.5 returned empty response')
                throw new Error('Claude Opus 4.5 returned empty polish response')
              }
            } else {
              const errorText = await claudeResponse.text()
              console.error('âŒ Claude Opus 4.5 API error:', errorText)
              
              // Better error handling for authentication errors
              if (claudeResponse.status === 401) {
                let errorMessage = 'Invalid Anthropic API key for polishing. '
                try {
                  const errorData = JSON.parse(errorText)
                  if (errorData.error?.message) {
                    errorMessage += errorData.error.message
                  }
                } catch (e) {
                  errorMessage += 'Please check your ANTHROPIC_API_KEY in .env.local'
                }
                
                if (!ANTHROPIC_API_KEY) {
                  errorMessage = 'ANTHROPIC_API_KEY is not set. Please add it to your .env.local file. Get your key from https://console.anthropic.com/settings/keys'
                } else if (!ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
                  errorMessage = 'Invalid API key format. Anthropic API keys should start with "sk-ant-". Please check your ANTHROPIC_API_KEY in .env.local'
                }
                
                controller.enqueue(encoder.encode(sendStreamChunk({
                  type: 'error',
                  error: errorMessage
                })))
                controller.close()
                return
              }
              
              throw new Error(`Claude Opus 4.5 API error: ${claudeResponse.status} - ${errorText}`)
            }
          } catch (error: any) {
            clearTimeout(polishTimeoutId)
            if (error.name === 'AbortError') {
              controller.enqueue(encoder.encode(sendStreamChunk({
                type: 'error',
                error: 'Request timeout: The polish generation took too long (2 minutes). Please try again with a shorter prompt or check your connection.'
              })))
              controller.close()
              return
            }
            console.error('âŒ Claude Opus 4.5 polish request failed:', error)
            throw error
          }

          // Use polished code - Store as React component code (not HTML)
          if (polishedCode) {
            console.log('âœ¨ Using polished code from Claude Opus 4.5')
            reactComponentCode = extractHTML(polishedCode)
          } else {
            console.warn('âš ï¸ No polish available, using Claude Opus 4.5 structure')
            reactComponentCode = extractHTML(structureCode)
          }

          // Clean up React component code (remove markdown, keep JSX)
          reactComponentCode = reactComponentCode.trim()
          
          // Prepare SEO data for metadata (no HTML conversion needed)
          const seoData = {
            title: `${parsedData.business_name || draft.business_name} - ${parsedData.business_type || 'Professional Website'}`,
            description: parsedData.business_description || draft.business_description || 'Professional website',
            keywords: [parsedData.business_type, parsedData.business_location, parsedData.business_name].filter(Boolean),
            businessName: parsedData.business_name || draft.business_name,
            businessType: parsedData.business_type || draft.business_type,
            location: parsedData.business_location || draft.business_location,
            url: '', // Will be set after preview URL is generated
          }

          await new Promise(resolve => setTimeout(resolve, 500))

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 3,
            status: 'completed',
            message: 'Design polished'
          })))

          // Step 4: Adding interactive features
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 4,
            status: 'in_progress',
            message: 'Adding JavaScript functionality...'
          })))

          await new Promise(resolve => setTimeout(resolve, 800))

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 4,
            status: 'completed'
          })))

          // Step 5: Optimizing for mobile
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 5,
            status: 'in_progress',
            message: 'Making it responsive...'
          })))

          await new Promise(resolve => setTimeout(resolve, 600))

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 5,
            status: 'completed'
          })))

          // Step 6: Deploying preview
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 6,
            status: 'in_progress',
            message: 'Creating preview URL...'
          })))

          // Generate preview URL (now uses React component route)
          const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/preview/${draftId}`

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'preview',
            url: previewUrl
          })))

          // Store pages structure in metadata
          const pagesData = pages && pages.length > 1 ? { pages, navigation } : null

          // Update draft project - Store React component code (primary) and HTML (fallback)
          await supabase
            .from('draft_projects')
            .update({
              draft_url: previewUrl,
              generation_count: (draft.generation_count || 0) + 1,
              generated_at: new Date().toISOString(),
              status: 'generated',
              preview_expires_at: account.account_tier === 'default_draft' 
                ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
                : null,
              metadata: {
                ...(draft.metadata || {}),
                component_code: reactComponentCode, // Primary: React component code
                react_code: reactComponentCode, // Alias for compatibility
                pages: pagesData,
                seo: seoData,
              }
            })
            .eq('id', draftId)

          await new Promise(resolve => setTimeout(resolve, 500))

          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'step',
            stepIndex: 6,
            status: 'completed'
          })))

          // Complete
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'complete',
            previewUrl
          })))

        } catch (error: any) {
          controller.enqueue(encoder.encode(sendStreamChunk({
            type: 'error',
            error: error.message || 'Generation failed'
          })))
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Parse user prompt and extract structured business information
 */
async function parseUserPrompt(userPrompt: string, draft: any): Promise<any> {
  try {
    const parsePrompt = `Extract structured business information from this user prompt. Return ONLY a JSON object with the following structure:

{
  "business_name": "extracted business name or 'Generated Business'",
  "business_type": "one of: clothing-fashion, technology-saas, food-beverage, real-estate, healthcare, finance, creative-portfolio, local-services, other",
  "business_location": "kenya, south-africa, rwanda, or other",
  "business_description": "detailed description extracted from prompt",
  "phone_number": "extracted phone number or empty string",
  "needs_ecommerce": true/false,
  "needs_crm": true/false,
  "preferred_colors": "color description or empty",
  "aesthetic_style": "Minimalist & Modern, Classic & Clean, Vibrant & Colorful, Rustic/Handmade, or Modern and clean",
  "tone_of_voice": "Professional & Formal, Friendly & Casual, Bold & Edgy, Inspirational & Warm, Sales-Oriented/Urgent, or Professional",
  "ideal_customer": "target audience description or empty",
  "key_differentiator": "unique selling point or empty",
  "target_keywords": "SEO keywords or empty",
  "conversion_goal": "Get Leads/Contacts, Buy Product Now, Book Appointment/Call, or Contact form submission"
}

User Prompt:
"${userPrompt}"

Extract as much information as possible. If something isn't mentioned, use sensible defaults. Return ONLY the JSON object, no markdown, no explanations.`

    if (!ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not set, using defaults for prompt parsing')
      return draft
    }

    // Create AbortController for timeout
    const parseAbortController = new AbortController()
    const parseTimeoutId = setTimeout(() => parseAbortController.abort(), 30000) // 30 second timeout for parsing
    
    let response
    try {
      response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
          model: CLAUDE_MODEL,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: parsePrompt
        }]
        }),
        signal: parseAbortController.signal
      })
      
      clearTimeout(parseTimeoutId)
    } catch (error: any) {
      clearTimeout(parseTimeoutId)
      if (error.name === 'AbortError') {
        console.warn('Prompt parsing timeout, using defaults')
        return draft
      }
      console.warn('Failed to parse prompt, using defaults:', error)
      return draft
    }

    if (!response.ok) {
      console.warn('Failed to parse prompt, using defaults')
      return draft
    }

    const data = await response.json()
    const jsonText = data.content?.[0]?.text || ''
    
    // Extract JSON from response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('No JSON found in parse response, using defaults')
      return draft
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // Merge parsed data with existing draft data
    return {
      ...draft,
      business_name: parsed.business_name || draft.business_name || 'Generated Business',
      business_type: parsed.business_type || draft.business_type || 'other',
      business_location: parsed.business_location || draft.business_location || 'kenya',
      business_description: parsed.business_description || draft.business_description || userPrompt,
      phone_number: parsed.phone_number || draft.phone_number || '',
      needs_ecommerce: parsed.needs_ecommerce !== undefined ? parsed.needs_ecommerce : draft.needs_ecommerce || false,
      needs_crm: parsed.needs_crm !== undefined ? parsed.needs_crm : draft.needs_crm || false,
      preferred_colors: parsed.preferred_colors || draft.preferred_colors || '',
      aesthetic_style: parsed.aesthetic_style || draft.aesthetic_style || 'Modern and clean',
      tone_of_voice: parsed.tone_of_voice || draft.tone_of_voice || 'Professional',
      ideal_customer: parsed.ideal_customer || draft.ideal_customer || '',
      key_differentiator: parsed.key_differentiator || draft.key_differentiator || '',
      target_keywords: parsed.target_keywords || draft.target_keywords || '',
      conversion_goal: parsed.conversion_goal || draft.conversion_goal || 'Contact form submission'
    }
  } catch (error) {
    console.error('Error parsing user prompt:', error)
    // Return draft with prompt as description
    return {
      ...draft,
      business_description: userPrompt || draft.business_description
    }
  }
}

/**
 * Load metadata files from the block library
 */
function loadMetadata() {
  try {
    const libraryPath = path.join(process.cwd(), 'ai_builder', 'library', 'config')
    
    const industryTags = JSON.parse(
      fs.readFileSync(path.join(libraryPath, 'industry-tags.json'), 'utf-8')
    )
    
    const assemblyRules = JSON.parse(
      fs.readFileSync(path.join(libraryPath, 'assembly-rules.json'), 'utf-8')
    )
    
    const blockTypes = JSON.parse(
      fs.readFileSync(path.join(libraryPath, 'block-types.json'), 'utf-8')
    )
    
    return { industryTags, assemblyRules, blockTypes }
  } catch (error) {
    console.error('Error loading metadata files:', error)
    return null
  }
}

/**
 * Convert HTML to React JSX format
 */
function convertHtmlToReact(html: string): string {
  if (!html) return ''
  
  // Remove HTML comments (but keep block metadata comments for reference)
  let jsx = html.replace(/<!--[\s\S]*?-->/g, (match) => {
    // Keep block metadata comments, remove others
    if (match.includes('BLOCK TYPE:') || match.includes('PARAMETERS:') || match.includes('USAGE:')) {
      return `{/* ${match.replace(/<!--|-->/g, '').trim()} */}`
    }
    return ''
  })
  
  // Convert class to className
  jsx = jsx.replace(/\bclass=/g, 'className=')
  
  // Convert {{variable}} to {variable} (React props)
  jsx = jsx.replace(/\{\{(\w+)\}\}/g, '{$1}')
  
  // Convert self-closing tags
  jsx = jsx.replace(/<img([^>]*?)>/g, '<img$1 />')
  jsx = jsx.replace(/<input([^>]*?)>/g, '<input$1 />')
  jsx = jsx.replace(/<br>/g, '<br />')
  jsx = jsx.replace(/<hr>/g, '<hr />')
  
  // Convert href="#" to onClick handlers for React
  jsx = jsx.replace(/href="#(\w+)"/g, 'href="#$1" onClick={(e) => { e.preventDefault(); document.querySelector("#$1")?.scrollIntoView({ behavior: "smooth" }); }}')
  
  return jsx.trim()
}

/**
 * Read HTML block file from library and convert to React JSX
 */
function readBlockFile(blockName: string, category: 'generic' | 'signature' | 'industry', industry?: string): string | null {
  try {
    let blockPath: string
    if (category === 'industry' && industry) {
      blockPath = path.join(process.cwd(), 'ai_builder', 'library', 'industry', industry, `${blockName}.html`)
    } else {
      blockPath = path.join(process.cwd(), 'ai_builder', 'library', category, `${blockName}.html`)
    }
    
    if (fs.existsSync(blockPath)) {
      const html = fs.readFileSync(blockPath, 'utf-8')
      // Convert to React JSX format
      return convertHtmlToReact(html)
    }
    return null
  } catch (error) {
    console.error(`Error reading block file ${blockName} from ${category}:`, error)
    return null
  }
}

/**
 * Get list of blocks to load based on industry and assembly order
 */
function getBlocksToLoad(businessType: string | null, metadata: any): { name: string, category: 'generic' | 'signature' | 'industry', priority: number }[] {
  if (!metadata || !businessType) {
    // Default blocks if no industry match
    return [
      { name: 'header', category: 'generic', priority: 1 },
      { name: 'hero', category: 'generic', priority: 2 },
      { name: 'features', category: 'generic', priority: 3 },
      { name: 'testimonial', category: 'generic', priority: 4 },
      { name: 'contact-form', category: 'generic', priority: 5 },
      { name: 'footer', category: 'generic', priority: 6 }
    ]
  }
  
  const industryKey = businessType.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const industry = metadata.industryTags?.industries?.[industryKey]
  const industryRules = metadata.assemblyRules?.assemblyRules?.industrySpecific?.[industryKey]
  
  const blocks: { name: string, category: 'generic' | 'signature' | 'industry', priority: number }[] = []
  let priority = 1
  
  // Always start with header
  blocks.push({ name: 'header', category: 'generic', priority: priority++ })
  
  // Add industry-specific blocks
  if (industry?.blocks) {
    industry.blocks.forEach((blockName: string) => {
      // Try industry-specific first
      const industryBlock = readBlockFile(blockName, 'industry', industryKey)
      if (industryBlock) {
        blocks.push({ name: blockName, category: 'industry', priority: priority++ })
      } else {
        // Fallback to generic if industry block doesn't exist
        const genericBlock = readBlockFile(blockName, 'generic')
        if (genericBlock) {
          blocks.push({ name: blockName, category: 'generic', priority: priority++ })
        }
      }
    })
  }
  
  // Add suggested generic blocks
  if (industry?.suggestedBlocks) {
    industry.suggestedBlocks.forEach((blockName: string) => {
      if (!blocks.find(b => b.name === blockName)) {
        blocks.push({ name: blockName, category: 'generic', priority: priority++ })
      }
    })
  }
  
  // Add blocks from assembly order if available
  if (industryRules?.order) {
    industryRules.order.forEach((blockName: string) => {
      if (!blocks.find(b => b.name === blockName)) {
        // Try to find in industry, then generic
        const industryBlock = readBlockFile(blockName, 'industry', industryKey)
        if (industryBlock) {
          blocks.push({ name: blockName, category: 'industry', priority: priority++ })
        } else {
          const genericBlock = readBlockFile(blockName, 'generic')
          if (genericBlock) {
            blocks.push({ name: blockName, category: 'generic', priority: priority++ })
          }
        }
      }
    })
  }
  
  // Always end with footer
  if (!blocks.find(b => b.name === 'footer')) {
    blocks.push({ name: 'footer', category: 'generic', priority: priority++ })
  }
  
  // Sort by priority
  return blocks.sort((a, b) => a.priority - b.priority)
}

/**
 * Load React component information for AI prompts
 * Returns component usage instructions instead of HTML templates
 */
function loadReactComponents(businessType: string | null, metadata: any): string {
  const blocksToLoad = getBlocksToLoad(businessType, metadata)
  
  // Map of available React components (Phase 1 - Essential components)
  const availableComponents: { [key: string]: { props: string, example: string } } = {
    'header': {
      props: 'businessName, logoUrl?, navItems?, ctaText?, ctaLink?, primaryColor?',
      example: `<Header businessName="${businessType || 'Company'}" primaryColor="teal-600" />`
    },
    'hero': {
      props: 'heroTitle, heroSubtitle, ctaPrimaryText?, ctaPrimaryLink?, ctaSecondaryText?, ctaSecondaryLink?, backgroundColor?, primaryColor?',
      example: `<Hero heroTitle="Welcome" heroSubtitle="Build amazing things" primaryColor="teal-600" />`
    },
    'features': {
      props: 'sectionTitle?, sectionDescription?, features: FeatureItem[], columns?, primaryColor?',
      example: `<Features features={featuresData} sectionTitle="Our Features" />`
    },
    'pricing': {
      props: 'sectionTitle?, plans: PricingPlan[], primaryColor?',
      example: `<Pricing plans={plansData} />`
    },
    'testimonial': {
      props: 'sectionTitle?, sectionDescription?, testimonials: TestimonialItem[], columns?, showRating?, backgroundColor?',
      example: `<Testimonial testimonials={testimonialsData} />`
    },
    'footer': {
      props: 'businessName, footerDescription?, businessEmail?, businessPhone?, businessAddress?, socialLinks?, quickLinks?',
      example: `<Footer businessName="${businessType || 'Company'}" />`
    }
  }
  
  let componentsSection = '\n\n=== REACT COMPONENT LIBRARY - IMPORT AND USE THESE ===\n\n'
  componentsSection += 'ðŸš¨ CRITICAL: You have access to pre-built React components. You MUST import and use these components instead of creating HTML from scratch.\n\n'
  componentsSection += 'COMPONENT LOCATION: All components are in: ./components/\n\n'
  componentsSection += 'AVAILABLE COMPONENTS:\n\n'
  
  let componentCount = 0
  const essentialComponents = ['header', 'hero', 'features', 'pricing', 'testimonial', 'footer']
  
  essentialComponents.forEach((componentName) => {
    const component = availableComponents[componentName]
    if (component) {
      componentCount++
      componentsSection += `${componentCount}. ${componentName.toUpperCase()} Component\n`
      componentsSection += `   Import: import { ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} } from './components';\n`
      componentsSection += `   Props: ${component.props}\n`
      componentsSection += `   Example: ${component.example}\n\n`
    }
  })
  
  componentsSection += '=== COMPONENT USAGE INSTRUCTIONS ===\n\n'
  componentsSection += '1. IMPORT COMPONENTS at the top of your file:\n'
  componentsSection += '   import { Header, Hero, Features, Pricing, Testimonial, Footer } from \'./components\';\n\n'
  componentsSection += '2. PREPARE DATA for components (arrays, objects):\n'
  componentsSection += '   const featuresData = [\n'
  componentsSection += '     { title: "Feature 1", description: "Description here" },\n'
  componentsSection += '     { title: "Feature 2", description: "Description here" },\n'
  componentsSection += '   ];\n\n'
  componentsSection += '3. USE COMPONENTS in your JSX:\n'
  componentsSection += '   <Header businessName="Company Name" />\n'
  componentsSection += '   <Hero heroTitle="..." heroSubtitle="..." />\n'
  componentsSection += '   <Features features={featuresData} />\n\n'
  componentsSection += '4. PASS PROPS with real content from business information\n'
  componentsSection += '5. DO NOT create HTML - use the components!\n\n'
  
  return componentsSection
}

/**
 * Get industry-specific block information
 */
function getIndustryBlocks(businessType: string | null, metadata: any): string {
  if (!metadata || !businessType) return ''
  
  const industryKey = businessType.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const industry = metadata.industryTags?.industries?.[industryKey]
  
  if (!industry) return ''
  
  const blocks = industry.blocks || []
  const suggestedBlocks = industry.suggestedBlocks || []
  const primaryColor = industry.primaryColor || 'blue'
  
  return `
INDUSTRY-SPECIFIC BLOCKS FOR "${businessType}":
Required Industry Blocks: ${blocks.join(', ')}
Suggested Generic Blocks: ${suggestedBlocks.join(', ')}
Primary Color: ${primaryColor}
`
}

/**
 * Get assembly order for industry
 */
function getAssemblyOrder(businessType: string | null, metadata: any): string {
  if (!metadata || !businessType) return ''
  
  const industryKey = businessType.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const industryRules = metadata.assemblyRules?.assemblyRules?.industrySpecific?.[industryKey]
  
  if (industryRules) {
    return `
BLOCK ASSEMBLY ORDER:
Required: ${(industryRules.required || []).join(', ')}
Recommended: ${(industryRules.recommended || []).join(', ')}
Order: ${(industryRules.order || []).join(' â†’ ')}
`
  }
  
  // Fallback to standard layout
  const standardOrder = metadata.assemblyRules?.assemblyRules?.layoutOrder?.standard || []
  return `
BLOCK ASSEMBLY ORDER (Standard):
${standardOrder.join(' â†’ ')}
`
}

function getIndustryReference(businessType: string | null): string {
  const industryMap: { [key: string]: string } = {
    'clothing-fashion': 'Clothing/Fashion E-commerce:\n- Reference: Nike, Adidas, Zara, ASOS\n- Design Philosophy: Clean, modern, product-focused, lifestyle imagery, bold typography\n- Key Elements: Large product images, minimal navigation, strong brand identity',
    'technology-saas': 'Technology/SaaS:\n- Reference: Apple, Stripe, Notion, Linear\n- Design Philosophy: Minimalist, premium, clear messaging, lots of whitespace, subtle animations\n- Key Elements: Clean interfaces, clear value props, modern gradients, professional typography',
    'food-beverage': 'Food & Beverage:\n- Reference: Starbucks, McDonald\'s, Blue Bottle Coffee\n- Design Philosophy: Warm, inviting, visual, appetizing imagery, friendly tone\n- Key Elements: High-quality food photography, warm color palettes, clear menu/pricing',
    'real-estate': 'Real Estate:\n- Reference: Zillow, Realtor.com, Airbnb\n- Design Philosophy: Trustworthy, professional, image-heavy, search-focused\n- Key Elements: Property galleries, location maps, clear CTAs, professional imagery',
    'healthcare': 'Healthcare/Medical:\n- Reference: Mayo Clinic, WebMD, One Medical\n- Design Philosophy: Clean, trustworthy, accessible, calming colors\n- Key Elements: Clear information hierarchy, easy navigation, professional imagery',
    'finance': 'Finance/Fintech:\n- Reference: Stripe, Square, Robinhood\n- Design Philosophy: Professional, secure, modern, trustworthy\n- Key Elements: Clean dashboards, clear pricing, security indicators, modern UI',
    'creative-portfolio': 'Creative/Portfolio:\n- Reference: Behance, Dribbble, Awwwards\n- Design Philosophy: Visual, creative, showcase-focused, bold\n- Key Elements: Portfolio galleries, creative layouts, visual storytelling',
    'local-services': 'Local Services:\n- Reference: Yelp, Thumbtack, TaskRabbit\n- Design Philosophy: Local, trustworthy, review-focused, accessible\n- Key Elements: Location prominence, reviews/testimonials, clear contact methods',
  }
  
  return industryMap[businessType || 'other'] || 'Other:\n- Think about what makes a HIGH-CALIBER website in this space\n- What would a $1M+ company in this space look like?\n- What design elements convey premium quality and professionalism?'
}

function buildStructurePrompt(draft: any, pages?: any[], navigation?: any[], imageAnalysis?: any, aiGeneratedImages?: any): string {
  // Load metadata and React component information
  const metadata = loadMetadata()
  const componentInfo = loadReactComponents(draft.business_type, metadata)
  
  // Load industry registry and inject registry keys (not full data)
  let registryContext = ''
  try {
    const { getIndustryConfig, getAllowedBlocks, getThemeDefaults } = require('../../../../ai_builder/library/registry.ts')
    const industryConfig = getIndustryConfig(draft.business_type)
    const allowedBlocks = getAllowedBlocks(draft.business_type)
    const themeDefaults = getThemeDefaults(draft.business_type)
    
    // Inject registry keys and structure (not full siteData text)
    registryContext = `\n\n=== INDUSTRY REGISTRY CONTEXT ===\n\nIndustry: ${draft.business_type || 'fitness'}\nAllowed Components: ${allowedBlocks.join(', ')}\nRecommended Layout: ${industryConfig.recommendedLayout.join(' â†’ ')}\nTheme: primary=${themeDefaults.primary}, secondary=${themeDefaults.secondary}\nSiteData File: ${industryConfig.dataPath}\n\n=== SITEDATA STRUCTURE (Reference Only) ===\n\nsiteData is globally available with this structure:\n- siteData.theme: { primaryColor, secondaryColor, accentColor }\n- siteData.nav: { businessName, links[], ctaText, ctaLink }\n- siteData.hero: { title, subtitle, ctaPrimary, ctaPrimaryLink, ctaSecondary, backgroundImage }\n- siteData.features: Array<{ title, description, icon?, image? }>\n- siteData.plans: Array<{ name, price, billingPeriod, isFeatured, features[], ctaText }>\n- siteData.testimonials: Array<{ quote, name, rating?, position?, company?, photo? }>\n- siteData.footer: { businessName, description, businessEmail, businessPhone, socialLinks }\n\nðŸš¨ CRITICAL: Reference siteData directly. Do NOT recreate this structure.\n\nExample Usage:\n- <Header navItems={siteData.nav.links} businessName={siteData.nav.businessName} primaryColor={siteData.theme.primaryColor} />\n- <Hero heroTitle={siteData.hero.title} heroSubtitle={siteData.hero.subtitle} primaryColor={siteData.theme.primaryColor} />\n- <Features features={siteData.features} primaryColor={siteData.theme.primaryColor} />\n- <Pricing plans={siteData.plans} primaryColor={siteData.theme.primaryColor} />\n- <Testimonial testimonials={siteData.testimonials} />\n- <Footer businessName={siteData.footer.businessName} />\n`
  } catch (error) {
    console.warn('Could not load registry:', error)
  }
  
  const pagesInfo = pages && pages.length > 1 
    ? `\n\nMULTI-PAGE STRUCTURE:
This website should have ${pages.length} pages:
${pages.map(p => `- ${p.slug === 'index' ? 'Home' : p.slug}: ${p.title}`).join('\n')}

Navigation should include: ${navigation?.map(n => n.label).join(', ') || 'Home, About, Services, Contact'}

Generate the HOME PAGE (index) first with these blocks: ${pages.find(p => p.slug === 'index')?.blocks.join(', ') || 'header, hero, features, testimonial, footer'}
`
    : ''

  // Build image context string
  let imageContext = ''
  if (imageAnalysis) {
    imageContext = `\n\nðŸŽ¨ UPLOADED IMAGE ANALYSIS (from Gemini AI):
Description: ${imageAnalysis.description}
Suggested Placement: ${imageAnalysis.suggestedImages.join(', ')}
Extracted Color Palette: ${imageAnalysis.colorPalette.join(', ')}
Style Recommendations: ${imageAnalysis.styleRecommendations}

IMPORTANT: Use these colors and style recommendations in your design. This image will be used as the hero background.`
  } else if (aiGeneratedImages) {
    imageContext = `\n\nðŸŽ¨ AI-SELECTED IMAGES (from Gemini AI):
These images were carefully selected by AI to match the business:
- Hero Background: photo-${aiGeneratedImages.heroImage}
- About Section: photo-${aiGeneratedImages.aboutImage}
- Service Cards: ${aiGeneratedImages.serviceImages.map((id: string) => `photo-${id}`).join(', ')}

Descriptions: ${aiGeneratedImages.imageDescriptions.join(' | ')}

IMPORTANT: Use these exact Unsplash photo IDs in your design.`
  }

  return `ðŸš¨ SYSTEM ROLE & MANDATE ðŸš¨

You are the STRUCTURAL LEAD - Claude Opus 4.5. Your task: Assemble a production-ready React component using the registry-selected components and siteData.

ðŸš¨ CRITICAL CONSTRAINTS:
- Output MUST be under 4,000 characters
- Use registry-provided components only
- Reference siteData (globally available) - DO NOT create data arrays
- Generate clean, concise component assembly code (~20-50 lines)

=== ASSEMBLY INSTRUCTIONS ===

1. IMPORT: Use registry-provided components from './components'
2. ASSEMBLE: Follow the recommended layout order from registry
3. REFERENCE: Use siteData for all content (structure provided above)
4. STYLE: Pass theme colors as props: primaryColor={siteData.theme.primaryColor}

Output Format:
\`\`\`jsx
import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header navItems={siteData.nav.links} businessName={siteData.nav.businessName} primaryColor={siteData.theme.primaryColor} />
      <Hero heroTitle={siteData.hero.title} heroSubtitle={siteData.hero.subtitle} primaryColor={siteData.theme.primaryColor} />
      <Features features={siteData.features} primaryColor={siteData.theme.primaryColor} />
      <Pricing plans={siteData.plans} primaryColor={siteData.theme.primaryColor} />
      <Testimonial testimonials={siteData.testimonials} />
      <Footer businessName={siteData.footer.businessName} />
    </div>
  );
}
\`\`\`

${componentInfo}
${registryContext}

=== CRITICAL INSTRUCTIONS FOR USING REACT COMPONENTS ===

ðŸš¨ YOU MUST IMPORT AND USE THE PRE-BUILT REACT COMPONENTS ðŸš¨

1. IMPORT COMPONENTS: Add import statement at the top:
   \`\`\`jsx
   import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';
   \`\`\`

2. USE SITEDATA: siteData is globally available. Reference it directly:
   - siteData.features - Array of feature objects
   - siteData.plans - Array of pricing plans  
   - siteData.testimonials - Array of testimonials
   - siteData.nav - Navigation configuration
   - siteData.hero - Hero section content
   - siteData.footer - Footer configuration
   - siteData.theme - Theme colors (primaryColor, secondaryColor)
   
   ðŸš¨ CRITICAL: Do NOT create data arrays. Use siteData directly. Example: <Features features={siteData.features} />

3. USE COMPONENTS: Render components with siteData props:
   - <Header navItems={siteData.nav.links} businessName={siteData.nav.businessName} primaryColor={siteData.theme.primaryColor} />
   - <Hero heroTitle={siteData.hero.title} heroSubtitle={siteData.hero.subtitle} primaryColor={siteData.theme.primaryColor} />
   - <Features features={siteData.features} primaryColor={siteData.theme.primaryColor} />
   - <Pricing plans={siteData.plans} primaryColor={siteData.theme.primaryColor} />
   - <Testimonial testimonials={siteData.testimonials} />
   - <Footer businessName={siteData.footer.businessName} />

5. COMPONENT ORDER: header â†’ hero â†’ features â†’ pricing â†’ testimonial â†’ footer

=== OUTPUT FORMAT REQUIREMENTS ===

Your output MUST be a complete React component that imports and uses the pre-built components:

\`\`\`jsx
import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';

export default function LandingPage() {
  // siteData is globally available - no need to define data arrays
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        navItems={siteData.nav.links} 
        businessName={siteData.nav.businessName} 
        primaryColor={siteData.theme.primaryColor} 
      />
      <Hero 
        heroTitle={siteData.hero.title}
        heroSubtitle={siteData.hero.subtitle}
        ctaPrimaryText={siteData.hero.ctaPrimary}
        ctaPrimaryLink={siteData.hero.ctaPrimaryLink}
        primaryColor={siteData.theme.primaryColor}
      />
      <Features 
        features={siteData.features} 
        sectionTitle="Our Features"
        primaryColor={siteData.theme.primaryColor}
      />
      <Pricing 
        plans={siteData.plans} 
        primaryColor={siteData.theme.primaryColor}
      />
      <Testimonial 
        testimonials={siteData.testimonials} 
      />
      <Footer 
        businessName={siteData.footer.businessName}
        businessEmail={siteData.footer.businessEmail}
      />
    </div>
  );
}
\`\`\`

CRITICAL: 
- Import components from './components'
- Use siteData (globally available) - DO NOT create data arrays
- Reference siteData directly: <Features features={siteData.features} />
- DO NOT create HTML from scratch
- DO NOT output raw HTML
- Keep output under 4,000 characters total

${pagesInfo}${imageContext}

STRUCTURE REQUIREMENTS:
- Semantic HTML5 (header, nav, main, section, footer)
- Modern CSS with flexbox/grid
- Responsive design (mobile-first)
- Working navigation
- Hero section with headline and subheadline
- About section with content
- Services/Features section (grid of 3-4 cards)
- Contact section with form
- Footer with contact info
${draft.needs_ecommerce ? '- Products section with grid' : ''}
${draft.needs_crm ? '- Login section structure' : ''}

BUSINESS INFO:
Name: ${draft.business_name}
Industry: ${draft.business_type || 'Other'}
Description: ${draft.business_description}
Location: ${draft.business_location}
Email: ${draft.email}
Phone: ${draft.phone_number || 'Not provided'}

DESIGN BASICS:
- Colors: ${draft.preferred_colors || 'Professional blue and white'}
- Style: ${draft.aesthetic_style || 'Modern and clean'}

SOCIAL LINKS:
${draft.facebook_link ? `Facebook: ${draft.facebook_link}` : ''}
${draft.instagram_link ? `Instagram: ${draft.instagram_link}` : ''}
${draft.twitter_link ? `Twitter: ${draft.twitter_link}` : ''}
${draft.linkedin_link ? `LinkedIn: ${draft.linkedin_link}` : ''}

${draft.logo_url ? 'Include logo in header' : ''}

ðŸš¨ OUTPUT FORMAT - REACT COMPONENT WITH IMPORTS ðŸš¨

Return ONLY a complete React component that imports and uses the pre-built components:

\`\`\`jsx
import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';

export default function LandingPage() {
  // Prepare polished data for components
  const featuresData = [
    {
      title: "Premium Feature 1",
      description: "Detailed description with compelling copy",
      image: "https://images.unsplash.com/photo-[IMAGE_ID]?w=600&h=400&fit=crop",
    },
    // ... more features
  ];

  const plansData = [
    {
      planName: "Starter",
      price: "29",
      billingPeriod: "month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      isPopular: false,
    },
    // ... more plans
  ];

  const testimonialsData = [
    {
      quote: "Exceptional service and quality!",
      name: "John Doe",
      rating: 5,
      position: "CEO",
      company: "Company Name",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    // ... more testimonials
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header businessName="${draft.business_name}" primaryColor="teal-600" />
      <Hero 
        heroTitle="Your compelling headline"
        heroSubtitle="Your descriptive subheading"
        primaryColor="teal-600"
      />
      <Features features={featuresData} sectionTitle="Our Features" />
      <Pricing plans={plansData} />
      <Testimonial testimonials={testimonialsData} />
      <Footer businessName="${draft.business_name}" />
    </div>
  );
}
\`\`\`

CRITICAL REQUIREMENTS:
- MUST import components from './components'
- MUST prepare data arrays/objects with real, polished content
- MUST use components with all required props
- Use Tailwind CSS utility classes ONLY (components already styled)
- NO <style> tags
- NO custom CSS
- NO raw HTML - ONLY React components
- All content must be real and compelling

Focus on polishing the data and using components correctly. Return ONLY the React component code.`
}

function buildPolishPrompt(draft: any, structureHtml: string, imageAnalysis?: any, aiGeneratedImages?: any, uploadedImageUrl?: string): string {
  // Truncate if too long to avoid token limits
  const htmlPreview = structureHtml.length > 5000 
    ? structureHtml.substring(0, 5000) + '\n... (structure continues)'
    : structureHtml

  // Determine which images to use
  let imageIds: string[]
  let heroImageUrl = ''
  let imageContext = ''
  
  if (uploadedImageUrl) {
    // Use uploaded image as hero
    heroImageUrl = uploadedImageUrl
    imageContext = `\n\nðŸŽ¨ USER UPLOADED IMAGE (Analyzed by Gemini AI):
Hero Background: ${uploadedImageUrl}
${imageAnalysis ? `
AI Analysis:
- Description: ${imageAnalysis.description}
- Extracted Colors: ${imageAnalysis.colorPalette.join(', ')}
- Style: ${imageAnalysis.styleRecommendations}

CRITICAL: Use this uploaded image as the hero background. Match the color palette (${imageAnalysis.colorPalette.join(', ')}) throughout the design.
` : ''}
Use generic high-quality Unsplash images for other sections (about, services).`
    
    // Get fallback images for other sections
    imageIds = ['1522071820081-009f0129c71c', '1551434678-e076c223a692', '1498050105-86-1cdfe097e819']
  } else if (aiGeneratedImages) {
    // Use AI-generated image suggestions
    imageContext = `\n\nðŸŽ¨ AI-SELECTED IMAGES (Carefully chosen by Gemini AI):
${aiGeneratedImages.imageDescriptions.join('\n')}

CRITICAL IMAGES TO USE:
- Hero Background: https://images.unsplash.com/photo-${aiGeneratedImages.heroImage}
- About Section: https://images.unsplash.com/photo-${aiGeneratedImages.aboutImage}
- Service Cards: 
  ${aiGeneratedImages.serviceImages.map((id: string, idx: number) => `  ${idx + 1}. https://images.unsplash.com/photo-${id}`).join('\n')}

These images were specifically selected to match the business type and aesthetic. USE THESE EXACT IMAGES.`
    
    imageIds = [aiGeneratedImages.heroImage, aiGeneratedImages.aboutImage, ...aiGeneratedImages.serviceImages]
  } else {
    // Fallback to default images by business type
  const getImageIds = (businessType: string | null) => {
    const imageMap: { [key: string]: string[] } = {
      'technology-saas': ['1551434678-e076c223a692', '1518770660439-4636190af475', '1461749280689-9cc2c0c0f5b8'],
      'clothing-fashion': ['1441986300917-64674bd600d8', '1490482649376-0a5e9f5b0b0a', '1483985988355-763743e7a870'],
      'food-beverage': ['1555939596-4b03f3b8c8b0', '1504674900247-0877df9cc836', '1556910096-6f5e5b160d33'],
      'real-estate': ['1560518883-ce09059eeffa', '1568605114967-8130f3a23494', '1564013799919-ab6080273ca4'],
      'healthcare': ['1576091160391-481585b42331', '1576091160550-2173dba999a8', '1559757148-5c63bea19094'],
      'finance': ['1551288049-beb62ce59672', '1554224154-26032a4c5c5b', '1554224155-8d04cb21cdc0'],
    }
    return imageMap[businessType || ''] || ['1551434678-e076c223a692', '1522071820081-009f0129c71c', '1498050105-86-1cdfe097e819']
    }
    imageIds = getImageIds(draft.business_type)
  }

  return `ðŸš¨ðŸš¨ðŸš¨ CRITICAL MISSION: Transform this BASIC HTML into a STUNNING, PREMIUM React component that looks like it cost $20,000+ to design.

ðŸš¨ SYSTEM ROLE & MANDATE ðŸš¨

You are the STRUCTURAL LEAD - a Senior Full-Stack UI/UX Architect. As the structural lead, you are responsible for refining and perfecting the foundational architecture created in the structure phase. Your output MUST be a clean, functional React component styled exclusively with Tailwind CSS utility classes.

=== CORE CONSTRAINTS & OUTPUT RULES ===

1. FRAMEWORK: Output MUST be a single, self-contained React Functional Component:
   \`\`\`jsx
   export default function LandingPage() {
     return (
       <div className="min-h-screen bg-gray-50">
         {/* Your polished components here */}
       </div>
     );
   }
   \`\`\`

2. STYLING: Use Tailwind CSS classes ONLY. Do NOT generate separate <style> tags or custom CSS. All styling must use Tailwind utility classes with responsive prefixes (sm:, md:, lg:).

3. CONTENT: Eliminate ALL generic placeholder text. All text must be contextually filled based on the business information.

4. NO BOILERPLATE: Do NOT include \`import React from 'react';\` unless explicitly required for hooks (useState, useEffect, etc.).

You are an ELITE web designer. The current HTML is functional but LOOKS CHEAP. Your job is to convert it to React JSX and make it EXCEPTIONAL and PREMIUM.

BUSINESS CONTEXT:
- Name: ${draft.business_name}
- Industry: ${draft.business_type || 'Other'}
- Description: ${draft.business_description}
- Target Audience: ${draft.ideal_customer || 'General audience'}
- Key Differentiator: ${draft.key_differentiator || 'Quality service'}

DESIGN REQUIREMENTS:
- Colors: ${draft.preferred_colors || 'Professional blue and white'}
- Style: ${draft.aesthetic_style || 'Modern and clean'}
- Tone: ${draft.tone_of_voice || 'Professional'}
${imageAnalysis ? `- Color Palette (from uploaded image): ${imageAnalysis.colorPalette.join(', ')}` : ''}
${imageAnalysis ? `- Style Guidance (from AI analysis): ${imageAnalysis.styleRecommendations}` : ''}

INDUSTRY INSPIRATION:
${getIndustryReference(draft.business_type)}
${imageContext}

CURRENT CODE (BASIC - NEEDS COMPLETE TRANSFORMATION):
\`\`\`jsx
${htmlPreview.length > 3000 ? htmlPreview.substring(0, 3000) + '\n... (code continues)' : htmlPreview}
\`\`\`

ðŸš¨ CRITICAL: The code above may be basic HTML or incomplete React. You MUST convert it to use the React components from './components'.

ðŸš¨ MANDATORY TRANSFORMATIONS (DO ALL OF THESE):

1. HERO SECTION - MUST BE STUNNING:
   ${uploadedImageUrl 
     ? `- ðŸš¨ CRITICAL: Use the UPLOADED IMAGE as hero background: background-image: url('${uploadedImageUrl}');`
     : `- ADD Unsplash background image: background-image: url('https://images.unsplash.com/photo-${imageIds[0]}?w=1920&h=1080&fit=crop');`
   }
   - Full viewport height (min-height: 100vh)
   - Dark overlay: background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7));
   - Large headline: font-size: 64px+, font-weight: 700, white text with text-shadow
   - Compelling subheadline: font-size: 24px, lighter weight
   - CTA button: Large, gradient background, white text, hover effects
   - Center content vertically and horizontally

2. TYPOGRAPHY - PREMIUM QUALITY (Using Tailwind):
   - Add Google Fonts link in the component (or use Tailwind font classes)
   - Use Tailwind typography classes: text-6xl md:text-7xl for h1, text-3xl md:text-4xl for h2, text-lg for body
   - Font weights: font-bold (700) for h1, font-semibold (600) for h2, font-normal (400) for body
   - Line height: leading-tight for headings, leading-relaxed for body
   - Letter spacing: tracking-tight for large headings
   - Example: <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">Title</h1>

3. COLOR & STYLING - MODERN & PREMIUM (Using Tailwind):
   - Use Tailwind gradient classes: bg-gradient-to-br from-blue-600 to-purple-600
   - Add shadows: shadow-lg, shadow-xl, shadow-2xl
   - Card styling: bg-white rounded-2xl p-10 shadow-lg
   - Hover effects: hover:-translate-y-2 hover:shadow-xl transition-all duration-300
   - Button styling: bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-8 py-4
   - Example: <div className="bg-white rounded-2xl p-10 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300">Card</div>

4. IMAGES - ABSOLUTELY MANDATORY (USE THESE EXACT URLs in React):
   ðŸš¨ YOU MUST ADD THESE IMAGES - NO EXCEPTIONS ðŸš¨
   
   HERO BACKGROUND (React JSX):
   <div className="bg-cover bg-center bg-no-repeat" style={{backgroundImage: \`url('https://images.unsplash.com/photo-${imageIds[0]}?w=1920&h=1080&fit=crop')\`}}>
   
   ABOUT SECTION IMAGE (React JSX):
   <img src={\`https://images.unsplash.com/photo-${imageIds[1]}?w=800&h=600&fit=crop\`} alt={\`About ${draft.business_name}\`} className="rounded-lg shadow-lg" />
   
   SERVICE CARDS (use different image for each - React JSX):
   - Card 1: <img src={\`https://images.unsplash.com/photo-${imageIds[0]}?w=600&h=400&fit=crop\`} alt="Service 1" className="rounded-lg" />
   - Card 2: <img src={\`https://images.unsplash.com/photo-${imageIds[1]}?w=600&h=400&fit=crop\`} alt="Service 2" className="rounded-lg" />
   - Card 3: <img src={\`https://images.unsplash.com/photo-${imageIds[2]}?w=600&h=400&fit=crop\`} alt="Service 3" className="rounded-lg" />
   - Card 4: <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop" alt="Service 4" className="rounded-lg" />
   
   âš ï¸ IF YOU DON'T ADD THESE IMAGES, THE SITE WILL LOOK UNPROFESSIONAL âš ï¸

5. LAYOUT & SPACING - PREMIUM STANDARDS (Using Tailwind):
   - Section spacing: py-24 md:py-32 between major sections
   - Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
   - Card padding: p-10
   - Element spacing: space-y-8 between related elements
   - Generous whitespace: Use py-16, py-24, py-32 for vertical spacing

6. ANIMATIONS - SMOOTH & PROFESSIONAL (Using Tailwind):
   - Add transition classes: transition-all duration-300 ease-in-out
   - Button hover: hover:scale-105 hover:shadow-xl
   - Card hover: hover:-translate-y-2 hover:shadow-2xl
   - Smooth scroll: Add scroll-smooth to html/body (in component)
   - Example: <div className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">Card</div>

7. NAVIGATION - STICKY & MODERN (Using Tailwind):
   - Sticky header: fixed top-0 z-50
   - Backdrop blur: backdrop-blur-md bg-white/90
   - Shadow: shadow-lg
   - Layout: flex items-center justify-between
   - Mobile: Use md:hidden and hidden md:flex for responsive menu
   - Example: <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/90 shadow-lg">

8. FORMS - MODERN STYLING (Using Tailwind):
   - Inputs: border-2 border-gray-200 rounded-lg px-4 py-3
   - Focus: focus:border-blue-600 focus:ring-2 focus:ring-blue-200
   - Submit button: bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-8 py-3 hover:shadow-xl
   - Placeholder: placeholder-gray-400
   - Example: <input className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 placeholder-gray-400" />

9. FOOTER - PROFESSIONAL (Using Tailwind):
   - Dark background: bg-gray-900 or bg-gray-800
   - White text: text-white
   - Multi-column: grid grid-cols-1 md:grid-cols-4 gap-8
   - Social icons: Use Heroicons or similar (import as needed)
   - Example: <footer className="bg-gray-900 text-white py-16">

10. RESPONSIVE - MOBILE PERFECT (Using Tailwind):
    - Mobile-first: Base classes for mobile, then sm:, md:, lg: prefixes
    - Stack on mobile: flex-col on mobile, md:flex-row on desktop
    - Grid: grid-cols-1 on mobile, md:grid-cols-2 lg:grid-cols-3 on desktop
    - Hide/show: hidden md:block for desktop-only, md:hidden for mobile-only
    - Example: <div className="flex flex-col md:flex-row gap-4">

ðŸš¨ CRITICAL QUALITY CHECKLIST:
âœ“ Hero has Unsplash background image (using React style prop)
âœ“ About section has image (using <img /> with className)
âœ“ Each service card has image (using <img /> with className)
âœ“ Tailwind CSS classes used throughout (NO custom CSS)
âœ“ Gradients and shadows applied (using Tailwind classes)
âœ“ Hover effects on all interactive elements (using Tailwind hover: classes)
âœ“ Professional spacing throughout (using Tailwind spacing classes)
âœ“ Modern color palette (using Tailwind color classes)
âœ“ Smooth animations (using Tailwind transition classes)
âœ“ Responsive design (using Tailwind responsive prefixes)
âœ“ React JSX syntax (className, not class; self-closing tags)
âœ“ Component format: export default function ComponentName() { return (...) }

IF THE SITE LOOKS BASIC OR MISSING IMAGES, YOU HAVE FAILED.

ðŸš¨ OUTPUT FORMAT - REACT COMPONENT WITH IMPORTS ðŸš¨

Return ONLY a complete React component that imports and uses the pre-built components:

\`\`\`jsx
import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';

export default function LandingPage() {
  // Prepare data for components
  const featuresData = [ /* ... */ ];
  const plansData = [ /* ... */ ];
  const testimonialsData = [ /* ... */ ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header businessName="${draft.business_name}" />
      <Hero heroTitle="..." heroSubtitle="..." />
      <Features features={featuresData} />
      <Pricing plans={plansData} />
      <Testimonial testimonials={testimonialsData} />
      <Footer businessName="${draft.business_name}" />
    </div>
  );
}
\`\`\`

CRITICAL:
- MUST import components from './components'
- MUST prepare data arrays/objects
- MUST use components with props
- DO NOT create HTML from scratch
- DO NOT output raw HTML
- Make it STUNNING and PREMIUM.`
}

function buildAIPrompt(draft: any): string {
  const mustHavePages = draft.must_have_pages?.join(', ') || 'Home, About, Contact'
  const hasAbout = draft.must_have_pages?.includes('About')
  const hasServicesOrProducts = draft.must_have_pages?.includes('Services') || draft.must_have_pages?.includes('Products')
  const hasContact = draft.must_have_pages?.includes('Contact')

  // Load metadata for block library system
  const metadata = loadMetadata()
  const industryBlocks = getIndustryBlocks(draft.business_type, metadata)
  const assemblyOrder = getAssemblyOrder(draft.business_type, metadata)
  
  // Load React component information
  const componentInfo = loadReactComponents(draft.business_type, metadata)

  return `ðŸš¨ CRITICAL FIRST IMPRESSION WARNING

This is a FREE draft preview. The quality must be EXCEPTIONAL - this website will determine if the client continues with us or walks away. If it looks generic, low-quality, or unprofessional, they will leave immediately. Make it STUNNING. Make them think "This is exactly what I need." This is your ONE chance to impress them.

You are an elite web designer and developer with 15+ years of experience creating award-winning websites for Fortune 500 companies. Your task is to create a STUNNING, production-ready website that rivals the best in the industry.

=== REACT COMPONENT LIBRARY SYSTEM - CRITICAL INSTRUCTIONS ===

ðŸš¨ YOU HAVE ACCESS TO PRE-BUILT REACT COMPONENTS ðŸš¨

CRITICAL: You MUST import and use the React components from the component library. This ensures consistency, quality, and production-ready code.

REACT COMPONENT LIBRARY:

Components are located in: ./components/

Currently Available (Phase 1):
- Header: Navigation component
- Hero: Hero section component
- Features: Features/services grid component
- Pricing: Pricing plans component
- Testimonial: Customer testimonials component
- Footer: Site footer component

All components are:
- TypeScript-enabled with proper interfaces
- Styled with Tailwind CSS utility classes
- Production-ready and reusable
- Accept props for dynamic content

METADATA FILES (Reference these for block selection):

1. industry-tags.json:
   - Maps business type to required blocks
   - Provides: blocks (industry-specific), suggestedBlocks (generic), primaryColor, tags
   - Example: "restaurant" â†’ blocks: ["menu", "reservation-form"], suggestedBlocks: ["hero", "features"]

2. assembly-rules.json:
   - Defines block ordering for each industry
   - Provides: layoutOrder (standard, ecommerce, service, portfolio)
   - Provides: requiredBlocks, blockDependencies, industrySpecific rules
   - Example: restaurant order = ["hero", "menu", "chef-highlight", "dish-gallery", "testimonial"]

3. block-types.json:
   - Lists all available block types and their variants
   - Shows which blocks have premium signature variants
   - Defines parameters for each block (required/optional fields)

BLOCK SELECTION PROCESS:

Step 1: Identify Industry
Business Type: "${draft.business_type || 'Other'}"
${industryBlocks}

Step 2: Determine Block Order
${assemblyOrder}

Step 3: Select Block Variants
- For hero: Choose generic/hero.html OR signature/hero-cinematic.html (for premium feel)
- For testimonial: Choose generic/testimonial.html OR signature/premium-testimonials.html
- For contact: Choose generic/contact-form.html OR signature/premium-contact-form.html
- Use signature blocks for: luxury brands, premium services, high-end businesses
- Use generic blocks for: standard quality, cost-effective, general purpose

Step 4: Block Assembly Rules
- Header: ALWAYS first (use generic/header.html)
- Hero: ALWAYS second (choose variant based on premium level)
- Industry-specific blocks: Use in order from assembly-rules.json
- Generic blocks: Fill gaps (features, testimonial, gallery, etc.)
- Footer: ALWAYS last (use generic/footer.html)

Step 5: Component Assembly
- Import components from './components'
- Prepare data arrays/objects for components
- Pass props with real content
- Use components in JSX
- Maintain component structure - do not modify component internals

CRITICAL RULES FOR COMPONENT USAGE:

âœ… DO:
- Import components from './components'
- Reference siteData for all content: <Features features={siteData.features} />
- Pass theme colors as props: primaryColor={siteData.theme.primaryColor}
- Use components in the correct order (header â†’ hero â†’ features â†’ pricing â†’ testimonial â†’ footer)
- Keep component code under 200 lines - just assembly, no data
- Output clean, concise JSX that imports and uses components

âŒ DON'T:
- Create HTML from scratch - USE THE COMPONENTS
- Hardcode data arrays inside the component (const featuresData = [...])
- Create massive 500+ line data objects
- Modify component internals
- Skip required props
- Generate incomplete code - ensure all strings are properly closed
- Output more than 4,000 characters total

${componentInfo}

=== INDUSTRY AWARENESS & DESIGN INSPIRATION ===

CRITICAL: Before designing, identify the business industry and reference MAJOR PLAYERS in that industry. Use their design philosophies as inspiration for creating a high-caliber website.

Industry Reference Guide:

Clothing/Fashion E-commerce:
- Reference: Nike, Adidas, Zara, ASOS
- Design Philosophy: Clean, modern, product-focused, lifestyle imagery, bold typography
- Key Elements: Large product images, minimal navigation, strong brand identity

Technology/SaaS:
- Reference: Apple, Stripe, Notion, Linear
- Design Philosophy: Minimalist, premium, clear messaging, lots of whitespace, subtle animations
- Key Elements: Clean interfaces, clear value props, modern gradients, professional typography

Food & Beverage:
- Reference: Starbucks, McDonald's, Blue Bottle Coffee
- Design Philosophy: Warm, inviting, visual, appetizing imagery, friendly tone
- Key Elements: High-quality food photography, warm color palettes, clear menu/pricing

Real Estate:
- Reference: Zillow, Realtor.com, Airbnb
- Design Philosophy: Trustworthy, professional, image-heavy, search-focused
- Key Elements: Property galleries, location maps, clear CTAs, professional imagery

Healthcare/Medical:
- Reference: Mayo Clinic, WebMD, One Medical
- Design Philosophy: Clean, trustworthy, accessible, calming colors
- Key Elements: Clear information hierarchy, easy navigation, professional imagery

Finance/Fintech:
- Reference: Stripe, Square, Robinhood
- Design Philosophy: Professional, secure, modern, trustworthy
- Key Elements: Clean dashboards, clear pricing, security indicators, modern UI

Creative/Portfolio:
- Reference: Behance, Dribbble, Awwwards
- Design Philosophy: Visual, creative, showcase-focused, bold
- Key Elements: Portfolio galleries, creative layouts, visual storytelling

Local Services:
- Reference: Yelp, Thumbtack, TaskRabbit
- Design Philosophy: Local, trustworthy, review-focused, accessible
- Key Elements: Location prominence, reviews/testimonials, clear contact methods

If no clear industry match:
Think about what makes a HIGH-CALIBER website in that space:
- What would a $1M+ company in this space look like?
- What design elements convey premium quality and professionalism?
- What would make a visitor think "This is a serious, established business"?
- Research best-in-class examples in similar industries

Use Unsplash Images Strategically:
- Hero sections: High-quality, relevant, professional images
- Product/service pages: Contextual, appropriate imagery
- About sections: Professional, industry-appropriate photos
- Use Unsplash URLs: https://images.unsplash.com/photo-[id]?w=1200&h=600&fit=crop
- Always include descriptive alt text for accessibility
- Choose images that match the aesthetic style and color palette
- Ensure images enhance the message, not distract

=== BUSINESS CONTEXT ===

Business Name: ${draft.business_name}
Location: ${draft.business_location}
Description: ${draft.business_description}
Contact Email: ${draft.email}
Phone Number: ${draft.phone_number || 'Not provided'}
Business Type/Industry: ${draft.business_type || 'Other'}

IMPORTANT - Industry Reference:
Based on the business type "${draft.business_type || 'Other'}", reference the appropriate industry leaders:
${getIndustryReference(draft.business_type)}

Target Audience: ${draft.ideal_customer || 'General audience'}
Key Differentiator: ${draft.key_differentiator || 'Quality service'}
Target Keywords: ${draft.target_keywords || ''}
Tone of Voice: ${draft.tone_of_voice || 'Professional'}

Design Colors: ${draft.preferred_colors || 'Professional blue and white'}
Aesthetic Style: ${draft.aesthetic_style || 'Modern and clean'}
Note: Include all standard pages that industry leaders in this space would have (Home, About, Contact, Services/Products if applicable, etc.)

${draft.logo_url ? `Logo: A logo has been provided. Use it in the header and throughout the site where appropriate. The logo URL is available in metadata.` : ''}

Social Media Links:
${draft.facebook_link ? `- Facebook: ${draft.facebook_link}` : ''}
${draft.instagram_link ? `- Instagram: ${draft.instagram_link}` : ''}
${draft.twitter_link ? `- Twitter/X: ${draft.twitter_link}` : ''}
${draft.linkedin_link ? `- LinkedIn: ${draft.linkedin_link}` : ''}
${draft.facebook_link || draft.instagram_link || draft.twitter_link || draft.linkedin_link ? 'Include these social media links in the footer and contact page.' : 'No social media links provided.'}

Features Needed:
- E-commerce: ${draft.needs_ecommerce ? 'YES - Include product catalog, shopping cart, checkout' : 'NO'}
- CRM/Client Login: ${draft.needs_crm ? 'YES - Include login area' : 'NO'}
- Primary Conversion Goal: ${draft.conversion_goal || 'Contact form submission'}

=== DESIGN PHILOSOPHY - INDUSTRY-LEVEL QUALITY ===

1. FIRST IMPRESSION IS EVERYTHING
The hero section must be IMPACTFUL and memorable. Think about how industry leaders present themselves:
- Nike-level impact for e-commerce
- Apple-level polish for tech
- Starbucks-level warmth for food/service

The hero should:
- Use the business name prominently
- Present a clear, compelling value proposition
- Match the aesthetic style: ${draft.aesthetic_style || 'Modern and clean'}
- Use colors strategically: ${draft.preferred_colors || 'Professional blue and white'}
- Create an emotional connection immediately

2. MODERN 2024/2025 DESIGN STANDARDS
Reference the design language of industry leaders:
- Clean, spacious layouts with generous whitespace
- Subtle gradients or glassmorphism effects (like Apple, Stripe)
- Smooth, subtle animations (CSS transitions only)
- Professional typography hierarchy
- Card-based layouts with subtle shadows
- Rounded corners (8-12px radius)
- Modern color palette that matches industry standards

3. VISUAL HIERARCHY & USER EXPERIENCE
Guide the eye naturally, like the best websites in the industry:
- Hero â†’ Value proposition â†’ Features â†’ Social proof â†’ CTA
- Use size, color, and spacing to create focus
- Important elements (CTAs) should stand out
- Logical flow: most important content first
- Every section should have a clear purpose

4. MOBILE-FIRST (CRITICAL)
Design for mobile first, then enhance for desktop:
- Touch-friendly buttons (min 44x44px)
- Readable text (16px minimum for body)
- Fast loading (optimize everything - data costs matter)
- Single-column layout on mobile
- Hamburger menu for navigation
- Test mentally: does this work on a small screen?

=== TECHNICAL REQUIREMENTS ===

1. Single-file HTML5 document:
   - All CSS in <style> tag in <head>
   - All JavaScript in <script> tag before </body>
   - No external dependencies (except maybe Google Fonts)
   - No frameworks or libraries

2. Fully Responsive:
   - Mobile: 320px - 768px
   - Tablet: 768px - 1024px
   - Desktop: 1024px+
   - Use CSS Grid and Flexbox
   - Media queries for breakpoints

3. Performance (Critical for African markets):
   - Optimize all code
   - Minimize CSS and JavaScript
   - Use efficient selectors
   - Fast loading on slow connections (3G/4G)
   - Lightweight code (data costs matter)

4. Accessibility (WCAG 2.1 AA):
   - Semantic HTML5 elements
   - Proper heading hierarchy (h1 â†’ h2 â†’ h3)
   - Alt text for all images
   - ARIA labels where needed
   - Keyboard navigation support
   - Color contrast 4.5:1 minimum

5. SEO:
   - Proper <title> tag with business name
   - Meta description
   - Open Graph tags
   - Semantic HTML structure
   - Proper heading hierarchy

=== PAGE STRUCTURE - INDUSTRY-LEVEL QUALITY ===

HOME PAGE (Required - Make it IMPRESSIVE)

1. Header:
- Logo/Business name (prominent)
- Navigation menu (include standard pages: Home, About, Contact, and Services/Products if applicable)
- Primary CTA button (${draft.conversion_goal || 'Get Started'})
- Sticky header (stays visible on scroll)

2. Hero Section (Above the fold - MOST IMPORTANT):
This is where you make or break the first impression. Think industry-leader quality:
- Large, impactful headline using business name
- Compelling subheadline with value proposition
- Clear description: ${draft.business_description}
- Prominent CTA button: "${draft.conversion_goal || 'Get Started'}"
- High-quality background image from Unsplash (relevant to industry)
- Make this section VISUALLY STUNNING
- Match the aesthetic of industry leaders in this space

3. Features/Benefits Section:
- 3-6 key points about the business
- Use icons or visual elements (Unsplash images where appropriate)
- Highlight: ${draft.key_differentiator || 'Quality service'}
- Clear headings and descriptions
- Grid layout (3 columns on desktop, 1 on mobile)
- Reference how industry leaders present features

4. Social Proof Section:
- Testimonials OR
- Statistics (e.g., "Serving ${draft.business_location} since...")
- Trust indicators
- Build credibility like industry leaders do

5. Secondary CTA Section:
- Another conversion opportunity
- Different angle than hero
- Clear call-to-action
- Visual emphasis

6. Footer:
- Contact information:
  * Email: ${draft.email}
  * Phone: ${draft.phone_number || 'Not provided'}
  * Location: ${draft.business_location}
- Social media links:
${draft.facebook_link ? `  * Facebook: ${draft.facebook_link}` : '  * (No Facebook provided)'}
${draft.instagram_link ? `  * Instagram: ${draft.instagram_link}` : '  * (No Instagram provided)'}
${draft.twitter_link ? `  * Twitter/X: ${draft.twitter_link}` : '  * (No Twitter provided)'}
${draft.linkedin_link ? `  * LinkedIn: ${draft.linkedin_link}` : '  * (No LinkedIn provided)'}
- Navigation links
- Copyright notice

ABOUT PAGE:
- Compelling story about ${draft.business_name}
- Mission and values
- Why they're different: ${draft.key_differentiator || 'Quality service'}
- Location context: ${draft.business_location}
- Professional imagery from Unsplash
- CTA to contact

SERVICES/PRODUCTS PAGE (if applicable to business type):
- Clear descriptions
- Benefits-focused (not just features)
- Visual hierarchy
- Pricing or "Get Quote" CTAs
- High-quality images from Unsplash
- Reference how industry leaders present products/services

CONTACT PAGE:
- Contact form (functional with validation)
- Email: ${draft.email}
- Phone: ${draft.phone_number || 'Not provided'}
- Location: ${draft.business_location}
- Multiple contact methods
- Response time expectations
- Social media links (if provided):
${draft.facebook_link ? `  * Facebook: ${draft.facebook_link}` : ''}
${draft.instagram_link ? `  * Instagram: ${draft.instagram_link}` : ''}
${draft.twitter_link ? `  * Twitter/X: ${draft.twitter_link}` : ''}
${draft.linkedin_link ? `  * LinkedIn: ${draft.linkedin_link}` : ''}
- Professional, trustworthy design

=== CONVERSION OPTIMIZATION ===

Primary CTA: "${draft.conversion_goal || 'Get Started'}"
- Place above the fold in hero
- Make it prominent (larger, contrasting color)
- Action-oriented text
- Clear what happens when clicked
- Reference how industry leaders design CTAs

Secondary CTAs:
- Throughout the page
- Contextually relevant
- Different variations of the same goal

Trust Signals:
- Professional design itself is a trust signal
- Location: ${draft.business_location}
- Contact information visible
- Clear value proposition
- Industry-appropriate trust indicators

=== VISUAL DESIGN - PREMIUM QUALITY ===

Typography:
- Headings: Bold, larger (2-3x body text)
- Body: 16-18px, readable, good line-height (1.6-1.8)
- Use 2 font families max
- Clear hierarchy
- Reference typography of industry leaders

Colors (${draft.preferred_colors || 'Professional blue and white'}):
- Primary: Use for CTAs, links, accents
- Secondary: Supporting elements
- Neutral: Text (#333 or darker), backgrounds (#fff or light)
- Ensure sufficient contrast
- Match industry color psychology

Spacing:
- Section spacing: 80-120px
- Element spacing: 20-40px
- Container: max-width 1200px, centered
- Generous padding (like industry leaders)

Components:
- Buttons: Rounded (8-12px), padding (12-16px), hover effects
- Cards: Subtle shadow, rounded corners, padding
- Forms: Clean, labeled, placeholder text
- Images: Proper aspect ratios, alt text, Unsplash URLs

${draft.needs_ecommerce ? `=== E-COMMERCE REQUIREMENTS ===
- Product grid with images, titles, prices
- "Add to Cart" buttons
- Shopping cart icon in header
- Basic cart functionality (localStorage)
- Checkout flow (simplified)
- Product detail pages
- Reference e-commerce leaders (Nike, Adidas, ASOS) for design inspiration
` : ''}

=== CODE QUALITY ===
- Clean, readable, well-commented
- Semantic HTML5 elements
- Organized CSS (grouped by section)
- Efficient JavaScript (vanilla only)
- Proper indentation (2 spaces)
- Comments for complex sections

=== OUTPUT FORMAT ===
Return ONLY a complete, valid HTML5 document:
- Start with <!DOCTYPE html>
- Include <html lang="en">
- <head> with all meta tags, title, and styles
- <body> with all content and scripts
- NO markdown, NO explanations, NO code blocks
- The HTML must work when saved as .html and opened in a browser
- Test it mentally: would this impress a business owner?
- Would this match the quality of industry leaders?

=== QUALITY CHECKLIST - MUST PASS ALL ===
Before finalizing, ensure:
âœ“ Looks professional and modern (not generic) - industry-leader quality
âœ“ Fully responsive on all devices
âœ“ Fast loading (optimized code)
âœ“ Accessible (keyboard nav, screen readers)
âœ“ SEO optimized (meta tags, semantic HTML)
âœ“ Conversion-focused (clear CTAs, trust signals)
âœ“ Matches ${draft.aesthetic_style || 'Modern and clean'} aesthetic
âœ“ Uses ${draft.preferred_colors || 'Professional blue and white'} appropriately
âœ“ All requested pages included
âœ“ Smooth animations and interactions
âœ“ Cross-browser compatible
âœ“ Tone matches: ${draft.tone_of_voice || 'Professional'}
âœ“ Uses Unsplash images strategically
âœ“ References industry design standards
âœ“ High-caliber, premium quality throughout

ðŸš¨ FINAL REMINDER

This website will determine if the client continues with us or walks away.

Make it EXCEPTIONAL. Make it industry-leader quality. Make them think "This is exactly what I need." Make them want to upgrade immediately.

Think: What would Nike/Apple/Stripe do? Then do that, but for this business.

The better your understanding of the industry and high-caliber design, the higher the quality of the first draft. This is CRITICAL.`
}

function extractHTML(text: string): string {
  // Extract HTML from markdown code blocks or plain text
  const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/) || 
                   text.match(/```jsx\n([\s\S]*?)\n```/) ||
                   text.match(/```js\n([\s\S]*?)\n```/) ||
                   text.match(/```\n([\s\S]*?)\n```/) ||
                   text.match(/<html[\s\S]*<\/html>/i)
  
  if (htmlMatch) {
    return htmlMatch[1] || htmlMatch[0]
  }
  
  // If no code block, assume entire text is HTML/JSX
  return text.trim()
}


async function deployPreview(draftId: string, componentCode: string, draft: any, supabase: any): Promise<string> {
  // Generate subdomain slug
  const slug = `${slugify(draft.business_name)}-${generateShortId(4)}`
  const subdomain = `${slug}.atarwebb.com`
  
  // For now, return a placeholder URL
  // TODO: Integrate with Vercel API to create preview deployment
  // TODO: Store React component code in Supabase Storage or Vercel
  // TODO: Set up custom domain mapping
  
  // Temporary: Store in database and serve via API route
  await supabase
    .from('draft_projects')
    .update({
      metadata: {
        component_code: componentCode,
        subdomain: subdomain
      }
    })
    .eq('id', draftId)
  
  // Return preview URL (will be served from /api/preview/[draftId])
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/preview/${draftId}`
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30)
}

function generateShortId(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
