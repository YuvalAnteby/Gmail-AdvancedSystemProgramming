import {useEffect, useRef, useState} from "react";
import "./TopMenu.css";
import {useNavigate} from "react-router-dom";
import {useOutsideClick} from "../hooks/useOutsideClick";
import ProfileMenu from "./profile/ProfileMenu";
import SearchBar from "./search/SearchBar";
import {useProfile} from "../hooks/useProfile";
import {APP_NAME} from "../../utils/constants";

const TopMenu = ({theme, toggleTheme, inboxType, setShowSidebar}) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);

    const {imageUrl, fullName, updateImage} = useProfile();

    const onLogoClick = () => {
        setShowMenu(false);
        navigate('/inbox', {state: {inboxType: 'incoming'}});
    };

    const onProfileClick = () => setShowMenu(prev => !prev);
    useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

    const onHamburgerClick = () => {
        setShowSidebar(prev => !prev);
    }

    // side menu un/show logo + name
    const [showLogoName, setShowLogoName] = useState(true);
    useEffect(() => {
        const handleResize = () => {
            setShowLogoName(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`top-menu-wrapper ${theme} px-3`}>
            {showLogoName && (
                <button className="btn logo-btn" onClick={onLogoClick}>
                    <img src="/logo192.png" alt="icon" className="logo-img"/>
                    <span className={`logo-text ${theme}`}>{APP_NAME}</span>
                </button>
            )}
            {!showLogoName && (
                <button className="btn logo-btn logo-btn" onClick={onHamburgerClick}>
                    <i className="bi bi-list" />
                </button>
            )}

            <div className="search-container d-flex align-items-center" style={{position: 'relative'}}>
                <SearchBar theme={theme} inboxType={inboxType}/>
            </div>

            <div className="position-relative" ref={menuRef}>
                <button onClick={onProfileClick} className="profile-btn">
                    <img src={imageUrl} alt="Profile" className="profile-img"/>
                </button>
                {showMenu && (
                    <ProfileMenu
                        theme={theme}
                        toggleTheme={toggleTheme}
                        imageUrl={imageUrl}
                        fullName={fullName}
                        onUploadImage={updateImage}
                    />
                )}
            </div>
        </div>
    );
};

export default TopMenu;
