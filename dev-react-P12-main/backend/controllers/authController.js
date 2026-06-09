const { register, login, requestPasswordReset, resetPassword } = require('../services/authService');

/**
 * Récupère le code de statut HTTP correspondant à une erreur.
 * @param {Error} e - L'objet d'erreur.
 * @returns {number} Le code de statut HTTP (défaut : 500).
 */
function statusFromError(e) {
  if (e && e.status) return e.status;
  return 500;
}

/**
 * Contrôleur pour gérer l'inscription d'un nouvel utilisateur.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function doRegister(req, res) {
  const db = req.app.locals.db;
  try {
    const result = await register(db, req.body || {});
    res.status(201).json(result);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

/**
 * Contrôleur pour gérer la connexion d'un utilisateur.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function doLogin(req, res) {
  const db = req.app.locals.db;
  try {
    const result = await login(db, req.body || {});
    res.status(200).json(result);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

/**
 * Contrôleur pour demander la réinitialisation de mot de passe.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function doRequestReset(req, res) {
  const db = req.app.locals.db;
  try {
    const result = await requestPasswordReset(db, req.body || {});
    res.status(200).json(result);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

/**
 * Contrôleur pour réinitialiser le mot de passe à l'aide d'un jeton (token).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
async function doResetPassword(req, res) {
  const db = req.app.locals.db;
  try {
    const result = await resetPassword(db, req.body || {});
    res.status(200).json(result);
  } catch (e) {
    res.status(statusFromError(e)).json({ error: e.message });
  }
}

module.exports = { doRegister, doLogin, doRequestReset, doResetPassword };
