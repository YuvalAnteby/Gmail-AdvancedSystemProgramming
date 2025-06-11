import {useRef} from "react";

const ProfileMenu = ({ theme, imageUrl, fullName, onImageUpload, onLogout }) => {

    const fileInputRef = useRef(null);
    const changePictureClick = () => fileInputRef.current.click();

    const handleLogout = () => {
        console.log("Logging out...");
    };

    return (
        <div className={`profile-popup ${theme}-popup`}>
            <div className="d-flex flex-column align-items-center p-3">
                <img
                    src={imageUrl}
                    alt="Profile"
                    className="popup-img mb-2"
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={onImageUpload}
                />
                <div className="hello-text">Hello, <strong>{fullName}</strong>!</div>
                <button className="btn btn-outline-success btn-sm mt-3" onClick={changePictureClick}>Change picture</button>
                <button className="btn btn-outline-danger btn-sm mt-3" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileMenu;
