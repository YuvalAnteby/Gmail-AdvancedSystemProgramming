import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
    const [theme, setTheme] = useState('dark');
    const [formData, setFormData] = useState({mail: '', password: ''});
    const navigate = useNavigate();

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
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {mail, password} = formData;

        try {
            const result = await fetch("http://localhost:3001/api/tokens", {
                method: "POST",
                body: JSON.stringify({mail, password}),
                headers: {"Content-Type": "application/json"},
            });

            if (result.ok) {
                const data = await result.json();
                const token = data.token;
                localStorage.setItem("token", token);

                setFormData({mail: "", password: ""});
                navigate("/inbox", {replace: true});
            } else {
                alert("Login failed. Please check your username and password.");
                console.error("Login error:", result.statusText);
                setFormData({mail: "", password: ""});
            }
        } catch (error) {
            console.error("Network error:", error.message);
            alert("Network error occurred. Please try again.");
            setFormData({mail: "", password: ""});
        }
    };


    return (
        <div className={`signup-container ${theme}-mode`}>
            <div className="theme-toggle">
                <button onClick={toggleTheme}>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            <div className="signup-box">
                <img src="/logo192.png" alt="Logo" className="logo"/>
                <h2>LOGIN</h2>

                <form onSubmit={handleSubmit}>
                    <input type="email" name="mail" placeholder="Email" value={formData.mail}
                           onChange={handleChange} required/>
                    <input type="password" name="password" placeholder="Password" value={formData.password}
                           onChange={handleChange} required/>
                    <div className="actions">
                        <button type="button" className="link-button" onClick={() =>
                            navigate('/signup')}>Create account
                        </button>
                        <button type="submit" className="next">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
