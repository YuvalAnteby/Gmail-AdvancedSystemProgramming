const Blacklist = require('../models/blacklist');
const Mails = require('../models/mails');
const {extractUrls} = require("../utils/mails");

/**
 * Adds a URL to the blacklist.
 * Validates the provided URL, normalizes it by removing trailing slashes,
 * and attempts to insert it into the blacklist. If the URL is already blacklisted,
 * no content is returned. On success, sets the Location header to the new resource.
 * @param req HTTP request, expects JSON body with `url` field, if inserting a mail - mailId
 * @param res HTTP response
 * @returns 201 Created if newly added;
 * 204 No Content if no URL are given in mail
 * 400 Bad Request if URL is missing or invalid;
 * 502 on server error
 */
exports.addToBlacklist = async (req, res) => {
    const rawUrl = req.body.url;
    const mailId = req.body.mailId;
    // check for valid input
    if (!rawUrl && !mailId)
        return res.status(400).json({error: 'URL or mail is required'})
    // find the mail and fetch it's subject and body
    const {subject, body} = Mails.getMail(Number(mailId));

    try {
        // gotten a single URL - add it and finish
        if (rawUrl) {
            // Remove trailing slashes
            const validated = String(rawUrl).toString().replace(/\/+$/, '');
            const created = await Blacklist.addToBlacklist(String(validated));
            if (created) {
                res.status(201).end();
            } else {
                res.status(400).end();
            }
        }
        // we haven't gotten a single URL, meaning we got a mail - check it's content and add URLs to blacklist
        const urls = [
            ...extractUrls(subject),
            ...extractUrls(body)
        ]
            .map(extractUrls)
            .filter((u) => u !== null);
        // Check if the mail got any URLs
        if (urls.length === 0)
            return res.status(204).json({ error: 'No valid URLs found in mail' });
        // found URLs - add to blacklist
        const added = await Blacklist.addToBlacklist(urls);
        if (added) {
            res.status(201).end();
        } else {
            res.status(204).end();
        }

    } catch (error) {
        // in case a server error occurred
        console.error('Error in addToBlacklist:', error);
        res.status(502).json({ error: 'Server error' });
    }
};


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
