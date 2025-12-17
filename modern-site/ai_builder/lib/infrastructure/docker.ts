/**
 * Docker Infrastructure Setup
 * P2 Feature 5: Infrastructure
 */

export interface DockerConfig {
  image: string
  ports?: Array<{ host: number; container: number }>
  environment?: Record<string, string>
  volumes?: Array<{ host: string; container: string }>
  command?: string[]
}

/**
 * Generate Dockerfile
 */
export function generateDockerfile(config: {
  baseImage: string
  workingDir: string
  installCommands: string[]
  buildCommands: string[]
  startCommand: string
  port: number
}): string {
  return `
FROM ${config.baseImage}

WORKDIR ${config.workingDir}

# Install dependencies
${config.installCommands.map(cmd => `RUN ${cmd}`).join('\n')}

# Copy files
COPY . .

# Build
${config.buildCommands.map(cmd => `RUN ${cmd}`).join('\n')}

# Expose port
EXPOSE ${config.port}

# Start command
CMD ${config.startCommand}
`.trim()
}

/**
 * Generate docker-compose.yml
 */
export function generateDockerCompose(services: Record<string, DockerConfig>): string {
  const compose: any = {
    version: '3.8',
    services: {}
  }

  for (const [name, config] of Object.entries(services)) {
    compose.services[name] = {
      image: config.image,
      ports: config.ports?.map(p => `${p.host}:${p.container}`),
      environment: config.environment,
      volumes: config.volumes?.map(v => `${v.host}:${v.container}`),
      command: config.command
    }
  }

  return JSON.stringify(compose, null, 2)
}





