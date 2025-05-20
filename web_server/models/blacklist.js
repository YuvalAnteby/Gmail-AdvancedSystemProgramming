const net = require('net');
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
        /// TODO test if works good or if a newline char is needed
        //client.write(message + '\n');
        client.write(message);
    });
}

/**
 * Adds a new URL to the blacklist
 * @param url to be added
 * @returns {Promise<*>} true if added successfully
 */
const addToBlacklist = async (url) => {
    // connect to CPP server and send the command
    await connectToServer();
    const command = `POST ${url}`;
    const result = await sendToCppServer(command);
    // check the outcome and return matching true/false
    if (result.trim().toLowerCase().includes('201 created')) {
        await disconnectFromServer();
        return true;
    }
    await disconnectFromServer();
    return false;
}

/**
 * Checks if any url in a given array of URLs is blacklisted
 * @param urls array of URLs
 * @returns {Promise<boolean>} true if at least one URL is blacklisted, otherwise false
 */
const isInBlacklist = async (urls) => {
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
    await disconnectFromServer();
    return false;
}

/**
 * Delete a URL from the blacklist
 * @param url to be deleted
 * @returns {Promise<boolean>} true of deleted successfully, otherwise false
 */
const deleteFromBlacklist = async (url) => {
    // connect to CPP server and send the command
    await connectToServer();
    const command = `DELETE ${url}`;
    const result = await sendToCppServer(command);
    // check the outcome and return matching true/false
    if (result.trim().toLowerCase().includes('204 no content')) {
        await disconnectFromServer();
        return true;
    }
    await disconnectFromServer();
    return false;
}

module.exports = {addToBlacklist, isInBlacklist, deleteFromBlacklist}