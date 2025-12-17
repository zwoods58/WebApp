/**
 * Vercel Deployment Platform Integration
 * P0 Feature 4: Enhanced Deployment - Multiple Platforms
 */

export interface VercelDeploymentConfig {
  projectId: string
  files: Record<string, string>
  name?: string
  framework?: string
  buildCommand?: string
  outputDirectory?: string
  environmentVariables?: Record<string, string>
  customDomain?: string
}

export interface VercelDeploymentResult {
  success: boolean
  deploymentId?: string
  url?: string
  error?: string
  buildLog?: string[]
}

/**
 * Deploy to Vercel
 */
export async function deployToVercel(config: VercelDeploymentConfig): Promise<VercelDeploymentResult> {
  const vercelToken = process.env.VERCEL_TOKEN

  if (!vercelToken) {
    return {
      success: false,
      error: 'VERCEL_TOKEN environment variable not set'
    }
  }

  try {
    // Use Vercel REST API
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: config.name || `project-${config.projectId}`,
        files: Object.entries(config.files).map(([path, content]) => ({
          file: path,
          data: content
        })),
        projectSettings: {
          framework: config.framework || 'nextjs',
          buildCommand: config.buildCommand,
          outputDirectory: config.outputDirectory || '.next',
          installCommand: 'npm install'
        },
        env: config.environmentVariables ? Object.entries(config.environmentVariables).map(([key, value]) => ({
          key,
          value,
          type: 'encrypted'
        })) : []
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error?.message || `Vercel API error: ${response.status}`
      }
    }

    const data = await response.json()

    // Configure custom domain if provided
    if (config.customDomain && data.url) {
      try {
        await configureCustomDomain(data.id, config.customDomain, vercelToken)
      } catch (domainError: any) {
        console.warn('Failed to configure custom domain:', domainError.message)
      }
    }

    return {
      success: true,
      deploymentId: data.id,
      url: data.url || `https://${data.url}.vercel.app`
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Vercel deployment failed'
    }
  }
}

/**
 * Configure custom domain on Vercel
 */
async function configureCustomDomain(
  deploymentId: string,
  domain: string,
  token: string
): Promise<void> {
  const response = await fetch(`https://api.vercel.com/v9/projects/${deploymentId}/domains`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: domain
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error?.message || 'Failed to configure domain')
  }
}

/**
 * Get deployment status
 */
export async function getVercelDeploymentStatus(
  deploymentId: string
): Promise<{
  state: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED'
  url?: string
  error?: string
}> {
  const vercelToken = process.env.VERCEL_TOKEN

  if (!vercelToken) {
    throw new Error('VERCEL_TOKEN not set')
  }

  const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
    headers: {
      'Authorization': `Bearer ${vercelToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get deployment status: ${response.status}`)
  }

  const data = await response.json()

  return {
    state: data.readyState?.toUpperCase() || 'BUILDING',
    url: data.url,
    error: data.error?.message
  }
}





