export default {
  preset: 'ts-jest',
  testEnvironment: './jsdom-env.js',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts}'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/__helpers__/'],
  clearMocks: true,
}
