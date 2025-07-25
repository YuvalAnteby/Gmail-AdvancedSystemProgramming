import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginPage.css';
import {loginWithJwt} from "../api/userApi";
import {useTheme} from "../utils/useTheme";
import {useAutoLogin} from "../utils/useAutoLogin";

export default function LoginPage() {
    // attempt to log in automatically if user's token is saved already
    useAutoLogin();

    const {theme, toggleTheme} = useTheme();
    const [formData, setFormData] = useState({mail: '', password: ''});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {mail, password} = formData;
        const token = await loginWithJwt(mail, password);
        setFormData({mail: "", password: ""});
        // show the correct error message or move to the inbox
        if (token === 400) {
            alert('Wrong email or password');
            return;
        }
        if (token === 500) {
            alert('Unexpected error, try again');
            return;
        }
        navigate("/inbox");
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
