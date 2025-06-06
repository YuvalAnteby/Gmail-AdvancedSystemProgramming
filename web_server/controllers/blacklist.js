const Blacklist = require('../models/blacklist');
const {extractUrls} = require("../utils/mails");

/**
 * Adds a URL to the blacklist.
 * Validates the provided URL, normalizes it by removing trailing slashes,
 * and attempts to insert it into the blacklist. If the URL is already blacklisted,
 * no content is returned. On success, sets the Location header to the new resource.
 * @param req HTTP request, expects JSON body with `url` field
 * @param res HTTP response
 * @returns 201 Created with Location header if newly added;
 * 204 No Content if URL was already in blacklist;
 * 400 Bad Request if URL is missing or invalid;
 * 502 on server error
 */
exports.addToBlacklist = async (req, res) => {
    const rawUrl = req.body.url;
    const {subject, body} = req.body;
    if (rawUrl) {
        // if we received only a URL - we should just add it
        const {code, message} = await addUrlToBlacklist(rawUrl);
        res.status(code);
        if (message)
            res.json({error: message});
        res.end();

    } else if (subject && body) {
        // if we received a mail we should extract and report URLs in it as blacklisted
        const {code, message} = await addMailToBlacklist(subject, body);
        res.status(code);
        if (message)
            res.json({error: message});
        res.end();
    } else { // this one is just invalid input
        return res.status(400).json({error: 'URL or mail is required'})
    }
};

/**
 * Adds a URL to the blacklist.
 * Validates the provided URL, normalizes it by removing trailing slashes,
 * and attempts to insert it into the blacklist. If the URL is already blacklisted,
 * no content is returned. On success, sets the Location header to the new resource.
 * @param rawUrl
 * @returns 201 Created with Location header if newly added;
 * 204 No Content if URL was already in blacklist;
 * 400 Bad Request if URL is missing or invalid;
 * 502 on server error
 */
async function addUrlToBlacklist(rawUrl) {
    let validated;
    try {
        // Remove trailing slashes
        validated = String(rawUrl).toString().replace(/\/+$/, '');
    } catch {
        return {code: 400, message: 'error: Invalid URL'};
    }
    try {
        const created = await Blacklist.addToBlacklist(String(validated));
        if (created) {
            return {code: 201};
        }
        return {code: 204};
    } catch (err) {
        console.error('error in addToBlacklist controller:', err);
        return {code: 502};
    }
}

/**
 * Adds URLs in a mail to the blacklist
 * @param {string} subject of the mail
 * @param {string} body of the mail
 * @returns 201 Created with Location header if newly added;
 * 204 No Content if URL was already in blacklist;
 * 400 Bad Request if URL is missing or invalid;
 * 502 on server error
 */
async function addMailToBlacklist(subject, body) {
    let urls = extractUrls(subject).concat(extractUrls(body));
    let validated = [];
    for (const u of urls) {
        try {
            // Remove trailing slashes and add to the validated URLs array
            const valid = String(u).toString().replace(/\/+$/, '');
            if (valid)
                validated.push(valid);
        } catch {
        }
    }
    try {
        const created = await Blacklist.addToBlacklist(validated);
        if (created) {
            return {code: 201};
        }
        return {code: 204};
    } catch (err) {
        console.error('error in addToBlacklist controller:', err);
        return {code: 502};
    }
}

/**
 * Checks if a given URL is in the blacklist.
 * Decodes and normalizes the URL from the request parameters,
 * then queries the blacklist model.
 * @param req HTTP request, expects `url` parameter in the path
 * @param res HTTP response
 * @returns  JSON object `{ blacklisted: boolean }` if successful;
 *  400 Bad Request if URL parameter is invalid;
 *  502 Bad Gateway on server error
 */
exports.isInBlacklist = async (req, res) => {
    let decoded;
    try {
        decoded = decodeURIComponent(req.params.url).replace(/\/+$/, '');  // Normalize
    } catch {
        return res.status(400).json({error: 'Invalid URL encoding'});
    }

    try {
        const found = await Blacklist.isInBlacklist([decoded]);
        return res.json({blacklisted: found});
    } catch (err) {
        console.error('Error in isInBlacklist controller:', err);
        return res.status(502).end();
    }
};

/**
 * Removes a URL from the blacklist.
 * Decodes and normalizes the URL from the request parameters,
 * then attempts to delete it from the blacklist. Returns 204 if removed,
 * 404 if not found.
 * @param req HTTP request, expects `url` parameter in the path
 * @param res HTTP response
 * @returns  204 No Content if URL was removed;
 * 404 Not Found if URL was not in blacklist;
 * 400 Bad Request if URL parameter is invalid;
 * 502 Bad Gateway on server error
 */
exports.deleteFromBlacklist = async (req, res) => {
    let decoded;
    try {
        decoded = decodeURIComponent(req.params.url).replace(/\/+$/, '');  // Normalize
    } catch {
        return res.status(400).json({error: 'Invalid URL encoding'});
    }

    try {
        const removed = await Blacklist.deleteFromBlacklist(decoded);
        if (removed) {
            return res.status(204).end();
        }
        return res.status(404).json({error: 'Not found'});
    } catch (err) {
        console.error('Error in deleteFromBlacklist controller:', err);
        return res.status(502).end();
    }
};
