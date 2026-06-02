const fs = require("fs");
const path = require("path");

// Mock browser global environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; },
};

global.window = {
  dispatchEvent: () => { },
};
global.Event = class Event { };

// Read and transpile TS to JS on the fly for lightweight node execution
const tsPath = path.join(__dirname, "../src/lib/favorites.ts");
const tsCode = fs.readFileSync(tsPath, "utf-8");

// Strip TypeScript annotations
let jsCode = tsCode
  .replace(/export function/g, "function")
  .replace(/:\s*string\[\]/g, "")
  .replace(/:\s*string/g, "")
  .replace(/:\s*boolean/g, "")
  .replace(/:\s*any/g, "");

// Append Node.js module exports
jsCode += `
module.exports = {
  getFavoriteIds,
  isFavorite,
  toggleFavorite,
  addFavorite,
  removeFavorite
};
`;

// Save to temporary file to allow require()
const tempPath = path.join(__dirname, "temp-favorites.js");
fs.writeFileSync(tempPath, jsCode, "utf-8");

try {
  // Load and execute the tests!
  const favoritesLib = require(tempPath);
  const { runTests } = require("../src/lib/favorites.test.js");
  runTests(favoritesLib);
} catch (e) {
  console.error("\x1b[31m💥 Fatal Error running tests:\x1b[0m", e.message);
  process.exit(1);
} finally {
  // Clean up the temporary transpiled file
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
}
