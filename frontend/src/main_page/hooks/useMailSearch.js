import { useState, useEffect } from 'react';
import { searchMails } from '../../api/mailApi';

export const useMailSearch = (userId, query) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await searchMails(userId, query);
                setResults(res);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        }, 300); // debounce

        return () => clearTimeout(delayDebounce);
    }, [userId, query]);

    return { results, loading };
};
