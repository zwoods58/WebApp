# Testing Infrastructure Setup Guide
# P2 Feature 11: Testing Infrastructure

This guide explains how to set up testing infrastructure for the AI builder.

## Required Packages

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest ts-jest playwright @playwright/test
```

## Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'ai_builder/**/*.{ts,tsx}',
    '!ai_builder/**/*.d.ts',
    '!ai_builder/**/*.test.{ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

## Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Example Test Files

### Unit Test Example
`__tests__/ComponentRenderer.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import ComponentRenderer from '../ai_builder/preview/ComponentRenderer'

describe('ComponentRenderer', () => {
  it('renders component successfully', () => {
    const code = `function TestComponent() { return <div>Test</div> }`
    render(<ComponentRenderer componentCode={code} draftId="test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### E2E Test Example
`e2e/error-fixing.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('auto-fixes errors', async ({ page }) => {
  await page.goto('/preview/test-draft')
  // Test error fixing flow
})
```

## Test Commands

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  }
}
```

## Status

**Note**: Testing infrastructure requires external setup. The codebase is ready for testing, but Jest and Playwright need to be configured in the project.





