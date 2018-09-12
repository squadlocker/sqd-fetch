module.exports = {
  "transform": {
    "^.+\\.ts$": "ts-jest",
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  // "testEnvironment": "node",
  "setupFiles": [
    "<rootDir>/__tests__/setup.js"
  ]
}
