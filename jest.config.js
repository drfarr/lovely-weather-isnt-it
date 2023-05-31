const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });
const ignoredModules = ["next"].join("|");
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/app/$1",
  },
  moduleNameMapper: {
    "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec).[jt]s?(x)"],
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],

  transformIgnorePatterns: [`/node_modules/(?!${ignoredModules})`],
};

module.exports = createJestConfig(customJestConfig);
