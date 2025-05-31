const Blacklist = require('../models/blacklist');


exports.addToBlacklist = async (req, res) => {
    const raw = req.body.url;
    if (!raw) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let validated;
    try {
        validated = String(raw).toString().replace(/\/+$/, '');  // Remove trailing slashes
    } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const created = await Blacklist.addToBlacklist(String(validated));
        if (created) {
            res.set('Location', `/api/blacklist/${encodeURIComponent(validated)}`);
            return res.status(201).end();
        }
        return res.status(204).end();
    } catch (err) {
        console.error('Error in addToBlacklist controller:', err);
        return res.status(502).end();
    }
};

exports.isInBlacklist = async (req, res) => {
    let decoded;
    try {
        decoded = decodeURIComponent(req.params.url).replace(/\/+$/, '');  // Normalize
    } catch {
        return res.status(400).json({ error: 'Invalid URL encoding' });
    }

    try {
        const found = await Blacklist.isInBlacklist([decoded]);
        return res.json({ blacklisted: found });
    } catch (err) {
        console.error('Error in isInBlacklist controller:', err);
        return res.status(502).end();
    }
};

exports.deleteFromBlacklist = async (req, res) => {
    let decoded;
    try {
        decoded = decodeURIComponent(req.params.url).replace(/\/+$/, '');  // Normalize
    } catch {
        return res.status(400).json({ error: 'Invalid URL encoding' });
    }

    try {
        const removed = await Blacklist.deleteFromBlacklist(decoded);
        if (removed) {
            return res.status(204).end();
        }
        return res.status(404).json({ error: 'Not found' });
    } catch (err) {
        console.error('Error in deleteFromBlacklist controller:', err);
        return res.status(502).end();
    }
};
