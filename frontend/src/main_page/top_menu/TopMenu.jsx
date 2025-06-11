import {useState} from "react";
import "./TopMenu.css";
import {useNavigate} from "react-router-dom";

const TopMenu = ({theme}) => {
    const imageUrl = ''; // TODO replace with dynamic logic
    const [query, setQuery] = useState('');

    const navigate = useNavigate(); //Hook to navigate to another page
    const handleLogoClick = () => {
        navigate('/inbox', {state: {inboxType: 'all'}});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleProfileClick = () => {};

    return (
        <div className={`top-menu-wrapper ${theme}-top-menu d-flex align-items-center justify-content-between px-3`}>
            {/* Logo */}
            <button className="btn logo-btn" onClick={handleLogoClick}>
                <img src="/logo192.png" alt="icon" className="logo-img"/>
            </button>

            {/* Search bar */}
            <form onSubmit={handleSubmit} className="search-bar d-flex align-items-center">
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
            <button onClick={handleProfileClick} className="profile-btn">
                <img
                    src={imageUrl || "/profile_default.png"}
                    alt="Profile"
                    className="profile-img"
                />
            </button>
        </div>
    );
};

export default TopMenu;
