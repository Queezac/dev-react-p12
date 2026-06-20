const fs = require("fs");
const path = require("path");

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
global.getBackendOrigin = () => "http://localhost:3001";

function transpileAndRun(tsFilename, testFilename, exportsArray) {
  const tsPath = path.join(__dirname, "../src/lib", tsFilename);
  const tsCode = fs.readFileSync(tsPath, "utf-8");

  let jsCode = tsCode
    .replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, "")
    .replace(/export function/g, "function")
    .replace(/\?\s*:/g, ":")
    .replace(/:\s*string\[\s*\]/g, "")
    .replace(/:\s*string\s*\|\s*null/g, "")
    .replace(/:\s*string/g, "")
    .replace(/:\s*boolean/g, "")
    .replace(/:\s*number/g, "")
    .replace(/:\s*any/g, "");

  jsCode += `\nmodule.exports = { ${exportsArray.join(", ")} };\n`;

  const tempPath = path.join(__dirname, `temp-${tsFilename.replace(".ts", ".js")}`);
  fs.writeFileSync(tempPath, jsCode, "utf-8");

  try {
    const libObj = require(tempPath);
    const testPath = path.join(__dirname, "../src/lib", testFilename);
    const { runTests } = require(testPath);
    runTests(libObj);
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

try {
  transpileAndRun(
    "favorites.ts",
    "favorites.test.js",
    ["getFavoriteIds", "isFavorite", "toggleFavorite", "addFavorite", "removeFavorite"]
  );

  transpileAndRun(
    "galleryLogic.ts",
    "galleryLogic.test.js",
    ["formatImageUrl", "getNextIndex", "getPrevIndex"]
  );

  console.log("\x1b[All test suites completed successfully!\x1b[0m\n");
  process.exit(0);
} catch (e) {
  console.error("\x1b[Fatal Error running tests:\x1b[0m", e.message);
  process.exit(1);
}
