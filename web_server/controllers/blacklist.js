const Blacklist = require('../models/blacklist');
const {addToBlacklist} = require("../models/blacklist");



/**
 * POST /api/blacklist
 * Body: { url: string }
 * - 201 Created + Location if new
 * - 204 No Content if already existed (idempotent)
 * - 400 Bad Request if missing URL
 * - 500 Internal Server Error on failure
 */
exports.addToBlacklist = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const created = addToBlacklist(url);
        if (created) {
            // new resource created
            res.set('Location', `/api/blacklist/${encodeURIComponent(url)}`);
            return res.status(201).end();
        } else {
            // already exists, treat as success
            return res.status(204).end();
        }
    } catch (err) {
        console.error('Error adding to blacklist:', err);
        //TODO: make sure if i need this
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {addToBlacklist};