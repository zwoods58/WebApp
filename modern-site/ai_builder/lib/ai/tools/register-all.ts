/**
 * Register All Tools
 * Registers all available tools with the tool registry
 */

import { getToolRegistry } from './index'
import { createFileTool } from './create-file'
import { updateFileTool } from './update-file'
import { deleteFileTool } from './delete-file'
import { installPackageTool } from './install-package'
import { runCommandTool } from './run-command'
import { searchDocumentationTool } from './search-documentation'

/**
 * Register all tools with the registry
 */
export function registerAllTools(): void {
  const registry = getToolRegistry()
  
  registry.register(createFileTool)
  registry.register(updateFileTool)
  registry.register(deleteFileTool)
  registry.register(installPackageTool)
  registry.register(runCommandTool)
  registry.register(searchDocumentationTool)
  
  console.log(`✅ Registered ${registry.getAll().length} AI tools`)
}

/**
 * Get all registered tools formatted for AI API
 */
export function getAllToolsForAI() {
  const registry = getToolRegistry()
  return registry.getToolDefinitions()
}





