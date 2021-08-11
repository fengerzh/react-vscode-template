import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverage: true,
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '@/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    'cypress',
  ],
};

export default config;
