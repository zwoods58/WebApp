/**
 * Install Package Tool
 * Allows AI to add npm packages to the project
 */

import { Tool } from './index'
import { getSupabaseClient } from '../../supabase/client-db'

export const installPackageTool: Tool = {
  name: 'install_package',
  description: 'Add npm package to project dependencies',
  parameters: {
    type: 'object',
    properties: {
      packageName: {
        type: 'string',
        description: 'NPM package name (e.g., "lodash", "@types/react")',
        required: true
      },
      version: {
        type: 'string',
        description: 'Package version (e.g., "^4.17.21", "latest")',
        required: false
      },
      dev: {
        type: 'boolean',
        description: 'Install as dev dependency',
        required: false
      },
      projectId: {
        type: 'string',
        description: 'Project ID (draft_id)',
        required: true
      }
    },
    required: ['packageName', 'projectId']
  },
  execute: async (params: {
    packageName: string
    version?: string
    dev?: boolean
    projectId: string
  }) => {
    const supabase = getSupabaseClient()

    // Get current draft
    const { data: draft, error: fetchError } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', params.projectId)
      .single()

    if (fetchError || !draft) {
      throw new Error(`Project not found: ${params.projectId}`)
    }

    // Get package.json from file tree or metadata
    const fileTree = draft.metadata?.file_tree || {}
    const packageJsonPath = 'package.json'
    let packageJson: any = {}

    if (fileTree[packageJsonPath]) {
      try {
        packageJson = JSON.parse(fileTree[packageJsonPath])
      } catch (e) {
        // Create new package.json if invalid
        packageJson = {
          name: 'ai-builder-project',
          version: '1.0.0',
          dependencies: {},
          devDependencies: {}
        }
      }
    } else {
      // Create new package.json
      packageJson = {
        name: 'ai-builder-project',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {}
      }
    }

    // Ensure dependencies objects exist
    if (!packageJson.dependencies) packageJson.dependencies = {}
    if (!packageJson.devDependencies) packageJson.devDependencies = {}

    // Install package
    const version = params.version || 'latest'
    const targetDeps = params.dev ? packageJson.devDependencies : packageJson.dependencies

    // Check if already installed
    if (targetDeps[params.packageName]) {
      return {
        success: true,
        packageName: params.packageName,
        version: targetDeps[params.packageName],
        message: `Package already installed: ${params.packageName}@${targetDeps[params.packageName]}`,
        updated: false
      }
    }

    // Add package
    targetDeps[params.packageName] = version

    // Update package.json in file tree
    fileTree[packageJsonPath] = JSON.stringify(packageJson, null, 2)

    // Update draft metadata
    const { error: updateError } = await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          file_tree: fileTree,
          dependencies: {
            ...(draft.metadata?.dependencies || {}),
            [params.packageName]: version
          },
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', params.projectId)

    if (updateError) {
      throw new Error(`Failed to install package: ${updateError.message}`)
    }

    return {
      success: true,
      packageName: params.packageName,
      version,
      dev: params.dev || false,
      message: `Package installed: ${params.packageName}@${version}`
    }
  }
}





