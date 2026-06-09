function runTests(favoritesLib) {
  const { getFavoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite } = favoritesLib;

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  \x1b[32m✅ PASS:\x1b[0m ${message}`);
      passed++;
    } else {
      console.error(`  \x1b[31m❌ FAIL:\x1b[0m ${message}`);
      failed++;
    }
  }

  console.log("\n\x1b[36m🏃 Running unit tests for Favorites Manager...\x1b[0m");

  global.localStorage.clear();

  try {
    const ids = getFavoriteIds();
    assert(Array.isArray(ids) && ids.length === 0, "Initial favorite list should be empty");
  } catch (e) {
    assert(false, `Test 1 threw error: ${e.message}`);
  }

  try {
    addFavorite("prop-1");
    const ids = getFavoriteIds();
    assert(ids.length === 1 && ids[0] === "prop-1", "Should successfully add first property ID to favorites");
    assert(isFavorite("prop-1") === true, "isFavorite should return true for added property ID");
    assert(isFavorite("prop-2") === false, "isFavorite should return false for non-added property ID");
  } catch (e) {
    assert(false, `Test 2 threw error: ${e.message}`);
  }

  try {
    addFavorite("prop-1");
    const ids = getFavoriteIds();
    assert(ids.length === 1, "Should not add duplicate property IDs");
  } catch (e) {
    assert(false, `Test 3 threw error: ${e.message}`);
  }

  try {
    removeFavorite("prop-1");
    const ids = getFavoriteIds();
    assert(ids.length === 0, "Should successfully remove property ID from favorites");
    assert(isFavorite("prop-1") === false, "isFavorite should return false after removal");
  } catch (e) {
    assert(false, `Test 4 threw error: ${e.message}`);
  }

  try {
    toggleFavorite("prop-3");
    assert(isFavorite("prop-3") === true, "toggleFavorite should add property if not present");
    toggleFavorite("prop-3");
    assert(isFavorite("prop-3") === false, "toggleFavorite should remove property if already present");
  } catch (e) {
    assert(false, `Test 5 threw error: ${e.message}`);
  }

  console.log(`\n\x1b[36m📊 Test Summary:\x1b[0m \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

module.exports = { runTests };
