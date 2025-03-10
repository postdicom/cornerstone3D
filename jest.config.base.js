// https://github.com/facebook/jest/issues/3613
// Yarn Doctor: `npx @yarnpkg/doctor .` -->
// '<rootDir>' warning:
// Strings should avoid referencing the node_modules directory (prefer require.resolve)

module.exports = {
  // roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/test/**/*.jest.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironment: require.resolve('./utils/fixJSDOMJest.js'),
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@kitware/.*)'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  // Setup
  // setupFiles: ["jest-canvas-mock/lib/index.js"],
  // Coverage
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        plugins: ['babel-plugin-transform-import-meta'],
      },
    ],
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
    // Not
    '!<rootDir>/src/RenderingEngine/vtkClasses/**',
    '!<rootDir>/src/**/*.test.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!<rootDir>/dist/**',
  ],
};
