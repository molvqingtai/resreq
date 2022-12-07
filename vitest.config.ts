import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html']
    },
    // issues: https://github.com/vitest-dev/vitest/issues/2008
    threads: false
  }
})
