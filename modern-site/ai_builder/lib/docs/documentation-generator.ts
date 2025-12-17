/**
 * Documentation Generator
 * P2 Feature 6: Documentation System
 */

export interface ComponentDoc {
  name: string
  description: string
  props: Array<{
    name: string
    type: string
    required: boolean
    defaultValue?: any
    description: string
  }>
  examples: Array<{
    title: string
    code: string
  }>
  usage: string
}

export interface APIDoc {
  endpoint: string
  method: string
  description: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  examples: Array<{
    request: any
    response: any
  }>
}

/**
 * Generate component documentation
 */
export function generateComponentDoc(component: ComponentDoc): string {
  return `
# ${component.name}

${component.description}

## Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${component.props.map(prop => 
  `| ${prop.name} | ${prop.type} | ${prop.required ? 'Yes' : 'No'} | ${prop.defaultValue ?? 'N/A'} | ${prop.description} |`
).join('\n')}

## Usage

\`\`\`tsx
${component.usage}
\`\`\`

## Examples

${component.examples.map(example => `
### ${example.title}

\`\`\`tsx
${example.code}
\`\`\`
`).join('\n')}
`.trim()
}

/**
 * Generate API documentation
 */
export function generateAPIDoc(api: APIDoc): string {
  return `
# ${api.method} ${api.endpoint}

${api.description}

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
${api.parameters.map(param => 
  `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |`
).join('\n')}

## Examples

${api.examples.map((example, index) => `
### Example ${index + 1}

**Request:**
\`\`\`json
${JSON.stringify(example.request, null, 2)}
\`\`\`

**Response:**
\`\`\`json
${JSON.stringify(example.response, null, 2)}
\`\`\`
`).join('\n')}
`.trim()
}





