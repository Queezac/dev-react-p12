function runTests(galleryLogic) {
  const { formatImageUrl, getNextIndex, getPrevIndex } = galleryLogic;

  let passed = 0;
  let failed = 0;

  function expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toContain(expected) {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      }
    };
  }

  function test(name, fn) {
    try {
      fn();
      console.log(`  \x1b[32m✅ PASS:\x1b[0m ${name}`);
      passed++;
    } catch (e) {
      console.error(`  \x1b[31m❌ FAIL:\x1b[0m ${name}`);
      console.error(`     Error: ${e.message}`);
      failed++;
    }
  }

  console.log("\n\x1b[36m🏃 Running unit tests for Gallery Logic (Diaporama)...\x1b[0m");

  test("formatImageUrl - should return placeholder when url is null or undefined", () => {
    expect(formatImageUrl(null)).toBe("/placeholder-house.jpg");
    expect(formatImageUrl(undefined)).toBe("/placeholder-house.jpg");
    expect(formatImageUrl("")).toBe("/placeholder-house.jpg");
  });

  test("formatImageUrl - should return unmodified absolute URLs", () => {
    expect(formatImageUrl("http://example.com/pic.jpg")).toBe("http://example.com/pic.jpg");
    expect(formatImageUrl("https://example.com/pic.jpg")).toBe("https://example.com/pic.jpg");
    expect(formatImageUrl("data:image/png;base64,abc")).toBe("data:image/png;base64,abc");
  });

  test("formatImageUrl - should prepend localhost for relative path URLs", () => {
    expect(formatImageUrl("/uploads/house.jpg")).toBe("http://localhost:3001/uploads/house.jpg");
  });

  test("getNextIndex - should loop to start when reaching end of array", () => {
    expect(getNextIndex(0, 3)).toBe(1);
    expect(getNextIndex(1, 3)).toBe(2);
    expect(getNextIndex(2, 3)).toBe(0);
  });

  test("getNextIndex - should return 0 for empty or invalid length", () => {
    expect(getNextIndex(0, 0)).toBe(0);
    expect(getNextIndex(2, -5)).toBe(0);
  });

  test("getPrevIndex - should loop to end when reaching start of array", () => {
    expect(getPrevIndex(0, 3)).toBe(2);
    expect(getPrevIndex(2, 3)).toBe(1);
    expect(getPrevIndex(1, 3)).toBe(0);
  });

  test("getPrevIndex - should return 0 for empty or invalid length", () => {
    expect(getPrevIndex(0, 0)).toBe(0);
    expect(getPrevIndex(2, -1)).toBe(0);
  });

  console.log(`\n\x1b[36m📊 Test Summary:\x1b[0m \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

module.exports = { runTests };
