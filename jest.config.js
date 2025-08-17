const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/Tests/**/*.test.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  
  // Module name mapping - hanya untuk folder yang ada di src/
  moduleNameMapper: {
    "^App/(.*)$": "<rootDir>/src/App/$1",
    "^Bin/(.*)$": "<rootDir>/src/Bin/$1", 
    "^Config/(.*)$": "<rootDir>/src/Config/$1",
    "^Constant/(.*)$": "<rootDir>/src/Constant/$1",
    "^Global/(.*)$": "<rootDir>/src/Global/$1",
    "^Helper/(.*)$": "<rootDir>/src/Helper/$1",
    "^Middleware/(.*)$": "<rootDir>/src/Middleware/$1",
    "^Types/(.*)$": "<rootDir>/src/Types/$1", 
    "^Utils/(.*)$": "<rootDir>/src/Utils/$1",
    "^Database/(.*)$": "<rootDir>/src/Database/$1",
    
    // Index file mapping
    "^index$": "<rootDir>/src/index",
  },
  
  // File extensions yang akan diproses
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
  // Root directory untuk mencari modules
  roots: ["<rootDir>/src"],
  
  // Setup files
  setupFiles: ["dotenv/config"],
  
  // Resolver configuration
  resolver: undefined,
  
  // Transform ignore patterns - jangan transform node_modules kecuali ESM
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$))"
  ],
  
  // Coverage jika diperlukan
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/Tests/**/*"
  ],
  
  // Timeout untuk test yang lama
  testTimeout: 10000,
};