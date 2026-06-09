/**
 * Mappe une ligne brute de base de données de logement vers un objet structuré.
 * @param {Object} row - La ligne de base de données.
 * @returns {Object|null} L'objet logement formaté ou null.
 */
function mapPropertyRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    cover: row.cover,
    location: row.location,
    price_per_night: row.price_per_night,
    rating_avg: row.rating_avg,
    ratings_count: row.ratings_count,
    host: row.host_id ? { id: row.host_id, name: row.host_name, picture: row.host_picture, rating: row.host_rating || 5.0 } : undefined,
  };
}

/**
 * Génère un identifiant aléatoire unique de 8 caractères hexadécimaux.
 * @returns {string} L'identifiant généré.
 */
function genId() {
  return Math.random().toString(16).slice(2, 10);
}

/**
 * Convertit une chaîne de caractères en slug URL-friendly.
 * @param {string} input - La chaîne à convertir.
 * @returns {string} Le slug généré.
 */
function slugify(input) {
  const s = String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const slug = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
  return slug || 'property';
}

/**
 * S'assure qu'un slug est unique dans la base de données.
 * @param {Object} db - Instance de la base de données.
 * @param {string} base - Le slug de base.
 * @param {string|null} [excludeId=null] - Un identifiant de logement à exclure de la recherche.
 * @returns {Promise<string>} Le slug unique garanti.
 */
async function ensureUniqueSlug(db, base, excludeId = null) {
  let slug = base;
  let n = 2;
  while (true) {
    const row = excludeId
      ? await db.getAsync('SELECT id FROM properties WHERE slug = ? AND id != ?', [slug, excludeId])
      : await db.getAsync('SELECT id FROM properties WHERE slug = ?', [slug]);
    if (!row) return slug;
    slug = `${base}-${n++}`;
  }
}

/**
 * Récupère la liste résumée de tous les logements de la plateforme.
 * @param {Object} db - Instance de la base de données.
 * @returns {Promise<Object[]>} Liste des logements formatés.
 */
async function listProperties(db) {
  const rows = await db.allAsync(`
      SELECT p.*, u.name AS host_name, u.picture AS host_picture, u.rating AS host_rating
      FROM properties p
      JOIN users u ON u.id = p.host_id
      ORDER BY p.title ASC
    `);
  return rows.map(mapPropertyRow);
}

/**
 * Récupère les informations complètes d'un logement, incluant ses photos, équipements et tags.
 * @param {Object} db - Instance de la base de données.
 * @param {string} id - L'identifiant du logement.
 * @returns {Promise<Object|null>} Objet logement complet ou null si non trouvé.
 */
async function getPropertyDetails(db, id) {
  const row = await db.getAsync(`
    SELECT p.*, u.name AS host_name, u.picture AS host_picture, u.rating AS host_rating
    FROM properties p
    JOIN users u ON u.id = p.host_id
    WHERE p.id = ?
  `, [id]);
  if (!row) return null;
  const base = mapPropertyRow(row);
  const pictures = await db.allAsync('SELECT url FROM property_pictures WHERE property_id = ?', [id]);
  const equipments = await db.allAsync('SELECT name FROM property_equipments WHERE property_id = ?', [id]);
  const tags = await db.allAsync('SELECT name FROM property_tags WHERE property_id = ?', [id]);
  return {
    ...base,
    pictures: pictures.map(r => r.url),
    equipments: equipments.map(r => r.name),
    tags: tags.map(r => r.name),
  };
}

/**
 * S'assure qu'un hôte existe dans la base de données. Le crée s'il n'existe pas.
 * @param {Object} db - Instance de la base de données.
 * @param {number|null} host_id - L'identifiant de l'hôte.
 * @param {Object} host - Données de l'hôte s'il doit être créé.
 * @returns {Promise<number|null>} L'identifiant de l'hôte existant ou nouvellement créé.
 */
async function ensureHost(db, host_id, host) {
  if (host_id) return host_id;
  if (host && host.name) {
    const hostName = String(host.name);
    const hostPic = host.picture || null;
    const found = await db.getAsync('SELECT id FROM users WHERE name = ? AND IFNULL(picture, "") = IFNULL(?, "")', [hostName, hostPic]);
    if (found) return found.id;
    const ins = await db.runAsync('INSERT INTO users(name, picture, role) VALUES (?,?,?)', [hostName, hostPic, 'owner']);
    return ins.lastID;
  }
  return null;
}

/**
 * Crée un nouveau logement et ses tables enfants associées (photos, équipements, tags).
 * @param {Object} db - Instance de la base de données.
 * @param {Object} payload - Données du logement à insérer.
 * @returns {Promise<Object>} Les détails du logement créé.
 */
