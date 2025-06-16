/**
 * Ensures the JWT token saved in the user's browser isn't expired
 * @param token JWT token
 * @returns {boolean} true if expired, false if valid
 */
function isJwtExpired(token) {
    if (!token.exp) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= token.exp;
}

/**
 * Fetches the safe user object saved locally by the user's JWT token
 * @returns {any|null} safe user object, null if user not found or no token is saved.
 */
export function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        // basic data { userId, fullName, mail, image etc } NO PASSWORD
        const payload = JSON.parse(atob(token.split('.')[1]));
        // ensure the token is valid, if not remove it
        if (isJwtExpired(payload)) {
            localStorage.removeItem("token");
            return null;
        }
        return payload;
    } catch (err) {
        console.error("Invalid JWT", err);
        localStorage.removeItem("token");
        return null;
    }
}

/**
 * Logs the user out by removing the JWT token
 */
export function logout() {
    localStorage.removeItem("token");
}