const path = require('path');
const fs = require('fs');

async function uploadImage(req, res) {
  let multer;
  try {
    multer = require('multer');
  } catch (e) {
    return res.status(500).json({ error: 'Upload not available: missing dependency (multer)' });
  }

  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  const useMemoryStorage = process.env.VERCEL === "1";

  if (!useMemoryStorage) {
    try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (_) { }
  }

  const storage = useMemoryStorage
    ? multer.memoryStorage()
    : multer.diskStorage({
      destination: function (req, file, cb) { cb(null, uploadDir); },
      filename: function (req, file, cb) {
        const ext = path.extname(file && file.originalname ? file.originalname : '').toLowerCase();
        const base = Date.now() + '-' + Math.random().toString(16).slice(2, 10);
        cb(null, base + ext);
      }
    });

  const fileFilter = function (req, file, cb) {
    if (file && file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  };

  const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).single('file');

  upload(req, res, async function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'file is required (field name "file")' });

    let publicUrl;
    let filename;

    if (useMemoryStorage) {
      const base64 = req.file.buffer.toString('base64');
      publicUrl = `data:${req.file.mimetype};base64,${base64}`;
      const ext = path.extname(req.file.originalname || '').toLowerCase();
      filename = Date.now() + '-' + Math.random().toString(16).slice(2, 10) + ext;
    } else {
      publicUrl = '/uploads/' + req.file.filename;
      filename = req.file.filename;
    }

    const purpose = (req.body && String(req.body.purpose || '').toLowerCase()) || null;
    const propertyId = req.body && req.body.property_id ? String(req.body.property_id) : null;

    if (propertyId) {
      try {
        const db = req.app.locals.db;
        const p = await db.getAsync('SELECT id FROM properties WHERE id = ?', [propertyId]);
        if (!p) return res.status(404).json({ error: 'Property not found for provided property_id' });
      } catch (e) {
        return res.status(500).json({ error: 'Validation failed: ' + e.message });
      }
    }

    let instructions = 'Upload successful. Use the returned URL where appropriate.';
    if (purpose === 'property-cover') {
      instructions = propertyId
        ? `Set as cover: PATCH /api/properties/${propertyId} with { "cover": "${publicUrl}" }`
        : 'Set as cover of a property by PATCH /api/properties/{id} with { "cover": "<url>" }';
    } else if (purpose === 'property-picture') {
      instructions = propertyId
        ? 'Add to gallery when creating/updating property data. Currently, pictures are provided when creating a property: include the URL in the pictures array.'
        : 'Include the URL in the "pictures" array when creating a property.';
    } else if (purpose === 'user-picture') {
      const userId = req.user && req.user.id ? String(req.user.id) : '{yourUserId}';
      instructions = `Set as user picture: PATCH /api/users/${userId} with { "picture": "${publicUrl}" } (self or admin)`;
    }

    res.status(201).json({
      url: publicUrl,
      filename: filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      purpose: purpose,
      property_id: propertyId || undefined,
      instructions
    });
  });
}

async function deleteImages(req, res) {
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  const useMemoryStorage = process.env.VERCEL === "1";

  if (!useMemoryStorage) {
    try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (_) { }
  }

  function toFilename(item) {
    if (!item) return null;
    const s = String(item);
    if (s.startsWith('data:')) {
      return s;
    }
    const base = s.includes('/uploads/') ? s.split('/uploads/').pop() : path.basename(s);
    if (base.includes('..') || base.includes('/') || base.includes('\\')) return null;
    return base;
  }

  let inputs = [];
  if (req.body && Array.isArray(req.body.filenames)) inputs = inputs.concat(req.body.filenames);
  if (req.body && Array.isArray(req.body.urls)) inputs = inputs.concat(req.body.urls);
  if (req.body && typeof req.body.filename === 'string') inputs.push(req.body.filename);
  if (req.body && typeof req.body.url === 'string') inputs.push(req.body.url);

  if (typeof req.query.filenames === 'string') inputs = inputs.concat(req.query.filenames.split(','));
  if (typeof req.query.filename === 'string') inputs.push(req.query.filename);
  if (typeof req.query.urls === 'string') inputs = inputs.concat(req.query.urls.split(','));
  if (typeof req.query.url === 'string') inputs.push(req.query.url);

  const set = new Set(inputs.map(toFilename).filter(Boolean));
  if (set.size === 0) {
    return res.status(400).json({ error: 'Provide filename(s) or url(s) to delete (filenames[], urls[], filename, url, or query params).' });
  }

  const filenames = Array.from(set);
  const results = [];
  const deleted = [];
  const not_found = [];
  const errors = [];

  const db = req.app.locals.db;
  for (const name of filenames) {
    const isDataUri = name && name.startsWith('data:');
    const full = isDataUri ? null : path.join(uploadDir, name);
    try {
      if (isDataUri) {
        deleted.push(name);
        results.push({ filename: name, status: 'deleted' });

        try {
          await db.runAsync('DELETE FROM property_pictures WHERE url = ?', [name]);
        } catch (_) { }
        try {
          await db.runAsync('UPDATE properties SET cover = NULL WHERE cover = ?', [name]);
        } catch (_) { }
        try {
          await db.runAsync('UPDATE users SET picture = NULL WHERE picture = ?', [name]);
        } catch (_) { }
        continue;
      }

      if (!fs.existsSync(full)) {
        not_found.push(name);
        results.push({ filename: name, status: 'not_found' });
        continue;
      }
      fs.unlinkSync(full);
      deleted.push(name);
      results.push({ filename: name, status: 'deleted' });

      const url = '/uploads/' + name;
      try {
        await db.runAsync('DELETE FROM property_pictures WHERE url = ?', [url]);
      } catch (_) { }
      try {
        await db.runAsync('UPDATE properties SET cover = NULL WHERE cover = ?', [url]);
      } catch (_) { }
      try {
        await db.runAsync('UPDATE users SET picture = NULL WHERE picture = ?', [url]);
      } catch (_) { }
    } catch (e) {
      errors.push({ filename: name, error: e.message });
      results.push({ filename: name, status: 'error', error: e.message });
    }
  }

  const status = errors.length === 0 ? 200 : (deleted.length > 0 ? 207 : 400);
  return res.status(status).json({ ok: errors.length === 0, deleted, not_found, errors, results });
}

module.exports = { uploadImage, deleteImages };
