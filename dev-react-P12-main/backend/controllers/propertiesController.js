const {
  listProperties,
  getPropertyDetails,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyOwnerId,
} = require('../services/propertiesService');

/**
 * Récupère le code de statut HTTP correspondant à une erreur.
 * @param {Error} e - L'objet d'erreur.
 * @returns {number} Le code de statut HTTP.
 */
function statusFromError(e) {
  if (e && e.status) return e.status;
  if (e && e.message && /(UNIQUE|PRIMARY KEY)/i.test(e.message)) return 409;
  return 500;
}

/**
 * Récupère la liste de tous les logements.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function list(req, res) {
  const db = req.app.locals.db;
  try {
    const rows = await listProperties(db);
    res.json(rows);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

/**
 * Récupère les détails d'un logement par son identifiant.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function getById(req, res) {
  const db = req.app.locals.db;
  try {
    const prop = await getPropertyDetails(db, req.params.id);
    if (!prop) return res.status(404).json({ error: 'Property not found' });
    res.json(prop);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

/**
 * Crée une nouvelle annonce de logement.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function create(req, res) {
  const db = req.app.locals.db;
  try {
    const created = await createProperty(db, req.body || {});
    res.status(201).json(created);
  } catch (e) {
    const code = statusFromError(e);
    // Mappe le message d'erreur pour la cohérence des validations
    let msg = e.message;
    if (code === 409) msg = 'Property with same id already exists';
    if (msg === 'title is required') return res.status(400).json({ error: msg });
    if (msg.startsWith('host_id')) return res.status(400).json({ error: msg });
    res.status(code).json({ error: msg });
  }
}

/**
 * Modifie les détails d'une annonce de logement existante.
 * Autorisé uniquement aux hôtes propriétaires du logement et aux administrateurs.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function update(req, res) {
  const db = req.app.locals.db;
  try {
    const hostId = await getPropertyOwnerId(db, req.params.id);
    if (!hostId) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (req.user.role !== 'admin' && String(req.user.id) !== String(hostId)) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to update this property' });
    }

    const updated = await updateProperty(db, req.params.id, req.body || {});
    res.json(updated);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

/**
 * Supprime une annonce de logement de la plateforme.
 * Autorisé uniquement aux hôtes propriétaires du logement et aux administrateurs.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function remove(req, res) {
  const db = req.app.locals.db;
  try {
    const hostId = await getPropertyOwnerId(db, req.params.id);
    if (!hostId) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (req.user.role !== 'admin' && String(req.user.id) !== String(hostId)) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this property' });
    }

    await deleteProperty(db, req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
