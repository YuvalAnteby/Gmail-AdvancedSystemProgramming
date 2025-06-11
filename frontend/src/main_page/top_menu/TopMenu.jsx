import {useRef, useState} from "react";
import "./TopMenu.css";
import {useNavigate} from "react-router-dom";
import {useOutsideClick} from "../hooks/useOutsideClick";
import ProfileMenu from "./profile/ProfileMenu";
import SearchBar from "./search/SearchBar";
import {useProfile} from "../hooks/useProfile";

const TopMenu = ({theme, setTheme, userId}) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);

    const {imageUrl, fullName, updateImage} = useProfile(userId);

    const onLogoClick = () => {
        setShowMenu(false);
        navigate('/inbox', {state: {inboxType: 'incoming'}});
    };

    const onProfileClick = () => setShowMenu(prev => !prev);
    useOutsideClick(menuRef, () => setShowMenu(false), showMenu);

    return (
        <div className={`top-menu-wrapper ${theme}-top-menu d-flex align-items-center justify-content-between px-3`}>
            <button className="btn logo-btn d-flex align-items-center gap-2" onClick={onLogoClick}>
                <img src="/logo192.png" alt="icon" className="logo-img"/>
                <span className="logo-text">Mail ASP</span>
            </button>

            <div className="search-container d-flex align-items-center" style={{position: 'relative'}}>
                <SearchBar userId={userId} theme={theme}/>
            </div>

            <div className="position-relative" ref={menuRef}>
                <button onClick={onProfileClick} className="profile-btn">
                    <img src={imageUrl} alt="Profile" className="profile-img"/>
                </button>
                {showMenu && (
                    <ProfileMenu
                        theme={theme}
                        setTheme={setTheme}
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
