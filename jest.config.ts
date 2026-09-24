import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: true
      }
    ]
  },

  transformIgnorePatterns: [
    'node_modules/(?!@angular|@rxjs|zone\\.js)'
  ],

  collectCoverage: true,
  coverageDirectory: 'coverage/financial-products',
  coverageReporters: ['text', 'text-summary', 'json-summary'], 

  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.config*.ts',
    '!src/app/**/*.routes*.ts',
    '!src/environments/**',
    '!src/app/**/*.spec.ts'
  ],
  
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};

export default config;

