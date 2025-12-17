/**
 * Template Engine
 * P2 Feature 1: Template System - Template Engine
 */

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  defaultValue?: any
  description: string
  options?: string[] // For select type
  required: boolean
}

export interface Template {
  id: string
  name: string
  files: Record<string, string> // file path -> template content
  variables: TemplateVariable[]
  metadata: {
    description: string
    category: string
    author: string
    version: string
  }
}

/**
 * Render template with variables
 */
export function renderTemplate(
  template: Template,
  variables: Record<string, any>
): Record<string, string> {
  const rendered: Record<string, string> = {}

  // Validate required variables
  for (const variable of template.variables) {
    if (variable.required && !(variable.name in variables)) {
      if (variable.defaultValue === undefined) {
        throw new Error(`Required variable '${variable.name}' is missing`)
      }
    }
  }

  // Merge variables with defaults
  const mergedVariables: Record<string, any> = {}
  for (const variable of template.variables) {
    mergedVariables[variable.name] =
      variables[variable.name] ?? variable.defaultValue ?? ''
  }

  // Render each file
  for (const [filePath, content] of Object.entries(template.files)) {
    rendered[filePath] = renderTemplateString(content, mergedVariables)
  }

  return rendered
}

/**
 * Render template string with variable substitution
 */
function renderTemplateString(
  template: string,
  variables: Record<string, any>
): string {
  let rendered = template

  // Replace {{variable}} syntax
  rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    if (varName in variables) {
      return String(variables[varName])
    }
    return match
  })

  // Replace {{#if variable}}...{{/if}} syntax
  rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, varName, content) => {
    if (variables[varName]) {
      return content
    }
    return ''
  })

  // Replace {{#each array}}...{{/each}} syntax
  rendered = rendered.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, varName, content) => {
    const array = variables[varName]
    if (Array.isArray(array)) {
      return array.map((item, index) => {
        let itemContent = content
        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item))
        itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index))
        return itemContent
      }).join('')
    }
    return ''
  })

  return rendered
}

/**
 * Extract variables from template
 */
export function extractTemplateVariables(template: Template): TemplateVariable[] {
  const variables: Map<string, TemplateVariable> = new Map()

  for (const content of Object.values(template.files)) {
    const matches = content.matchAll(/\{\{(\w+)\}\}/g)
    for (const match of matches) {
      const varName = match[1]
      if (!variables.has(varName)) {
        variables.set(varName, {
          name: varName,
          type: 'string',
          required: false,
          description: `Variable: ${varName}`
        })
      }
    }
  }

  return Array.from(variables.values())
}





