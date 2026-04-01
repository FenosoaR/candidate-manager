export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
   
    collectCoverageFrom: [
      'src/services/**/*.ts',
      'src/models/**/*.ts',
    ],
    coverageThreshold: {
      global: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      }
    },
    coverageReporters: ['text', 'lcov', 'html'],
  }