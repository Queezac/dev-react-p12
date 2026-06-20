function runTests(favoritesLib) {
  const { getFavoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite } = favoritesLib;

  let passed = 0;
  let failed = 0;

  function expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toBeTrue() {
        if (actual !== true) {
          throw new Error(`Expected ${actual} to be true`);
        }
      },
      toBeFalse() {
        if (actual !== false) {
          throw new Error(`Expected ${actual} to be false`);
        }
      },
      toEqual(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
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

  console.log("\n\x1b[36m🏃 Running unit tests for Favorites Manager...\x1b[0m");

  global.localStorage.clear();

  test("Initial favorite list should be empty", () => {
    const ids = getFavoriteIds();
    expect(Array.isArray(ids)).toBeTrue();
    expect(ids.length).toBe(0);
  });

  test("Should successfully add first property ID to favorites", () => {
    addFavorite("prop-1");
    const ids = getFavoriteIds();
    expect(ids.length).toBe(1);
    expect(ids[0]).toBe("prop-1");
    expect(isFavorite("prop-1")).toBeTrue();
    expect(isFavorite("prop-2")).toBeFalse();
  });

  test("Should not add duplicate property IDs", () => {
    addFavorite("prop-1");
    const ids = getFavoriteIds();
    expect(ids.length).toBe(1);
  });

  test("Should successfully remove property ID from favorites", () => {
    removeFavorite("prop-1");
    const ids = getFavoriteIds();
    expect(ids.length).toBe(0);
    expect(isFavorite("prop-1")).toBeFalse();
  });

  test("toggleFavorite should toggle property status", () => {
    toggleFavorite("prop-3");
    expect(isFavorite("prop-3")).toBeTrue();
    toggleFavorite("prop-3");
    expect(isFavorite("prop-3")).toBeFalse();
  });

  console.log(`\n\x1b[36m📊 Test Summary:\x1b[0m \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

module.exports = { runTests };
