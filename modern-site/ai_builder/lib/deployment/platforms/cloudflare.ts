/**
 * Cloudflare Pages Deployment Platform Integration
 * P0 Feature 4: Enhanced Deployment - Multiple Platforms
 */

export interface CloudflareDeploymentConfig {
  projectId: string
  files: Record<string, string>
  projectName?: string
  buildCommand?: string
  buildOutputDir?: string
  environmentVariables?: Record<string, string>
  customDomain?: string
}

export interface CloudflareDeploymentResult {
  success: boolean
  deploymentId?: string
  url?: string
  error?: string
}

/**
 * Deploy to Cloudflare Pages
 */
export async function deployToCloudflare(config: CloudflareDeploymentConfig): Promise<CloudflareDeploymentResult> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!accountId || !apiToken) {
    return {
      success: false,
      error: 'CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables required'
    }
  }

  try {
    const projectName = config.projectName || `project-${config.projectId}`

    // Create or get project
    const projectId = await getOrCreateCloudflareProject(accountId, apiToken, projectName)

    // Create deployment
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectId}/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: config.files,
          compatibility_date: new Date().toISOString().split('T')[0]
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.errors?.[0]?.message || `Cloudflare API error: ${response.status}`
      }
    }

    const data = await response.json()

    // Configure custom domain if provided
    if (config.customDomain && data.result?.url) {
      try {
        await configureCloudflareDomain(accountId, apiToken, projectId, config.customDomain)
      } catch (domainError: any) {
        console.warn('Failed to configure custom domain:', domainError.message)
      }
    }

    return {
      success: true,
      deploymentId: data.result?.id,
      url: data.result?.url || `https://${projectName}.pages.dev`
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Cloudflare deployment failed'
    }
  }
}

/**
 * Get or create Cloudflare Pages project
 */
async function getOrCreateCloudflareProject(
  accountId: string,
  apiToken: string,
  projectName: string
): Promise<string> {
  // Try to find existing project
  const listResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    }
  )

  if (listResponse.ok) {
    const projects = await listResponse.json()
    const existingProject = projects.result?.find((p: any) => p.name === projectName)
    if (existingProject) {
      return existingProject.name
    }
  }

  // Create new project
  const createResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        production_branch: 'main'
      })
    }
  )

  if (!createResponse.ok) {
    throw new Error('Failed to create Cloudflare Pages project')
  }

  const project = await createResponse.json()
  return project.result?.name || projectName
}

/**
 * Configure custom domain on Cloudflare Pages
 */
async function configureCloudflareDomain(
  accountId: string,
  apiToken: string,
  projectId: string,
  domain: string
): Promise<void> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectId}/domains`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors?.[0]?.message || 'Failed to configure domain')
  }
}





