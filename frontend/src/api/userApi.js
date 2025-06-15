export async function registerUserWithJwt(user) {
    try {
        const res = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

export async function loginWithJwt(mail, password) {
    try {
        const res = await fetch('http://localhost:3001/api/tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail, password })
        });

        const data = await res.json();

        if (res.status === 200 && data.token) {
            return { token: data.token };
        } else {
            return { error: data.error || 'Login failed' };
        }
    } catch (err) {
        console.error('Login error:', err);
        return { error: 'Server error during login' };
    }
}
