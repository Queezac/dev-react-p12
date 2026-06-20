module.exports = async function dbReady(req, res, next) {
  const db = req.app && req.app.locals && req.app.locals.db;
  if (db) {
    return next();
  }

  const dbPromise = req.app && req.app.locals && req.app.locals.dbPromise;
  if (!dbPromise) {
    return res.status(503).json({ error: 'Database not ready' });
  }

  try {
    await dbPromise;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database initialization failed', details: err.message });
  }
};
