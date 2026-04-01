// import { defineConfig } from '@playwright/test';

// export default defineConfig({
//   testDir: './e2e',
//   use: { baseURL: 'http://localhost:3000', screenshot: 'only-on-failure' },
//   outputDir: 'screenshots',
// });

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  outputDir: 'screenshots',
})