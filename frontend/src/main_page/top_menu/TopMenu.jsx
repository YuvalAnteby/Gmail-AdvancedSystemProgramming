import { useRef, useState } from "react";
import "./TopMenu.css";
import { useNavigate } from "react-router-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";
import ProfileMenu from "../top_menu/ProfileMenu";

const TopMenu = ({ theme }) => {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    // user picture related vars
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const [imageUrl, setImageUrl] = useState("/profile_default.png");
    const fullName = "Yuval";

    // When user clicks the logo at the top corner
    const onLogoClick = () => {
        setShowMenu(false);
        navigate('/inbox', { state: { inboxType: 'incoming' } });
    };

    // When user clicks their profile picture
    const onProfileClick = () => setShowMenu((prev) => !prev);
    // In the event the user picked a new profile picture
    const onImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setImageUrl(objectURL);
            // TODO update image attribute in the server
            console.log("Temporary object URL:", objectURL);
        }
    };


    useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

    return (
        <div className={`top-menu-wrapper ${theme}-top-menu d-flex align-items-center justify-content-between px-3`}>
            {/* Logo button */}
            <button className="btn logo-btn" onClick={onLogoClick}>
                <img src="/logo192.png" alt="icon" className="logo-img" />
            </button>
            {/* Search bar */}
            <form onSubmit={(e) => e.preventDefault()} className="search-bar d-flex align-items-center">
                <input
                    type="text"
                    className="form-control search-input me-2"
                    placeholder="Search in mails..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn search-btn" type="submit">
                    <i className="bi bi-search"></i>
                </button>
            </form>
            {/* Profile image */}
            <div className="position-relative" ref={menuRef}>
                <button onClick={onProfileClick} className="profile-btn">
                    <img src={imageUrl} alt="Profile" className="profile-img" />
                </button>
                {showMenu && (
                    <ProfileMenu
                        theme={theme}
                        imageUrl={imageUrl}
                        fullName={fullName}
                        onImageUpload={onImageUpload}
                    />
                )}
            </div>
        </div>
    );
};

export default TopMenu;