async function createProperty(db, payload) {
  const {
    id,
    title,
    description = null,
    cover = null,
    location = null,
    price_per_night,
    host_id,
    host,
    pictures = [],
    equipments = [],
    tags = [],
  } = payload || {};

  if (!title) throw new Error('title is required');
  let price = Number(price_per_night);
  if (!Number.isFinite(price) || price <= 0) price = 80;

  const resolvedHostId = await ensureHost(db, host_id, host);
  if (!resolvedHostId) {
    const err = new Error('host_id or host{name,picture} is required');
    err.status = 400;
    throw err;
  }

  const newId = id || genId();
  const base = slugify(title);
  const uniqueSlug = await ensureUniqueSlug(db, base);
  await db.runAsync(
    'INSERT INTO properties(id, title, slug, description, cover, location, host_id, price_per_night) VALUES (?,?,?,?,?,?,?,?)',
    [newId, title, uniqueSlug, description, cover, location, resolvedHostId, price]
  );

  if (Array.isArray(pictures)) {
    for (const url of pictures) {
      if (url) await db.runAsync('INSERT OR IGNORE INTO property_pictures(property_id, url) VALUES (?,?)', [newId, url]);
    }
  }
  if (Array.isArray(equipments)) {
    for (const name of equipments) {
      if (name) await db.runAsync('INSERT OR IGNORE INTO property_equipments(property_id, name) VALUES (?,?)', [newId, name]);
    }
  }
  if (Array.isArray(tags)) {
    for (const name of tags) {
      if (name) await db.runAsync('INSERT OR IGNORE INTO property_tags(property_id, name) VALUES (?,?)', [newId, name]);
    }
  }

  return await getPropertyDetails(db, newId);
}

/**
 * Modifie les données d'un logement et met à jour ses tables enfants associées.
 * @param {Object} db - Instance de la base de données.
 * @param {string} id - L'identifiant du logement.
 * @param {Object} changes - Les modifications à appliquer.
 * @returns {Promise<Object>} Les détails mis à jour du logement.
 */
async function updateProperty(db, id, changes) {
  const allowed = ['title', 'description', 'cover', 'location', 'host_id', 'price_per_night'];
  const fields = [];
  const params = [];

  let newSlug = null;
  if (Object.prototype.hasOwnProperty.call(changes || {}, 'title')) {
    const base = slugify(changes.title);
    newSlug = await ensureUniqueSlug(db, base, id);
  }

  for (const k of allowed) {
    if (k in (changes || {})) {
      fields.push(`${k} = ?`);
      params.push(changes[k]);
    }
  }
  if (newSlug) {
    fields.push('slug = ?');
    params.push(newSlug);
  }

  const hasSubLists = ('pictures' in (changes || {})) || ('equipments' in (changes || {})) || ('tags' in (changes || {}));

  if (fields.length === 0 && !hasSubLists) {
    const err = new Error('No fields to update');
    err.status = 400;
    throw err;
  }

  if (fields.length > 0) {
    params.push(id);
    const exists = await db.getAsync('SELECT id FROM properties WHERE id = ?', [id]);
    if (!exists) {
      const err = new Error('Property not found');
      err.status = 404;
      throw err;
    }
    await db.runAsync(`UPDATE properties SET ${fields.join(', ')} WHERE id = ?`, params);
  }

  if (Array.isArray(changes.pictures)) {
    await db.runAsync('DELETE FROM property_pictures WHERE property_id = ?', [id]);
    for (const url of changes.pictures) {
      if (url) await db.runAsync('INSERT OR IGNORE INTO property_pictures(property_id, url) VALUES (?,?)', [id, url]);
    }
  }

  if (Array.isArray(changes.equipments)) {
    await db.runAsync('DELETE FROM property_equipments WHERE property_id = ?', [id]);
    for (const name of changes.equipments) {
      if (name) await db.runAsync('INSERT OR IGNORE INTO property_equipments(property_id, name) VALUES (?,?)', [id, name]);
    }
  }

  if (Array.isArray(changes.tags)) {
    await db.runAsync('DELETE FROM property_tags WHERE property_id = ?', [id]);
    for (const name of changes.tags) {
      if (name) await db.runAsync('INSERT OR IGNORE INTO property_tags(property_id, name) VALUES (?,?)', [id, name]);
    }
  }

  return await getPropertyDetails(db, id);
}

/**
 * Supprime un logement de la base de données.
 * @param {Object} db - Instance de la base de données.
 * @param {string} id - L'identifiant du logement.
 */
async function deleteProperty(db, id) {
  const r = await db.runAsync('DELETE FROM properties WHERE id = ?', [id]);
  if (r.changes === 0) {
    const err = new Error('Property not found');
    err.status = 404;
    throw err;
  }
}

/**
 * Récupère l'identifiant du propriétaire (hôte) d'un logement spécifique.
 * @param {Object} db - Instance de la base de données.
 * @param {string} id - L'identifiant du logement.
 * @returns {Promise<number|null>} L'identifiant de l'hôte propriétaire ou null si non trouvé.
 */
async function getPropertyOwnerId(db, id) {
  const row = await db.getAsync('SELECT host_id FROM properties WHERE id = ?', [id]);
  return row ? row.host_id : null;
}

module.exports = {
  listProperties,
  getPropertyDetails,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyOwnerId,
};
