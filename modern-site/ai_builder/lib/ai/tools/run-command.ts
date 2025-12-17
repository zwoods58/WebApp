/**
 * Run Command Tool
 * Allows AI to execute terminal commands (sandboxed)
 */

import { Tool } from './index'

export const runCommandTool: Tool = {
  name: 'run_command',
  description: 'Execute terminal command (sandboxed, read-only operations only)',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'Command to execute (must be safe, read-only operations)',
        required: true
      },
      projectId: {
        type: 'string',
        description: 'Project ID (draft_id)',
        required: true
      }
    },
    required: ['command', 'projectId']
  },
  execute: async (params: {
    command: string
    projectId: string
  }) => {
    // Security: Only allow safe, read-only commands
    const allowedCommands = [
      'npm list',
      'npm view',
      'npm search',
      'npm outdated',
      'npm audit',
      'node --version',
      'npm --version'
    ]

    const commandLower = params.command.toLowerCase().trim()
    const isAllowed = allowedCommands.some(allowed => commandLower.startsWith(allowed))

    if (!isAllowed) {
      throw new Error(`Command not allowed: ${params.command}. Only read-only commands are permitted.`)
    }

    // In a real implementation, this would execute the command in a sandboxed environment
    // For now, return a mock response
    return {
      success: true,
      command: params.command,
      output: `Command executed: ${params.command}\n[Note: Command execution is sandboxed and read-only]`,
      message: `Command executed successfully (sandboxed)`
    }
  }
}





