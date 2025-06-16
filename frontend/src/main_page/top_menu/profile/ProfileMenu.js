import './ProfileMenu.css';
import {useRef} from "react";

const ProfileMenu = ({theme, toggleTheme, imageUrl, fullName, onUploadImage}) => {
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) onUploadImage(file);
    };

    return (
        <div className={`profile-popup ${theme}-popup`}>
            <div className="d-flex flex-column align-items-center p-3">
                <img src={imageUrl} alt="Profile" className="popup-img mb-2"/>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleImageUpload}
                />
                <div className="hello-text">Hello, <strong>{fullName}</strong>!</div>
                <button className="btn btn-outline-success btn-sm mt-3" onClick={() => fileInputRef.current.click()}>
                    Change picture
                </button>
                <button
                    className={`btn btn-outline-${theme === 'light' ? 'dark' : 'light'} btn-sm mt-3`}
                    onClick={toggleTheme}
                >
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
                <button className="btn btn-outline-danger btn-sm mt-3" onClick={() => console.log("Logging out...")}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileMenu;
