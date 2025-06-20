import './SearchResultsDropdown.css';
import {useOutsideClick} from "../../hooks/useOutsideClick";
import {useEffect, useRef} from "react";
import {formatDate} from "../../../utils/formatDate";
import useIsMobile from "../../../utils/useIsMobile";

const SearchResultsDropdown = ({theme, mails, loading, onSelect, onClose, highlightedIndex}) => {

    const dropdownRef = useRef(null);

    // Auto-close on outside click
    useOutsideClick(dropdownRef, onClose, true);

    // Auto-close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);


    const isMobile = useIsMobile()

    if (!mails.length && !loading)
        return null;

    return (
        <div ref={dropdownRef} className={`search-dropdown show ${theme === 'dark' ? 'dark-dropdown' : ''}`}>
            {loading && <div className="search-loading">Searching...</div>}
            {mails.map((mail, index) => (
                <div
                    key={mail.id}
                    className={`search-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                    onClick={() => onSelect(mail)}
                >
                    {isMobile && <div className="search-item-subject">{mail.from.fullName}</div>}
                    {!isMobile && <div className="search-item-subject">{mail.from.mail}</div>}
                    <div className="search-item-content">
                        <div className="search-item-subject">{mail.subject}</div>
                        <div className="search-item-body">{mail.body.slice(0, 50)}...</div>
                    </div>
                    <div className="search-item-date">{formatDate(mail.sentAt || mail.createdAt)}</div>
                </div>
            ))}
        </div>
    );
};

export default SearchResultsDropdown;
