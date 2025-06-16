import SearchResultsDropdown from "./SearchResultsDropdown";
import {useEffect, useState} from "react";
import {useMailSearch} from "../../hooks/useMailSearch";
import './SearchBar.css'
import {getUserFromToken} from "../../../utils/tokenUtils";
import {useTheme} from "../../../utils/useTheme";

const SearchBar = () => {
    const user = getUserFromToken();
    const theme = useTheme();

    const [query, setQuery] = useState('');
    const {results, loading} = useMailSearch(user.id, query);


    const handleSelectMail = (mail) => {
        console.log("Mail selected:", mail);
        setQuery('');
        // TODO Navigate or show dialog of mail
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
        <div className="search-input-wrapper position-relative" style={{flexGrow: 1}}>
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