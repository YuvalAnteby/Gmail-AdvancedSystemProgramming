/// TODO add this to the top menu's profile sub menu and show the full name
/**
 * Fetches the safe user object saved locally by the user's JWT token
 * @returns {any|null} safe user object, null if user not found or no token is saved.
 */
export function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        // basic data { userId, fullName, mail, image etc } NO PASSWORD
        return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
        console.error("Invalid JWT", err);
        return null;
    }
}

