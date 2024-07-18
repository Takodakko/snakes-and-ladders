/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  rootDir: 'src',
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    '\\.(gif|ttf|eot|svg|png|jpg|avif)$': '<rootDir>/test/__mocks__/imageUrl.ts',
},
};