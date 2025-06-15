// Base URL — adjust port if needed
const API_BASE = "http://localhost:3001/api";

export async function registerUserWithJwt(user) {
    try {
        const res = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (res.status === 400 && data.error === 'mail already exists') {
            alert('Email already exists. Please choose a different one.');
            return;
        }

        if (res.status === 201 && data.token) {
            return data.token;
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Unexpected error occurred. Please try again later.');
    }
}

/**
 * POST api/tokens
 * @param {string} mail of the user, in order to login
 * @param {string} password of the user, in order to login
 * @returns {Promise<*|string|number>}
 * - 400 if the email or password is wrong
 * - 500 if an unexpected error occurred (catch invoked)
 * - token if successfully logged in
 */
export async function loginWithJwt(mail, password) {
    try {
        const result = await fetch(`${API_BASE}/tokens`, {
            method: "POST",
            body: JSON.stringify({mail, password}),
            headers: {"Content-Type": "application/json"},
        });

        if (!result.ok) {
            console.error("Login error:", result.statusText);
            return 400;
        }
        const data = await result.json();
        const token = data.token;
        localStorage.setItem("token", token);
        return token;
    } catch (error) {
        console.error("Network error:", error.message);
        return 500;
    }
}
