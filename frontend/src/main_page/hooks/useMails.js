import { useState, useEffect, useCallback } from 'react';
import {getMailsByType} from "../../api/mailApi";
import {MAILS_PER_PAGE} from "../../utils/constants";

/**
 * Custom hook to fetch and refresh "mails" for a given userId and inboxType.
 *
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'} inboxType
 * @returns {{
 *   emails: Array,
 *   loading: boolean,
 *   error: Error|null,
 *   refreshMails: () => Promise<void>
 * }}
 */
export function useMails(inboxType) {
    const [emails, setEmails] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize refreshMails so it doesn’t get re-created on every render
    const refreshMails = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const {mails, total} = await getMailsByType(inboxType, page);
            setEmails(mails);
            setTotal(total);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [inboxType, page]);

    // Fetch initially, and whenever userId or inboxType changes
    useEffect(() => {
        refreshMails();
    }, [inboxType, refreshMails]);

    const hasNextPage = page * MAILS_PER_PAGE < total;
    const hasPrevPage = page > 1;
    // update the page to be the next one
    const goToNextPage = () => {
        if (hasNextPage)
            setPage(p => p + 1);
    }
    //update the page to be the previous one
    const goToPrevPage = () => {
        if (hasPrevPage)
            setPage(p => p - 1);
    }
    const resetPage = () => {
        setPage(1);
    }
    // Reset page to 1 when inboxType changes
    useEffect(() => {
        resetPage();
    }, [inboxType]);

    return {
        emails,
        total,
        page,
        hasNextPage,
        hasPrevPage,
        goToNextPage,
        goToPrevPage,
        loading,
        error,
        refreshMails
    };
}
