import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; //  Needed for routing
import './LoginPage.css';
import { loginWithJwt } from '../api/userApi'; // Your API call

export default function LoginPage() {
    const [theme, setTheme] = useState('dark');
    const [formData, setFormData] = useState({
        mail: '',
        password: ''
    });

    const navigate = useNavigate(); // ✅ Navigation to signup

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await loginWithJwt(formData.mail, formData.password);

        if (res.id) {
            localStorage.setItem('userId', res.id);
            window.location.href = '/inbox';
        } else {
            alert(res.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className={`signup-container ${theme}-mode`}>
            {/* Theme toggle */}
            <div className="theme-toggle">
                <button onClick={toggleTheme}>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {/* Login Box */}
            <div className="signup-box">
                <img
                    src="/logo192.png"
                    alt=" Logo"
                    className="logo"
                />
                <h2>LOGIN IN</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="mail"
                        placeholder="Email"
                        value={formData.mail}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {/* Bottom actions */}
                    <div className="actions">
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => navigate('/signup')}
                        >
                            Create account
                        </button>

                        <button type="submit" className="next">login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
