const net = require('net');
const url = require("node:url");
const HOST = 'run_server';
const PORT = 12347;

let client = null;

/**
 * Create a new TCP connection to the CPP server of the bloom filter
 * @returns {Promise<unknown>}
 */
async function connectToServer() {
    return new Promise((resolve, reject) => {
        client = new net.Socket();
        client.connect(PORT, HOST, resolve);
        client.on('error', reject);
    });
}

/**
 * Ends a TCP connection with the CPP server.
 * @returns {Promise<void>}
 */
async function disconnectFromServer() {
    if (client) {
        client.destroy();
        client = null;
    }
}

/**
 * Sends a command message to the CPP server
 * @param message command (POST, GET, DELETE), then a URL to make the command on
 * @returns {Promise<unknown>}
 */
async function sendToCppServer(message) {
    return new Promise((resolve, reject) => {
        if (!client)
            return reject(new Error('No connection'));
        client.once('data', (data) => {
            resolve(data.toString().trim());
        });
        client.write(message);
    });
}

/**
 * Adds new URLs to the blacklist
 * @param urls to be added
 * @returns {Promise<*>} true if added successfully
 */
const addToBlacklist = async (urls) => {
    try {
        // connect to CPP server and send the command
        await connectToServer();
        for (const url of urls) {
            const command = `POST ${url}`;
            const result = await sendToCppServer(command);
            // check the outcome and return matching true/false
            if (!result.trim().toLowerCase().includes('201 created')) {
                await disconnectFromServer();
                return false;
            }
        }
    } catch (err) {
        console.error(`addToBlacklist ${urls} error:`, err);
        return false;
    } finally {
        await disconnectFromServer();
    }
    return true;
}

/**
 * Checks if any url in a given array of URLs is blacklisted
 * @param urls array of URLs
 * @returns {Promise<boolean>} true if at least one URL is blacklisted, otherwise false
 */
const isInBlacklist = async (urls) => {
    try {
        await connectToServer()
        // Check every URL
        for (const url of urls) {
            const command = `GET ${url}`;
            const result = await sendToCppServer(command);
            // if found a blacklisted URL stop the check
            if (result.trim().toLowerCase().includes("true true")) {
                await disconnectFromServer();
                return true;
            }
        }
    } catch (err) {
        console.error(`isInBlacklist ${url} error:`, err);
        return false;
    } finally {
        await disconnectFromServer();
    }
    return false;
}

/**
 * Delete a URL from the blacklist
 * @param urls to be deleted
 * @returns {Promise<boolean>} true of deleted successfully, otherwise false
 */
const deleteFromBlacklist = async (urls) => {
    let isSuccessful = true;
    try {
        // connect to CPP server and send the command
        await connectToServer();
        for (const url of urls) {
            const command = `DELETE ${url}`;
            const result = await sendToCppServer(command);
            // check the outcome and return matching true/false
            if (!result.trim().toLowerCase().includes('204 no content')) {
                await disconnectFromServer();
                isSuccessful = false;
            }
        }
    } catch (err) {
        console.error(`deleteFromBlacklist ${url} error:`, err);
        return false;
    } finally {
        await disconnectFromServer();
    }
    return isSuccessful;
}

module.exports = {addToBlacklist, isInBlacklist, deleteFromBlacklist}