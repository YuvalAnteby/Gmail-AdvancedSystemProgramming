import React, { useState, useEffect } from 'react';
import './SignupPage.css';
import { registerUserWithJwt } from '../api/userApi';
import {useTheme} from "./hooks/useTheme";

export default function SignupPage() {
    const {theme, toggleTheme} = useTheme();

    const [formData, setFormData] = useState({
        fullName: '',
        mail: '',
        password: '',
        birthDate: '',
        profileImage: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            fullName: formData.fullName,
            mail: formData.mail,
            password: formData.password,
            dateOfBirth: formData.birthDate,
            image: ''
        };

        const sendUser = (imgData = '') => {
            user.image = imgData;
            registerUserWithJwt(user)
                .then(token => {
                    if (token) {
                        localStorage.setItem('jwtToken', token);
                        window.location.href = '/inbox';
                    } else {
                        alert('Signup failed: No token received');
                    }
                })
                .catch(err => {
                    console.error('Signup error:', err);
                    alert('Signup failed. Please try again.');
                });
        };

        if (formData.profileImage) {
            const reader = new FileReader();
            reader.onload = () => sendUser(reader.result);
            reader.onerror = () => {
                console.error("Image reading failed");
                alert("Failed to read image.");
            };
            reader.readAsDataURL(formData.profileImage);
        } else {
            sendUser();
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
                <img src="/logo192.png" alt="Logo" className="logo" />
                <h2>Create a Mail Account</h2>
                <p className="subtitle">Enter your details</p>

                <form onSubmit={handleSubmit}>
                    <input type="text" name="fullName" placeholder="Full name" value={formData.fullName}
                           onChange={handleChange} required />
                    <input type="email" name="mail" placeholder="Email" value={formData.mail}
                           onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password}
                           onChange={handleChange} required />
                    <input type="text" name="birthDate" placeholder="Date of birth (YYYY/MM/DD)"
                           value={formData.birthDate} onChange={handleChange} required />
                    <label className="file-label">Upload profile image (optional):</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {previewUrl && <div className="image-preview"><img src={previewUrl} alt="Preview" /></div>}
                    <div className="actions"><button type="submit" className="next">Next</button></div>
                </form>
            </div>
        </div>
    );
}
