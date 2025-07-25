import SearchResultsDropdown from "./SearchResultsDropdown";
import {useEffect, useState} from "react";
import {useMailSearch} from "../../hooks/useMailSearch";
import './SearchBar.css'
import {getUserFromToken} from "../../../utils/tokenUtils";
import {useNavigate} from "react-router-dom";
import {markMailAsRead} from "../../../utils/mailUtils";

const SearchBar = ({theme, inboxType}) => {
    const user = getUserFromToken();

    const [query, setQuery] = useState('');
    const {results, loading} = useMailSearch(user.id, query);


    const navigate = useNavigate();
    const handleSelectMail = async (mail) => {
        setQuery('');
        await markMailAsRead(mail, undefined);
        navigate(`/mails/${mail.id}`, {state: {inboxType}});
    };

    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    // Reset highlight when results change
    useEffect(() => {
        setHighlightedIndex(results.length > 0 ? 0 : -1);
    }, [results]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!results.length) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % results.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
            } else if (e.key === "Enter") {
                if (highlightedIndex >= 0) {
                    handleSelectMail(results[highlightedIndex]);
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [results, highlightedIndex]);


    return (
        <div className="search-bar position-relative">
            <input
                type="text"
                className={`form-control search-input ${theme}`}
                placeholder="Search mails..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <SearchResultsDropdown
                theme={theme}
                mails={results}
                loading={loading}
                onSelect={handleSelectMail}
                onClose={() => setQuery('')}
                highlightedIndex={highlightedIndex}
            />
        </div>
    );
}

export default SearchBar;